import { aptosMainnetAbis } from "./chains/aptos-mainnet";
import { aptosTestnetAbis } from "./chains/aptos-testnet";
import { movementMainnetAbis } from "./chains/movement-mainnet";
import { movementTestnetAbis } from "./chains/movement-testnet";

export type {
  AbiChainName,
  CanopyAbiSet,
  ChainAbiSet,
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
};

export function getAbisForChain<Chain extends keyof typeof abisByChain>(
  chain: Chain
): (typeof abisByChain)[Chain] {
  return abisByChain[chain];
}
