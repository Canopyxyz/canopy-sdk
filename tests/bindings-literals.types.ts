import { defineChainAbis } from "../packages/bindings/src/chains/define-chain-abis";
import { getAbisForChain } from "../packages/bindings/src/index";
import type { MoveModuleAbi } from "../packages/bindings/src/types";

type Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends <
  Value
>() => Value extends Right ? 1 : 2
  ? true
  : false;

type Expect<T extends true> = T;

const literalAbis = defineChainAbis("movement-testnet", {
  aptosFrameworkObject: {
    address: "0x1",
    name: "object",
    friends: [],
    exposed_functions: [
      {
        name: "address_to_object",
        visibility: "public",
        is_entry: false,
        is_view: false,
        generic_type_params: [],
        params: ["address"],
        return: ["0x1::object::Object<T0>"],
      },
    ],
    structs: [],
  },
  aptosFrameworkPrimaryFungibleStore: {
    address: "0x1",
    name: "primary_fungible_store",
    friends: [],
    exposed_functions: [],
    structs: [],
  },
  aptosFrameworkCoin: {
    address: "0x1",
    name: "coin",
    friends: [],
    exposed_functions: [],
    structs: [],
  },
  aptosFrameworkMultisigAccount: {
    address: "0x1",
    name: "multisig_account",
    friends: [],
    exposed_functions: [],
    structs: [],
  },
  curatorVault: {
    address: "0x2",
    name: "vault",
    friends: [],
    exposed_functions: [],
    structs: [],
  },
  curatorQueue: {
    address: "0x2",
    name: "queue",
    friends: [],
    exposed_functions: [],
    structs: [],
  },
  curatorPartnerRegistry: {
    address: "0x2",
    name: "partner_registry",
    friends: [],
    exposed_functions: [],
    structs: [],
  },
  curatorRouter: {
    address: "0x3",
    name: "router",
    friends: [],
    exposed_functions: [
      {
        name: "deposit",
        visibility: "public",
        is_entry: true,
        is_view: false,
        generic_type_params: [],
        params: ["&signer", "u64"],
        return: [],
      },
    ],
    structs: [],
  },
} as const);

type _PreservesModuleNameLiteral = Expect<
  Equal<typeof literalAbis.aptosFrameworkObject.name, "object">
>;
type _PreservesFunctionNameLiteral = Expect<
  Equal<typeof literalAbis.aptosFrameworkObject.exposed_functions[0]["name"], "address_to_object">
>;
type _PreservesFunctionParamsTuple = Expect<
  Equal<typeof literalAbis.aptosFrameworkObject.exposed_functions[0]["params"], readonly ["address"]>
>;

// Nothing requires curator's literal types any more — the client builds plain entry
// payloads and reads through internal/abi-views.ts, and all four curator ABIs are
// widened at the registration site (asserted below). This case stays as a general
// check that `defineChainAbis` still preserves literals when a caller wants them,
// using curator's fixture entry purely as the subject.
type _DefineChainAbisPreservesEntryFunctionLiteral = Expect<
  Equal<typeof literalAbis.curatorRouter.exposed_functions[0]["name"], "deposit">
>;

// The real registered movement-testnet set, not the fixture above. `curator_vault.ts`
// is ~9.7k lines with 340 exposed functions; the casts in chains/movement-testnet.ts
// keep that literal union out of type inference, and `satisfies` on `abisByChain`
// does not widen, so these assertions are the only thing standing between a stray
// cast removal and a large compile-time regression.
const movementTestnet = getAbisForChain("movement-testnet");

type _CuratorVaultIsWidened = Expect<
  Equal<typeof movementTestnet.curatorVault, MoveModuleAbi>
>;
type _CuratorQueueIsWidened = Expect<
  Equal<typeof movementTestnet.curatorQueue, MoveModuleAbi>
>;
type _CuratorPartnerRegistryIsWidened = Expect<
  Equal<typeof movementTestnet.curatorPartnerRegistry, MoveModuleAbi>
>;
type _CuratorRouterIsWidened = Expect<
  Equal<typeof movementTestnet.curatorRouter, MoveModuleAbi>
>;
