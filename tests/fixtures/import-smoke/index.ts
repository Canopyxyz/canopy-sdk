import {
  findRedemptionRequest,
  getCanopyStrategyContract,
  requireContract,
  type ChainName,
  type ContractId,
  type CuratorDepositPreview,
  type CuratorRedemptionRequest,
  type CuratorVault,
} from "@canopyhub/canopy-sdk";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk/bindings";
import { requireAbi } from "@canopyhub/canopy-sdk/bindings";
import type {
  HexString,
  MoveAbortResolution,
  MoveAbortResolverInput,
} from "@canopyhub/canopy-sdk/core";
import { moveOptionArgument, normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";
import { getContractAddress } from "@canopyhub/canopy-sdk/deployments";

const chain: ChainName = "movement-mainnet";
const contractId: ContractId = "canopy.router";
const address: HexString = normalizeMoveAddress("0x1");
const deploymentAddress = getContractAddress(chain, contractId);
const resolvedContract = requireContract(chain, contractId);
const strategyContract = getCanopyStrategyContract(chain, "layerbank");
const abi: MoveModuleAbi = requireAbi(chain, contractId);

const curatorContract = requireContract("movement-testnet", "curator.router");
const noneOption = moveOptionArgument(undefined);
const someOption = moveOptionArgument(10n);
const requestedEvent = findRedemptionRequest({ events: [] });
const abortResolver = (input: MoveAbortResolverInput): MoveAbortResolution | undefined =>
  input.abortCode === 1 ? { kind: "unknown" } : undefined;

declare const curatorVault: CuratorVault;
declare const curatorPreview: CuratorDepositPreview;
declare const curatorRequest: CuratorRedemptionRequest;

void abi;
void abortResolver;
void address;
void curatorContract;
void curatorPreview;
void curatorRequest;
void curatorVault;
void deploymentAddress;
void noneOption;
void requestedEvent;
void resolvedContract;
void someOption;
void strategyContract;
