import { ABI as frameworkCoinAbi } from "../../abis/movement-mainnet/aptos_framework_coin";
import { ABI as frameworkMultisigAccountAbi } from "../../abis/movement-mainnet/aptos_framework_multisig_account";
import { ABI as frameworkObjectAbi } from "../../abis/movement-mainnet/aptos_framework_object";
import { ABI as frameworkPrimaryFungibleStoreAbi } from "../../abis/movement-mainnet/aptos_framework_primary_fungible_store";
import { ABI as canopyBaseStrategyAbi } from "../../abis/movement-mainnet/canopy_base_strategy";
import { ABI as canopyProtocolAbi } from "../../abis/movement-mainnet/canopy_protocol";
import { ABI as canopyRouterAbi } from "../../abis/movement-mainnet/canopy_router";
import { ABI as canopyRouterDepositAbi } from "../../abis/movement-mainnet/canopy_router_deposit";
import { ABI as canopyRouterWithdrawAbi } from "../../abis/movement-mainnet/canopy_router_withdraw";
import { ABI as canopyHelpersAbi } from "../../abis/movement-mainnet/canopy_helpers";
import { ABI as canopyRewardsViewAbi } from "../../abis/movement-mainnet/canopy_rewards_view";
import { ABI as canopySatayAbi } from "../../abis/movement-mainnet/canopy_satay";
import { ABI as canopyStrategyEchelonSimpleAbi } from "../../abis/movement-mainnet/canopy_strategy_echelon_simple";
import { ABI as canopyStrategyLayerbankSimpleAbi } from "../../abis/movement-mainnet/canopy_strategy_layerbank_simple";
import { ABI as canopyStrategyMeridianRewardsAbi } from "../../abis/movement-mainnet/canopy_strategy_meridian_rewards";
import { ABI as canopyStrategyMovepositionSimpleAbi } from "../../abis/movement-mainnet/canopy_strategy_moveposition_simple";
import { ABI as canopyStrategyMovepositionTicketAbi } from "../../abis/movement-mainnet/canopy_strategy_moveposition_ticket";
import { ABI as canopyStrategyPlaceholderSimpleAbi } from "../../abis/movement-mainnet/canopy_strategy_placeholder_simple";
import { ABI as meridianBatchViewsAbi } from "../../abis/movement-mainnet/meridian_batch_views";
import { ABI as canopyVaultAbi } from "../../abis/movement-mainnet/canopy_vault";
import { ABI as meridianMedianStableV2Abi } from "../../abis/movement-mainnet/meridian_median_stable_v2";
import { ABI as meridianMedianStableV2EntryAbi } from "../../abis/movement-mainnet/meridian_median_stable_v2_entry";
import { ABI as meridianRegistryAbi } from "../../abis/movement-mainnet/meridian_registry";
import { ABI as meridianRegularV4Abi } from "../../abis/movement-mainnet/meridian_regular_v4";
import { ABI as meridianRegularV4EntryAbi } from "../../abis/movement-mainnet/meridian_regular_v4_entry";
import { ABI as meridianRouterAbi } from "../../abis/movement-mainnet/meridian_router";
import { ABI as meridianVaultAbi } from "../../abis/movement-mainnet/meridian_vault";
import { ABI as multiRewardsAbi } from "../../abis/movement-mainnet/multi_rewards";
import { ABI as multiRewardsBatcherEntryAbi } from "../../abis/movement-mainnet/multi_rewards_batcher_entry";
import { ABI as multiRewardsBatcherViewAbi } from "../../abis/movement-mainnet/multi_rewards_batcher_view";
import { ABI as multiRewardsRouterAbi } from "../../abis/movement-mainnet/multi_rewards_router";
import { ABI as multiRewardsStdViewsAbi } from "../../abis/movement-mainnet/multi_rewards_std_views";
import { defineChainAbis } from "./define-chain-abis";

export const movementMainnetAbis = defineChainAbis("movement-mainnet", {
  aptosFrameworkObject: frameworkObjectAbi,
  aptosFrameworkPrimaryFungibleStore: frameworkPrimaryFungibleStoreAbi,
  aptosFrameworkCoin: frameworkCoinAbi,
  aptosFrameworkMultisigAccount: frameworkMultisigAccountAbi,
  canopyVault: canopyVaultAbi,
  canopyRouter: canopyRouterAbi,
  canopyRouterDeposit: canopyRouterDepositAbi,
  canopyRouterWithdraw: canopyRouterWithdrawAbi,
  canopySatay: canopySatayAbi,
  canopyProtocol: canopyProtocolAbi,
  canopyBaseStrategy: canopyBaseStrategyAbi,
  canopyHelpers: canopyHelpersAbi,
  canopyRewardsView: canopyRewardsViewAbi,
  multiRewards: multiRewardsAbi,
  multiRewardsRouter: multiRewardsRouterAbi,
  multiRewardsBatcherView: multiRewardsBatcherViewAbi,
  multiRewardsBatcherEntry: multiRewardsBatcherEntryAbi,
  multiRewardsStdViews: multiRewardsStdViewsAbi,
  canopyStrategyEchelonSimple: canopyStrategyEchelonSimpleAbi,
  canopyStrategyMovepositionSimple: canopyStrategyMovepositionSimpleAbi,
  canopyStrategyMovepositionTicket: canopyStrategyMovepositionTicketAbi,
  canopyStrategyLayerbankSimple: canopyStrategyLayerbankSimpleAbi,
  canopyStrategyPlaceholderSimple: canopyStrategyPlaceholderSimpleAbi,
  canopyStrategyMeridianRewards: canopyStrategyMeridianRewardsAbi,
  meridianRouter: meridianRouterAbi,
  meridianVault: meridianVaultAbi,
  meridianRegistry: meridianRegistryAbi,
  meridianBatchViews: meridianBatchViewsAbi,
  meridianRegularV4: meridianRegularV4Abi,
  meridianRegularV4Entry: meridianRegularV4EntryAbi,
  meridianMedianStableV2: meridianMedianStableV2Abi,
  meridianMedianStableV2Entry: meridianMedianStableV2EntryAbi,
});
