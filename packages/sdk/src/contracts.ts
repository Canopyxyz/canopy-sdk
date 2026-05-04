import { getAbi, requireAbi } from "@canopyhub/canopy-sdk/bindings";
import {
  getContractAddress,
  requireContractAddress,
  type ChainName,
  type ContractId,
} from "@canopyhub/canopy-sdk/deployments";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk/bindings";
import type { HexString } from "@canopyhub/canopy-sdk/core";

export type { ChainName, ContractId } from "@canopyhub/canopy-sdk/deployments";
export type { HexString } from "@canopyhub/canopy-sdk/core";

export interface ResolvedContract {
  id: ContractId;
  chain: ChainName;
  address: HexString;
  abi: MoveModuleAbi;
  moduleName: string;
}

export function getContract(
  chain: ChainName,
  contractId: ContractId
): ResolvedContract | null {
  const address = getContractAddress(chain, contractId);
  const abi = getAbi(chain, contractId);

  if (address === undefined || abi === undefined) {
    return null;
  }

  return resolveContract(chain, contractId, address, abi);
}

export function requireContract(
  chain: ChainName,
  contractId: ContractId
): ResolvedContract {
  const address = requireContractAddress(chain, contractId);
  const abi = requireAbi(chain, contractId);
  return resolveContract(chain, contractId, address, abi);
}

function resolveContract(
  chain: ChainName,
  contractId: ContractId,
  address: HexString,
  abi: MoveModuleAbi
): ResolvedContract {
  return {
    id: contractId,
    chain,
    address,
    abi,
    moduleName: abi.name,
  };
}
