import type { ChainName } from "./types";

export const CANOPY_REQUIRED = {
  "movement-mainnet": {
    blocks: [
      "echelon",
      "moveposition",
      "layerbank",
      "placeholder",
      "meridianFarming",
      "layerbankAirdrop",
    ],
    strategies: [
      "echelonSimple",
      "movepositionSimple",
      "layerbankSimple",
      "placeholderSimple",
      "meridianRewards",
    ],
  },
  "aptos-mainnet": {
    blocks: [],
    strategies: [],
  },
  "aptos-testnet": {
    blocks: ["echelon", "moveposition", "layerbank", "placeholder"],
    strategies: ["echelonSimple", "movepositionSimple", "layerbankSimple"],
  },
} as const satisfies Record<
  ChainName,
  { blocks: readonly string[]; strategies: readonly string[] }
>;

export const MERIDIAN_REQUIRED_STRATEGIES = ["regularV4"] as const;
