import { mapAddressBatch } from "../packages/sdk/src/internal/address-batches";

describe("address batches", () => {
  it("starts chunk fetches in parallel and preserves original order", async () => {
    const resolvers: Array<(value: string[]) => void> = [];
    const startedChunks: string[][] = [];
    const input = ["0x1", "0x2", "0x3", "0x1"];

    const resultPromise = mapAddressBatch(input, {
      label: "test batch",
      maxChunkSize: 2,
      fetchChunk: (chunk) =>
        new Promise<string[]>((resolve) => {
          startedChunks.push([...chunk]);
          resolvers.push(resolve);
        }),
    });

    expect(startedChunks).toEqual([
      ["0x1", "0x2"],
      ["0x3"],
    ]);

    resolvers[1]?.(["c"]);
    resolvers[0]?.(["a", "b"]);

    await expect(resultPromise).resolves.toEqual(["a", "b", "c", "a"]);
  });
});
