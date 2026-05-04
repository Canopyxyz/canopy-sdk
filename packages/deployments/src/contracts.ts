import { DeploymentError } from "./errors";
import { getDeployment } from "./loader";
import type { ChainDeployment, ChainName, ContractId, HexString } from "./types";

function resolveAddress(
  deployment: ChainDeployment,
  contractId: ContractId
): HexString | undefined {
  switch (contractId) {
    case "canopy.core":
    case "canopy.vault":
    case "canopy.satay":
    case "canopy.protocol":
    case "canopy.baseStrategy":
      return deployment.canopy?.core;
    case "canopy.router":
      return deployment.canopy?.router;
    case "canopy.strategy.echelonSimple":
      return deployment.canopy?.strategies["echelonSimple"];
    case "canopy.strategy.layerbankSimple":
      return deployment.canopy?.strategies["layerbankSimple"];
    case "canopy.strategy.movepositionSimple":
      return deployment.canopy?.strategies["movepositionSimple"];
    case "canopy.strategy.placeholderSimple":
      return deployment.canopy?.strategies["placeholderSimple"];
    case "canopy.strategy.meridianRewards":
      return deployment.canopy?.strategies["meridianRewards"];
    case "rewards.module":
      return deployment.rewards?.module;
    case "rewards.router":
      return deployment.rewards?.router;
    case "rewards.batcher":
      return deployment.rewards?.batcher;
    case "meridian.router":
      return deployment.alm?.meridian?.standard;
    case "meridian.vault":
      return deployment.alm?.meridian?.vaults;
    case "meridian.registry":
      return deployment.alm?.meridian?.registry;
    case "meridian.strategy.regularV4":
    case "meridian.strategy.regularV4Entry":
      return deployment.alm?.meridian?.strategies["regularV4"];
    case "meridian.strategy.medianStableV2":
    case "meridian.strategy.medianStableV2Entry":
      return deployment.alm?.meridian?.strategies["medianStableV2"];
  }
}

export function getContractAddress(
  chain: ChainName,
  contractId: ContractId
): HexString | undefined {
  return resolveAddress(getDeployment(chain), contractId);
}

export function requireContractAddress(
  chain: ChainName,
  contractId: ContractId
): HexString {
  const address = getContractAddress(chain, contractId);
  if (address === undefined) {
    throw new DeploymentError(
      `Contract "${contractId}" is not deployed on "${chain}"`,
      { chain, contractId }
    );
  }
  return address;
}
