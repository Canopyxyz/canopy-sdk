/**
 * Types for `payload-check-helpers.mjs`.
 *
 * The helper itself is plain ESM because `scripts/` is not part of the TypeScript build — it
 * runs straight off disk in CI. This declaration exists so `tests/payload-check-helpers.test.ts`
 * gets real type checking instead of a blanket `@ts-expect-error`, which would also have
 * suppressed genuine mistakes in those tests.
 */

/** One-line summary for a report row, including the `cause` when present. */
export function message(error: unknown): string;

/** The error's message joined with its nested `cause` chain, for matching and classifying. */
export function fullErrorText(error: unknown): string;

/**
 * True only for errors meaning the fullnode could not be reached or failed to serve the
 * request. Move/VM rejections always win, so a real payload defect is never downgraded.
 */
export function isTransportError(error: unknown): boolean;

/** Rejects if `promise` has not settled within `ms`. */
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T>;

export interface RetryOptions {
  attempts?: number;
  baseDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
}

export type RetryResult<T> =
  | { ok: true; value: T; attempts: number }
  | { ok: false; error: unknown; transport: boolean; attempts: number };

/** Runs `attempt` up to `attempts` times, retrying transport errors only. */
export function withRetry<T>(
  attempt: () => Promise<T>,
  options?: RetryOptions
): Promise<RetryResult<T>>;
