export type ChainName =
  | "movement-mainnet"
  | "movement-testnet"
  | "aptos-mainnet"
  | "aptos-testnet";

export type HexString = `0x${string}`;

export type ContractId =
  | "canopy.core"
  | "canopy.vault"
  | "canopy.router"
  | "canopy.satay"
  | "canopy.protocol"
  | "canopy.baseStrategy"
  | "canopy.strategy.echelonSimple"
  | "canopy.strategy.layerbankSimple"
  | "canopy.strategy.movepositionSimple"
  | "canopy.strategy.placeholderSimple"
  | "canopy.strategy.meridianRewards"
  | "rewards.module"
  | "rewards.router"
  | "rewards.batcher"
  | "meridian.router"
  | "meridian.vault"
  | "meridian.registry"
  | "meridian.strategy.regularV4"
  | "meridian.strategy.regularV4Entry"
  | "meridian.strategy.medianStableV2"
  | "meridian.strategy.medianStableV2Entry";

export interface StrategyDeploymentMap {
  [strategyName: string]: HexString;
}

export interface CanopyDeployment {
  core: HexString;
  router: HexString;
  blocks?: StrategyDeploymentMap;
  strategies: StrategyDeploymentMap;
  helpers?: HexString;
  views?: HexString;
}

export interface RewardsDeployment {
  module: HexString;
  router: HexString;
  batcher?: HexString;
  stdBatcher?: HexString;
}

export interface MeridianAlmDeployment {
  vaults: HexString;
  standard: HexString;
  registry: HexString;
  batchViews?: HexString;
  strategies: StrategyDeploymentMap;
}

export interface AlmDeployment {
  meridian?: MeridianAlmDeployment;
}

export interface SharedPackagesDeployment {
  largePackages?: HexString;
}

export interface DeploymentFeatures {
  canopy: boolean;
  rewards: boolean;
  almMeridian: boolean;
}

export interface ChainDeployment {
  chain: ChainName;
  chainId: number;
  fullnode: string;
  canopy?: CanopyDeployment;
  rewards?: RewardsDeployment;
  alm?: AlmDeployment;
  sharedPackages?: SharedPackagesDeployment;
  features: DeploymentFeatures;
}

export type ChainDeploymentInput = Omit<ChainDeployment, "fullnode" | "features"> & {
  fullnode?: string;
};
