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
 */

/** Symptoms of the request never reaching, or not surviving, the fullnode. */
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
  /\b429\b/,
  /too many requests/i,
  /rate limit/i,
  /\b5\d{2}\b/,
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
  const text = cause && !own.includes(cause) ? `${own}: ${cause}` : own;

  return text.replace(/\s+/g, " ").slice(0, 240);
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
    if (typeof current === "object" && current !== null && "status" in current) {
      parts.push(String(current.status));
    }
    current = current instanceof Error ? current.cause : undefined;
  }

  return parts.join(" ");
}

/**
 * True only for errors that indicate the fullnode could not be reached or failed to serve
 * the request. A payload rejection always wins, so a real defect can never be downgraded.
 */
export function isTransportError(error) {
  const text = fullErrorText(error);

  if (PAYLOAD_PATTERNS.some((pattern) => pattern.test(text))) {
    return false;
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
