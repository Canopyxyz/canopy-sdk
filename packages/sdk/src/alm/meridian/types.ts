export interface MeridianVaultSummary {
  depositAssetAddress: string;
  depositAssetDecimals: number;
  depositIsAsset0: boolean;
  quoteAssetAddress: string;
  quoteAssetDecimals: number;
  shareDecimals: number;
  sharePriceE18: bigint;
  totalHoldings: {
    asset0: bigint;
    asset1: bigint;
  };
  underlyingPoolAddress: string;
  vaultAddress: string;
}

export interface MeridianUserVaultPosition {
  shares: bigint;
  vaultAddress: string;
  valueE18: bigint;
}

export interface MeridianWithdrawalPreview {
  asset0: bigint;
  asset1: bigint;
  vaultAddress: string;
}

export interface MeridianDepositPayloadInput {
  amount: bigint;
  minSharesOut: bigint;
  vaultAddress: string;
}

export interface MeridianWithdrawPayloadInput {
  maxLossBps: bigint;
  minAmountOut: bigint;
  shares: bigint;
  vaultAddress: string;
}

export interface ListMeridianVaultsInput {
  limit?: bigint | number;
  offset?: bigint | number;
}

export interface MeridianBatchVaultInfo {
  depositAssetAddress: string;
  quoteAssetAddress: string;
  shareDecimals: number;
  shareName: string;
  sharePriceE18: bigint;
  shareSymbol: string;
  total0: bigint;
  total1: bigint;
  totalShares: bigint;
  vaultAddress: string;
}

export interface MeridianBatchUserVaultBalance {
  shareBalance: bigint;
  valueInDepositAssetE18: bigint;
  vaultAddress: string;
}

export interface MeridianBatchPositionSummary {
  amount0: bigint;
  amount1: bigint;
  liquidity: bigint;
  lowerTick: bigint;
  upperTick: bigint;
}

export interface MeridianBatchVaultPositions {
  positions: MeridianBatchPositionSummary[];
  vaultAddress: string;
}
