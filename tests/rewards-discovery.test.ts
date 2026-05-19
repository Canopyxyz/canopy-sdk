import { jest } from "@jest/globals";
import { CanopySdk } from "../packages/sdk/src";

interface MockViewClient {
  view: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
}

function createMovementMock(
  responses: Record<string, unknown[] | ((args: unknown[]) => unknown[])>
): MockViewClient {
  return {
    view: jest.fn(async (input: unknown) => {
      const payload = (input as { payload: { function: string; functionArguments?: unknown[] } }).payload;
      const response = responses[payload.function];

      if (!response) {
        throw new Error(`Missing mock response for ${payload.function}`);
      }

      return typeof response === "function"
        ? response(payload.functionArguments ?? [])
        : response;
    }),
  };
}

describe("RewardsDiscoveryClient", () => {
  it("is only constructed on chains with rewards support or an explicit endpoint", () => {
    const movementSdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-mainnet",
    });
    const movementTestnetSdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-testnet",
    });
    const overriddenSdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-testnet",
      offchain: {
        sentioEndpoint: "https://example.com/graphql",
      },
    });

    expect(movementSdk.data.rewardsDiscovery).toBeDefined();
    expect(movementTestnetSdk.data.rewardsDiscovery).toBeUndefined();
    expect(overriddenSdk.data.rewardsDiscovery).toBeDefined();
  });

  it("adds sentio pool discovery support", async () => {
    const originalFetch = global.fetch;
    const client = createMovementMock({
      "0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::is_user_subscribed":
        [false],
    });

    global.fetch = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));

      if (body.operationName === "GetMRStakingPoolsByToken") {
        return {
          ok: true,
          json: async () => ({
            data: {
              mrstakingPools: [
                {
                  id: "0x123",
                  creator: "0x456",
                  staking_token: "0x789",
                  reward_tokens: ["0xabc"],
                  reward_datas: [],
                  subscriber_count: 1,
                  total_subscribed: "50",
                  created_at: "2025-01-01T00:00:00Z",
                },
              ],
            },
          }),
        } as Response;
      }

      throw new Error(`Unexpected fetch ${JSON.stringify(body)}`);
    }) as typeof fetch;

    const sdk = new CanopySdk(client as never, {
      chain: "movement-mainnet",
      offchain: {
        sentioApiKey: "test-key",
      },
    });

    await expect(
      sdk.data.rewardsDiscovery?.findPoolAddressesByStakingAsset("0x789")
    ).resolves.toEqual([
      "0x0000000000000000000000000000000000000000000000000000000000000123",
    ]);

    await expect(
      sdk.rewards?.buildStakeVaultSharesPayload({
        stakingAsset: "0x789",
        amount: 11n,
        userAddress: "0x111",
      })
    ).resolves.toMatchObject({
      function:
        "0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::router::stake_and_subscribe_fa",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000789",
        "11",
        ["0x0000000000000000000000000000000000000000000000000000000000000123"],
      ],
      abi: expect.any(Object),
    });

    global.fetch = originalFetch;
  });

  it("exposes rewards discovery status including cache bounds", () => {
    const movementSdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-mainnet",
      offchain: {
        cacheMaxEntries: 7,
      },
    });
    const aptosTestnetSdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "aptos-testnet",
    });

    expect(movementSdk.data.rewardsDiscovery?.getStatus()).toMatchObject({
      chain: "movement-mainnet",
      endpoint:
        "https://api.sentio.xyz/v1/graphql/solo-labs/canopy-multi-rewards-movement",
      endpointConfigured: true,
      cacheEntries: 0,
      cacheMaxEntries: 7,
    });

    expect(aptosTestnetSdk.data.rewardsDiscovery?.getStatus()).toEqual({
      chain: "aptos-testnet",
      endpoint: null,
      endpointConfigured: false,
      cacheEntries: 0,
      cacheMaxEntries: 32,
    });
  });

  it("returns no pool addresses when sentio returns no match", async () => {
    const originalFetch = global.fetch;
    const client = createMovementMock({});

    global.fetch = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));

      if (body.operationName === "GetMRStakingPoolsByToken") {
        return {
          ok: true,
          json: async () => ({
            data: {
              mrstakingPools: [],
            },
          }),
        } as Response;
      }

      throw new Error(`Unexpected fetch ${JSON.stringify(body)}`);
    }) as typeof fetch;

    const sdk = new CanopySdk(client as never, {
      chain: "movement-mainnet",
    });

    await expect(
      sdk.data.rewardsDiscovery?.resolvePoolAddresses({
        stakingAsset: "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
      })
    ).resolves.toEqual([]);

    await expect(
      sdk.rewards?.buildStakeVaultSharesPayload({
        stakingAsset: "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
        amount: 11n,
        userAddress: "0x111",
      })
    ).rejects.toMatchObject({
      code: "TRANSACTION_BUILD_FAILED",
      details: {
        stakingAsset:
          "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
      },
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    global.fetch = originalFetch;
  });

  it("surfaces sentio HTTP failures directly", async () => {
    const originalFetch = global.fetch;

    global.fetch = jest.fn(async () => {
      return {
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response;
    }) as typeof fetch;

    const sdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-mainnet",
    });

    await expect(
      sdk.data.rewardsDiscovery?.resolvePoolAddresses({
        stakingAsset: "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
      })
    ).rejects.toMatchObject({
      code: "NETWORK_ERROR",
      details: expect.objectContaining({
        reason: "http",
        status: 404,
      }),
    });

    global.fetch = originalFetch;
  });

  it("does not use the movement sentio endpoint as a default for aptos-testnet", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn() as typeof fetch;

    const sdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "aptos-testnet",
    });

    await expect(
      sdk.data.rewardsDiscovery?.resolvePoolAddresses({
        stakingAsset: "0x789",
      })
    ).rejects.toMatchObject({
      code: "INVALID_DEPLOYMENT",
      details: {
        chain: "aptos-testnet",
        endpointConfigured: false,
      },
    });

    expect(global.fetch).not.toHaveBeenCalled();
    global.fetch = originalFetch;
  });

  it("bounds the rewards discovery cache", async () => {
    const originalFetch = global.fetch;

    global.fetch = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      const stakingToken = String(body.variables?.stakingToken ?? "");
      return {
        ok: true,
        json: async () => ({
          data: {
            mrstakingPools: [
              {
                id: `0x${stakingToken.replace(/^0x/, "").padStart(64, "1")}`,
                creator: "0x456",
                staking_token: stakingToken,
                reward_tokens: ["0xabc"],
                reward_datas: [],
                subscriber_count: 1,
                total_subscribed: "50",
                created_at: "2025-01-01T00:00:00Z",
              },
            ],
          },
        }),
      } as Response;
    }) as typeof fetch;

    const sdk = new CanopySdk(createMovementMock({}) as never, {
      chain: "movement-mainnet",
      offchain: {
        cacheMaxEntries: 1,
      },
    });
    const discovery = sdk.data.rewardsDiscovery;
    if (!discovery) {
      throw new Error("expected rewardsDiscovery to be available");
    }

    await discovery.findPoolAddressesByStakingAsset("0x1");
    expect(discovery.getStatus().cacheEntries).toBe(1);

    await discovery.findPoolAddressesByStakingAsset("0x2");
    expect(discovery.getStatus().cacheEntries).toBe(1);

    global.fetch = originalFetch;
  });
});
