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

/**
 * `vault::vault_accounting` — the whole accounting dashboard in one read.
 *
 * Asset figures are **recognized (custodied) balances, not raw token stores**. Custody
 * credit moves only on authenticated flows, so a raw balance can lower recognized idle
 * but never raise it above its credit:
 *
 * ```text
 * custodiedVaultIdle = min(rawVaultIdle, accountedVaultIdle)
 * strategyIdleAssets = min(rawStrategyIdle, accountedStrategyIdle)
 * unreservedBuffer   = max(custodiedVaultIdle - reservedForQueue, 0)
 * totalAssets        = custodiedVaultIdle + min(observedStrategyTotal, expectedStrategyTotal)
 * effectiveAssets    = max(equityTotalAssets - lockedProfit, 0)
 * sharePriceE18      = equityShareSupply === 0n
 *                        ? 10n ** 18n
 *                        : (effectiveAssets * 10n ** 18n) / equityShareSupply
 * ```
 *
 * A **vault-idle** deficit directly reduces the vault leg and therefore pricing. A
 * **strategy-idle** deficit reduces recognized idle but may leave pricing unchanged,
 * because `expectedStrategyTotal` remains the binding lower bound. A raw surplus is
 * excluded from pricing either way and can only leave via the permissionless sweep to
 * the governed recovery address.
 */
export interface CuratorVaultAccounting {
  effectiveAssets: bigint;
  /**
   * `total_supply - funded_escrowed_shares_total` — the supply that still participates
   * in NAV drift. Distinct from `equityTotalAssets`, which nets off a different
   * quantity: once a request is funded its shares and its assets are both fixed debt.
   */
  equityShareSupply: bigint;
  /** `total_assets - reserved_assets_total`, i.e. excluding assets reserved for the queue. */
  equityTotalAssets: bigint;
  /** Escrowed shares belonging to already-funded requests; fixed debt, not live equity. */
  fundedEscrowedShares: bigint;
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

/**
 * `vault::liquidity_breakdown` — a subset of the accounting snapshot.
 *
 * Same recognized-balance basis as {@link CuratorVaultAccounting}: these are custodied
 * figures, not raw token stores.
 */
export interface CuratorLiquidityBreakdown {
  reportedOffchainNav: bigint;
  reservedForQueue: bigint;
  strategyIdleAssets: bigint;
  totalAssets: bigint;
  unreservedBuffer: bigint;
}

/**
 * `vault::IdleLimits` — the allocator's idle-capital ceiling, as a pair.
 *
 * Nested rather than flattened because the Move type is `Option<IdleLimits>`: either
 * both limits are configured or neither is. Two independent optionals could express
 * "amount but no duration", which the contract cannot represent.
 */
export interface CuratorIdleLimits {
  maxIdleInStrategyAmount: bigint;
  maxIdleInStrategyDuration: bigint;
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
  /** `null` when the vault sets no idle-capital ceiling. */
  idleLimits: CuratorIdleLimits | null;
  instantRedeemFeeBps: bigint;
  lockDuration: bigint;
  managementFeeBps: bigint;
  maxPendingLockedAssets: OptionalAmount;
  minDepositAmount: bigint;
  /**
   * The **stored/configured** 24h share-price deviation limit.
   *
   * The enforced value is this clamped to the current `SystemBounds` — read it with
   * `getEffectiveNav24hSharePriceDeviationBps`, which can be lower than this field.
   */
  nav24hSharePriceDeviationBps: bigint;
  navDeviationThresholdBps: bigint;
  normalNavReportIntervalSeconds: bigint;
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
 * `shareValue` and `sharePriceE18` are on the `effective_assets / equity_share_supply`
 * basis — the supply nets off shares already escrowed for funded requests — and they do
 * **not** pre-accrue fees. Quote exact redemptions from `previewInstantRedeem` /
 * `previewQueuedRedemption` instead.
 *
 * A `null` velocity usage means the wallet has no recorded activity at all, which
 * is distinct from zero usage in the current windows.
 */
export interface CuratorUserPosition {
  depositWalletUsage: CuratorVelocityUsage | null;
  isSanctioned: boolean;
  isVaultBlocklisted: boolean;
  openRequestCount: bigint;
  /**
   * The vault could not walk this account's object-ownership chain to its end.
   *
   * A third gate alongside `isSanctioned` / `isVaultBlocklisted`: when true the
   * vault cannot establish who ultimately owns the position, so deposits and
   * redemptions are refused. Check the previews for the authoritative answer.
   */
  ownershipChainTooDeep: boolean;
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
  /**
   * The force-processing deadline that would be snapshotted if this request were
   * submitted now. On a live request the equivalent stored value is
   * {@link CuratorRedemptionRequest.storedForceProcessAt}.
   */
  forceProcessAt: bigint;
  pricingPolicy: string;
  requestExpiryAt: bigint;
  sharesToEscrow: bigint;
}

/**
 * `queue::request_detail`.
 *
 * `lockedAssetsOut` is `Some` only for LockedIn-priced vaults, where the payout is
 * fixed at submission; Floating vaults price at **funding** and report `null`.
 *
 * `status` is the authoritative funding signal, not `fundedAmount`: a request can reach
 * `Funded` with a zero payout, so `fundedAmount === 0n` does **not** mean unfunded.
 * Funding happens through allocator funding *or* permissionless force-processing — do not
 * assume an allocator was involved.
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
  /**
   * The floor accepted at submission, persisted on the request.
   *
   * Enforced again against the **final** payout in both funding paths. A request whose
   * payout falls below it stays `Pending`, consumes no liquidity, and the batch moves on;
   * it may be funded later if the payout recovers, or be cancelled, denied, or expired.
   * Force-processing cannot bypass it.
   */
  minAssetsOut: OptionalAmount;
  originalEscrowedShares: bigint;
  owner: string;
  pendingRecoveryAddress: string | null;
  pendingRecoveryNotBefore: OptionalAmount;
  requestAddress: string;
  /**
   * `"Pending" | "Funded" | "Claimed" | "Cancelled" | "Denied" | "Expired" | "Frozen" | "Recovered"`.
   *
   * The authoritative funding signal — a zero-payout request still reaches `Funded`.
   */
  status: string;
  /**
   * The **immutable** force-processing deadline snapshotted at submission.
   *
   * Not the current one: a later SLA tightening makes the effective deadline earlier,
   * since the contract computes `min(claimableAt + live SLA, storedForceProcessAt)`.
   * Read `getRequestForceProcessAt` for the authoritative value.
   */
  storedForceProcessAt: bigint;
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

/**
 * Shared by the instant and queued redemption builders, where `minAssetsOut` is
 * enforced differently:
 *
 * - **instant** — checked once, at execution;
 * - **queued** — checked against the submission-time estimate, then persisted on the
 *   request and rechecked against the final payout when it is funded, by an allocator
 *   or by permissionless force-processing.
 */
export interface CuratorRedeemPayloadInput {
  minAssetsOut?: bigint | number | string;
  shares: bigint | number | string;
  vaultAddress: string;
}

/**
 * Identifies one redemption request within its vault.
 *
 * Named for its original use in the request-lifecycle payload builders; it also serves
 * `getRequestForceProcessAt`, which is a read. Renaming it would be a breaking change to
 * an input type, so it keeps the name until the next major.
 */
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
  /**
   * Applied to this preview only. For the queued path the same value is persisted on a
   * real submission and rechecked at funding — see {@link CuratorRedeemPayloadInput}.
   */
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
