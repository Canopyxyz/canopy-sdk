import { createEntryPayload } from "@thalalabs/surf";
import {
  CanopyError,
  CanopyErrorCode,
  callSingleViewPayloadResult,
  callViewPayloadFunction,
  moveUintArgument,
  normalizeMoveAddress,
  normalizeMoveTypeTag,
  viewFunctionPayload,
} from "@canopyhub/canopy-sdk/core";
import type { SdkContext, TransactionPayload } from "../types";
import {
  readMoveAddress,
  readMoveAddressVector,
  readMoveU8,
  readMoveBool,
  readMoveString,
  readMoveU64,
} from "../internal/move-readers";
import { buildMovePositionPackets } from "./moveposition";
import type {
  CanopyBatchMetadataBalance,
  CanopyBatchVaultAllMetadataBalance,
  CanopyBatchVaultBalance,
  CanopyBatchVaultMetadataBalance,
  CanopyStrategyDetails,
  CanopyUserVaultPosition,
  CanopyVaultAllocation,
  CanopyDepositPayloadInput,
  CanopyVaultStrategyView,
  CanopyVaultView,
  CanopyWithdrawPayloadInput,
  PaginatedCanopyVaults,
  UnstakeAndWithdrawInput,
  UnstakeAndWithdrawPlan,
} from "./types";
import {
  createSurfViewFunctionPayload,
  type SurfViewFunctionArguments,
  type SurfViewFunctionName,
} from "../internal/surf";

export interface ListCanopyVaultsInput {
  limit?: bigint | number;
  offset?: bigint | number;
}

const ALLOCATION_TOLERANCE_BPS = 10n; // 0.1%

export class CanopyProtocolClient {
  constructor(private readonly context: SdkContext<"movement-mainnet" | "aptos-testnet">) {}

  async getVault(vaultAddress: string): Promise<CanopyVaultView> {
    const rawVault = await this.callCanopyVaultViewResult("vault_view", [
      normalizeMoveAddress(vaultAddress),
    ]);

    return parseCanopyVaultView(rawVault);
  }

  async listVaults(input: ListCanopyVaultsInput = {}): Promise<PaginatedCanopyVaults> {
    const offset = input.offset ?? 0;
    const limit = input.limit ?? 50;
    const rawVaults = await this.callCanopyVaultViewResult("vaults_view", [
      moveUintArgument(offset),
      moveUintArgument(limit),
    ]);

    return parsePaginatedVaults(rawVaults);
  }

  async buildDepositPayload(
    input: CanopyDepositPayloadInput
  ): Promise<TransactionPayload> {
    const vault = await this.getVault(input.vaultAddress);
    const packetArguments = await getPacketArguments(
      this.context,
      vault,
      "deposit",
      input.amount
    );

    if (vault.pairedCoinType) {
      return createEntryPayload(this.context.abis.canopyRouter, {
        function: "deposit_coin",
        typeArguments: [vault.pairedCoinType, vault.pairedCoinType],
        functionArguments: [
          normalizeMoveAddress(input.vaultAddress),
          packetArguments.packetStrategies,
          packetArguments.packetData,
          moveUintArgument(input.amount),
          input.minSharesOut !== undefined ? moveUintArgument(input.minSharesOut) : undefined,
        ],
      });
    }

    const faDepositFunction:
      | { functionName: "deposit_fa"; typeArguments: string[] }
      | { functionName: "deposit_fa_with_coin_type"; typeArguments: [string] } =
      hasRouterFunction(this.context, "deposit_fa")
      ? packetArguments.packetStrategies.length === 0
        ? {
              functionName: "deposit_fa",
              typeArguments: [],
            }
        : hasRouterFunction(this.context, "deposit_fa_with_coin_type")
          ? {
              functionName: "deposit_fa_with_coin_type",
              typeArguments: [input.wrapperCoinType ?? "0x1::aptos_coin::AptosCoin"],
            }
          : {
              functionName: "deposit_fa",
              typeArguments: [] as string[],
            }
      : {
          functionName: "deposit_fa_with_coin_type",
          typeArguments: [input.wrapperCoinType ?? "0x1::aptos_coin::AptosCoin"],
        };

    return createEntryPayload(this.context.abis.canopyRouter, {
      function: faDepositFunction.functionName as never,
      typeArguments: faDepositFunction.typeArguments as never,
      functionArguments: [
        normalizeMoveAddress(input.vaultAddress),
        packetArguments.packetStrategies,
        packetArguments.packetData,
        moveUintArgument(input.amount),
        input.minSharesOut !== undefined ? moveUintArgument(input.minSharesOut) : undefined,
      ] as never,
    });
  }

  async buildWithdrawPayload(
    input: CanopyWithdrawPayloadInput
  ): Promise<TransactionPayload> {
    const vault = await this.getVault(input.vaultAddress);
    return this.buildWithdrawPayloadForVault(vault, input);
  }

  private async buildWithdrawPayloadForVault(
    vault: CanopyVaultView,
    input: CanopyWithdrawPayloadInput
  ): Promise<TransactionPayload> {
    const packetArguments = await getPacketArguments(
      this.context,
      vault,
      "withdraw",
      input.shares
    );

    if (vault.pairedCoinType) {
      return createEntryPayload(this.context.abis.canopyRouter, {
        function: "withdraw_coin",
        typeArguments: [vault.pairedCoinType, vault.pairedCoinType],
        functionArguments: [
          normalizeMoveAddress(input.vaultAddress),
          packetArguments.packetStrategies,
          packetArguments.packetData,
          moveUintArgument(input.shares),
          input.maxLossBps !== undefined ? moveUintArgument(input.maxLossBps) : undefined,
          input.minAmountOut !== undefined ? moveUintArgument(input.minAmountOut) : undefined,
        ],
      });
    }

    const faWithdrawFunction:
      | { functionName: "withdraw_fa"; typeArguments: string[] }
      | { functionName: "withdraw_fa_with_coin_type"; typeArguments: [string] } =
      hasRouterFunction(this.context, "withdraw_fa")
      ? packetArguments.packetStrategies.length === 0
        ? {
            functionName: "withdraw_fa",
            typeArguments: [],
          }
        : hasRouterFunction(this.context, "withdraw_fa_with_coin_type")
          ? {
              functionName: "withdraw_fa_with_coin_type",
              typeArguments: [input.wrapperCoinType ?? "0x1::aptos_coin::AptosCoin"],
            }
          : {
              functionName: "withdraw_fa",
              typeArguments: [] as string[],
            }
      : {
          functionName: "withdraw_fa_with_coin_type",
          typeArguments: [input.wrapperCoinType ?? "0x1::aptos_coin::AptosCoin"],
        };

    return createEntryPayload(this.context.abis.canopyRouter, {
      function: faWithdrawFunction.functionName as never,
      typeArguments: faWithdrawFunction.typeArguments as never,
      functionArguments: [
        normalizeMoveAddress(input.vaultAddress),
        packetArguments.packetStrategies,
        packetArguments.packetData,
        moveUintArgument(input.shares),
        input.maxLossBps !== undefined ? moveUintArgument(input.maxLossBps) : undefined,
        input.minAmountOut !== undefined ? moveUintArgument(input.minAmountOut) : undefined,
      ] as never,
    });
  }

  async unstakeAndWithdraw(
    input: UnstakeAndWithdrawInput
  ): Promise<UnstakeAndWithdrawPlan> {
    if (input.walletShares < 0n || input.stakedShares < 0n || input.shares <= 0n) {
      throw new CanopyError(
        "Share amounts must be non-negative, and requested shares must be greater than zero",
        CanopyErrorCode.TransactionBuildFailed,
        { input }
      );
    }

    const totalAvailable = input.walletShares + input.stakedShares;
    if (totalAvailable < input.shares) {
      throw new CanopyError(
        "Insufficient total shares to withdraw requested amount",
        CanopyErrorCode.TransactionBuildFailed,
        {
          requestedShares: input.shares.toString(),
          stakedShares: input.stakedShares.toString(),
          walletShares: input.walletShares.toString(),
        }
      );
    }

    const unstakeAmount =
      input.walletShares >= input.shares ? 0n : input.shares - input.walletShares;
    const vault = await this.getVault(input.vaultAddress);
    const withdrawPayload = await this.buildWithdrawPayloadForVault(vault, input);

    if (unstakeAmount === 0n) {
      return {
        requiresUnstake: false,
        unstakeAmount: 0n,
        withdrawPayload,
      };
    }

    return {
      requiresUnstake: true,
      unstakeAmount,
      unstakePayload: buildUnstakePayload(this.context, vault.sharesAddress, unstakeAmount),
      withdrawPayload,
    };
  }

  async getUserVaultPosition(
    userAddress: string,
    vaultAddress: string
  ): Promise<CanopyUserVaultPosition> {
    const vault = await this.getVault(vaultAddress);
    const sharesBalance = await callSingleViewPayloadResult(
      this.context.client,
      createSurfViewFunctionPayload(this.context.abis.aptosFrameworkPrimaryFungibleStore, {
        functionName: "balance",
        typeArguments: ["0x1::fungible_asset::Metadata"],
        functionArguments: [
          normalizeMoveAddress(userAddress),
          normalizeMoveAddress(vault.sharesAddress),
        ],
      })
    );

    const parsedSharesBalance = readMoveU64(sharesBalance);
    const assetValue =
      parsedSharesBalance > 0n
        ? readMoveU64(
            await this.callCanopyVaultViewResult("shares_to_amount", [
              normalizeMoveAddress(vaultAddress),
              moveUintArgument(parsedSharesBalance),
            ])
          )
        : 0n;

    return {
      assetValue,
      sharesBalance: parsedSharesBalance,
      userAddress: normalizeMoveAddress(userAddress),
      vaultAddress: normalizeMoveAddress(vaultAddress),
    };
  }

  async getBatchFungibleAssetBalances(
    metadataAddresses: string[],
    userAddress: string
  ): Promise<CanopyBatchMetadataBalance[]> {
    const helpers = this.getHelpersAbi();
    const normalizedMetadata = metadataAddresses.map((address) => normalizeMoveAddress(address));
    const balances = await this.callHelpersViewResult("batch_get_fa_balance", [
      normalizedMetadata,
      normalizeMoveAddress(userAddress),
    ]);

    return zipMetadataBalances(
      normalizedMetadata,
      readMoveU64Vector(balances),
      "fungible asset metadata"
    );
  }

  async getBatchVaultSharesBalances(
    vaultAddresses: string[],
    userAddress: string
  ): Promise<CanopyBatchVaultBalance[]> {
    const helpers = this.getHelpersAbi();
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const balances = await this.callHelpersViewResult("batch_get_vault_balance", [
      normalizedVaults,
      normalizeMoveAddress(userAddress),
    ]);

    return zipVaultBalances(normalizedVaults, readMoveU64Vector(balances), "vault balances");
  }

  async getBatchVaultBaseMetadataAndBalances(
    vaultAddresses: string[],
    userAddress: string
  ): Promise<CanopyBatchVaultMetadataBalance[]> {
    const helpers = this.getHelpersAbi();
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const [metadata, balances] = await this.callHelpersViewFunction<[unknown, unknown]>(
      "batch_get_vault_base_metadata_and_balance",
      [normalizedVaults, normalizeMoveAddress(userAddress)]
    );

    return zipVaultMetadataBalances(
      normalizedVaults,
      readMoveAddressVector(metadata),
      readMoveU64Vector(balances),
      "vault base metadata and balances"
    );
  }

  async getBatchVaultSharesMetadataAndBalances(
    vaultAddresses: string[],
    userAddress: string
  ): Promise<CanopyBatchVaultMetadataBalance[]> {
    const helpers = this.getHelpersAbi();
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const [metadata, balances] = await this.callHelpersViewFunction<[unknown, unknown]>(
      "batch_get_vault_shares_metadata_and_balance",
      [normalizedVaults, normalizeMoveAddress(userAddress)]
    );

    return zipVaultMetadataBalances(
      normalizedVaults,
      readMoveAddressVector(metadata),
      readMoveU64Vector(balances),
      "vault shares metadata and balances"
    );
  }

  async getBatchVaultAllMetadataAndBalances(
    vaultAddresses: string[],
    userAddress: string
  ): Promise<CanopyBatchVaultAllMetadataBalance[]> {
    const helpers = this.getHelpersAbi();
    const normalizedVaults = vaultAddresses.map((address) => normalizeMoveAddress(address));
    const [sharesMetadata, sharesBalances, baseMetadata, baseBalances] =
      await this.callHelpersViewFunction<[unknown, unknown, unknown, unknown]>(
        "batch_get_vault_all_metadata_and_balance",
        [normalizedVaults, normalizeMoveAddress(userAddress)]
      );

    return zipVaultAllMetadataBalances(
      normalizedVaults,
      readMoveAddressVector(baseMetadata),
      readMoveU64Vector(baseBalances),
      readMoveAddressVector(sharesMetadata),
      readMoveU64Vector(sharesBalances)
    );
  }

  async getStrategyDetails(
    vaultAddress: string,
    strategyAddress: string
  ): Promise<CanopyStrategyDetails> {
    const normalizedVault = normalizeMoveAddress(vaultAddress);
    const normalizedStrategy = normalizeMoveAddress(strategyAddress);

    const [debt, debtLimit, lastReport, totalProfit, totalLoss, sharesBalance] =
      await Promise.all([
        this.callCanopyVaultViewResult("strategy_debt", [normalizedVault, normalizedStrategy]),
        this.callCanopyVaultViewResult("strategy_debt_limit", [
          normalizedVault,
          normalizedStrategy,
        ]),
        this.callCanopyVaultViewResult("strategy_last_report", [
          normalizedVault,
          normalizedStrategy,
        ]),
        this.callCanopyVaultViewResult("strategy_total_profit", [
          normalizedVault,
          normalizedStrategy,
        ]),
        this.callCanopyVaultViewResult("strategy_total_loss", [
          normalizedVault,
          normalizedStrategy,
        ]),
        callSingleViewPayloadResult(
          this.context.client,
          // The on-chain ABI marks this function as non-view, but the chain still accepts it
          // through the view endpoint, so we intentionally bypass Surf's view-only guard here.
          viewFunctionPayload({
            moduleAddress: this.context.abis.canopyVault.address,
            moduleName: this.context.abis.canopyVault.name,
            functionName: "get_strategy_shares_balance",
            functionArguments: [normalizedVault, normalizedStrategy],
          })
        ),
      ]);

    return {
      debt: readMoveU64(debt),
      debtLimit: readMoveU64(debtLimit),
      lastReport: readMoveU64(lastReport),
      sharesBalance: readMoveU64(sharesBalance),
      strategyAddress: normalizedStrategy,
      totalLoss: readMoveU64(totalLoss),
      totalProfit: readMoveU64(totalProfit),
      vaultAddress: normalizedVault,
    };
  }

  async getVaultAllocation(input: {
    amount: bigint;
    operation: "deposit" | "withdraw";
    vaultAddress: string;
  }): Promise<CanopyVaultAllocation> {
    const allocation = await getAllocationMap(
      this.context,
      input.operation,
      input.vaultAddress,
      input.amount
    );

    return {
      ...allocation,
      operation: input.operation,
      requestedAmount: input.amount,
      vaultAddress: normalizeMoveAddress(input.vaultAddress),
    };
  }

  private getHelpersAbi() {
    const abi =
      "canopyHelpers" in this.context.abis ? this.context.abis.canopyHelpers : undefined;

    if (!abi) {
      throw new CanopyError(
        "Canopy helper views are not available on this chain",
        CanopyErrorCode.InvalidDeployment,
        { chain: this.context.chain }
      );
    }

    return abi;
  }

  private callCanopyVaultViewResult<Result = unknown>(
    functionName: SurfViewFunctionName<typeof this.context.abis.canopyVault>,
    functionArguments?: SurfViewFunctionArguments<
      typeof this.context.abis.canopyVault,
      typeof functionName
    >
  ): Promise<Result> {
    return callSingleViewPayloadResult(
      this.context.client,
      createSurfViewFunctionPayload(this.context.abis.canopyVault, {
        functionName,
        ...(functionArguments ? { functionArguments } : {}),
      })
    );
  }

  private callHelpersViewResult<Result = unknown>(
    functionName: SurfViewFunctionName<ReturnType<CanopyProtocolClient["getHelpersAbi"]>>,
    functionArguments?: SurfViewFunctionArguments<
      ReturnType<CanopyProtocolClient["getHelpersAbi"]>,
      typeof functionName
    >
  ): Promise<Result> {
    return callSingleViewPayloadResult(
      this.context.client,
      createSurfViewFunctionPayload(this.getHelpersAbi(), {
        functionName,
        ...(functionArguments ? { functionArguments } : {}),
      })
    );
  }

  private callHelpersViewFunction<Result extends unknown[] = unknown[]>(
    functionName: SurfViewFunctionName<ReturnType<CanopyProtocolClient["getHelpersAbi"]>>,
    functionArguments?: SurfViewFunctionArguments<
      ReturnType<CanopyProtocolClient["getHelpersAbi"]>,
      typeof functionName
    >
  ): Promise<Result> {
    return callViewPayloadFunction(
      this.context.client,
      createSurfViewFunctionPayload(this.getHelpersAbi(), {
        functionName,
        ...(functionArguments ? { functionArguments } : {}),
      })
    );
  }
}

function readMoveU64Vector(value: unknown): bigint[] {
  if (!Array.isArray(value)) {
    throw new CanopyError("Expected Move u64 vector", CanopyErrorCode.ViewCallFailed, {
      valueType: typeof value,
    });
  }

  return value.map(readMoveU64);
}

function zipMetadataBalances(
  metadataAddresses: string[],
  balances: bigint[],
  label: string
): CanopyBatchMetadataBalance[] {
  assertParallelVectorLengths([metadataAddresses, balances], label);

  return metadataAddresses.map((metadataAddress, index) => ({
    metadataAddress,
    balance: balances[index] as bigint,
  }));
}

function zipVaultBalances(
  vaultAddresses: string[],
  balances: bigint[],
  label: string
): CanopyBatchVaultBalance[] {
  assertParallelVectorLengths([vaultAddresses, balances], label);

  return vaultAddresses.map((vaultAddress, index) => ({
    vaultAddress,
    balance: balances[index] as bigint,
  }));
}

function zipVaultMetadataBalances(
  vaultAddresses: string[],
  metadataAddresses: string[],
  balances: bigint[],
  label: string
): CanopyBatchVaultMetadataBalance[] {
  assertParallelVectorLengths([vaultAddresses, metadataAddresses, balances], label);

  return vaultAddresses.map((vaultAddress, index) => ({
    vaultAddress,
    metadataAddress: metadataAddresses[index] as string,
    balance: balances[index] as bigint,
  }));
}

function zipVaultAllMetadataBalances(
  vaultAddresses: string[],
  baseMetadataAddresses: string[],
  baseBalances: bigint[],
  sharesMetadataAddresses: string[],
  sharesBalances: bigint[]
): CanopyBatchVaultAllMetadataBalance[] {
  assertParallelVectorLengths(
    [
      vaultAddresses,
      baseMetadataAddresses,
      baseBalances,
      sharesMetadataAddresses,
      sharesBalances,
    ],
    "vault base/share metadata and balances"
  );

  return vaultAddresses.map((vaultAddress, index) => ({
    vaultAddress,
    baseMetadataAddress: baseMetadataAddresses[index] as string,
    baseBalance: baseBalances[index] as bigint,
    sharesMetadataAddress: sharesMetadataAddresses[index] as string,
    sharesBalance: sharesBalances[index] as bigint,
  }));
}

function assertParallelVectorLengths(vectors: Array<{ length: number }>, label: string): void {
  const expectedLength = vectors[0]?.length ?? 0;

  if (vectors.some((vector) => vector.length !== expectedLength)) {
    throw new CanopyError(
      `Expected ${label} vectors to have matching lengths`,
      CanopyErrorCode.ViewCallFailed,
      { lengths: Array.from(vectors, (vector) => vector.length) }
    );
  }
}

function buildUnstakePayload(
  context: SdkContext<"movement-mainnet" | "aptos-testnet">,
  stakingAsset: string,
  amount: bigint
): TransactionPayload {
  return createEntryPayload(context.abis.multiRewards, {
    function: "withdraw",
    typeArguments: [],
    functionArguments: [normalizeMoveAddress(stakingAsset), moveUintArgument(amount)],
  });
}

function parseCanopyVaultView(rawView: unknown): CanopyVaultView {
  const view = rawView as Record<string, unknown>;
  const rawPairedCoinType = readOptionalNestedString(view.paired_coin_type);
  const pairedCoinType = rawPairedCoinType ? normalizeMoveTypeTag(rawPairedCoinType) : undefined;

  return {
    assetAddress: readMoveAddress(view.asset_address),
    assetName: readMoveString(view.asset_name),
    decimals: readMoveU8(view.decimals),
    ...(pairedCoinType ? { pairedCoinType } : {}),
    sharesAddress: readMoveAddress(view.shares_address),
    sharesName: readMoveString(view.shares_name),
    strategies: parseStrategies(view.strategies),
    totalAsset: readMoveU64(view.total_asset),
    totalDebt: readMoveU64(view.total_debt),
    totalIdle: readMoveU64(view.total_idle),
    totalShares: readMoveU64(view.total_shares),
    vaultAddress: readMoveAddress(view.vault_address),
  };
}

function parseStrategies(rawStrategies: unknown): CanopyVaultStrategyView[] {
  if (!Array.isArray(rawStrategies)) {
    return [];
  }

  return rawStrategies.map((strategy) => {
    const view = strategy as Record<string, unknown>;
    return {
      assetAddress: readMoveAddress(view.asset_address),
      concreteAddress: readMoveAddress(view.concrete_address),
      currentVaultDebt: readMoveU64(view.current_vault_debt),
      debtLimit: readMoveU64(view.debt_limit),
      decimals: readMoveU8(view.decimals),
      lastReport: readMoveU64(view.last_report),
      sharesAddress: readMoveAddress(view.shares_address),
      strategyAddress: readMoveAddress(view.strategy_address),
      totalAsset: readMoveU64(view.total_asset),
      totalDebt: readMoveU64(view.total_debt),
      totalIdle: readMoveU64(view.total_idle),
      totalLoss: readMoveU64(view.total_loss),
      totalProfit: readMoveU64(view.total_profit),
      totalShares: readMoveU64(view.total_shares),
      vaultAddress: readMoveAddress(view.vault_address),
    };
  });
}

function parsePaginatedVaults(rawVaults: unknown): PaginatedCanopyVaults {
  const page = rawVaults as Record<string, unknown>;
  return {
    limit: Number(readMoveU64(page.limit)),
    offset: Number(readMoveU64(page.offset)),
    totalCount: Number(readMoveU64(page.total_count)),
    vaults: Array.isArray(page.vaults)
      ? page.vaults.map((vault) => parseCanopyVaultView(vault))
      : [],
  };
}

function readOptionalNestedString(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const vec = (value as { vec?: unknown[] }).vec;
  const first = Array.isArray(vec) ? vec[0] : undefined;
  return first === undefined ? undefined : readMoveString(first);
}

async function getPacketArguments(
  context: SdkContext<"movement-mainnet" | "aptos-testnet">,
  vault: CanopyVaultView,
  operation: "deposit" | "withdraw",
  amount: bigint
): Promise<{ packetData: Uint8Array[]; packetStrategies: Array<`0x${string}`> }> {
  const movePositionStrategy = context.deployment.canopy?.strategies.movepositionSimple;
  if (!movePositionStrategy) {
    return { packetData: [], packetStrategies: [] };
  }

  const requiresPackets = vault.strategies.some(
    (strategy) => strategy.concreteAddress === normalizeMoveAddress(movePositionStrategy)
  );

  if (!requiresPackets) {
    return { packetData: [], packetStrategies: [] };
  }

  const allocation = await getAllocationMap(
    context,
    operation,
    vault.vaultAddress,
    amount
  );

  if (operation === "deposit") {
    validateAllocation(allocation, amount);
  }

  return buildMovePositionPackets(context, vault, allocation, operation);
}

function hasRouterFunction(
  context: SdkContext<"movement-mainnet" | "aptos-testnet">,
  functionName: string
): boolean {
  return (
    context.abis.canopyRouter.exposed_functions?.some(
      (fn) => fn.name === functionName && fn.is_entry
    ) ?? false
  );
}

async function getAllocationMap(
  context: SdkContext<"movement-mainnet" | "aptos-testnet">,
  operation: "deposit" | "withdraw",
  vaultAddress: string,
  amount: bigint
): Promise<Pick<CanopyVaultAllocation, "amounts" | "strategies">> {
  const abi =
    operation === "deposit"
      ? context.abis.canopyRouterDeposit
      : context.abis.canopyRouterWithdraw;
  const functionName =
    operation === "deposit"
      ? "get_allocations_view"
      : "get_withdrawal_map_view";

  const rawMap = await callSingleViewPayloadResult(
    context.client,
    createSurfViewFunctionPayload(abi, {
      functionName,
      functionArguments: [normalizeMoveAddress(vaultAddress), moveUintArgument(amount)],
    })
  );

  return parseAllocationMap(rawMap);
}

function parseAllocationMap(
  rawMap: unknown
): Pick<CanopyVaultAllocation, "amounts" | "strategies"> {
  if (!rawMap || typeof rawMap !== "object") {
    throw new CanopyError(
      "Allocation map response is malformed",
      CanopyErrorCode.ViewCallFailed,
      { valueType: typeof rawMap }
    );
  }

  const entries = (rawMap as { data?: unknown }).data;
  if (!Array.isArray(entries)) {
    throw new CanopyError(
      "Allocation map response is malformed",
      CanopyErrorCode.ViewCallFailed,
      { expected: "data array", valueType: typeof entries }
    );
  }

  const strategies: string[] = [];
  const amounts: bigint[] = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      throw new CanopyError(
        "Allocation map entry has an unexpected shape",
        CanopyErrorCode.ViewCallFailed,
        { entry }
      );
    }

    const record = entry as { key?: unknown; value?: unknown };
    if (record.key === undefined || record.value === undefined) {
      throw new CanopyError(
        "Allocation map entry has an unexpected shape",
        CanopyErrorCode.ViewCallFailed,
        { entry }
      );
    }

    const strategy = readMoveAddress(record.key);
    const value = readMoveU64(record.value);
    if (value > 0n) {
      strategies.push(strategy);
      amounts.push(value);
    }
  }

  return { amounts, strategies };
}

function validateAllocation(
  allocation: Pick<CanopyVaultAllocation, "amounts" | "strategies">,
  totalAmount: bigint
): void {
  if (allocation.strategies.length === 0 || allocation.amounts.length === 0) {
    throw new CanopyError(
      "No strategies available for allocation",
      CanopyErrorCode.TransactionBuildFailed,
      { totalAmount: totalAmount.toString() }
    );
  }

  if (allocation.strategies.length !== allocation.amounts.length) {
    throw new CanopyError(
      "Allocation map strategies and amounts are mismatched",
      CanopyErrorCode.TransactionBuildFailed
    );
  }

  const allocatedTotal = allocation.amounts.reduce((sum, value) => sum + value, 0n);
  const tolerance = (totalAmount * ALLOCATION_TOLERANCE_BPS) / 10_000n;
  const diff =
    allocatedTotal > totalAmount
      ? allocatedTotal - totalAmount
      : totalAmount - allocatedTotal;

  if (diff > tolerance) {
    throw new CanopyError(
      "Allocation map does not match requested deposit amount",
      CanopyErrorCode.TransactionBuildFailed,
      {
        allocatedTotal: allocatedTotal.toString(),
        difference: diff.toString(),
        expectedTotal: totalAmount.toString(),
      }
    );
  }
}
