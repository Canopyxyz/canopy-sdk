import { Aptos, Hex, Network } from "@aptos-labs/ts-sdk";
import type { AllocationMap } from "./strategy-allocator";
import type {
  PortfolioData,
  PortfolioState,
  PacketResponse,
  CreatePacketRequest,
  MovePositionConfig,
} from "./moveposition-types";
import { CanopyError, CanopyErrorCode } from "../types";
import {
  type NetworkType,
  MOVEPOSITION_SIMPLE_CONCRETE_ADDRESS,
  NETWORK_TYPES,
  NETWORK_API_NAMES,
  MOVEPOSITION_API_ENDPOINTS,
  MOVEPOSITION_OPERATIONS,
} from "../constants";

export interface PacketData {
  strategy: string;
  packet: Uint8Array;
}

export interface PacketGeneratorOptions {
  vaultAddress: string;
  network?: NetworkType;
  routerAddress?: string;
  virtualCoinType: string;
  movepositionConfig?: MovePositionConfig;
}

export class PacketGenerator {
  constructor(
    private aptos: Aptos,
    private network: NetworkType = NETWORK_TYPES.MOVEMENT_MAINNET
  ) {}

  async generatePackets(
    strategies: string[],
    amounts: bigint[],
    operation: "deposit" | "withdraw",
    options: PacketGeneratorOptions
  ): Promise<PacketData[]> {
    if (strategies.length !== amounts.length) {
      throw new CanopyError(
        "Strategies and amounts arrays must have the same length",
        CanopyErrorCode.PACKET_GENERATION_FAILED
      );
    }

    const packets: PacketData[] = [];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      const amount = amounts[i];

      if (!strategy || amount === undefined) {
        continue;
      }

      if (amount === 0n) {
        packets.push({ strategy, packet: new Uint8Array(0) });
        continue;
      }

      try {
        const packet = await this.generateSinglePacket(
          strategy,
          amount,
          operation,
          options
        );
        packets.push({ strategy, packet });
      } catch (error) {
        console.error(
          `Failed to generate packet for strategy ${strategy}:`,
          error
        );

        packets.push({ strategy, packet: new Uint8Array(0) });
      }
    }

    return packets;
  }

  private async generateSinglePacket(
    strategyAddress: string,
    amount: bigint,
    operation: "deposit" | "withdraw",
    options: PacketGeneratorOptions
  ): Promise<Uint8Array> {
    const { virtualCoinType, movepositionConfig } = options;

    if (!movepositionConfig?.apiUrl) {
      console.log(
        "MovePosition API URL not configured, returning empty packet"
      );
      return new Uint8Array(0);
    }

    const brokerName = movepositionConfig.nameMap[virtualCoinType];
    if (!brokerName) {
      console.log(
        `Broker name not found for token ${virtualCoinType}, returning empty packet`
      );
      return new Uint8Array(0);
    }

    let exactAmount = amount;
    if (operation == "withdraw") {
      exactAmount = await this.getExactAmount(
        strategyAddress,
        amount,
        virtualCoinType!
      );
    }

    if (exactAmount === 0n) {
      console.log(
        `Exact amount is 0 for strategy ${strategyAddress}, returning empty packet`
      );
      return new Uint8Array(0);
    }

    return await this.computePacketData({
      address: strategyAddress,
      brokerName,
      amount: exactAmount.toString(),
      operation:
        operation === "deposit"
          ? MOVEPOSITION_OPERATIONS.LEND
          : MOVEPOSITION_OPERATIONS.REDEEM,
      movepositionApiUrl: movepositionConfig.apiUrl,
      network: this.getNetworkApiName(),
    });
  }

  private async getExactAmount(
    strategyAddress: string,
    amount: bigint,
    pairedCoinType: string
  ): Promise<bigint> {
    try {
      try {
        const [exactAmount] = await this.aptos.view({
          payload: {
            function: `${MOVEPOSITION_SIMPLE_CONCRETE_ADDRESS}::strategy::withdrawal_amount_view`,
            functionArguments: [strategyAddress, String(amount)],
            typeArguments: [pairedCoinType],
          },
        });

        if (Number(exactAmount)) {
          return BigInt(String(exactAmount));
        }
        return 0n;
      } catch (error) {
        console.warn(
          "Failed to get exact withdrawal amount from strategy:",
          error
        );

        // Fall back to the value from withdrawal map
        return 0n;
      }
    } catch (error) {
      console.error("Failed to get exact amount for packet:", error);
    }

    return 0n;
  }

  private async computePacketData(params: {
    address: string;
    brokerName: string;
    amount: string;
    operation: string;
    movepositionApiUrl: string;
    network: string;
  }): Promise<Uint8Array> {
    try {
      const portfolioState = await this.computePortfolioState(
        params.address,
        params.movepositionApiUrl
      );

      const requestData: CreatePacketRequest = {
        amount: params.amount,
        network: "aptos",
        signerPubkey: params.address,
        currentPortfolioState: portfolioState,
        brokerName: params.brokerName,
      };

      const packetResponse = await this.createPacket(
        params.operation,
        requestData,
        params.movepositionApiUrl
      );

      return Hex.fromHexString(packetResponse.packet).toUint8Array();
    } catch (error) {
      throw new CanopyError(
        "Failed to compute packet data",
        CanopyErrorCode.PACKET_GENERATION_FAILED,
        { params, originalError: error }
      );
    }
  }

  private async computePortfolioState(
    address: string,
    movepositionApiUrl: string
  ): Promise<PortfolioState> {
    try {
      const portfolio = await this.getPortfolioData(
        address,
        movepositionApiUrl
      );

      const collaterals = portfolio.collaterals.map((c) => ({
        instrumentId: c.instrument.name,
        amount: c.amount,
      }));

      const liabilities = portfolio.liabilities.map((l) => ({
        instrumentId: l.instrument.name,
        amount: l.amount,
      }));

      return { collaterals, liabilities };
    } catch (error) {
      throw new CanopyError(
        "Failed to get portfolio state",
        CanopyErrorCode.PACKET_GENERATION_FAILED,
        { address, originalError: error }
      );
    }
  }

  private async getPortfolioData(
    address: string,
    movepositionApiUrl: string
  ): Promise<PortfolioData> {
    const url = `${movepositionApiUrl}${MOVEPOSITION_API_ENDPOINTS.PORTFOLIOS}${address}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch portfolio data: ${errorText}`);
    }

    return (await response.json()) as PortfolioData;
  }

  private async createPacket(
    operation: string,
    data: CreatePacketRequest,
    movepositionApiUrl: string
  ): Promise<PacketResponse> {
    const endpoint =
      operation === MOVEPOSITION_OPERATIONS.LEND
        ? MOVEPOSITION_API_ENDPOINTS.BROKERS_LEND
        : MOVEPOSITION_API_ENDPOINTS.BROKERS_REDEEM;
    const url = `${movepositionApiUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create packet: ${errorText}`);
    }

    return (await response.json()) as PacketResponse;
  }

  private getNetworkName(): string {
    switch (this.network) {
      case NETWORK_TYPES.MOVEMENT_MAINNET:
        return "movement-mainnet";

      default:
        return "aptos";
    }
  }

  private getNetworkApiName(): string {
    return this.network === NETWORK_TYPES.MOVEMENT_MAINNET
      ? NETWORK_API_NAMES[NETWORK_TYPES.MOVEMENT_MAINNET]
      : NETWORK_API_NAMES.DEFAULT;
  }

  createPacketArrays(
    packets: PacketData[],
    allocation?: AllocationMap | AllocationMap
  ): {
    packetStrategies: string[];
    packetData: Uint8Array[];
  } {
    if (!packets || packets.length === 0) {
      return {
        packetStrategies: [],
        packetData: [],
      };
    }

    const packetStrategies: string[] = [];
    const packetData: Uint8Array[] = [];

    if (allocation) {
      for (const strategy of allocation.strategies) {
        const packet = packets.find((p) => p.strategy === strategy);
        if (packet && packet.packet.length > 0) {
          packetStrategies.push(strategy);
          packetData.push(packet.packet);
        }
      }
    } else {
      for (const packet of packets) {
        if (packet.packet.length > 0) {
          packetStrategies.push(packet.strategy);
          packetData.push(packet.packet);
        }
      }
    }

    return {
      packetStrategies,
      packetData,
    };
  }
}
