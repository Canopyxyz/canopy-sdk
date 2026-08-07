import { jest } from "@jest/globals";
import { CanopySdk } from "../packages/sdk/src";
import { normalizeMoveAddress } from "../packages/core/src";
import { DEFAULT_VIEW_BATCH_SIZE } from "../packages/sdk/src/internal/address-batches";
import { createMovementMock } from "./fixtures/view-client-mock";

const APTOS_COIN_TYPE =
  "0x0000000000000000000000000000000000000000000000000000000000000001::aptos_coin::AptosCoin";

describe("Canopy client", () => {
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
    ).resolves.toMatchObject({
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
    ).resolves.toMatchObject({
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

    await expect(
      sdk.canopy?.buildDepositPayload({
        vaultAddress: "0xabc",
        amount: 10n,
      })
    ).resolves.toMatchObject({
      function:
        "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::deposit_coin",
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        [],
        [],
        "10",
        undefined,
      ],
    });

    await expect(
      sdk.canopy?.buildWithdrawPayload({
        vaultAddress: "0xabc",
        shares: 10n,
      })
    ).resolves.toMatchObject({
      function:
        "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router::withdraw_coin",
      functionArguments: [
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
        [],
        [],
        "10",
        undefined,
        undefined,
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
    ).resolves.toMatchObject({
      requiresUnstake: false,
      unstakeAmount: 0n,
      withdrawPayload: expect.objectContaining({
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
      }),
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
    ).resolves.toMatchObject({
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
      withdrawPayload: expect.objectContaining({
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
      }),
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
      if (
        url ===
        "https://api.moveposition.xyz/portfolios/0x0000000000000000000000000000000000000000000000000000000000000555"
      ) {
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
    ).resolves.toMatchObject({
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
    ).resolves.toMatchObject({
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
      if (
        url ===
        "https://api.moveposition.xyz/portfolios/0x0000000000000000000000000000000000000000000000000000000000000555"
      ) {
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
    ).resolves.toMatchObject({
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
      if (
        url ===
        "https://api.moveposition.xyz/portfolios/0x0000000000000000000000000000000000000000000000000000000000000555"
      ) {
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
    ).resolves.toMatchObject({
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
    ).resolves.toMatchObject({
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

  it("fails canopy packet allocation parsing loudly when the map is not a SimpleMap data vector", async () => {
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
        [[]],
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
      message: "Allocation map response is malformed",
      details: expect.objectContaining({
        expected: "data array",
      }),
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

    await expect(sdk.canopy?.getUserVaultPosition("0x111", "0xabc")).resolves.toEqual({
      assetValue: 12n,
      sharesBalance: 15n,
      userAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000111",
      vaultAddress:
        "0x0000000000000000000000000000000000000000000000000000000000000abc",
    });

    await expect(sdk.canopy?.getStrategyDetails("0xabc", "0xaaa")).resolves.toEqual({
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

  it("fails canopy parsing loudly when vault decimals are missing", async () => {
    const client = createMovementMock({
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::vault_view":
        [
          {
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
    });
    const sdk = new CanopySdk(client as never, { chain: "aptos-testnet" });

    await expect(sdk.canopy?.getVault("0xabc")).rejects.toMatchObject({
      code: "VIEW_CALL_FAILED",
      message: "Expected Move scalar",
    });
  });

  it("dedupes and chunks canopy helper batch requests", async () => {
    const requestedChunks: string[][] = [];
    const client = createMovementMock({
      "0x93c6d4852a37be13ec1487a60d32433e396b048ce634b4e8b9f60ff0dac365d2::helpers::batch_get_fa_balance":
        (args: unknown[]) => {
          const chunk = (args[0] as string[]).slice();
          requestedChunks.push(chunk);
          return [chunk.map((address) => BigInt(address).toString())];
        },
    });
    const sdk = new CanopySdk(client as never, { chain: "movement-mainnet" });
    const uniqueAddresses = Array.from({ length: DEFAULT_VIEW_BATCH_SIZE + 1 }, (_, index) => {
      return `0x${(index + 1).toString(16)}`;
    });
    const inputAddresses = [...uniqueAddresses, uniqueAddresses[0] as string];

    await expect(
      sdk.canopy?.getBatchFungibleAssetBalances(inputAddresses, "0x111")
    ).resolves.toEqual(
      inputAddresses.map((address) => {
        const metadataAddress = normalizeMoveAddress(address);
        return {
          metadataAddress,
          balance: BigInt(metadataAddress),
        };
      })
    );

    expect(requestedChunks).toHaveLength(2);
    expect(requestedChunks[0]).toHaveLength(DEFAULT_VIEW_BATCH_SIZE);
    expect(requestedChunks[1]).toHaveLength(1);
    expect(requestedChunks.flat()).toEqual(
      uniqueAddresses.map((address) => normalizeMoveAddress(address))
    );
  });
});
