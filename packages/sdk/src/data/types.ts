import type { ChainName } from "../../../deployments";

export interface CanopyVaultMetadata {
  address: string;
  additionalMetadata: Record<string, string>;
  apr: string;
  chainId: number;
  description: string;
  decimals0: number;
  decimals1: number;
  displayName: string;
  iconUrl: string;
  investmentType: string;
  labels: string[];
  networkType: string;
  paused: boolean;
  rewardApr: string;
  rewardPools: string[];
  riskScore: number;
  token0: string;
  token0Balance: string;
  token1: string;
  token1Balance: string;
  totalSupply: string;
  tvl: string;
}

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

export interface CanopyMetadataClientOptions {
  cacheTimeoutMs?: number;
  chainId: number;
  endpoint?: string;
}

export interface RewardsDiscoveryClientOptions {
  apiKey?: string;
  cacheTimeoutMs?: number;
  chain: ChainName;
  endpoint?: string;
}

export interface ResolveRewardPoolsInput {
  explicitPoolAddresses?: string[];
  stakingAsset: string;
}
