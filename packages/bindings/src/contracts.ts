import type { ChainName, ContractId } from "@canopyhub/canopy-sdk-deployments";
import { getAbisForChain } from "./index";
import type { FrameworkAbiId, MoveModuleAbi } from "./types";

function resolveAbi(
  abis: Record<string, MoveModuleAbi | undefined>,
  contractId: ContractId
): MoveModuleAbi | undefined {
  switch (contractId) {
    case "canopy.core":
    case "canopy.vault":
      return abis["canopyVault"];
    case "canopy.router":
      return abis["canopyRouter"];
    case "canopy.satay":
      return abis["canopySatay"];
    case "canopy.protocol":
      return abis["canopyProtocol"];
    case "canopy.baseStrategy":
      return abis["canopyBaseStrategy"];
    case "canopy.strategy.echelonSimple":
      return abis["canopyStrategyEchelonSimple"];
    case "canopy.strategy.layerbankSimple":
      return abis["canopyStrategyLayerbankSimple"];
    case "canopy.strategy.movepositionSimple":
      return abis["canopyStrategyMovepositionSimple"];
    case "canopy.strategy.placeholderSimple":
      return abis["canopyStrategyPlaceholderSimple"];
    case "canopy.strategy.meridianRewards":
      return abis["canopyStrategyMeridianRewards"];
    case "rewards.module":
      return abis["multiRewards"];
    case "rewards.router":
      return abis["multiRewardsRouter"];
    case "rewards.batcher":
      return abis["multiRewardsBatcherEntry"];
    case "meridian.router":
      return abis["meridianRouter"];
    case "meridian.vault":
      return abis["meridianVault"];
    case "meridian.registry":
      return abis["meridianRegistry"];
    case "meridian.strategy.regularV4":
      return abis["meridianRegularV4"];
    case "meridian.strategy.regularV4Entry":
      return abis["meridianRegularV4Entry"];
    case "meridian.strategy.medianStableV2":
      return abis["meridianMedianStableV2"];
    case "meridian.strategy.medianStableV2Entry":
      return abis["meridianMedianStableV2Entry"];
  }
  return undefined;
}

export function getAbi(
  chain: ChainName,
  contractId: ContractId
): MoveModuleAbi | undefined {
  const abis = getAbisForChain(chain) as unknown as Record<string, MoveModuleAbi | undefined>;
  return resolveAbi(abis, contractId);
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

export function requireFrameworkAbi(
  chain: ChainName,
  abiId: FrameworkAbiId
): MoveModuleAbi {
  return getFrameworkAbi(chain, abiId);
}
