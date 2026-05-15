import { CanopyError, CanopyErrorCode } from "@canopyhub/canopy-sdk-core";

export const DEFAULT_VIEW_BATCH_SIZE = 100;

export async function mapAddressBatch<TAddress extends string, TResult>(
  addresses: TAddress[],
  options: {
    fetchChunk: (chunk: TAddress[]) => Promise<TResult[]>;
    label: string;
    maxChunkSize?: number;
  }
): Promise<TResult[]> {
  if (addresses.length === 0) {
    return [];
  }

  const { uniqueAddresses, originalToUniqueIndex } = dedupeAddresses(addresses);
  const maxChunkSize = Math.max(1, Math.trunc(options.maxChunkSize ?? DEFAULT_VIEW_BATCH_SIZE));
  const chunks: TAddress[][] = [];

  for (let index = 0; index < uniqueAddresses.length; index += maxChunkSize) {
    chunks.push(uniqueAddresses.slice(index, index + maxChunkSize));
  }

  const chunkResults = await Promise.all(chunks.map((chunk) => options.fetchChunk(chunk)));
  const uniqueResults = chunkResults.flatMap((results, index) => {
    const chunk = chunks[index] as TAddress[];
    if (results.length !== chunk.length) {
      throw new CanopyError(
        `Expected ${options.label} batch results to match input length`,
        CanopyErrorCode.ViewCallFailed,
        {
          expectedLength: chunk.length,
          receivedLength: results.length,
        }
      );
    }

    return results;
  });

  return originalToUniqueIndex.map((index) => uniqueResults[index] as TResult);
}

function dedupeAddresses<TAddress extends string>(addresses: TAddress[]): {
  originalToUniqueIndex: number[];
  uniqueAddresses: TAddress[];
} {
  const uniqueAddresses: TAddress[] = [];
  const originalToUniqueIndex: number[] = [];
  const indexByAddress = new Map<string, number>();

  for (const address of addresses) {
    const existingIndex = indexByAddress.get(address);

    if (existingIndex !== undefined) {
      originalToUniqueIndex.push(existingIndex);
      continue;
    }

    const nextIndex = uniqueAddresses.length;
    uniqueAddresses.push(address);
    indexByAddress.set(address, nextIndex);
    originalToUniqueIndex.push(nextIndex);
  }

  return { uniqueAddresses, originalToUniqueIndex };
}
