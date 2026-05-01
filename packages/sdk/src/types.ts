import type { InputEntryFunctionData, Movement } from "@moveindustries/ts-sdk";
import type { ChainAbiSet } from "@canopyhub/canopy-sdk/bindings";
import type { ChainDeployment, ChainName } from "@canopyhub/canopy-sdk/deployments";
import type { MovePositionConfig } from "./canopy/moveposition";

export type SdkChainName = ChainName;

export interface OffchainDataOptions {
  cacheTimeoutMs?: number;
  canopyMetadataEndpoint?: string;
  sentioApiKey?: string;
  sentioEndpoint?: string;
}

export interface CanopySdkOptions<Chain extends SdkChainName = SdkChainName> {
  chain: Chain;
  moveposition?: Partial<MovePositionConfig>;
  offchain?: OffchainDataOptions;
}

export interface SdkContext<Chain extends SdkChainName = SdkChainName> {
  readonly abis: ChainAbiSet[Chain];
  readonly chain: Chain;
  readonly client: Movement;
  readonly deployment: ChainDeployment;
  readonly moveposition?: MovePositionConfig;
}

export type TransactionPayload = InputEntryFunctionData;
