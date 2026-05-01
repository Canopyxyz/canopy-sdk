import { CanopyError, CanopyErrorCode, normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";
import type { CanopyMetadataClientOptions, CanopyVaultMetadata } from "./types";

const DEFAULT_CANOPY_METADATA_ENDPOINT =
  "https://rwf3uyiewzdnhavtega3imkynm.appsync-api.us-east-1.amazonaws.com/graphql";
const DEFAULT_CACHE_TIMEOUT_MS = 60_000;

interface AdditionalMetadataItem {
  item: string;
  key: string;
}

interface CanopyMetadataItem {
  additionalMetadata: AdditionalMetadataItem[];
  apr: string;
  chainId: number;
  decimals0: number;
  decimals1: number;
  description: string;
  displayName: string;
  iconURL: string;
  investmentType: string;
  isHidden: boolean | null;
  labels: string[] | null;
  networkAddress: string;
  networkType: string;
  paused: boolean;
  rewardApr: string;
  rewardPools: string[] | null;
  riskScore: number;
  token0: string | null;
  token0Balance: string | null;
  token1: string | null;
  token1Balance: string | null;
  totalSupply: string | null;
  tvl: string;
}

interface MetadataResponse {
  listCanopyMetadata?: {
    items?: CanopyMetadataItem[];
  };
}

interface GraphqlResponse<TData> {
  data?: TData;
  errors?: Array<{ message: string }>;
}

export class CanopyMetadataClient {
  private readonly cache = new Map<string, { data: CanopyVaultMetadata[]; timestamp: number }>();
  private readonly cacheTimeoutMs: number;
  private readonly chainId: number;
  private readonly endpoint: string;

  constructor(options: CanopyMetadataClientOptions) {
    this.cacheTimeoutMs = options.cacheTimeoutMs ?? DEFAULT_CACHE_TIMEOUT_MS;
    this.chainId = options.chainId;
    this.endpoint = options.endpoint ?? DEFAULT_CANOPY_METADATA_ENDPOINT;
  }

  async listVaultMetadata(): Promise<CanopyVaultMetadata[]> {
    const cacheKey = `chain-${this.chainId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      return cached.data;
    }

    const response = await postGraphql<MetadataResponse>(this.endpoint, {
      operationName: "GetCanopyMetadata",
      variables: { chainId: this.chainId },
      query: `query GetCanopyMetadata($chainId: Int!) {
        listCanopyMetadata(filter: {chainId: {eq: $chainId}}) {
          items {
            chainId
            networkAddress
            displayName
            investmentType
            networkType
            riskScore
            isHidden
            description
            iconURL
            labels
            rewardPools
            additionalMetadata {
              item
              key
            }
            paused
            token0
            token1
            tvl
            totalSupply
            token0Balance
            token1Balance
            decimals0
            decimals1
            apr
            rewardApr
          }
        }
      }`,
    });

    const items = response.listCanopyMetadata?.items ?? [];
    const metadata = items
      .filter((item) => item.isHidden !== true)
      .map(transformVaultMetadata);

    this.cache.set(cacheKey, { data: metadata, timestamp: Date.now() });
    return metadata;
  }

  async getVaultMetadata(vaultAddress: string): Promise<CanopyVaultMetadata | null> {
    const normalized = normalizeMoveAddress(vaultAddress);
    const metadata = await this.listVaultMetadata();
    return metadata.find((entry) => normalizeMoveAddress(entry.address) === normalized) ?? null;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

function transformVaultMetadata(item: CanopyMetadataItem): CanopyVaultMetadata {
  const additionalMetadata: Record<string, string> = {};
  for (const meta of item.additionalMetadata ?? []) {
    if (meta.key.length > 0) {
      additionalMetadata[meta.key] = meta.item;
    }
  }

  return {
    address: normalizeMoveAddress(item.networkAddress),
    additionalMetadata,
    apr: String(item.apr ?? "0"),
    chainId: item.chainId,
    description: item.description ?? "",
    decimals0: item.decimals0 ?? 0,
    decimals1: item.decimals1 ?? 0,
    displayName: item.displayName ?? "",
    iconUrl: item.iconURL ?? "",
    investmentType: item.investmentType ?? "",
    labels: item.labels ?? [],
    networkType: item.networkType ?? "",
    paused: item.paused,
    rewardApr: String(item.rewardApr ?? "0"),
    rewardPools: (item.rewardPools ?? []).map(normalizeMoveAddress),
    riskScore: item.riskScore ?? 0,
    token0: item.token0 ?? "",
    token0Balance: item.token0Balance ?? "0",
    token1: item.token1 ?? "",
    token1Balance: item.token1Balance ?? "0",
    totalSupply: item.totalSupply ?? "0",
    tvl: String(item.tvl ?? "0"),
  };
}

async function postGraphql<TData>(
  endpoint: string,
  body: { operationName: string; variables: Record<string, unknown>; query: string }
): Promise<TData> {
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new CanopyError(
      "Failed to fetch canopy metadata",
      CanopyErrorCode.NetworkError,
      { endpoint },
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new CanopyError("Failed to fetch canopy metadata", CanopyErrorCode.NetworkError, {
      endpoint,
      status: response.status,
    });
  }

  const result = (await response.json()) as GraphqlResponse<TData>;
  if (result.errors && result.errors.length > 0) {
    throw new CanopyError("Failed to fetch canopy metadata", CanopyErrorCode.NetworkError, {
      endpoint,
      errors: result.errors.map((error) => error.message),
    });
  }

  return (result.data ?? {}) as TData;
}
