import {
  CanopyError,
  CanopyErrorCode,
  callSingleViewResult,
  callViewFunction,
  entryFunctionPayload,
  moveUintArgument,
  normalizeMoveAddress,
} from "@canopyhub/canopy-sdk/core";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveBool,
  readMoveOption,
  readMoveString,
  readMoveU128,
  readMoveU64,
} from "../../internal/move-readers";
import type { SdkContext, TransactionPayload } from "../../types";
import type {
  MeridianBatchPositionSummary,
  MeridianBatchUserVaultBalance,
  MeridianBatchVaultPositions,
  MeridianBatchVaultInfo,
  ListMeridianVaultsInput,
  MeridianDepositPayloadInput,
  MeridianUserVaultPosition,
  MeridianVaultSummary,
  MeridianWithdrawalPreview,
  MeridianWithdrawPayloadInput,
} from "./types";

export class MeridianClient {
  constructor(
    private readonly context: SdkContext<"movement-mainnet" | "aptos-mainnet">
  ) {}

  async listVaults(input: ListMeridianVaultsInput = {}): Promise<string[]> {
    const offset = input.offset ?? 0;
    const limit = input.limit ?? 50;
    const rawVaults = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: this.context.abis.meridianRegistry.address,
        moduleName: this.context.abis.meridianRegistry.name,
        functionName: "get_paginated_vaults",
        functionArguments: [moveUintArgument(offset), moveUintArgument(limit)],
      }
    );

    return readMoveAddressVector(rawVaults);
  }

  async getVaultCount(): Promise<bigint> {
    const count = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: this.context.abis.meridianRegistry.address,
        moduleName: this.context.abis.meridianRegistry.name,
        functionName: "get_recognized_vault_count",
      }
    );

    return readMoveU64(count);
  }

  async getVaultSummary(vaultAddress: string): Promise<MeridianVaultSummary> {
    const normalizedVault = normalizeMoveAddress(vaultAddress);
    const [sharePriceE18, totalHoldings, depositAndQuoteAssets, underlyingPool, depositIsAsset0] =
      await Promise.all([
        callSingleViewResult(
          this.context.client,
          {
            moduleAddress: this.context.abis.meridianVault.address,
            moduleName: this.context.abis.meridianVault.name,
            functionName: "get_shares_price_e18",
            functionArguments: [normalizedVault],
          }
        ),
        callViewFunction<[unknown, unknown]>(
          this.context.client,
          {
            moduleAddress: this.context.abis.meridianVault.address,
            moduleName: this.context.abis.meridianVault.name,
            functionName: "get_total_vault_holdings",
            functionArguments: [normalizedVault],
          }
        ),
        callViewFunction<[unknown, unknown]>(
          this.context.client,
          {
            moduleAddress: this.context.abis.meridianVault.address,
            moduleName: this.context.abis.meridianVault.name,
            functionName: "get_vault_deposit_and_quote_assets",
            functionArguments: [normalizedVault],
          }
        ),
        callSingleViewResult(
          this.context.client,
          {
            moduleAddress: this.context.abis.meridianVault.address,
            moduleName: this.context.abis.meridianVault.name,
            functionName: "get_underlying_pool",
            functionArguments: [normalizedVault],
          }
        ),
        callSingleViewResult(
          this.context.client,
          {
            moduleAddress: this.context.abis.meridianVault.address,
            moduleName: this.context.abis.meridianVault.name,
            functionName: "is_asset_0_deposit",
            functionArguments: [normalizedVault],
          }
        ),
      ]);
    const depositAssetAddress = readMoveAddress(depositAndQuoteAssets[0]);
    const quoteAssetAddress = readMoveAddress(depositAndQuoteAssets[1]);
    const [depositAssetDecimals, quoteAssetDecimals, shareDecimals] = await Promise.all([
      getFungibleAssetDecimals(this.context, depositAssetAddress),
      getFungibleAssetDecimals(this.context, quoteAssetAddress),
      getFungibleAssetDecimals(this.context, normalizedVault),
    ]);

    return {
      depositAssetAddress,
      depositAssetDecimals,
      depositIsAsset0: readMoveBool(depositIsAsset0),
      quoteAssetAddress,
      quoteAssetDecimals,
      shareDecimals,
      sharePriceE18: readMoveU128(sharePriceE18),
      totalHoldings: {
        asset0: readMoveU64(totalHoldings[0]),
        asset1: readMoveU64(totalHoldings[1]),
      },
      underlyingPoolAddress: readMoveAddress(underlyingPool),
      vaultAddress: normalizedVault,
    };
  }

  async getUserVaultPosition(
    vaultAddress: string,
    userAddress: string
  ): Promise<MeridianUserVaultPosition> {
    const [shares, valueE18] = await callViewFunction<[unknown, unknown]>(
      this.context.client,
      {
        moduleAddress: this.context.abis.meridianVault.address,
        moduleName: this.context.abis.meridianVault.name,
        functionName: "get_user_vault_balance",
        functionArguments: [
          normalizeMoveAddress(vaultAddress),
          normalizeMoveAddress(userAddress),
        ],
      }
    );

    return {
      shares: readMoveU64(shares),
      valueE18: readMoveU128(valueE18),
      vaultAddress: normalizeMoveAddress(vaultAddress),
    };
  }

  async previewWithdraw(
    vaultAddress: string,
    shares: bigint
  ): Promise<MeridianWithdrawalPreview> {
    const [asset0, asset1] = await callViewFunction<[unknown, unknown]>(
      this.context.client,
      {
        moduleAddress: this.context.abis.meridianVault.address,
        moduleName: this.context.abis.meridianVault.name,
        functionName: "get_shares_withdrawal_amounts",
        functionArguments: [
          normalizeMoveAddress(vaultAddress),
          moveUintArgument(shares),
        ],
      }
    );

    return {
      asset0: readMoveU64(asset0),
      asset1: readMoveU64(asset1),
      vaultAddress: normalizeMoveAddress(vaultAddress),
    };
  }

  buildDepositPayload(input: MeridianDepositPayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.meridianRouter.address,
      moduleName: this.context.abis.meridianRouter.name,
      functionName: "deposit",
      functionArguments: [
        normalizeMoveAddress(input.vaultAddress),
        moveUintArgument(input.amount),
        moveUintArgument(input.minSharesOut),
      ],
    });
  }

  buildWithdrawPayload(input: MeridianWithdrawPayloadInput): TransactionPayload {
    return entryFunctionPayload({
      moduleAddress: this.context.abis.meridianRouter.address,
      moduleName: this.context.abis.meridianRouter.name,
      functionName: "withdraw",
      functionArguments: [
        normalizeMoveAddress(input.vaultAddress),
        moveUintArgument(input.shares),
        moveUintArgument(input.maxLossBps),
        moveUintArgument(input.minAmountOut),
      ],
    });
  }

  async getBatchVaultInfo(
    vaultAddresses: string[]
  ): Promise<Array<MeridianBatchVaultInfo | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map(normalizeMoveAddress);
    const results = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: batchViews.address,
        moduleName: batchViews.name,
        functionName: "batch_get_vault_info",
        functionArguments: [normalizedVaults],
      }
    );

    if (!Array.isArray(results)) {
      throw new CanopyError("Expected vault info batch vector", CanopyErrorCode.ViewCallFailed, {
        valueType: typeof results,
      });
    }

    return results.map((result, index) =>
      readMoveOption(result, (value) =>
        readBatchVaultInfo(value, normalizedVaults[index] as string)
      )
    );
  }

  async getBatchUserVaultBalances(
    vaultAddresses: string[],
    userAddress: string
  ): Promise<Array<MeridianBatchUserVaultBalance | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map(normalizeMoveAddress);
    const results = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: batchViews.address,
        moduleName: batchViews.name,
        functionName: "batch_get_user_balances",
        functionArguments: [normalizedVaults, normalizeMoveAddress(userAddress)],
      }
    );

    if (!Array.isArray(results)) {
      throw new CanopyError(
        "Expected user vault balance batch vector",
        CanopyErrorCode.ViewCallFailed,
        { valueType: typeof results }
      );
    }

    return results.map((result, index) =>
      readMoveOption(result, (value) =>
        readBatchUserVaultBalance(value, normalizedVaults[index] as string)
      )
    );
  }

  async getBatchVaultPositions(
    vaultAddresses: string[]
  ): Promise<Array<MeridianBatchVaultPositions | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map(normalizeMoveAddress);
    const results = await callSingleViewResult(
      this.context.client,
      {
        moduleAddress: batchViews.address,
        moduleName: batchViews.name,
        functionName: "batch_get_vault_positions",
        functionArguments: [normalizedVaults],
      }
    );

    if (!Array.isArray(results)) {
      throw new CanopyError(
        "Expected vault positions batch vector",
        CanopyErrorCode.ViewCallFailed,
        { valueType: typeof results }
      );
    }

    return results.map((result, index) =>
      readMoveOption(result, (value) => ({
        positions: readBatchPositionSummaryVector(value),
        vaultAddress: normalizedVaults[index] as string,
      }))
    );
  }

  private getBatchViewsAbi() {
    const abi = this.context.abis.meridianBatchViews;

    if (!abi) {
      throw new CanopyError(
        "Meridian batch views are not available on this chain",
        CanopyErrorCode.InvalidDeployment,
        { chain: this.context.chain }
      );
    }

    return abi;
  }
}

function readBatchVaultInfo(
  value: unknown,
  vaultAddress: string
): MeridianBatchVaultInfo {
  const info = value as Record<string, unknown>;

  return {
    depositAssetAddress: readMoveAddress(info.deposit_asset),
    quoteAssetAddress: readMoveAddress(info.quote_asset),
    shareDecimals: Number(readMoveU64(info.share_decimals)),
    shareName: readMoveString(info.share_name),
    sharePriceE18: readMoveU128(info.share_price_e18),
    shareSymbol: readMoveString(info.share_symbol),
    total0: readMoveU64(info.total_0),
    total1: readMoveU64(info.total_1),
    totalShares: readMoveU128(info.total_shares),
    vaultAddress,
  };
}

function readBatchUserVaultBalance(
  value: unknown,
  vaultAddress: string
): MeridianBatchUserVaultBalance {
  const balance = value as Record<string, unknown>;

  return {
    shareBalance: readMoveU64(balance.share_balance),
    valueInDepositAssetE18: readMoveU128(balance.value_in_deposit_asset_e18),
    vaultAddress,
  };
}

function readBatchPositionSummaryVector(value: unknown): MeridianBatchPositionSummary[] {
  if (!Array.isArray(value)) {
    throw new CanopyError(
      "Expected vault position summary vector",
      CanopyErrorCode.ViewCallFailed,
      { valueType: typeof value }
    );
  }

  return value.map(readBatchPositionSummary);
}

function readBatchPositionSummary(value: unknown): MeridianBatchPositionSummary {
  const position = value as Record<string, unknown>;

  return {
    amount0: readMoveU64(position.amount_0),
    amount1: readMoveU64(position.amount_1),
    liquidity: readMoveU64(position.liquidity),
    lowerTick: readSignedTick(position.lower_tick_neg, position.lower_tick_abs),
    upperTick: readSignedTick(position.upper_tick_neg, position.upper_tick_abs),
  };
}

function readSignedTick(isNegative: unknown, absoluteValue: unknown): bigint {
  const value = readMoveU64(absoluteValue);
  return readMoveBool(isNegative) ? -value : value;
}

async function getFungibleAssetDecimals(
  context: SdkContext<"movement-mainnet" | "aptos-mainnet">,
  metadataAddress: string
): Promise<number> {
  const decimals = await callSingleViewResult(
    context.client,
    {
      moduleAddress: "0x1",
      moduleName: "fungible_asset",
      functionName: "decimals",
      functionArguments: [normalizeMoveAddress(metadataAddress)],
    }
  );

  return Number(readMoveU64(decimals));
}
