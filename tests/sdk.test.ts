import {
  CanopySdk,
  createCanopySdk,
  findFungibleAssetDeposit,
  getContract,
  getCanopyStrategyContract,
  requireContract,
  movementTestnetMovePositionConfig,
} from "../packages/sdk/src";

const APTOS_COIN_TYPE =
  "0x0000000000000000000000000000000000000000000000000000000000000001::aptos_coin::AptosCoin";

interface MockViewClient {
  view: jest.Mock<Promise<unknown[]>, [unknown]>;
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

    const aptosMainnetClient = createMovementMock({});
    const aptosMainnetSdk = createCanopySdk(aptosMainnetClient as never, {
      chain: "aptos-mainnet",
    });

    expect(aptosMainnetSdk.canopy).toBeUndefined();
    expect(aptosMainnetSdk.rewards).toBeUndefined();
    expect(aptosMainnetSdk.alm.meridian).toBeDefined();

    const aptosTestnetClient = createMovementMock({});
    const aptosTestnetSdk = createCanopySdk(aptosTestnetClient as never, {
      chain: "aptos-testnet",
    });

    expect(aptosTestnetSdk.canopy).toBeDefined();
    expect(aptosTestnetSdk.rewards).toBeDefined();
    expect(aptosTestnetSdk.alm.meridian).toBeUndefined();

    const movementTestnetClient = createMovementMock({});
    const movementTestnetSdk = createCanopySdk(movementTestnetClient as never, {
      chain: "movement-testnet",
    });

    expect(movementTestnetSdk.canopy).toBeUndefined();
    expect(movementTestnetSdk.rewards).toBeUndefined();
    expect(movementTestnetSdk.alm.meridian).toBeUndefined();
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

  it("parses canopy vault views", async () => {
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "USDC",
            shares_name: "Canopy USDC",
            vault_address: "0xabc",
            asset_address: "0xdef",
            shares_address: "0x123",
            paired_coin_type: { vec: ["0x1::aptos_coin::AptosCoin"] },
            strategies: [
              {
                strategy_address: "0x1",
                asset_address: "0x2",
                concrete_address: "0x3",
                current_vault_debt: "4",
                debt_limit: "5",
                decimals: "6",
                last_report: "7",
                shares_address: "0x8",
                total_asset: "9",
                total_debt: "10",
                total_idle: "11",
                total_loss: "12",
                total_profit: "13",
                total_shares: "14",
                vault_address: "0xabc",
              },
            ],
          },
        ],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vaults_view":
        [
          {
            limit: "1",
            offset: "0",
            total_count: "1",
            vaults: [
              {
                decimals: "8",
                total_debt: "1",
                total_idle: "2",
                total_shares: "3",
                total_asset: "4",
                asset_name: "USDC",
                shares_name: "Canopy USDC",
                vault_address: "0xabc",
                asset_address: "0xdef",
                shares_address: "0x123",
                strategies: [],
              },
            ],
          },
        ],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    const vault = await sdk.canopy?.getVault("0xabc");
    expect(vault).toMatchObject({
      vaultAddress: "0x0000000000000000000000000000000000000000000000000000000000000abc",
      assetName: "USDC",
      pairedCoinType: APTOS_COIN_TYPE,
      totalAsset: 4n,
      totalDebt: 1n,
      totalIdle: 2n,
      totalShares: 3n,
    });
    expect(vault?.strategies[0]).toMatchObject({
      strategyAddress: "0x0000000000000000000000000000000000000000000000000000000000000001",
      concreteAddress: "0x0000000000000000000000000000000000000000000000000000000000000003",
      currentVaultDebt: 4n,
      totalAsset: 9n,
    });

    const page = await sdk.canopy?.listVaults({ limit: 1, offset: 0 });
    expect(page).toMatchObject({
      limit: 1,
      offset: 0,
      totalCount: 1,
    });
    expect(page?.vaults).toHaveLength(1);
  });

  it("builds canopy payloads with explicit limits", async () => {
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "USDC",
            shares_name: "Canopy USDC",
            vault_address: "0xabc",
            asset_address: "0xdef",
            shares_address: "0x123",
            paired_coin_type: { vec: ["0x1::aptos_coin::AptosCoin"] },
            strategies: [],
          },
        ],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(
      sdk.canopy?.buildDepositPayload({
        vaultAddress: "0xabc",
        amount: 10n,
        minSharesOut: 9n,
      })
    ).resolves.toEqual({
      function:
        "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin",
      typeArguments: [APTOS_COIN_TYPE, APTOS_COIN_TYPE],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        [],
        [],
        "10",
        "9",
      ],
    });

    await expect(
      sdk.canopy?.buildWithdrawPayload({
        vaultAddress: "0xabc",
        shares: 10n,
        maxLossBps: 50n,
        minAmountOut: 3n,
      })
    ).resolves.toEqual({
      function:
        "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::withdraw_coin",
      typeArguments: [APTOS_COIN_TYPE, APTOS_COIN_TYPE],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        [],
        [],
        "10",
        "50",
        "3",
      ],
    });
  });

  it("plans unstake-and-withdraw only when wallet shares are insufficient", async () => {
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "USDC",
            shares_name: "Canopy USDC",
            vault_address: "0xabc",
            asset_address: "0xdef",
            shares_address: "0x123",
            paired_coin_type: { vec: ["0x1::aptos_coin::AptosCoin"] },
            strategies: [],
          },
        ],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(
      sdk.canopy?.unstakeAndWithdraw({
        vaultAddress: "0xabc",
        shares: 10n,
        walletShares: 10n,
        stakedShares: 99n,
        maxLossBps: 50n,
        minAmountOut: 3n,
      })
    ).resolves.toEqual({
      requiresUnstake: false,
      unstakeAmount: 0n,
        withdrawPayload: {
          function:
            "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::withdraw_coin",
          typeArguments: [APTOS_COIN_TYPE, APTOS_COIN_TYPE],
          functionArguments: [
            "0x0000000000000000000000000000000000000000000000000000000000000abc",
            [],
            [],
          "10",
          "50",
          "3",
        ],
      },
    });

    await expect(
      sdk.canopy?.unstakeAndWithdraw({
        vaultAddress: "0xabc",
        shares: 10n,
        walletShares: 4n,
        stakedShares: 9n,
        maxLossBps: 50n,
        minAmountOut: 3n,
      })
    ).resolves.toEqual({
      requiresUnstake: true,
      unstakeAmount: 6n,
      unstakePayload: {
        function:
          "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::withdraw",
        typeArguments: [],
        functionArguments: [
          "0x0000000000000000000000000000000000000000000000000000000000000123",
          "6",
        ],
      },
        withdrawPayload: {
          function:
            "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::withdraw_coin",
          typeArguments: [APTOS_COIN_TYPE, APTOS_COIN_TYPE],
          functionArguments: [
            "0x0000000000000000000000000000000000000000000000000000000000000abc",
            [],
            [],
          "10",
          "50",
          "3",
        ],
      },
    });
  });

  it("builds moveposition-backed canopy payloads with packets", async () => {
    const originalFetch = global.fetch;
    const client = createMovementMock({
      "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "MOVE",
            shares_name: "Canopy MOVE",
            vault_address: "0xabc",
            asset_address:
              "0x000000000000000000000000000000000000000000000000000000000000000a",
            shares_address: "0x123",
            strategies: [
              {
                strategy_address: "0x555",
                asset_address:
                  "0x000000000000000000000000000000000000000000000000000000000000000a",
                concrete_address:
                  "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd",
                current_vault_debt: "4",
                debt_limit: "5",
                decimals: "6",
                last_report: "7",
                shares_address: "0x8",
                total_asset: "9",
                total_debt: "10",
                total_idle: "11",
                total_loss: "12",
                total_profit: "13",
                total_shares: "14",
                vault_address: "0xabc",
              },
            ],
          },
        ],
      "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::deposit::get_allocations_view":
        [
          {
            data: [{ key: { inner: "0x555" }, value: "10" }],
          },
        ],
      "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::withdraw::get_withdrawal_map_view":
        [
          {
            data: [{ key: { inner: "0x555" }, value: "10" }],
          },
        ],
      "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd::strategy::withdrawal_amount_view_fa":
        ["7"],
    });

    global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
      if (url === "https://api.moveposition.xyz/portfolios/0x0000000000000000000000000000000000000000000000000000000000000555") {
        return {
          ok: true,
          json: async () => ({
            collaterals: [{ amount: "1", instrument: { name: "movement-move-fa" } }],
            liabilities: [],
          }),
        } as Response;
      }

      if (url === "https://api.moveposition.xyz/brokers/lend/v2") {
        expect(init?.method).toBe("POST");
        expect(JSON.parse(String(init?.body))).toMatchObject({
          brokerName: "movement-move-fa",
          network: "movement-mainnet",
          signerPubkey:
            "0x0000000000000000000000000000000000000000000000000000000000000555",
        });
        return {
          ok: true,
          json: async () => ({
            packet: "0x0102",
          }),
        } as Response;
      }

      if (url === "https://api.moveposition.xyz/brokers/redeem/v2") {
        expect(init?.method).toBe("POST");
        expect(JSON.parse(String(init?.body))).toMatchObject({
          brokerName: "movement-move-fa",
          network: "movement-mainnet",
          signerPubkey:
            "0x0000000000000000000000000000000000000000000000000000000000000555",
        });
        return {
          ok: true,
          json: async () => ({
            packet: "0x0304",
          }),
        } as Response;
      }

      throw new Error(`Unexpected fetch ${url}`);
    }) as typeof fetch;

    const sdk = new CanopySdk(client as never, { chain: "movement-mainnet" });

    await expect(
      sdk.canopy?.buildDepositPayload({
        vaultAddress: "0xabc",
        amount: 10n,
        minSharesOut: 8n,
      })
    ).resolves.toEqual({
      function:
        "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::router::deposit_fa_with_coin_type",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        ["0x0000000000000000000000000000000000000000000000000000000000000555"],
        [new Uint8Array([1, 2])],
        "10",
        "8",
      ],
    });

    await expect(
      sdk.canopy?.buildWithdrawPayload({
        vaultAddress: "0xabc",
        shares: 10n,
        maxLossBps: 50n,
        minAmountOut: 3n,
      })
    ).resolves.toEqual({
      function:
        "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::router::withdraw_fa_with_coin_type",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        ["0x0000000000000000000000000000000000000000000000000000000000000555"],
        [new Uint8Array([3, 4])],
        "10",
        "50",
        "3",
      ],
    });

    global.fetch = originalFetch;
  });

  it("uses built-in aptos testnet moveposition packet defaults", async () => {
    const originalFetch = global.fetch;
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "TruAPT",
            shares_name: "Canopy TruAPT",
            vault_address: "0xabc",
            asset_address:
              "0xea1cc97dea8f5c75a5eff35d7ece118f1b43adb9bd34ed7a05560823acb3dbdc",
            shares_address: "0x123",
            strategies: [
              {
                strategy_address: "0x555",
                asset_address:
                  "0xea1cc97dea8f5c75a5eff35d7ece118f1b43adb9bd34ed7a05560823acb3dbdc",
                concrete_address:
                  "0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab",
                current_vault_debt: "4",
                debt_limit: "5",
                decimals: "6",
                last_report: "7",
                shares_address: "0x8",
                total_asset: "9",
                total_debt: "10",
                total_idle: "11",
                total_loss: "12",
                total_profit: "13",
                total_shares: "14",
                vault_address: "0xabc",
              },
            ],
          },
        ],
      "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::deposit::get_allocations_view":
        [
          {
            data: [{ key: { inner: "0x555" }, value: "10" }],
          },
        ],
    });

    global.fetch = jest.fn(async (url: string, init?: RequestInit) => {
      if (url === "https://api.moveposition.xyz/portfolios/0x0000000000000000000000000000000000000000000000000000000000000555") {
        return {
          ok: true,
          json: async () => ({
            collaterals: [{ amount: "1", instrument: { name: "truapt" } }],
            liabilities: [],
          }),
        } as Response;
      }

      if (url === "https://api.moveposition.xyz/brokers/lend/v2") {
        expect(JSON.parse(String(init?.body))).toMatchObject({
          brokerName: "truapt",
          network: "aptos",
          signerPubkey:
            "0x0000000000000000000000000000000000000000000000000000000000000555",
        });
        return {
          ok: true,
          json: async () => ({
            packet: "0x0506",
          }),
        } as Response;
      }

      throw new Error(`Unexpected fetch ${url}`);
    }) as typeof fetch;

    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(
      sdk.canopy?.buildDepositPayload({
        vaultAddress: "0xabc",
        amount: 10n,
        minSharesOut: 8n,
      })
    ).resolves.toEqual({
      function:
        "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_fa",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        ["0x0000000000000000000000000000000000000000000000000000000000000555"],
        [new Uint8Array([5, 6])],
        "10",
        "8",
      ],
    });

    global.fetch = originalFetch;
  });

  it("supports explicit wrapper coin types for FA canopy payloads", async () => {
    const originalFetch = global.fetch;
    const client = createMovementMock({
      "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "USDC",
            shares_name: "Canopy USDC",
            vault_address: "0xabc",
            asset_address:
              "0x000000000000000000000000000000000000000000000000000000000000000a",
            shares_address: "0x123",
            strategies: [
              {
                strategy_address: "0x555",
                asset_address:
                  "0x000000000000000000000000000000000000000000000000000000000000000a",
                concrete_address:
                  "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd",
                current_vault_debt: "4",
                debt_limit: "5",
                decimals: "6",
                last_report: "7",
                shares_address: "0x8",
                total_asset: "9",
                total_debt: "10",
                total_idle: "11",
                total_loss: "12",
                total_profit: "13",
                total_shares: "14",
                vault_address: "0xabc",
              },
            ],
          },
        ],
      "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::deposit::get_allocations_view":
        [
          {
            data: [{ key: { inner: "0x555" }, value: "10" }],
          },
        ],
      "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::withdraw::get_withdrawal_map_view":
        [
          {
            data: [{ key: { inner: "0x555" }, value: "10" }],
          },
        ],
      "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd::strategy::withdrawal_amount_view_fa":
        ["7"],
    });
    global.fetch = jest.fn(async (url: string) => {
      if (url === "https://api.moveposition.xyz/portfolios/0x0000000000000000000000000000000000000000000000000000000000000555") {
        return {
          ok: true,
          json: async () => ({
            collaterals: [{ amount: "1", instrument: { name: "movement-move-fa" } }],
            liabilities: [],
          }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          packet: "0x0102",
        }),
      } as Response;
    }) as typeof fetch;
    const sdk = new CanopySdk(client as never, { chain: "movement-mainnet" });

    await expect(
      sdk.canopy?.buildDepositPayload({
        vaultAddress: "0xabc",
        amount: 10n,
        minSharesOut: 8n,
        wrapperCoinType: "0xfoo::wrapped_usdc::WrappedUsdc",
      })
    ).resolves.toEqual({
      function:
        "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::router::deposit_fa_with_coin_type",
      typeArguments: ["0xfoo::wrapped_usdc::WrappedUsdc"],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        ["0x0000000000000000000000000000000000000000000000000000000000000555"],
        [new Uint8Array([1, 2])],
        "10",
        "8",
      ],
    });

    await expect(
      sdk.canopy?.buildWithdrawPayload({
        vaultAddress: "0xabc",
        shares: 10n,
        maxLossBps: 50n,
        minAmountOut: 3n,
        wrapperCoinType: "0xfoo::wrapped_usdc::WrappedUsdc",
      })
    ).resolves.toEqual({
      function:
        "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::router::withdraw_fa_with_coin_type",
      typeArguments: ["0xfoo::wrapped_usdc::WrappedUsdc"],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        ["0x0000000000000000000000000000000000000000000000000000000000000555"],
        [new Uint8Array([1, 2])],
        "10",
        "50",
        "3",
      ],
    });

    global.fetch = originalFetch;
  });

  it("fails canopy parsing loudly on malformed data", async () => {
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "USDC",
            shares_name: "Canopy USDC",
            vault_address: "0xabc",
            asset_address: { nope: true },
            shares_address: "0x123",
            strategies: [],
          },
        ],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(sdk.canopy?.getVault("0xabc")).rejects.toMatchObject({
      code: "VIEW_CALL_FAILED",
    });
  });

  it("fails canopy packet allocation parsing loudly on unknown entry shapes", async () => {
    const client = createMovementMock({
      "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "MOVE",
            shares_name: "Canopy MOVE",
            vault_address: "0xabc",
            asset_address:
              "0x000000000000000000000000000000000000000000000000000000000000000a",
            shares_address: "0x123",
            strategies: [
              {
                strategy_address: "0x555",
                asset_address:
                  "0x000000000000000000000000000000000000000000000000000000000000000a",
                concrete_address:
                  "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd",
                current_vault_debt: "4",
                debt_limit: "5",
                decimals: "6",
                last_report: "7",
                shares_address: "0x8",
                total_asset: "9",
                total_debt: "10",
                total_idle: "11",
                total_loss: "12",
                total_profit: "13",
                total_shares: "14",
                vault_address: "0xabc",
              },
            ],
          },
        ],
      "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b::deposit::get_allocations_view":
        [{ data: [{ unexpected: "shape" }] }],
    });
    const sdk = new CanopySdk(client as never, { chain: "movement-mainnet" });

    await expect(
      sdk.canopy?.buildDepositPayload({
        vaultAddress: "0xabc",
        amount: 10n,
        minSharesOut: 8n,
      })
    ).rejects.toMatchObject({
      code: "VIEW_CALL_FAILED",
      message: "Allocation map entry has an unexpected shape",
    });
  });

  it("exposes canopy user position, strategy details, and allocation views", async () => {
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
            decimals: "8",
            total_debt: "1",
            total_idle: "2",
            total_shares: "3",
            total_asset: "4",
            asset_name: "USDC",
            shares_name: "Canopy USDC",
            vault_address: "0xabc",
            asset_address: "0xdef",
            shares_address: "0x123",
            strategies: [],
          },
        ],
      "0x0000000000000000000000000000000000000000000000000000000000000001::primary_fungible_store::balance":
        ["15"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::shares_to_amount":
        ["12"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::strategy_debt":
        ["4"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::strategy_debt_limit":
        ["5"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::strategy_last_report":
        ["6"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::strategy_total_profit":
        ["7"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::strategy_total_loss":
        ["8"],
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::get_strategy_shares_balance":
        ["9"],
      "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::deposit::get_allocations_view":
        [
          {
            data: [{ key: { inner: "0xaaa" }, value: "10" }],
          },
        ],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(
      sdk.canopy?.getUserVaultPosition("0x111", "0xabc")
    ).resolves.toEqual({
      assetValue: 12n,
      sharesBalance: 15n,
      userAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000111",
      vaultAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
    });

    await expect(
      sdk.canopy?.getStrategyDetails("0xabc", "0xaaa")
    ).resolves.toEqual({
      debt: 4n,
      debtLimit: 5n,
      lastReport: 6n,
      sharesBalance: 9n,
      strategyAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000aaa",
      totalLoss: 8n,
      totalProfit: 7n,
      vaultAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
    });

    await expect(
      sdk.canopy?.getVaultAllocation({
        vaultAddress: "0xabc",
        amount: 10n,
        operation: "deposit",
      })
    ).resolves.toEqual({
      amounts: [10n],
      operation: "deposit",
      requestedAmount: 10n,
      strategies: [
        "0x0000000000000000000000000000000000000000000000000000000000000aaa",
      ],
      vaultAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
    });
  });

  it("builds rewards payloads and parses rewards views", async () => {
    const client = createMovementMock({
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_earned":
        ["42"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_pool_info":
        [{ inner: "0xa" }, [{ inner: "0xb" }, { inner: "0xc" }], "7"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::is_user_subscribed":
        (args: unknown[]) => [String(args[1]).endsWith("000b")],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const rewards = sdk.rewards!;

    expect(
      rewards.buildStakeCoinPayload({
        coinType: "0x1::aptos_coin::AptosCoin",
        amount: 10n,
      })
    ).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::stake",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: ["10"],
    });

    expect(
      rewards.buildStakeAndSubscribeAssetPayload({
        stakingAsset: "0xA",
        amount: 11n,
        poolAddresses: ["0xB", "0xC"],
      })
    ).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::stake_and_subscribe_fa",
      typeArguments: [],
      functionArguments: [
        "0x000000000000000000000000000000000000000000000000000000000000000a",
        "11",
        [
          "0x000000000000000000000000000000000000000000000000000000000000000b",
          "0x000000000000000000000000000000000000000000000000000000000000000c",
        ],
      ],
    });

    expect(await rewards.getEarned({
      userAddress: "0x1",
      poolAddress: "0x2",
      rewardTokenAddress: "0x3",
    })).toBe(42n);

    expect(await rewards.getPoolInfo("0x4")).toEqual({
      stakingAsset: "0x000000000000000000000000000000000000000000000000000000000000000a",
      rewardTokenAddresses: [
        "0x000000000000000000000000000000000000000000000000000000000000000b",
        "0x000000000000000000000000000000000000000000000000000000000000000c",
      ],
      totalStaked: 7n,
    });

    expect(await rewards.getUnsubscribedPools({
      userAddress: "0x1",
      poolAddresses: ["0xb", "0xc"],
    })).toEqual([
      "0x000000000000000000000000000000000000000000000000000000000000000c",
    ]);
  });

  it("supports the missing rewards builders and staking views", async () => {
    const client = createMovementMock({
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_user_staked_balance":
        ["21"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_user_subscribed_pools":
        [[{ inner: "0xa" }]],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_pool_info":
        [{ inner: "0x123" }, [{ inner: "0xb" }], "7"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_earned":
        ["42"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_reward_data":
        ["0xc", "100", "200", "300", "400", "500"],
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::get_unallocated_rewards":
        ["600"],
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });
    const rewards = sdk.rewards!;

    expect(rewards.buildSubscribePayload({ poolAddress: "0xA" })).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::subscribe",
      typeArguments: [],
      functionArguments: ["0x000000000000000000000000000000000000000000000000000000000000000a"],
    });

    expect(rewards.buildUnsubscribePayload({ poolAddress: "0xA" })).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::unsubscribe",
      typeArguments: [],
      functionArguments: ["0x000000000000000000000000000000000000000000000000000000000000000a"],
    });

    expect(
      rewards.buildUnsubscribeAndWithdrawAssetPayload({
        stakingAsset: "0x123",
        amount: 5n,
        poolAddresses: ["0xA"],
      })
    ).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::unsubscribe_and_withdraw_fa",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000123",
        "5",
        ["0x000000000000000000000000000000000000000000000000000000000000000a"],
      ],
    });

    expect(
      rewards.buildCreateStakingPoolPayload({
        coinType: "0x1::aptos_coin::AptosCoin",
      })
    ).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::create_staking_pool",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [],
    });

    expect(
      rewards.buildStakeTokenPayload({
        amount: 5n,
        tokenCreator: "0x123",
        tokenName: "Vault Share",
        tokenSymbol: "VSHARE",
        tokenDecimals: 8,
        poolAddresses: ["0xA"],
      })
    ).toEqual({
      function:
        "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::router::stake_and_subscribe_token",
      typeArguments: [],
      functionArguments: [
        ["0x000000000000000000000000000000000000000000000000000000000000000a"],
        "5",
        "0x0000000000000000000000000000000000000000000000000000000000000123",
        "Vault Share",
        "VSHARE",
        "8",
      ],
    });

    await expect(
      rewards.getUserStakedBalance({
        userAddress: "0x111",
        stakingAsset: "0x123",
      })
    ).resolves.toBe(21n);

    await expect(
      rewards.getUserSubscribedPools({
        userAddress: "0x111",
        stakingAsset: "0x123",
      })
    ).resolves.toEqual([
      "0x000000000000000000000000000000000000000000000000000000000000000a",
    ]);

    await expect(rewards.getRewardData("0xA", "0xB")).resolves.toEqual({
      lastUpdateTime: 300n,
      periodFinish: 200n,
      rewardPerTokenStored: 500n,
      rewardRate: 400n,
      rewardsDistributor:
        "0x000000000000000000000000000000000000000000000000000000000000000c",
      rewardsDuration: 100n,
      unallocatedRewards: 600n,
    });

    await expect(
      rewards.getUserStakingPosition({
        userAddress: "0x111",
        stakingAsset: "0x123",
      })
    ).resolves.toEqual({
      pendingRewards: [
        {
          amount: 42n,
          poolAddress:
            "0x000000000000000000000000000000000000000000000000000000000000000a",
          rewardTokenAddress:
            "0x000000000000000000000000000000000000000000000000000000000000000b",
        },
      ],
      stakingAsset:
        "0x0000000000000000000000000000000000000000000000000000000000000123",
      subscribedPools: [
        "0x000000000000000000000000000000000000000000000000000000000000000a",
      ],
      totalStaked: 21n,
    });
  });

  it("adds off-chain metadata and sentio pool discovery support", async () => {
    const originalFetch = global.fetch;
    const client = createMovementMock({
      "0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::is_user_subscribed":
        [false],
    });

    global.fetch = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));

      if (body.operationName === "GetCanopyMetadata") {
        return {
          ok: true,
          json: async () => ({
            data: {
              listCanopyMetadata: {
                items: [
                  {
                    chainId: 126,
                    networkAddress: "0xabc",
                    displayName: "Canopy MOVE Vault",
                    investmentType: "lending",
                    networkType: "movement",
                    riskScore: 2,
                    isHidden: false,
                    description: "Test vault",
                    iconURL: "https://example.com/icon.png",
                    labels: ["featured"],
                    rewardPools: ["0xaaa"],
                    additionalMetadata: [{ key: "platform", item: "echelon" }],
                    paused: false,
                    token0: "MOVE",
                    token1: "USDC",
                    tvl: "1000",
                    totalSupply: "500",
                    token0Balance: "100",
                    token1Balance: "200",
                    decimals0: 8,
                    decimals1: 6,
                    apr: "0.12",
                    rewardApr: "0.03",
                  },
                ],
              },
            },
          }),
        } as Response;
      }

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

    await expect(sdk.data.canopyMetadata.listVaultMetadata()).resolves.toEqual([
      expect.objectContaining({
        address: "0x0000000000000000000000000000000000000000000000000000000000000abc",
        displayName: "Canopy MOVE Vault",
        rewardPools: [
          "0x0000000000000000000000000000000000000000000000000000000000000aaa",
        ],
      }),
    ]);

    await expect(
      sdk.data.rewardsDiscovery.findPoolAddressesByStakingAsset("0x789")
    ).resolves.toEqual([
      "0x0000000000000000000000000000000000000000000000000000000000000123",
    ]);

    await expect(
      sdk.rewards?.buildStakeVaultSharesPayload({
        stakingAsset: "0x789",
        amount: 11n,
        userAddress: "0x111",
      })
    ).resolves.toEqual({
      function:
        "0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::router::stake_and_subscribe_fa",
      typeArguments: [],
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000789",
        "11",
        ["0x0000000000000000000000000000000000000000000000000000000000000123"],
      ],
    });

    global.fetch = originalFetch;
  });

  it("uses the local fallback pool mapping when sentio returns no match", async () => {
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
      sdk.data.rewardsDiscovery.resolvePoolAddresses({
        stakingAsset: "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
      })
    ).resolves.toEqual([
      "0x7bf3653bf8b02d19b56916daaf959b95b4564ecd35d9abdb323d0690d5fdd0e7",
      "0xc1d2493f1ecc4ce35726fb0a48719752ce573f6aead45f35703193c021af3001",
    ]);

    await expect(
      sdk.rewards?.buildStakeVaultSharesPayload({
        stakingAsset: "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
        amount: 11n,
        userAddress: "0x111",
      })
    ).resolves.toEqual({
      function:
        "0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::router::stake_and_subscribe_fa",
      typeArguments: [],
      functionArguments: [
        "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02",
        "11",
        [
          "0x7bf3653bf8b02d19b56916daaf959b95b4564ecd35d9abdb323d0690d5fdd0e7",
          "0xc1d2493f1ecc4ce35726fb0a48719752ce573f6aead45f35703193c021af3001",
        ],
      ],
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
      })
    );

    global.fetch = originalFetch;
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
    ).toEqual({
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
        maxLossBps: 50n,
        minAmountOut: 3n,
      })
    ).toEqual({
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
            ["0xaaa", "0xbbb"],
            ["13", "14"],
            ["0xccc", "0xddd"],
            ["15", "16"],
          ];
        },
      "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219::rewards_view::get_rewards_snapshot":
        (args: unknown[]) => {
          expect(args).toEqual([
            { vec: ["0"] },
            { vec: ["10"] },
            {
              vec: [
                "0x0000000000000000000000000000000000000000000000000000000000000111",
              ],
            },
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
            { vec: [] },
            { vec: ["5"] },
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
            { vec: ["1"] },
            { vec: ["2"] },
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
          expect(args).toEqual([{ vec: ["1"] }, { vec: ["2"] }, false]);

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
            { vec: ["3"] },
            { vec: ["4"] },
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
