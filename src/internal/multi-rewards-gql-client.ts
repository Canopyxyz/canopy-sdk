import { CanopyError, CanopyErrorCode } from "../types";
import {
  SENTIO_MULTI_REWARDS_ENDPOINT,
  CACHE_TIMEOUT_MS,
  ERROR_MESSAGES,
  HTTP_HEADERS,
} from "../constants";
import type {
  GetMRStakingPoolsResponse,
  GetMRStakingPoolsByTokenVariables,
  GraphQLRequest,
  GraphQLResponse,
  MRStakingPool,
} from "./multi-rewards-gql-types";

export class MultiRewardsGQLClient {
  private endpoint: string;
  private apiKey?: string;
  private cache: Map<string, { data: MRStakingPool[]; timestamp: number }> =
    new Map();
  private cacheTimeout: number = CACHE_TIMEOUT_MS;

  constructor(apiKey?: string, endpoint?: string) {
    this.endpoint = endpoint || SENTIO_MULTI_REWARDS_ENDPOINT;
    this.apiKey = apiKey;
  }

  /**
   * Check if API key is available for authenticated requests
   */
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private getAllPoolsQuery(): string {
    return `query GetMRStakingPools {
  mrstakingPools {
    id
    module {
      id
      pool_count
      user_count
      last_update_time
      __typename
    }
    creation_tx_version
    creator
    staking_token
    reward_tokens
    reward_datas {
      id
      pool_address
      reward_token
      reward_balance
      distributor
      duration
      period_finish
      last_update_time
      reward_rate_u12
      reward_per_token_stored_u12
      unallocated_rewards
      total_distributed
      __typename
    }
    withdrawal_count
    claim_count
    subscriber_count
    total_subscribed
    created_at
    __typename
  }
}`;
  }

  private getPoolsByTokenQuery(): string {
    return `query GetMRStakingPoolsByToken($stakingToken: String!) {
  mrstakingPools(where: { staking_token: $stakingToken }) {
    id
    module {
      id
      pool_count
      user_count
      last_update_time
      __typename
    }
    creation_tx_version
    creator
    staking_token
    reward_tokens
    reward_datas {
      id
      pool_address
      reward_token
      reward_balance
      distributor
      duration
      period_finish
      last_update_time
      reward_rate_u12
      reward_per_token_stored_u12
      unallocated_rewards
      total_distributed
      __typename
    }
    withdrawal_count
    claim_count
    subscriber_count
    total_subscribed
    created_at
    __typename
  }
}`;
  }

  async fetchAllStakingPools(): Promise<MRStakingPool[]> {
    const cacheKey = "all-pools";
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const request: GraphQLRequest = {
        operationName: "GetMRStakingPools",
        variables: {},
        query: this.getAllPoolsQuery(),
      };

      const headers: Record<string, string> = {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
      };

      if (this.apiKey) {
        headers["api-key"] = this.apiKey;
      }

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result =
        (await response.json()) as GraphQLResponse<GetMRStakingPoolsResponse>;

      if (result.errors && result.errors.length > 0) {
        throw new Error(
          `GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`
        );
      }

      if (!result.data?.mrstakingPools) {
        return [];
      }

      const pools = result.data.mrstakingPools;

      this.cache.set(cacheKey, {
        data: pools,
        timestamp: Date.now(),
      });

      return pools;
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_FETCH_METADATA,
        CanopyErrorCode.NETWORK_ERROR,
        { originalError: error }
      );
    }
  }

  async fetchStakingPoolsByToken(
    stakingToken: string
  ): Promise<MRStakingPool[]> {
    const cacheKey = `pools-${stakingToken.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const request: GraphQLRequest<GetMRStakingPoolsByTokenVariables> = {
        operationName: "GetMRStakingPoolsByToken",
        variables: { stakingToken },
        query: this.getPoolsByTokenQuery(),
      };

      const headers: Record<string, string> = {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
      };

      if (this.apiKey) {
        headers["api-key"] = this.apiKey;
      }

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result =
        (await response.json()) as GraphQLResponse<GetMRStakingPoolsResponse>;

      if (result.errors && result.errors.length > 0) {
        throw new Error(
          `GraphQL errors: ${result.errors.map((e) => e.message).join(", ")}`
        );
      }

      if (!result.data?.mrstakingPools) {
        return [];
      }

      const pools = result.data.mrstakingPools;

      this.cache.set(cacheKey, {
        data: pools,
        timestamp: Date.now(),
      });

      return pools;
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_FETCH_METADATA,
        CanopyErrorCode.NETWORK_ERROR,
        { stakingToken, originalError: error }
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  setCacheTimeout(timeout: number): void {
    this.cacheTimeout = timeout;
  }
}
