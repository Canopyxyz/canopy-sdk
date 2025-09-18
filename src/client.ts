import { Aptos, type InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import { TransactionBuilder } from "./internal/transaction-builder";
import { VaultDetector } from "./internal/vault-detector";
import { MultiRewardsClient } from "./internal/multi-rewards-client";
import {
  CanopyError,
  CanopyErrorCode,
  type VaultPosition,
  type VaultData,
} from "./types";
import { ERROR_MESSAGES, NETWORK_TYPES, type NetworkType } from "./constants";
import type { UserStakingPosition } from "./internal/multi-rewards-types";
import {
  validateAddress,
  validateAmount,
  validateVaultInputs,
  validateAddressArray,
} from "./utils/validation";

export interface CanopyClientOptions {
  network?: NetworkType;
  sentioApiKey?: string;
}

export class CanopyClient {
  private transactionBuilder: TransactionBuilder;
  private vaultDetector: VaultDetector;
  private multiRewardsClient: MultiRewardsClient;
  private network: NetworkType;

  constructor(private aptos: Aptos, options?: CanopyClientOptions) {
    if (!aptos) {
      throw new CanopyError(
        ERROR_MESSAGES.APTOS_CLIENT_REQUIRED,
        CanopyErrorCode.NETWORK_ERROR
      );
    }

    this.network = options?.network || NETWORK_TYPES.MOVEMENT_MAINNET;

    this.transactionBuilder = new TransactionBuilder(aptos, {
      network: this.network,
    });
    this.vaultDetector = new VaultDetector(aptos);
    this.multiRewardsClient = new MultiRewardsClient(
      aptos,
      options?.sentioApiKey ? { sentioApiKey: options.sentioApiKey } : undefined
    );
  }

  async deposit(
    vaultAddress: string,
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    validateVaultInputs(vaultAddress, amount, "deposit");

    try {
      return this.transactionBuilder.buildDepositPayload(vaultAddress, amount);
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }

      throw new CanopyError(
        ERROR_MESSAGES.DEPOSIT_FAILED,
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { vaultAddress, amount: amount.toString(), originalError: error }
      );
    }
  }

  async withdraw(
    vaultAddress: string,
    shares: bigint
  ): Promise<InputEntryFunctionData> {
    validateVaultInputs(vaultAddress, shares, "withdraw");

    try {
      return this.transactionBuilder.buildWithdrawPayload(vaultAddress, shares);
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }

      throw new CanopyError(
        ERROR_MESSAGES.WITHDRAWAL_FAILED,
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { vaultAddress, shares: shares.toString(), originalError: error }
      );
    }
  }

  /**
   * Get complete vault data with both off-chain metadata and on-chain state
   * @param vaultAddress The vault address to fetch
   * @returns Enriched vault data or null if not found
   */
  async getVault(vaultAddress: string): Promise<VaultData | null> {
    validateAddress(vaultAddress, "vault");
    return await this.vaultDetector.getVaultData(vaultAddress);
  }

  /**
   * Get all vaults with complete data
   * @returns Array of vaults with complete data
   */
  async getVaults() {
    return await this.vaultDetector.getAllVaults();
  }

  /**
   * Get user's position in a specific vault
   * @param userAddress User's address
   * @param vaultAddress Vault address to check position for
   * @returns User's vault position with shares balance and asset value
   */
  async getUserVaultPosition(
    userAddress: string,
    vaultAddress: string
  ): Promise<VaultPosition> {
    validateAddress(userAddress, "user");
    validateAddress(vaultAddress, "vault");
    return await this.vaultDetector.getUserVaultPosition(
      userAddress,
      vaultAddress
    );
  }

  // Multi-Rewards Staking Methods

  /**
   * Stake tokens into reward pools
   * @param stakingToken The staking token address (0x... format)
   * @param amount Amount to stake
   * @param userAddress User address to check existing subscriptions (optional)
   * @param poolAddresses Optional pool addresses to use directly (fallback layer 1)
   */
  async stake(
    stakingToken: string,
    amount: bigint,
    userAddress?: string,
    poolAddresses?: string[]
  ): Promise<InputEntryFunctionData> {
    validateAddress(stakingToken, "token");
    validateAmount(amount, "stake");
    
    if (userAddress !== undefined) {
      validateAddress(userAddress, "user");
    }
    
    if (poolAddresses !== undefined) {
      validateAddressArray(poolAddresses, "pool");
    }

    return await this.multiRewardsClient.stakeVaultShares(
      stakingToken,
      amount,
      userAddress,
      poolAddresses
    );
  }

  /**
   * Unstake tokens (automatically handles FA or coin types)
   * @param tokenAddress The token address to unstake (0x... format)
   * @param amount Amount to unstake
   */
  async unstake(
    tokenAddress: string,
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    validateAddress(tokenAddress, "token");
    validateAmount(amount, "unstake");

    // Determine if it's a coin type or FA based on format
    if (tokenAddress.includes("::")) {
      // It's a coin type
      return await this.multiRewardsClient.withdraw(tokenAddress, amount);
    } else {
      // It's a fungible asset
      return await this.multiRewardsClient.withdrawFa(tokenAddress, amount);
    }
  }

  /**
   * Claim rewards for multiple staking tokens
   */
  async claimRewards(stakingTokens: string[]): Promise<InputEntryFunctionData> {
    validateAddressArray(stakingTokens, "token");
    return await this.multiRewardsClient.claimRewards(stakingTokens);
  }

  // Multi-Rewards View Methods

  /**
   * Get user's staking position for a token
   */
  async getUserStakingPosition(
    userAddress: string,
    stakingToken: string
  ): Promise<UserStakingPosition> {
    validateAddress(userAddress, "user");
    validateAddress(stakingToken, "token");
    return await this.multiRewardsClient.getUserStakingPosition(
      userAddress,
      stakingToken
    );
  }

  /**
   * Get user's staked balance for a staking token
   */
  async getUserStakedBalance(
    userAddress: string,
    stakingToken: string
  ): Promise<string> {
    validateAddress(userAddress, "user");
    validateAddress(stakingToken, "token");
    return await this.multiRewardsClient.getUserStakedBalance(
      userAddress,
      stakingToken
    );
  }

  /**
   * Get user's earned rewards for a specific pool and reward token
   */
  async getUserEarned(
    userAddress: string,
    pool: string,
    rewardToken: string
  ): Promise<string> {
    validateAddress(userAddress, "user");
    validateAddress(pool, "pool");
    validateAddress(rewardToken, "token");
    return await this.multiRewardsClient.getUserEarned(
      userAddress,
      pool,
      rewardToken
    );
  }

}
