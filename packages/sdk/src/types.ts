import type {
  AccountAddressInput,
  Account,
  Aptos,
  CommittedTransactionResponse,
  InputEntryFunctionData,
  InputGenerateTransactionOptions,
  InputSimulateTransactionOptions,
  PendingTransactionResponse,
  PublicKey,
  UserTransactionResponse,
  WaitForTransactionOptions,
} from "@aptos-labs/ts-sdk";
import type { AbisForChain } from "@canopyhub/canopy-sdk-bindings";
import type { ChainDeployment, ChainName } from "@canopyhub/canopy-sdk-deployments";
import type { MovePositionConfig } from "./canopy/moveposition";

export type SdkChainName = ChainName;

export interface OffchainDataOptions {
  cacheMaxEntries?: number;
  cacheTimeoutMs?: number;
  sentioApiKey?: string;
  sentioEndpoint?: string;
}

export interface CanopySdkOptions<Chain extends SdkChainName = SdkChainName> {
  chain: Chain;
  moveposition?: Partial<MovePositionConfig>;
  offchain?: OffchainDataOptions;
}

export interface SdkContext<Chain extends SdkChainName = SdkChainName> {
  readonly abis: AbisForChain<Chain>;
  readonly chain: Chain;
  readonly client: Aptos;
  readonly deployment: ChainDeployment;
  readonly moveposition?: MovePositionConfig;
}

export type TransactionPayload = InputEntryFunctionData;

export interface SimulateTransactionInput {
  payload: TransactionPayload;
  sender: AccountAddressInput;
  signerPublicKey?: PublicKey;
  transactionOptions?: InputGenerateTransactionOptions;
  simulationOptions?: InputSimulateTransactionOptions;
}

export type TransactionSimulationResult = UserTransactionResponse;

export interface SignAndSubmitTransactionInput {
  payload: TransactionPayload;
  signer: Account;
  sender?: AccountAddressInput;
  transactionOptions?: InputGenerateTransactionOptions;
}

export interface SignSubmitAndWaitTransactionInput extends SignAndSubmitTransactionInput {
  waitOptions?: WaitForTransactionOptions;
}

export type SubmittedTransactionResult = PendingTransactionResponse;
export type SubmittedAndWaitedTransactionResult = CommittedTransactionResponse;
