import { jest } from "@jest/globals";
import { getAbisForChain, type MoveModuleAbi } from "../packages/bindings/src";
import { CanopySdk } from "../packages/sdk/src";
import type {
  CanopyHelpersViewFunction,
  CanopyRouterFunction,
  CanopyVaultViewFunction,
} from "../packages/sdk/src/canopy/client";
import type {
  MeridianBatchViewFunction,
  MeridianRegistryViewFunction,
  MeridianRouterFunction,
  MeridianVaultViewFunction,
} from "../packages/sdk/src/alm/meridian/client";
import type {
  RewardsModuleFunction,
  RewardsRouterFunction,
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
 * Coverage limit, stated precisely: (2) and (3) are asserted for all 17 **rewards and
 * Meridian** builders — the 16 synchronous ones plus async
 * `buildStakeVaultSharesPayload`, which resolves offline when given explicit
 * `poolAddresses`. Canopy's three builders are excluded: they are async and read vault
 * state first, so their arity is covered by `check:payloads` against live fullnodes
 * rather than here.
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
});
