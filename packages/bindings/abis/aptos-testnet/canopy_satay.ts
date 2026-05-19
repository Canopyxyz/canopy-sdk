export const ABI = {
  "address": "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a",
  "name": "satay",
  "friends": [],
  "exposed_functions": [
    {
      "name": "add_strategy",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "remove_strategy",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "bool"
      ],
      "return": []
    },
    {
      "name": "create_vault",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": []
    },
    {
      "name": "create_vault_with_coin",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "pause_vault",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "unpause_vault",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>"
      ],
      "return": []
    }
  ],
  "structs": []
} as const;
