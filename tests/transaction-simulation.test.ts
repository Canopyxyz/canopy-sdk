import { jest } from "@jest/globals";
import { CanopyErrorCode, isCanopyError } from "../packages/core/src";
import { CanopySdk } from "../packages/sdk/src";

interface MockAptosClient {
  signAndSubmitTransaction: jest.MockedFunction<(input: unknown) => Promise<unknown>>;
  transaction: {
    build: {
      simple: jest.MockedFunction<(input: unknown) => Promise<unknown>>;
    };
    simulate: {
      simple: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
    };
  };
  view: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
  waitForTransaction: jest.MockedFunction<(input: unknown) => Promise<unknown>>;
}

function createClient(): MockAptosClient {
  return {
    signAndSubmitTransaction: jest.fn(),
    transaction: {
      build: {
        simple: jest.fn(async (input: unknown) => input),
      },
      simulate: {
        simple: jest.fn(),
      },
    },
    view: jest.fn(async () => []),
    waitForTransaction: jest.fn(),
  };
}

describe("Transaction simulation", () => {
  it("simulates a payload and returns the user transaction response", async () => {
    const client = createClient();
    client.transaction.simulate.simple.mockResolvedValue([
      {
        type: "user_transaction",
        version: "1",
        hash: "0xabc",
        state_change_hash: "0x1",
        event_root_hash: "0x2",
        state_checkpoint_hash: null,
        gas_used: "7",
        success: true,
        vm_status: "Executed successfully",
        accumulator_root_hash: "0x3",
        changes: [],
        sender: "0x1",
        sequence_number: "0",
        max_gas_amount: "1000",
        gas_unit_price: "1",
        expiration_timestamp_secs: "999",
        payload: {} as never,
        signature: {} as never,
        events: [],
        timestamp: "123",
      },
    ]);

    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const result = await sdk.simulateTransaction({
      sender: "0x1",
      payload: {
        function:
          "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin",
        typeArguments: [
          "0x1::aptos_coin::AptosCoin",
          "0x1::aptos_coin::AptosCoin",
        ],
        functionArguments: ["0x1", [], [], "10", undefined],
      },
      transactionOptions: { maxGasAmount: 1234 },
      simulationOptions: { estimateGasUnitPrice: true },
    });

    expect(client.transaction.build.simple).toHaveBeenCalledWith({
      sender: "0x1",
      data: {
        function:
          "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin",
        typeArguments: [
          "0x1::aptos_coin::AptosCoin",
          "0x1::aptos_coin::AptosCoin",
        ],
        functionArguments: ["0x1", [], [], "10", undefined],
      },
      options: { maxGasAmount: 1234 },
    });
    expect(client.transaction.simulate.simple).toHaveBeenCalledWith({
      transaction: {
        sender: "0x1",
        data: {
          function:
            "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin",
          typeArguments: [
            "0x1::aptos_coin::AptosCoin",
            "0x1::aptos_coin::AptosCoin",
          ],
          functionArguments: ["0x1", [], [], "10", undefined],
        },
        options: { maxGasAmount: 1234 },
      },
      options: { estimateGasUnitPrice: true },
    });
    expect(result).toMatchObject({
      success: true,
      vm_status: "Executed successfully",
      hash: "0xabc",
    });
  });

  it("turns unsuccessful simulation responses into structured move abort errors", async () => {
    const client = createClient();
    client.transaction.simulate.simple.mockResolvedValue([
      {
        success: false,
        vm_status:
          "Move abort in 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::deposit: abort code 117",
      },
    ]);

    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(
      sdk.simulateTransaction({
        sender: "0x1",
        payload: {
          function:
            "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::deposit",
          typeArguments: [],
          functionArguments: ["0x1", "10"],
        },
      })
    ).rejects.toMatchObject({
      code: CanopyErrorCode.MoveAbort,
      details: {
        moveAbort: {
          abortCode: 117,
          abortName: "EVAULT_PAUSED",
        },
      },
    });
  });

  it("turns thrown simulation errors into structured move abort errors when possible", async () => {
    const client = createClient();
    client.transaction.simulate.simple.mockRejectedValue({
      message:
        "Move abort in 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::withdraw: abort code 129",
    });

    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    try {
      await sdk.simulateTransaction({
        sender: "0x1",
        payload: {
          function:
            "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::withdraw",
          typeArguments: [],
          functionArguments: ["0x1", "10"],
        },
      });
    } catch (error) {
      expect(isCanopyError(error)).toBe(true);
      expect(error).toMatchObject({
        code: CanopyErrorCode.MoveAbort,
        details: {
          moveAbort: {
            abortCode: 129,
            abortName: "ETOO_MUCH_LOSS",
          },
        },
      });
    }
  });

  it("wraps sign-and-submit aborts into structured move abort errors", async () => {
    const client = createClient();
    client.signAndSubmitTransaction.mockRejectedValue({
      message:
        "Move abort in 0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin: abort code 1",
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const signer = { accountAddress: "0x1" };

    await expect(
      sdk.signAndSubmitTransaction({
        signer: signer as never,
        payload: {
          function:
            "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin",
          typeArguments: [],
          functionArguments: ["0x1", [], [], "10", undefined],
        },
      })
    ).rejects.toMatchObject({
      code: CanopyErrorCode.MoveAbort,
      details: {
        moveAbort: {
          abortCode: 1,
          abortName: "ENOT_ENOUGH_OUT_SHARES",
          functionName: "deposit_coin",
        },
      },
    });
  });

  it("wraps wait-for-transaction aborts into structured move abort errors", async () => {
    const client = createClient();
    client.signAndSubmitTransaction.mockResolvedValue({ hash: "0xabc" });
    client.waitForTransaction.mockRejectedValue({
      message:
        "Move abort in 0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::router::withdraw: abort code 4",
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const signer = { accountAddress: "0x1" };

    await expect(
      sdk.signSubmitAndWaitForTransaction({
        signer: signer as never,
        payload: {
          function:
            "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::router::withdraw",
          typeArguments: [],
          functionArguments: ["0x1", "10", "0", "0"],
        },
      })
    ).rejects.toMatchObject({
      code: CanopyErrorCode.MoveAbort,
      details: {
        moveAbort: {
          abortCode: 4,
          abortName: "ESLIPPAGE_ASSETS_OUT",
          functionName: "withdraw",
        },
      },
    });
  });
});

/**
 * These use the same synthetic `…::module::function: abort code N` strings as the
 * suites above. Be aware that movement-testnet actually emits
 * `Move abort in 0xaddr::module: ENAME(0xHEX): message` — no function name, hex
 * code — which `packages/core` does not parse, so none of this mapping fires
 * against the live chain for any client. See `packages/sdk/src/curator/aborts.ts`.
 * The cases below pin the resolver's contract, not live behaviour.
 */
describe("curator abort resolution", () => {
  const CURATOR_VAULT = "0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f";
  const CURATOR_ROUTER = "0x4f65dd9785f2ffb51818432646b0994ab43b8a9b602a52f989362883eae7dc17";
  const CANOPY_VAULT = "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a";

  async function simulateAbort(
    chain: "movement-testnet" | "aptos-testnet",
    functionId: `${string}::${string}::${string}`,
    abortCode: number
  ) {
    const client = createClient();
    client.transaction.simulate.simple.mockResolvedValue([
      {
        success: false,
        vm_status: `Move abort in ${functionId}: abort code ${abortCode}`,
      },
    ]);
    const sdk = new CanopySdk(client as never, { chain });

    try {
      await sdk.simulateTransaction({
        sender: "0x1",
        payload: { function: functionId, typeArguments: [], functionArguments: [] },
      });
    } catch (error) {
      if (!isCanopyError(error)) {
        throw error;
      }

      return (error.details as { moveAbort: Record<string, unknown> }).moveAbort;
    }

    throw new Error("expected a Move abort");
  }

  it("names curator router aborts from the curator table", async () => {
    await expect(
      simulateAbort("movement-testnet", `${CURATOR_ROUTER}::router::deposit_with_partner`, 4)
    ).resolves.toMatchObject({ abortCode: 4, abortName: "EINVALID_PARTNER" });
  });

  it("beats the deposit_*:1 heuristic for a curator abort", async () => {
    // errors.ts falls back to `functionName.startsWith("deposit_") && code === 1 ->
    // ENOT_ENOUGH_OUT_SHARES`, which is Canopy's meaning. Curator code 1 is
    // E_UNSUPPORTED_ROUTE, and the address-scoped resolver has to win.
    await expect(
      simulateAbort("movement-testnet", `${CURATOR_ROUTER}::router::deposit_with_partner`, 1)
    ).resolves.toMatchObject({ abortCode: 1, abortName: "E_UNSUPPORTED_ROUTE" });
  });

  it("names the vault-raised min-assets-out abort under its raising function", async () => {
    // Router code 3 is deallocate-only; the depositor-facing min-assets failure is
    // vault code 65 raised inside vault::instant_redeem.
    await expect(
      simulateAbort("movement-testnet", `${CURATOR_VAULT}::vault::instant_redeem`, 65)
    ).resolves.toMatchObject({ abortCode: 65, abortName: "EMIN_ASSETS_OUT_NOT_MET" });
  });

  it("reports an unmapped curator code with no name instead of borrowing Canopy's", async () => {
    // This is the tri-state guard. `vault::deposit:113` is Canopy's
    // EINVALID_DEPOSIT_AMOUNT but curator's EAUTO_ALLOCATE_NOT_SUPPORTED, and it is
    // deliberately absent from CURATOR_ABORTS. The resolver must claim the address
    // and return "unknown", suppressing the shared map and its heuristics, rather
    // than falling through to a confidently wrong label.
    const moveAbort = await simulateAbort(
      "movement-testnet",
      `${CURATOR_VAULT}::vault::deposit`,
      113
    );

    expect(moveAbort).toMatchObject({ abortCode: 113, moduleName: "vault" });
    expect(moveAbort.abortName).toBeUndefined();
    expect(moveAbort.abortMessage).toBeUndefined();
    expect(moveAbort.rawMessage).toContain("abort code 113");
  });

  it("leaves aborts from other packages on the shared lookup", async () => {
    // Same module::function:code as the case above, different package address. On a
    // chain without a curator deployment there is no resolver at all; on a curator
    // chain the resolver must decline addresses it does not own.
    await expect(
      simulateAbort("aptos-testnet", `${CANOPY_VAULT}::vault::deposit`, 113)
    ).resolves.toMatchObject({ abortCode: 113, abortName: "EINVALID_DEPOSIT_AMOUNT" });

    await expect(
      simulateAbort("movement-testnet", `${CANOPY_VAULT}::vault::deposit`, 113)
    ).resolves.toMatchObject({ abortCode: 113, abortName: "EINVALID_DEPOSIT_AMOUNT" });
  });
});
