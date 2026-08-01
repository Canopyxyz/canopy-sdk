import { jest } from "@jest/globals";
import {
  CanopySdk,
  createCanopySdk,
  findFungibleAssetDeposit,
  getContract,
  getCanopyStrategyContract,
  requireContract,
  movementTestnetMovePositionConfig,
} from "../packages/sdk/src";

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

describe("CanopySdk", () => {
  it("composes protocol modules from deployment features", () => {
    const movementClient = createMovementMock({});
    const movementSdk = new CanopySdk(movementClient as never, {
      chain: "movement-mainnet",
    });

    expect(movementSdk.canopy).toBeDefined();
    expect(movementSdk.rewards).toBeDefined();
    expect(movementSdk.alm.meridian).toBeDefined();
    expect(movementSdk.data.rewardsDiscovery).toBeDefined();

    const aptosMainnetClient = createMovementMock({});
    const aptosMainnetSdk = createCanopySdk(aptosMainnetClient as never, {
      chain: "aptos-mainnet",
    });

    expect(aptosMainnetSdk.canopy).toBeUndefined();
    expect(aptosMainnetSdk.rewards).toBeUndefined();
    expect(aptosMainnetSdk.alm.meridian).toBeDefined();
    expect(aptosMainnetSdk.data.rewardsDiscovery).toBeUndefined();

    const aptosTestnetClient = createMovementMock({});
    const aptosTestnetSdk = createCanopySdk(aptosTestnetClient as never, {
      chain: "aptos-testnet",
    });

    expect(aptosTestnetSdk.canopy).toBeDefined();
    expect(aptosTestnetSdk.rewards).toBeDefined();
    expect(aptosTestnetSdk.alm.meridian).toBeUndefined();
    expect(aptosTestnetSdk.data.rewardsDiscovery).toBeDefined();

    const movementTestnetClient = createMovementMock({});
    const movementTestnetSdk = createCanopySdk(movementTestnetClient as never, {
      chain: "movement-testnet",
    });

    expect(movementTestnetSdk.canopy).toBeUndefined();
    expect(movementTestnetSdk.rewards).toBeUndefined();
    expect(movementTestnetSdk.alm.meridian).toBeUndefined();
    expect(movementTestnetSdk.data.rewardsDiscovery).toBeUndefined();
  });

  it("exposes nullable and required resolved contract helpers", () => {
    expect(getContract("movement-testnet", "canopy.router")).toBeNull();
    expect(requireContract("aptos-testnet", "canopy.protocol")).toMatchObject({
      id: "canopy.protocol",
      chain: "aptos-testnet",
      address: "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a",
      moduleName: "protocol",
    });
    expect(requireContract("aptos-mainnet", "meridian.vault")).toMatchObject({
      id: "meridian.vault",
      chain: "aptos-mainnet",
      address: "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54",
      moduleName: "ichi_vault_thala",
    });
    expect(getCanopyStrategyContract("movement-mainnet", "layerbank")).toMatchObject({
      id: "canopy.strategy.layerbankSimple",
      chain: "movement-mainnet",
    });
  });

  it("finds user fungible-asset deposits from transaction results", () => {
    expect(
      findFungibleAssetDeposit(
        {
          events: [
            {
              type: "0x1::fungible_asset::Deposit",
              data: {
                store: "0x777",
                amount: "1234",
              },
            },
          ],
          changes: [
            {
              address:
                "0x0000000000000000000000000000000000000000000000000000000000000777",
              data: {
                type: "0x1::object::ObjectCore",
                data: {
                  owner:
                    "0x0000000000000000000000000000000000000000000000000000000000000abc",
                },
              },
            },
            {
              address:
                "0x0000000000000000000000000000000000000000000000000000000000000777",
              data: {
                type: "0x1::fungible_asset::FungibleStore",
                data: {
                  metadata: {
                    inner:
                      "0x0000000000000000000000000000000000000000000000000000000000000123",
                  },
                },
              },
            },
          ],
        },
        "0xabc",
        "0x123"
      )
    ).toEqual({
      amount: 1234n,
      metadataAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000123",
      ownerAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
      storeAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000777",
    });
  });

  it("exports movement testnet moveposition config for manual use", () => {
    expect(movementTestnetMovePositionConfig.apiUrl).toBe("https://api.moveposition.xyz");
    expect(movementTestnetMovePositionConfig.nameMap["0x1::aptos_coin::AptosCoin"]).toBe(
      "movement-move-fa"
    );
    expect(
      movementTestnetMovePositionConfig.virtualCoinMap[
        "0xea1cc97dea8f5c75a5eff35d7ece118f1b43adb9bd34ed7a05560823acb3dbdc"
      ]
    ).toBe(
      "0x3e472d6bbcf4d1651e01430eb758ebeb955f26792134e96ca8da5722a85dc995::coins::TruAPT"
    );
  });

  it("builds meridian payloads and reads meridian views", async () => {
    const client = createMovementMock({
      "0xae645c9ef6a7d68d64e2beb1c6896f73f189ab609e650ace8bdeeac390b0dd38::vaults_registry::get_paginated_vaults":
        [[{ inner: "0x111" }, { inner: "0x222" }]],
      "0xae645c9ef6a7d68d64e2beb1c6896f73f189ab609e650ace8bdeeac390b0dd38::vaults_registry::get_recognized_vault_count":
        ["2"],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::get_shares_price_e18":
        ["99"],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::get_total_vault_holdings":
        ["12", "34"],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::get_vault_deposit_and_quote_assets":
        [{ inner: "0xa" }, { inner: "0xb" }],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::get_underlying_pool":
        [{ inner: "0xc" }],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::is_asset_0_deposit":
        [true],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::get_user_vault_balance":
        ["5", "66"],
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::ichi_vault_thala::get_shares_withdrawal_amounts":
        ["7", "8"],
      "0x0000000000000000000000000000000000000000000000000000000000000001::fungible_asset::decimals":
        (args: unknown[]) => {
          const [address] = args as [string];

          if (address === "0x000000000000000000000000000000000000000000000000000000000000000a") {
            return ["6"];
          }

          if (address === "0x000000000000000000000000000000000000000000000000000000000000000b") {
            return ["9"];
          }

          if (address === "0x0000000000000000000000000000000000000000000000000000000000000111") {
            return ["8"];
          }

          throw new Error(`Unexpected decimals lookup for ${address}`);
        },
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-mainnet" });
    const meridian = sdk.alm.meridian!;

    expect(await meridian.listVaults()).toEqual([
      "0x0000000000000000000000000000000000000000000000000000000000000111",
      "0x0000000000000000000000000000000000000000000000000000000000000222",
    ]);
    expect(await meridian.getVaultCount()).toBe(2n);
    expect(await meridian.getVaultSummary("0x111")).toEqual({
      vaultAddress: "0x0000000000000000000000000000000000000000000000000000000000000111",
      depositAssetAddress: "0x000000000000000000000000000000000000000000000000000000000000000a",
      depositAssetDecimals: 6,
      quoteAssetAddress: "0x000000000000000000000000000000000000000000000000000000000000000b",
      quoteAssetDecimals: 9,
      underlyingPoolAddress:
        "0x000000000000000000000000000000000000000000000000000000000000000c",
      depositIsAsset0: true,
      shareDecimals: 8,
      sharePriceE18: 99n,
      totalHoldings: {
        asset0: 12n,
        asset1: 34n,
      },
    });
    expect(await meridian.getUserVaultPosition("0x111", "0x222")).toEqual({
      vaultAddress: "0x0000000000000000000000000000000000000000000000000000000000000111",
      shares: 5n,
      valueE18: 66n,
    });
    expect(await meridian.previewWithdraw("0x111", 9n)).toEqual({
      vaultAddress: "0x0000000000000000000000000000000000000000000000000000000000000111",
      asset0: 7n,
      asset1: 8n,
    });
    expect(
      meridian.buildDepositPayload({
        vaultAddress: "0x111",
        amount: 10n,
        minSharesOut: 2n,
      })
    ).toMatchObject({
      function:
        "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::router::deposit",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000111",
        "10",
        "2",
      ],
    });
    expect(
      meridian.buildWithdrawPayload({
        vaultAddress: "0x111",
        shares: 10n,
        minAsset0: 50n,
        minAsset1: 3n,
      })
    ).toMatchObject({
      function:
        "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54::router::withdraw",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000111",
        "10",
        "50",
        "3",
      ],
    });

    expect(() =>
      meridian.buildWithdrawPayload({
        vaultAddress: "0x111",
        shares: 10n,
        maxLossBps: 50n,
        minAmountOut: 3n,
      } as never)
    ).toThrow(
      "Meridian withdraw inputs must use minAsset0 and minAsset1 instead of maxLossBps and minAmountOut"
    );
  });

  it("uses movement helper modules for rewards and meridian batch views", async () => {
    const client = createMovementMock({
      "0x93c6d4852a37be13ec1487a60d32433e396b048ce634b4e8b9f60ff0dac365d2::helpers::batch_get_fa_balance":
        (args: unknown[]) => {
          expect(args).toEqual([
            [
              "0x0000000000000000000000000000000000000000000000000000000000000aaa",
              "0x0000000000000000000000000000000000000000000000000000000000000bbb",
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000111",
          ]);

          return [["5", "6"]];
        },
      "0x93c6d4852a37be13ec1487a60d32433e396b048ce634b4e8b9f60ff0dac365d2::helpers::batch_get_vault_balance":
        (args: unknown[]) => {
          expect(args).toEqual([
            [
              "0x0000000000000000000000000000000000000000000000000000000000000123",
              "0x0000000000000000000000000000000000000000000000000000000000000456",
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000111",
          ]);

          return [["7", "8"]];
        },
      "0x93c6d4852a37be13ec1487a60d32433e396b048ce634b4e8b9f60ff0dac365d2::helpers::batch_get_vault_base_metadata_and_balance":
        (args: unknown[]) => {
          expect(args).toEqual([
            [
              "0x0000000000000000000000000000000000000000000000000000000000000123",
              "0x0000000000000000000000000000000000000000000000000000000000000456",
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000111",
          ]);

          return [
            ["0xaaa", "0xbbb"],
            ["9", "10"],
          ];
        },
      "0x93c6d4852a37be13ec1487a60d32433e396b048ce634b4e8b9f60ff0dac365d2::helpers::batch_get_vault_shares_metadata_and_balance":
        (args: unknown[]) => {
          expect(args).toEqual([
            [
              "0x0000000000000000000000000000000000000000000000000000000000000123",
              "0x0000000000000000000000000000000000000000000000000000000000000456",
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000111",
          ]);

          return [
            ["0xccc", "0xddd"],
            ["11", "12"],
          ];
        },
      "0x93c6d4852a37be13ec1487a60d32433e396b048ce634b4e8b9f60ff0dac365d2::helpers::batch_get_vault_all_metadata_and_balance":
        (args: unknown[]) => {
          expect(args).toEqual([
            [
              "0x0000000000000000000000000000000000000000000000000000000000000123",
              "0x0000000000000000000000000000000000000000000000000000000000000456",
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000111",
          ]);

          return [
            ["0xccc", "0xddd"],
            ["15", "16"],
            ["0xaaa", "0xbbb"],
            ["13", "14"],
          ];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_rewards_snapshot":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0",
            "10",
            "0x0000000000000000000000000000000000000000000000000000000000000111",
          ]);

          return [
            [
              {
                staking_token: { inner: "0xaaa" },
                reward_tokens: [{ inner: "0xbbb" }],
                total_subscribed: "12",
                staking_token_supply: { vec: ["34"] },
                owner: "0x123",
                pool_address: "0x456",
              },
            ],
            {
              vec: [[
                {
                  pool: { inner: "0x456" },
                  is_subscribed: true,
                  pool_staking_token: { inner: "0xaaa" },
                  effective_staked_amount: "9",
                  rewards: [
                    {
                      reward_token: { inner: "0xbbb" },
                      earned_amount: "5",
                      reward_per_token_paid: "7",
                    },
                  ],
                },
              ]],
            },
          ];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_pool_details":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0x0000000000000000000000000000000000000000000000000000000000000456",
          ]);

          return [
            {
              staking_token: { inner: "0xaaa" },
              reward_tokens: [{ inner: "0xbbb" }, { inner: "0xccc" }],
              total_subscribed: "12",
              staking_token_supply: { vec: ["34"] },
              owner: "0x123",
              pool_address: "0x456",
            },
          ];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_reward_token_details":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0x0000000000000000000000000000000000000000000000000000000000000456",
          ]);

          return [[
            {
              distributor: "0x789",
              duration: "259200",
              last_update_time: "1741531542",
              period_finish: "1741531543",
              remaining_rewards: "11",
              reward_per_token: "12",
              reward_rate: "13",
              token: { inner: "0xbbb" },
              unallocated_rewards: "14",
            },
          ]];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_user_pool_positions_by_tokens":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0x0000000000000000000000000000000000000000000000000000000000000111",
            [
              "0x0000000000000000000000000000000000000000000000000000000000000aaa",
              "0x0000000000000000000000000000000000000000000000000000000000000ccc",
            ],
            undefined,
            "5",
          ]);

          return [[
            {
              pool: { inner: "0x456" },
              is_subscribed: false,
              pool_staking_token: { inner: "0xaaa" },
              effective_staked_amount: "15",
              rewards: [
                {
                  reward_token: { inner: "0xbbb" },
                  earned_amount: "2",
                  reward_per_token_paid: "3",
                },
              ],
            },
          ]];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_user_pool_positions":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0x0000000000000000000000000000000000000000000000000000000000000111",
            "1",
            "2",
          ]);

          return [[
            {
              pool: { inner: "0x999" },
              is_subscribed: true,
              pool_staking_token: { inner: "0xddd" },
              effective_staked_amount: "21",
              rewards: [],
            },
          ]];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_registry_overview":
        (args: unknown[]) => {
          expect(args).toEqual(["1", "2", false]);

          return [
            "1778006540",
            true,
            false,
            false,
            { vec: [] },
          ];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_registered_pool_count":
        (args: unknown[]) => {
          expect(args).toEqual([]);
          return ["42"];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_user_pool_positions_by_token":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0x0000000000000000000000000000000000000000000000000000000000000111",
            "0x0000000000000000000000000000000000000000000000000000000000000aaa",
            "3",
            "4",
          ]);

          return [[
            {
              pool: { inner: "0x777" },
              is_subscribed: true,
              pool_staking_token: { inner: "0xaaa" },
              effective_staked_amount: "33",
              rewards: [
                {
                  reward_token: { inner: "0xbbb" },
                  earned_amount: "8",
                  reward_per_token_paid: "9",
                },
              ],
            },
          ]];
        },
      "0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::batch_get_vault_info":
        (args: unknown[]) => {
          expect(args).toEqual([[
            "0x0000000000000000000000000000000000000000000000000000000000000111",
            "0x0000000000000000000000000000000000000000000000000000000000000222",
          ]]);

          return [[
            {
              vec: [
                {
                  total_0: "10",
                  total_1: "20",
                  total_shares: "30",
                  share_price_e18: "40",
                  share_name: "Meridian Vault Share",
                  share_symbol: "MVS",
                  share_decimals: "8",
                  deposit_asset: { inner: "0xaaa" },
                  quote_asset: { inner: "0xbbb" },
                },
              ],
            },
            { vec: [] },
          ]];
        },
      "0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::batch_get_user_balances":
        (args: unknown[]) => {
          expect(args).toEqual([
            [
              "0x0000000000000000000000000000000000000000000000000000000000000111",
              "0x0000000000000000000000000000000000000000000000000000000000000222",
            ],
            "0x0000000000000000000000000000000000000000000000000000000000000333",
          ]);

          return [[
            {
              vec: [
                {
                  share_balance: "99",
                  value_in_deposit_asset_e18: "123456",
                },
              ],
            },
            { vec: [] },
          ]];
        },
      "0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::batch_get_vault_positions":
        (args: unknown[]) => {
          expect(args).toEqual([[
            "0x0000000000000000000000000000000000000000000000000000000000000111",
            "0x0000000000000000000000000000000000000000000000000000000000000222",
          ]]);

          return [[
            {
              vec: [[
                {
                  lower_tick_neg: true,
                  lower_tick_abs: "15",
                  upper_tick_neg: false,
                  upper_tick_abs: "25",
                  liquidity: "100",
                  amount_0: "7",
                  amount_1: "8",
                },
              ]],
            },
            { vec: [] },
          ]];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::is_pool_registered":
        (args: unknown[]) => {
          expect(args).toEqual([
            "0x0000000000000000000000000000000000000000000000000000000000000456",
          ]);

          return [true];
        },
    });
    const sdk = new CanopySdk(client as never, { chain: "movement-mainnet" });

    await expect(
      sdk.canopy?.getBatchFungibleAssetBalances(["0xaaa", "0xbbb"], "0x111")
    ).resolves.toEqual([
      {
        metadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
        balance: 5n,
      },
      {
        metadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000bbb",
        balance: 6n,
      },
    ]);

    await expect(
      sdk.canopy?.getBatchVaultSharesBalances(["0x123", "0x456"], "0x111")
    ).resolves.toEqual([
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000123",
        balance: 7n,
      },
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000456",
        balance: 8n,
      },
    ]);

    await expect(
      sdk.canopy?.getBatchVaultBaseMetadataAndBalances(["0x123", "0x456"], "0x111")
    ).resolves.toEqual([
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000123",
        metadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
        balance: 9n,
      },
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000456",
        metadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000bbb",
        balance: 10n,
      },
    ]);

    await expect(
      sdk.canopy?.getBatchVaultSharesMetadataAndBalances(["0x123", "0x456"], "0x111")
    ).resolves.toEqual([
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000123",
        metadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000ccc",
        balance: 11n,
      },
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000456",
        metadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000ddd",
        balance: 12n,
      },
    ]);

    await expect(
      sdk.canopy?.getBatchVaultAllMetadataAndBalances(["0x123", "0x456"], "0x111")
    ).resolves.toEqual([
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000123",
        baseMetadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
        baseBalance: 13n,
        sharesMetadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000ccc",
        sharesBalance: 15n,
      },
      {
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000456",
        baseMetadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000bbb",
        baseBalance: 14n,
        sharesMetadataAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000ddd",
        sharesBalance: 16n,
      },
    ]);

    await expect(
      sdk.rewards?.getRewardsSnapshot({
        offset: 0,
        limit: 10,
        userAddress: "0x111",
      })
    ).resolves.toEqual({
      pools: [
        {
          owner: "0x0000000000000000000000000000000000000000000000000000000000000123",
          poolAddress:
            "0x0000000000000000000000000000000000000000000000000000000000000456",
          rewardTokenAddresses: [
            "0x0000000000000000000000000000000000000000000000000000000000000bbb",
          ],
          stakingAsset:
            "0x0000000000000000000000000000000000000000000000000000000000000aaa",
          stakingTokenSupply: 34n,
          totalSubscribed: 12n,
        },
      ],
      userPositions: [
        {
          effectiveStakedAmount: 9n,
          isSubscribed: true,
          poolAddress:
            "0x0000000000000000000000000000000000000000000000000000000000000456",
          rewards: [
            {
              earnedAmount: 5n,
              rewardPerTokenPaid: 7n,
              rewardTokenAddress:
                "0x0000000000000000000000000000000000000000000000000000000000000bbb",
            },
          ],
          stakingAsset:
            "0x0000000000000000000000000000000000000000000000000000000000000aaa",
        },
      ],
    });

    await expect(
      sdk.rewards?.getUserPoolPositionsByTokens({
        userAddress: "0x111",
        stakingAssets: ["0xaaa", "0xccc"],
        limit: 5,
      })
    ).resolves.toEqual([
      {
        effectiveStakedAmount: 15n,
        isSubscribed: false,
        poolAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000456",
        rewards: [
          {
            earnedAmount: 2n,
            rewardPerTokenPaid: 3n,
            rewardTokenAddress:
              "0x0000000000000000000000000000000000000000000000000000000000000bbb",
          },
        ],
        stakingAsset:
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
      },
    ]);

    await expect(sdk.rewards?.getPoolDetails("0x456")).resolves.toEqual({
      owner: "0x0000000000000000000000000000000000000000000000000000000000000123",
      poolAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000456",
      rewardTokenAddresses: [
        "0x0000000000000000000000000000000000000000000000000000000000000bbb",
        "0x0000000000000000000000000000000000000000000000000000000000000ccc",
      ],
      stakingAsset:
        "0x0000000000000000000000000000000000000000000000000000000000000aaa",
      stakingTokenSupply: 34n,
      totalSubscribed: 12n,
    });

    await expect(sdk.rewards?.getRewardTokenDetails("0x456")).resolves.toEqual([
      {
        distributor:
          "0x0000000000000000000000000000000000000000000000000000000000000789",
        duration: 259200n,
        lastUpdateTime: 1741531542n,
        periodFinish: 1741531543n,
        remainingRewards: 11n,
        rewardPerToken: 12n,
        rewardRate: 13n,
        rewardTokenAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000bbb",
        unallocatedRewards: 14n,
      },
    ]);

    await expect(sdk.rewards?.getRegisteredPoolCount()).resolves.toBe(42n);

    await expect(
      sdk.rewards?.getUserPoolPositions({
        userAddress: "0x111",
        offset: 1,
        limit: 2,
      })
    ).resolves.toEqual([
      {
        effectiveStakedAmount: 21n,
        isSubscribed: true,
        poolAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000999",
        rewards: [],
        stakingAsset:
          "0x0000000000000000000000000000000000000000000000000000000000000ddd",
      },
    ]);

    await expect(
      sdk.rewards?.getUserPoolPositionsByToken({
        userAddress: "0x111",
        stakingAsset: "0xaaa",
        offset: 3,
        limit: 4,
      })
    ).resolves.toEqual([
      {
        effectiveStakedAmount: 33n,
        isSubscribed: true,
        poolAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000777",
        rewards: [
          {
            earnedAmount: 8n,
            rewardPerTokenPaid: 9n,
            rewardTokenAddress:
              "0x0000000000000000000000000000000000000000000000000000000000000bbb",
          },
        ],
        stakingAsset:
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
      },
    ]);

    await expect(
      sdk.rewards?.getRegistryOverview({
        offset: 1,
        limit: 2,
        includePools: false,
      })
    ).resolves.toEqual({
      pools: null,
      poolsIncluded: false,
      snapshotTimestamp: 1778006540n,
      statusFlags: [true, false],
    });

    await expect(
      sdk.rewards?.getUserRewardsOverview({
        userAddress: "0x111",
        offset: 1,
        limit: 2,
        includePools: false,
      })
    ).resolves.toEqual({
      pools: null,
      poolsIncluded: false,
      snapshotTimestamp: 1778006540n,
      statusFlags: [true, false],
      userPositions: [
        {
          effectiveStakedAmount: 21n,
          isSubscribed: true,
          poolAddress:
            "0x0000000000000000000000000000000000000000000000000000000000000999",
          rewards: [],
          stakingAsset:
            "0x0000000000000000000000000000000000000000000000000000000000000ddd",
        },
      ],
    });

    await expect(sdk.rewards?.isPoolRegistered("0x456")).resolves.toBe(true);

    await expect(
      sdk.alm.meridian?.getBatchVaultInfo(["0x111", "0x222"])
    ).resolves.toEqual([
      {
        depositAssetAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
        quoteAssetAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000bbb",
        shareDecimals: 8,
        shareName: "Meridian Vault Share",
        sharePriceE18: 40n,
        shareSymbol: "MVS",
        total0: 10n,
        total1: 20n,
        totalShares: 30n,
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000111",
      },
      null,
    ]);

    await expect(
      sdk.alm.meridian?.getBatchUserVaultBalances(["0x111", "0x222"], "0x333")
    ).resolves.toEqual([
      {
        shareBalance: 99n,
        valueInDepositAssetE18: 123456n,
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000111",
      },
      null,
    ]);

    await expect(
      sdk.alm.meridian?.getBatchVaultPositions(["0x111", "0x222"])
    ).resolves.toEqual([
      {
        positions: [
          {
            amount0: 7n,
            amount1: 8n,
            liquidity: 100n,
            lowerTick: -15n,
            upperTick: 25n,
          },
        ],
        vaultAddress:
          "0x0000000000000000000000000000000000000000000000000000000000000111",
      },
      null,
    ]);
  });
});
