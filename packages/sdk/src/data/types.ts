import type { ChainName } from "@canopyhub/canopy-sdk-deployments";

export interface SentioRewardData {
  distributor: string;
  duration: string;
  lastUpdateTime: string;
  periodFinish: string;
  rewardBalance: string;
  rewardPerTokenStored: string;
  rewardRate: string;
  rewardToken: string;
  totalDistributed: string;
  unallocatedRewards: string;
}

export interface SentioStakingPool {
  createdAt: string;
  creator: string;
  id: string;
  rewardData: SentioRewardData[];
  rewardTokenAddresses: string[];
  stakingAsset: string;
  subscriberCount: number;
  totalStaked: string;
}

export interface RewardsDiscoveryClientOptions {
  apiKey?: string;
  cacheMaxEntries?: number;
  cacheTimeoutMs?: number;
  chain: ChainName;
  endpoint?: string;
}

export interface RewardsDiscoveryStatus {
  cacheEntries: number;
  cacheMaxEntries: number;
  chain: ChainName;
  endpoint: string | null;
  endpointConfigured: boolean;
}

export interface ResolveRewardPoolsInput {
  explicitPoolAddresses?: string[];
  stakingAsset: string;
}
