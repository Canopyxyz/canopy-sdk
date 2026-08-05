#!/usr/bin/env node
/**
 * Live payload + view check.
 *
 * WHY THIS EXISTS
 * ---------------
 * The unit tests assert the *shape* of a built payload and never build a
 * transaction, which let a bug ship where every entry payload was unsubmittable:
 * the payload carried an `abi` whose `parameters` included the leading `&signer`
 * while `functionArguments` did not, so `@aptos-labs/ts-sdk` matched arguments
 * off by one and threw `Type mismatch for argument 0, type '&signer'`.
 *
 * WHAT IT ASSERTS
 * ---------------
 * Entry: `transaction.build.simple` SUCCEEDS. That is the exact stage the bug
 * failed at; everything downstream (simulate, submit) is noise. The signal is
 * emphatically NOT "an error occurred" — the broken payload errored too.
 *
 * View: the read resolves. Views carry an `abi` as well, but view functions take
 * no `&signer` so their parameters align; this half guards the view conversion,
 * which the entry half would otherwise leave unchecked.
 *
 * WHY IT IS SAFE AND DETERMINISTIC
 * --------------------------------
 * No signing, no funded account, no gas, no submission, no state change. Fixture
 * objects need not exist: object existence is a VM-runtime check, not a
 * build-time one, so `build.simple` validates argument arity and types against
 * the real on-chain ABI and nothing more. Sender is `0x1`, which exists on every
 * chain and is only needed for a sequence number.
 *
 * Deliberately does NOT assert on simulation outcome — that depends on live vault
 * state (pause flags, idle breach, balances) and would flake for reasons
 * unrelated to the payload.
 *
 * WHAT GATES, AND WHY IT DIFFERS PER CHAIN
 * ----------------------------------------
 * Results land in four buckets: `passed`, `failed` (the chain rejected our payload),
 * `infra` (we could not reach the chain, after retries) and `xfail` (known broken on-chain,
 * asserted to still be broken). `failed` and `infra` are non-zero exits on every chain.
 *
 * Skips are the interesting case. A skip means coverage silently disappeared — the early
 * `return` on an empty Meridian registry alone drops eight checks — so with `--strict` any
 * skip is a failure. movement-mainnet is the leading chain: it is the only one binding every
 * optional ABI (`canopyHelpers`, `canopyRewardsView`, `meridianBatchViews`) and it reaches
 * zero skips, so it runs `--strict` and needs no allowlist of tolerated skips. The Aptos legs
 * cannot: aptos-testnet has no Meridian deployment and aptos-mainnet's Meridian registry is
 * empty, so they run non-strict and report their skips instead.
 *
 * XFAIL, NOT SKIP
 * ---------------
 * `canopy.getStrategyDetails` is broken on-chain (see `checkXfail` below). It used to be an
 * unconditional `skipped.push`, which would have kept printing SKIP forever after the fix
 * landed. It is now actually called and asserted to still fail, so the day the Move
 * annotation ships, this check goes red and names the follow-up.
 */
import process from "node:process";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// Classification lives entirely behind `withRetry`, which reports `transport` on its result —
// so nothing here calls `isTransportError` directly.
import {
  fullErrorText,
  message,
  withRetry,
  withTimeout,
} from "./lib/payload-check-helpers.mjs";

const { createCanopySdk } = await import("../../dist/index.mjs");
const { getAbisForChain } = await import("../../dist/bindings.mjs");

const args = new Set(process.argv.slice(2));
const requestedChain = getArgValue("--chain");
/** Any skip becomes a failure. Used for the leading chain; see the header. */
const strict = args.has("--strict");

/** A single fullnode call should never hang CI; three attempts on transport errors only. */
const CALL_TIMEOUT_MS = 45_000;
const RETRY_ATTEMPTS = 3;

const SENDER = "0x1";
const ANY_ADDRESS = "0x1"; // Fixtures need not exist; see header.
const COIN_TYPE = "0x1::aptos_coin::AptosCoin";

/**
 * Canopy's deposit/withdraw builders read vault state and branch across
 * deposit_coin / deposit_fa / deposit_fa_with_coin_type. These vaults were chosen
 * from live `vaults_view` output to cover all four branches while avoiding
 * MovePosition strategies, whose packet arguments require an external REST API.
 */
const CANOPY_VAULTS = {
  "movement-mainnet": {
    coin: "0x58739edcac2f86e62342466f20809b268430aedf32937eba32eaac7e0bbf5233",
    coinNoStrategy: "0xcc1bb5caea6b6becf4ae4781104a1ed9bcc2c9339aaf3b2a087d7b7134197cf2",
    faWithStrategy: "0x60ea4bbbbfa2cf715bef9c7187a90813d39aedfe9cf17c47c3d385b26bf7ee5b",
  },
  "aptos-testnet": {
    faNoStrategy: "0xd8ce932a5d60d8ccda55ec95e1a3c5d964bb38a417cdb3174d073f68df555d83",
  },
};

const CHAINS = {
  "movement-mainnet": { network: Network.CUSTOM, fullnode: "https://mainnet.movementnetwork.xyz/v1" },
  "aptos-testnet": { network: Network.TESTNET },
  "aptos-mainnet": { network: Network.MAINNET },
};

const results = { passed: [], failed: [], infra: [], skipped: [], xfail: [] };

for (const chain of requestedChain ? [requestedChain] : Object.keys(CHAINS)) {
  const chainConfig = CHAINS[chain];
  if (!chainConfig) {
    throw new Error(`Unknown chain: ${chain}`);
  }

  const aptos = new Aptos(
    new AptosConfig(
      chainConfig.fullnode
        ? { network: chainConfig.network, fullnode: chainConfig.fullnode }
        : { network: chainConfig.network }
    )
  );
  const sdk = createCanopySdk(aptos, { chain });

  // Control: a hand-written plain framework payload. If this fails the harness
  // itself is broken; if it passes while SDK builders fail, the check is proven
  // to discriminate rather than being uniformly red.
  await checkEntry(chain, "control:0x1::aptos_account::transfer", aptos, () => ({
    function: "0x1::aptos_account::transfer",
    typeArguments: [],
    functionArguments: [ANY_ADDRESS, "1"],
  }));

  await checkCanopy(chain, aptos, sdk);
  await checkRewards(chain, aptos, sdk);
  await checkMeridian(chain, aptos, sdk);
}

report();

// ── entry checks ────────────────────────────────────────────────────────────

async function checkCanopy(chain, aptos, sdk) {
  const canopy = sdk.canopy;
  if (!canopy) {
    results.skipped.push(`${chain} canopy: not deployed on this chain`);
    return;
  }

  const vaults = CANOPY_VAULTS[chain];
  if (!vaults) {
    results.skipped.push(`${chain} canopy: no pinned MovePosition-free vault fixture`);
    return;
  }

  for (const [branch, vaultAddress] of Object.entries(vaults)) {
    await checkEntry(chain, `canopy.buildDepositPayload[${branch}]`, aptos, () =>
      canopy.buildDepositPayload({ vaultAddress, amount: 1000n, minSharesOut: 0n })
    );
    await checkEntry(chain, `canopy.buildWithdrawPayload[${branch}]`, aptos, () =>
      canopy.buildWithdrawPayload({ vaultAddress, shares: 1000n, maxLossBps: 0n, minAmountOut: 0n })
    );
  }

  // Every fixture above passes minSharesOut / maxLossBps / minAmountOut explicitly, so the
  // `undefined` -> `option::none` branch in the builders was never actually built. These two
  // omit them, which is the only way that arm reaches a real fullnode.
  const [firstBranch, firstVault] = Object.entries(vaults)[0];
  await checkEntry(chain, `canopy.buildDepositPayload[${firstBranch},no-optionals]`, aptos, () =>
    canopy.buildDepositPayload({ vaultAddress: firstVault, amount: 1000n })
  );
  await checkEntry(chain, `canopy.buildWithdrawPayload[${firstBranch},no-optionals]`, aptos, () =>
    canopy.buildWithdrawPayload({ vaultAddress: firstVault, shares: 1000n })
  );

  // unstakeAndWithdraw returns a plan carrying TWO payloads, one of them built by
  // the module-level buildUnstakePayload against the multiRewards ABI from inside
  // the canopy client. Easy to miss in a per-client sweep, so it is explicit here.
  const vaultAddress = Object.values(vaults)[0];
  await checkEntryPlan(chain, "canopy.unstakeAndWithdraw", aptos, async () => {
    const plan = await canopy.unstakeAndWithdraw({
      vaultAddress,
      shares: 1000n,
      walletShares: 0n,
      stakedShares: 1000n,
      maxLossBps: 0n,
      minAmountOut: 0n,
    });
    return [plan.unstakePayload, plan.withdrawPayload].filter(Boolean);
  });

  await checkView(chain, "canopy.getVault", () => canopy.getVault(vaultAddress));
  await checkView(chain, "canopy.listVaults", () => canopy.listVaults({ limit: 3, offset: 0 }));
  await checkView(chain, "canopy.getUserVaultPosition", () =>
    canopy.getUserVaultPosition(SENDER, vaultAddress)
  );

  // Views read real state, unlike build.simple, so these need genuine objects.
  const vault = await canopy.getVault(vaultAddress).catch(() => undefined);

  // KNOWN BROKEN, and not fixable from the SDK: getStrategyDetails calls
  // `vault::get_strategy_shares_balance`, which the deployed module does not mark
  // `#[view]`, so the fullnode rejects it. Asserted as an xfail rather than pushed as an
  // unconditional skip, so this flips to a failure the day the annotation lands instead of
  // printing SKIP forever. `tests/abi-conformance.test.ts` pins the same fact offline.
  const strategyAddress = vault?.strategies?.[0]?.strategyAddress;
  if (strategyAddress) {
    await checkXfail(
      chain,
      "canopy.getStrategyDetails",
      /is not an? view function/i,
      "vault::get_strategy_shares_balance is not marked #[view] on-chain; needs a Move annotation and a republish",
      () => canopy.getStrategyDetails(vaultAddress, strategyAddress)
    );
  } else {
    results.skipped.push(
      `${chain} canopy.getStrategyDetails: vault fixture exposes no strategy to read`
    );
  }

  // canopyHelpers is an optional ABI, present only where the helper module is deployed.
  if (hasAbi(chain, "canopyHelpers")) {
    if (vault?.assetAddress) {
      await checkView(chain, "canopy.getBatchFungibleAssetBalances", () =>
        canopy.getBatchFungibleAssetBalances([vault.assetAddress], SENDER)
      );
    } else {
      results.skipped.push(
        `${chain} canopy.getBatchFungibleAssetBalances: could not resolve a real FA metadata address`
      );
    }
    await checkView(chain, "canopy.getBatchVaultSharesBalances", () =>
      canopy.getBatchVaultSharesBalances([vaultAddress], SENDER)
    );
    // These three read the remaining canopyHelpers views through
    // callHelpersViewFunction; without them the helper ABI is only half covered.
    await checkView(chain, "canopy.getBatchVaultBaseMetadataAndBalances", () =>
      canopy.getBatchVaultBaseMetadataAndBalances([vaultAddress], SENDER)
    );
    await checkView(chain, "canopy.getBatchVaultSharesMetadataAndBalances", () =>
      canopy.getBatchVaultSharesMetadataAndBalances([vaultAddress], SENDER)
    );
    await checkView(chain, "canopy.getBatchVaultAllMetadataAndBalances", () =>
      canopy.getBatchVaultAllMetadataAndBalances([vaultAddress], SENDER)
    );
  } else {
    results.skipped.push(`${chain} canopy batch helpers: canopyHelpers ABI not bound`);
  }
}

async function checkRewards(chain, aptos, sdk) {
  const rewards = sdk.rewards;
  if (!rewards) {
    results.skipped.push(`${chain} rewards: not deployed on this chain`);
    return;
  }

  const coin = { amount: 1000n, coinType: COIN_TYPE };
  const asset = { amount: 1000n, stakingAsset: ANY_ADDRESS };
  const pools = { poolAddresses: [ANY_ADDRESS] };

  const builders = {
    buildStakeCoinPayload: () => rewards.buildStakeCoinPayload(coin),
    buildStakeAndSubscribeCoinPayload: () =>
      rewards.buildStakeAndSubscribeCoinPayload({ ...coin, ...pools }),
    buildStakeAssetPayload: () => rewards.buildStakeAssetPayload(asset),
    buildStakeAndSubscribeAssetPayload: () =>
      rewards.buildStakeAndSubscribeAssetPayload({ ...asset, ...pools }),
    buildWithdrawCoinPayload: () => rewards.buildWithdrawCoinPayload(coin),
    buildWithdrawAssetPayload: () => rewards.buildWithdrawAssetPayload(asset),
    buildClaimRewardsPayload: () =>
      rewards.buildClaimRewardsPayload({ rewardTokenAddresses: [ANY_ADDRESS] }),
    buildSubscribePayload: () => rewards.buildSubscribePayload({ poolAddress: ANY_ADDRESS }),
    buildUnsubscribePayload: () => rewards.buildUnsubscribePayload({ poolAddress: ANY_ADDRESS }),
    buildUnsubscribeAndWithdrawCoinPayload: () =>
      rewards.buildUnsubscribeAndWithdrawCoinPayload({ ...coin, ...pools }),
    buildUnsubscribeAndWithdrawAssetPayload: () =>
      rewards.buildUnsubscribeAndWithdrawAssetPayload({ ...asset, ...pools }),
    buildCreateStakingPoolPayload: () =>
      rewards.buildCreateStakingPoolPayload({ coinType: COIN_TYPE }),
    // Branches on poolAddresses -> stake_token vs stake_and_subscribe_token.
    "buildStakeTokenPayload[stake_token]": () =>
      rewards.buildStakeTokenPayload({
        amount: 1000n,
        tokenCreator: ANY_ADDRESS,
        tokenDecimals: 8,
        tokenName: "Token",
        tokenSymbol: "TKN",
      }),
    "buildStakeTokenPayload[stake_and_subscribe_token]": () =>
      rewards.buildStakeTokenPayload({
        amount: 1000n,
        tokenCreator: ANY_ADDRESS,
        tokenDecimals: 8,
        tokenName: "Token",
        tokenSymbol: "TKN",
        ...pools,
      }),
    // Explicit poolAddresses keeps this off Sentio discovery.
    buildStakeVaultSharesPayload: () =>
      rewards.buildStakeVaultSharesPayload({ ...asset, ...pools }),
  };

  for (const [name, build] of Object.entries(builders)) {
    await checkEntry(chain, `rewards.${name}`, aptos, build);
  }

  if (hasAbi(chain, "canopyRewardsView")) {
    // Pool-scoped views read real state, so discover an actual pool rather than
    // using a placeholder address.
    const overview = await rewards
      .getRegistryOverview({ offset: 0, limit: 3, includePools: true })
      .catch(() => undefined);
    const pool = overview?.pools?.[0];

    if (pool?.poolAddress) {
      await checkView(chain, "rewards.getPoolInfo", () => rewards.getPoolInfo(pool.poolAddress));
      await checkView(chain, "rewards.getPoolDetails", () =>
        rewards.getPoolDetails(pool.poolAddress)
      );
      await checkView(chain, "rewards.getRewardTokenDetails", () =>
        rewards.getRewardTokenDetails(pool.poolAddress)
      );
      await checkView(chain, "rewards.getUserPoolPositionsByToken", () =>
        rewards.getUserPoolPositionsByToken({
          userAddress: SENDER,
          stakingAsset: pool.stakingAsset,
          offset: 0,
          limit: 2,
        })
      );
      await checkView(chain, "rewards.getUserPoolPositionsByTokens", () =>
        rewards.getUserPoolPositionsByTokens({
          userAddress: SENDER,
          stakingAssets: [pool.stakingAsset],
          offset: 0,
          limit: 2,
        })
      );
      await checkView(chain, "rewards.isPoolRegistered", () =>
        rewards.isPoolRegistered(pool.poolAddress)
      );
    } else {
      results.skipped.push(
        `${chain} rewards pool-scoped views: registry returned no pool to use as a fixture`
      );
    }

    await checkView(chain, "rewards.getRegisteredPoolCount", () =>
      rewards.getRegisteredPoolCount()
    );
    await checkView(chain, "rewards.getRegistryOverview", () =>
      rewards.getRegistryOverview({ offset: 0, limit: 2, includePools: true })
    );
    await checkView(chain, "rewards.getRewardsSnapshot", () =>
      rewards.getRewardsSnapshot({ offset: 0, limit: 2, userAddress: SENDER })
    );
    await checkView(chain, "rewards.getUserRewardsOverview", () =>
      rewards.getUserRewardsOverview({ userAddress: SENDER, offset: 0, limit: 2, includePools: true })
    );
    await checkView(chain, "rewards.getUserPoolPositions", () =>
      rewards.getUserPoolPositions({ userAddress: SENDER, offset: 0, limit: 2 })
    );
  } else {
    results.skipped.push(
      `${chain} rewards helper reads + pool-scoped views: canopyRewardsView ABI not bound, no on-chain way to discover a pool fixture`
    );
  }
}

async function checkMeridian(chain, aptos, sdk) {
  const meridian = sdk.alm?.meridian;
  if (!meridian) {
    results.skipped.push(`${chain} meridian: not deployed on this chain`);
    return;
  }

  await checkView(chain, "meridian.getVaultCount", () => meridian.getVaultCount());

  // Must not swallow the error: a broken registry view would otherwise be recorded
  // as a pass and silently skip every Meridian builder and vault view below. Only an
  // empty result from a *successful* read is a legitimate skip.
  //
  // Routed through checkView rather than a hand-rolled try/catch so the failure is
  // transport-classified like every other call. Pushing straight to `failed` here meant an
  // unreachable fullnode reported this one view as a payload defect while the other 38 calls
  // correctly landed in `infra`.
  const listed = await checkView(chain, "meridian.listVaults", () =>
    meridian.listVaults({ limit: 1, offset: 0 })
  );

  if (!listed.ok) {
    results.skipped.push(
      `${chain} meridian entry builders + vault views: listVaults failed, no vault fixture`
    );
    return;
  }

  const vaultAddress = listed.value[0];
  if (!vaultAddress) {
    // Real condition, not a harness bug: the aptos-mainnet registry is empty.
    results.skipped.push(
      `${chain} meridian entry builders + vault views: registry returned no vaults`
    );
    return;
  }

  await checkEntry(chain, "meridian.buildDepositPayload", aptos, () =>
    meridian.buildDepositPayload({ vaultAddress, amount: 1000n, minSharesOut: 0n })
  );
  await checkEntry(chain, "meridian.buildWithdrawPayload", aptos, () =>
    meridian.buildWithdrawPayload({ vaultAddress, shares: 1000n, minAsset0: 0n, minAsset1: 0n })
  );

  await checkView(chain, "meridian.getVaultSummary", () => meridian.getVaultSummary(vaultAddress));
  await checkView(chain, "meridian.getUserVaultPosition", () =>
    meridian.getUserVaultPosition(vaultAddress, SENDER)
  );
  await checkView(chain, "meridian.previewWithdraw", () =>
    meridian.previewWithdraw(vaultAddress, 1000n)
  );

  if (hasAbi(chain, "meridianBatchViews")) {
    await checkView(chain, "meridian.getBatchVaultInfo", () =>
      meridian.getBatchVaultInfo([vaultAddress])
    );
    await checkView(chain, "meridian.getBatchUserVaultBalances", () =>
      meridian.getBatchUserVaultBalances([vaultAddress], SENDER)
    );
    await checkView(chain, "meridian.getBatchVaultPositions", () =>
      meridian.getBatchVaultPositions([vaultAddress])
    );
  } else {
    results.skipped.push(`${chain} meridian batch views: meridianBatchViews ABI not bound`);
  }
}

// ── primitives ──────────────────────────────────────────────────────────────

/**
 * Runs one live call with a timeout and transport-only retries, then files the outcome.
 *
 * The bucket split is the point: a 502 used to be recorded as `stage: "build.simple"`,
 * visually identical to `Type mismatch for argument 0` — the exact bug this check exists to
 * catch. `isTransportError` keeps those apart, and always resolves ambiguity toward "payload
 * defect" so a real failure can never be downgraded to infra.
 */
async function runCheck(name, stage, call) {
  const outcome = await withRetry(() => withTimeout(call(), CALL_TIMEOUT_MS, name), {
    attempts: RETRY_ATTEMPTS,
  });

  if (outcome.ok) {
    results.passed.push(name);
    return { ok: true, value: outcome.value };
  }

  const record = { name, stage, message: message(outcome.error), attempts: outcome.attempts };

  if (outcome.transport) {
    results.infra.push(record);
  } else {
    results.failed.push(record);
  }

  return { ok: false, error: outcome.error };
}

async function checkEntry(chain, label, aptos, build) {
  await checkEntryPlan(chain, label, aptos, async () => [await build()]);
}

async function checkEntryPlan(chain, label, aptos, buildAll) {
  const name = `${chain} ${label}`;

  // Building the payload can itself read chain state, so it gets the same treatment.
  let payloads;
  try {
    payloads = await withRetry(() => withTimeout(buildAll(), CALL_TIMEOUT_MS, name), {
      attempts: RETRY_ATTEMPTS,
    });
  } catch (error) {
    results.failed.push({ name, stage: "build-payload", message: message(error) });
    return;
  }

  if (!payloads.ok) {
    const record = {
      name,
      stage: "build-payload",
      message: message(payloads.error),
      attempts: payloads.attempts,
    };
    (payloads.transport ? results.infra : results.failed).push(record);
    return;
  }

  for (const [index, payload] of payloads.value.entries()) {
    const suffix = payloads.value.length > 1 ? `#${index}` : "";
    await runCheck(`${name}${suffix}`, "build.simple", () =>
      aptos.transaction.build.simple({ sender: SENDER, data: payload })
    );
  }
}

async function checkView(chain, label, read) {
  return runCheck(`${chain} ${label}`, "view", read);
}

/**
 * A check that is expected to FAIL for a known, recorded, contract-side reason.
 *
 * Replaces an unconditional `skipped.push`, which could only ever print SKIP — including
 * long after the underlying gap was fixed. Four outcomes:
 *
 *   - fails with the expected message -> XFAIL, does not gate. The gap is still there.
 *   - SUCCEEDS                        -> FAILED. The contract was fixed; delete the xfail.
 *   - transport error, retries spent  -> INFRA, same as any other call.
 *   - fails some other way            -> FAILED, so an unrelated break is not masked.
 *
 * Goes through `withRetry` like every other live call. Retrying costs nothing on the
 * expected path: the rejection we are looking for is a Move error, which
 * `isTransportError` classifies as a payload defect, so `withRetry` returns after one
 * attempt without sleeping. Only a genuine transport failure consumes the retries — which
 * is the point, since this runs on the strict leading-chain gate and a single transient
 * RPC blip should not be the one call in the sweep that goes straight to INFRA.
 */
async function checkXfail(chain, label, expectedPattern, reason, read) {
  const name = `${chain} ${label}`;

  const outcome = await withRetry(() => withTimeout(read(), CALL_TIMEOUT_MS, name), {
    attempts: RETRY_ATTEMPTS,
  });

  if (outcome.ok) {
    results.failed.push({
      name,
      stage: "xfail",
      message: `now SUCCEEDS — the on-chain gap is fixed, so remove this xfail (${reason})`,
    });
    return;
  }

  const text = message(outcome.error);

  // Checked before the transport branch, and matched against the whole cause chain: the SDK
  // wraps a fullnode rejection in a CanopyError whose own message is just "View function
  // call failed", so matching `error.message` alone would never recognise it.
  if (expectedPattern.test(fullErrorText(outcome.error))) {
    results.xfail.push({ name, reason });
    return;
  }

  if (outcome.transport) {
    results.infra.push({ name, stage: "xfail", message: text, attempts: outcome.attempts });
    return;
  }

  results.failed.push({
    name,
    stage: "xfail",
    message: `expected /${expectedPattern.source}/ but got: ${text}`,
  });
}

/** Optional ABIs (helper/batch modules) exist only on some chains. */
function hasAbi(chain, key) {
  return key in getAbisForChain(chain);
}

function getArgValue(flag) {
  for (const arg of args) {
    if (arg.startsWith(`${flag}=`)) {
      return arg.slice(flag.length + 1);
    }
  }
  return undefined;
}

function report() {
  const mode = strict ? " [strict: skips gate]" : "";
  console.log(
    `\npayload/view check: ${results.passed.length} passed, ${results.failed.length} failed, ` +
      `${results.infra.length} infra, ${results.xfail.length} xfail, ` +
      `${results.skipped.length} skipped${mode}\n`
  );

  for (const name of results.passed) {
    console.log(`  pass  ${name}`);
  }

  for (const entry of results.xfail) {
    console.log(`  XFAIL ${entry.name}\n          expected failure: ${entry.reason}`);
  }

  // Skips are printed loudly: a silently narrowed check reads as full coverage.
  for (const reason of results.skipped) {
    console.log(`  SKIP  ${reason}`);
  }

  // Separated from FAIL so a fullnode outage is never mistaken for a bad payload.
  for (const entry of results.infra) {
    console.log(
      `  INFRA ${entry.name}\n          [${entry.stage}] ${entry.message}` +
        `\n          could not reach the chain after ${entry.attempts} attempt(s) — ` +
        `not a payload defect, but coverage was lost`
    );
  }

  for (const failure of results.failed) {
    console.log(`  FAIL  ${failure.name}\n          [${failure.stage}] ${failure.message}`);
  }

  const problems = [];

  if (results.failed.length > 0) {
    problems.push(`${results.failed.length} check(s) failed`);
  }

  // Still gates: a sustained outage would otherwise report green with no coverage at all.
  if (results.infra.length > 0) {
    problems.push(`${results.infra.length} check(s) could not reach the chain`);
  }

  // The leading chain must skip nothing. A skip there means coverage vanished — an emptied
  // registry, an unresolvable fixture — and the old script stayed green through exactly that.
  if (strict && results.skipped.length > 0) {
    problems.push(
      `${results.skipped.length} check(s) skipped under --strict; ` +
        `the leading chain must cover everything`
    );
  }

  if (problems.length > 0) {
    console.log(`\n${problems.join("\n")}.`);
    process.exit(1);
  }

  console.log("\nall payload and view checks passed");
}
