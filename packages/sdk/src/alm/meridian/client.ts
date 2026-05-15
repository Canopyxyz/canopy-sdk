import { createEntryPayload } from "@thalalabs/surf";
import {
  CanopyError,
  CanopyErrorCode,
  callSingleViewResult,
  callSingleViewPayloadResult,
  callViewPayloadFunction,
  moveUintArgument,
  normalizeMoveAddress,
} from "@canopyhub/canopy-sdk/core";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveBool,
  readMoveOption,
  readMoveString,
  readMoveU8,
  readMoveU128,
  readMoveU64,
} from "../../internal/move-readers";
import {
  createSurfViewFunctionPayload,
  type SurfViewFunctionArguments,
  type SurfViewFunctionName,
} from "../../internal/surf";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk/bindings";
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
    const rawVaults = await this.callRegistryViewResult(
      "get_paginated_vaults",
      [moveUintArgument(offset), moveUintArgument(limit)]
    );

    return readMoveAddressVector(rawVaults);
  }

  async getVaultCount(): Promise<bigint> {
    const count = await this.callRegistryViewResult("get_recognized_vault_count");

    return readMoveU64(count);
  }

  async getVaultSummary(vaultAddress: string): Promise<MeridianVaultSummary> {
    const normalizedVault = normalizeMoveAddress(vaultAddress);
    const [sharePriceE18, totalHoldings, depositAndQuoteAssets, underlyingPool, depositIsAsset0] =
      await Promise.all([
        this.callVaultViewResult("get_shares_price_e18", [normalizedVault]),
        this.callVaultViewFunction<[unknown, unknown]>(
          "get_total_vault_holdings",
          [normalizedVault]
        ),
        this.callVaultViewFunction<[unknown, unknown]>(
          "get_vault_deposit_and_quote_assets",
          [normalizedVault]
        ),
        this.callVaultViewResult("get_underlying_pool", [normalizedVault]),
        this.callVaultViewResult("is_asset_0_deposit", [normalizedVault]),
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
    const [shares, valueE18] = await this.callVaultViewFunction<[unknown, unknown]>(
      "get_user_vault_balance",
      [
        normalizeMoveAddress(vaultAddress),
        normalizeMoveAddress(userAddress),
      ]
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
    const [asset0, asset1] = await this.callVaultViewFunction<[unknown, unknown]>(
      "get_shares_withdrawal_amounts",
      [
        normalizeMoveAddress(vaultAddress),
        moveUintArgument(shares),
      ]
    );

    return {
      asset0: readMoveU64(asset0),
      asset1: readMoveU64(asset1),
      vaultAddress: normalizeMoveAddress(vaultAddress),
    };
  }

  buildDepositPayload(input: MeridianDepositPayloadInput): TransactionPayload {
    return createEntryPayload(this.context.abis.meridianRouter, {
      function: "deposit",
      typeArguments: [],
      functionArguments: [
        normalizeMoveAddress(input.vaultAddress),
        moveUintArgument(input.amount),
        moveUintArgument(input.minSharesOut),
      ],
    });
  }

  buildWithdrawPayload(input: MeridianWithdrawPayloadInput): TransactionPayload {
    assertMeridianWithdrawInputShape(input);

    return createEntryPayload(this.context.abis.meridianRouter, {
      function: "withdraw",
      typeArguments: [],
      functionArguments: [
        normalizeMoveAddress(input.vaultAddress),
        moveUintArgument(input.shares),
        moveUintArgument(input.minAsset0),
        moveUintArgument(input.minAsset1),
      ],
    });
  }

  async getBatchVaultInfo(
    vaultAddresses: string[]
  ): Promise<Array<MeridianBatchVaultInfo | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const results = await this.callAbiViewResult(batchViews, "batch_get_vault_info", [
      normalizedVaults,
    ]);

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
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const results = await this.callAbiViewResult(batchViews, "batch_get_user_balances", [
      normalizedVaults,
      normalizeMoveAddress(userAddress),
    ]);

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
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const results = await this.callAbiViewResult(batchViews, "batch_get_vault_positions", [
      normalizedVaults,
    ]);

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
    const abi =
      "meridianBatchViews" in this.context.abis
        ? this.context.abis.meridianBatchViews
        : undefined;

    if (!abi) {
      throw new CanopyError(
        "Meridian batch views are not available on this chain",
        CanopyErrorCode.InvalidDeployment,
        { chain: this.context.chain }
      );
    }

    return abi;
  }

  private callRegistryViewResult<Result = unknown>(
    functionName: SurfViewFunctionName<typeof this.context.abis.meridianRegistry>,
    functionArguments?: SurfViewFunctionArguments<
      typeof this.context.abis.meridianRegistry,
      typeof functionName
    >
  ): Promise<Result> {
    return this.callAbiViewResult(
      this.context.abis.meridianRegistry,
      functionName,
      functionArguments
    );
  }

  private callVaultViewResult<Result = unknown>(
    functionName: SurfViewFunctionName<typeof this.context.abis.meridianVault>,
    functionArguments?: SurfViewFunctionArguments<
      typeof this.context.abis.meridianVault,
      typeof functionName
    >
  ): Promise<Result> {
    return this.callAbiViewResult(
      this.context.abis.meridianVault,
      functionName,
      functionArguments
    );
  }

  private callVaultViewFunction<Result extends unknown[] = unknown[]>(
    functionName: SurfViewFunctionName<typeof this.context.abis.meridianVault>,
    functionArguments?: SurfViewFunctionArguments<
      typeof this.context.abis.meridianVault,
      typeof functionName
    >
  ): Promise<Result> {
    return this.callAbiViewFunction(
      this.context.abis.meridianVault,
      functionName,
      functionArguments
    );
  }

  private callAbiViewResult<
    TAbi extends MoveModuleAbi,
    TFn extends SurfViewFunctionName<TAbi>,
    Result = unknown,
  >(
    abi: TAbi,
    functionName: TFn,
    functionArguments?: SurfViewFunctionArguments<TAbi, TFn>
  ): Promise<Result> {
    return callSingleViewPayloadResult(
      this.context.client,
      createSurfViewFunctionPayload(abi, {
        functionName,
        ...(functionArguments ? { functionArguments } : {}),
      })
    );
  }

  private callAbiViewFunction<
    TAbi extends MoveModuleAbi,
    TFn extends SurfViewFunctionName<TAbi>,
    Result extends unknown[] = unknown[],
  >(
    abi: TAbi,
    functionName: TFn,
    functionArguments?: SurfViewFunctionArguments<TAbi, TFn>
  ): Promise<Result> {
    return callViewPayloadFunction(
      this.context.client,
      createSurfViewFunctionPayload(abi, {
        functionName,
        ...(functionArguments ? { functionArguments } : {}),
      })
    );
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
    shareDecimals: readMoveU8(info.share_decimals),
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

function assertMeridianWithdrawInputShape(input: MeridianWithdrawPayloadInput): void {
  const legacyInput = input as MeridianWithdrawPayloadInput & {
    maxLossBps?: unknown;
    minAmountOut?: unknown;
  };

  if (legacyInput.maxLossBps !== undefined || legacyInput.minAmountOut !== undefined) {
    throw new CanopyError(
      "Meridian withdraw inputs must use minAsset0 and minAsset1 instead of maxLossBps and minAmountOut",
      CanopyErrorCode.InvalidInput,
      {
        receivedKeys: Object.keys(legacyInput).sort(),
      }
    );
  }
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

  return readMoveU8(decimals);
}
