import VAULT_ABI from "../abis/mainnet/satay_vault.json";
import ROUTER_ABI from "../abis/mainnet/satay_router.json";
import {
  MAINNET_MOVEVEPOSITION_NAMES_MAP,
  MAINNET_MOVEVEPOSITION_VIRTUAL_COIN_MAP,
  NETWORK_TYPES,
  type NetworkType,
} from "../constants";

export interface NetworkConfig {
  vaultModule: string;
  routerModule: string;
  movepositionApiUrl?: string;
  movepositionNameMap?: Record<string, string>;
  movepositionVirtualCoinMap?: Record<string, string>;
}

const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  [NETWORK_TYPES.MOVEMENT_MAINNET]: {
    vaultModule: VAULT_ABI.address,
    routerModule: ROUTER_ABI.address,
    movepositionApiUrl: "https://api.moveposition.xyz",
    movepositionNameMap: MAINNET_MOVEVEPOSITION_NAMES_MAP,
    movepositionVirtualCoinMap: MAINNET_MOVEVEPOSITION_VIRTUAL_COIN_MAP,
  },
};

export function getNetworkConfig(network?: NetworkType): NetworkConfig {
  if (network) {
    const config = NETWORK_CONFIGS[network];
    if (config) {
      return config;
    }
  }

  return NETWORK_CONFIGS[NETWORK_TYPES.MOVEMENT_MAINNET]!;
}

export const VAULT_ADDRESS = VAULT_ABI.address;
export const ROUTER_ADDRESS = ROUTER_ABI.address;
