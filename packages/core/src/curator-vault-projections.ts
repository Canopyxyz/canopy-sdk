export const CURATOR_VAULT_U64_MAX = (1n << 64n) - 1n;
export const CURATOR_VAULT_SHARE_PRICE_PRECISION_E18 = 1_000_000_000_000_000_000n;

export type CuratorVaultAccountingState = {
  accountedVaultIdle: bigint;
  accountedStrategyIdle: bigint;
  vaultIdleShortfall: bigint;
  strategyIdleShortfall: bigint;
  reportedOffchainNav: bigint;
  lastNavUpdateAt: bigint;
  allocatedSinceLastReport: bigint;
  deallocatedSinceLastReport: bigint;
  lastTotalStrategyValue: bigint;
  capitalOutSinceLastNav: bigint;
  capitalInSinceLastNav: bigint;
  reservedAssetsTotal: bigint;
  rawShareSupply: bigint;
  fundedEscrowedSharesTotal: bigint;
  vaultHeldShares: bigint;
  totalLocked: bigint;
  lastProfitLockAt: bigint;
  activeLockDuration: bigint;
  highWaterMarkE18: bigint;
  lastFeeAccrualAt: bigint;
  managementFeeNumeratorRemainder: bigint;
  performanceFeeShareRemainderE18: bigint;
};

export type CuratorVaultNavFreshnessTier = { minTvl: bigint; maxAge: bigint };

export type CuratorVaultProjectionInput = {
  accounting: CuratorVaultAccountingState;
  depositCap?: bigint;
  adapterCap?: bigint;
  navFreshnessTiers: CuratorVaultNavFreshnessTier[];
  navFreshnessOverride?: bigint;
  hasPendingOffchainNavOverride: boolean;
  at: bigint;
};

export type CuratorVaultProjection = {
  custodiedVaultIdle: bigint;
  unreservedBuffer: bigint;
  custodiedStrategyIdle: bigint;
  effectiveReportedOffchainNav: bigint;
  observedStrategyTotal: bigint;
  expectedStrategyTotal: bigint;
  pricedStrategyTotal: bigint;
  conservativeStrategyTotal: bigint;
  grossTotalAssets: bigint;
  equityTotalAssets: bigint;
  lockedProfit: bigint;
  effectiveAssets: bigint;
  rawShareSupply: bigint;
  fundedEscrowedShares: bigint;
  equityShareSupply: bigint;
  externalFeeBaseSupply: bigint;
  sharePriceE18: bigint;
  depositCapHeadroom?: bigint;
  adapterCapHeadroom?: bigint;
  navFreshnessThreshold: bigint;
  isNavFresh: boolean;
  hasPendingOffchainNavOverride: boolean;
};

export type CuratorVaultVelocityDirection = "deposit" | "redemption";
export type CuratorVaultVelocityTier = "day" | "week" | "month";
export type CuratorVaultVelocityBucket = {
  direction: CuratorVaultVelocityDirection;
  tier: CuratorVaultVelocityTier;
  bucketEpoch: bigint;
  amount: bigint;
};
export type CuratorVaultVelocityUsage = { day: bigint; week: bigint; month: bigint };
export type CuratorVaultVelocityEpochBound = {
  bucketSeconds: bigint;
  minEpochInclusive: bigint;
  maxEpochInclusive: bigint;
};

const VELOCITY_TIERS: ReadonlyArray<{
  tier: CuratorVaultVelocityTier;
  bucketSeconds: bigint;
  windowEpochs: bigint;
}> = [
  { tier: "day", bucketSeconds: 3_600n, windowEpochs: 24n },
  { tier: "week", bucketSeconds: 14_400n, windowEpochs: 42n },
  { tier: "month", bucketSeconds: 86_400n, windowEpochs: 30n },
];

function checkedSub(value: bigint, amount: bigint, field: string): bigint {
  if (value < amount) {
    throw new RangeError(`curator vault accounting invariant: ${field} underflow`);
  }
  return value - amount;
}

function floorSub(value: bigint, amount: bigint): bigint {
  return value > amount ? value - amount : 0n;
}

function saturatingU64(value: bigint): bigint {
  return value > CURATOR_VAULT_U64_MAX ? CURATOR_VAULT_U64_MAX : value;
}

export function lockedProfitAt(accounting: CuratorVaultAccountingState, at: bigint): bigint {
  if (accounting.totalLocked === 0n || accounting.activeLockDuration === 0n) return 0n;
  const elapsed = at > accounting.lastProfitLockAt ? at - accounting.lastProfitLockAt : 0n;
  if (elapsed >= accounting.activeLockDuration) return 0n;
  return (accounting.totalLocked * (accounting.activeLockDuration - elapsed)) / accounting.activeLockDuration;
}

export function projectVaultAt(input: CuratorVaultProjectionInput): CuratorVaultProjection {
  const state = input.accounting;
  const custodiedVaultIdle = floorSub(state.accountedVaultIdle, state.vaultIdleShortfall);
  const custodiedStrategyIdle = floorSub(state.accountedStrategyIdle, state.strategyIdleShortfall);
  const effectiveReportedOffchainNav = floorSub(
    state.reportedOffchainNav + state.allocatedSinceLastReport,
    state.deallocatedSinceLastReport,
  );
  const observedStrategyTotal = custodiedStrategyIdle + effectiveReportedOffchainNav;
  const expectedStrategyTotal = floorSub(
    state.lastTotalStrategyValue + state.capitalOutSinceLastNav,
    state.capitalInSinceLastNav,
  );
  const pricedStrategyTotal =
    observedStrategyTotal < expectedStrategyTotal ? observedStrategyTotal : expectedStrategyTotal;
  const conservativeStrategyTotal =
    observedStrategyTotal > expectedStrategyTotal ? observedStrategyTotal : expectedStrategyTotal;
  const grossTotalAssets = custodiedVaultIdle + pricedStrategyTotal;
  const equityTotalAssets = checkedSub(grossTotalAssets, state.reservedAssetsTotal, "grossTotalAssets");
  const lockedProfit = lockedProfitAt(state, input.at);
  const effectiveAssets = floorSub(equityTotalAssets, lockedProfit);
  const equityShareSupply = checkedSub(
    state.rawShareSupply,
    state.fundedEscrowedSharesTotal,
    "rawShareSupply",
  );
  const externalFeeBaseSupply = checkedSub(equityShareSupply, state.vaultHeldShares, "equityShareSupply");
  const sharePriceE18 =
    equityShareSupply === 0n
      ? CURATOR_VAULT_SHARE_PRICE_PRECISION_E18
      : (effectiveAssets * CURATOR_VAULT_SHARE_PRICE_PRECISION_E18) / equityShareSupply;
  const matchingTiers = input.navFreshnessTiers.filter((tier) => grossTotalAssets >= tier.minTvl);
  let navFreshnessThreshold = matchingTiers.reduce(
    (strictest, tier) => (strictest === 0n || tier.maxAge < strictest ? tier.maxAge : strictest),
    0n,
  );
  if (
    matchingTiers.length > 0 &&
    input.navFreshnessOverride !== undefined &&
    input.navFreshnessOverride > navFreshnessThreshold
  ) {
    navFreshnessThreshold = input.navFreshnessOverride;
  }
  const isNavFresh =
    navFreshnessThreshold === 0n ||
    (state.lastNavUpdateAt === 0n && grossTotalAssets === 0n) ||
    (input.at >= state.lastNavUpdateAt && input.at - state.lastNavUpdateAt <= navFreshnessThreshold);

  return {
    custodiedVaultIdle,
    unreservedBuffer: floorSub(custodiedVaultIdle, state.reservedAssetsTotal),
    custodiedStrategyIdle,
    effectiveReportedOffchainNav,
    observedStrategyTotal,
    expectedStrategyTotal,
    pricedStrategyTotal,
    conservativeStrategyTotal,
    grossTotalAssets,
    equityTotalAssets,
    lockedProfit,
    effectiveAssets,
    rawShareSupply: state.rawShareSupply,
    fundedEscrowedShares: state.fundedEscrowedSharesTotal,
    equityShareSupply,
    externalFeeBaseSupply,
    sharePriceE18,
    ...(input.depositCap === undefined
      ? {}
      : { depositCapHeadroom: floorSub(input.depositCap, grossTotalAssets) }),
    ...(input.adapterCap === undefined
      ? {}
      : { adapterCapHeadroom: floorSub(input.adapterCap, conservativeStrategyTotal) }),
    navFreshnessThreshold,
    isNavFresh,
    hasPendingOffchainNavOverride: input.hasPendingOffchainNavOverride,
  };
}

export function activeVelocityEpochBoundsAt(
  at: bigint,
): Record<CuratorVaultVelocityTier, CuratorVaultVelocityEpochBound> {
  return Object.fromEntries(
    VELOCITY_TIERS.map(({ tier, bucketSeconds, windowEpochs }) => {
      const maxEpochInclusive = at / bucketSeconds;
      const minEpochInclusive =
        maxEpochInclusive < windowEpochs ? 0n : maxEpochInclusive - windowEpochs + 1n;
      return [tier, { bucketSeconds, minEpochInclusive, maxEpochInclusive }];
    }),
  ) as Record<CuratorVaultVelocityTier, CuratorVaultVelocityEpochBound>;
}

function activeVelocityTotal(
  buckets: CuratorVaultVelocityBucket[],
  tier: CuratorVaultVelocityTier,
  direction: CuratorVaultVelocityDirection,
  at: bigint,
): bigint {
  const bound = activeVelocityEpochBoundsAt(at)[tier];
  return buckets
    .filter(
      (bucket) =>
        bucket.tier === tier &&
        bucket.direction === direction &&
        bucket.bucketEpoch >= bound.minEpochInclusive &&
        bucket.bucketEpoch <= bound.maxEpochInclusive,
    )
    .reduce((total, bucket) => total + bucket.amount, 0n);
}

export function projectAggregateVelocityAt(
  buckets: CuratorVaultVelocityBucket[],
  at: bigint,
): { deposit: CuratorVaultVelocityUsage; redemption: CuratorVaultVelocityUsage } {
  const usage = (
    primary: CuratorVaultVelocityDirection,
    opposite: CuratorVaultVelocityDirection,
  ): CuratorVaultVelocityUsage => ({
    day: saturatingU64(
      floorSub(activeVelocityTotal(buckets, "day", primary, at), activeVelocityTotal(buckets, "day", opposite, at)),
    ),
    week: saturatingU64(
      floorSub(
        activeVelocityTotal(buckets, "week", primary, at),
        activeVelocityTotal(buckets, "week", opposite, at),
      ),
    ),
    month: saturatingU64(
      floorSub(
        activeVelocityTotal(buckets, "month", primary, at),
        activeVelocityTotal(buckets, "month", opposite, at),
      ),
    ),
  });
  return { deposit: usage("deposit", "redemption"), redemption: usage("redemption", "deposit") };
}

export function projectWalletVelocityAt(
  buckets: CuratorVaultVelocityBucket[],
  at: bigint,
): { deposit: CuratorVaultVelocityUsage; redemption: CuratorVaultVelocityUsage } {
  const usage = (direction: CuratorVaultVelocityDirection): CuratorVaultVelocityUsage => ({
    day: saturatingU64(activeVelocityTotal(buckets, "day", direction, at)),
    week: saturatingU64(activeVelocityTotal(buckets, "week", direction, at)),
    month: saturatingU64(activeVelocityTotal(buckets, "month", direction, at)),
  });
  return { deposit: usage("deposit"), redemption: usage("redemption") };
}
