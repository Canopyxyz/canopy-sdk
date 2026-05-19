import { ABI as aptosTestnetFrameworkCoinAbi } from "../../abis/aptos-testnet/aptos_framework_coin";
import { ABI as aptosTestnetFrameworkMultisigAccountAbi } from "../../abis/aptos-testnet/aptos_framework_multisig_account";
import { ABI as aptosTestnetFrameworkObjectAbi } from "../../abis/aptos-testnet/aptos_framework_object";
import { ABI as aptosTestnetFrameworkPrimaryFungibleStoreAbi } from "../../abis/aptos-testnet/aptos_framework_primary_fungible_store";
import { ABI as aptosTestnetCanopyBaseStrategyAbi } from "../../abis/aptos-testnet/canopy_base_strategy";
import { ABI as aptosTestnetCanopyProtocolAbi } from "../../abis/aptos-testnet/canopy_protocol";
import { ABI as aptosTestnetCanopyRouterAbi } from "../../abis/aptos-testnet/canopy_router";
import { ABI as aptosTestnetCanopyRouterDepositAbi } from "../../abis/aptos-testnet/canopy_router_deposit";
import { ABI as aptosTestnetCanopyRouterWithdrawAbi } from "../../abis/aptos-testnet/canopy_router_withdraw";
import { ABI as aptosTestnetCanopySatayAbi } from "../../abis/aptos-testnet/canopy_satay";
import { ABI as aptosTestnetCanopyStrategyEchelonSimpleAbi } from "../../abis/aptos-testnet/canopy_strategy_echelon_simple";
import { ABI as aptosTestnetCanopyStrategyLayerbankSimpleAbi } from "../../abis/aptos-testnet/canopy_strategy_layerbank_simple";
import { ABI as aptosTestnetCanopyStrategyMovepositionSimpleAbi } from "../../abis/aptos-testnet/canopy_strategy_moveposition_simple";
import { ABI as aptosTestnetCanopyStrategyMovepositionTicketAbi } from "../../abis/aptos-testnet/canopy_strategy_moveposition_ticket";
import { ABI as aptosTestnetCanopyVaultAbi } from "../../abis/aptos-testnet/canopy_vault";
import { ABI as aptosTestnetMultiRewardsAbi } from "../../abis/aptos-testnet/multi_rewards";
import { ABI as aptosTestnetMultiRewardsBatcherEntryAbi } from "../../abis/aptos-testnet/multi_rewards_batcher_entry";
import { ABI as aptosTestnetMultiRewardsBatcherViewAbi } from "../../abis/aptos-testnet/multi_rewards_batcher_view";
import { ABI as aptosTestnetMultiRewardsRouterAbi } from "../../abis/aptos-testnet/multi_rewards_router";
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
  canopySatay: aptosTestnetCanopySatayAbi,
  canopyProtocol: aptosTestnetCanopyProtocolAbi,
  canopyBaseStrategy: aptosTestnetCanopyBaseStrategyAbi,
  multiRewards: aptosTestnetMultiRewardsAbi,
  multiRewardsRouter: aptosTestnetMultiRewardsRouterAbi,
  multiRewardsBatcherView: aptosTestnetMultiRewardsBatcherViewAbi,
  multiRewardsBatcherEntry: aptosTestnetMultiRewardsBatcherEntryAbi,
  canopyStrategyEchelonSimple: aptosTestnetCanopyStrategyEchelonSimpleAbi,
  canopyStrategyMovepositionSimple: aptosTestnetCanopyStrategyMovepositionSimpleAbi,
  canopyStrategyMovepositionTicket: aptosTestnetCanopyStrategyMovepositionTicketAbi,
  canopyStrategyLayerbankSimple: aptosTestnetCanopyStrategyLayerbankSimpleAbi,
});
