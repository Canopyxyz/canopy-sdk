import { jest } from "@jest/globals";
import { normalizeMoveAddress } from "../packages/core/src";
import { CanopySdk } from "../packages/sdk/src";
import { DEFAULT_VIEW_BATCH_SIZE } from "../packages/sdk/src/internal/address-batches";

interface MockViewClient {
  view: jest.MockedFunction<(input: unknown) => Promise<unknown[]>>;
}

function createMovementMock(
  responses: Record<string, unknown[] | ((args: unknown[]) => unknown[])>
): MockViewClient {
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

describe("Meridian client", () => {
  it("dedupes and chunks meridian batch view requests", async () => {
    const requestedChunks: string[][] = [];
    const client = createMovementMock({
      "0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::batch_get_vault_info":
        (args: unknown[]) => {
          const chunk = (args[0] as string[]).slice();
          requestedChunks.push(chunk);

          return [
            chunk.map((address) => ({
              vec: [
                {
                  total_0: "10",
                  total_1: "20",
                  total_shares: BigInt(address).toString(),
                  share_price_e18: "40",
                  share_name: "Meridian Vault Share",
                  share_symbol: "MVS",
                  share_decimals: "8",
                  deposit_asset: { inner: "0xaaa" },
                  quote_asset: { inner: "0xbbb" },
                },
              ],
            })),
          ];
        },
    });
    const sdk = new CanopySdk(client as never, { chain: "movement-mainnet" });
    const uniqueAddresses = Array.from({ length: DEFAULT_VIEW_BATCH_SIZE + 1 }, (_, index) => {
      return `0x${(index + 1).toString(16)}`;
    });
    const inputAddresses = [...uniqueAddresses, uniqueAddresses[0] as string];

    const results = await sdk.alm.meridian?.getBatchVaultInfo(inputAddresses);

    expect(results).toHaveLength(inputAddresses.length);
    expect(results?.[0]).toMatchObject({
      vaultAddress: normalizeMoveAddress(inputAddresses[0] as string),
      totalShares: BigInt(normalizeMoveAddress(inputAddresses[0] as string)),
    });
    expect(results?.[results.length - 1]).toMatchObject({
      vaultAddress: normalizeMoveAddress(inputAddresses[0] as string),
      totalShares: BigInt(normalizeMoveAddress(inputAddresses[0] as string)),
    });

    expect(requestedChunks).toHaveLength(2);
    expect(requestedChunks[0]).toHaveLength(DEFAULT_VIEW_BATCH_SIZE);
    expect(requestedChunks[1]).toHaveLength(1);
    expect(requestedChunks.flat()).toEqual(
      uniqueAddresses.map((address) => normalizeMoveAddress(address))
    );
  });
});
