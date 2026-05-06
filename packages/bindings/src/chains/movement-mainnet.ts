import frameworkCoinAbi from "../../abis/movement-mainnet/aptos_framework_coin.json";
import frameworkMultisigAccountAbi from "../../abis/movement-mainnet/aptos_framework_multisig_account.json";
import frameworkObjectAbi from "../../abis/movement-mainnet/aptos_framework_object.json";
import frameworkPrimaryFungibleStoreAbi from "../../abis/movement-mainnet/aptos_framework_primary_fungible_store.json";
import { ABI as canopyBaseStrategyAbiSource } from "../canopy-common/base_strategy";
import { ABI as canopyProtocolAbiSource } from "../canopy-common/protocol";
import { ABI as canopySatayAbiSource } from "../canopy-common/satay";
import canopyRouterAbi from "../../abis/movement-mainnet/canopy_router.json";
import canopyRouterDepositAbi from "../../abis/movement-mainnet/canopy_router_deposit.json";
import canopyRouterWithdrawAbi from "../../abis/movement-mainnet/canopy_router_withdraw.json";
import canopyHelpersAbi from "../../abis/movement-mainnet/canopy_helpers.json";
import canopyRewardsViewAbi from "../../abis/movement-mainnet/canopy_rewards_view.json";
import canopyStrategyEchelonSimpleAbi from "../../abis/movement-mainnet/canopy_strategy_echelon_simple.json";
import canopyStrategyLayerbankSimpleAbi from "../../abis/movement-mainnet/canopy_strategy_layerbank_simple.json";
import canopyStrategyMeridianRewardsAbi from "../../abis/movement-mainnet/canopy_strategy_meridian_rewards.json";
import canopyStrategyMovepositionSimpleAbi from "../../abis/movement-mainnet/canopy_strategy_moveposition_simple.json";
import canopyStrategyMovepositionTicketAbi from "../../abis/movement-mainnet/canopy_strategy_moveposition_ticket.json";
import canopyStrategyPlaceholderSimpleAbi from "../../abis/movement-mainnet/canopy_strategy_placeholder_simple.json";
import meridianBatchViewsAbi from "../../abis/movement-mainnet/meridian_batch_views.json";
import canopyVaultAbi from "../../abis/movement-mainnet/canopy_vault.json";
import meridianMedianStableV2Abi from "../../abis/movement-mainnet/meridian_median_stable_v2.json";
import meridianMedianStableV2EntryAbi from "../../abis/movement-mainnet/meridian_median_stable_v2_entry.json";
import meridianRegistryAbi from "../../abis/movement-mainnet/meridian_registry.json";
import meridianRegularV4Abi from "../../abis/movement-mainnet/meridian_regular_v4.json";
import meridianRegularV4EntryAbi from "../../abis/movement-mainnet/meridian_regular_v4_entry.json";
import meridianRouterAbi from "../../abis/movement-mainnet/meridian_router.json";
import meridianVaultAbi from "../../abis/movement-mainnet/meridian_vault.json";
import multiRewardsAbi from "../../abis/movement-mainnet/multi_rewards.json";
import multiRewardsBatcherEntryAbi from "../../abis/movement-mainnet/multi_rewards_batcher_entry.json";
import multiRewardsBatcherViewAbi from "../../abis/movement-mainnet/multi_rewards_batcher_view.json";
import multiRewardsRouterAbi from "../../abis/movement-mainnet/multi_rewards_router.json";
import multiRewardsStdViewsAbi from "../../abis/movement-mainnet/multi_rewards_std_views.json";
import { defineChainAbis, retargetMoveModuleAbi } from "./define-chain-abis";

export const movementMainnetAbis = defineChainAbis("movement-mainnet", {
  aptosFrameworkObject: frameworkObjectAbi,
  aptosFrameworkPrimaryFungibleStore: frameworkPrimaryFungibleStoreAbi,
  aptosFrameworkCoin: frameworkCoinAbi,
  aptosFrameworkMultisigAccount: frameworkMultisigAccountAbi,
  canopyVault: canopyVaultAbi,
  canopyRouter: canopyRouterAbi,
  canopyRouterDeposit: canopyRouterDepositAbi,
  canopyRouterWithdraw: canopyRouterWithdrawAbi,
  canopySatay: retargetMoveModuleAbi(canopySatayAbiSource, canopyVaultAbi.address),
  canopyProtocol: retargetMoveModuleAbi(canopyProtocolAbiSource, canopyVaultAbi.address),
  canopyBaseStrategy: retargetMoveModuleAbi(
    canopyBaseStrategyAbiSource,
    canopyVaultAbi.address
  ),
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
