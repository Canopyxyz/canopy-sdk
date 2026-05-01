import {
  callSingleViewResult,
  callViewFunction,
  entryFunctionPayload,
  moveUintArgument,
  normalizeMoveAddress,
} from "@canopyhub/canopy-sdk/core";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveU128,
  readMoveU64,
} from "../../internal/move-readers";
import type { SdkContext, TransactionPayload } from "../../types";
import type {
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

    return {
      depositAssetAddress: readMoveAddress(depositAndQuoteAssets[0]),
      depositIsAsset0: Boolean(depositIsAsset0),
      quoteAssetAddress: readMoveAddress(depositAndQuoteAssets[1]),
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
}
