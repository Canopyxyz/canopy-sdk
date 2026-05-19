import { CanopyError, CanopyErrorCode, normalizeMoveAddress } from "@canopyhub/canopy-sdk-core";
import type { ChainName } from "@canopyhub/canopy-sdk-deployments";
import type {
  ResolveRewardPoolsInput,
  RewardsDiscoveryClientOptions,
  RewardsDiscoveryStatus,
  SentioStakingPool,
} from "./types";

const DEFAULT_SENTIO_ENDPOINTS: Partial<Record<ChainName, string>> = {
  "movement-mainnet":
    "https://api.sentio.xyz/v1/graphql/solo-labs/canopy-multi-rewards-movement",
};
const DEFAULT_CACHE_MAX_ENTRIES = 32;
const DEFAULT_CACHE_TIMEOUT_MS = 60_000;

interface GraphqlResponse<TData> {
  data?: TData;
  errors?: Array<{ message: string }>;
}

interface SentioRewardDataItem {
  distributor: string;
  duration: string;
  last_update_time: string;
  period_finish: string;
  reward_balance: string;
  reward_per_token_stored_u12: string;
  reward_rate_u12: string;
  reward_token: string;
  total_distributed: string;
  unallocated_rewards: string;
}

interface SentioPoolItem {
  created_at: string;
  creator: string;
  id: string;
  reward_datas: SentioRewardDataItem[];
  reward_tokens: string[];
  staking_token: string;
  subscriber_count: number;
  total_subscribed: string;
}

interface SentioPoolsResponse {
  mrstakingPools?: SentioPoolItem[];
}

export class RewardsDiscoveryClient {
  private readonly apiKey: string | undefined;
  private readonly cache = new Map<string, { data: SentioStakingPool[]; timestamp: number }>();
  private readonly cacheMaxEntries: number;
  private readonly cacheTimeoutMs: number;
  private readonly chain: ChainName;
  private readonly endpoint: string | undefined;

  constructor(options: RewardsDiscoveryClientOptions) {
    this.apiKey = options.apiKey;
    this.cacheMaxEntries = Math.max(0, options.cacheMaxEntries ?? DEFAULT_CACHE_MAX_ENTRIES);
    this.cacheTimeoutMs = options.cacheTimeoutMs ?? DEFAULT_CACHE_TIMEOUT_MS;
    this.chain = options.chain;
    this.endpoint = options.endpoint ?? DEFAULT_SENTIO_ENDPOINTS[options.chain];
  }

  getStatus(): RewardsDiscoveryStatus {
    return {
      cacheEntries: this.cache.size,
      cacheMaxEntries: this.cacheMaxEntries,
      chain: this.chain,
      endpoint: this.endpoint ?? null,
      endpointConfigured: this.endpoint !== undefined,
    };
  }

  async resolvePoolAddresses(input: ResolveRewardPoolsInput): Promise<string[]> {
    if (input.explicitPoolAddresses && input.explicitPoolAddresses.length > 0) {
      return input.explicitPoolAddresses.map((address) => normalizeMoveAddress(address));
    }

    if (!this.endpoint) {
      throw new CanopyError(
        "Rewards discovery is not configured for this chain",
        CanopyErrorCode.InvalidDeployment,
        {
          chain: this.chain,
          endpointConfigured: false,
        }
      );
    }

    return this.findPoolAddressesByStakingAsset(input.stakingAsset);
  }

  async listPools(): Promise<SentioStakingPool[]> {
    const endpoint = this.requireEndpoint();
    const cacheKey = "all-pools";
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      return cached.data;
    }

    const response = await postSentioGraphql<SentioPoolsResponse>(
      endpoint,
      this.apiKey,
      {
        operationName: "GetMRStakingPools",
        variables: {},
        query: `query GetMRStakingPools {
          mrstakingPools {
            id
            creator
            staking_token
            reward_tokens
            reward_datas {
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
            }
            subscriber_count
            total_subscribed
            created_at
          }
        }`,
      }
    );

    const pools = (response.mrstakingPools ?? []).map(transformSentioPool);
    this.setCache(cacheKey, pools);
    return pools;
  }

  async findPoolAddressesByStakingAsset(stakingAsset: string): Promise<string[]> {
    const endpoint = this.requireEndpoint();
    const normalized = normalizeMoveAddress(stakingAsset);
    const cacheKey = `pools-${normalized}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      return cached.data.map((pool) => pool.id);
    }

    const response = await postSentioGraphql<SentioPoolsResponse>(
      endpoint,
      this.apiKey,
      {
        operationName: "GetMRStakingPoolsByToken",
        variables: { stakingToken: normalized },
        query: `query GetMRStakingPoolsByToken($stakingToken: String!) {
          mrstakingPools(where: { staking_token: $stakingToken }) {
            id
            creator
            staking_token
            reward_tokens
            reward_datas {
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
            }
            subscriber_count
            total_subscribed
            created_at
          }
        }`,
      }
    );

    const pools = (response.mrstakingPools ?? []).map(transformSentioPool);
    this.setCache(cacheKey, pools);
    return pools.map((pool) => pool.id);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private requireEndpoint(): string {
    if (this.endpoint) {
      return this.endpoint;
    }

    throw new CanopyError(
      "Rewards discovery is not configured for this chain",
      CanopyErrorCode.InvalidDeployment,
      {
        chain: this.chain,
        endpointConfigured: false,
      }
    );
  }

  private setCache(key: string, data: SentioStakingPool[]): void {
    if (this.cacheMaxEntries <= 0) {
      return;
    }

    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, { data, timestamp: Date.now() });

    while (this.cache.size > this.cacheMaxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey === undefined) {
        return;
      }
      this.cache.delete(oldestKey);
    }
  }
}

function transformSentioPool(pool: SentioPoolItem): SentioStakingPool {
  return {
    createdAt: pool.created_at,
    creator: normalizeMoveAddress(pool.creator),
    id: normalizeMoveAddress(pool.id),
    rewardData: pool.reward_datas.map((rewardData) => ({
      distributor: normalizeMoveAddress(rewardData.distributor),
      duration: rewardData.duration,
      lastUpdateTime: rewardData.last_update_time,
      periodFinish: rewardData.period_finish,
      rewardBalance: rewardData.reward_balance,
      rewardPerTokenStored: rewardData.reward_per_token_stored_u12,
      rewardRate: rewardData.reward_rate_u12,
      rewardToken: normalizeMoveAddress(rewardData.reward_token),
      totalDistributed: rewardData.total_distributed,
      unallocatedRewards: rewardData.unallocated_rewards,
    })),
    rewardTokenAddresses: pool.reward_tokens.map((address) => normalizeMoveAddress(address)),
    stakingAsset: normalizeMoveAddress(pool.staking_token),
    subscriberCount: pool.subscriber_count,
    totalStaked: pool.total_subscribed,
  };
}

async function postSentioGraphql<TData>(
  endpoint: string,
  apiKey: string | undefined,
  body: { operationName: string; variables: Record<string, unknown>; query: string }
): Promise<TData> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["api-key"] = apiKey;
  }

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new CanopyError(
      "Failed to fetch rewards discovery data",
      CanopyErrorCode.NetworkError,
      { endpoint, reason: "transport" },
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new CanopyError("Failed to fetch rewards discovery data", CanopyErrorCode.NetworkError, {
      endpoint,
      reason: "http",
      status: response.status,
    });
  }

  const result = (await response.json()) as GraphqlResponse<TData>;
  if (result.errors && result.errors.length > 0) {
    throw new CanopyError("Failed to fetch rewards discovery data", CanopyErrorCode.NetworkError, {
      endpoint,
      reason: "graphql",
      errors: result.errors.map((error) => error.message),
    });
  }

  if (result.data === undefined) {
    throw new CanopyError("Failed to fetch rewards discovery data", CanopyErrorCode.NetworkError, {
      endpoint,
      reason: "invalid-response",
    });
  }

  return result.data;
}
