import { jest } from "@jest/globals";
import { readMoveU8, readMoveU64 } from "../packages/sdk/src/internal/move-readers";
import {
  callSingleViewResult,
  callViewFunction,
  CanopyError,
  CanopyErrorCode,
  extractMoveAbortDetails,
  entryFunctionPayload,
  formatUnits,
  isCanopyError,
  moveUintArgument,
  normalizeMoveAddress,
  normalizeMoveTypeTag,
  parseOptionalMoveUint,
  parseOptionalU128,
  parseOptionalU64,
  parseUnits,
  parseU128,
  parseU64,
  readViewResult,
  sameMoveAddress,
  viewFunctionPayload,
  viewFunctionRequest,
} from "../packages/core/src";

describe("core helpers", () => {
  it("normalizes short Move addresses", () => {
    expect(normalizeMoveAddress("0x1")).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    );
    expect(
      sameMoveAddress(
        "0x1",
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      )
    ).toBe(true);
  });

  it("normalizes Move type tags", () => {
    expect(normalizeMoveTypeTag("@0x1::aptos_coin::AptosCoin")).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001::aptos_coin::AptosCoin"
    );
  });

  it("validates u64 and u128 ranges", () => {
    expect(parseU64("18446744073709551615")).toBe(18446744073709551615n);
    expect(() => parseU64("18446744073709551616")).toThrow("u64");
    expect(parseU128((1n << 128n) - 1n)).toBe((1n << 128n) - 1n);
    expect(() => parseU128(1n << 128n)).toThrow("u128");
    expect(parseOptionalU64(undefined)).toBeUndefined();
    expect(parseOptionalU64(" none ")).toBeUndefined();
    expect(parseOptionalU128("null")).toBeUndefined();
    expect(parseOptionalMoveUint("", 64)).toBeUndefined();
    expect(parseOptionalU64("42")).toBe(42n);
    expect(parseOptionalU128(42n)).toBe(42n);
  });

  it("parses and formats decimal token amounts", () => {
    expect(parseUnits("1.23", { decimals: 6 })).toBe(1230000n);
    expect(parseUnits("0.000001", { decimals: 6 })).toBe(1n);
    expect(() => parseUnits("0.0000001", { decimals: 6 })).toThrow(
      "decimal places"
    );
    expect(formatUnits(1230000n, { decimals: 6 })).toBe("1.23");
    expect(formatUnits(1230000n, { decimals: 6, trimTrailingZeros: false })).toBe(
      "1.230000"
    );
  });

  it("rejects unsafe number scalars in Move readers", async () => {
    const { readMoveU64 } = await import("../packages/sdk/src/internal/move-readers");

    expect(() => readMoveU64(42)).toThrow("Expected Move scalar");
  });

  it("builds entry and view payloads", () => {
    const input = {
      moduleAddress: "0x1",
      moduleName: "coin",
      functionName: "balance",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: ["0x2"],
    };

    expect(entryFunctionPayload(input).function).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001::coin::balance"
    );
    expect(viewFunctionPayload(input).functionArguments).toEqual(["0x2"]);
    expect(moveUintArgument("42")).toBe("42");
  });

  it("builds and executes view requests", async () => {
    const input = {
      moduleAddress: "0x1",
      moduleName: "coin",
      functionName: "balance",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: ["0x2"],
    };
    const client = {
      view: jest.fn(async () => ["123"]),
    };

    expect(viewFunctionRequest(input).payload.function).toBe(
      "0x0000000000000000000000000000000000000000000000000000000000000001::coin::balance"
    );
    await expect(callViewFunction(client, input)).resolves.toEqual(["123"]);
    await expect(callSingleViewResult<string>(client, input)).resolves.toBe("123");
    expect(readViewResult<string>(["a", "b"], 1)).toBe("b");
  });

  it("wraps view errors in a core error", async () => {
    const input = {
      moduleAddress: "0x1",
      moduleName: "coin",
      functionName: "balance",
    };
    const originalError = new Error("network down");
    const client = {
      view: jest.fn(async () => {
        throw originalError;
      }),
    };

    await expect(callViewFunction(client, input)).rejects.toMatchObject({
      code: CanopyErrorCode.ViewCallFailed,
      cause: originalError,
    });
    expect(() => readViewResult([], 0)).toThrow(CanopyError);

    const error = new CanopyError("bad input", CanopyErrorCode.InvalidInput, {
      label: "amount",
    });
    expect(isCanopyError(error)).toBe(true);
    expect(error.toJSON()).toEqual({
      name: "CanopyError",
      message: "bad input",
      code: CanopyErrorCode.InvalidInput,
      details: { label: "amount" },
    });
  });

  it("stores cause using the standard non-enumerable error property", () => {
    const originalError = new Error("bad input");
    const error = new CanopyError(
      "wrapped",
      CanopyErrorCode.InvalidInput,
      undefined,
      { cause: originalError }
    );

    expect(error.cause).toBe(originalError);
    expect(Object.prototype.propertyIsEnumerable.call(error, "cause")).toBe(false);
    expect(error.toJSON()).toEqual({
      name: "CanopyError",
      message: "wrapped",
      code: CanopyErrorCode.InvalidInput,
    });
  });

  it("surfaces structured move abort details from view failures", async () => {
    const input = {
      moduleAddress: "0x1",
      moduleName: "vault",
      functionName: "deposit",
    };
    const originalError = Object.assign(
      new Error(
        "Transaction Executor encountered VM error: Move abort in 0x1::vault::deposit: abort code 117"
      ),
      {
        error_code: "vm_error",
        vm_error_code: 10,
      }
    );
    const client = {
      view: jest.fn(async () => {
        throw originalError;
      }),
    };

    await expect(callViewFunction(client, input)).rejects.toMatchObject({
      code: CanopyErrorCode.MoveAbort,
      cause: originalError,
      details: {
        function:
          "0x0000000000000000000000000000000000000000000000000000000000000001::vault::deposit",
        moveAbort: {
          abortCode: 117,
          abortName: "EVAULT_PAUSED",
          functionName: "deposit",
          module:
            "0x0000000000000000000000000000000000000000000000000000000000000001::vault",
          moduleName: "vault",
          vmErrorCode: 10,
        },
      },
    });
  });

  it("extracts move abort details from nested API-style errors", () => {
    expect(
      extractMoveAbortDetails({
        error_code: "vm_error",
        vm_error_code: 42,
        data: {
          message:
            "Transaction failed: Move abort in 0xabc::router::withdraw_coin: abort code 2",
        },
      })
    ).toMatchObject({
      abortCode: 2,
      abortName: "ENOT_ENOUGH_OUT_AMOUNT",
      errorCode: "vm_error",
      function:
        "0x0000000000000000000000000000000000000000000000000000000000000abc::router::withdraw_coin",
      functionName: "withdraw_coin",
      module: "0x0000000000000000000000000000000000000000000000000000000000000abc::router",
      moduleName: "router",
      vmErrorCode: 42,
    });
  });
});

describe("move readers against real fullnode shapes", () => {
  it("accepts u8 fields as JSON numbers, which is how fullnodes send them", () => {
    // Fullnodes serialize u8/u16/u32 as numbers and u64+ as strings. Rejecting
    // numbers broke canopy.getVault / listVaults and the Meridian batch views on
    // every chain; the client fixtures hid it by supplying decimals as "8".
    expect(readMoveU8(8)).toBe(8);
    expect(readMoveU8("8")).toBe(8);
    expect(readMoveU8(0)).toBe(0);
    expect(readMoveU8(255)).toBe(255);
  });

  it("still rejects numbers for the wide widths, where they would lose precision", () => {
    // This is the intent behind the existing "rejects unsafe number scalars" case:
    // a u64 arriving as a JS number means precision was already lost upstream.
    expect(() => readMoveU64(42)).toThrow("Expected Move scalar");
    expect(readMoveU64("12345678901234567890")).toBe(12345678901234567890n);
  });

  it("rejects numbers that cannot be an exact Move u8", () => {
    expect(() => readMoveU8(8.5)).toThrow("safe integer");
    expect(() => readMoveU8(-1)).toThrow("safe integer");
    expect(() => readMoveU8(Number.MAX_VALUE)).toThrow("safe integer");
    expect(() => readMoveU8(256)).toThrow("Expected Move u8");
  });
});
