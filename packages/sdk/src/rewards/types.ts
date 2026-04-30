export interface BuildCoinStakePayloadInput {
  amount: bigint;
  coinType: string;
}

export interface BuildAssetStakePayloadInput {
  amount: bigint;
  stakingAsset: string;
}

export interface BuildCreateStakingPoolPayloadInput {
  coinType: string;
}

export interface BuildSubscribeStakeCoinPayloadInput extends BuildCoinStakePayloadInput {
  poolAddresses: string[];
}

export interface BuildSubscribeStakeAssetPayloadInput extends BuildAssetStakePayloadInput {
  poolAddresses: string[];
}

export interface BuildSubscribePayloadInput {
  poolAddress: string;
}

export interface BuildStakeTokenPayloadInput {
  amount: bigint;
  poolAddresses?: string[];
  tokenCreator: string;
  tokenDecimals: number;
  tokenName: string;
  tokenSymbol: string;
}

export interface BuildClaimRewardsPayloadInput {
  rewardTokenAddresses: string[];
}

export interface BuildUnsubscribeAndWithdrawCoinPayloadInput
  extends BuildCoinStakePayloadInput {
  poolAddresses: string[];
}

export interface BuildUnsubscribeAndWithdrawAssetPayloadInput
  extends BuildAssetStakePayloadInput {
  poolAddresses: string[];
}

export interface BuildVaultSharesStakePayloadInput extends BuildAssetStakePayloadInput {
  poolAddresses?: string[];
  userAddress?: string;
}

export interface RewardsPoolInfo {
  rewardTokenAddresses: string[];
  stakingAsset: string;
  totalStaked: bigint;
}

export interface RewardData {
  lastUpdateTime: bigint;
  periodFinish: bigint;
  rewardPerTokenStored: bigint;
  rewardRate: bigint;
  rewardsDistributor: string;
  rewardsDuration: bigint;
  unallocatedRewards: bigint;
}

export interface PendingReward {
  amount: bigint;
  poolAddress: string;
  rewardTokenAddress: string;
}

export interface UserStakingPosition {
  pendingRewards: PendingReward[];
  stakingAsset: string;
  subscribedPools: string[];
  totalStaked: bigint;
}

export interface GetRewardsEarnedInput {
  poolAddress: string;
  rewardTokenAddress: string;
  userAddress: string;
}

export interface GetUnsubscribedPoolsInput {
  poolAddresses: string[];
  userAddress: string;
}

export interface GetUserStakedBalanceInput {
  stakingAsset: string;
  userAddress: string;
}

export interface GetUserSubscribedPoolsInput {
  stakingAsset: string;
  userAddress: string;
}
