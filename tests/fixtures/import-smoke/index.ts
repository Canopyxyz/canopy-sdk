import {
  getCanopyStrategyContract,
  requireContract,
  type ChainName,
  type ContractId,
} from "@canopyhub/canopy-sdk";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk/bindings";
import { requireAbi } from "@canopyhub/canopy-sdk/bindings";
import type { HexString } from "@canopyhub/canopy-sdk/core";
import { normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";
import { getContractAddress } from "@canopyhub/canopy-sdk/deployments";

const chain: ChainName = "movement-mainnet";
const contractId: ContractId = "canopy.router";
const address: HexString = normalizeMoveAddress("0x1");
const deploymentAddress = getContractAddress(chain, contractId);
const resolvedContract = requireContract(chain, contractId);
const strategyContract = getCanopyStrategyContract(chain, "layerbank");
const abi: MoveModuleAbi = requireAbi(chain, contractId);

void abi;
void address;
void deploymentAddress;
void resolvedContract;
void strategyContract;
