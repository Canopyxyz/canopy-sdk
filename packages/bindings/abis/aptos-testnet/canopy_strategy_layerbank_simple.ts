export const ABI = {
  "address": "0xbc95c89d0117335acb2e05401a8ff5978549fde3f7b789e88de7c685275f5b3c",
  "name": "strategy",
  "friends": [],
  "exposed_functions": [
    {
      "name": "claim_all_non_base_asset_rewards",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "create",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "u64",
        "0x1::option::Option<address>"
      ],
      "return": []
    },
    {
      "name": "deposit_fa",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "get_base_asset",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ]
    },
    {
      "name": "get_rewards_controller_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "harvest",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "set_rewards_controller_address",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::option::Option<address>"
      ],
      "return": []
    },
    {
      "name": "tend_fa",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "vault_deposit_fa",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "vault_report",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "vault_withdraw_fa",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&mut 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::WithdrawalRequest",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::hot_asset::HotAsset"
      ]
    },
    {
      "name": "withdraw_fa",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "LayerBankStrategy",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "auth_ref",
          "type": "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::AuthRef"
        },
        {
          "name": "vault",
          "type": "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>"
        },
        {
          "name": "rewards_controller_address",
          "type": "0x1::option::Option<address>"
        }
      ],
      "variants": []
    },
    {
      "name": "StrategyCreated",
      "is_native": false,
      "is_event": true,
      "is_enum": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vault",
          "type": "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>"
        },
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
        },
        {
          "name": "rewards_controller_address",
          "type": "0x1::option::Option<address>"
        }
      ],
      "variants": []
    },
    {
      "name": "Witness",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "dummy_field",
          "type": "bool"
        }
      ],
      "variants": []
    }
  ]
} as const;
