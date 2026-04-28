import type { ChainDeployment, ChainName } from "./types";

export const CHAINS = {
  MOVEMENT_MAINNET: "movement-mainnet",
  APTOS_MAINNET: "aptos-mainnet",
  APTOS_TESTNET: "aptos-testnet",
} as const satisfies Record<string, ChainName>;

export const CHAIN_IDS = {
  [CHAINS.MOVEMENT_MAINNET]: 126,
  [CHAINS.APTOS_MAINNET]: 1,
  [CHAINS.APTOS_TESTNET]: 2,
} as const satisfies Record<ChainName, number>;

export const FULLNODE_DEFAULTS = {
  [CHAINS.MOVEMENT_MAINNET]: "https://mainnet.movementnetwork.xyz/v1",
  [CHAINS.APTOS_MAINNET]: "https://api.mainnet.aptoslabs.com/v1",
  [CHAINS.APTOS_TESTNET]: "https://api.testnet.aptoslabs.com/v1",
} as const satisfies Record<ChainName, string>;

export const CHAIN_DEFAULTS = Object.fromEntries(
  Object.values(CHAINS).map((chain) => [
    chain,
    {
      chain,
      chainId: CHAIN_IDS[chain],
      fullnode: FULLNODE_DEFAULTS[chain],
    },
  ])
) as Record<ChainName, Pick<ChainDeployment, "chain" | "chainId" | "fullnode">>;
