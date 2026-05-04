import type { AbiChainName, ChainAbiSet } from "./types";
import { aptosMainnetAbis } from "./chains/aptos-mainnet";
import { aptosTestnetAbis } from "./chains/aptos-testnet";
import { movementMainnetAbis } from "./chains/movement-mainnet";
import { movementTestnetAbis } from "./chains/movement-testnet";

export type {
  AbiChainName,
  CanopyAbiSet,
  ChainAbiSet,
  FrameworkAbiId,
  FrameworkAbiSet,
  MeridianAbiSet,
  MoveExposedFunction,
  MoveModuleAbi,
} from "./types";

export { aptosMainnetAbis, aptosTestnetAbis, movementMainnetAbis, movementTestnetAbis };

export const abisByChain = {
  "movement-mainnet": movementMainnetAbis,
  "movement-testnet": movementTestnetAbis,
  "aptos-mainnet": aptosMainnetAbis,
  "aptos-testnet": aptosTestnetAbis,
} as const satisfies ChainAbiSet;

export function getAbisForChain<Chain extends AbiChainName>(
  chain: Chain
): ChainAbiSet[Chain] {
  const abis = abisByChain[chain];

  if (abis === undefined) {
    throw new Error(
      `Unknown chain "${chain}". Supported ABI chains: ${Object.keys(abisByChain).join(", ")}`
    );
  }

  return abis as ChainAbiSet[Chain];
}

export * from "./contracts";
