import {
  CanopyError,
  CanopyErrorCode,
  normalizeMoveAddress,
  parseU64,
} from "@canopyhub/canopy-sdk-core";

export interface CuratorRedemptionRequestedEvent {
  claimableAt: bigint;
  expiresAt: bigint;
  requestAddress: string;
  sharesEscrowed: bigint;
  usdcEstimate: bigint;
  userAddress: string;
  vaultAddress: string;
}

interface TransactionResultLike {
  events?: Array<{
    data?: Record<string, unknown>;
    type?: unknown;
  }>;
}

/**
 * Reads the `RedemptionRequestedEvent` out of a committed `request_redemption`
 * transaction.
 *
 * `router::request_redemption` drops the `Object<RedemptionRequest>` the vault
 * returns, so the request's address is only obtainable from this event. It is also
 * the only way to recover requests that reached a terminal state before the
 * contract began retaining its per-user index — those are absent from
 * `getUserRedemptionRequests` but remain claimable by address.
 *
 * Pass `vaultAddress` and/or `userAddress` to disambiguate when a transaction
 * contains more than one request (for example a batched script).
 */
export function findRedemptionRequest(
  txResult: unknown,
  filter: { userAddress?: string; vaultAddress?: string } = {}
): CuratorRedemptionRequestedEvent | undefined {
  return findRedemptionRequests(txResult, filter)[0];
}

/** Every `RedemptionRequestedEvent` in the transaction, in emission order. */
export function findRedemptionRequests(
  txResult: unknown,
  filter: { userAddress?: string; vaultAddress?: string } = {}
): CuratorRedemptionRequestedEvent[] {
  const view = txResult as TransactionResultLike;

  if (!Array.isArray(view.events)) {
    return [];
  }

  const wantedUser = filter.userAddress ? normalizeMoveAddress(filter.userAddress) : undefined;
  const wantedVault = filter.vaultAddress
    ? normalizeMoveAddress(filter.vaultAddress)
    : undefined;

  const parsed: CuratorRedemptionRequestedEvent[] = [];

  for (const event of view.events) {
    // Match on the module-qualified suffix rather than a full type string: the
    // vault package address is chain-specific and the event may be re-emitted from
    // an upgraded package at the same address.
    if (typeof event.type !== "string" || !event.type.endsWith("::vault::RedemptionRequestedEvent")) {
      continue;
    }

    // The event type has matched, so this event is ours and every field below is
    // required. Skipping on a malformed one would surface as "no request found",
    // which is the same lie as defaulting a number to 0n.
    const data = event.data;
    const requestAddress = readEventAddress(data?.request_object_address, "request_object_address");
    const vaultAddress = readEventAddress(data?.vault, "vault");
    const userAddress = readEventAddress(data?.user, "user");

    if (wantedVault !== undefined && vaultAddress !== wantedVault) {
      continue;
    }

    if (wantedUser !== undefined && userAddress !== wantedUser) {
      continue;
    }

    parsed.push({
      claimableAt: readEventUint(data?.claimable_at, "claimable_at"),
      expiresAt: readEventUint(data?.expires_at, "expires_at"),
      requestAddress,
      sharesEscrowed: readEventUint(data?.shares_escrowed, "shares_escrowed"),
      usdcEstimate: readEventUint(data?.usdc_estimate, "usdc_estimate"),
      userAddress,
      vaultAddress,
    });
  }

  return parsed;
}

/**
 * Throws rather than defaulting, because a default is indistinguishable from a real
 * value: `sharesEscrowed: 0n` reads as "escrowed nothing", `claimableAt: 0n` as
 * "claimable since the epoch".
 *
 * Delegates the actual validation to `parseU64`, which rejects empty strings,
 * whitespace, non-numeric text, unsafe numbers and out-of-range values — all as
 * `CanopyError`. Calling `BigInt` directly would silently turn `""` into `0n` and
 * raise a bare `SyntaxError` on `"abc"`.
 */
function readEventUint(value: unknown, field: string): bigint {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "bigint") {
    throw new CanopyError(
      `RedemptionRequestedEvent is missing a numeric field: ${field}`,
      CanopyErrorCode.ViewCallFailed,
      { field, valueType: typeof value }
    );
  }

  return parseU64(value, `RedemptionRequestedEvent.${field}`);
}

/**
 * Required address field on an event whose type has already matched. A missing or
 * empty value is a broken contract with the chain, so it throws for the same reason
 * the numeric fields do.
 */
function readEventAddress(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new CanopyError(
      `RedemptionRequestedEvent is missing an address field: ${field}`,
      CanopyErrorCode.ViewCallFailed,
      { field, valueType: typeof value }
    );
  }

  return normalizeMoveAddress(value);
}
