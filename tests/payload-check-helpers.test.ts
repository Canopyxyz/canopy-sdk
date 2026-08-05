import {
  isTransportError,
  message,
  withRetry,
  withTimeout,
} from "../scripts/ci/lib/payload-check-helpers.mjs";

/**
 * Guards the classification `check:payloads` relies on.
 *
 * The check exists to catch payloads the chain rejects. If `isTransportError` were too
 * greedy, a real defect would be filed as ignorable infrastructure noise and the check would
 * report green on exactly the bug it was written to catch — so the "must NOT be transport"
 * half of this file matters more than the other half.
 *
 * These helpers live in their own module because the check script itself runs a live sweep at
 * import time; importing it here would hit three fullnodes and call `process.exit`.
 */
/**
 * Builds the error shape the SDK actually throws: a wrapper whose own message is generic,
 * with the real reason on `cause`.
 *
 * Cast because tsconfig targets ES2020, whose `Error` type has no `cause` at all — the Node
 * runtime has it regardless. Localised here rather than bumping the project's `lib`, which
 * would be a config change well beyond this fix.
 */
function errorWithCause(text: string, cause: string): Error {
  const error = new Error(text) as Error & { cause?: unknown };
  error.cause = new Error(cause);
  return error;
}

describe("payload-check helpers", () => {
  describe("isTransportError treats Move/VM rejections as payload defects", () => {
    const payloadErrors = [
      // The original bug this whole check exists for.
      "Type mismatch for argument 0, type '&signer'",
      "Type argument count mismatch, expected 1, received 0",
      "vault::get_strategy_shares_balance is not an view function",
      "Function not found in module",
      "Module not found",
      "Invalid argument at position 3",
      "Failed to deserialize entry function argument",
    ];

    it.each(payloadErrors)("does not classify %s as transport", (text) => {
      expect(isTransportError(new Error(text))).toBe(false);
    });

    it("keeps a payload rejection a payload rejection even when wrapped in an HTTP status", () => {
      // A fullnode reports these as 400s. If the status pattern won, the defect would be
      // retried three times and then filed as infra.
      expect(
        isTransportError(new Error("400 Bad Request: Type mismatch for argument 0"))
      ).toBe(false);
    });
  });

  describe("isTransportError recognises genuine transport failures", () => {
    const transportErrors = [
      "fetch failed",
      "502 Bad Gateway",
      "503 Service Unavailable",
      "500 Internal Server Error",
      "429 Too Many Requests",
      "request rate limit exceeded",
      "socket hang up",
      "read ECONNRESET",
      "connect ECONNREFUSED 127.0.0.1:8080",
      "connect ETIMEDOUT",
      "getaddrinfo ENOTFOUND fullnode.example",
      "build.simple timed out after 30000ms",
    ];

    it.each(transportErrors)("classifies %s as transport", (text) => {
      expect(isTransportError(new Error(text))).toBe(true);
    });

    it("reads through a nested cause", () => {
      // Assigned rather than passed to the constructor: tsconfig targets ES2020, whose
      // Error type has no `cause` option, though the Node runtime supports the property.
      // This is the shape the SDK actually produces — a CanopyError wrapping the real cause.
      const wrapped = errorWithCause("View function call failed", "fetch failed");

      expect(isTransportError(wrapped)).toBe(true);
    });

    it("does not classify an unrecognised error as transport", () => {
      // Default to "payload": a mystery failure should gate, not be waved through.
      expect(isTransportError(new Error("something else entirely"))).toBe(false);
    });
  });

  describe("withRetry", () => {
    it("retries transport errors and succeeds", async () => {
      let calls = 0;
      const result = await withRetry(
        async () => {
          calls += 1;
          if (calls < 3) throw new Error("502 Bad Gateway");
          return "ok";
        },
        { sleep: async () => {} }
      );

      if (!result.ok) throw new Error("expected the retried call to eventually succeed");

      expect({ value: result.value, calls }).toEqual({ value: "ok", calls: 3 });
    });

    it("does not retry a payload rejection", async () => {
      let calls = 0;
      const result = await withRetry(
        async () => {
          calls += 1;
          throw new Error("Type mismatch for argument 0, type '&signer'");
        },
        { sleep: async () => {} }
      );

      if (result.ok) throw new Error("expected the payload rejection to fail the check");

      // One attempt only: the rejection is deterministic, so retrying just delays the report.
      expect({ transport: result.transport, calls }).toEqual({ transport: false, calls: 1 });
    });

    it("reports transport:true after exhausting attempts", async () => {
      const result = await withRetry(
        async () => {
          throw new Error("fetch failed");
        },
        { attempts: 3, sleep: async () => {} }
      );

      if (result.ok) throw new Error("expected the transport error to exhaust its retries");

      expect({ transport: result.transport, attempts: result.attempts }).toEqual({
        transport: true,
        attempts: 3,
      });
    });
  });

  describe("withTimeout", () => {
    it("resolves a fast promise untouched", async () => {
      await expect(withTimeout(Promise.resolve("fast"), 1000, "check")).resolves.toBe("fast");
    });

    it("rejects with a transport-classified error when it hangs", async () => {
      const hang = new Promise(() => {});

      await expect(withTimeout(hang, 10, "canopy.buildDepositPayload")).rejects.toThrow(
        /timed out after 10ms/
      );

      // The timeout must land in the infra bucket, not be reported as a bad payload.
      expect(isTransportError(new Error("canopy.buildDepositPayload timed out after 10ms"))).toBe(
        true
      );
    });
  });

  describe("message", () => {
    it("collapses whitespace and truncates", () => {
      expect(message(new Error("a\n  b\t c"))).toBe("a b c");
      expect(message(new Error("x".repeat(300))).length).toBe(240);
    });

    it("appends the cause, which is where the real reason lives", () => {
      // The SDK's CanopyError message is always the same generic string; without the cause
      // every view failure in CI reads identically and names no cause.
      const wrapped = errorWithCause(
        "View function call failed",
        "'0x1::vault::get_strategy_shares_balance' is not an view function"
      );

      expect(message(wrapped)).toBe(
        "View function call failed: '0x1::vault::get_strategy_shares_balance' is not an view function"
      );
    });

    it("does not repeat a cause already contained in the message", () => {
      const wrapped = errorWithCause("outer: inner detail", "inner detail");

      expect(message(wrapped)).toBe("outer: inner detail");
    });

    it("handles non-Error throws", () => {
      expect(message("plain string")).toBe("plain string");
    });
  });
});
