import { movementMainnetAbis } from "../../packages/bindings/src";
import { getDeployment } from "../../packages/deployments/src";
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

const MOVEMENT_MAINNET_DEPLOYMENT = getDeployment("movement-mainnet");
const VAULT_ADDRESS =
  MOVEMENT_MAINNET_DEPLOYMENT.canopy?.core ??
  movementMainnetAbis.canopyVault.address;
const ROUTER_ADDRESS =
  MOVEMENT_MAINNET_DEPLOYMENT.canopy?.router ??
  movementMainnetAbis.canopyRouter.address;

const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  [NETWORK_TYPES.MOVEMENT_MAINNET]: {
    vaultModule: VAULT_ADDRESS,
    routerModule: ROUTER_ADDRESS,
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

export { ROUTER_ADDRESS, VAULT_ADDRESS };
