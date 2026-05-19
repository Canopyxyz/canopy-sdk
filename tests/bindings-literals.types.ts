import { defineChainAbis } from "../packages/bindings/src/chains/define-chain-abis";

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
