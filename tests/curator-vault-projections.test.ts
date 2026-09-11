import {
  activeVelocityEpochBoundsAt,
  CURATOR_VAULT_U64_MAX,
  projectAggregateVelocityAt,
  projectVaultAt,
  projectWalletVelocityAt,
  remainingFundedShares,
  type CuratorVaultAccountingState,
} from "../packages/core/src";

function accounting(overrides: Partial<CuratorVaultAccountingState> = {}): CuratorVaultAccountingState {
  return {
    accountedVaultIdle: 0n,
    accountedStrategyIdle: 0n,
    vaultIdleShortfall: 0n,
    strategyIdleShortfall: 0n,
    reportedOffchainNav: 0n,
    lastNavUpdateAt: 0n,
    allocatedSinceLastReport: 0n,
    deallocatedSinceLastReport: 0n,
    lastTotalStrategyValue: 0n,
    capitalOutSinceLastNav: 0n,
    capitalInSinceLastNav: 0n,
    reservedAssetsTotal: 0n,
    rawShareSupply: 0n,
    fundedEscrowedSharesTotal: 0n,
    vaultHeldShares: 0n,
    totalLocked: 0n,
    lastProfitLockAt: 0n,
    activeLockDuration: 0n,
    highWaterMarkE18: 0n,
    lastFeeAccrualAt: 0n,
    managementFeeNumeratorRemainder: 0n,
    performanceFeeShareRemainderE18: 0n,
    ...overrides,
  };
}

describe("Curator Vault projections", () => {
  it("projects accounting, lock decay, cap headroom, and NAV freshness", () => {
    const result = projectVaultAt({
      accounting: accounting({
        accountedVaultIdle: 120n,
        vaultIdleShortfall: 20n,
        accountedStrategyIdle: 50n,
        strategyIdleShortfall: 10n,
        reportedOffchainNav: 60n,
        lastTotalStrategyValue: 100n,
        reservedAssetsTotal: 10n,
        rawShareSupply: 100n,
        fundedEscrowedSharesTotal: 10n,
        vaultHeldShares: 5n,
        totalLocked: 20n,
        lastProfitLockAt: 100n,
        activeLockDuration: 100n,
        lastNavUpdateAt: 100n,
      }),
      depositCap: 250n,
      adapterCap: 120n,
      navFreshnessTiers: [{ minTvl: 0n, maxAge: 50n }],
      hasPendingOffchainNavOverride: false,
      at: 150n,
    });

    expect(result).toMatchObject({
      custodiedVaultIdle: 100n,
      custodiedStrategyIdle: 40n,
      pricedStrategyTotal: 100n,
      grossTotalAssets: 200n,
      equityTotalAssets: 190n,
      lockedProfit: 10n,
      effectiveAssets: 180n,
      equityShareSupply: 90n,
      externalFeeBaseSupply: 85n,
      sharePriceE18: 2_000_000_000_000_000_000n,
      depositCapHeadroom: 50n,
      adapterCapHeadroom: 20n,
      isNavFresh: true,
    });
  });

  it("fails closed on impossible accounting", () => {
    expect(() =>
      projectVaultAt({
        accounting: accounting({ reservedAssetsTotal: 1n }),
        navFreshnessTiers: [],
        hasPendingOffchainNavOverride: false,
        at: 0n,
      }),
    ).toThrow(/grossTotalAssets underflow/);
    expect(() =>
      projectVaultAt({
        accounting: accounting({ fundedEscrowedSharesTotal: 1n }),
        navFreshnessTiers: [],
        hasPendingOffchainNavOverride: false,
        at: 0n,
      }),
    ).toThrow(/rawShareSupply underflow/);
  });

  it("projects contract-parity velocity expiry, netting, gross wallet use, and saturation", () => {
    const at = 25n * 3_600n;
    const buckets = [
      { direction: "deposit" as const, tier: "day" as const, bucketEpoch: 0n, amount: 100n },
      { direction: "deposit" as const, tier: "day" as const, bucketEpoch: 25n, amount: CURATOR_VAULT_U64_MAX + 50n },
      { direction: "redemption" as const, tier: "day" as const, bucketEpoch: 25n, amount: 20n },
    ];

    expect(activeVelocityEpochBoundsAt(at).day).toEqual({
      bucketSeconds: 3_600n,
      minEpochInclusive: 2n,
      maxEpochInclusive: 25n,
    });
    expect(projectAggregateVelocityAt(buckets, at).deposit.day).toBe(CURATOR_VAULT_U64_MAX);
    expect(projectAggregateVelocityAt(buckets, at).redemption.day).toBe(0n);
    expect(projectWalletVelocityAt(buckets, at).deposit.day).toBe(CURATOR_VAULT_U64_MAX);
    expect(projectWalletVelocityAt(buckets, at).redemption.day).toBe(20n);
  });

  it("projects remaining funded shares with contract floor division", () => {
    expect(remainingFundedShares(101n, 100n, 0n)).toBe(101n);
    expect(remainingFundedShares(101n, 100n, 50n)).toBe(51n);
    expect(remainingFundedShares(101n, 100n, 100n)).toBe(0n);
    expect(remainingFundedShares(101n, 3n, 1n)).toBe(68n);
    expect(remainingFundedShares(101n, 0n, 0n)).toBe(101n);
    expect(() => remainingFundedShares(101n, 100n, 101n)).toThrow(/claimedAmount exceeds fundedAmount/);
  });
});
