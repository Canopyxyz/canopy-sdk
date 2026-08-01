import {
  CanopyError,
  CanopyErrorCode,
  entryFunctionPayload,
  callSingleViewResult,
  callSingleViewPayloadResult,
  callViewPayloadFunction,
  moveUintArgument,
  normalizeMoveAddress,
} from "@canopyhub/canopy-sdk-core";
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
import { callAbiView, callAbiViewFunction } from "../../internal/abi-views";
import { mapAddressBatch } from "../../internal/address-batches";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk-bindings";
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

/**
 * Entry functions on the Meridian router that this client can build.
 *
 * A literal union replaces the compile-time function-name checking Surf used to
 * provide; `tests/` asserts every name here is an `is_entry` function on the bound
 * ABI with matching arity.
 */
export type MeridianRouterFunction = "deposit" | "withdraw";

/** View functions this client reads, by module. */
export type MeridianRegistryViewFunction = "get_paginated_vaults" | "get_recognized_vault_count";

export type MeridianVaultViewFunction =
  | "get_shares_price_e18"
  | "get_total_vault_holdings"
  | "get_vault_deposit_and_quote_assets"
  | "get_underlying_pool"
  | "is_asset_0_deposit"
  | "get_user_vault_balance"
  | "get_shares_withdrawal_amounts";

export type MeridianBatchViewFunction =
  | "batch_get_vault_info"
  | "batch_get_user_balances"
  | "batch_get_vault_positions";

type MeridianClientDeps = Pick<
  SdkContext<"movement-mainnet" | "aptos-mainnet">,
  "abis" | "chain" | "client"
>;

export class MeridianClient {
  static fromContext(
    context: SdkContext<"movement-mainnet" | "aptos-mainnet">
  ): MeridianClient {
    return new MeridianClient(context);
  }

  constructor(
    private readonly context: MeridianClientDeps
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
    return this.buildRouterPayload("deposit", [
      normalizeMoveAddress(input.vaultAddress),
      moveUintArgument(input.amount),
      moveUintArgument(input.minSharesOut),
    ]);
  }

  buildWithdrawPayload(input: MeridianWithdrawPayloadInput): TransactionPayload {
    assertMeridianWithdrawInputShape(input);

    return this.buildRouterPayload("withdraw", [
      normalizeMoveAddress(input.vaultAddress),
      moveUintArgument(input.shares),
      moveUintArgument(input.minAsset0),
      moveUintArgument(input.minAsset1),
    ]);
  }

  /**
   * Builds a plain entry payload with no `abi` field, so `@aptos-labs/ts-sdk`
   * fetches the entry-function ABI itself and strips the leading `&signer`.
   *
   * Surf's `createEntryPayload` attached an `abi` whose `parameters` still included
   * the signer while `functionArguments` did not, so every argument was matched off
   * by one and `transaction.build.simple` rejected argument 0.
   */
  private buildRouterPayload(
    functionName: MeridianRouterFunction,
    functionArguments: (string | undefined)[]
  ): TransactionPayload {
    const abi = this.context.abis.meridianRouter;

    return entryFunctionPayload({
      moduleAddress: abi.address,
      moduleName: abi.name,
      functionName,
      functionArguments: functionArguments as never,
    });
  }

  async getBatchVaultInfo(
    vaultAddresses: string[]
  ): Promise<Array<MeridianBatchVaultInfo | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map((address) =>
      normalizeMoveAddress(address)
    ) as Array<`0x${string}`>;

    return mapAddressBatch(normalizedVaults, {
      label: "vault info",
      fetchChunk: async (chunk) => {
        const results = await this.callAbiViewResult(batchViews, "batch_get_vault_info", [chunk]);

        if (!Array.isArray(results)) {
          throw new CanopyError(
            "Expected vault info batch vector",
            CanopyErrorCode.ViewCallFailed,
            { valueType: typeof results }
          );
        }

        return results.map((result, index) =>
          readMoveOption(result, (value) => readBatchVaultInfo(value, chunk[index] as string))
        );
      },
    });
  }

  async getBatchUserVaultBalances(
    vaultAddresses: string[],
    userAddress: string
  ): Promise<Array<MeridianBatchUserVaultBalance | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map((address) =>
      normalizeMoveAddress(address)
    ) as Array<`0x${string}`>;
    const normalizedUserAddress = normalizeMoveAddress(userAddress);

    return mapAddressBatch(normalizedVaults, {
      label: "user vault balances",
      fetchChunk: async (chunk) => {
        const results = await this.callAbiViewResult(batchViews, "batch_get_user_balances", [
          chunk,
          normalizedUserAddress,
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
            readBatchUserVaultBalance(value, chunk[index] as string)
          )
        );
      },
    });
  }

  async getBatchVaultPositions(
    vaultAddresses: string[]
  ): Promise<Array<MeridianBatchVaultPositions | null>> {
    const batchViews = this.getBatchViewsAbi();
    const normalizedVaults = vaultAddresses.map((address) =>
      normalizeMoveAddress(address)
    ) as Array<`0x${string}`>;

    return mapAddressBatch(normalizedVaults, {
      label: "vault positions",
      fetchChunk: async (chunk) => {
        const results = await this.callAbiViewResult(batchViews, "batch_get_vault_positions", [
          chunk,
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
            vaultAddress: chunk[index] as string,
          }))
        );
      },
    });
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
    functionName: MeridianRegistryViewFunction,
    functionArguments?: unknown[]
  ): Promise<Result> {
    return callAbiView(
      this.context.client,
      this.context.abis.meridianRegistry,
      functionName,
      functionArguments
    );
  }

  private callVaultViewResult<Result = unknown>(
    functionName: MeridianVaultViewFunction,
    functionArguments?: unknown[]
  ): Promise<Result> {
    return callAbiView(
      this.context.client,
      this.context.abis.meridianVault,
      functionName,
      functionArguments
    );
  }

  private callVaultViewFunction<Result extends unknown[] = unknown[]>(
    functionName: MeridianVaultViewFunction,
    functionArguments?: unknown[]
  ): Promise<Result> {
    return callAbiViewFunction(
      this.context.client,
      this.context.abis.meridianVault,
      functionName,
      functionArguments
    );
  }

  private callAbiViewResult<Result = unknown>(
    abi: MoveModuleAbi,
    functionName: MeridianBatchViewFunction,
    functionArguments?: unknown[]
  ): Promise<Result> {
    return callAbiView(this.context.client, abi, functionName, functionArguments);
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
  context: MeridianClientDeps,
  metadataAddress: string
): Promise<number> {
  const decimals = await callSingleViewResult(
    context.client,
    {
      moduleAddress: "0x1",
      moduleName: "fungible_asset",
      functionName: "decimals",
      // `decimals<T: key>(metadata: Object<T>)` is generic, so the type argument is
      // required. Omitting it failed with "Type argument count mismatch, expected 1,
      // received 0" for every vault, which broke getVaultSummary outright.
      typeArguments: ["0x1::fungible_asset::Metadata"],
      functionArguments: [normalizeMoveAddress(metadataAddress)],
    }
  );

  return readMoveU8(decimals);
}
