import { ABI as frameworkCoinAbi } from "../../abis/movement-mainnet/aptos_framework_coin";
import { ABI as frameworkMultisigAccountAbi } from "../../abis/movement-mainnet/aptos_framework_multisig_account";
import { ABI as frameworkObjectAbi } from "../../abis/movement-mainnet/aptos_framework_object";
import { ABI as frameworkPrimaryFungibleStoreAbi } from "../../abis/movement-mainnet/aptos_framework_primary_fungible_store";
import { ABI as movementTestnetCuratorGenericAdapterAbi } from "../../abis/movement-testnet/curator_generic_adapter";
import { ABI as movementTestnetCuratorPartnerRegistryAbi } from "../../abis/movement-testnet/curator_partner_registry";
import { ABI as movementTestnetCuratorQueueAbi } from "../../abis/movement-testnet/curator_queue";
import { ABI as movementTestnetCuratorRouterAbi } from "../../abis/movement-testnet/curator_router";
import { ABI as movementTestnetCuratorSanctionsOracleAbi } from "../../abis/movement-testnet/curator_sanctions_oracle";
import { ABI as movementTestnetCuratorVaultAbi } from "../../abis/movement-testnet/curator_vault";
import type { MoveModuleAbi } from "../types";
import { defineChainAbis } from "./define-chain-abis";

// Bardock framework support reuses the checked-in movement-mainnet 0x1 ABI
// snapshots until we intentionally add testnet-specific framework snapshots.
//
// All six curator ABIs are widened to `MoveModuleAbi` *here*, at the registration
// site, and not at SDK call sites. `defineChainAbis` returns its inferred `Abis`
// generic and `abisByChain` uses `as const satisfies ChainAbiSet`, which checks
// assignability without widening — so whatever literal type survives this object
// ends up in `AbisForChain<"movement-testnet">`, and a cast further downstream
// would be too late.
//
// `curator_vault.ts` alone is ~9.7k lines with 340 exposed functions, and nothing
// needs the literal types: the curator client reads through the raw view path and
// builds entry payloads with `entryFunctionPayload`, not Surf. These ABIs are still
// registered because `getAbi(chain, "curator.*")` resolves them and `abi:check`
// uses them for on-chain drift detection.
export const movementTestnetAbis = defineChainAbis("movement-testnet", {
  aptosFrameworkObject: frameworkObjectAbi,
  aptosFrameworkPrimaryFungibleStore: frameworkPrimaryFungibleStoreAbi,
  aptosFrameworkCoin: frameworkCoinAbi,
  aptosFrameworkMultisigAccount: frameworkMultisigAccountAbi,
  curatorVault: movementTestnetCuratorVaultAbi as MoveModuleAbi,
  curatorQueue: movementTestnetCuratorQueueAbi as MoveModuleAbi,
  curatorPartnerRegistry: movementTestnetCuratorPartnerRegistryAbi as MoveModuleAbi,
  curatorRouter: movementTestnetCuratorRouterAbi as MoveModuleAbi,
  curatorGenericAdapter: movementTestnetCuratorGenericAdapterAbi as MoveModuleAbi,
  curatorSanctionsOracle: movementTestnetCuratorSanctionsOracleAbi as MoveModuleAbi,
});
