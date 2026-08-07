import { jest } from "@jest/globals";

export interface MockViewClient {
  view: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
}

export type MockViewResponses = Record<
  string,
  unknown[] | ((args: unknown[]) => unknown[])
>;

/**
 * A stand-in for the `view` half of an `Aptos` client, keyed by fully-qualified Move
 * function id (`0xaddr::module::function`).
 *
 * Lifted here from five byte-identical copies across the test suite. Sharing it matters
 * beyond deduplication: `abi-conformance.test.ts` needs the same behaviour to drive the
 * async canopy builders offline, and a sixth copy would be one more place for the mocked
 * wire shape to drift away from what fullnodes actually send. That drift is precisely what
 * hid two shipped bugs — `readMoveU8` rejecting JSON numbers, and `fungible_asset::decimals`
 * being called without its type argument — because the old fixtures supplied `decimals` as
 * the string `"8"` where the chain sends the number `8`.
 *
 * Throws on an unmocked function id rather than returning `undefined`, so a test that
 * reaches an unexpected view fails loudly instead of parsing garbage.
 */
export function createMovementMock(responses: MockViewResponses): MockViewClient {
  return {
    view: jest.fn(async (input: unknown) => {
      const payload = (input as { payload: { function: string; functionArguments?: unknown[] } })
        .payload;
      const response = responses[payload.function];

      if (!response) {
        throw new Error(`Missing mock response for ${payload.function}`);
      }

      return typeof response === "function"
        ? response(payload.functionArguments ?? [])
        : response;
    }),
  };
}
