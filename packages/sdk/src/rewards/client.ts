import {
  CanopyError,
  CanopyErrorCode,
  callSingleViewResult,
  callViewFunction,
  entryFunctionPayload,
  moveUintArgument,
  normalizeMoveAddress,
} from "../../../core";
import type { SdkContext, TransactionPayload } from "../types";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveBool,
  readMoveU128,
  readMoveU64,
} from "../internal/move-readers";
import type { RewardsDiscoveryClient } from "../data";
import type {
  BuildAssetStakePayloadInput,
  BuildClaimRewardsPayloadInput,
  BuildCoinStakePayloadInput,
  BuildCreateStakingPoolPayloadInput,
  BuildSubscribeStakeAssetPayloadInput,
  BuildSubscribeStakeCoinPayloadInput,
  BuildSubscribePayloadInput,
  BuildStakeTokenPayloadInput,
  BuildUnsubscribeAndWithdrawAssetPayloadInput,
  BuildUnsubscribeAndWithdrawCoinPayloadInput,
  BuildVaultSharesStakePayloadInput,
  GetRewardsEarnedInput,
  GetUnsubscribedPoolsInput,
  GetUserStakedBalanceInput,
  GetUserSubscribedPoolsInput,
  PendingReward,
  RewardData,
  RewardsPoolInfo,
  UserStakingPosition,
} from "./types";

export class RewardsClient {
  constructor(
    private readonly context: SdkContext<"movement-mainnet" | "aptos-testnet">,
    private readonly rewardsDiscovery?: RewardsDiscoveryClient
  ) {}

  buildStakeCoinPayload(input: BuildCoinStakePayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "stake",
      typeArguments: [input.coinType],
      functionArguments: [moveUintArgument(input.amount)],
    });
  }

  buildStakeAndSubscribeCoinPayload(
    input: BuildSubscribeStakeCoinPayloadInput
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "stake_and_subscribe",
      typeArguments: [input.coinType],
      functionArguments: [
        input.poolAddresses.map(normalizeMoveAddress),
        moveUintArgument(input.amount),
      ],
    });
  }

  buildStakeAssetPayload(input: BuildAssetStakePayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewards.address,
      moduleName: this.context.abis.multiRewards.name,
      functionName: "stake",
      functionArguments: [
        normalizeMoveAddress(input.stakingAsset),
        moveUintArgument(input.amount),
      ],
    });
  }

  buildStakeAndSubscribeAssetPayload(
    input: BuildSubscribeStakeAssetPayloadInput
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "stake_and_subscribe_fa",
      functionArguments: [
        normalizeMoveAddress(input.stakingAsset),
        moveUintArgument(input.amount),
        input.poolAddresses.map(normalizeMoveAddress),
      ],
    });
  }

  buildWithdrawCoinPayload(input: BuildCoinStakePayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "withdraw",
      typeArguments: [input.coinType],
      functionArguments: [moveUintArgument(input.amount)],
    });
  }

  buildWithdrawAssetPayload(input: BuildAssetStakePayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewards.address,
      moduleName: this.context.abis.multiRewards.name,
      functionName: "withdraw",
      functionArguments: [
        normalizeMoveAddress(input.stakingAsset),
        moveUintArgument(input.amount),
      ],
    });
  }

  buildClaimRewardsPayload(input: BuildClaimRewardsPayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "claim_rewards",
      functionArguments: [input.rewardTokenAddresses.map(normalizeMoveAddress)],
    });
  }

  buildSubscribePayload(input: BuildSubscribePayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewards.address,
      moduleName: this.context.abis.multiRewards.name,
      functionName: "subscribe",
      functionArguments: [normalizeMoveAddress(input.poolAddress)],
    });
  }

  buildUnsubscribePayload(input: BuildSubscribePayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewards.address,
      moduleName: this.context.abis.multiRewards.name,
      functionName: "unsubscribe",
      functionArguments: [normalizeMoveAddress(input.poolAddress)],
    });
  }

  buildUnsubscribeAndWithdrawCoinPayload(
    input: BuildUnsubscribeAndWithdrawCoinPayloadInput
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "unsubscribe_and_withdraw",
      typeArguments: [input.coinType],
      functionArguments: [
        input.poolAddresses.map(normalizeMoveAddress),
        moveUintArgument(input.amount),
      ],
    });
  }

  buildUnsubscribeAndWithdrawAssetPayload(
    input: BuildUnsubscribeAndWithdrawAssetPayloadInput
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "unsubscribe_and_withdraw_fa",
      functionArguments: [
        normalizeMoveAddress(input.stakingAsset),
        moveUintArgument(input.amount),
        input.poolAddresses.map(normalizeMoveAddress),
      ],
    });
  }

  buildCreateStakingPoolPayload(
    input: BuildCreateStakingPoolPayloadInput
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName: "create_staking_pool",
      typeArguments: [input.coinType],
    });
  }

  buildStakeTokenPayload(input: BuildStakeTokenPayloadInput): TransactionPayload {
    const functionName =
      input.poolAddresses && input.poolAddresses.length > 0
        ? "stake_and_subscribe_token"
        : "stake_token";

    return entryFunctionPayload({
      moduleAddress: this.context.abis.multiRewardsRouter.address,
      moduleName: this.context.abis.multiRewardsRouter.name,
      functionName,
      functionArguments:
        input.poolAddresses && input.poolAddresses.length > 0
          ? [
              input.poolAddresses.map(normalizeMoveAddress),
              moveUintArgument(input.amount),
              normalizeMoveAddress(input.tokenCreator),
              input.tokenName,
              input.tokenSymbol,
              String(input.tokenDecimals),
            ]
          : [
              moveUintArgument(input.amount),
              normalizeMoveAddress(input.tokenCreator),
              input.tokenName,
              input.tokenSymbol,
              String(input.tokenDecimals),
            ],
    });
  }

  async buildStakeVaultSharesPayload(
    input: BuildVaultSharesStakePayloadInput
  ): Promise<TransactionPayload> {
    const poolAddresses = await this.resolvePoolAddresses(input);

    if (poolAddresses.length > 0) {
      return this.buildStakeAndSubscribeAssetPayload({
        stakingAsset: input.stakingAsset,
        amount: input.amount,
        poolAddresses,
      });
    }

    return this.buildStakeAssetPayload({
      stakingAsset: input.stakingAsset,
      amount: input.amount,
    });
  }

  async getEarned(input: GetRewardsEarnedInput): Promise<bigint> {
    const earned = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: this.context.abis.multiRewards.address,
        moduleName: this.context.abis.multiRewards.name,
        functionName: "get_earned",
        functionArguments: [
          normalizeMoveAddress(input.userAddress),
          normalizeMoveAddress(input.poolAddress),
          normalizeMoveAddress(input.rewardTokenAddress),
        ],
      }
    );

    return readMoveU64(earned);
  }

  async getPoolInfo(poolAddress: string): Promise<RewardsPoolInfo> {
    const [stakingAsset, rewardTokenAddresses, totalStaked] = await callViewFunction<
      [unknown, unknown, unknown]
    >(
      this.context.client,
      {
        moduleAddress: this.context.abis.multiRewards.address,
        moduleName: this.context.abis.multiRewards.name,
        functionName: "get_pool_info",
        functionArguments: [normalizeMoveAddress(poolAddress)],
      }
    );

    return {
      rewardTokenAddresses: readMoveAddressVector(rewardTokenAddresses),
      stakingAsset: readMoveAddress(stakingAsset),
      totalStaked: readMoveU64(totalStaked),
    };
  }

  async getUnsubscribedPools(input: GetUnsubscribedPoolsInput): Promise<string[]> {
    const subscriptionResults = await Promise.all(
      input.poolAddresses.map(async (poolAddress) => {
        const isSubscribed = await callSingleViewResult(
          this.context.client,
          {
            moduleAddress: this.context.abis.multiRewards.address,
            moduleName: this.context.abis.multiRewards.name,
            functionName: "is_user_subscribed",
            functionArguments: [
              normalizeMoveAddress(input.userAddress),
              normalizeMoveAddress(poolAddress),
            ],
          }
        );

        return {
          isSubscribed: readMoveBool(isSubscribed),
          poolAddress: normalizeMoveAddress(poolAddress),
        };
      })
    );

    return subscriptionResults
      .filter((subscription) => !subscription.isSubscribed)
      .map((subscription) => subscription.poolAddress);
  }

  async getUserStakedBalance(input: GetUserStakedBalanceInput): Promise<bigint> {
    const balance = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: this.context.abis.multiRewards.address,
        moduleName: this.context.abis.multiRewards.name,
        functionName: "get_user_staked_balance",
        functionArguments: [
          normalizeMoveAddress(input.userAddress),
          normalizeMoveAddress(input.stakingAsset),
        ],
      }
    );

    return readMoveU64(balance);
  }

  async getUserSubscribedPools(input: GetUserSubscribedPoolsInput): Promise<string[]> {
    const pools = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: this.context.abis.multiRewards.address,
        moduleName: this.context.abis.multiRewards.name,
        functionName: "get_user_subscribed_pools",
        functionArguments: [
          normalizeMoveAddress(input.userAddress),
          normalizeMoveAddress(input.stakingAsset),
        ],
      }
    );

    return readMoveAddressVector(pools);
  }

  async getRewardData(poolAddress: string, rewardTokenAddress: string): Promise<RewardData> {
    const args = [normalizeMoveAddress(poolAddress), normalizeMoveAddress(rewardTokenAddress)];
    const [[rewardsDistributor, rewardsDuration, periodFinish, lastUpdateTime, rewardRate,
      rewardPerTokenStored], unallocatedRewards] = await Promise.all([
      callViewFunction<[unknown, unknown, unknown, unknown, unknown, unknown]>(
        this.context.client,
        {
          moduleAddress: this.context.abis.multiRewards.address,
          moduleName: this.context.abis.multiRewards.name,
          functionName: "get_reward_data",
          functionArguments: args,
        }
      ),
      callSingleViewResult(
        this.context.client,
        {
          moduleAddress: this.context.abis.multiRewards.address,
          moduleName: this.context.abis.multiRewards.name,
          functionName: "get_unallocated_rewards",
          functionArguments: args,
        }
      ),
    ]);

    return {
      lastUpdateTime: readMoveU64(lastUpdateTime),
      periodFinish: readMoveU64(periodFinish),
      rewardPerTokenStored: readMoveU128(rewardPerTokenStored),
      rewardRate: readMoveU128(rewardRate),
      rewardsDistributor: readMoveAddress(rewardsDistributor),
      rewardsDuration: readMoveU64(rewardsDuration),
      unallocatedRewards: readMoveU128(unallocatedRewards),
    };
  }

  async isUserSubscribed(userAddress: string, poolAddress: string): Promise<boolean> {
    const result = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: this.context.abis.multiRewards.address,
        moduleName: this.context.abis.multiRewards.name,
        functionName: "is_user_subscribed",
        functionArguments: [
          normalizeMoveAddress(userAddress),
          normalizeMoveAddress(poolAddress),
        ],
      }
    );

    return readMoveBool(result);
  }

  async getUserStakingPosition(
    input: GetUserSubscribedPoolsInput
  ): Promise<UserStakingPosition> {
    const [totalStaked, subscribedPools] = await Promise.all([
      this.getUserStakedBalance(input),
      this.getUserSubscribedPools(input),
    ]);

    const poolInfos = await Promise.all(subscribedPools.map((p) => this.getPoolInfo(p)));

    const rewardQueries = poolInfos.flatMap((poolInfo, i) =>
      poolInfo.rewardTokenAddresses.map((rewardTokenAddress) => ({
        poolAddress: subscribedPools[i] as string,
        rewardTokenAddress,
      }))
    );

    const earnedAmounts = await Promise.all(
      rewardQueries.map(({ poolAddress, rewardTokenAddress }) =>
        this.getEarned({ userAddress: input.userAddress, poolAddress, rewardTokenAddress })
      )
    );

    const pendingRewards: PendingReward[] = rewardQueries
      .map(({ poolAddress, rewardTokenAddress }, i) => ({
        amount: earnedAmounts[i] ?? 0n,
        poolAddress,
        rewardTokenAddress,
      }))
      .filter((r): r is PendingReward => r.amount > 0n);

    return {
      pendingRewards,
      stakingAsset: normalizeMoveAddress(input.stakingAsset),
      subscribedPools,
      totalStaked,
    };
  }

  private async resolvePoolAddresses(
    input: BuildVaultSharesStakePayloadInput
  ): Promise<string[]> {
    if (input.poolAddresses && input.poolAddresses.length > 0) {
      return input.userAddress
        ? this.getUnsubscribedPools({
            userAddress: input.userAddress,
            poolAddresses: input.poolAddresses,
          })
        : input.poolAddresses.map(normalizeMoveAddress);
    }

    const discoveredPools = this.rewardsDiscovery
      ? await this.rewardsDiscovery.resolvePoolAddresses({
          stakingAsset: input.stakingAsset,
        })
      : [];

    if (discoveredPools.length === 0) {
      throw new CanopyError(
        "No staking pools found for staking asset",
        CanopyErrorCode.TransactionBuildFailed,
        {
          stakingAsset: normalizeMoveAddress(input.stakingAsset),
        }
      );
    }

    return input.userAddress
      ? this.getUnsubscribedPools({
          userAddress: input.userAddress,
          poolAddresses: discoveredPools,
        })
      : discoveredPools;
  }
}
