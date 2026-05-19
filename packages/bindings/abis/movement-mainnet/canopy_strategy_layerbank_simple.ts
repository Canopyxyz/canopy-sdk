export const ABI = {
  "address": "0xad1b34939f164ec6f6c0157da3a30bf9e5d408250978691872a79aa584852b85",
  "name": "strategy",
  "friends": [],
  "exposed_functions": [
    {
      "name": "check_upkeep",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "claim_all_non_base_asset_rewards",
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
      "name": "create",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>",
        "u64",
        "0x1::option::Option<address>"
      ],
      "return": []
    },
    {
      "name": "deposit_fa",
      "visibility": "friend",
      "is_entry": false,
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
      "name": "get_base_asset",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ]
    },
    {
      "name": "get_last_upkeep_timestamp",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_rewards_controller_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "notify_all_rewards",
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
      "name": "notify_rewards",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": []
    },
    {
      "name": "perform_upkeep",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "rewards_pool_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "set_rewards_controller_address",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "0x1::option::Option<address>"
      ],
      "return": []
    },
    {
      "name": "set_rewards_pool_address",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "0x1::option::Option<address>"
      ],
      "return": []
    },
    {
      "name": "set_upkeep_interval",
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
      "name": "tend_fa",
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
      "name": "vault_deposit_fa",
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
      "name": "vault_report",
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
      "name": "vault_withdraw_fa",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::WithdrawalRequest",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
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
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "auth_ref",
          "type": "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
        },
        {
          "name": "vault",
          "type": "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>"
        },
        {
          "name": "rewards_controller_address",
          "type": "0x1::option::Option<address>"
        }
      ]
    },
    {
      "name": "RewardsPoolDetails",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "rewards_pool_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "last_upkeep_timestamp",
          "type": "u64"
        },
        {
          "name": "upkeep_interval",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StrategyCreated",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vault",
          "type": "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::Vault>"
        },
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
        },
        {
          "name": "rewards_controller_address",
          "type": "0x1::option::Option<address>"
        }
      ]
    },
    {
      "name": "Witness",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "dummy_field",
          "type": "bool"
        }
      ]
    }
  ]
} as const;
