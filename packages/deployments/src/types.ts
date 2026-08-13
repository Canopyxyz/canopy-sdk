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
  | "curator.vault"
  | "curator.router"
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

/**
 * Curator vault packages. `genericAdapter` intentionally has no `ContractId`:
 * it is not user-facing and has no checked-in ABI, and a `ContractId` without an
 * ABI would make `getContract` always return null. The address is still useful
 * for checking a vault's `strategy_module_address` against the known adapter.
 */
export interface CuratorDeployment {
  vault: HexString;
  router: HexString;
  genericAdapter: HexString;
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
  curator: boolean;
  rewards: boolean;
  almMeridian: boolean;
}

export interface ChainDeployment {
  chain: ChainName;
  chainId: number;
  fullnode: string;
  canopy?: CanopyDeployment;
  curator?: CuratorDeployment;
  rewards?: RewardsDeployment;
  alm?: AlmDeployment;
  sharedPackages?: SharedPackagesDeployment;
  features: DeploymentFeatures;
}

export type ChainDeploymentInput = Omit<ChainDeployment, "fullnode" | "features"> & {
  fullnode?: string;
};
