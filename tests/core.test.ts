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

  // Movement fullnodes carry the code as `ENAME(0xHEX)` and stop the location at the
  // module, where Aptos writes `abort code N` and names the function. Both shapes reach
  // the same call sites, so both are parsed. Observed live while simulating a
  // below-minimum curator deposit.
  it("extracts move abort details from the movement ENAME(0xHEX) shape", async () => {
    const originalError = Object.assign(
      new Error(
        "Transaction Executor encountered VM error: Move abort in 0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f::vault: EDEPOSIT_BELOW_MIN(0x65): Deposit amount is below the minimum required."
      ),
      { error_code: "vm_error", vm_error_code: 10 }
    );
    const client = {
      view: jest.fn(async () => {
        throw originalError;
      }),
    };

    const rejection = await callViewFunction(client, {
      moduleAddress: "0x4f65dd9785f2ffb51818432646b0994ab43b8a9b602a52f989362883eae7dc17",
      moduleName: "router",
      functionName: "deposit_fa",
    }).then(
      () => {
        throw new Error("expected the view call to reject");
      },
      (error: unknown) => error as CanopyError
    );

    expect(rejection).toMatchObject({
      code: CanopyErrorCode.MoveAbort,
      cause: originalError,
      details: {
        // The payload's own function id still reaches callers here, which is why
        // `moveAbort` can omit a function it cannot honestly name.
        function:
          "0x4f65dd9785f2ffb51818432646b0994ab43b8a9b602a52f989362883eae7dc17::router::deposit_fa",
        moveAbort: {
          abortCode: 101,
          abortMessage: "Deposit amount is below the minimum required.",
          abortName: "EDEPOSIT_BELOW_MIN",
          errorCode: "vm_error",
          module:
            "0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f::vault",
          moduleName: "vault",
          vmErrorCode: 10,
        },
      },
    });

    // The abort happened in `vault`; the caller invoked `router::deposit_fa`. Stitching
    // the two would name a function that does not exist, so neither field is reported.
    const moveAbort = (rejection.details as { moveAbort: Record<string, unknown> }).moveAbort;
    expect(moveAbort).not.toHaveProperty("function");
    expect(moveAbort).not.toHaveProperty("functionName");
  });

  // Captured verbatim from movement-testnet `/v1/view`, calling
  // `partner_registry::payout_address` with an unregistered id. This endpoint shares no
  // wording with the simulation shape above: `ABORTED` instead of `Move abort in`, the code
  // in `sub_status`, and no name or description at all. `\babort\b` does not even match
  // `ABORTED` — there is no word boundary before `ED` — so this was discarded outright.
  it("extracts move abort details from the /v1/view VMError shape", () => {
    const details = extractMoveAbortDetails({
      data: {
        message:
          "Failed to execute function: VMError { major_status: ABORTED, sub_status: Some(2), " +
          'message: Some("0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f::partner_registry::payout_address at offset 17"), ' +
          "exec_state: Some(ExecutionState { stack_trace: [] }), location: Module(ModuleId { " +
          "address: defc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f, " +
          'name: Identifier("partner_registry") }), indices: [], offsets: [(FunctionDefinitionIndex(2), 17)] }',
        error_code: "invalid_input",
        vm_error_code: null,
      },
    });

    expect(details).toMatchObject({
      abortCode: 2,
      errorCode: "invalid_input",
      // Unlike simulation, the view endpoint reports a complete function id.
      function:
        "0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f::partner_registry::payout_address",
      functionName: "payout_address",
      moduleName: "partner_registry",
    });
    // The chain sends no name or description on this path, and the table has no entry for
    // partner_registry — reporting a guess would be worse than reporting the bare code.
    expect(details).not.toHaveProperty("abortName");
    expect(details).not.toHaveProperty("abortMessage");
  });

  // Sharing a prefix with a router entry function is not evidence of sharing its error.
  // This view is not the router's `deposit_fa`, and code 1 here means whatever
  // `vault::deposit_preview` says it means.
  it("does not name an unknown abort from a function-name prefix", () => {
    const details = extractMoveAbortDetails({
      data: {
        message:
          "Failed to execute function: VMError { major_status: ABORTED, sub_status: Some(1), " +
          'message: Some("0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f::vault::deposit_preview at offset 3") }',
      },
    });

    expect(details).toMatchObject({ abortCode: 1, functionName: "deposit_preview" });
    expect(details).not.toHaveProperty("abortName");
    expect(details).not.toHaveProperty("abortMessage");
  });

  // A missing object reports `ABORTED` with no major_status and no sub_status. It clears the
  // `abort(ed)?` guard, so only the `major_status: ABORTED` gate keeps it from being read as
  // a Move abort with whatever number the loose bare-code pattern finds first.
  it("does not treat a PartialVMError without a sub_status as a move abort", () => {
    expect(
      extractMoveAbortDetails({
        data: { message: "PartialVMError with status ABORTED", error_code: "invalid_input" },
      })
    ).toBeUndefined();
  });

  it("does not borrow a function name from a same-named module at another address", () => {
    const details = extractMoveAbortDetails(
      new Error("Move abort in 0xa::vault: EPAUSED(0x1): The vault is paused."),
      "0xb::vault::deposit"
    );

    expect(details).toMatchObject({
      abortCode: 1,
      abortName: "EPAUSED",
      module: "0x000000000000000000000000000000000000000000000000000000000000000a::vault",
      moduleName: "vault",
    });
    // `vault` at 0xa and `vault` at 0xb are different modules that share a name.
    expect(details).not.toHaveProperty("function");
    expect(details).not.toHaveProperty("functionName");
  });

  it("borrows the function name when the fallback resolves to the same module", () => {
    expect(
      extractMoveAbortDetails(
        new Error("Move abort in 0xa::vault: EPAUSED(0x1): The vault is paused."),
        "0x000000000000000000000000000000000000000000000000000000000000000a::vault::deposit"
      )
    ).toMatchObject({
      abortCode: 1,
      abortName: "EPAUSED",
      function:
        "0x000000000000000000000000000000000000000000000000000000000000000a::vault::deposit",
      functionName: "deposit",
      module: "0x000000000000000000000000000000000000000000000000000000000000000a::vault",
    });
  });

  // The chain knows its own error constants; KNOWN_MOVE_ABORTS is a stand-in for chains
  // that send none. Growing that table is not the fix when the chain already answered.
  it("prefers the chain-reported abort name over the known-abort table", () => {
    expect(
      extractMoveAbortDetails(
        new Error("Move abort in 0x1::vault::deposit: EDEPOSIT_BELOW_MIN(117): Too small.")
      )
    ).toMatchObject({
      abortCode: 117,
      abortMessage: "Too small.",
      abortName: "EDEPOSIT_BELOW_MIN",
      functionName: "deposit",
    });
  });

  it("reads a named abort that carries no description", () => {
    const details = extractMoveAbortDetails(
      new Error("Move abort in 0xa::queue: EREQUEST_NOT_FOUND(0x7)")
    );

    expect(details).toMatchObject({ abortCode: 7, abortName: "EREQUEST_NOT_FOUND" });
    expect(details).not.toHaveProperty("abortMessage");
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
