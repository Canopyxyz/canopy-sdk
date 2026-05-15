import { CanopyError, CanopyErrorCode, normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";
import type {
  ResolveRewardPoolsInput,
  RewardsDiscoveryClientOptions,
  SentioStakingPool,
} from "./types";

const DEFAULT_SENTIO_MULTI_REWARDS_ENDPOINT =
  "https://app.sentio.xyz/api/v1/graphql/solo-labs/canopy-multi-rewards-movement";
const DEFAULT_CACHE_TIMEOUT_MS = 60_000;

const STATIC_STAKING_TOKEN_POOL_MAPPINGS: Record<string, string[]> = {
  "0x01d42fda1a3eac95ebcb4a35ba7f2c76c35855800c9fbf45a5255d146b5bac15": [
    "0xff22e2f44b858bcfd6477ddf1e4ee561bbc4c2624eaa33c58a51eaecfc13087b",
  ],
  "0x044d42a3b738a8d9a30de1082bd9e461286da0692b53fac8f0be5852407bcc7f": [
    "0x9bcd9a96c816dfc58465fdec390784b573321c3101160ffaaf3243acdbc2aff4",
  ],
  "0x095a1771f3c4569ca57c1e1a55e5b7f985028ba698e7f7b37bc3d582c1cfff6f": [
    "0x5bbe3d0b2e46cb6f236d4c4b0d21ab6d23de72235df0ff50ddd66ecea752274e",
  ],
  "0x12f98cf92689ba9ea6224d2d0d3d3b7879bd69759f397727edee33104888eed3": [
    "0x5a317a1246e677f76fee288f419830edea9dda4ed5d1d7699c2b628e7362dbce",
  ],
  "0x14885b3fbcb8b5d12393315173307dc59adeba3ed209267dde94ebc12e771c04": [
    "0x323703d34877484e1dda0e0e43f86a2a7b18aec2ee74a35705e95ce01f7f20f2",
  ],
  "0x1a8457f78f94fc0d73c491aea3cfb26ca8adb500f8ff7cba54fd85a29b051dfe": [
    "0x695b6527c3b576b20a872f38346784bd2ccfdfe27fcea4c6eec66e03c6d581ef",
  ],
  "0x1ce104c771312d68105ce2b43d4c490b4e800c302854c4158eecf064efe7f225": [
    "0x8d6e217c1bc6145999dc74488973465966705a062284fee8e94941860d46eba9",
    "0x9f3b08695be4f55df7b4e90938b7497f91af7161765caf66cb917b2d29b3f9b7",
  ],
  "0x38fb7c5ecaada2fd2611f873917955559c897a079a1c77f174bbfa6296a216ed": [
    "0xd7d2d7b43913a7c8b46f650e3a4ae8be4f2120c3cf971b13ac54d82e697190f9",
  ],
  "0x3d871f7475a839376b5567de59807db876203c628f71c75dbeefdb60139a10f8": [
    "0x12d57c3d4bb2b73726196d5e112406220773cba576577a47b4b45db57e578411",
  ],
  "0x49f654aad7ca633ae2a434dc858a805ba79063c8831653ca4675c2d0a24d69bd": [
    "0x247e5b2d2172a4ac42199615a39f31385822081b1ddc159bd721533c414fb330",
  ],
  "0x50011f64e334eec900678908bdbb251a08dfb3327d470eadd513405c799b1849": [
    "0x4d3dee899b0539bcd542d3ec76987abe7af4dc7b1407755085ddb2073a7d7618",
    "0x8c3b9be138abc384a94c08c6f76574af1daff94d09be3d2fa06d5b4d73e63967",
    "0xdd3bf6345d13d7a544991906a65963bf65409e42933c3d8558cd989ab0d15c68",
  ],
  "0x5d127f7607a8c8509c1bc02512fb74c70c78ded3c702d21320304fc60320f6e9": [
    "0x0e9b949da2c4538f6c7eba1ac518274f2b86eff5218a0a1a9ec877eb8d07eec8",
  ],
  "0x7014b5b832067e6b3bfae039ed3dfb0ae97afee4649703dd2fd0a1acf3c06983": [
    "0xc6fb96fc4e90133e7c83ca5077fc36c7b2530a423642de2ae854685a328bd8f2",
  ],
  "0x749d27923e1c43338e1663a2992e3b2620172fe3688435df69da867da27a61cb": [
    "0x29322e0adcf8225a4c67853686f1d497daba37291abe4b9dabfaca6df470e429",
    "0x2f5a8874b69fad65835db6e5b5a5ec475b0fc1bdf13674b1c72c08ad56f37e53",
  ],
  "0x75d771c971768749df0780b676993390129bf2697612a056a795854f61fba2e3": [
    "0xc3a8e3805c9dba0ad88589ac91826677d15d55cff74078ba8c4d8df5d66e7f7b",
  ],
  "0x770fc1a011b64e6be017cec746a068967c4e422a5225a21c5f9732bfe455559e": [
    "0x23a1204a040f36ecd58fbab2a760cf66c23e74c8300643480d8b6dc28c5520fc",
    "0x6b75403e8dcc400b1fe5cd5d3892af950d2fd5adf528836ee73ade23f7c78f34",
  ],
  "0x7a4cbd55c03e8098f09ef31a234f6037dd26a9c185c75e2206387f9f6cd218bc": [
    "0x1289802e36ddbdaabe132884e5628e6cd6a3b7325fa6e5aa4ea90a0618991d9a",
  ],
  "0x84714b59bc309e7b57f5549fbb4187bc7e5dfbd847b1535aa55cf56efb4888b9": [
    "0xbde9fe8dc4c33d021a5c604171a93939164d6067176d13bf5f9d8e8886a09df9",
  ],
  "0x896ae7a3404b27e733b6c3ad9aa17ae7f95d5da62e7b132c83f7b5d89ab458ab": [
    "0xa1ba1edf634bccb633d8f10ff2ff175fea3bacbcbe9280b6bf31ad19e426fad8",
  ],
  "0xa0b21251d70f83ab2c029852ccf5045a457a1ea823e057f7d1c2edf430318ce8": [
    "0xd518b916a9e72d87fe5c44a6ccd7881efdcde60bcb2528b55c01e42fb4cfe717",
  ],
  "0xb0e176c0669a735db1fc10563d8a306fffc0315f6b0d06747cb8f3615fd5e5a7": [
    "0xf1febccdbf6a5c1348644d103adea7677cb0f7aec611ff8880a4a11041a10f7d",
  ],
  "0xb9b0b7d867e0f4735953d4c43976ec18322294fa1cb09ac893cce723a347aba1": [
    "0x05bdac1313cbb023b09f56c519943c7d0e7728ca780c7a0aa43469a2d0ff73a5",
  ],
  "0xc553d60f24f20a5ebee82a0b52fc8919c2df9d7d9b8b7f2da7330b39df8eb116": [
    "0xccba802c20b8ba4f7073701378efe5d1897572afec5a3b67a31a511db63371e7",
  ],
  "0xc8fdcd7309afdf663bd52c9d15d685e0f07d34ed60778b3ebf7ea3de60700bc3": [
    "0x250ba270e46623c5873557e69fcb02915f7bbd3d807a49746c3141dc7e71b6ee",
  ],
  "0xca63d4151b1a4ea3955d98a88faa01c339beab98347b6ad3e34f91dfc4783d65": [
    "0x3e65603598d2889b209d8e9f73abfa53a96660176a002a8a4565e17e738e3819",
  ],
  "0xcaf6b539eabdaac01027a6a4538f1276c13026bbf1e2219e8ff0172ad8c3b4ae": [
    "0x224bbdde63435ab5a8d53e8257d94171004e5e1a7cd910d9548e7b21a56c1969",
  ],
  "0xcdf2d51a3e10e49c2683c8f9519e9faab13042b6e0ba77797652aa30a494a5aa": [
    "0x2ac511aa25d9261431a7a3337c712459a1cd55aad9e9b7a84eb8ef78ac7618c9",
  ],
  "0xe005014fbdd053aebf97b9a36dfeed790d337f571fa9d37690f527acb3015e02": [
    "0x7bf3653bf8b02d19b56916daaf959b95b4564ecd35d9abdb323d0690d5fdd0e7",
    "0xc1d2493f1ecc4ce35726fb0a48719752ce573f6aead45f35703193c021af3001",
  ],
  "0xee1d5add4769369b91c00132c7ed928c3e17282a0c0f35300493aa33a573bb88": [
    "0x941a4249874129ced741f03150618f9fcd41d334a7b70554a24fbde5df7691ec",
  ],
  "0xfedacf202ed4c7b288d0389f9748f7b37524d4873660c87d0bbc9b22c88ea741": [
    "0x5a13a70d2ee640d16404f654645894fdf61cdcce5274b1035038cee14ab35e81",
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

    try {
      const sentioPools = await this.findPoolAddressesByStakingAsset(input.stakingAsset);
      if (sentioPools.length > 0) {
        return sentioPools;
      }
    } catch (error) {
      const staticPools = this.getStaticPoolAddresses(input.stakingAsset);
      if (staticPools.length > 0 && isTransportRewardsDiscoveryError(error)) {
        return staticPools;
      }

      throw error;
    }

    return this.getStaticPoolAddresses(input.stakingAsset);
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

function isTransportRewardsDiscoveryError(error: unknown): error is CanopyError {
  return (
    error instanceof CanopyError &&
    error.code === CanopyErrorCode.NetworkError &&
    error.details?.reason === "transport"
  );
}
