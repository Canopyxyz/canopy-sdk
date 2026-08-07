/**
 * Pure helpers for `scripts/ci/check-live-payloads.mjs`.
 *
 * Extracted into their own module for one reason: the check script is an executable with a
 * shebang, a top-level `await import("../../dist/…")`, a top-level loop that hits live
 * fullnodes, and a `report()` that calls `process.exit`. Importing it from a unit test would
 * run the entire live sweep. Nothing in this file may have side effects at import time.
 *
 * `isTransportError` is the load-bearing piece. The check exists to catch payloads the chain
 * rejects — historically `Type mismatch for argument 0, type '&signer'` — so a matcher that
 * is too greedy would reclassify a real defect as ignorable infrastructure noise and invert
 * the check's whole purpose. It is deliberately a narrow allowlist of transport symptoms
 * rather than a broad "looks like a network problem" heuristic, and
 * `tests/payload-check-helpers.test.ts` pins both directions.
 *
 * That claim was not true of an earlier version. It carried two bare numeric patterns,
 * `/\b429\b/` and `/\b5\d{2}\b/`, which matched any three-digit number *anywhere* in the
 * flattened error text — so `EINSUFFICIENT_SHARES: have 512, need 600`,
 * `Move abort code 429 in module vault` and `…at position 501` all classified as transport.
 * Checking `PAYLOAD_PATTERNS` first did not help: that protects the *known* rejection strings,
 * and the exposure was precisely the unknown ones. The numeric signal now comes from the
 * structured `status` field instead of from prose. Do not reintroduce a bare numeric pattern
 * here; tightening it to require `status`/`code`/`HTTP` adjacency was tried and still matched
 * `Move abort code 429`.
 *
 * KNOWN LIMIT, ACCEPTED
 * ---------------------
 * An error whose status appears **only in prose** — `HTTP 502`, `Request failed with status
 * 503` — with no reason phrase to match textually and no structured `status` field, is now
 * classified as a payload defect rather than transport. That over-gates: it reports a real
 * outage as our bug, which is noisy but safe, where the reverse would hide a real defect. Real
 * `AptosApiError`s carry `status`, so this is a hypothetical shape rather than one seen in
 * practice. Recorded because the fix for it looks like "just add a regex for HTTP \\d+", which
 * is how the original bug got in.
 */

/**
 * Symptoms of the request never reaching, or not surviving, the fullnode.
 *
 * Textual only, on purpose — see the header. Every canonical HTTP failure carries a reason
 * phrase (`bad gateway`, `service unavailable`, …); the bare-status case with no phrase is
 * handled structurally by `isTransportStatus`.
 */
const TRANSPORT_PATTERNS = [
  /fetch failed/i,
  /network (?:error|request failed)/i,
  /socket hang up/i,
  /\bECONNRESET\b/,
  /\bECONNREFUSED\b/,
  /\bETIMEDOUT\b/,
  /\bENOTFOUND\b/,
  /\bEAI_AGAIN\b/,
  /\bEPIPE\b/,
  /timed? ?out/i,
  /too many requests/i,
  /rate limit/i,
  /bad gateway/i,
  /service unavailable/i,
  /gateway time-?out/i,
  /internal server error/i,
];

/**
 * Move/VM rejections that must NEVER be treated as transport, checked first so a message
 * carrying both (for example a 400 body quoting a type mismatch) is still reported as a
 * payload defect. Getting this wrong is the failure mode that would make the check useless.
 */
const PAYLOAD_PATTERNS = [
  /type mismatch/i,
  /type argument count mismatch/i,
  /is not an? view function/i,
  /function not found/i,
  /module not found/i,
  /invalid argument/i,
  /number of arguments/i,
  /failed to deserialize/i,
  /unable to parse/i,
];

/**
 * One-line summary for a report row.
 *
 * Includes the `cause` when there is one, because the SDK wraps fullnode rejections in a
 * `CanopyError` whose own message is only ever `View function call failed` — the actual
 * reason (`'…::get_strategy_shares_balance' is not an view function`) lives on the cause.
 * Without it, every view failure in CI reads identically and tells you nothing.
 */
export function message(error) {
  const own = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : "";
  const joined = cause && !own.includes(cause) ? `${own}: ${cause}` : own;

  // Any status, not just the transport ones: a 404 belongs in a report row even though it must
  // never make something transport. A 502 otherwise prints as a bare "Request failed".
  const status = firstStatus(error);
  const text = status === undefined ? joined : `[status ${status}] ${joined}`;

  return text.replace(/\s+/g, " ").slice(0, 240);
}

/**
 * First numeric `status` found on the error or its cause chain, **whatever its value**.
 *
 * For reporting. Deliberately separate from `isTransportStatus`: reports want every status,
 * classification wants only the ones that mean the chain could not serve the request. Folding
 * the two together would make any `AptosApiError` — including a 400 carrying a type mismatch —
 * look like infrastructure.
 */
export function firstStatus(error) {
  let current = error;

  for (let depth = 0; current && depth < 5; depth += 1) {
    if (typeof current === "object" && current !== null && typeof current.status === "number") {
      return current.status;
    }
    current = current instanceof Error ? current.cause : undefined;
  }

  return undefined;
}

/**
 * Whether an HTTP status means the fullnode could not serve the request.
 *
 * `408` request timeout, `429` rate limited, and any `5xx`. Explicitly **not** 4xx in general:
 * a `400` is the shape a Move argument rejection arrives in, and a `404` means the module or
 * endpoint is wrong. Both are defects to fix, not infrastructure to retry.
 */
export function isTransportStatus(status) {
  if (typeof status !== "number") {
    return false;
  }

  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

/**
 * Full text to classify or match against: the message plus any nested `cause`.
 *
 * Exported because callers matching on a specific chain rejection (see `checkXfail`) must
 * look past the SDK's wrapper message for the same reason `message` does.
 */
export function fullErrorText(error) {
  const parts = [];
  let current = error;

  for (let depth = 0; current && depth < 5; depth += 1) {
    parts.push(current instanceof Error ? current.message : String(current));
    current = current instanceof Error ? current.cause : undefined;
  }

  return parts.join(" ");
}

/**
 * True only for errors that indicate the fullnode could not be reached or failed to serve
 * the request. A payload rejection always wins, so a real defect can never be downgraded.
 *
 * Order is deliberate. `PAYLOAD_PATTERNS` runs first so a 500 whose body quotes
 * `Type mismatch` is still reported as a defect — ambiguity resolves toward "our bug", which
 * gates, rather than toward "their outage", which reads as noise. The structured status check
 * comes next because it is exact, and the textual patterns last.
 */
export function isTransportError(error) {
  const text = fullErrorText(error);

  if (PAYLOAD_PATTERNS.some((pattern) => pattern.test(text))) {
    return false;
  }

  if (isTransportStatus(firstStatus(error))) {
    return true;
  }

  return TRANSPORT_PATTERNS.some((pattern) => pattern.test(text));
}

/** Rejects if `promise` has not settled within `ms`, so a hung socket cannot stall CI. */
export function withTimeout(promise, ms, label) {
  let timer;

  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer);
  });
}

/**
 * Runs `attempt` up to `attempts` times, retrying **only** transport errors. A payload
 * rejection is deterministic, so retrying it would just multiply the wait before reporting
 * the same failure.
 *
 * `sleep` is injectable so tests do not spend real time on backoff.
 */
export async function withRetry(
  attempt,
  { attempts = 3, baseDelayMs = 500, sleep = defaultSleep } = {}
) {
  let lastError;

  for (let index = 0; index < attempts; index += 1) {
    try {
      return { ok: true, value: await attempt(), attempts: index + 1 };
    } catch (error) {
      lastError = error;

      if (!isTransportError(error)) {
        return { ok: false, error, transport: false, attempts: index + 1 };
      }

      if (index < attempts - 1) {
        await sleep(baseDelayMs * 2 ** index);
      }
    }
  }

  return { ok: false, error: lastError, transport: true, attempts };
}

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
