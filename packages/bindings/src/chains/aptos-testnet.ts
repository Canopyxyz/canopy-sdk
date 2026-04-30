import aptosTestnetFrameworkCoinAbi from "../../abis/aptos-testnet/aptos_framework_coin.json";
import aptosTestnetFrameworkMultisigAccountAbi from "../../abis/aptos-testnet/aptos_framework_multisig_account.json";
import aptosTestnetFrameworkObjectAbi from "../../abis/aptos-testnet/aptos_framework_object.json";
import aptosTestnetFrameworkPrimaryFungibleStoreAbi from "../../abis/aptos-testnet/aptos_framework_primary_fungible_store.json";
import aptosTestnetCanopyRouterAbi from "../../abis/aptos-testnet/canopy_router.json";
import aptosTestnetCanopyRouterDepositAbi from "../../abis/aptos-testnet/canopy_router_deposit.json";
import aptosTestnetCanopyRouterWithdrawAbi from "../../abis/aptos-testnet/canopy_router_withdraw.json";
import aptosTestnetCanopyStrategyEchelonSimpleAbi from "../../abis/aptos-testnet/canopy_strategy_echelon_simple.json";
import aptosTestnetCanopyStrategyLayerbankSimpleAbi from "../../abis/aptos-testnet/canopy_strategy_layerbank_simple.json";
import aptosTestnetCanopyStrategyMovepositionSimpleAbi from "../../abis/aptos-testnet/canopy_strategy_moveposition_simple.json";
import aptosTestnetCanopyStrategyMovepositionTicketAbi from "../../abis/aptos-testnet/canopy_strategy_moveposition_ticket.json";
import aptosTestnetCanopyVaultAbi from "../../abis/aptos-testnet/canopy_vault.json";
import aptosTestnetMultiRewardsAbi from "../../abis/aptos-testnet/multi_rewards.json";
import aptosTestnetMultiRewardsBatcherEntryAbi from "../../abis/aptos-testnet/multi_rewards_batcher_entry.json";
import aptosTestnetMultiRewardsBatcherViewAbi from "../../abis/aptos-testnet/multi_rewards_batcher_view.json";
import aptosTestnetMultiRewardsRouterAbi from "../../abis/aptos-testnet/multi_rewards_router.json";
import { defineChainAbis } from "./define-chain-abis";

export const aptosTestnetAbis = defineChainAbis("aptos-testnet", {
  aptosFrameworkObject: aptosTestnetFrameworkObjectAbi,
  aptosFrameworkPrimaryFungibleStore: aptosTestnetFrameworkPrimaryFungibleStoreAbi,
  aptosFrameworkCoin: aptosTestnetFrameworkCoinAbi,
  aptosFrameworkMultisigAccount: aptosTestnetFrameworkMultisigAccountAbi,
  canopyVault: aptosTestnetCanopyVaultAbi,
  canopyRouter: aptosTestnetCanopyRouterAbi,
  canopyRouterDeposit: aptosTestnetCanopyRouterDepositAbi,
  canopyRouterWithdraw: aptosTestnetCanopyRouterWithdrawAbi,
  multiRewards: aptosTestnetMultiRewardsAbi,
  multiRewardsRouter: aptosTestnetMultiRewardsRouterAbi,
  multiRewardsBatcherView: aptosTestnetMultiRewardsBatcherViewAbi,
  multiRewardsBatcherEntry: aptosTestnetMultiRewardsBatcherEntryAbi,
  canopyStrategyEchelonSimple: aptosTestnetCanopyStrategyEchelonSimpleAbi,
  canopyStrategyMovepositionSimple: aptosTestnetCanopyStrategyMovepositionSimpleAbi,
  canopyStrategyMovepositionTicket: aptosTestnetCanopyStrategyMovepositionTicketAbi,
  canopyStrategyLayerbankSimple: aptosTestnetCanopyStrategyLayerbankSimpleAbi,
});
