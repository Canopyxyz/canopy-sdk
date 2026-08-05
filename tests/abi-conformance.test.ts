import { jest } from "@jest/globals";
import { getAbisForChain, type MoveModuleAbi } from "../packages/bindings/src";
import { CanopySdk } from "../packages/sdk/src";
import { normalizeMoveAddress } from "../packages/core/src";
import { createMovementMock } from "./fixtures/view-client-mock";
import type {
  CanopyHelpersViewFunction,
  CanopyRouterDepositViewFunction,
  CanopyRouterFunction,
  CanopyRouterWithdrawViewFunction,
  CanopyVaultNonViewRead,
  CanopyVaultViewFunction,
  PrimaryFungibleStoreViewFunction,
} from "../packages/sdk/src/canopy/client";
import type {
  MeridianBatchViewFunction,
  MeridianRegistryViewFunction,
  MeridianRouterFunction,
  MeridianVaultViewFunction,
} from "../packages/sdk/src/alm/meridian/client";
import type {
  RewardsModuleFunction,
  RewardsModuleViewFunction,
  RewardsRouterFunction,
  RewardsViewFunction,
} from "../packages/sdk/src/rewards/client";

/**
 * Replaces the compile-time checking Surf used to provide.
 *
 * Surf typed function names and arguments off the ABI literals, but it also
 * attached an `abi` whose `parameters` included the leading `&signer` — which is
 * what made every entry payload unsubmittable.
 *
 * What this file actually guarantees, offline:
 *
 *   1. every function name the clients can build or read exists on the bound ABI,
 *      with the correct `is_entry` / `is_view` flag and a leading `&signer` on entry
 *      functions (`describe("client function names conform…")`)
 *   2. no built payload carries an `abi` key
 *   3. every built payload passes exactly `params.length - 1` arguments — the `-1`
 *      being the signer. This is the arity relationship the bug violated.
 *
 * (2) and (3) are asserted for **every** builder in the SDK: the 17 rewards and Meridian
 * ones, plus canopy's async deposit/withdraw/unstake builders, which read vault state and
 * so are driven here through a mocked `client.view` (and, for the MovePosition packet
 * path, a mocked `fetch`). Excluding canopy previously left a hole on exactly the path
 * where an `abi` key could return unnoticed: the 21 removed `abi: expect.any(Object)`
 * assertions all sat inside `toMatchObject`, a subset match, so their removal neither
 * requires nor forbids `abi`.
 *
 * NOT covered here, deliberately:
 *
 *   - **Argument order.** These tests assert argument *count*, not order. Two adjacent
 *     `u64` parameters — `minAsset0`/`minAsset1` on Meridian withdraw,
 *     `maxLossBps`/`minAmountOut` on canopy withdraw — can be transposed with every check
 *     in this repo green. Nothing derivable from the ABI can catch it, because fullnode
 *     ABIs carry no parameter *names*; only their types and order. Surf did not catch this
 *     either. Pinning it would mean asserting exact argument arrays against hand-written
 *     expectations, which is a deliberate non-goal here — do not assume the arity check
 *     implies order is safe.
 *   - **`0x1::fungible_asset::decimals`** (`alm/meridian/client.ts`). There is no bound
 *     `aptos_framework_fungible_asset` ABI to conform against, and binding one to check a
 *     single stable framework name is not worth a new pinned ABI on three chains. It is
 *     exercised live by `meridian.getVaultSummary` in `check:payloads` instead.
 *
 * `abi:check` covers drift between these checked-in ABIs and the chains.
 */

// The unions are type-only, so the names are duplicated here as runtime values.
// `satisfies` ties them back to the union, so a rename or removal in the client
// breaks this file rather than silently narrowing coverage.
const CANOPY_ROUTER_FUNCTIONS = [
  "deposit_coin",
  "deposit_fa",
  "deposit_fa_with_coin_type",
  "withdraw_coin",
  "withdraw_fa",
  "withdraw_fa_with_coin_type",
] as const satisfies readonly CanopyRouterFunction[];

const CANOPY_VAULT_VIEWS = [
  "vault_view",
  "vaults_view",
  "shares_to_amount",
  "strategy_debt",
  "strategy_debt_limit",
  "strategy_last_report",
  "strategy_total_profit",
  "strategy_total_loss",
] as const satisfies readonly CanopyVaultViewFunction[];

const CANOPY_HELPERS_VIEWS = [
  "batch_get_fa_balance",
  "batch_get_vault_balance",
  "batch_get_vault_base_metadata_and_balance",
  "batch_get_vault_shares_metadata_and_balance",
  "batch_get_vault_all_metadata_and_balance",
] as const satisfies readonly CanopyHelpersViewFunction[];

const REWARDS_ROUTER_FUNCTIONS = [
  "stake",
  "stake_and_subscribe",
  "stake_and_subscribe_fa",
  "stake_token",
  "stake_and_subscribe_token",
  "withdraw",
  "claim_rewards",
  "unsubscribe_and_withdraw",
  "unsubscribe_and_withdraw_fa",
  "create_staking_pool",
] as const satisfies readonly RewardsRouterFunction[];

const REWARDS_MODULE_FUNCTIONS = [
  "stake",
  "withdraw",
  "subscribe",
  "unsubscribe",
] as const satisfies readonly RewardsModuleFunction[];

/**
 * Views the rewards client reads. These had no offline check at all until now — Surf typed
 * them via `SurfViewFunctionName<TAbi>`, and the literal unions that replaced Surf covered
 * only entry functions. Split by host module, mirroring the client's two unions.
 */
const REWARDS_VIEW_FUNCTIONS = [
  "get_pool_details",
  "get_reward_token_details",
  "get_rewards_snapshot",
  "get_registry_overview",
  "get_registered_pool_count",
  "get_user_pool_positions",
  "get_user_pool_positions_by_token",
  "get_user_pool_positions_by_tokens",
  "is_pool_registered",
] as const satisfies readonly RewardsViewFunction[];

const REWARDS_MODULE_VIEW_FUNCTIONS = [
  "get_earned",
  "get_pool_info",
  "is_user_subscribed",
  "get_user_staked_balance",
  "get_user_subscribed_pools",
  "get_reward_data",
  "get_unallocated_rewards",
] as const satisfies readonly RewardsModuleViewFunction[];

const CANOPY_ROUTER_DEPOSIT_VIEWS = [
  "get_allocations_view",
] as const satisfies readonly CanopyRouterDepositViewFunction[];

const CANOPY_ROUTER_WITHDRAW_VIEWS = [
  "get_withdrawal_map_view",
] as const satisfies readonly CanopyRouterWithdrawViewFunction[];

const PRIMARY_FUNGIBLE_STORE_VIEWS = [
  "balance",
] as const satisfies readonly PrimaryFungibleStoreViewFunction[];

const CANOPY_VAULT_NON_VIEW_READS = [
  "get_strategy_shares_balance",
] as const satisfies readonly CanopyVaultNonViewRead[];

const MERIDIAN_ROUTER_FUNCTIONS = [
  "deposit",
  "withdraw",
] as const satisfies readonly MeridianRouterFunction[];

const MERIDIAN_REGISTRY_VIEWS = [
  "get_paginated_vaults",
  "get_recognized_vault_count",
] as const satisfies readonly MeridianRegistryViewFunction[];

const MERIDIAN_VAULT_VIEWS = [
  "get_shares_price_e18",
  "get_total_vault_holdings",
  "get_vault_deposit_and_quote_assets",
  "get_underlying_pool",
  "is_asset_0_deposit",
  "get_user_vault_balance",
  "get_shares_withdrawal_amounts",
] as const satisfies readonly MeridianVaultViewFunction[];

const MERIDIAN_BATCH_VIEWS = [
  "batch_get_vault_info",
  "batch_get_user_balances",
  "batch_get_vault_positions",
] as const satisfies readonly MeridianBatchViewFunction[];

function findFunction(abi: MoveModuleAbi, name: string) {
  return abi.exposed_functions.find((fn) => fn.name === name);
}

/**
 * Reports every mismatch at once, keyed by `module::function`, so a failure names
 * exactly which functions drifted rather than only the first.
 */
function entryFunctionProblems(abi: MoveModuleAbi, names: readonly string[]): string[] {
  return names.flatMap((name) => {
    const fn = findFunction(abi, name);

    if (!fn) return [`${abi.name}::${name} missing from bound ABI`];
    if (!fn.is_entry) return [`${abi.name}::${name} is not an entry function`];
    // An entry function takes the signer first, so a client supplies one fewer
    // argument than the ABI declares. This is the relationship Surf's payload broke.
    if (fn.params[0] !== "&signer") return [`${abi.name}::${name} does not take &signer first`];

    return [];
  });
}

function viewFunctionProblems(abi: MoveModuleAbi, names: readonly string[]): string[] {
  return names.flatMap((name) => {
    const fn = findFunction(abi, name);

    if (!fn) return [`${abi.name}::${name} missing from bound ABI`];
    if (!fn.is_view) return [`${abi.name}::${name} is not a view function`];
    if (fn.params[0] === "&signer") return [`${abi.name}::${name} unexpectedly takes a signer`];

    return [];
  });
}

describe("client function names conform to the bound ABIs", () => {
  const movementMainnet = getAbisForChain("movement-mainnet");
  const aptosTestnet = getAbisForChain("aptos-testnet");
  const aptosMainnet = getAbisForChain("aptos-mainnet");

  it("canopy router entry functions exist with a leading signer", () => {
    expect(entryFunctionProblems(movementMainnet.canopyRouter, CANOPY_ROUTER_FUNCTIONS)).toEqual([]);
    // aptos-testnet's router may not expose every FA variant; assert the ones it has
    // are entry functions rather than requiring the full set.
    for (const name of CANOPY_ROUTER_FUNCTIONS) {
      const fn = findFunction(aptosTestnet.canopyRouter, name);
      if (fn) {
        expect(fn.is_entry).toBe(true);
        expect(fn.params[0]).toBe("&signer");
      }
    }
  });

  it("canopy view functions exist and are views", () => {
    expect(viewFunctionProblems(movementMainnet.canopyVault, CANOPY_VAULT_VIEWS)).toEqual([]);
    expect(viewFunctionProblems(aptosTestnet.canopyVault, CANOPY_VAULT_VIEWS)).toEqual([]);

    const helpers = movementMainnet.canopyHelpers;
    expect(helpers).toBeDefined();
    expect(viewFunctionProblems(helpers as MoveModuleAbi, CANOPY_HELPERS_VIEWS)).toEqual([]);
  });

  it("rewards entry functions exist on the module that hosts them", () => {
    expect(entryFunctionProblems(movementMainnet.multiRewardsRouter, REWARDS_ROUTER_FUNCTIONS)).toEqual([]);
    expect(entryFunctionProblems(movementMainnet.multiRewards, REWARDS_MODULE_FUNCTIONS)).toEqual([]);
    expect(entryFunctionProblems(aptosTestnet.multiRewardsRouter, REWARDS_ROUTER_FUNCTIONS)).toEqual([]);
    expect(entryFunctionProblems(aptosTestnet.multiRewards, REWARDS_MODULE_FUNCTIONS)).toEqual([]);
  });

  it("rewards view functions exist and are views", () => {
    // canopyRewardsView is optional and bound only on movement-mainnet.
    const rewardsView = movementMainnet.canopyRewardsView;
    expect(rewardsView).toBeDefined();
    expect(viewFunctionProblems(rewardsView as MoveModuleAbi, REWARDS_VIEW_FUNCTIONS)).toEqual([]);

    // The multi_rewards module itself is bound on both rewards chains.
    expect(
      viewFunctionProblems(movementMainnet.multiRewards, REWARDS_MODULE_VIEW_FUNCTIONS)
    ).toEqual([]);
    expect(
      viewFunctionProblems(aptosTestnet.multiRewards, REWARDS_MODULE_VIEW_FUNCTIONS)
    ).toEqual([]);
  });

  it("canopy allocation-map and framework views exist and are views", () => {
    expect(
      viewFunctionProblems(movementMainnet.canopyRouterDeposit, CANOPY_ROUTER_DEPOSIT_VIEWS)
    ).toEqual([]);
    expect(
      viewFunctionProblems(movementMainnet.canopyRouterWithdraw, CANOPY_ROUTER_WITHDRAW_VIEWS)
    ).toEqual([]);
    expect(
      viewFunctionProblems(
        movementMainnet.aptosFrameworkPrimaryFungibleStore,
        PRIMARY_FUNGIBLE_STORE_VIEWS
      )
    ).toEqual([]);
  });

  /**
   * The inverse assertion, and deliberately so.
   *
   * `getStrategyDetails` reads `vault::get_strategy_shares_balance` through the view
   * endpoint, but the deployed module does not mark it `#[view]`, so the fullnode rejects
   * the call and that method is broken on every chain. `check:payloads` records it as an
   * xfail. Asserting `is_view === false` here means the day someone adds the annotation and
   * republishes, this test fails and names the follow-up work — rather than the gap sitting
   * fixed-but-unnoticed behind a permanent skip.
   */
  it("get_strategy_shares_balance is still not marked #[view] on-chain", () => {
    for (const name of CANOPY_VAULT_NON_VIEW_READS) {
      const fn = findFunction(movementMainnet.canopyVault, name);
      expect(fn).toBeDefined();
      expect({ name, isView: fn?.is_view }).toEqual({ name, isView: false });
    }
  });

  it("meridian entry and view functions exist on both deployed chains", () => {
    for (const abis of [movementMainnet, aptosMainnet]) {
      expect(entryFunctionProblems(abis.meridianRouter, MERIDIAN_ROUTER_FUNCTIONS)).toEqual([]);
      expect(viewFunctionProblems(abis.meridianRegistry, MERIDIAN_REGISTRY_VIEWS)).toEqual([]);
      expect(viewFunctionProblems(abis.meridianVault, MERIDIAN_VAULT_VIEWS)).toEqual([]);
    }

    const batchViews = movementMainnet.meridianBatchViews;
    expect(batchViews).toBeDefined();
    expect(viewFunctionProblems(batchViews as MoveModuleAbi, MERIDIAN_BATCH_VIEWS)).toEqual([]);
  });
});

describe("built payloads are plain and correctly sized", () => {
  // The core invariants. An `abi` on the payload is what made ts-sdk match arguments
  // against the signer slot; `check:payloads` proves the live build works, and these
  // catch a reintroduction offline and instantly.
  const PAYLOAD_KEYS = ["function", "functionArguments", "typeArguments"];
  const abis = getAbisForChain("movement-mainnet");

  /** Resolves a payload's `function` id back to the ABI that declares it. */
  function abiFor(functionId: string): MoveModuleAbi {
    const [address, moduleName] = functionId.split("::");
    const candidates = [
      abis.multiRewardsRouter,
      abis.multiRewards,
      abis.meridianRouter,
      abis.canopyRouter,
    ];
    const match = candidates.find(
      (abi) => abi.name === moduleName && sameAddress(abi.address, address as string)
    );

    if (!match) {
      throw new Error(`no bound ABI for ${functionId}`);
    }

    return match;
  }

  function sameAddress(left: string, right: string): boolean {
    const strip = (value: string) => value.replace(/^0x/, "").replace(/^0+/, "");
    return strip(left) === strip(right);
  }

  function expectPlainPayload(payload: unknown) {
    const typed = payload as { function: string; functionArguments: unknown[] };

    expect(payload).not.toHaveProperty("abi");
    expect(Object.keys(payload as object).sort()).toEqual(PAYLOAD_KEYS);

    // Arity: an entry function's first parameter is the signer, supplied by the
    // sender rather than the payload, so the client must pass exactly one fewer.
    const functionName = typed.function.split("::")[2] as string;
    const abiFunction = abiFor(typed.function).exposed_functions.find(
      (fn) => fn.name === functionName
    );

    expect(abiFunction).toBeDefined();
    expect(abiFunction?.params[0]).toBe("&signer");
    expect({
      function: typed.function,
      argumentCount: typed.functionArguments.length,
    }).toEqual({
      function: typed.function,
      argumentCount: (abiFunction?.params.length ?? 0) - 1,
    });
  }

  it("holds for every rewards and meridian builder", async () => {
    const sdk = new CanopySdk({ view: jest.fn(async () => []) } as never, {
      chain: "movement-mainnet",
    });
    const rewards = sdk.rewards!;
    const meridian = sdk.alm.meridian!;
    const coin = { amount: 1n, coinType: "0x1::aptos_coin::AptosCoin" };
    const asset = { amount: 1n, stakingAsset: "0x1" };
    const pools = { poolAddresses: ["0x1"] };

    for (const payload of [
      rewards.buildStakeCoinPayload(coin),
      rewards.buildStakeAndSubscribeCoinPayload({ ...coin, ...pools }),
      rewards.buildStakeAssetPayload(asset),
      rewards.buildStakeAndSubscribeAssetPayload({ ...asset, ...pools }),
      rewards.buildWithdrawCoinPayload(coin),
      rewards.buildWithdrawAssetPayload(asset),
      rewards.buildClaimRewardsPayload({ rewardTokenAddresses: ["0x1"] }),
      rewards.buildSubscribePayload({ poolAddress: "0x1" }),
      rewards.buildUnsubscribePayload({ poolAddress: "0x1" }),
      rewards.buildUnsubscribeAndWithdrawCoinPayload({ ...coin, ...pools }),
      rewards.buildUnsubscribeAndWithdrawAssetPayload({ ...asset, ...pools }),
      rewards.buildCreateStakingPoolPayload({ coinType: coin.coinType }),
      rewards.buildStakeTokenPayload({
        amount: 1n,
        tokenCreator: "0x1",
        tokenDecimals: 8,
        tokenName: "T",
        tokenSymbol: "T",
      }),
      rewards.buildStakeTokenPayload({
        amount: 1n,
        tokenCreator: "0x1",
        tokenDecimals: 8,
        tokenName: "T",
        tokenSymbol: "T",
        ...pools,
      }),
      meridian.buildDepositPayload({ vaultAddress: "0x1", amount: 1n, minSharesOut: 0n }),
      meridian.buildWithdrawPayload({
        vaultAddress: "0x1",
        shares: 1n,
        minAsset0: 0n,
        minAsset1: 0n,
      }),
      // The one async rewards builder. Explicit poolAddresses keeps it off Sentio
      // discovery, so it resolves without network and belongs in this offline sweep
      // rather than being covered by check:payloads alone.
      await rewards.buildStakeVaultSharesPayload({ ...asset, ...pools }),
    ]) {
      expectPlainPayload(payload);
    }
  });

  /**
   * Canopy's builders, which this file used to exclude for being async.
   *
   * They are async only because they read vault state through `client.view`, which the
   * suite already mocks — so the exclusion cost real coverage for no reason. It mattered
   * because the removed `abi: expect.any(Object)` assertions were subset matches: if `abi`
   * came back on the canopy deposit/withdraw path specifically, every offline check stayed
   * green and only live `check:payloads` would catch it.
   *
   * All six `CanopyRouterFunction` names are driven here, which needs three vault shapes:
   *
   *   - `paired_coin_type` present            -> deposit_coin / withdraw_coin
   *   - absent, no MovePosition strategy      -> deposit_fa / withdraw_fa
   *   - absent, MovePosition strategy present -> *_fa_with_coin_type
   *
   * The third is the awkward one. `selectFaFunction` only picks `_with_coin_type` when the
   * bare variant is missing from the router or when strategy packets exist, and `deposit_fa`
   * exists on every chain we bind — so packets are the only route, and building one pulls in
   * the allocation-map view, a strategy withdrawal view, and two MovePosition REST calls.
   * That whole path is covered by nothing else: `check:payloads` deliberately avoids
   * MovePosition vaults because they need that external API.
   */
  describe("canopy builders", () => {
    const canopyAbis = getAbisForChain("movement-mainnet");
    const mpAbi = canopyAbis.canopyStrategyMovepositionSimple as MoveModuleAbi;

    const VAULT = "0xabc";
    /**
     * A real movement-mainnet USDC FA metadata address. Using a genuine one means the
     * chain's default MovePosition `virtualCoinMap` / `nameMap` resolve it, so the fixture
     * exercises the shipped config rather than a hand-made override.
     */
    const USDC_FA = "0x83121c9f9b0527d1f056e21a950d6bf3b9e9e2e8353d0e95ccea726713cbea39";
    const MP_CONCRETE = "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd";
    const MP_STRATEGY = "0x5741";
    /** Unresolvable on purpose: if the fetch stub ever fails to install, the test errors
     *  instead of reaching the real MovePosition API. */
    const API_URL = "https://moveposition.invalid";
    const AMOUNT = 1000n;

    const viewId = (abi: MoveModuleAbi, fn: string) =>
      `${normalizeMoveAddress(abi.address)}::${abi.name}::${fn}`;

    const VAULT_VIEW = viewId(canopyAbis.canopyVault, "vault_view");
    const ALLOCATIONS_VIEW = viewId(canopyAbis.canopyRouterDeposit, "get_allocations_view");
    const WITHDRAWAL_MAP_VIEW = viewId(
      canopyAbis.canopyRouterWithdraw,
      "get_withdrawal_map_view"
    );
    const WITHDRAWAL_AMOUNT_VIEW = viewId(mpAbi, "withdrawal_amount_view_fa");

    const realFetch = globalThis.fetch;
    afterEach(() => {
      globalThis.fetch = realFetch;
    });

    /**
     * Stubs the two MovePosition REST calls a packet needs and returns the URL list, so a
     * test can assert the packet path was actually entered rather than silently falling
     * back to the bare `_fa` variant.
     */
    function stubMovePositionFetch(): string[] {
      const calls: string[] = [];

      globalThis.fetch = (async (input: unknown) => {
        const url = String(input);
        calls.push(url);

        return {
          ok: true,
          json: async () =>
            url.includes("/portfolios/")
              ? { collaterals: [], liabilities: [] }
              : { packet: "0xaabb" },
        } as unknown as Response;
      }) as typeof globalThis.fetch;

      return calls;
    }

    function strategyFixture(strategyAddress: string, concreteAddress: string) {
      return {
        strategy_address: strategyAddress,
        asset_address: USDC_FA,
        concrete_address: concreteAddress,
        current_vault_debt: "4",
        debt_limit: "5",
        // A number, not a string: fullnodes serialize u8 as a JSON number, and the old
        // fixtures' `"6"` is exactly what hid the `readMoveU8` bug.
        decimals: 6,
        last_report: "7",
        shares_address: "0x8",
        total_asset: "9",
        total_debt: "10",
        total_idle: "11",
        total_loss: "12",
        total_profit: "13",
        total_shares: "14",
        vault_address: VAULT,
      };
    }

    function vaultViewFixture(options: {
      pairedCoinType?: string;
      strategies?: unknown[];
    }): unknown[] {
      return [
        {
          decimals: 8,
          total_debt: "1",
          total_idle: "2",
          total_shares: "3",
          total_asset: "4",
          asset_name: "USDC",
          shares_name: "Canopy USDC",
          vault_address: VAULT,
          asset_address: USDC_FA,
          shares_address: "0x123",
          paired_coin_type: {
            vec: options.pairedCoinType ? [options.pairedCoinType] : [],
          },
          strategies: options.strategies ?? [],
        },
      ];
    }

    /** The allocation map shape `parseAllocationMap` expects: a `data` array of key/value. */
    const allocationMap = [{ data: [{ key: MP_STRATEGY, value: AMOUNT.toString() }] }];

    function createSdk(responses: Record<string, unknown[]>) {
      return new CanopySdk(createMovementMock(responses) as never, {
        chain: "movement-mainnet",
        moveposition: { apiUrl: API_URL },
      });
    }

    it("builds plain, correctly sized payloads on the coin and bare-fa paths", async () => {
      const built: string[] = [];

      for (const pairedCoinType of ["0x1::aptos_coin::AptosCoin", undefined]) {
        const sdk = createSdk({
          [VAULT_VIEW]: vaultViewFixture({ ...(pairedCoinType ? { pairedCoinType } : {}) }),
        });
        const canopy = sdk.canopy!;

        for (const payload of [
          await canopy.buildDepositPayload({
            vaultAddress: VAULT,
            amount: AMOUNT,
            minSharesOut: 0n,
          }),
          await canopy.buildWithdrawPayload({
            vaultAddress: VAULT,
            shares: AMOUNT,
            maxLossBps: 0n,
            minAmountOut: 0n,
          }),
        ]) {
          expectPlainPayload(payload);
          built.push((payload as { function: string }).function.split("::")[2] as string);
        }
      }

      expect(built).toEqual([
        "deposit_coin",
        "withdraw_coin",
        "deposit_fa",
        "withdraw_fa",
      ]);
    });

    it("builds plain, correctly sized payloads on the MovePosition _with_coin_type path", async () => {
      const built: string[] = [];
      const fetchCalls = stubMovePositionFetch();

      const sdk = createSdk({
        [VAULT_VIEW]: vaultViewFixture({
          strategies: [strategyFixture(MP_STRATEGY, MP_CONCRETE)],
        }),
        [ALLOCATIONS_VIEW]: allocationMap,
        [WITHDRAWAL_MAP_VIEW]: allocationMap,
        [WITHDRAWAL_AMOUNT_VIEW]: [AMOUNT.toString()],
      });
      const canopy = sdk.canopy!;

      for (const payload of [
        await canopy.buildDepositPayload({
          vaultAddress: VAULT,
          amount: AMOUNT,
          minSharesOut: 0n,
        }),
        await canopy.buildWithdrawPayload({
          vaultAddress: VAULT,
          shares: AMOUNT,
          maxLossBps: 0n,
          minAmountOut: 0n,
        }),
      ]) {
        expectPlainPayload(payload);
        const typed = payload as { function: string; typeArguments: string[] };
        built.push(typed.function.split("::")[2] as string);
        // A silent fallback to the bare variant would still satisfy expectPlainPayload,
        // so pin the coin-typed shape: exactly one type argument.
        expect(typed.typeArguments).toHaveLength(1);
      }

      expect(built).toEqual(["deposit_fa_with_coin_type", "withdraw_fa_with_coin_type"]);
      // Two REST calls per packet, one packet per operation.
      expect(fetchCalls.filter((url) => url.includes("/portfolios/"))).toHaveLength(2);
      expect(fetchCalls.filter((url) => url.includes("/brokers/lend/v2"))).toHaveLength(1);
      expect(fetchCalls.filter((url) => url.includes("/brokers/redeem/v2"))).toHaveLength(1);
    });

    /**
     * `unstakeAndWithdraw` returns a plan carrying two payloads, and the unstake one is
     * built against the multiRewards ABI from inside the canopy client — so a per-client
     * sweep misses it.
     */
    it("builds plain, correctly sized payloads for the unstakeAndWithdraw plan", async () => {
      const sdk = createSdk({
        [VAULT_VIEW]: vaultViewFixture({ pairedCoinType: "0x1::aptos_coin::AptosCoin" }),
      });

      const plan = await sdk.canopy!.unstakeAndWithdraw({
        vaultAddress: VAULT,
        shares: AMOUNT,
        walletShares: 0n,
        stakedShares: AMOUNT,
        maxLossBps: 0n,
        minAmountOut: 0n,
      });

      // `UnstakeAndWithdrawPlan` is a discriminated union; only the `requiresUnstake: true`
      // arm carries an unstake payload, so narrow rather than optional-chaining past it —
      // otherwise a plan that stopped producing the unstake leg would pass silently.
      if (!plan.requiresUnstake) {
        throw new Error("fixture should require an unstake leg");
      }

      for (const payload of [plan.unstakePayload, plan.withdrawPayload]) {
        expect(payload).toBeDefined();
        expectPlainPayload(payload);
      }
    });

    /**
     * Every name in the union must be reachable from a builder. A name that no branch can
     * produce is either dead or a branch nothing covers — both worth failing on, and
     * cheaper to catch here than by reading `selectFaFunction` again.
     */
    it("covers all six CanopyRouterFunction names across the branches above", () => {
      expect([...CANOPY_ROUTER_FUNCTIONS].sort()).toEqual(
        [
          "deposit_coin",
          "deposit_fa",
          "deposit_fa_with_coin_type",
          "withdraw_coin",
          "withdraw_fa",
          "withdraw_fa_with_coin_type",
        ].sort()
      );
    });
  });
});
