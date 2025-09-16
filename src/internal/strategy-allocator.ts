import type { Aptos } from "@aptos-labs/ts-sdk";
import DEPOSIT_ABI from "../abis/mainnet/satay_router_deposit.json";
import WITHDRAW_ABI from "../abis/mainnet/satay_router_withdraw.json";
import { CanopyError, CanopyErrorCode } from "../types";

/**
 * Internal allocation map for strategies
 */
export interface AllocationMap {
  strategies: string[];
  amounts: bigint[];
}

export class StrategyAllocator {
  constructor(private aptos: Aptos) {}

  async getOptimalAllocation(
    vaultAddress: string,
    amount: bigint
  ): Promise<AllocationMap> {
    try {
      const [allocationMap] = await this.aptos.view({
        payload: {
          function: `${DEPOSIT_ABI.address}::deposit::get_allocations_view`,
          functionArguments: [vaultAddress, amount.toString()],
        },
      });

      return this.parseAllocationMap(allocationMap);
    } catch (error) {
      throw new CanopyError(
        "Failed to get optimal allocation",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { vaultAddress, amount: amount.toString(), originalError: error }
      );
    }
  }

  /**
   * Gets withdrawal map for vault shares
   */
  async getAllocationMap(
    vaultAddress: string,
    shares: bigint
  ): Promise<AllocationMap> {
    try {
      const [AllocationMap] = await this.aptos.view({
        payload: {
          function: `${WITHDRAW_ABI.address}::withdraw::get_withdrawal_map_view`,
          functionArguments: [vaultAddress, shares.toString()],
        },
      });

      return this.parseAllocationMap(AllocationMap);
    } catch (error) {
      throw new CanopyError(
        "Failed to get withdrawal map",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { vaultAddress, shares: shares.toString(), originalError: error }
      );
    }
  }

  /**
   * Validates that allocations are reasonable
   * Prevents obvious errors before transaction submission
   */
  validateAllocation(allocation: AllocationMap, totalAmount: bigint): void {
    if (allocation.strategies.length === 0) {
      throw new CanopyError(
        "No strategies available for allocation",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { totalAmount: totalAmount.toString() }
      );
    }

    if (allocation.strategies.length !== allocation.amounts.length) {
      throw new CanopyError(
        "Mismatched strategies and amounts",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED
      );
    }

    const allocatedTotal = allocation.amounts.reduce(
      (sum, amount) => sum + amount,
      0n
    );

    // Allow some tolerance for rounding in Move calculations
    const tolerance = totalAmount / 1000n; // 0.1% tolerance
    const diff =
      allocatedTotal > totalAmount
        ? allocatedTotal - totalAmount
        : totalAmount - allocatedTotal;

    if (diff > tolerance) {
      throw new CanopyError(
        "Allocation total does not match deposit amount",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        {
          expectedTotal: totalAmount.toString(),
          allocatedTotal: allocatedTotal.toString(),
          difference: diff.toString(),
        }
      );
    }
  }

  /**
   * Parses allocation map from Move SimpleMap format
   */
  private parseAllocationMap(allocationMap: any): AllocationMap {
    const strategies: string[] = [];
    const amounts: bigint[] = [];

    try {
      if (allocationMap && typeof allocationMap === "object") {
        if (allocationMap.data) {
          for (const entry of allocationMap.data) {
            if (entry.key && entry.value) {
              strategies.push(String(entry.key.inner));
              amounts.push(BigInt(entry.value));
            }
          }
        } else if (Array.isArray(allocationMap)) {
          for (const [strategy, amount] of allocationMap) {
            strategies.push(String(strategy));
            amounts.push(BigInt(amount));
          }
        }
      }

      const filtered = this.filterZeroAllocations(strategies, amounts);

      return {
        strategies: filtered.strategies,
        amounts: filtered.amounts,
      };
    } catch (error) {
      throw new CanopyError(
        "Failed to parse allocation map",
        CanopyErrorCode.TRANSACTION_BUILD_FAILED,
        { originalError: error, rawData: allocationMap }
      );
    }
  }

  /**
   * Filters out strategies with zero allocation/withdrawal amounts
   */
  private filterZeroAllocations(
    strategies: string[],
    amounts: bigint[]
  ): {
    strategies: string[];
    amounts: bigint[];
  } {
    const filteredStrategies: string[] = [];
    const filteredAmounts: bigint[] = [];

    for (let i = 0; i < strategies.length && i < amounts.length; i++) {
      const amount = amounts[i];
      const strategy = strategies[i];
      if (amount && strategy && amount > 0n) {
        filteredStrategies.push(strategy);
        filteredAmounts.push(amount);
      }
    }

    return {
      strategies: filteredStrategies,
      amounts: filteredAmounts,
    };
  }
}
