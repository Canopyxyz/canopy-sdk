import type { ChainName } from "@canopyhub/canopy-sdk-deployments";

export type HexString = `0x${string}`;

export interface MoveModuleAbi {
  address: HexString;
  name: string;
  friends?: string[];
  exposed_functions?: MoveExposedFunction[];
  structs: unknown[];
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

export type FrameworkAbiId =
  | "aptosFrameworkObject"
  | "aptosFrameworkPrimaryFungibleStore"
  | "aptosFrameworkCoin"
  | "aptosFrameworkMultisigAccount";

export interface CanopyAbiSet {
  canopyVault: MoveModuleAbi;
  canopyRouter: MoveModuleAbi;
  canopyRouterDeposit: MoveModuleAbi;
  canopyRouterWithdraw: MoveModuleAbi;
  canopySatay: MoveModuleAbi;
  canopyProtocol: MoveModuleAbi;
  canopyBaseStrategy: MoveModuleAbi;
  canopyHelpers?: MoveModuleAbi;
  canopyRewardsView?: MoveModuleAbi;
  multiRewards: MoveModuleAbi;
  multiRewardsRouter: MoveModuleAbi;
  multiRewardsBatcherView: MoveModuleAbi;
  multiRewardsBatcherEntry: MoveModuleAbi;
  multiRewardsStdViews?: MoveModuleAbi;
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
  meridianBatchViews?: MoveModuleAbi;
  meridianRegularV4?: MoveModuleAbi;
  meridianRegularV4Entry?: MoveModuleAbi;
  meridianMedianStableV2?: MoveModuleAbi;
  meridianMedianStableV2Entry?: MoveModuleAbi;
}

export type AbiChainName = ChainName;

export type ChainAbiSet = {
  "movement-mainnet": FrameworkAbiSet & CanopyAbiSet & MeridianAbiSet;
  "movement-testnet": FrameworkAbiSet;
  "aptos-mainnet": FrameworkAbiSet & MeridianAbiSet; // Canopy is not deployed on Aptos mainnet
  "aptos-testnet": FrameworkAbiSet & CanopyAbiSet; // Meridian is not deployed on Aptos testnet
};
