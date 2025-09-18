import type { InputEntryFunctionData } from "@aptos-labs/ts-sdk";

export enum CanopyErrorCode {
  VAULT_PAUSED = "VAULT_PAUSED",
  NETWORK_ERROR = "NETWORK_ERROR",
  VAULT_NOT_FOUND = "VAULT_NOT_FOUND",
  AMOUNT_TOO_SMALL = "AMOUNT_TOO_SMALL",
  INVALID_VAULT_ADDRESS = "INVALID_VAULT_ADDRESS",
  INVALID_USER_ADDRESS = "INVALID_USER_ADDRESS",
  INVALID_TOKEN_ADDRESS = "INVALID_TOKEN_ADDRESS",
  INVALID_POOL_ADDRESS = "INVALID_POOL_ADDRESS",
  INVALID_INPUT = "INVALID_INPUT",
  TRANSACTION_BUILD_FAILED = "TRANSACTION_BUILD_FAILED",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  PACKET_GENERATION_FAILED = "PACKET_GENERATION_FAILED",
  STAKING_POOLS_NOT_FOUND = "STAKING_POOLS_NOT_FOUND",
}

export class CanopyError extends Error {
  constructor(
    message: string,
    public code: CanopyErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = "CanopyError";
  }
}

export type {
  VaultView,
  PaginatedVaultsView,
  VaultBaseStrategyView,
  StrategyDetails,
} from "./internal/abi-types";

export type { VaultMetadata } from "./internal/gql-types";

export interface VaultPosition {
  userAddress: string;
  vaultAddress: string;
  sharesBalance: string;
  assetValue: string;
}

export interface VaultData {
  // Core identifiers
  address: string;
  chainId: number;

  // Display information (from GraphQL)
  displayName: string;
  description: string;
  iconURL: string;
  labels: string[];
  investmentType: string;
  networkType: string;
  riskScore: number;

  // Status
  paused: boolean;

  // Token information
  baseAsset: string; // The underlying asset deposited into the vault (e.g., USDC, MOVE)
  sharesAsset: string; // The vault's LP token representing user shares
  baseAssetDecimals: number;
  sharesAssetDecimals: number;

  // Financial metrics (GraphQL - off-chain calculated)
  tvl: string;
  apr: string;
  rewardApr: string;

  // On-chain state (from view functions)
  totalAssets?: string;
  totalSupply?: string;
  baseAssetBalance?: string;
  sharesAssetBalance?: string;
  strategies?: string[];

  // Additional metadata
  rewardPools: string[];
  additionalMetadata: Record<string, string>;
}

export type TransactionPayload = InputEntryFunctionData;
