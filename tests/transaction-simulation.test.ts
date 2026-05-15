import { jest } from "@jest/globals";
import { CanopyErrorCode, isCanopyError } from "../packages/core/src";
import { CanopySdk } from "../packages/sdk/src";

interface MockAptosClient {
  transaction: {
    build: {
      simple: jest.MockedFunction<(input: unknown) => Promise<unknown>>;
    };
    simulate: {
      simple: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
    };
  };
  view: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
}

function createClient(): MockAptosClient {
  return {
    transaction: {
      build: {
        simple: jest.fn(async (input: unknown) => input),
      },
      simulate: {
        simple: jest.fn(),
      },
    },
    view: jest.fn(async () => []),
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
});
