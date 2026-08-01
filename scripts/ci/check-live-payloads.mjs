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
 */
import process from "node:process";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const { createCanopySdk } = await import("../../dist/index.mjs");
const { getAbisForChain } = await import("../../dist/bindings.mjs");

const args = new Set(process.argv.slice(2));
const requestedChain = getArgValue("--chain");

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

const results = { passed: [], failed: [], skipped: [] };

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
  // `#[view]`, so the fullnode rejects it with "is not an view function". Recorded
  // as a skip rather than dropped, so the gap stays visible. Needs a contract change.
  results.skipped.push(
    `${chain} canopy.getStrategyDetails: vault::get_strategy_shares_balance is not marked #[view] on-chain (contract-side gap)`
  );

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
  let vaults;
  try {
    vaults = await meridian.listVaults({ limit: 1, offset: 0 });
    results.passed.push(`${chain} meridian.listVaults`);
  } catch (error) {
    results.failed.push({
      name: `${chain} meridian.listVaults`,
      stage: "view",
      message: message(error),
    });
    results.skipped.push(
      `${chain} meridian entry builders + vault views: listVaults failed, no vault fixture`
    );
    return;
  }

  const vaultAddress = vaults[0];
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

async function checkEntry(chain, label, aptos, build) {
  await checkEntryPlan(chain, label, aptos, async () => [await build()]);
}

async function checkEntryPlan(chain, label, aptos, buildAll) {
  const name = `${chain} ${label}`;

  let payloads;
  try {
    payloads = await buildAll();
  } catch (error) {
    results.failed.push({ name, stage: "build-payload", message: message(error) });
    return;
  }

  for (const [index, payload] of payloads.entries()) {
    const suffix = payloads.length > 1 ? `#${index}` : "";
    try {
      await aptos.transaction.build.simple({ sender: SENDER, data: payload });
      results.passed.push(`${name}${suffix}`);
    } catch (error) {
      results.failed.push({
        name: `${name}${suffix}`,
        stage: "build.simple",
        message: message(error),
      });
    }
  }
}

async function checkView(chain, label, read) {
  const name = `${chain} ${label}`;
  try {
    await read();
    results.passed.push(name);
  } catch (error) {
    results.failed.push({ name, stage: "view", message: message(error) });
  }
}

/** Optional ABIs (helper/batch modules) exist only on some chains. */
function hasAbi(chain, key) {
  return key in getAbisForChain(chain);
}

function message(error) {
  const text = error instanceof Error ? error.message : String(error);
  return text.replace(/\s+/g, " ").slice(0, 160);
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
  console.log(`\npayload/view check: ${results.passed.length} passed, ${results.failed.length} failed, ${results.skipped.length} skipped\n`);

  for (const name of results.passed) {
    console.log(`  pass  ${name}`);
  }

  // Skips are printed loudly: a silently narrowed check reads as full coverage.
  for (const reason of results.skipped) {
    console.log(`  SKIP  ${reason}`);
  }

  for (const failure of results.failed) {
    console.log(`  FAIL  ${failure.name}\n          [${failure.stage}] ${failure.message}`);
  }

  if (results.failed.length > 0) {
    console.log(`\n${results.failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log("\nall payload and view checks passed");
}
