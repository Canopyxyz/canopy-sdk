export type ChainName = "movement-mainnet" | "aptos-mainnet" | "aptos-testnet";

export interface StrategyDeploymentMap {
  [strategyName: string]: string;
}

export interface CanopyDeployment {
  core: string;
  router: string;
  blocks?: StrategyDeploymentMap;
  strategies: StrategyDeploymentMap;
  helpers?: string;
  views?: string;
}

export interface RewardsDeployment {
  module: string;
  router: string;
  batcher?: string;
  stdBatcher?: string;
}

export interface MeridianAlmDeployment {
  vaults: string;
  standard: string;
  registry: string;
  strategies: StrategyDeploymentMap;
}

export interface AlmDeployment {
  meridian?: MeridianAlmDeployment;
}

export interface SharedPackagesDeployment {
  largePackages?: string;
}

export interface DeploymentFeatures {
  canopy?: boolean;
  rewards?: boolean;
  almMeridian?: boolean;
}

export interface ChainDeployment {
  chain: ChainName;
  chainId: number;
  fullnode: string;
  canopy?: CanopyDeployment;
  rewards?: RewardsDeployment;
  alm?: AlmDeployment;
  sharedPackages?: SharedPackagesDeployment;
  features?: DeploymentFeatures;
}

export type ChainDeploymentInput = Omit<ChainDeployment, "fullnode"> & {
  fullnode?: string;
};
