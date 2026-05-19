export const ABI = {
  "address": "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d",
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "rebalance_strategy_idle",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "rebalance_vault_idle",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>"
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_strategy_debt_limit",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_strategy_lock_duration",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_strategy_manager",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "address"
      ],
      "return": []
    },
    {
      "name": "set_strategy_performance_fee",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_vault_deposit_limit",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_vault_lock_duration",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_vault_management_fee",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_vault_manager",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "set_vault_performance_fee",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "sweep_strategy",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "sweep_vault",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "u64"
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>"
      ],
      "return": []
    }
  ],
  "structs": []
} as const;
