import { CanopyError, CanopyErrorCode, normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";
import type {
  CanopyMetadataClientOptions,
  CanopyVaultMetadata,
  CanopyVaultMetadataPage,
  ListCanopyVaultMetadataInput,
  ListCanopyVaultMetadataPageInput,
} from "./types";

const DEFAULT_CANOPY_METADATA_ENDPOINT =
  "https://rwf3uyiewzdnhavtega3imkynm.appsync-api.us-east-1.amazonaws.com/graphql";
const DEFAULT_CACHE_TIMEOUT_MS = 60_000;

interface AdditionalMetadataItem {
  item: string;
  key: string;
}

interface CanopyMetadataItem {
  additionalMetadata: AdditionalMetadataItem[];
  allowToken0: boolean;
  allowToken1: boolean;
  apr: string;
  chainId: number;
  decimals0: number;
  decimals1: number;
  description: string;
  displayName: string;
  id: string;
  iconURL: string;
  investmentType: string;
  isHidden: boolean | null;
  labels: string[] | null;
  networkAddress: string;
  networkType: string;
  paused: boolean;
  priority: number;
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
    nextToken?: string | null;
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

  async listVaultMetadata(
    input: ListCanopyVaultMetadataInput = {}
  ): Promise<CanopyVaultMetadata[]> {
    const includeHidden = input.includeHidden ?? true;
    const cacheKey = `chain-${this.chainId}:includeHidden-${includeHidden ? "1" : "0"}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      return cached.data;
    }

    const metadata: CanopyVaultMetadata[] = [];
    let nextToken: string | null = null;

    do {
      const page = await this.listVaultMetadataPage({
        includeHidden,
        ...(nextToken === null ? {} : { nextToken }),
      });
      metadata.push(...page.items);
      nextToken = page.nextToken;
    } while (nextToken !== null);

    this.cache.set(cacheKey, { data: metadata, timestamp: Date.now() });
    return metadata;
  }

  async listVaultMetadataPage(
    input: ListCanopyVaultMetadataPageInput = {}
  ): Promise<CanopyVaultMetadataPage> {
    const response = await postGraphql<MetadataResponse>(this.endpoint, {
      operationName: "GetCanopyMetadata",
      variables: {
        chainId: this.chainId,
        ...(input.limit === undefined ? {} : { limit: input.limit }),
        ...(input.nextToken === undefined ? {} : { nextToken: input.nextToken }),
      },
      query: `query GetCanopyMetadata($chainId: Int!, $limit: Int, $nextToken: String) {
        listCanopyMetadata(
          filter: {chainId: {eq: $chainId}}
          limit: $limit
          nextToken: $nextToken
        ) {
          items {
            id
            chainId
            networkAddress
            displayName
            investmentType
            networkType
            riskScore
            priority
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
            allowToken0
            allowToken1
            tvl
            totalSupply
            token0Balance
            token1Balance
            decimals0
            decimals1
            apr
            rewardApr
          }
          nextToken
        }
      }`,
    });

    const includeHidden = input.includeHidden ?? true;
    const items = (response.listCanopyMetadata?.items ?? [])
      .filter((item): item is CanopyMetadataItem => item !== null && item !== undefined)
      .filter((item) => includeHidden || item.isHidden !== true)
      .map(transformVaultMetadata);

    return {
      items,
      nextToken: response.listCanopyMetadata?.nextToken ?? null,
    };
  }

  async getVaultMetadata(
    vaultAddress: string,
    input: ListCanopyVaultMetadataInput = {}
  ): Promise<CanopyVaultMetadata | null> {
    const normalized = normalizeMoveAddress(vaultAddress);
    const metadata = await this.listVaultMetadata(input);
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
    allowToken0: item.allowToken0,
    allowToken1: item.allowToken1,
    apr: String(item.apr ?? "0"),
    chainId: item.chainId,
    description: item.description ?? "",
    decimals0: item.decimals0 ?? 0,
    decimals1: item.decimals1 ?? 0,
    displayName: item.displayName ?? "",
    id: item.id,
    iconUrl: item.iconURL ?? "",
    investmentType: item.investmentType ?? "",
    isHidden: item.isHidden ?? null,
    labels: item.labels ?? [],
    networkType: item.networkType ?? "",
    paused: item.paused,
    priority: item.priority ?? 0,
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
