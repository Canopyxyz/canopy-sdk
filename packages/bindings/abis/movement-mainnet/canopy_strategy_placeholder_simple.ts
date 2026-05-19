export const ABI = {
  "address": "0xa9cebc4e3a52f186c831666a6e2f0475d32ebd23244b207ffde0ce06d9813414",
  "name": "strategy",
  "friends": [],
  "exposed_functions": [
    {
      "name": "create",
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
      "name": "deposit_coin",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
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
      "name": "unlink_from_vault",
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
      "name": "vault_deposit_coin",
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
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
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "vault_withdraw_coin",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault::WithdrawalRequest",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_coin::HotCoin<T0>"
      ]
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
      "name": "withdraw_coin",
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
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": []
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
      "name": "PlaceholderStrategy",
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
