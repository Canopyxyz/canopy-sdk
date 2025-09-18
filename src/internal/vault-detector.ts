import type { Aptos } from "@aptos-labs/ts-sdk";
import VAULT_ABI from "../abis/mainnet/satay_vault.json";
import type {
  VaultView,
  VaultBaseStrategyView,
  PaginatedVaultsView,
  StrategyDetails,
} from "./abi-types";
import {
  CanopyError,
  CanopyErrorCode,
  type VaultData,
  type VaultPosition,
} from "../types";
import { GraphQLClient } from "./gql-client";
import {
  DEFAULT_CHAIN_ID,
  ERROR_MESSAGES,
  ECHELON_SIMPLE_CONCRETE_ADDRESS,
  LAYERBANK_SIMPLE_CONCRETE_ADDRESS,
  MERIDIAN_SIMPLE_CONCRETE_ADDRESS,
  MOVEPOSITION_SIMPLE_CONCRETE_ADDRESS,
} from "../constants";

/**
 * Internal vault type information
 */
export interface VaultType {
  coinType?: string;
  isPaused: boolean;
  isLooping: boolean;
  baseMetadata: string;
  strategies: string[];
  hasWrapperCoin: boolean;
  rewardCoinType?: string;
  requiresPackets: boolean;
  assetType: "coin" | "fa";
}

/**
 * Auto-detects vault configuration by querying on-chain data
 */
export class VaultDetector {
  private gqlClient: GraphQLClient;
  private chainId: number = DEFAULT_CHAIN_ID;

  constructor(
    private aptos: Aptos,
    graphqlEndpoint?: string,
    chainId?: number
  ) {
    this.gqlClient = new GraphQLClient(graphqlEndpoint);
    if (chainId !== undefined) {
      this.chainId = chainId;
    }
  }

  // async detectVaultType(vaultAddress: string): Promise<VaultType> {
  //   try {
  //     if (!this.isValidAddress(vaultAddress)) {
  //       throw new CanopyError(
  //         ERROR_MESSAGES.INVALID_VAULT_ADDRESS_FORMAT,
  //         CanopyErrorCode.INVALID_VAULT_ADDRESS,
  //         { vaultAddress }
  //       );
  //     }

  //     const isPaused = await this.checkVaultPaused(vaultAddress);
  //     if (isPaused) {
  //       throw new CanopyError(
  //         ERROR_MESSAGES.VAULT_PAUSED,
  //         CanopyErrorCode.VAULT_PAUSED,
  //         { vaultAddress }
  //       );
  //     }

  //     // Get full vault view which includes pairedCoinType
  //     const vaultView = await this.getVaultDetails(vaultAddress);

  //     const assetType = this.determineAssetType(vaultView.pairedCoinType);
  //     const coinTypes = this.determineCoinTypes(vaultView.pairedCoinType);

  //     const strategies = vaultView.strategies.map((s) => s.strategyAddress);
  //     const requiresPackets = await this.checkRequiresPackets(strategies);
  //     const hasWrapperCoin =
  //       assetType === "fa" && coinTypes.coinType !== undefined;

  //     return {
  //       isPaused,
  //       assetType,
  //       hasWrapperCoin,
  //       requiresPackets,
  //       coinType: coinTypes.coinType ?? "",
  //       baseMetadata: vaultView.assetAddress,
  //       rewardCoinType: coinTypes.rewardCoinType ?? "",
  //       strategies: vaultView.strategies.map((s) => s.strategyAddress),
  //     };
  //   } catch (error) {
  //     if (error instanceof CanopyError) {
  //       throw error;
  //     }

  //     throw new CanopyError(
  //       ERROR_MESSAGES.FAILED_TO_DETECT_VAULT,
  //       CanopyErrorCode.VAULT_NOT_FOUND,
  //       { vaultAddress, originalError: error }
  //     );
  //   }
  // }

  /**
   * Validates address format
   */
  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{1,64}$/.test(address);
  }

  /**
   * Checks if vault is paused
   */
  private async checkVaultPaused(vaultAddress: string): Promise<boolean> {
    try {
      const [isPaused] = await this.aptos.view({
        payload: {
          functionArguments: [vaultAddress],
          function: `${VAULT_ABI.address}::vault::is_paused`,
        },
      });

      return Boolean(isPaused);
    } catch {
      throw new CanopyError(
        ERROR_MESSAGES.VAULT_NOT_FOUND,
        CanopyErrorCode.VAULT_NOT_FOUND
      );
    }
  }

  /**
   * Gets base metadata address
   */
  private async getBaseMetadata(vaultAddress: string): Promise<string> {
    const [metadata] = await this.aptos.view({
      payload: {
        function: `${VAULT_ABI.address}::vault::base_metadata`,
        functionArguments: [vaultAddress],
      },
    });

    return String((metadata as any).inner);
  }

  /**
   * Gets vault strategies
   */
  private async getStrategies(vaultAddress: string): Promise<string[]> {
    const [strategies] = await this.aptos.view({
      payload: {
        function: `${VAULT_ABI.address}::vault::vault_strategies`,
        functionArguments: [vaultAddress],
      },
    });

    return Array.isArray(strategies) ? strategies.map((s) => s.inner) : [];
  }

  /**
   * Determines if vault uses coins or fungible assets based on pairedCoinType
   */
  private determineAssetType(pairedCoinType?: string): "coin" | "fa" {
    // If pairedCoinType exists, it's a coin vault
    // If pairedCoinType is undefined/null, it's a fungible asset vault
    return pairedCoinType ? "coin" : "fa";
  }

  /**
   * Determines coin types for transaction building based on pairedCoinType
   */
  private determineCoinTypes(pairedCoinType?: string): {
    coinType?: string;
    rewardCoinType?: string;
  } {
    if (!pairedCoinType) {
      return {};
    }

    // Extract coin type from pairedCoinType
    // Handle both full addresses and shortened forms
    if (
      pairedCoinType.includes(
        "@0000000000000000000000000000000000000000000000000000000000000001::aptos_coin::AptosCoin"
      )
    ) {
      return {
        coinType: "0x1::aptos_coin::AptosCoin",
        rewardCoinType: "0x1::aptos_coin::AptosCoin",
      };
    }

    // For other coin types, use the pairedCoinType directly
    return {
      coinType: pairedCoinType,
      rewardCoinType: pairedCoinType, // Assume same for simplicity
    };
  }

  /**
   * Checks if any strategies are looping strategies
   */
  private async checkLooping(strategies: string[]): Promise<boolean> {
    return strategies.some(
      (strategy) =>
        strategy.includes("looping") || strategy.includes("leverage")
    );
  }

  /**
   * Checks if any strategies require packet data (like MovePosition)
   */
  private async checkRequiresPackets(strategies: string[]): Promise<boolean> {
    return strategies.some(
      (strategy) =>
        strategy.includes("moveposition") || strategy.includes("superposition")
    );
  }

  /**
   * Get complete vault details using vault_view
   */
  async getVaultDetails(vaultAddress: string): Promise<VaultView> {
    try {
      const [vaultView] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::vault_view`,
          functionArguments: [vaultAddress],
        },
      });

      return this.parseVaultView(vaultView) as VaultView;
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_GET_VAULT_DETAILS,
        CanopyErrorCode.VAULT_NOT_FOUND,
        { vaultAddress, originalError: error }
      );
    }
  }

  /**
   * Parse raw vault view response into typed format
   */
  private parseVaultView(rawView: any): VaultView {
    return {
      decimals: Number(rawView.decimals),
      totalDebt: String(rawView.total_debt),
      totalIdle: String(rawView.total_idle),
      totalShares: String(rawView.total_shares),
      totalAsset: String(rawView.total_asset),
      assetName: String(rawView.asset_name),
      sharesName: String(rawView.shares_name),
      vaultAddress: String(rawView.vault_address),
      assetAddress: String(rawView.asset_address),
      sharesAddress: String(rawView.shares_address),
      pairedCoinType: rawView.paired_coin_type?.vec?.[0] || undefined,
      strategies: this.parseStrategies(rawView.strategies || []),
    };
  }

  /**
   * Parse raw strategies array into typed format
   */
  private parseStrategies(rawStrategies: any[]): VaultBaseStrategyView[] {
    return rawStrategies.map((strategy) => ({
      strategyAddress: String(strategy.strategy_address),
      assetAddress: String(strategy.asset_address),
      concreteAddress: String(strategy.concrete_address),
      currentVaultDebt: String(strategy.current_vault_debt),
      debtLimit: String(strategy.debt_limit),
      decimals: Number(strategy.decimals),
      lastReport: String(strategy.last_report),
      sharesAddress: String(strategy.shares_address),
      totalAsset: String(strategy.total_asset),
      totalDebt: String(strategy.total_debt),
      totalIdle: String(strategy.total_idle),
      totalLoss: String(strategy.total_loss),
      totalProfit: String(strategy.total_profit),
      totalShares: String(strategy.total_shares),
      vaultAddress: String(strategy.vault_address),
    }));
  }

  /**
   * Get list of vaults
   */
  async getVaults(
    offset: number = 0,
    limit: number = 50
  ): Promise<PaginatedVaultsView> {
    try {
      const [vaultsView] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::vaults_view`,
          functionArguments: [offset, limit],
        },
      });

      const vs = vaultsView as any;

      return {
        limit: Number(vs.limit),
        offset: Number(vs.offset),
        totalCount: Number(vs.total_count),
        vaults: Array.isArray(vs.vaults)
          ? vs.vaults.map(this.parseVaultView.bind(this))
          : [],
      };
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_GET_VAULTS_LIST,
        CanopyErrorCode.NETWORK_ERROR,
        { offset, limit, originalError: error }
      );
    }
  }

  /**
   * Get strategy details by combining multiple view calls
   */
  async getStrategyDetails(
    vaultAddress: string,
    strategyAddress: string
  ): Promise<StrategyDetails> {
    try {
      const [debt] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::strategy_debt`,
          functionArguments: [vaultAddress, strategyAddress],
        },
      });

      const [debtLimit] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::strategy_debt_limit`,
          functionArguments: [vaultAddress, strategyAddress],
        },
      });

      const [lastReport] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::strategy_last_report`,
          functionArguments: [vaultAddress, strategyAddress],
        },
      });

      const [totalProfit] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::strategy_total_profit`,
          functionArguments: [vaultAddress, strategyAddress],
        },
      });

      const [totalLoss] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::strategy_total_loss`,
          functionArguments: [vaultAddress, strategyAddress],
        },
      });

      const [sharesBalance] = await this.aptos.view({
        payload: {
          function: `${VAULT_ABI.address}::vault::get_strategy_shares_balance`,
          functionArguments: [vaultAddress, strategyAddress],
        },
      });

      return {
        address: strategyAddress,
        vault: vaultAddress,
        debt: String(debt),
        debtLimit: String(debtLimit),
        lastReport: String(lastReport),
        totalProfit: String(totalProfit),
        totalLoss: String(totalLoss),
        sharesBalance: String(sharesBalance),
      };
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_GET_STRATEGY_DETAILS,
        CanopyErrorCode.NETWORK_ERROR,
        { vaultAddress, strategyAddress, originalError: error }
      );
    }
  }

  /**
   * Set the chain ID for GraphQL queries
   */
  setChainId(chainId: number): void {
    this.chainId = chainId;
  }

  /**
   * Platform detection methods
   */
  isMovePosition(vault: VaultView): boolean {
    let concreteAddress = vault.strategies[0]?.concreteAddress;
    if (!concreteAddress) return false;

    return (
      this.normalizeAddress(concreteAddress) ==
      this.normalizeAddress(MOVEPOSITION_SIMPLE_CONCRETE_ADDRESS)
    );
  }

  isEchelon(vault: VaultView): boolean {
    let concreteAddress = vault.strategies[0]?.concreteAddress;
    if (!concreteAddress) return false;

    return (
      this.normalizeAddress(concreteAddress) ==
      this.normalizeAddress(ECHELON_SIMPLE_CONCRETE_ADDRESS)
    );
  }

  isLayerBank(vault: VaultView): boolean {
    let concreteAddress = vault.strategies[0]?.concreteAddress;
    if (!concreteAddress) return false;

    return (
      this.normalizeAddress(concreteAddress) ==
      this.normalizeAddress(LAYERBANK_SIMPLE_CONCRETE_ADDRESS)
    );
  }

  isMeridian(vault: VaultView): boolean {
    let concreteAddress = vault.strategies[0]?.concreteAddress;
    if (!concreteAddress) return false;

    return (
      this.normalizeAddress(concreteAddress) ==
      this.normalizeAddress(MERIDIAN_SIMPLE_CONCRETE_ADDRESS)
    );
  }

  /**
   * Normalize address by removing 0x prefix and padding
   */
  private normalizeAddress(value: string): string {
    if (value.startsWith("0x")) {
      value = value.slice(2);
    }
    return value.toLowerCase().padStart(64, "0");
  }

  /**
   * Extract asset name from vault data
   */
  private extractAssetName(vault: VaultView): string {
    // Use asset name if available
    if (vault.assetName) {
      return vault.assetName;
    }

    // For coin types, extract from pairedCoinType
    if (vault.pairedCoinType) {
      const parts = vault.pairedCoinType.split("::");
      if (parts.length >= 3 && parts[2]) {
        const coinName = parts[2];
        // Convert common names to readable format
        if (coinName.toLowerCase().includes("aptoscoin")) return "APT";
        if (coinName.toLowerCase().includes("usdccoin")) return "USDC";
        if (coinName.toLowerCase().includes("usdtcoin")) return "USDT";
        if (coinName.toLowerCase().includes("wethcoin")) return "WETH";
        // Return the coin name without "Coin" suffix if present
        return coinName.replace(/coin$/i, "").toUpperCase();
      }
    }

    // For FA, use shortened address
    if (vault.assetAddress && vault.assetAddress.length > 10) {
      return `FA-${vault.assetAddress.slice(-6).toUpperCase()}`;
    }

    return "Asset";
  }

  /**
   * Get platform name for a vault
   */
  getPlatformName(vault: VaultView): string {
    if (this.isMovePosition(vault)) {
      return "MovePosition";
    }

    if (this.isEchelon(vault)) {
      return "Echelon";
    }

    if (this.isLayerBank(vault)) {
      return "LayerBank";
    }

    if (this.isMeridian(vault)) {
      return "Meridian";
    }

    // Default to Satay for unknown platforms
    return "Satay";
  }

  /**
   * Generate platform-based display name when metadata is not available
   */
  generatePlatformDisplayName(vault: VaultView): string {
    const assetName = this.extractAssetName(vault);
    const platformName = this.getPlatformName(vault);
    return `${platformName} ${assetName} Vault`;
  }

  /**
   * Get enriched vault data combining GraphQL metadata and on-chain state
   */
  async getVaultData(vaultAddress: string): Promise<VaultData | null> {
    let metadata: any = null;
    let onChainData: VaultView | null = null;

    // Try to fetch metadata, but don't fail if it's not available
    try {
      metadata = await this.gqlClient.fetchVaultByAddress(
        this.chainId,
        vaultAddress
      );
    } catch (error) {
      console.debug("Could not fetch metadata for vault:", error);
    }

    // Try to fetch on-chain data
    try {
      onChainData = await this.getVaultDetails(vaultAddress);
    } catch (error) {
      console.debug("Could not fetch on-chain data for vault:", error);
    }

    // If we have neither metadata nor on-chain data, return null
    if (!metadata && !onChainData) {
      return null;
    }

    // Build vault data with whatever information we have
    const vaultData: VaultData = {
      address: metadata?.address || vaultAddress,
      chainId: this.chainId,

      // Use metadata fields if available, otherwise generate platform-based fallback
      displayName:
        metadata?.displayName ||
        (onChainData ? this.generatePlatformDisplayName(onChainData) : ""),
      description: metadata?.description || "",
      iconURL: metadata?.iconURL || "",
      labels: metadata?.labels || [],
      investmentType:
        metadata?.investmentType ||
        (onChainData ? this.getPlatformName(onChainData) : ""),
      networkType: metadata?.networkType || "",
      riskScore: metadata?.riskScore || 0,

      paused: metadata?.paused || false,

      baseAsset: metadata?.token0 || onChainData?.assetAddress || "",
      sharesAsset: metadata?.token1 || onChainData?.sharesAddress || "",
      baseAssetDecimals: metadata?.decimals0 || onChainData?.decimals || 8,
      sharesAssetDecimals: metadata?.decimals1 || onChainData?.decimals || 8,

      tvl: metadata?.tvl || "0",
      apr: metadata?.apr || 0,
      rewardApr: metadata?.rewardApr || 0,

      // Prefer on-chain data for these fields
      ...(onChainData?.totalAsset && {
        totalAssets: onChainData.totalAsset,
      }),
      ...(onChainData?.totalShares && {
        totalSupply: onChainData.totalShares,
      }),
      ...(!onChainData?.totalShares &&
        metadata?.totalSupply && { totalSupply: metadata.totalSupply }),

      // Use metadata for token balances, fallback to on-chain total values
      baseAssetBalance: metadata?.token0Balance || onChainData?.totalAsset || "0",
      sharesAssetBalance: metadata?.token1Balance || onChainData?.totalShares || "0",
      ...(onChainData?.strategies && {
        strategies: onChainData.strategies.map((s) => s.strategyAddress),
      }),

      rewardPools: metadata?.rewardPools || [],
      additionalMetadata: metadata?.additionalMetadata || {},
    };

    return vaultData;
  }

  /**
   * Get all vaults with enriched data
   */
  async getAllVaults(): Promise<VaultData[]> {
    let metadataList: any[] = [];
    let onChainVaults: PaginatedVaultsView | null = null;

    // Try to fetch metadata, but don't fail if it's not available
    try {
      metadataList = await this.gqlClient.fetchVaultMetadata(this.chainId);
    } catch (error) {
      console.debug("Could not fetch metadata for vaults:", error);
    }

    // Try to fetch on-chain vault list
    try {
      onChainVaults = await this.getVaults(0, 100); // Get first 100 vaults
    } catch (error) {
      console.debug("Could not fetch on-chain vault list:", error);
    }

    // Create a map of metadata by address for easy lookup
    const metadataMap = new Map<string, any>();
    metadataList.forEach((metadata) => {
      metadataMap.set(metadata.address.toLowerCase(), metadata);
    });

    // Build result combining both sources
    const vaultDataList: VaultData[] = [];
    const processedAddresses = new Set<string>();

    // Process on-chain vaults first (if available)
    if (onChainVaults && onChainVaults.vaults) {
      for (const vault of onChainVaults.vaults) {
        const address = vault.vaultAddress.toLowerCase();
        processedAddresses.add(address);

        const metadata = metadataMap.get(address);

        vaultDataList.push({
          address: vault.vaultAddress,
          chainId: this.chainId,

          // Use metadata if available, otherwise generate platform-based fallback
          displayName:
            metadata?.displayName || this.generatePlatformDisplayName(vault),
          description: metadata?.description || "",
          iconURL: metadata?.iconURL || "",
          labels: metadata?.labels || [],
          investmentType:
            metadata?.investmentType || this.getPlatformName(vault),
          networkType: metadata?.networkType || "",
          riskScore: metadata?.riskScore || 0,

          paused: metadata?.paused || false,

          baseAsset: metadata?.token0 || vault.assetAddress || "",
          sharesAsset: metadata?.token1 || vault.sharesAddress || "",
          baseAssetDecimals: metadata?.decimals0 || vault.decimals || 8,
          sharesAssetDecimals: metadata?.decimals1 || vault.decimals || 8,

          tvl: metadata?.tvl || "0",
          apr: metadata?.apr || 0,
          rewardApr: metadata?.rewardApr || 0,

          // Prefer on-chain data for these
          totalAssets: vault.totalAsset,
          totalSupply: vault.totalShares,

          // Use metadata for token balances, fallback to on-chain total values
          baseAssetBalance: metadata?.token0Balance || vault.totalAsset || "0",
          sharesAssetBalance: metadata?.token1Balance || vault.totalShares || "0",

          strategies: vault.strategies.map((s) => s.strategyAddress),

          rewardPools: metadata?.rewardPools || [],
          additionalMetadata: metadata?.additionalMetadata || {},
        });
      }
    }

    // Add any vaults that only exist in metadata (not on-chain yet)
    for (const metadata of metadataList) {
      const address = metadata.address.toLowerCase();
      if (!processedAddresses.has(address)) {
        vaultDataList.push({
          address: metadata.address,
          chainId: this.chainId,

          displayName: metadata.displayName,
          description: metadata.description,
          iconURL: metadata.iconURL,
          labels: metadata.labels,
          investmentType: metadata.investmentType,
          networkType: metadata.networkType,
          riskScore: metadata.riskScore,

          paused: metadata.paused,

          baseAsset: metadata.token0,
          sharesAsset: metadata.token1,
          baseAssetDecimals: metadata.decimals0,
          sharesAssetDecimals: metadata.decimals1,

          tvl: metadata.tvl,
          apr: metadata.apr,
          rewardApr: metadata.rewardApr,

          totalSupply: metadata.totalSupply,
          baseAssetBalance: metadata.token0Balance,
          sharesAssetBalance: metadata.token1Balance,

          rewardPools: metadata.rewardPools,
          additionalMetadata: metadata.additionalMetadata,
        });
      }
    }

    return vaultDataList;
  }

  /**
   * Get user's position in a specific vault
   */
  async getUserVaultPosition(
    userAddress: string,
    vaultAddress: string
  ): Promise<VaultPosition> {
    try {
      const vault = await this.getVaultDetails(vaultAddress);
      const [sharesBalance] = await this.aptos.view({
        payload: {
          typeArguments: ["0x1::fungible_asset::Metadata"],
          function: "0x1::primary_fungible_store::balance",
          functionArguments: [userAddress, vault.sharesAddress],
        },
      });

      const sharesBalanceStr = String(sharesBalance);

      let assetValue = "0";
      if (sharesBalance && BigInt(sharesBalanceStr) > 0n) {
        const [assetAmount] = await this.aptos.view({
          payload: {
            function: `${VAULT_ABI.address}::vault::shares_to_amount`,
            functionArguments: [vaultAddress, sharesBalanceStr],
          },
        });
        assetValue = String(assetAmount);
      }

      return {
        assetValue,
        userAddress,
        vaultAddress,
        sharesBalance: sharesBalanceStr,
      };
    } catch (error) {
      throw new CanopyError(
        ERROR_MESSAGES.FAILED_TO_GET_VAULT_DETAILS,
        CanopyErrorCode.VAULT_NOT_FOUND,
        { userAddress, vaultAddress, originalError: error }
      );
    }
  }
}
