import { ABI as aptosMainnetFrameworkCoinAbi } from "../../abis/aptos-mainnet/aptos_framework_coin";
import { ABI as aptosMainnetFrameworkMultisigAccountAbi } from "../../abis/aptos-mainnet/aptos_framework_multisig_account";
import { ABI as aptosMainnetFrameworkObjectAbi } from "../../abis/aptos-mainnet/aptos_framework_object";
import { ABI as aptosMainnetFrameworkPrimaryFungibleStoreAbi } from "../../abis/aptos-mainnet/aptos_framework_primary_fungible_store";
import { ABI as aptosMainnetMeridianRegistryAbi } from "../../abis/aptos-mainnet/meridian_registry";
import { ABI as aptosMainnetMeridianRegularV4Abi } from "../../abis/aptos-mainnet/meridian_regular_v4";
import { ABI as aptosMainnetMeridianRegularV4EntryAbi } from "../../abis/aptos-mainnet/meridian_regular_v4_entry";
import { ABI as aptosMainnetMeridianRouterAbi } from "../../abis/aptos-mainnet/meridian_router";
import { ABI as aptosMainnetMeridianVaultAbi } from "../../abis/aptos-mainnet/meridian_vault";
import { defineChainAbis } from "./define-chain-abis";

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
