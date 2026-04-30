import { CanopyError, CanopyErrorCode, normalizeMoveAddress } from "../../../core";
import type {
  ResolveRewardPoolsInput,
  RewardsDiscoveryClientOptions,
  SentioStakingPool,
} from "./types";

const DEFAULT_SENTIO_MULTI_REWARDS_ENDPOINT =
  "https://app.sentio.xyz/api/v1/graphql/solo-labs/canopy-multi-rewards-movement";
const DEFAULT_CACHE_TIMEOUT_MS = 60_000;

const STATIC_STAKING_TOKEN_POOL_MAPPINGS: Record<string, string[]> = {
  "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02": [
    "0x7bf3653bf8b02d19b56916daaf959b95b4564ecd35d9abdb323d0690d5fdd0e7",
    "0xc1d2493f1ecc4ce35726fb0a48719752ce573f6aead45f35703193c021af3001",
  ],
  "0x3d871f7475a839376b5567de59807db876203c628f71c75dbeefdb60139a10f8": [
    "0x12d57c3d4bb2b73726196d5e112406220773cba576577a47b4b45db57e578411",
  ],
  "0x1d42fda1a3eac95ebcb4a35ba7f2c76c35855800c9fbf45a5255d146b5bac15": [
    "0xf7ce62c86bb4789e9f7b9a8effbe38e53aab6b28bd536ed5f0f898ae58a0df89",
    "0xff22e2f44b858bcfd6477ddf1e4ee561bbc4c2624eaa33c58a51eaecfc13087b",
  ],
  "0xf1f5f765dd5c5254712e5cb35b87fd04526bc316a20bc6bea6f16746780da80a": [
    "0x05bdac1313cbb023b09f56c519943c7d0e7728ca780c7a0aa43469a2d0ff73a5",
  ],
};

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
  private readonly cacheTimeoutMs: number;
  private readonly endpoint: string;
  private readonly supportsStaticMappings: boolean;

  constructor(options: RewardsDiscoveryClientOptions) {
    this.apiKey = options.apiKey;
    this.cacheTimeoutMs = options.cacheTimeoutMs ?? DEFAULT_CACHE_TIMEOUT_MS;
    this.endpoint = options.endpoint ?? DEFAULT_SENTIO_MULTI_REWARDS_ENDPOINT;
    this.supportsStaticMappings = options.chain === "movement-mainnet";
  }

  getStaticPoolAddresses(stakingAsset: string): string[] {
    if (!this.supportsStaticMappings) {
      return [];
    }

    const normalized = normalizeMoveAddress(stakingAsset);
    return (STATIC_STAKING_TOKEN_POOL_MAPPINGS[normalized] ?? []).map(normalizeMoveAddress);
  }

  async resolvePoolAddresses(input: ResolveRewardPoolsInput): Promise<string[]> {
    if (input.explicitPoolAddresses && input.explicitPoolAddresses.length > 0) {
      return input.explicitPoolAddresses.map(normalizeMoveAddress);
    }

    const staticPools = this.getStaticPoolAddresses(input.stakingAsset);
    if (staticPools.length > 0) {
      return staticPools;
    }

    return this.findPoolAddressesByStakingAsset(input.stakingAsset);
  }

  async listPools(): Promise<SentioStakingPool[]> {
    const cacheKey = "all-pools";
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      return cached.data;
    }

    const response = await postSentioGraphql<SentioPoolsResponse>(
      this.endpoint,
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
    this.cache.set(cacheKey, { data: pools, timestamp: Date.now() });
    return pools;
  }

  async findPoolAddressesByStakingAsset(stakingAsset: string): Promise<string[]> {
    const normalized = normalizeMoveAddress(stakingAsset);
    const cacheKey = `pools-${normalized}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeoutMs) {
      return cached.data.map((pool) => pool.id);
    }

    const response = await postSentioGraphql<SentioPoolsResponse>(
      this.endpoint,
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
    this.cache.set(cacheKey, { data: pools, timestamp: Date.now() });
    return pools.map((pool) => pool.id);
  }

  clearCache(): void {
    this.cache.clear();
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
    rewardTokenAddresses: pool.reward_tokens.map(normalizeMoveAddress),
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
      { endpoint },
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new CanopyError("Failed to fetch rewards discovery data", CanopyErrorCode.NetworkError, {
      endpoint,
      status: response.status,
    });
  }

  const result = (await response.json()) as GraphqlResponse<TData>;
  if (result.errors && result.errors.length > 0) {
    throw new CanopyError("Failed to fetch rewards discovery data", CanopyErrorCode.NetworkError, {
      endpoint,
      errors: result.errors.map((error) => error.message),
    });
  }

  return (result.data ?? {}) as TData;
}
