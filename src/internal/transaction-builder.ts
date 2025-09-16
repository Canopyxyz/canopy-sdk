import { Aptos, type InputEntryFunctionData } from "@aptos-labs/ts-sdk";
import ROUTER_ABI from "../abis/mainnet/satay_router.json";
import { VaultDetector } from "./vault-detector";
import { StrategyAllocator, type AllocationMap } from "./strategy-allocator";
import {
  PacketGenerator,
  type PacketData,
  type PacketGeneratorOptions,
} from "./packet-generator";
import { CanopyError, CanopyErrorCode, type VaultView } from "../types";
import {
  DEFAULT_MAX_LOSS,
  DEFAULT_MIN_SHARES_OUT,
  ECHELON_SIMPLE_CONCRETE_ADDRESS,
  EMPTY_STRATEGIES,
  EMPTY_PACKETS,
  LAYERBANK_SIMPLE_CONCRETE_ADDRESS,
  MERIDIAN_SIMPLE_CONCRETE_ADDRESS,
  MOVEPOSITION_SIMPLE_CONCRETE_ADDRESS,
  NETWORK_TYPES,
  WITHDRAW_MIN_AMOUNT_OUT,
  WITHDRAW_MIN_AMOUNT_OUT_MOVEPOSITION,
  type NetworkType,
} from "../constants";
import { getNetworkConfig } from "./networks";
import type { MovePositionConfig } from "./moveposition-types";

/**
 * Builds transaction payloads
 * Automatically handles vault type detection, strategy allocation, packet generation
 */
export class TransactionBuilder {
  private vaultDetector: VaultDetector;
  private strategyAllocator: StrategyAllocator;
  private packetGenerator: PacketGenerator;
  private network: NetworkType;
  private movepositionConfig?: MovePositionConfig;

  constructor(
    private aptos: Aptos,
    options?: {
      network?: NetworkType;
      movepositionConfig?: MovePositionConfig;
    }
  ) {
    this.network = options?.network || NETWORK_TYPES.MOVEMENT_MAINNET;
    if (options?.movepositionConfig) {
      this.movepositionConfig = options.movepositionConfig;
    }
    this.vaultDetector = new VaultDetector(aptos);
    this.strategyAllocator = new StrategyAllocator(aptos);
    this.packetGenerator = new PacketGenerator(aptos, this.network);
  }

  /**
   * Builds deposit payload with zero configuration required from integrator
   */
  async buildDepositPayload(
    vaultAddress: string,
    amount: bigint
  ): Promise<InputEntryFunctionData> {
    try {
      const vault = await this.vaultDetector.getVaultDetails(vaultAddress);
      const allocation = await this.strategyAllocator.getOptimalAllocation(
        vaultAddress,
        amount
      );

      this.strategyAllocator.validateAllocation(allocation, amount);

      const packets = await this.generatePacketsIfNeeded(
        vault,
        allocation.strategies,
        allocation.amounts,
        "deposit",
        vaultAddress
      );

      return this.createDepositPayload(
        vault,
        vaultAddress,
        allocation,
        packets,
        amount
      );
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }

      throw new CanopyError(
        "Failed to build deposit transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { vaultAddress, amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Builds withdrawal payload with zero configuration required from integrator
   */
  async buildWithdrawPayload(
    vaultAddress: string,
    shares: bigint
  ): Promise<InputEntryFunctionData> {
    try {
      const vault = await this.vaultDetector.getVaultDetails(vaultAddress);
      const allocationMap = await this.strategyAllocator.getAllocationMap(
        vaultAddress,
        shares
      );

      const packets = await this.generatePacketsIfNeeded(
        vault,
        allocationMap.strategies,
        allocationMap.amounts,
        "withdraw",
        vaultAddress
      );

      return this.createWithdrawPayload(
        vault,
        vaultAddress,
        allocationMap,
        packets,
        shares
      );
    } catch (error) {
      if (error instanceof CanopyError) {
        throw error;
      }

      throw new CanopyError(
        "Failed to build withdraw transaction",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { vaultAddress, shares: shares.toString(), originalError: error }
      );
    }
  }

  /**
   * Generates packets for MovePosition vaults if needed
   */
  private async generatePacketsIfNeeded(
    vault: VaultView,
    strategies: string[],
    amounts: bigint[],
    operation: "deposit" | "withdraw",
    vaultAddress: string
  ): Promise<PacketData[]> {
    if (!this.isMovePosition(vault)) {
      return [];
    }

    const moveConfig = this.getMovePositionConfig();
    const virtualCoinType =
      moveConfig?.virtualCoinMap[this.normalizeAddress(vault.assetAddress)] ??
      "";

    const packetOptions: PacketGeneratorOptions = {
      vaultAddress,
      virtualCoinType,
      network: this.network,
      routerAddress: ROUTER_ABI.address,
    };

    if (moveConfig) {
      packetOptions.movepositionConfig = moveConfig;
    }

    return await this.packetGenerator.generatePackets(
      strategies,
      amounts,
      operation,
      packetOptions
    );
  }

  /**
   * Creates deposit payload based on vault type
   */
  private createDepositPayload(
    vault: VaultView,
    vaultAddress: string,
    allocation: AllocationMap,
    packets: PacketData[],
    amount: bigint
  ): InputEntryFunctionData {
    if (this.isEchelon(vault)) {
      const coinTypeName = this.normalizeTypeName(vault.pairedCoinType ?? "");
      return {
        function: `${ROUTER_ABI.address}::router::deposit_coin`,
        typeArguments: [coinTypeName, coinTypeName],
        functionArguments: [
          vaultAddress,
          EMPTY_STRATEGIES,
          EMPTY_PACKETS,
          amount.toString(),
          DEFAULT_MIN_SHARES_OUT,
        ],
      };
    } else {
      // const moveConfig = this.getMovePositionConfig();
      // const coinTypeName = this.isMovePosition(vault)
      //   ? moveConfig?.virtualCoinMap[this.normalizeAddress(vault.assetAddress)]
      //   : this.normalizeTypeName(vault.pairedCoinType ?? "");
      const coinTypeName = this.normalizeTypeName(
        vault.pairedCoinType ?? "0x1::aptos_coin::AptosCoin"
      );

      const { packetStrategies, packetData } =
        this.packetGenerator.createPacketArrays(packets, allocation);

      return {
        function: `${ROUTER_ABI.address}::router::deposit_fa_with_coin_type`,
        typeArguments: [coinTypeName!],
        functionArguments: [
          vaultAddress,
          packetStrategies,
          packetData,
          amount.toString(),
          DEFAULT_MIN_SHARES_OUT,
        ],
      };
    }
  }

  /**
   * Creates withdrawal payload based on vault type
   */
  private createWithdrawPayload(
    vault: VaultView,
    vaultAddress: string,
    allocationMap: AllocationMap,
    packets: PacketData[],
    shares: bigint,
    maxLoss: string = DEFAULT_MAX_LOSS
  ): InputEntryFunctionData {
    if (this.isEchelon(vault)) {
      const coinTypeName = this.normalizeTypeName(vault.pairedCoinType ?? "");
      return {
        function: `${ROUTER_ABI.address}::router::withdraw_coin`,
        typeArguments: [coinTypeName, coinTypeName],
        functionArguments: [
          vaultAddress,
          EMPTY_STRATEGIES,
          EMPTY_PACKETS,
          shares.toString(),
          maxLoss,
          WITHDRAW_MIN_AMOUNT_OUT,
        ],
      };
    } else {
      // const moveConfig = this.getMovePositionConfig();
      // const coinTypeName = this.isMovePosition(vault)
      //   ? moveConfig?.virtualCoinMap[this.normalizeAddress(vault.assetAddress)]
      //   : this.normalizeTypeName(vault.pairedCoinType ?? "");
      const coinTypeName = this.normalizeTypeName(
        vault.pairedCoinType ?? "0x1::aptos_coin::AptosCoin"
      );

      const { packetStrategies, packetData } =
        this.packetGenerator.createPacketArrays(packets, allocationMap);

      return {
        function: `${ROUTER_ABI.address}::router::withdraw_fa_with_coin_type`,
        typeArguments: [coinTypeName!],
        functionArguments: [
          vaultAddress,
          packetStrategies,
          packetData,
          shares.toString(),
          maxLoss,
          WITHDRAW_MIN_AMOUNT_OUT_MOVEPOSITION,
        ],
      };
    }
  }

  /**
   * Creates a simple deposit payload without auto-detection
   * Used when caller already knows the vault configuration
   */
  async createSimpleDepositPayload(
    vaultAddress: string,
    amount: bigint,
    strategies: string[] = [],
    packets: Uint8Array[] = []
  ): Promise<InputEntryFunctionData> {
    const minSharesOut = (amount * 99n) / 100n;

    return {
      function: `${ROUTER_ABI.address}::router::deposit_fa`,
      typeArguments: [],
      functionArguments: [
        vaultAddress,
        strategies,
        packets,
        amount.toString(),
        minSharesOut.toString(),
      ],
    };
  }

  /**
   * Creates a simple withdrawal payload without auto-detection
   * Used when caller already knows the vault configuration
   */
  async createSimpleWithdrawalPayload(
    vaultAddress: string,
    shares: bigint,
    strategies: string[] = [],
    packets: Uint8Array[] = [],
    maxLoss: string = DEFAULT_MAX_LOSS
  ): Promise<InputEntryFunctionData> {
    return {
      function: `${ROUTER_ABI.address}::router::withdraw_fa`,
      typeArguments: [],
      functionArguments: [
        vaultAddress,
        strategies,
        packets,
        shares.toString(),
        WITHDRAW_MIN_AMOUNT_OUT,
        maxLoss,
      ],
    };
  }

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

  normalizeAddress(value: string): string {
    if (value.startsWith("0x")) {
      value = value.slice(2);
    }

    const address = `${value.toLowerCase().padStart(32 * 2, "0")}`;
    return `0x${address}`;
  }

  normalizeTypeName(value: string) {
    const typeSplit = value.split("::");

    let pkg = typeSplit[0];
    if (pkg?.startsWith("@")) {
      pkg = pkg.slice(1);
    }

    const address = this.normalizeAddress(pkg!);
    return `${address}::${typeSplit[1]}::${typeSplit[2]}`;
  }

  private getMovePositionConfig(): MovePositionConfig | undefined {
    if (this.movepositionConfig) {
      return this.movepositionConfig;
    }

    const networkConfig = getNetworkConfig(this.network as NetworkType);
    if (networkConfig.movepositionApiUrl) {
      return {
        apiUrl: networkConfig.movepositionApiUrl,
        nameMap: networkConfig.movepositionNameMap || {},
        virtualCoinMap: networkConfig.movepositionVirtualCoinMap || {},
      };
    }

    return undefined;
  }
}
