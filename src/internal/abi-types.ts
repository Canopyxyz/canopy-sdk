/**
 * TypeScript types derived from Satay Protocol ABIs
 */

export interface VaultBaseStrategyView {
  strategyAddress: string;
  assetAddress: string;
  concreteAddress: string;
  currentVaultDebt: string;
  debtLimit: string;
  decimals: number;
  lastReport: string;
  sharesAddress: string;
  totalAsset: string;
  totalDebt: string;
  totalIdle: string;
  totalLoss: string;
  totalProfit: string;
  totalShares: string;
  vaultAddress: string;
}

export interface VaultView {
  decimals: number;
  totalDebt: string;
  totalIdle: string;
  totalShares: string;
  totalAsset: string;
  assetName: string;
  sharesName: string;
  vaultAddress: string;
  assetAddress: string;
  sharesAddress: string;
  pairedCoinType?: string;
  strategies: VaultBaseStrategyView[];
}

export interface PaginatedVaultsView {
  limit: number;
  offset: number;
  totalCount: number;
  vaults: VaultView[];
}

export interface Vault {
  total_debt: string;
  is_paused: boolean;
  total_idle: string;
  deposit_limit?: string;
  total_debt_limit?: string;
  base_metadata: string;
  shares_metadata: string;
  last_report: string;
  total_locked: string;
  lock_duration: string;
  manager: string;
  strategies: Record<string, BaseStrategyState>;
  management_fee?: string;
  performance_fee?: string;
}

export interface BaseStrategyState {
  debt: string;
  debt_limit: string;
  last_report: string;
  total_profit: string;
  total_loss: string;
}

export interface StrategyDetails {
  address: string;
  vault: string;
  debt: string;
  debtLimit: string;
  lastReport: string;
  totalProfit: string;
  totalLoss: string;
  sharesBalance: string;
}

export type Option<T> = T | null | undefined;
