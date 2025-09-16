export interface StakingPoolInfo {
  poolAddress: string;
  owner: string;
  stakingToken: string;
  rewardTokens: string[];
  totalSubscribed: string;
}

export interface RewardData {
  rewardsDistributor: string;
  rewardsDuration: string;
  periodFinish: string;
  lastUpdateTime: string;
  rewardRate: string;
  rewardPerTokenStored: string;
  unallocatedRewards: string;
}

export interface UserRewardData {
  rewardPerTokenPaid: string;
  rewards: string;
}

export interface UserStakeInfo {
  stakingToken: string;
  stakedBalance: string;
  subscribedPools: string[];
  pendingRewards: Array<{
    rewardToken: string;
    amount: string;
    poolAddress: string;
  }>;
}

export interface StakingPoolDetails {
  info: StakingPoolInfo;
  rewardData: Record<string, RewardData>;
  userRewardData?: Record<string, UserRewardData>;
}

export interface MultiRewardsOptions {
  stakingToken?: string;
  amount?: bigint;
  pools?: string[];
  rewardTokens?: string[];
}

export interface CreateStakingPoolOptions {
  stakingToken: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  tokenCreator?: string;
}

export interface StakingOperationResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface PendingReward {
  poolAddress: string;
  rewardToken: string;
  amount: string;
  symbol?: string;
  decimals?: number;
}

export interface UserStakingPosition {
  stakingToken: string;
  totalStaked: string;
  subscribedPools: string[];
  pendingRewards: PendingReward[];
  lastRewardClaim?: string;
}