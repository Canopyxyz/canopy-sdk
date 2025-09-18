import { Aptos, type InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import MULTI_REWARDS_ABI from "../abis/mainnet/multi_rewards.json";
import MULTI_REWARDS_ROUTER_ABI from "../abis/mainnet/multi_rewards_router.json";
import { CanopyError, CanopyErrorCode } from "../types";
import { ERROR_MESSAGES } from "../constants";
import { MultiRewardsGQLClient } from "./multi-rewards-gql-client";
import {
  STAKING_TOKEN_POOL_MAPPINGS,
  hasStaticPoolMapping,
  getStaticPoolMapping,
} from "../constants/pool-mappings";
import type {
  StakingPoolInfo,
  RewardData,
  PendingReward,
  UserStakingPosition,
} from "./multi-rewards-types";
import type { MRStakingPool } from "./multi-rewards-gql-types";

/**
 * Client for interacting with multi-rewards staking pools
 */
export interface MultiRewardsClientOptions {
  sentioApiKey?: string;
}

export class MultiRewardsClient {
  private gqlClient: MultiRewardsGQLClient;

  constructor(private aptos: Aptos, options?: MultiRewardsClientOptions) {
    this.gqlClient = new MultiRewardsGQLClient(options?.sentioApiKey);
  }

  /**
   * Stake tokens using coin type (creates FA if needed)
   */
  async stake(
    coinType: string,
    amount: bigint,
    options?: { pools?: string[] }
  ): Promise<InputEntryFunctionData> {
    if (typeof amount !== "bigint") {
      throw new CanopyError(
        "Amount must be a bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    if (amount <= 0n) {
      throw new CanopyError(
        "Stake amount must be greater than zero",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount: amount.toString() }
      );
    }

    if (options?.pools && !Array.isArray(options.pools)) {
      throw new CanopyError(
        "Pools must be an array of pool addresses",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { pools: options.pools }
      );
    }

    try {
      if (options?.pools && options.pools.length > 0) {
        for (const pool of options.pools) {
          if (!pool || typeof pool !== "string" || !pool.startsWith("0x")) {
            throw new CanopyError(
              "Invalid pool address format",
              CanopyErrorCode.INVALID_POOL_ADDRESS,
              { pool }
            );
          }
        }

        return {
          typeArguments: [coinType],
          functionArguments: [options.pools, amount.toString()],
          function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::stake_and_subscribe`,
        };
      } else {
        return {
          typeArguments: [coinType],
          functionArguments: [amount.toString()],
          function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::stake`,
        };
      }
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }
      throw new CanopyError(
        "Failed to create stake transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Stake fungible asset tokens
   */
  async stakeFa(
    stakingToken: string,
    amount: bigint,
    pools?: string[]
  ): Promise<InputEntryFunctionData> {
    if (!stakingToken || typeof stakingToken !== "string") {
      throw new CanopyError(
        "Staking token address is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }

    if (!stakingToken.startsWith("0x")) {
      throw new CanopyError(
        "Staking token address must be in valid format (0x...)",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }

    if (typeof amount !== "bigint") {
      throw new CanopyError(
        "Amount must be a bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    if (amount <= 0n) {
      throw new CanopyError(
        "Stake amount must be greater than zero",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount: amount.toString() }
      );
    }

    if (pools && !Array.isArray(pools)) {
      throw new CanopyError(
        "Pools must be an array of pool addresses",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { pools }
      );
    }

    try {
      if (pools && pools.length > 0) {
        for (const pool of pools) {
          if (!pool || typeof pool !== "string" || !pool.startsWith("0x")) {
            throw new CanopyError(
              "Invalid pool address format",
              CanopyErrorCode.INVALID_POOL_ADDRESS,
              { pool }
            );
          }
        }

        return {
          typeArguments: [],
          functionArguments: [stakingToken, amount.toString(), pools],
          function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::stake_and_subscribe_fa`,
        };
      } else {
        return {
          typeArguments: [],
          functionArguments: [stakingToken, amount.toString()],
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::stake`,
        };
      }
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }
      throw new CanopyError(
        "Failed to create FA stake transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { stakingToken, amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Create staking pool and stake with token creation
   */
  async stakeToken(
    amount: bigint,
    tokenCreator: string,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    pools?: string[]
  ): Promise<InputEntryFunctionData> {
    try {
      if (pools && pools.length > 0) {
        return {
          function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::stake_and_subscribe_token`,
          typeArguments: [],
          functionArguments: [
            pools,
            amount.toString(),
            tokenCreator,
            tokenName,
            tokenSymbol,
            tokenDecimals.toString(),
          ],
        };
      } else {
        return {
          function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::stake_token`,
          typeArguments: [],
          functionArguments: [
            amount.toString(),
            tokenCreator,
            tokenName,
            tokenSymbol,
            tokenDecimals.toString(),
          ],
        };
      }
    } catch (error) {
      throw new CanopyError(
        "Failed to create stake token transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { amount: amount.toString(), tokenName, originalError: error }
      );
    }
  }

  /**
   * Withdraw (unstake) tokens using coin type
   */
  async withdraw(
    coinType: string,
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    if (typeof amount !== "bigint") {
      throw new CanopyError(
        "Amount must be a bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    if (amount <= 0n) {
      throw new CanopyError(
        "Withdraw amount must be greater than zero",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount: amount.toString() }
      );
    }

    try {
      return {
        typeArguments: [coinType],
        functionArguments: [amount.toString()],
        function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::withdraw`,
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create withdraw transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Withdraw FA tokens
   */
  async withdrawFa(
    stakingToken: string,
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    if (
      !stakingToken ||
      typeof stakingToken !== "string" ||
      !stakingToken.startsWith("0x")
    ) {
      throw new CanopyError(
        "Staking token address is required and must be in valid format (0x...)",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }

    if (typeof amount !== "bigint" || amount <= 0n) {
      throw new CanopyError(
        "Amount must be a positive bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    try {
      return {
        function: `${MULTI_REWARDS_ABI.address}::multi_rewards::withdraw`,
        typeArguments: [],
        functionArguments: [stakingToken, amount.toString()],
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create FA withdraw transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { stakingToken, amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Unsubscribe from pools and withdraw using coin type
   */
  async unsubscribeAndWithdraw(
    coinType: string,
    pools: string[],
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    if (!pools || !Array.isArray(pools) || pools.length === 0) {
      throw new CanopyError(
        "Pools array is required and must not be empty",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { pools }
      );
    }

    if (typeof amount !== "bigint" || amount <= 0n) {
      throw new CanopyError(
        "Amount must be a positive bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    try {
      return {
        typeArguments: [coinType],
        functionArguments: [pools, amount.toString()],
        function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::unsubscribe_and_withdraw`,
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create unsubscribe and withdraw transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { pools, amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Unsubscribe from pools and withdraw FA
   */
  async unsubscribeAndWithdrawFa(
    stakingToken: string,
    pools: string[],
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    if (
      !stakingToken ||
      typeof stakingToken !== "string" ||
      !stakingToken.startsWith("0x")
    ) {
      throw new CanopyError(
        "Staking token address is required and must be in valid format (0x...)",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }

    if (!pools || !Array.isArray(pools) || pools.length === 0) {
      throw new CanopyError(
        "Pools array is required and must not be empty",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { pools }
      );
    }

    if (typeof amount !== "bigint" || amount <= 0n) {
      throw new CanopyError(
        "Amount must be a positive bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    try {
      return {
        function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::unsubscribe_and_withdraw_fa`,
        typeArguments: [],
        functionArguments: [stakingToken, amount.toString(), pools],
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create unsubscribe and withdraw FA transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { stakingToken, amount: amount.toString(), pools, originalError: error }
      );
    }
  }

  /**
   * Claim rewards for multiple staking tokens
   */
  async claimRewards(stakingTokens: string[]): Promise<InputEntryFunctionData> {
    if (
      !stakingTokens ||
      !Array.isArray(stakingTokens) ||
      stakingTokens.length === 0
    ) {
      throw new CanopyError(
        "Staking tokens array is required and must not be empty",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingTokens }
      );
    }

    for (const token of stakingTokens) {
      if (!token || typeof token !== "string" || !token.startsWith("0x")) {
        throw new CanopyError(
          "Invalid staking token address format",
          CanopyErrorCode.INVALID_VAULT_ADDRESS,
          { token }
        );
      }
    }

    try {
      return {
        function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::claim_rewards`,
        typeArguments: [],
        functionArguments: [stakingTokens],
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create claim rewards transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { stakingTokens, originalError: error }
      );
    }
  }

  /**
   * Create a new staking pool for a coin type
   */
  async createStakingPool(coinType: string): Promise<InputEntryFunctionData> {
    try {
      return {
        functionArguments: [],
        typeArguments: [coinType],
        function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::create_staking_pool`,
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create staking pool transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { originalError: error }
      );
    }
  }

  /**
   * Subscribe to a staking pool
   */
  async subscribe(pool: string): Promise<InputEntryFunctionData> {
    try {
      return {
        function: `${MULTI_REWARDS_ABI.address}::multi_rewards::subscribe`,
        typeArguments: [],
        functionArguments: [pool],
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create subscribe transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { pool, originalError: error }
      );
    }
  }

  /**
   * Unsubscribe from a staking pool
   */
  async unsubscribe(pool: string): Promise<InputEntryFunctionData> {
    try {
      return {
        function: `${MULTI_REWARDS_ABI.address}::multi_rewards::unsubscribe`,
        typeArguments: [],
        functionArguments: [pool],
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to create unsubscribe transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { pool, originalError: error }
      );
    }
  }

  /**
   * Get user's staked balance for a staking token
   */
  async getUserStakedBalance(
    userAddress: string,
    stakingToken: string
  ): Promise<string> {
    try {
      const [balance] = await this.aptos.view({
        payload: {
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::get_user_staked_balance`,
          functionArguments: [userAddress, stakingToken],
        },
      });

      return String(balance);
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_GET_STRATEGY_DETAILS,
        CanopyErrorCode.NETWORK_ERROR,
        { userAddress, stakingToken, originalError: error }
      );
    }
  }

  /**
   * Get user's earned rewards for a specific pool and reward token
   */
  async getUserEarned(
    userAddress: string,
    pool: string,
    rewardToken: string
  ): Promise<string> {
    try {
      const [earned] = await this.aptos.view({
        payload: {
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::get_earned`,
          functionArguments: [userAddress, pool, rewardToken],
        },
      });

      return String(earned);
    } catch (error) {
      throw new CanopyError(
        "Failed to get user earned rewards",
        CanopyErrorCode.NETWORK_ERROR,
        { userAddress, pool, rewardToken, originalError: error }
      );
    }
  }

  /**
   * Get user's subscribed pools for a staking token
   */
  async getUserSubscribedPools(
    userAddress: string,
    stakingToken: string
  ): Promise<string[]> {
    try {
      const [pools] = await this.aptos.view({
        payload: {
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::get_user_subscribed_pools`,
          functionArguments: [userAddress, stakingToken],
        },
      });

      return Array.isArray(pools) ? pools.map(String) : [];
    } catch (error) {
      throw new CanopyError(
        "Failed to get user subscribed pools",
        CanopyErrorCode.NETWORK_ERROR,
        { userAddress, stakingToken, originalError: error }
      );
    }
  }

  /**
   * Get staking pool information
   */
  async getPoolInfo(pool: string): Promise<StakingPoolInfo> {
    try {
      const [stakingToken, rewardTokens, totalSubscribed] =
        await this.aptos.view({
          payload: {
            function: `${MULTI_REWARDS_ABI.address}::multi_rewards::get_pool_info`,
            functionArguments: [pool],
          },
        });

      return {
        poolAddress: pool,
        owner: "", // Would need additional call to get owner
        stakingToken: String(stakingToken),
        rewardTokens: Array.isArray(rewardTokens)
          ? rewardTokens.map(String)
          : [],
        totalSubscribed: String(totalSubscribed),
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to get pool info",
        CanopyErrorCode.NETWORK_ERROR,
        { pool, originalError: error }
      );
    }
  }

  /**
   * Get reward data for a pool and reward token
   */
  async getRewardData(pool: string, rewardToken: string): Promise<RewardData> {
    try {
      const [
        rewardsDistributor,
        rewardsDuration,
        periodFinish,
        lastUpdateTime,
        rewardRate,
        rewardPerTokenStored,
      ] = await this.aptos.view({
        payload: {
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::get_reward_data`,
          functionArguments: [pool, rewardToken],
        },
      });

      return {
        rewardsDistributor: String(rewardsDistributor),
        rewardsDuration: String(rewardsDuration),
        periodFinish: String(periodFinish),
        lastUpdateTime: String(lastUpdateTime),
        rewardRate: String(rewardRate),
        rewardPerTokenStored: String(rewardPerTokenStored),
        unallocatedRewards: "0", // Would need additional call
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to get reward data",
        CanopyErrorCode.NETWORK_ERROR,
        { pool, rewardToken, originalError: error }
      );
    }
  }

  /**
   * Check if user is subscribed to a pool
   */
  async isUserSubscribed(userAddress: string, pool: string): Promise<boolean> {
    try {
      const [isSubscribed] = await this.aptos.view({
        payload: {
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::is_user_subscribed`,
          functionArguments: [userAddress, pool],
        },
      });

      return Boolean(isSubscribed);
    } catch (error) {
      throw new CanopyError(
        "Failed to check user subscription",
        CanopyErrorCode.NETWORK_ERROR,
        { userAddress, pool, originalError: error }
      );
    }
  }

  /**
   * Get user staking position
   */
  async getUserStakingPosition(
    userAddress: string,
    stakingToken: string
  ): Promise<UserStakingPosition> {
    try {
      const [stakedBalance, subscribedPools] = await Promise.all([
        this.getUserStakedBalance(userAddress, stakingToken),
        this.getUserSubscribedPools(userAddress, stakingToken),
      ]);

      // Get pending rewards for each subscribed pool
      const pendingRewards: PendingReward[] = [];
      for (const pool of subscribedPools) {
        try {
          const poolInfo = await this.getPoolInfo(pool);
          for (const rewardToken of poolInfo.rewardTokens) {
            const earned = await this.getUserEarned(
              userAddress,
              pool,
              rewardToken
            );
            if (earned !== "0") {
              pendingRewards.push({
                poolAddress: pool,
                rewardToken,
                amount: earned,
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to get rewards for pool ${pool}:`, error);
        }
      }

      return {
        stakingToken,
        totalStaked: stakedBalance,
        subscribedPools,
        pendingRewards,
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to get user staking position",
        CanopyErrorCode.NETWORK_ERROR,
        { userAddress, stakingToken, originalError: error }
      );
    }
  }

  /**
   * Stake tokens into reward pools with automatic subscription
   * @param stakingToken The staking token address
   * @param amount Amount to stake
   * @param userAddress Optional user address for subscription checking
   * @param poolAddresses Optional pool addresses to use directly
   */
  async stakeVaultShares(
    stakingToken: string,
    amount: bigint,
    userAddress?: string,
    poolAddresses?: string[]
  ): Promise<InputEntryFunctionData> {
    if (!stakingToken || typeof stakingToken !== "string") {
      throw new CanopyError(
        "Staking token address is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }

    if (!stakingToken.startsWith("0x")) {
      throw new CanopyError(
        "Staking token address must be in valid format (0x...)",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }

    if (typeof amount !== "bigint") {
      throw new CanopyError(
        "Amount must be a bigint",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    if (amount <= 0n) {
      throw new CanopyError(
        "Stake amount must be greater than zero",
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount: amount.toString() }
      );
    }

    try {
      let poolIds: string[] = [];

      if (poolAddresses && poolAddresses.length > 0) {
        poolIds = poolAddresses;
      } else if (hasStaticPoolMapping(stakingToken)) {
        poolIds = getStaticPoolMapping(stakingToken);
      } else if (this.gqlClient.hasApiKey()) {
        const pools = await this.getStakingPoolsForToken(stakingToken);
        poolIds = pools.map((pool) => pool.id);
      } else {
        throw new CanopyError(
          "No staking pools found for token. Options: 1) Provide poolAddresses parameter, 2) Ensure staking token is in static mapping, 3) Provide sentioApiKey for dynamic lookup",
          CanopyErrorCode.STAKING_POOLS_NOT_FOUND,
          { stakingToken, hasStaticMapping: hasStaticPoolMapping(stakingToken) }
        );
      }

      if (poolIds.length === 0) {
        throw new CanopyError(
          "No staking pools available for token after checking all sources",
          CanopyErrorCode.STAKING_POOLS_NOT_FOUND,
          { stakingToken }
        );
      }

      // If userAddress provided, check subscriptions and filter to unsubscribed pools
      let poolsToSubscribe = poolIds;
      if (userAddress) {
        poolsToSubscribe = await this.getUnsubscribedPools(
          userAddress,
          poolIds
        );
      }

      // Choose appropriate transaction based on whether there are pools to subscribe to
      if (poolsToSubscribe.length > 0) {
        return {
          typeArguments: [],
          functionArguments: [
            stakingToken,
            amount.toString(),
            poolsToSubscribe,
          ],
          function: `${MULTI_REWARDS_ROUTER_ABI.address}::router::stake_and_subscribe_fa`,
        };
      } else {
        return {
          typeArguments: [],
          functionArguments: [stakingToken, amount.toString()],
          function: `${MULTI_REWARDS_ABI.address}::multi_rewards::stake`,
        };
      }
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }
      throw new CanopyError(
        "Failed to create staking transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { stakingToken, amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Get staking pools for a specific token (internal use only)
   * @private
   */
  private async getStakingPoolsForToken(
    stakingToken: string
  ): Promise<MRStakingPool[]> {
    try {
      return await this.gqlClient.fetchStakingPoolsByToken(stakingToken);
    } catch (error) {
      console.debug(
        "Failed to fetch staking pools, continuing without pool data:",
        error
      );
      return [];
    }
  }

  /**
   * Get unsubscribed pools for a user (internal use only)
   * @private
   */
  private async getUnsubscribedPools(
    userAddress: string,
    poolIds: string[]
  ): Promise<string[]> {
    if (!poolIds || poolIds.length === 0) {
      return [];
    }

    try {
      const subscriptionChecks = await Promise.all(
        poolIds.map(async (poolId) => {
          try {
            const isSubscribed = await this.isUserSubscribed(
              userAddress,
              poolId
            );
            return { poolId, isSubscribed };
          } catch (error) {
            console.debug(
              `Failed to check subscription for pool ${poolId}:`,
              error
            );
            return { poolId, isSubscribed: false };
          }
        })
      );

      return subscriptionChecks
        .filter(({ isSubscribed }) => !isSubscribed)
        .map(({ poolId }) => poolId);
    } catch (error) {
      console.debug("Failed to check pool subscriptions:", error);
      return poolIds; // Return all pools if check fails
    }
  }
}
