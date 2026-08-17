import {
  CanopyError,
  CanopyErrorCode,
  entryFunctionPayload,
  moveOptionArgument,
  moveUintArgument,
  normalizeMoveAddress,
} from "@canopyhub/canopy-sdk-core";
import type { SdkContext, TransactionPayload } from "../types";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveBool,
  readMoveEnumVariant,
  readMoveOption,
  readMoveString,
  readMoveU64,
  readMoveU128,
} from "../internal/move-readers";
import { callAbiView } from "../internal/abi-views";
import type {
  CuratorBlockingReason,
  CuratorDepositPayloadInput,
  CuratorDepositPreview,
  CuratorDepositPreviewInput,
  CuratorDepositWithPartnerPayloadInput,
  CuratorIdleLimits,
  CuratorInstantRedeemPreview,
  CuratorLiquidityBreakdown,
  CuratorQueuedRedemptionPreview,
  CuratorQueueOwnerInput,
  CuratorRedeemPayloadInput,
  CuratorRedeemPreviewInput,
  CuratorRedemptionRequest,
  CuratorRequestPayloadInput,
  CuratorUserVaultInput,
  CuratorUserPosition,
  CuratorVault,
  CuratorVaultAccounting,
  CuratorVaultConfig,
  CuratorVelocityCapCheck,
  CuratorVelocityUsage,
  ListCuratorVaultsInput,
} from "./types";

type CuratorClientDeps = Pick<
  SdkContext<"movement-testnet">,
  "abis" | "chain" | "client" | "deployment"
>;

/** View functions this client reads, by module. */
export type CuratorVaultViewFunction =
  | "vaults"
  | "vault_count"
  | "vault_config_view"
  | "vault_accounting"
  | "liquidity_breakdown"
  | "user_position_view"
  | "share_balance_of"
  | "queue_object"
  | "deposit_preview"
  | "instant_redeem_preview"
  | "queued_redemption_preview";

export type CuratorQueueViewFunction =
  | "request_detail"
  | "user_request_addresses"
  | "open_request_count";

export type CuratorPartnerRegistryViewFunction = "is_registered" | "payout_address";

/**
 * The depositor-facing entry functions on `router::router`.
 *
 * Kept as a literal union so a typo is a compile error. `tests/curator-client.test.ts`
 * asserts every name here exists as an entry function in the checked-in
 * `curatorRouter` ABI, and `abi:check` catches on-chain drift, which together cover
 * what Surf's typed payloads would have.
 */
export type CuratorRouterFunction =
  | "deposit"
  | "deposit_with_partner"
  | "instant_redeem"
  | "request_redemption"
  | "claim_redemption"
  | "cancel_redemption"
  | "claimback_escrowed_shares";

/**
 * Depositor-facing client for the curator vault system.
 *
 * Entry payloads are built with `entryFunctionPayload` and reads go through the
 * shared `internal/abi-views.ts` helper — the same plain-payload pattern the Canopy,
 * rewards and Meridian clients use. Function names are checked by the literal unions
 * above plus `tests/abi-conformance.test.ts`, which also asserts argument arity
 * against the bound ABIs.
 *
 * Curator ABIs are registered as widened `MoveModuleAbi`; nothing needs their literal
 * types.
 *
 * Governance and allocator operations are out of scope — this covers deposits,
 * redemptions, and the reads a depositor UI needs.
 */
export class CuratorClient {
  static fromContext(context: SdkContext<"movement-testnet">): CuratorClient {
    return new CuratorClient(context);
  }

  private readonly routerAddress: string;

  constructor(private readonly context: CuratorClientDeps) {
    const routerAddress = context.deployment.curator?.router;

    if (routerAddress === undefined) {
      throw new CanopyError(
        "Curator router is not deployed on this chain",
        CanopyErrorCode.InvalidDeployment,
        { chain: context.chain }
      );
    }

    this.routerAddress = routerAddress;
  }

  // ── Entry payloads ────────────────────────────────────────────────────────
  //
  // Positional order follows router.move exactly. Note `deposit_with_partner`
  // puts `partner_id` *after* `min_shares_out`, and that the trailing
  // `data: Option<vector<u8>>` exists only on the two deposit functions — it is
  // unused in V1 (the generic adapter takes no routing data) so it is always
  // `undefined` and never surfaced in the SDK inputs.
  //
  // These are plain payloads carrying no `abi` field, so `@aptos-labs/ts-sdk`
  // fetches the entry-function ABI itself and strips the leading `&signer`. Surf's
  // `createEntryPayload` keeps the signer in `abi.parameters`, which makes
  // `transaction.build.simple` reject argument 0 with
  // "Type mismatch for argument 0, type '&signer'" — verified against
  // movement-testnet. Absent `Option` arguments are `undefined`, present ones are
  // bare scalars.

  buildDepositPayload(input: CuratorDepositPayloadInput): TransactionPayload {
    return this.buildRouterPayload("deposit", [
      normalizeMoveAddress(input.vaultAddress),
      moveUintArgument(input.amount),
      moveOptionArgument(input.minSharesOut),
      undefined,
    ]);
  }

  buildDepositWithPartnerPayload(
    input: CuratorDepositWithPartnerPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload("deposit_with_partner", [
      normalizeMoveAddress(input.vaultAddress),
      moveUintArgument(input.amount),
      moveOptionArgument(input.minSharesOut),
      moveUintArgument(input.partnerId),
      undefined,
    ]);
  }

  buildInstantRedeemPayload(input: CuratorRedeemPayloadInput): TransactionPayload {
    return this.buildRouterPayload("instant_redeem", [
      normalizeMoveAddress(input.vaultAddress),
      moveUintArgument(input.shares),
      moveOptionArgument(input.minAssetsOut),
    ]);
  }

  buildRequestRedemptionPayload(input: CuratorRedeemPayloadInput): TransactionPayload {
    return this.buildRouterPayload("request_redemption", [
      normalizeMoveAddress(input.vaultAddress),
      moveUintArgument(input.shares),
      moveOptionArgument(input.minAssetsOut),
    ]);
  }

  buildClaimRedemptionPayload(input: CuratorRequestPayloadInput): TransactionPayload {
    return this.buildRequestLifecyclePayload("claim_redemption", input);
  }

  buildCancelRedemptionPayload(input: CuratorRequestPayloadInput): TransactionPayload {
    return this.buildRequestLifecyclePayload("cancel_redemption", input);
  }

  buildClaimbackEscrowedSharesPayload(
    input: CuratorRequestPayloadInput
  ): TransactionPayload {
    return this.buildRequestLifecyclePayload("claimback_escrowed_shares", input);
  }

  // ── Vault reads ───────────────────────────────────────────────────────────

  /**
   * Pages the system vault registry.
   *
   * The registry is append-only, so indices are stable and paging cannot skip or
   * duplicate. An out-of-range `offset` and a `limit` of 0 both return empty
   * rather than aborting, so callers can page until empty.
   */
  async listVaults(input: ListCuratorVaultsInput = {}): Promise<string[]> {
    const result = await this.callVaultView("vaults", [
      moveUintArgument(input.offset ?? 0),
      moveUintArgument(input.limit ?? 50),
    ]);

    return readMoveAddressVector(result);
  }

  async getVaultCount(): Promise<bigint> {
    return readMoveU64(await this.callVaultView("vault_count"));
  }

  /** Config plus accounting, in two view calls. */
  async getVault(vaultAddress: string): Promise<CuratorVault> {
    const normalized = normalizeMoveAddress(vaultAddress);
    const [config, accounting] = await Promise.all([
      this.getVaultConfig(normalized),
      this.getVaultAccounting(normalized),
    ]);

    return { accounting, config, vaultAddress: normalized };
  }

  async getVaultConfig(vaultAddress: string): Promise<CuratorVaultConfig> {
    return readVaultConfig(
      await this.callVaultView("vault_config_view", [normalizeMoveAddress(vaultAddress)])
    );
  }

  async getVaultAccounting(vaultAddress: string): Promise<CuratorVaultAccounting> {
    return readVaultAccounting(
      await this.callVaultView("vault_accounting", [normalizeMoveAddress(vaultAddress)])
    );
  }

  async getLiquidityBreakdown(vaultAddress: string): Promise<CuratorLiquidityBreakdown> {
    return readLiquidityBreakdown(
      await this.callVaultView("liquidity_breakdown", [normalizeMoveAddress(vaultAddress)])
    );
  }

  // ── Position reads ────────────────────────────────────────────────────────

  async getUserVaultPosition(input: CuratorUserVaultInput): Promise<CuratorUserPosition> {
    const normalizedUser = normalizeMoveAddress(input.userAddress);
    const normalizedVault = normalizeMoveAddress(input.vaultAddress);
    const result = await this.callVaultView("user_position_view", [
      normalizedVault,
      normalizedUser,
    ]);

    return readUserPosition(result, normalizedUser, normalizedVault);
  }

  async getShareBalance(input: CuratorUserVaultInput): Promise<bigint> {
    return readMoveU64(
      await this.callVaultView("share_balance_of", [
        normalizeMoveAddress(input.vaultAddress),
        normalizeMoveAddress(input.userAddress),
      ])
    );
  }

  // ── Previews ──────────────────────────────────────────────────────────────
  //
  // These are the primary "why can't I" API. Each returns its own gate field —
  // canDeposit / canRedeem / canSubmit — mirroring the three distinct Move field
  // names, plus decoded blocking reasons.

  async previewDeposit(input: CuratorDepositPreviewInput): Promise<CuratorDepositPreview> {
    const result = await this.callVaultView("deposit_preview", [
      normalizeMoveAddress(input.vaultAddress),
      normalizeMoveAddress(input.depositor),
      moveUintArgument(input.amount),
      moveOptionArgument(input.minSharesOut),
    ]);

    return readDepositPreview(result);
  }

  async previewInstantRedeem(
    input: CuratorRedeemPreviewInput
  ): Promise<CuratorInstantRedeemPreview> {
    const result = await this.callVaultView("instant_redeem_preview", [
      normalizeMoveAddress(input.vaultAddress),
      normalizeMoveAddress(input.user),
      moveUintArgument(input.shares),
      moveOptionArgument(input.minAssetsOut),
    ]);

    return readInstantRedeemPreview(result);
  }

  async previewQueuedRedemption(
    input: CuratorRedeemPreviewInput
  ): Promise<CuratorQueuedRedemptionPreview> {
    const result = await this.callVaultView("queued_redemption_preview", [
      normalizeMoveAddress(input.vaultAddress),
      normalizeMoveAddress(input.user),
      moveUintArgument(input.shares),
      moveOptionArgument(input.minAssetsOut),
    ]);

    return readQueuedRedemptionPreview(result);
  }

  // ── Redemption queue reads ────────────────────────────────────────────────

  async getRedemptionRequest(requestAddress: string): Promise<CuratorRedemptionRequest> {
    const normalized = normalizeMoveAddress(requestAddress);
    const result = await this.callQueueView("request_detail", [normalized]);
    return readRedemptionRequest(result, normalized);
  }

  /**
   * All request addresses the queue still tracks for `owner`, with their detail.
   *
   * Includes live requests (`Pending`, `Funded`, `Frozen`) **and** claimback-pending
   * ones (`Cancelled`, `Denied`, `Expired` with escrow outstanding). The latter are
   * inspect-and-claimback only: they have been unregistered from the queue's request
   * registry, so passing them to claim or cancel aborts. Filter on `status` before
   * feeding any address into a lifecycle call.
   *
   * Ordering is not stable — the contract prunes with `swap_remove`, so never treat
   * position as identity. Bounded by the contract's per-user request cap, so there
   * is no pagination.
   *
   * Requests that reached a terminal state before the contract began retaining the
   * index are absent here. Those stay claimable by address and are recoverable from
   * the cancellation / denial / expiry events.
   */
  async getUserRedemptionRequests(
    input: CuratorQueueOwnerInput
  ): Promise<CuratorRedemptionRequest[]> {
    const queueAddress = await this.getQueueAddress(input.vaultAddress);
    const addresses = readMoveAddressVector(
      await this.callQueueView("user_request_addresses", [
        queueAddress,
        normalizeMoveAddress(input.ownerAddress),
      ])
    );

    return Promise.all(addresses.map((address) => this.getRedemptionRequest(address)));
  }

  /**
   * Number of requests the queue tracks for `owner`.
   *
   * Counts claimback-pending requests too, so this is the figure charged against
   * the contract's per-user submission cap: unreclaimed escrow consumes an owner's
   * own submission budget until they claim it back.
   */
  async getOpenRequestCount(input: CuratorQueueOwnerInput): Promise<bigint> {
    const queueAddress = await this.getQueueAddress(input.vaultAddress);

    return readMoveU64(
      await this.callQueueView("open_request_count", [
        queueAddress,
        normalizeMoveAddress(input.ownerAddress),
      ])
    );
  }

  async getQueueAddress(vaultAddress: string): Promise<string> {
    return readMoveAddress(
      await this.callVaultView("queue_object", [normalizeMoveAddress(vaultAddress)])
    );
  }

  // ── Partner registry reads ────────────────────────────────────────────────

  async isPartnerRegistered(partnerId: bigint | number | string): Promise<boolean> {
    return readMoveBool(
      await this.callPartnerRegistryView("is_registered", [moveUintArgument(partnerId)])
    );
  }

  /**
   * Payout address for a registered partner, or `null` when the ID is unregistered.
   *
   * The Move view aborts rather than returning an `Option`, so an unregistered ID is
   * translated to `null` here instead of surfacing as a Move abort.
   */
  async getPartnerPayoutAddress(partnerId: bigint | number | string): Promise<string | null> {
    if (!(await this.isPartnerRegistered(partnerId))) {
      return null;
    }

    try {
      return readMoveAddress(
        await this.callPartnerRegistryView("payout_address", [moveUintArgument(partnerId)])
      );
    } catch (error) {
      // Lost a race with a removal between the two calls.
      if (error instanceof CanopyError && error.code === CanopyErrorCode.MoveAbort) {
        return null;
      }

      throw error;
    }
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  private buildRequestLifecyclePayload(
    functionName: "claim_redemption" | "cancel_redemption" | "claimback_escrowed_shares",
    input: CuratorRequestPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload(functionName, [
      normalizeMoveAddress(input.vaultAddress),
      normalizeMoveAddress(input.requestAddress),
    ]);
  }

  private buildRouterPayload(
    functionName: CuratorRouterFunction,
    functionArguments: (string | undefined)[]
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.routerAddress,
      moduleName: "router",
      functionName,
      functionArguments: functionArguments as never,
    });
  }

  private callVaultView<Result = unknown>(
    functionName: CuratorVaultViewFunction,
    functionArguments: unknown[] = []
  ): Promise<Result> {
    return callAbiView(
      this.context.client,
      this.context.abis.curatorVault,
      functionName,
      functionArguments
    );
  }

  private callQueueView<Result = unknown>(
    functionName: CuratorQueueViewFunction,
    functionArguments: unknown[] = []
  ): Promise<Result> {
    return callAbiView(
      this.context.client,
      this.context.abis.curatorQueue,
      functionName,
      functionArguments
    );
  }

  private callPartnerRegistryView<Result = unknown>(
    functionName: CuratorPartnerRegistryViewFunction,
    functionArguments: unknown[] = []
  ): Promise<Result> {
    return callAbiView(
      this.context.client,
      this.context.abis.curatorPartnerRegistry,
      functionName,
      functionArguments
    );
  }
}

// ── Decoders ────────────────────────────────────────────────────────────────

function asRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CanopyError(`Expected ${label} struct`, CanopyErrorCode.ViewCallFailed, {
      valueType: typeof value,
    });
  }

  return value as Record<string, unknown>;
}

function readOptionalU64(value: unknown): bigint | null {
  return readMoveOption(value, readMoveU64);
}

function readVelocityUsage(value: unknown): CuratorVelocityUsage {
  const usage = asRecord(value, "VelocityUsage");

  return {
    day: readMoveU64(usage.day),
    month: readMoveU64(usage.month),
    week: readMoveU64(usage.week),
  };
}

function readVelocityCapCheck(value: unknown): CuratorVelocityCapCheck {
  const check = asRecord(value, "VelocityCapCheckResult");

  return {
    aggregateDayHeadroom: readOptionalU64(check.aggregate_day_headroom),
    aggregateMonthHeadroom: readOptionalU64(check.aggregate_month_headroom),
    aggregateWeekHeadroom: readOptionalU64(check.aggregate_week_headroom),
    passes: readMoveBool(check.passes),
    walletDayHeadroom: readOptionalU64(check.wallet_day_headroom),
    walletMonthHeadroom: readOptionalU64(check.wallet_month_headroom),
    walletWeekHeadroom: readOptionalU64(check.wallet_week_headroom),
  };
}

function readBlockingReasons(value: unknown): CuratorBlockingReason[] {
  if (!Array.isArray(value)) {
    throw new CanopyError(
      "Expected blocking reason vector",
      CanopyErrorCode.ViewCallFailed,
      { valueType: typeof value }
    );
  }

  return value.map((entry) => {
    const reason = asRecord(entry, "PreviewBlockingReason");
    const rawAbort = asRecord(reason.raw_abort, "PreviewErrorPath");

    return {
      reasonId: readMoveEnumVariant(reason.reason_id),
      rawAbort: {
        errorCode: readMoveU64(rawAbort.error_code),
        moduleName: readMoveString(rawAbort.module_name),
        packageAddress: readMoveAddress(rawAbort.package_address),
      },
    };
  });
}

function readVaultAccounting(value: unknown): CuratorVaultAccounting {
  const snapshot = asRecord(value, "AccountingSnapshot");

  return {
    effectiveAssets: readMoveU64(snapshot.effective_assets),
    hasPendingOffchainNavOverride: readMoveBool(snapshot.has_pending_offchain_nav_override),
    isNavFresh: readMoveBool(snapshot.is_nav_fresh),
    lastNavUpdateAt: readMoveU64(snapshot.last_nav_update_at),
    lockedProfit: readMoveU64(snapshot.locked_profit),
    reportedOffchainNav: readMoveU64(snapshot.reported_offchain_nav),
    reservedForQueue: readMoveU64(snapshot.reserved_for_queue),
    sharePriceE18: readMoveU128(snapshot.share_price_e18),
    shareTotalSupply: readMoveU64(snapshot.share_total_supply),
    strategyIdleAssets: readMoveU64(snapshot.strategy_idle_assets),
    totalAssets: readMoveU64(snapshot.total_assets),
    unreservedBuffer: readMoveU64(snapshot.unreserved_buffer),
  };
}

function readLiquidityBreakdown(value: unknown): CuratorLiquidityBreakdown {
  const breakdown = asRecord(value, "LiquidityBreakdown");

  return {
    reportedOffchainNav: readMoveU64(breakdown.reported_offchain_nav),
    reservedForQueue: readMoveU64(breakdown.reserved_for_queue),
    strategyIdleAssets: readMoveU64(breakdown.strategy_idle_assets),
    totalAssets: readMoveU64(breakdown.total_assets),
    unreservedBuffer: readMoveU64(breakdown.unreserved_buffer),
  };
}

function readIdleLimits(value: unknown): CuratorIdleLimits {
  const limits = asRecord(value, "IdleLimits");

  return {
    maxIdleInStrategyAmount: readMoveU64(limits.max_idle_in_strategy_amount),
    maxIdleInStrategyDuration: readMoveU64(limits.max_idle_in_strategy_duration),
  };
}

function readVaultConfig(value: unknown): CuratorVaultConfig {
  const config = asRecord(value, "VaultConfigView");

  return {
    adapterCap: readOptionalU64(config.adapter_cap),
    allocatorSlaSeconds: readMoveU64(config.allocator_sla_seconds),
    autoAllocateOnDeposit: readMoveBool(config.auto_allocate_on_deposit),
    depositCap: readOptionalU64(config.deposit_cap),
    depositsPausedUntil: readOptionalU64(config.deposits_paused_until),
    frictionlessThreshold: readMoveU64(config.frictionless_threshold),
    idleLimits: readMoveOption(config.idle_limits, readIdleLimits),
    instantRedeemFeeBps: readMoveU64(config.instant_redeem_fee_bps),
    lockDuration: readMoveU64(config.lock_duration),
    managementFeeBps: readMoveU64(config.management_fee_bps),
    maxPendingLockedAssets: readOptionalU64(config.max_pending_locked_assets),
    minDepositAmount: readMoveU64(config.min_deposit_amount),
    nav24hSharePriceDeviationBps: readMoveU64(config.nav_24h_share_price_deviation_bps),
    navDeviationThresholdBps: readMoveU64(config.nav_deviation_threshold_bps),
    normalNavReportIntervalSeconds: readMoveU64(config.normal_nav_report_interval_seconds),
    partnerAttributionEnabled: readMoveBool(config.partner_attribution_enabled),
    performanceFeeBps: readMoveU64(config.performance_fee_bps),
    pricingPolicy: readMoveEnumVariant(config.pricing_policy),
    redemptionsPausedUntil: readOptionalU64(config.redemptions_paused_until),
    requestExpiryWindow: readMoveU64(config.request_expiry_window),
    staleNavAction: readMoveEnumVariant(config.stale_nav_action),
    underlyingMetadata: readMoveAddress(config.underlying_metadata),
    withdrawalDelaySeconds: readMoveU64(config.withdrawal_delay_seconds),
  };
}

function readUserPosition(
  value: unknown,
  userAddress: string,
  vaultAddress: string
): CuratorUserPosition {
  const position = asRecord(value, "UserPositionView");

  return {
    depositWalletUsage: readMoveOption(position.deposit_wallet_usage, readVelocityUsage),
    isSanctioned: readMoveBool(position.is_sanctioned),
    isVaultBlocklisted: readMoveBool(position.is_vault_blocklisted),
    openRequestCount: readMoveU64(position.open_request_count),
    ownershipChainTooDeep: readMoveBool(position.ownership_chain_too_deep),
    redemptionWalletUsage: readMoveOption(
      position.redemption_wallet_usage,
      readVelocityUsage
    ),
    shareBalance: readMoveU64(position.share_balance),
    sharePriceE18: readMoveU128(position.share_price_e18),
    shareValue: readMoveU64(position.share_value),
    userAddress,
    vaultAddress,
  };
}

function readDepositPreview(value: unknown): CuratorDepositPreview {
  const preview = asRecord(value, "DepositPreview");

  return {
    adapterCapHeadroom: readOptionalU64(preview.adapter_cap_headroom),
    aggregateUsageAfter: readVelocityUsage(preview.aggregate_usage_after),
    blockingReasons: readBlockingReasons(preview.blocking_reasons),
    canDeposit: readMoveBool(preview.can_deposit),
    depositCapHeadroom: readOptionalU64(preview.deposit_cap_headroom),
    isNavFresh: readMoveBool(preview.is_nav_fresh),
    isSanctioned: readMoveBool(preview.is_sanctioned),
    isVaultBlocklisted: readMoveBool(preview.is_vault_blocklisted),
    mandatoryVelocityCheck: readVelocityCapCheck(preview.mandatory_velocity_check),
    sharePriceE18: readMoveU128(preview.share_price_e18),
    sharesOut: readMoveU64(preview.shares_out),
    vaultVelocityCheck: readVelocityCapCheck(preview.vault_velocity_check),
    walletUsageAfter: readVelocityUsage(preview.wallet_usage_after),
  };
}

function readInstantRedeemPreview(value: unknown): CuratorInstantRedeemPreview {
  const preview = asRecord(value, "InstantRedeemPreview");

  return {
    aggregateUsageAfter: readVelocityUsage(preview.aggregate_usage_after),
    assetsOut: readMoveU64(preview.assets_out),
    blockingReasons: readBlockingReasons(preview.blocking_reasons),
    canRedeem: readMoveBool(preview.can_redeem),
    feeBps: readMoveU64(preview.fee_bps),
    feeShares: readMoveU64(preview.fee_shares),
    instantBufferRemaining: readMoveU64(preview.instant_buffer_remaining),
    isNavFresh: readMoveBool(preview.is_nav_fresh),
    isSanctioned: readMoveBool(preview.is_sanctioned),
    isVaultBlocklisted: readMoveBool(preview.is_vault_blocklisted),
    isWithinFrictionlessThreshold: readMoveBool(preview.is_within_frictionless_threshold),
    mandatoryVelocityCheck: readVelocityCapCheck(preview.mandatory_velocity_check),
    vaultVelocityCheck: readVelocityCapCheck(preview.vault_velocity_check),
    walletUsageAfter: readVelocityUsage(preview.wallet_usage_after),
  };
}

function readQueuedRedemptionPreview(value: unknown): CuratorQueuedRedemptionPreview {
  const preview = asRecord(value, "QueuedRedemptionPreview");

  return {
    allocatorSlaSeconds: readMoveU64(preview.allocator_sla_seconds),
    blockingReasons: readBlockingReasons(preview.blocking_reasons),
    canSubmit: readMoveBool(preview.can_submit),
    estimatedAssetsOut: readMoveU64(preview.estimated_assets_out),
    estimatedClaimableAt: readMoveU64(preview.estimated_claimable_at),
    isSanctioned: readMoveBool(preview.is_sanctioned),
    isVaultBlocklisted: readMoveBool(preview.is_vault_blocklisted),
    pricingPolicy: readMoveEnumVariant(preview.pricing_policy),
    requestExpiryAt: readMoveU64(preview.request_expiry_at),
    sharesToEscrow: readMoveU64(preview.shares_to_escrow),
  };
}

function readRedemptionRequest(
  value: unknown,
  requestAddress: string
): CuratorRedemptionRequest {
  const detail = asRecord(value, "RequestDetail");

  return {
    claimableAt: readMoveU64(detail.claimable_at),
    claimedAmount: readMoveU64(detail.claimed_amount),
    escrowedShares: readMoveU64(detail.escrowed_shares),
    expiresAt: readMoveU64(detail.expires_at),
    frozenAt: readOptionalU64(detail.frozen_at),
    fundedAmount: readMoveU64(detail.funded_amount),
    fundedAt: readOptionalU64(detail.funded_at),
    lockedAssetsOut: readOptionalU64(detail.locked_assets_out),
    originalEscrowedShares: readMoveU64(detail.original_escrowed_shares),
    owner: readMoveAddress(detail.owner),
    pendingRecoveryAddress: readMoveOption(
      detail.pending_recovery_address,
      readMoveAddress
    ),
    pendingRecoveryNotBefore: readOptionalU64(detail.pending_recovery_not_before),
    requestAddress,
    status: readMoveEnumVariant(detail.status),
    submittedAt: readMoveU64(detail.submitted_at),
  };
}
