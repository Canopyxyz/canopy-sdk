import { Aptos, type InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import { TransactionBuilder } from "./internal/transaction-builder";
import { VaultDetector } from "./internal/vault-detector";
import { MultiRewardsClient } from "./internal/multi-rewards-client";
import { CanopyError, CanopyErrorCode, type VaultPosition } from "./types";
import { ERROR_MESSAGES, NETWORK_TYPES, type NetworkType } from "./constants";
import type { UserStakingPosition } from "./internal/multi-rewards-types";

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
    this.validateInputs(vaultAddress, amount, "deposit");

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
    this.validateInputs(vaultAddress, shares, "withdraw");

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
  async getVault(vaultAddress: string) {
    if (!vaultAddress || typeof vaultAddress !== "string") {
      throw new CanopyError(
        ERROR_MESSAGES.VAULT_ADDRESS_REQUIRED,
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { vaultAddress }
      );
    }

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
    if (!userAddress || typeof userAddress !== "string") {
      throw new CanopyError(
        "User address is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS, // Incorrect error code
        { userAddress }
      );
    }

    if (!vaultAddress || typeof vaultAddress !== "string") {
      throw new CanopyError(
        ERROR_MESSAGES.VAULT_ADDRESS_REQUIRED,
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { vaultAddress }
      );
    }

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
    this.validateInputs(stakingToken, amount, "stake");

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
    this.validateInputs(tokenAddress, amount, "unstake");

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
    if (!stakingTokens || stakingTokens.length === 0) {
      throw new CanopyError(
        "At least one staking token is required",
        CanopyErrorCode.INVALID_VAULT_ADDRESS, // Incorrect error code
        { stakingTokens }
      );
    }
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
    if (!userAddress || typeof userAddress !== "string") {
      throw new CanopyError(
        "User address is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS, // Incorrect error code
        { userAddress }
      );
    }
    if (!stakingToken || typeof stakingToken !== "string") {
      throw new CanopyError(
        "Staking token is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS, // Incorrect error code
        { stakingToken }
      );
    }
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
    if (!userAddress || typeof userAddress !== "string") {
      throw new CanopyError(
        "User address is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { userAddress }
      );
    }
    if (!stakingToken || typeof stakingToken !== "string") {
      throw new CanopyError(
        "Staking token is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { stakingToken }
      );
    }
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
    if (!userAddress || typeof userAddress !== "string") {
      throw new CanopyError(
        "User address is required and must be a string",
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { userAddress }
      );
    }
    return await this.multiRewardsClient.getUserEarned(
      userAddress,
      pool,
      rewardToken
    );
  }

  private validateInputs(
    vaultAddress: string,
    amount: bigint,
    operation: string
  ): void {
    if (!vaultAddress || typeof vaultAddress !== "string") {
      throw new CanopyError(
        ERROR_MESSAGES.VAULT_ADDRESS_REQUIRED,
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { vaultAddress }
      );
    }

    if (!vaultAddress.startsWith("0x")) {
      throw new CanopyError(
        ERROR_MESSAGES.VAULT_ADDRESS_FORMAT,
        CanopyErrorCode.INVALID_VAULT_ADDRESS,
        { vaultAddress }
      );
    }

    if (typeof amount !== "bigint") {
      throw new CanopyError(
        `${operation} ${ERROR_MESSAGES.AMOUNT_MUST_BE_BIGINT}`,
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount }
      );
    }

    if (amount <= 0n) {
      throw new CanopyError(
        `${operation} ${ERROR_MESSAGES.AMOUNT_TOO_SMALL}`,
        CanopyErrorCode.AMOUNT_TOO_SMALL,
        { amount: amount.toString() }
      );
    }
  }
}
