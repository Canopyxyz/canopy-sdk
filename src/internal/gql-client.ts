import { CanopyError, CanopyErrorCode } from "../types";
import {
  GRAPHQL_ENDPOINT,
  CACHE_TIMEOUT_MS,
  GQL_OPERATIONS,
  ERROR_MESSAGES,
  HTTP_HEADERS,
} from "../constants";
import type {
  GetCanopyMetadataResponse,
  GetCanopyMetadataVariables,
  GraphQLRequest,
  GraphQLResponse,
  VaultMetadata,
  CanopyMetadataItem,
} from "./gql-types";

export class GraphQLClient {
  private endpoint: string;
  private cache: Map<string, { data: VaultMetadata[]; timestamp: number }> =
    new Map();
  private cacheTimeout: number = CACHE_TIMEOUT_MS;

  constructor(endpoint?: string) {
    this.endpoint = endpoint || GRAPHQL_ENDPOINT;
  }

  private getCanopyMetadataQuery(): string {
    return `query GetCanopyMetadata($chainId: Int!) {
      listCanopyMetadata(filter: {chainId: {eq: $chainId}}) {
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
            __typename
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
          __typename
        }
        __typename
      }
    }`;
  }

  async fetchVaultMetadata(chainId: number): Promise<VaultMetadata[]> {
    const cacheKey = `chain-${chainId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const request: GraphQLRequest<GetCanopyMetadataVariables> = {
        operationName: GQL_OPERATIONS.GET_CANOPY_METADATA,
        variables: { chainId },
        query: this.getCanopyMetadataQuery(),
      };

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result =
        (await response.json()) as GraphQLResponse<GetCanopyMetadataResponse>;

      if (result.errors && result.errors.length > 0) {
        throw new Error(
          `GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`
        );
      }

      if (!result.data?.listCanopyMetadata?.items) {
        return [];
      }

      const vaults = result.data.listCanopyMetadata.items
        .filter((item) => item.isHidden !== true)
        .map((item) => this.transformToVaultMetadata(item));

      this.cache.set(cacheKey, {
        data: vaults,
        timestamp: Date.now(),
      });

      return vaults;
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_FETCH_METADATA,
        CanopyErrorCode.NETWORK_ERROR,
        { chainId, originalError: error }
      );
    }
  }

  async fetchVaultByAddress(
    chainId: number,
    vaultAddress: string
  ): Promise<VaultMetadata | null> {
    const vaults = await this.fetchVaultMetadata(chainId);
    const normalizedAddress = vaultAddress.toLowerCase();
    return (
      vaults.find(
        (vault) => vault.address.toLowerCase() === normalizedAddress
      ) || null
    );
  }

  private transformToVaultMetadata(item: CanopyMetadataItem): VaultMetadata {
    const additionalMetadata: Record<string, string> = {};
    if (item.additionalMetadata && Array.isArray(item.additionalMetadata)) {
      item.additionalMetadata.forEach((meta) => {
        if (meta.key && meta.item) {
          additionalMetadata[meta.key] = meta.item;
        }
      });
    }

    return {
      address: item.networkAddress,
      displayName: item.displayName,
      description: item.description,
      iconURL: item.iconURL,
      investmentType: item.investmentType,
      networkType: item.networkType,
      riskScore: item.riskScore,
      labels: item.labels || [],
      paused: item.paused,
      tvl: String(item.tvl || 0),
      apr: String(item.apr || 0),
      rewardApr: String(item.rewardApr || 0),
      token0: item.token0 || "",
      token1: item.token1 || "",
      token0Balance: item.token0Balance || "0",
      token1Balance: item.token1Balance || "0",
      decimals0: item.decimals0 || 0,
      decimals1: item.decimals1 || 0,
      totalSupply: item.totalSupply || "0",
      rewardPools: item.rewardPools || [],
      additionalMetadata,
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  setCacheTimeout(timeout: number): void {
    this.cacheTimeout = timeout;
  }
}
