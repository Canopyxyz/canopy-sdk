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
  /**
   * Raw fixed-point value scaled by 1e12.
   * Divide by 10^12 to convert to the human decimal reward-per-token rate.
   */
  rewardPerTokenStored: bigint;
  /**
   * Raw fixed-point value scaled by 1e12.
   * Divide by 10^12 to convert to the human decimal per-second reward rate.
   */
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

export interface RewardsSnapshotInput {
  limit?: bigint | number;
  offset?: bigint | number;
  userAddress?: string;
}

export interface RewardsRegistryOverviewInput {
  includePools?: boolean;
  limit?: bigint | number;
  offset?: bigint | number;
}

export interface RewardsPoolDetails {
  owner: string;
  poolAddress: string;
  rewardTokenAddresses: string[];
  stakingAsset: string;
  stakingTokenSupply: bigint | null;
  totalSubscribed: bigint;
}

export interface RewardsRewardTokenDetails {
  distributor: string;
  duration: bigint;
  lastUpdateTime: bigint;
  periodFinish: bigint;
  remainingRewards: bigint;
  /**
   * Raw fixed-point value scaled by 1e12.
   * Divide by 10^12 to convert to the human decimal reward-per-token value.
   */
  rewardPerToken: bigint;
  /**
   * Raw fixed-point value scaled by 1e12.
   * Divide by 10^12 to convert to the human decimal per-second reward rate.
   */
  rewardRate: bigint;
  rewardTokenAddress: string;
  unallocatedRewards: bigint;
}

export interface RewardsUserRewardPosition {
  earnedAmount: bigint;
  rewardPerTokenPaid: bigint;
  rewardTokenAddress: string;
}

export interface RewardsUserPoolPosition {
  effectiveStakedAmount: bigint;
  isSubscribed: boolean;
  poolAddress: string;
  rewards: RewardsUserRewardPosition[];
  stakingAsset: string;
}

export interface RewardsSnapshot {
  pools: RewardsPoolDetails[];
  userPositions: RewardsUserPoolPosition[] | null;
}

export interface RewardsRegistryOverview {
  pools: RewardsPoolDetails[] | null;
  poolsIncluded: boolean;
  snapshotTimestamp: bigint;
  // The helper module currently returns two additional status booleans
  // without ABI-level field names, so we preserve them as an ordered pair.
  statusFlags: readonly [boolean, boolean];
}

export interface RewardsUserPoolPositionsInput {
  limit?: bigint | number;
  offset?: bigint | number;
  userAddress: string;
}

export interface RewardsUserPoolPositionsByTokenInput
  extends RewardsUserPoolPositionsInput {
  stakingAsset: string;
}

export interface RewardsUserPoolPositionsByTokensInput {
  limit?: bigint | number;
  offset?: bigint | number;
  stakingAssets: string[];
  userAddress: string;
}

export interface RewardsUserRewardsOverviewInput
  extends RewardsUserPoolPositionsInput,
    RewardsRegistryOverviewInput {}

export interface RewardsUserRewardsOverview extends RewardsRegistryOverview {
  userPositions: RewardsUserPoolPosition[];
}
