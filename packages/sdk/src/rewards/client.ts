import {
  CanopyError,
  CanopyErrorCode,
  callSingleViewResult,
  callSingleViewPayloadResult,
  callViewFunction,
  callViewPayloadFunction,
  entryFunctionPayload,
  moveUintArgument,
  normalizeMoveAddress,
} from "@canopyhub/canopy-sdk-core";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk-bindings";
import type { SdkContext, TransactionPayload } from "../types";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveBool,
  readMoveOption,
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
  GetUserSubscribedPoolsInput,
  GetUserStakedBalanceInput,
  PendingReward,
  RewardData,
  RewardsRegistryOverview,
  RewardsRegistryOverviewInput,
  RewardsPoolDetails,
  RewardsPoolInfo,
  RewardsRewardTokenDetails,
  RewardsSnapshot,
  RewardsSnapshotInput,
  RewardsUserPoolPosition,
  RewardsUserRewardsOverview,
  RewardsUserRewardsOverviewInput,
  RewardsUserPoolPositionsInput,
  RewardsUserPoolPositionsByTokenInput,
  RewardsUserPoolPositionsByTokensInput,
  UserStakingPosition,
} from "./types";
import { abiViewPayload } from "../internal/abi-views";

/**
 * Entry functions this client builds, split by the module they live on.
 *
 * Literal unions replace the compile-time function-name checking Surf provided;
 * `tests/` asserts each name is an `is_entry` function on the bound ABI with
 * matching arity.
 */
export type RewardsRouterFunction =
  | "stake"
  | "stake_and_subscribe"
  | "stake_and_subscribe_fa"
  | "stake_token"
  | "stake_and_subscribe_token"
  | "withdraw"
  | "claim_rewards"
  | "unsubscribe_and_withdraw"
  | "unsubscribe_and_withdraw_fa"
  | "create_staking_pool";

export type RewardsModuleFunction = "stake" | "withdraw" | "subscribe" | "unsubscribe";

/**
 * View functions this client reads, split by the module that hosts them exactly as the
 * entry unions above are.
 *
 * These names had no compile-time check at all after Surf was removed — Surf typed them
 * via `SurfViewFunctionName<TAbi>`, and the replacement literal unions initially covered
 * only entry functions. Every name below is reached through a typed helper
 * (`rewardsViewPayload` / `multiRewardsView`) so a typo or a rename fails to compile, and
 * `tests/abi-conformance.test.ts` asserts each one is an `is_view` function on the bound
 * ABI.
 */
export type RewardsViewFunction =
  | "get_pool_details"
  | "get_reward_token_details"
  | "get_rewards_snapshot"
  | "get_registry_overview"
  | "get_registered_pool_count"
  | "get_user_pool_positions"
  | "get_user_pool_positions_by_token"
  | "get_user_pool_positions_by_tokens"
  | "is_pool_registered";

/**
 * Views on the `multi_rewards` module itself, as opposed to the optional
 * `canopyRewardsView` helper module that `RewardsViewFunction` covers. Easy to miss in a
 * sweep for `abiViewPayload` call sites, because these build their module id inline.
 */
export type RewardsModuleViewFunction =
  | "get_earned"
  | "get_pool_info"
  | "is_user_subscribed"
  | "get_user_staked_balance"
  | "get_user_subscribed_pools"
  | "get_reward_data"
  | "get_unallocated_rewards";

export class RewardsClient {
  static fromContext(
    context: SdkContext<"movement-mainnet" | "aptos-testnet">,
    rewardsDiscovery?: RewardsDiscoveryClient
  ): RewardsClient {
    return new RewardsClient(context, rewardsDiscovery);
  }

  constructor(
    private readonly context: Pick<
      SdkContext<"movement-mainnet" | "aptos-testnet">,
      "abis" | "chain" | "client"
    >,
    private readonly rewardsDiscovery?: RewardsDiscoveryClient
  ) {}

  buildStakeCoinPayload(input: BuildCoinStakePayloadInput): TransactionPayload {
    return this.buildRouterPayload("stake", [moveUintArgument(input.amount)], [
      input.coinType,
    ]);
  }

  buildStakeAndSubscribeCoinPayload(
    input: BuildSubscribeStakeCoinPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload(
      "stake_and_subscribe",
      [
        input.poolAddresses.map((address) => normalizeMoveAddress(address)),
        moveUintArgument(input.amount),
      ],
      [input.coinType]
    );
  }

  buildStakeAssetPayload(input: BuildAssetStakePayloadInput): TransactionPayload {
    return this.buildModulePayload("stake", [
      normalizeMoveAddress(input.stakingAsset),
      moveUintArgument(input.amount),
    ]);
  }

  buildStakeAndSubscribeAssetPayload(
    input: BuildSubscribeStakeAssetPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload("stake_and_subscribe_fa", [
      normalizeMoveAddress(input.stakingAsset),
      moveUintArgument(input.amount),
      input.poolAddresses.map((address) => normalizeMoveAddress(address)),
    ]);
  }

  buildWithdrawCoinPayload(input: BuildCoinStakePayloadInput): TransactionPayload {
    return this.buildRouterPayload("withdraw", [moveUintArgument(input.amount)], [
      input.coinType,
    ]);
  }

  buildWithdrawAssetPayload(input: BuildAssetStakePayloadInput): TransactionPayload {
    return this.buildModulePayload("withdraw", [
      normalizeMoveAddress(input.stakingAsset),
      moveUintArgument(input.amount),
    ]);
  }

  buildClaimRewardsPayload(input: BuildClaimRewardsPayloadInput): TransactionPayload {
    return this.buildRouterPayload("claim_rewards", [
      input.rewardTokenAddresses.map((address) => normalizeMoveAddress(address)),
    ]);
  }

  buildSubscribePayload(input: BuildSubscribePayloadInput): TransactionPayload {
    return this.buildModulePayload("subscribe", [
      normalizeMoveAddress(input.poolAddress),
    ]);
  }

  buildUnsubscribePayload(input: BuildSubscribePayloadInput): TransactionPayload {
    return this.buildModulePayload("unsubscribe", [
      normalizeMoveAddress(input.poolAddress),
    ]);
  }

  buildUnsubscribeAndWithdrawCoinPayload(
    input: BuildUnsubscribeAndWithdrawCoinPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload(
      "unsubscribe_and_withdraw",
      [
        input.poolAddresses.map((address) => normalizeMoveAddress(address)),
        moveUintArgument(input.amount),
      ],
      [input.coinType]
    );
  }

  buildUnsubscribeAndWithdrawAssetPayload(
    input: BuildUnsubscribeAndWithdrawAssetPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload("unsubscribe_and_withdraw_fa", [
      normalizeMoveAddress(input.stakingAsset),
      moveUintArgument(input.amount),
      input.poolAddresses.map((address) => normalizeMoveAddress(address)),
    ]);
  }

  buildCreateStakingPoolPayload(
    input: BuildCreateStakingPoolPayloadInput
  ): TransactionPayload {
    return this.buildRouterPayload("create_staking_pool", [], [input.coinType]);
  }

  buildStakeTokenPayload(input: BuildStakeTokenPayloadInput): TransactionPayload {
    const subscribing = Boolean(input.poolAddresses && input.poolAddresses.length > 0);
    const tokenArguments = [
      moveUintArgument(input.amount),
      normalizeMoveAddress(input.tokenCreator),
      input.tokenName,
      input.tokenSymbol,
      String(input.tokenDecimals),
    ];

    return subscribing
      ? this.buildRouterPayload("stake_and_subscribe_token", [
          (input.poolAddresses ?? []).map((address) => normalizeMoveAddress(address)),
          ...tokenArguments,
        ])
      : this.buildRouterPayload("stake_token", tokenArguments);
  }

  /**
   * Plain entry payloads carry no `abi` field, so `@aptos-labs/ts-sdk` fetches the
   * entry-function ABI itself and strips the leading `&signer`. Surf's
   * `createEntryPayload` attached an `abi` whose `parameters` still included the
   * signer while `functionArguments` did not, so every argument was matched off by
   * one and `transaction.build.simple` rejected argument 0.
   */
  private buildRouterPayload(
    functionName: RewardsRouterFunction,
    functionArguments: unknown[],
    typeArguments: string[] = []
  ): TransactionPayload {
    return this.buildAbiPayload(
      this.context.abis.multiRewardsRouter,
      functionName,
      functionArguments,
      typeArguments
    );
  }

  private buildModulePayload(
    functionName: RewardsModuleFunction,
    functionArguments: unknown[],
    typeArguments: string[] = []
  ): TransactionPayload {
    return this.buildAbiPayload(
      this.context.abis.multiRewards,
      functionName,
      functionArguments,
      typeArguments
    );
  }

  private buildAbiPayload(
    abi: MoveModuleAbi,
    functionName: string,
    functionArguments: unknown[],
    typeArguments: string[]
  ): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: abi.address,
      moduleName: abi.name,
      functionName,
      typeArguments,
      functionArguments: functionArguments as never,
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
        ...this.multiRewardsView("get_earned"),
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
        ...this.multiRewardsView("get_pool_info"),
        functionArguments: [normalizeMoveAddress(poolAddress)],
      }
    );

    return {
      rewardTokenAddresses: readMoveAddressVector(rewardTokenAddresses),
      stakingAsset: readMoveAddress(stakingAsset),
      totalStaked: readMoveU64(totalStaked),
    };
  }

  async getPoolDetails(poolAddress: string): Promise<RewardsPoolDetails> {
    const pool = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("get_pool_details", [normalizeMoveAddress(poolAddress)])
    );

    return readPoolDetails(pool);
  }

  async getRewardTokenDetails(
    poolAddress: string
  ): Promise<RewardsRewardTokenDetails[]> {
    const rewardTokens = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("get_reward_token_details", [normalizeMoveAddress(poolAddress)])
    );

    return readRewardTokenDetailsVector(rewardTokens);
  }

  async getRewardsSnapshot(
    input: RewardsSnapshotInput = {}
  ): Promise<RewardsSnapshot> {
    const [pools, userPositions] = await callViewPayloadFunction<[unknown, unknown]>(
      this.context.client,
      this.rewardsViewPayload("get_rewards_snapshot", [
        moveOptionU64Argument(input.offset),
        moveOptionU64Argument(input.limit),
        moveOptionAddressArgument(input.userAddress),
      ])
    );

    return {
      pools: readPoolDetailsVector(pools),
      userPositions: readMoveOption(userPositions, readUserPoolPositionVector),
    };
  }

  async getRegistryOverview(
    input: RewardsRegistryOverviewInput = {}
  ): Promise<RewardsRegistryOverview> {
    const [snapshotTimestamp, statusFlag0, statusFlag1, poolsIncluded, pools] =
      await callViewPayloadFunction<[unknown, unknown, unknown, unknown, unknown]>(
        this.context.client,
        this.rewardsViewPayload("get_registry_overview", [
          moveOptionU64Argument(input.offset),
          moveOptionU64Argument(input.limit),
          input.includePools ?? true,
        ])
      );

    return {
      pools: readMoveOption(pools, readPoolDetailsVector),
      poolsIncluded: readMoveBool(poolsIncluded),
      snapshotTimestamp: readMoveU64(snapshotTimestamp),
      statusFlags: [
        readMoveBool(statusFlag0),
        readMoveBool(statusFlag1),
      ] as const,
    };
  }

  async getRegisteredPoolCount(): Promise<bigint> {
    const count = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("get_registered_pool_count")
    );

    return readMoveU64(count);
  }

  async getUserPoolPositions(
    input: RewardsUserPoolPositionsInput
  ): Promise<RewardsUserPoolPosition[]> {
    const positions = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("get_user_pool_positions", [
        normalizeMoveAddress(input.userAddress),
        moveOptionU64Argument(input.offset),
        moveOptionU64Argument(input.limit),
      ])
    );

    return readUserPoolPositionVector(positions);
  }

  async getUserPoolPositionsByToken(
    input: RewardsUserPoolPositionsByTokenInput
  ): Promise<RewardsUserPoolPosition[]> {
    const positions = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("get_user_pool_positions_by_token", [
        normalizeMoveAddress(input.userAddress),
        normalizeMoveAddress(input.stakingAsset),
        moveOptionU64Argument(input.offset),
        moveOptionU64Argument(input.limit),
      ])
    );

    return readUserPoolPositionVector(positions);
  }

  async getUserPoolPositionsByTokens(
    input: RewardsUserPoolPositionsByTokensInput
  ): Promise<RewardsUserPoolPosition[]> {
    const positions = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("get_user_pool_positions_by_tokens", [
        normalizeMoveAddress(input.userAddress),
        input.stakingAssets.map((address) => normalizeMoveAddress(address)),
        moveOptionU64Argument(input.offset),
        moveOptionU64Argument(input.limit),
      ])
    );

    return readUserPoolPositionVector(positions);
  }

  async isPoolRegistered(poolAddress: string): Promise<boolean> {
    const registered = await callSingleViewPayloadResult(
      this.context.client,
      this.rewardsViewPayload("is_pool_registered", [normalizeMoveAddress(poolAddress)])
    );

    return readMoveBool(registered);
  }

  async getUserRewardsOverview(
    input: RewardsUserRewardsOverviewInput
  ): Promise<RewardsUserRewardsOverview> {
    const pagination =
      input.limit === undefined && input.offset === undefined
        ? {}
        : {
            ...(input.limit === undefined ? {} : { limit: input.limit }),
            ...(input.offset === undefined ? {} : { offset: input.offset }),
          };
    const [registry, userPositions] = await Promise.all([
      this.getRegistryOverview({
        ...pagination,
        ...(input.includePools === undefined ? {} : { includePools: input.includePools }),
      }),
      this.getUserPoolPositions({
        userAddress: input.userAddress,
        ...pagination,
      }),
    ]);

    return {
      ...registry,
      userPositions,
    };
  }

  async getUnsubscribedPools(input: GetUnsubscribedPoolsInput): Promise<string[]> {
    const subscriptionResults = await Promise.all(
      input.poolAddresses.map(async (poolAddress) => {
        const isSubscribed = await callSingleViewResult(
          this.context.client,
          {
            ...this.multiRewardsView("is_user_subscribed"),
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
        ...this.multiRewardsView("get_user_staked_balance"),
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
        ...this.multiRewardsView("get_user_subscribed_pools"),
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
          ...this.multiRewardsView("get_reward_data"),
          functionArguments: args,
        }
      ),
      callSingleViewResult(
        this.context.client,
        {
          ...this.multiRewardsView("get_unallocated_rewards"),
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
        ...this.multiRewardsView("is_user_subscribed"),
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
        : input.poolAddresses.map((address) => normalizeMoveAddress(address));
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

  private getRewardsViewAbi() {
    const abi =
      "canopyRewardsView" in this.context.abis
        ? this.context.abis.canopyRewardsView
        : undefined;

    if (!abi) {
      throw new CanopyError(
        "Rewards batch views are not available on this chain",
        CanopyErrorCode.InvalidDeployment,
        { chain: this.context.chain }
      );
    }

    return abi;
  }

  /**
   * View payload against the optional `canopyRewardsView` helper module, with the function
   * name constrained to `RewardsViewFunction`. Throws via `getRewardsViewAbi` on chains
   * where that module is not deployed, exactly as the inline call sites did.
   */
  private rewardsViewPayload(
    functionName: RewardsViewFunction,
    functionArguments?: unknown[]
  ) {
    return abiViewPayload(this.getRewardsViewAbi(), functionName, functionArguments);
  }

  /**
   * Module id for a view on the `multi_rewards` module, with the name constrained to
   * `RewardsModuleViewFunction`. Spread into a view input alongside `functionArguments`.
   */
  private multiRewardsView(functionName: RewardsModuleViewFunction) {
    return {
      moduleAddress: this.context.abis.multiRewards.address,
      moduleName: this.context.abis.multiRewards.name,
      functionName,
    };
  }
}

function readPoolDetailsVector(value: unknown): RewardsPoolDetails[] {
  if (!Array.isArray(value)) {
    throw new CanopyError("Expected pool details vector", CanopyErrorCode.ViewCallFailed, {
      valueType: typeof value,
    });
  }

  return value.map(readPoolDetails);
}

function readRewardTokenDetailsVector(value: unknown): RewardsRewardTokenDetails[] {
  if (!Array.isArray(value)) {
    throw new CanopyError(
      "Expected reward token details vector",
      CanopyErrorCode.ViewCallFailed,
      { valueType: typeof value }
    );
  }

  return value.map(readRewardTokenDetails);
}

function readPoolDetails(value: unknown): RewardsPoolDetails {
  const pool = value as Record<string, unknown>;

  return {
    owner: readMoveAddress(pool.owner),
    poolAddress: readMoveAddress(pool.pool_address),
    rewardTokenAddresses: readMoveAddressVector(pool.reward_tokens),
    stakingAsset: readMoveAddress(pool.staking_token),
    stakingTokenSupply: readMoveOption(pool.staking_token_supply, readMoveU128),
    totalSubscribed: readMoveU64(pool.total_subscribed),
  };
}

function readRewardTokenDetails(value: unknown): RewardsRewardTokenDetails {
  const reward = value as Record<string, unknown>;

  return {
    distributor: readMoveAddress(reward.distributor),
    duration: readMoveU64(reward.duration),
    lastUpdateTime: readMoveU64(reward.last_update_time),
    periodFinish: readMoveU64(reward.period_finish),
    remainingRewards: readMoveU128(reward.remaining_rewards),
    rewardPerToken: readMoveU128(reward.reward_per_token),
    rewardRate: readMoveU128(reward.reward_rate),
    rewardTokenAddress: readMoveAddress(reward.token),
    unallocatedRewards: readMoveU128(reward.unallocated_rewards),
  };
}

function readUserPoolPositionVector(value: unknown): RewardsUserPoolPosition[] {
  if (!Array.isArray(value)) {
    throw new CanopyError(
      "Expected user pool position vector",
      CanopyErrorCode.ViewCallFailed,
      { valueType: typeof value }
    );
  }

  return value.map(readUserPoolPosition);
}

function readUserPoolPosition(value: unknown): RewardsUserPoolPosition {
  const position = value as Record<string, unknown>;

  return {
    effectiveStakedAmount: readMoveU64(position.effective_staked_amount),
    isSubscribed: readMoveBool(position.is_subscribed),
    poolAddress: readMoveAddress(position.pool),
    rewards: readUserRewardVector(position.rewards),
    stakingAsset: readMoveAddress(position.pool_staking_token),
  };
}

function readUserRewardVector(value: unknown): RewardsUserPoolPosition["rewards"] {
  if (!Array.isArray(value)) {
    throw new CanopyError("Expected user rewards vector", CanopyErrorCode.ViewCallFailed, {
      valueType: typeof value,
    });
  }

  return value.map((reward) => {
    const item = reward as Record<string, unknown>;

    return {
      earnedAmount: readMoveU64(item.earned_amount),
      rewardPerTokenPaid: readMoveU128(item.reward_per_token_paid),
      rewardTokenAddress: readMoveAddress(item.reward_token),
    };
  });
}

function moveOptionU64Argument(value: bigint | number | undefined): string | undefined {
  return value === undefined ? undefined : moveUintArgument(value);
}

function moveOptionAddressArgument(value: string | undefined): `0x${string}` | undefined {
  return value === undefined ? undefined : normalizeMoveAddress(value);
}
