import {
  requireAbi,
  type MoveModuleAbi,
} from "@canopyhub/canopy-sdk-bindings";
import {
  normalizeMoveAddress,
  type HexString,
} from "@canopyhub/canopy-sdk-core";
import {
  getContractAddress,
  type ChainName,
  type ContractId,
} from "@canopyhub/canopy-sdk-deployments";

const chain: ChainName = "movement-mainnet";
const contractId: ContractId = "canopy.router";
const address: HexString = normalizeMoveAddress("0x1");
const deploymentAddress = getContractAddress(chain, contractId);
const abi: MoveModuleAbi = requireAbi(chain, contractId);

void abi;
void address;
void deploymentAddress;
