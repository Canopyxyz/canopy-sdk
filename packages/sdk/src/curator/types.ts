/**
 * Amounts are `bigint`; addresses are normalized `0x` + 64 hex strings.
 *
 * Move enums (`PricingPolicy`, `StaleNavAction`, `RequestStatus`, `ReasonId`) are
 * plain `string` variant names rather than closed unions — `ReasonId` in particular
 * is append-only on the contract side, and a new variant must not break the build.
 */

/** `Option<u64>` reads decode to `null` for none, never `0`. */
export type OptionalAmount = bigint | null;

export interface CuratorRawAbortPath {
  errorCode: bigint;
  moduleName: string;
  packageAddress: string;
}

export interface CuratorBlockingReason {
  /** `ReasonId` variant name, e.g. `"DepositBelowMinimum"`, `"IdleBreachActive"`. */
  reasonId: string;
  rawAbort: CuratorRawAbortPath;
}

export interface CuratorVelocityUsage {
  day: bigint;
  month: bigint;
  week: bigint;
}

export interface CuratorVelocityCapCheck {
  aggregateDayHeadroom: OptionalAmount;
  aggregateMonthHeadroom: OptionalAmount;
  aggregateWeekHeadroom: OptionalAmount;
  passes: boolean;
  walletDayHeadroom: OptionalAmount;
  walletMonthHeadroom: OptionalAmount;
  walletWeekHeadroom: OptionalAmount;
}

/** `vault::vault_accounting` — the whole accounting dashboard in one read. */
export interface CuratorVaultAccounting {
  effectiveAssets: bigint;
  hasPendingOffchainNavOverride: boolean;
  isNavFresh: boolean;
  lastNavUpdateAt: bigint;
  lockedProfit: bigint;
  reportedOffchainNav: bigint;
  reservedForQueue: bigint;
  sharePriceE18: bigint;
  shareTotalSupply: bigint;
  strategyIdleAssets: bigint;
  totalAssets: bigint;
  unreservedBuffer: bigint;
}

/** `vault::liquidity_breakdown` — a subset of the accounting snapshot. */
export interface CuratorLiquidityBreakdown {
  reportedOffchainNav: bigint;
  reservedForQueue: bigint;
  strategyIdleAssets: bigint;
  totalAssets: bigint;
  unreservedBuffer: bigint;
}

/**
 * `vault::vault_config_view` — applied timelocked values only. Queued changes are
 * on the contract's `pending_*` views and are not part of the depositor surface.
 */
export interface CuratorVaultConfig {
  adapterCap: OptionalAmount;
  allocatorSlaSeconds: bigint;
  autoAllocateOnDeposit: boolean;
  depositCap: OptionalAmount;
  depositsPausedUntil: OptionalAmount;
  frictionlessThreshold: bigint;
  instantRedeemFeeBps: bigint;
  lockDuration: bigint;
  managementFeeBps: bigint;
  maxIdleInStrategyAmount: bigint;
  maxIdleInStrategyDuration: bigint;
  maxPendingLockedAssets: OptionalAmount;
  minDepositAmount: bigint;
  navDeviationThresholdBps: bigint;
  partnerAttributionEnabled: boolean;
  performanceFeeBps: bigint;
  /** `"LockedIn"` or `"Floating"`. */
  pricingPolicy: string;
  redemptionsPausedUntil: OptionalAmount;
  requestExpiryWindow: bigint;
  /** `"BlockDeposits"` or `"BlockAll"`. */
  staleNavAction: string;
  underlyingMetadata: string;
  withdrawalDelaySeconds: bigint;
}

export interface CuratorVault {
  accounting: CuratorVaultAccounting;
  config: CuratorVaultConfig;
  vaultAddress: string;
}

/**
 * `vault::user_position_view`.
 *
 * `shareValue` and `sharePriceE18` are on the raw `effective_assets / total_supply`
 * basis and do **not** pre-accrue fees — quote exact redemptions from
 * `previewInstantRedeem` / `previewQueuedRedemption` instead.
 *
 * A `null` velocity usage means the wallet has no recorded activity at all, which
 * is distinct from zero usage in the current windows.
 */
export interface CuratorUserPosition {
  depositWalletUsage: CuratorVelocityUsage | null;
  isSanctioned: boolean;
  isVaultBlocklisted: boolean;
  openRequestCount: bigint;
  redemptionWalletUsage: CuratorVelocityUsage | null;
  shareBalance: bigint;
  sharePriceE18: bigint;
  shareValue: bigint;
  userAddress: string;
  vaultAddress: string;
}

/** `vault::deposit_preview`. Gate field is `canDeposit`. */
export interface CuratorDepositPreview {
  adapterCapHeadroom: OptionalAmount;
  aggregateUsageAfter: CuratorVelocityUsage;
  blockingReasons: CuratorBlockingReason[];
  canDeposit: boolean;
  depositCapHeadroom: OptionalAmount;
  isNavFresh: boolean;
  isSanctioned: boolean;
  isVaultBlocklisted: boolean;
  mandatoryVelocityCheck: CuratorVelocityCapCheck;
  sharePriceE18: bigint;
  sharesOut: bigint;
  vaultVelocityCheck: CuratorVelocityCapCheck;
  walletUsageAfter: CuratorVelocityUsage;
}

/** `vault::instant_redeem_preview`. Gate field is `canRedeem`, not `canDeposit`. */
export interface CuratorInstantRedeemPreview {
  aggregateUsageAfter: CuratorVelocityUsage;
  assetsOut: bigint;
  blockingReasons: CuratorBlockingReason[];
  canRedeem: boolean;
  feeBps: bigint;
  feeShares: bigint;
  instantBufferRemaining: bigint;
  isNavFresh: boolean;
  isSanctioned: boolean;
  isVaultBlocklisted: boolean;
  isWithinFrictionlessThreshold: boolean;
  mandatoryVelocityCheck: CuratorVelocityCapCheck;
  vaultVelocityCheck: CuratorVelocityCapCheck;
  walletUsageAfter: CuratorVelocityUsage;
}

/**
 * `vault::queued_redemption_preview`. Gate field is `canSubmit` — this previews
 * submitting a request, not receiving assets.
 */
export interface CuratorQueuedRedemptionPreview {
  allocatorSlaSeconds: bigint;
  blockingReasons: CuratorBlockingReason[];
  canSubmit: boolean;
  estimatedAssetsOut: bigint;
  estimatedClaimableAt: bigint;
  isSanctioned: boolean;
  isVaultBlocklisted: boolean;
  pricingPolicy: string;
  requestExpiryAt: bigint;
  sharesToEscrow: bigint;
}

/**
 * `queue::request_detail`.
 *
 * `lockedAssetsOut` is `Some` only for LockedIn-priced vaults, where the payout is
 * fixed at submission; Floating vaults price at claim and report `null`.
 *
 * `fundedAmount` is `0` until an allocator funds the request — do not read it as a
 * funding requirement before then.
 */
export interface CuratorRedemptionRequest {
  claimableAt: bigint;
  claimedAmount: bigint;
  escrowedShares: bigint;
  expiresAt: bigint;
  frozenAt: OptionalAmount;
  fundedAmount: bigint;
  fundedAt: OptionalAmount;
  lockedAssetsOut: OptionalAmount;
  originalEscrowedShares: bigint;
  owner: string;
  pendingRecoveryAddress: string | null;
  pendingRecoveryNotBefore: OptionalAmount;
  requestAddress: string;
  /** `"Pending" | "Funded" | "Claimed" | "Cancelled" | "Denied" | "Expired" | "Frozen" | "Recovered"`. */
  status: string;
  /** Unix timestamp when the request entered the queue. */
  submittedAt: bigint;
}

// ── Inputs ──────────────────────────────────────────────────────────────────

export interface CuratorDepositPayloadInput {
  amount: bigint | number | string;
  minSharesOut?: bigint | number | string;
  vaultAddress: string;
}

export interface CuratorDepositWithPartnerPayloadInput extends CuratorDepositPayloadInput {
  partnerId: bigint | number | string;
}

export interface CuratorRedeemPayloadInput {
  minAssetsOut?: bigint | number | string;
  shares: bigint | number | string;
  vaultAddress: string;
}

export interface CuratorRequestPayloadInput {
  requestAddress: string;
  vaultAddress: string;
}

export interface CuratorDepositPreviewInput {
  amount: bigint | number | string;
  depositor: string;
  minSharesOut?: bigint | number | string;
  vaultAddress: string;
}

export interface CuratorRedeemPreviewInput {
  minAssetsOut?: bigint | number | string;
  shares: bigint | number | string;
  user: string;
  vaultAddress: string;
}

export interface CuratorUserVaultInput {
  userAddress: string;
  vaultAddress: string;
}

export interface CuratorQueueOwnerInput {
  ownerAddress: string;
  vaultAddress: string;
}

export interface ListCuratorVaultsInput {
  limit?: bigint | number;
  offset?: bigint | number;
}
