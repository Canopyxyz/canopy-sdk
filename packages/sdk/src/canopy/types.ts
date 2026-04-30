import type { TransactionPayload } from "../types";

export interface CanopyVaultStrategyView {
  assetAddress: string;
  concreteAddress: string;
  currentVaultDebt: bigint;
  debtLimit: bigint;
  decimals: number;
  lastReport: bigint;
  sharesAddress: string;
  strategyAddress: string;
  totalAsset: bigint;
  totalDebt: bigint;
  totalIdle: bigint;
  totalLoss: bigint;
  totalProfit: bigint;
  totalShares: bigint;
  vaultAddress: string;
}

export interface CanopyVaultView {
  assetAddress: string;
  assetName: string;
  decimals: number;
  pairedCoinType?: string;
  sharesAddress: string;
  sharesName: string;
  strategies: CanopyVaultStrategyView[];
  totalAsset: bigint;
  totalDebt: bigint;
  totalIdle: bigint;
  totalShares: bigint;
  vaultAddress: string;
}

export interface PaginatedCanopyVaults {
  limit: number;
  offset: number;
  totalCount: number;
  vaults: CanopyVaultView[];
}

export interface CanopyStrategyDetails {
  debt: bigint;
  debtLimit: bigint;
  lastReport: bigint;
  sharesBalance: bigint;
  strategyAddress: string;
  totalLoss: bigint;
  totalProfit: bigint;
  vaultAddress: string;
}

export interface CanopyUserVaultPosition {
  assetValue: bigint;
  sharesBalance: bigint;
  userAddress: string;
  vaultAddress: string;
}

export interface CanopyVaultAllocation {
  amounts: bigint[];
  operation: "deposit" | "withdraw";
  requestedAmount: bigint;
  strategies: string[];
  vaultAddress: string;
}

export interface CanopyDepositPayloadInput {
  amount: bigint;
  minSharesOut: bigint;
  vaultAddress: string;
  wrapperCoinType?: string;
}

export interface CanopyWithdrawPayloadInput {
  maxLossBps: bigint;
  minAmountOut: bigint;
  shares: bigint;
  vaultAddress: string;
  wrapperCoinType?: string;
}

export interface UnstakeAndWithdrawInput extends CanopyWithdrawPayloadInput {
  walletShares: bigint;
  stakedShares: bigint;
}

export type UnstakeAndWithdrawPlan =
  | {
      requiresUnstake: false;
      unstakeAmount: 0n;
      withdrawPayload: TransactionPayload;
    }
  | {
      requiresUnstake: true;
      unstakeAmount: bigint;
      unstakePayload: TransactionPayload;
      withdrawPayload: TransactionPayload;
    };
