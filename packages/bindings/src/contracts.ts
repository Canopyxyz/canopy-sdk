import type { ChainName, ContractId } from "@canopyhub/canopy-sdk-deployments";
import { getAbisForChain } from "./index";
import type { CanopyAbiSet, FrameworkAbiId, FrameworkAbiSet, MeridianAbiSet, MoveModuleAbi } from "./types";

type AbiLookupKey = keyof (FrameworkAbiSet & CanopyAbiSet & MeridianAbiSet);

function resolveAbiKey(contractId: ContractId): AbiLookupKey {
  switch (contractId) {
    case "canopy.core":
    case "canopy.vault":
      return "canopyVault";
    case "canopy.router":
      return "canopyRouter";
    case "canopy.satay":
      return "canopySatay";
    case "canopy.protocol":
      return "canopyProtocol";
    case "canopy.baseStrategy":
      return "canopyBaseStrategy";
    case "canopy.strategy.echelonSimple":
      return "canopyStrategyEchelonSimple";
    case "canopy.strategy.layerbankSimple":
      return "canopyStrategyLayerbankSimple";
    case "canopy.strategy.movepositionSimple":
      return "canopyStrategyMovepositionSimple";
    case "canopy.strategy.placeholderSimple":
      return "canopyStrategyPlaceholderSimple";
    case "canopy.strategy.meridianRewards":
      return "canopyStrategyMeridianRewards";
    case "rewards.module":
      return "multiRewards";
    case "rewards.router":
      return "multiRewardsRouter";
    case "rewards.batcher":
      return "multiRewardsBatcherEntry";
    case "meridian.router":
      return "meridianRouter";
    case "meridian.vault":
      return "meridianVault";
    case "meridian.registry":
      return "meridianRegistry";
    case "meridian.strategy.regularV4":
      return "meridianRegularV4";
    case "meridian.strategy.regularV4Entry":
      return "meridianRegularV4Entry";
    case "meridian.strategy.medianStableV2":
      return "meridianMedianStableV2";
    case "meridian.strategy.medianStableV2Entry":
      return "meridianMedianStableV2Entry";
    default:
      return assertUnreachable(contractId);
  }
}

export function getAbi(
  chain: ChainName,
  contractId: ContractId
): MoveModuleAbi | undefined {
  const abis = getAbisForChain(chain) as Partial<Record<AbiLookupKey, MoveModuleAbi>>;
  return abis[resolveAbiKey(contractId)];
}

export function requireAbi(
  chain: ChainName,
  contractId: ContractId
): MoveModuleAbi {
  const abi = getAbi(chain, contractId);
  if (abi === undefined) {
    throw new Error(
      `ABI for contract "${contractId}" is not available on supported chain "${chain}"`
    );
  }
  return abi;
}

export function getFrameworkAbi(
  chain: ChainName,
  abiId: FrameworkAbiId
): MoveModuleAbi {
  return getAbisForChain(chain)[abiId];
}

export const requireFrameworkAbi = getFrameworkAbi;

function assertUnreachable(value: never): never {
  throw new Error(`Unhandled contract id: ${String(value)}`);
}
