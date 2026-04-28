import aptosMainnetFrameworkCoinAbi from "../../abis/aptos-mainnet/aptos_framework_coin.json";
import aptosMainnetFrameworkMultisigAccountAbi from "../../abis/aptos-mainnet/aptos_framework_multisig_account.json";
import aptosMainnetFrameworkObjectAbi from "../../abis/aptos-mainnet/aptos_framework_object.json";
import aptosMainnetFrameworkPrimaryFungibleStoreAbi from "../../abis/aptos-mainnet/aptos_framework_primary_fungible_store.json";
import aptosMainnetMeridianRegistryAbi from "../../abis/aptos-mainnet/meridian_registry.json";
import aptosMainnetMeridianRegularV4Abi from "../../abis/aptos-mainnet/meridian_regular_v4.json";
import aptosMainnetMeridianRegularV4EntryAbi from "../../abis/aptos-mainnet/meridian_regular_v4_entry.json";
import aptosMainnetMeridianRouterAbi from "../../abis/aptos-mainnet/meridian_router.json";
import aptosMainnetMeridianVaultAbi from "../../abis/aptos-mainnet/meridian_vault.json";
import { defineChainAbis } from "./define";

export const aptosMainnetAbis = defineChainAbis("aptos-mainnet", {
  aptosFrameworkObject: aptosMainnetFrameworkObjectAbi,
  aptosFrameworkPrimaryFungibleStore: aptosMainnetFrameworkPrimaryFungibleStoreAbi,
  aptosFrameworkCoin: aptosMainnetFrameworkCoinAbi,
  aptosFrameworkMultisigAccount: aptosMainnetFrameworkMultisigAccountAbi,
  meridianRouter: aptosMainnetMeridianRouterAbi,
  meridianVault: aptosMainnetMeridianVaultAbi,
  meridianRegistry: aptosMainnetMeridianRegistryAbi,
  meridianRegularV4: aptosMainnetMeridianRegularV4Abi,
  meridianRegularV4Entry: aptosMainnetMeridianRegularV4EntryAbi,
});
