/**
 * Curator vault abort codes, keyed `<moduleName>::<functionName>:<code>`.
 *
 * KNOWN LIMITATION — this table does not currently fire on movement-testnet, and
 * neither does the equivalent `KNOWN_MOVE_ABORTS` mapping used by the Canopy,
 * rewards, and Meridian clients. Two reasons, both in `packages/core`:
 *
 *   1. The chain's real abort string is
 *      `Move abort in 0xaddr::module: ENAME(0xHEX): message` — no function name and
 *      a hex code. `parseAbortCode` looks for a literal `abort code N` / `code: N`,
 *      finds neither, and `extractMoveAbortDetails` discards the abort entirely.
 *      The raw text still reaches callers as `details.vmStatus`.
 *   2. Even once the code parses, keys of the form `module::function:code` cannot
 *      match, because the chain does not report a function name.
 *
 * Kept as-is deliberately, to stay consistent with how the other protocol clients
 * express their abort codes. If `packages/core` is taught the real format, note
 * that the chain supplies `ENAME` and a human message itself, so the right move is
 * probably to prefer those and re-key or retire these tables — not to expand them.
 *
 * Meanwhile the previews (`previewDeposit`, `previewInstantRedeem`,
 * `previewQueuedRedemption`) are the working validation path: they return decoded
 * `blockingReasons` before anything is signed.
 *
 * This table is deliberately **not** merged into `KNOWN_MOVE_ABORTS` in
 * `packages/core`. That map has no package dimension, and the curator packages
 * ship modules named `vault` and `router` — the same names Canopy uses — so
 * shared keys would collide with different meanings (`vault::deposit:113` is
 * Canopy's `EINVALID_DEPOSIT_AMOUNT` but curator's `EAUTO_ALLOCATE_NOT_SUPPORTED`).
 * It is only ever consulted for curator's own package addresses, via
 * `createCuratorAbortResolver`, so these keys cannot be reached by another
 * protocol's aborts.
 *
 * Keys name the function that **raises** the abort, not the entry function the
 * caller invoked. Most depositor failures originate in `vault::vault` even though
 * the transaction targeted a `router::` entry point, and the abort message carries
 * the aborting frame.
 *
 * Codes are cross-checked against curator-vault sources:
 * `packages/router/sources/router.move` and `packages/vault/sources/vault.move`.
 * This is a curated subset — previews (`previewDeposit` and friends) are the
 * primary "why can't I" surface, and any unlisted code degrades safely to a raw
 * code with no name rather than borrowing another protocol's message.
 */
export const CURATOR_ABORTS: Record<string, { name: string; message: string }> = {
  // ── router::router ────────────────────────────────────────────────────────
  "router::deposit:1": {
    name: "E_UNSUPPORTED_ROUTE",
    message: "The vault is not configured with a strategy this router can route to.",
  },
  "router::deposit_with_partner:1": {
    name: "E_UNSUPPORTED_ROUTE",
    message: "The vault is not configured with a strategy this router can route to.",
  },
  "router::deposit_with_partner:4": {
    name: "EINVALID_PARTNER",
    message: "The partner ID is not registered in the global partner registry.",
  },
  "router::deposit_with_partner:5": {
    name: "EPARTNER_ATTRIBUTION_DISABLED",
    message: "This vault does not have partner attribution enabled.",
  },
  // Router code 3 is asserted at exactly one site — `deallocate`. There is no
  // `router::instant_redeem:3`; the depositor-facing min-assets-out failure is
  // the vault code below.
  "router::deallocate:3": {
    name: "EMIN_AMOUNT_OUT_NOT_MET",
    message: "The strategy recall returned less than the caller's minimum amount.",
  },

  // ── vault::vault, reachable from the depositor flows ──────────────────────
  "vault::instant_redeem:65": {
    name: "EMIN_ASSETS_OUT_NOT_MET",
    message: "The redemption would return fewer assets than the caller required.",
  },
  "vault::submit_queued_redemption:65": {
    name: "EMIN_ASSETS_OUT_NOT_MET",
    message: "The redemption would return fewer assets than the caller required.",
  },
  "vault::router_deposit:101": {
    name: "EDEPOSIT_BELOW_MIN",
    message: "The deposit is below this vault's minimum deposit amount.",
  },
  "vault::router_deposit:74": {
    name: "EIDLE_BREACH_ACTIVE",
    message:
      "The vault has too much idle capital sitting in its strategy; deposits are blocked until the allocator resolves the breach.",
  },
};
