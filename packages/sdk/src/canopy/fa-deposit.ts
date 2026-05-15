import { normalizeMoveAddress } from "@canopyhub/canopy-sdk-core";

export interface FungibleAssetDeposit {
  amount: bigint;
  metadataAddress: string;
  ownerAddress: string;
  storeAddress: string;
}

export function findFungibleAssetDeposit(
  txResult: unknown,
  ownerAddress: string,
  metadataAddress: string
): FungibleAssetDeposit | undefined {
  const normalizedOwner = normalizeMoveAddress(ownerAddress);
  const normalizedMetadata = normalizeMoveAddress(metadataAddress);
  const view = txResult as {
    changes?: Array<{
      address?: unknown;
      data?: { data?: Record<string, unknown>; type?: unknown };
    }>;
    events?: Array<{
      data?: Record<string, unknown>;
      type?: unknown;
    }>;
  };

  if (!Array.isArray(view.events) || !Array.isArray(view.changes)) {
    return undefined;
  }

  const depositEvents = view.events.filter(
    (event) => event.type === "0x1::fungible_asset::Deposit"
  );

  for (const event of depositEvents) {
    const storeAddress = event.data?.store;
    const amount = event.data?.amount;
    if (typeof storeAddress !== "string" || amount === undefined) {
      continue;
    }

    const normalizedStore = normalizeMoveAddress(storeAddress);
    const ownsStore = view.changes.some(
      (change) => {
        if (typeof change.address !== "string") {
          return false;
        }

        const owner = change.data?.data?.owner;
        return (
          normalizeMoveAddress(change.address) === normalizedStore &&
          change.data?.type === "0x1::object::ObjectCore" &&
          typeof owner === "string" &&
          normalizeMoveAddress(owner) === normalizedOwner
        );
      }
    );

    const matchesMetadata = view.changes.some(
      (change) => {
        if (typeof change.address !== "string") {
          return false;
        }

        const metadataStore = change.data?.data?.metadata;
        const metadata =
          metadataStore && typeof metadataStore === "object"
            ? (metadataStore as { inner?: unknown }).inner
            : undefined;

        return (
          normalizeMoveAddress(change.address) === normalizedStore &&
          change.data?.type === "0x1::fungible_asset::FungibleStore" &&
          typeof metadata === "string" &&
          normalizeMoveAddress(metadata) === normalizedMetadata
        );
      }
    );

    if (ownsStore && matchesMetadata) {
      return {
        amount: BigInt(String(amount)),
        metadataAddress: normalizedMetadata,
        ownerAddress: normalizedOwner,
        storeAddress: normalizedStore,
      };
    }
  }

  return undefined;
}
