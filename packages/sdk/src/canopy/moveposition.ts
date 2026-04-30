import { Hex } from "@moveindustries/ts-sdk";
import {
  CanopyError,
  CanopyErrorCode,
  callSingleViewResult,
  moveUintArgument,
  normalizeMoveAddress,
} from "../../../core";
import type { SdkContext } from "../types";
import { readMoveU64 } from "../internal/move-readers";
import type { CanopyVaultAllocation, CanopyVaultView } from "./types";

export interface MovePositionConfig {
  apiUrl: string;
  nameMap: Record<string, string>;
  virtualCoinMap: Record<string, string>;
}

export interface PacketData {
  packet: Uint8Array;
  strategy: string;
}

export interface PacketGenerationResult {
  packetData: Uint8Array[];
  packetStrategies: string[];
}

interface MovePositionRequest {
  amount: string;
  brokerName: string;
  currentPortfolioState: {
    collaterals: Array<{ amount: string; instrumentId: string }>;
    liabilities: Array<{ amount: string; instrumentId: string }>;
  };
  network: string;
  signerPubkey: string;
}

interface MovePositionResponse {
  packet: string;
}

export async function buildMovePositionPackets(
  context: SdkContext<"movement-mainnet" | "aptos-testnet">,
  vault: CanopyVaultView,
  allocation: Pick<CanopyVaultAllocation, "amounts" | "strategies">,
  operation: "deposit" | "withdraw"
): Promise<PacketGenerationResult> {
  const packetConfig = context.moveposition;
  if (!packetConfig) {
    throw new CanopyError(
      "MovePosition config is required for packet-backed vault payloads",
      CanopyErrorCode.TransactionBuildFailed,
      { chain: context.chain, vaultAddress: vault.vaultAddress }
    );
  }

  const virtualCoinType = packetConfig.virtualCoinMap[vault.assetAddress];
  if (!virtualCoinType) {
    throw new CanopyError(
      "MovePosition virtual coin mapping is missing for vault asset",
      CanopyErrorCode.TransactionBuildFailed,
      { assetAddress: vault.assetAddress, chain: context.chain }
    );
  }

  const brokerName = packetConfig.nameMap[virtualCoinType];
  if (!brokerName) {
    throw new CanopyError(
      "MovePosition broker name mapping is missing for virtual coin",
      CanopyErrorCode.TransactionBuildFailed,
      { chain: context.chain, virtualCoinType }
    );
  }

  const movePositionConcrete =
    context.deployment.canopy?.strategies.movepositionSimple &&
    normalizeMoveAddress(context.deployment.canopy.strategies.movepositionSimple);

  if (!movePositionConcrete) {
    throw new CanopyError(
      "MovePosition strategy deployment is not configured for this chain",
      CanopyErrorCode.TransactionBuildFailed,
      { chain: context.chain }
    );
  }

  const packets: PacketData[] = [];
  for (let index = 0; index < allocation.strategies.length; index += 1) {
    const strategyAddress = allocation.strategies[index];
    const amount = allocation.amounts[index];
    if (!strategyAddress || amount === undefined || amount <= 0n) {
      continue;
    }

    const strategyView = vault.strategies.find(
      (strategy) => strategy.strategyAddress === normalizeMoveAddress(strategyAddress)
    );
    if (!strategyView || strategyView.concreteAddress !== movePositionConcrete) {
      continue;
    }

    const exactAmount =
      operation === "withdraw"
        ? await getWithdrawAmount(context, strategyAddress, amount, vault)
        : amount;

    if (exactAmount <= 0n) {
      continue;
    }

    packets.push({
      strategy: normalizeMoveAddress(strategyAddress),
      packet: await createMovePositionPacket({
        apiUrl: packetConfig.apiUrl,
        amount: exactAmount.toString(),
        brokerName,
        network: context.chain === "movement-mainnet" ? "movement-mainnet" : "aptos",
        operation,
        strategyAddress: normalizeMoveAddress(strategyAddress),
      }),
    });
  }

  return {
    packetData: packets.map((packet) => packet.packet),
    packetStrategies: packets.map((packet) => packet.strategy),
  };
}

async function getWithdrawAmount(
  context: SdkContext<"movement-mainnet" | "aptos-testnet">,
  strategyAddress: string,
  amount: bigint,
  vault: CanopyVaultView
): Promise<bigint> {
  const strategyAbi = context.abis.canopyStrategyMovepositionSimple;
  if (!strategyAbi) {
    throw new CanopyError(
      "MovePosition strategy ABI is unavailable for this chain",
      CanopyErrorCode.TransactionBuildFailed,
      { chain: context.chain }
    );
  }

  const hasFaView =
    strategyAbi.exposed_functions?.some((fn) => fn.name === "withdrawal_amount_view_fa") ??
    false;
  const useFaView = !vault.pairedCoinType && hasFaView;
  const functionName = useFaView ? "withdrawal_amount_view_fa" : "withdrawal_amount_view";

  const exactAmount = await callSingleViewResult(
    context.client,
    {
      moduleAddress: strategyAbi.address,
      moduleName: strategyAbi.name,
      functionName,
      functionArguments: [normalizeMoveAddress(strategyAddress), moveUintArgument(amount)],
      ...(useFaView || !vault.pairedCoinType
        ? {}
        : { typeArguments: [vault.pairedCoinType] }),
    }
  );

  return readMoveU64(exactAmount);
}

async function createMovePositionPacket(input: {
  amount: string;
  apiUrl: string;
  brokerName: string;
  network: string;
  operation: "deposit" | "withdraw";
  strategyAddress: string;
}): Promise<Uint8Array> {
  const portfolio = await fetchJson<{
    collaterals: Array<{ amount: string; instrument: { name: string } }>;
    liabilities: Array<{ amount: string; instrument: { name: string } }>;
  }>(`${input.apiUrl}/portfolios/${input.strategyAddress}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const requestBody: MovePositionRequest = {
    amount: input.amount,
    brokerName: input.brokerName,
    currentPortfolioState: {
      collaterals: portfolio.collaterals.map((collateral) => ({
        amount: collateral.amount,
        instrumentId: collateral.instrument.name,
      })),
      liabilities: portfolio.liabilities.map((liability) => ({
        amount: liability.amount,
        instrumentId: liability.instrument.name,
      })),
    },
    network: input.network,
    signerPubkey: input.strategyAddress,
  };

  const endpoint =
    input.operation === "deposit" ? "/brokers/lend/v2" : "/brokers/redeem/v2";

  const packet = await fetchJson<MovePositionResponse>(`${input.apiUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  return Hex.fromHexString(packet.packet).toUint8Array();
}

async function fetchJson<Result>(
  url: string,
  init: RequestInit
): Promise<Result> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new CanopyError(
      "MovePosition API request failed",
      CanopyErrorCode.NetworkError,
      { url },
      { cause: error }
    );
  }

  if (!response.ok) {
    throw new CanopyError("MovePosition API request failed", CanopyErrorCode.NetworkError, {
      status: response.status,
      url,
    });
  }

  return (await response.json()) as Result;
}
