export interface MoveModuleAbi {
  address: string;
  name: string;
  friends?: string[];
  exposed_functions?: MoveExposedFunction[];
  structs?: unknown[];
}

export interface MoveExposedFunction {
  name: string;
  visibility: "public" | "friend" | "private";
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: unknown[];
  params: string[];
  return: string[];
}

export interface FrameworkAbiSet {
  aptosFrameworkObject: MoveModuleAbi;
  aptosFrameworkPrimaryFungibleStore: MoveModuleAbi;
  aptosFrameworkCoin: MoveModuleAbi;
  aptosFrameworkMultisigAccount: MoveModuleAbi;
}

export interface CanopyAbiSet {
  canopyVault: MoveModuleAbi;
  canopyRouter: MoveModuleAbi;
  canopyRouterDeposit: MoveModuleAbi;
  canopyRouterWithdraw: MoveModuleAbi;
  multiRewards: MoveModuleAbi;
  multiRewardsRouter: MoveModuleAbi;
  multiRewardsBatcherView: MoveModuleAbi;
  multiRewardsBatcherEntry: MoveModuleAbi;
  multiRewardsStdViews: MoveModuleAbi;
  canopyStrategyEchelonSimple?: MoveModuleAbi;
  canopyStrategyMovepositionSimple?: MoveModuleAbi;
  canopyStrategyMovepositionTicket?: MoveModuleAbi;
  canopyStrategyLayerbankSimple?: MoveModuleAbi;
  canopyStrategyPlaceholderSimple?: MoveModuleAbi;
  canopyStrategyMeridianRewards?: MoveModuleAbi;
}

export interface MeridianAbiSet {
  meridianRouter: MoveModuleAbi;
  meridianVault: MoveModuleAbi;
  meridianRegistry: MoveModuleAbi;
  meridianRegularV4?: MoveModuleAbi;
  meridianRegularV4Entry?: MoveModuleAbi;
  meridianMedianStableV2?: MoveModuleAbi;
  meridianMedianStableV2Entry?: MoveModuleAbi;
}

export type AbiChainName = "movement-mainnet" | "aptos-mainnet" | "aptos-testnet";

export type ChainAbiSet = {
  "movement-mainnet": FrameworkAbiSet & CanopyAbiSet & MeridianAbiSet;
  "aptos-mainnet": FrameworkAbiSet & MeridianAbiSet; // Canopy is not deployed on Aptos mainnet
  "aptos-testnet": FrameworkAbiSet & CanopyAbiSet; // Meridian is not deployed on Aptos testnet
};
