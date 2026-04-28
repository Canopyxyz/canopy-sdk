import { aptosMainnetAbis } from "./chains/aptos-mainnet";
import { aptosTestnetAbis } from "./chains/aptos-testnet";
import { movementMainnetAbis } from "./chains/movement-mainnet";
import type { AbiChainName, ChainAbiSet } from "./types";

export type {
  AbiChainName,
  CanopyAbiSet,
  ChainAbiSet,
  FrameworkAbiSet,
  MeridianAbiSet,
  MoveExposedFunction,
  MoveModuleAbi,
} from "./types";

export { aptosMainnetAbis, aptosTestnetAbis, movementMainnetAbis };

export const abisByChain = {
  "movement-mainnet": movementMainnetAbis,
  "aptos-mainnet": aptosMainnetAbis,
  "aptos-testnet": aptosTestnetAbis,
} as const satisfies ChainAbiSet;

export function getAbisForChain<Chain extends AbiChainName>(
  chain: Chain
): ChainAbiSet[Chain] {
  return abisByChain[chain];
}
