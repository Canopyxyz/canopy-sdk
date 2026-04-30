import frameworkCoinAbi from "../../abis/movement-mainnet/aptos_framework_coin.json";
import frameworkMultisigAccountAbi from "../../abis/movement-mainnet/aptos_framework_multisig_account.json";
import frameworkObjectAbi from "../../abis/movement-mainnet/aptos_framework_object.json";
import frameworkPrimaryFungibleStoreAbi from "../../abis/movement-mainnet/aptos_framework_primary_fungible_store.json";
import { defineChainAbis } from "./define-chain-abis";

// Bardock support is framework-only for now. Reuse the checked-in 0x1 ABI
// snapshots until we intentionally add testnet-specific framework snapshots.
export const movementTestnetAbis = defineChainAbis("movement-testnet", {
  aptosFrameworkObject: frameworkObjectAbi,
  aptosFrameworkPrimaryFungibleStore: frameworkPrimaryFungibleStoreAbi,
  aptosFrameworkCoin: frameworkCoinAbi,
  aptosFrameworkMultisigAccount: frameworkMultisigAccountAbi,
});
