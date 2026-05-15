export const ABI = {
  "address": "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d",
  "name": "base_strategy",
  "friends": [
    "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::satay",
    "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::vault"
  ],
  "exposed_functions": [
    {
      "name": "amount_to_shares",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "apply_coin_withdrawal",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest",
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_coin::HotCoin<T0>"
      ],
      "return": []
    },
    {
      "name": "apply_fa_withdrawal",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest",
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
      ],
      "return": []
    },
    {
      "name": "auth_ref_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ]
    },
    {
      "name": "base_metadata",
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
      "name": "base_strategy_view",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyView"
      ]
    },
    {
      "name": "complete_harvest",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest"
      ],
      "return": []
    },
    {
      "name": "complete_withdrawal",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
      ]
    },
    {
      "name": "complete_withdrawal_coin",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_coin::HotCoin<T0>"
      ]
    },
    {
      "name": "concrete_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "create",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "drop"
          ]
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "T0"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ]
    },
    {
      "name": "deposit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
      ]
    },
    {
      "name": "destroy_state",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": []
    },
    {
      "name": "fee_amounts",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": [
        "u64",
        "u64"
      ]
    },
    {
      "name": "get_current_debt",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_debt_limit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_fee_amounts",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy",
        "u64"
      ],
      "return": [
        "u64",
        "u64"
      ]
    },
    {
      "name": "get_free_funds",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_last_report",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_locked_profit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_signer",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "signer"
      ]
    },
    {
      "name": "get_total_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_total_loss",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_total_profit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_total_shares",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "harvest_loss",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "harvest_profit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "harvest_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest"
      ],
      "return": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ]
    },
    {
      "name": "last_harvest",
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
      "name": "lock_duration",
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
      "name": "manager",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "mint_debt_shares_coin",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_coin::HotCoin<T0>",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
      ]
    },
    {
      "name": "mint_debt_shares_fa",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
      ]
    },
    {
      "name": "new_state",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ]
    },
    {
      "name": "performance_fee",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "rebalance_idle",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "report_harvest_loss",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef",
        "u64"
      ],
      "return": []
    },
    {
      "name": "report_harvest_profit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef",
        "u64"
      ],
      "return": []
    },
    {
      "name": "request_harvest",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::HarvestRequest"
      ]
    },
    {
      "name": "request_withdrawal",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ]
    },
    {
      "name": "set_current_debt",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_debt_limit",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_last_report",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState"
      ],
      "return": []
    },
    {
      "name": "set_lock_duration",
      "visibility": "public",
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
      "name": "set_performance_fee",
      "visibility": "public",
      "is_entry": false,
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
      "name": "set_total_loss",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_total_profit",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState",
        "u64"
      ],
      "return": []
    },
    {
      "name": "shares_metadata",
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
      "name": "shares_to_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "u64"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "sweep",
      "visibility": "public",
      "is_entry": false,
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
      "name": "tend_coin",
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
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_coin::HotCoin<T0>"
      ]
    },
    {
      "name": "tend_fa",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::AuthRef"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::hot_asset::HotAsset"
      ]
    },
    {
      "name": "total_assets",
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
      "name": "total_debt",
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
      "name": "total_idle",
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
      "name": "total_locked",
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
      "name": "total_shares",
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
      "name": "update_manager",
      "visibility": "friend",
      "is_entry": false,
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
      "name": "vault_base_strategy_view",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>",
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategyState",
        "address"
      ],
      "return": [
        "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::VaultBaseStrategyView"
      ]
    },
    {
      "name": "withdraw",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&mut 0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": []
    },
    {
      "name": "withdrawal_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "withdrawal_debt_offset",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "withdrawal_remaining",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "withdrawal_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": [
        "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
      ]
    },
    {
      "name": "withdrawal_to_burn",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": [
        "&0x1::fungible_asset::FungibleAsset"
      ]
    },
    {
      "name": "withdrawal_withdrawn",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::WithdrawalRequest"
      ],
      "return": [
        "&0x1::fungible_asset::FungibleAsset"
      ]
    }
  ],
  "structs": [
    {
      "name": "AuthRef",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
        }
      ]
    },
    {
      "name": "BaseStrategy",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "total_idle",
          "type": "u64"
        },
        {
          "name": "total_debt",
          "type": "u64"
        },
        {
          "name": "total_locked",
          "type": "u64"
        },
        {
          "name": "lock_duration",
          "type": "u64"
        },
        {
          "name": "concrete_address",
          "type": "address"
        },
        {
          "name": "last_harvest",
          "type": "u64"
        },
        {
          "name": "base_metadata",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "shares_metadata",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "manager",
          "type": "address"
        },
        {
          "name": "performance_fee",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "BaseStrategyController",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "extend_ref",
          "type": "0x1::object::ExtendRef"
        }
      ]
    },
    {
      "name": "BaseStrategyState",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "debt_limit",
          "type": "u64"
        },
        {
          "name": "current_debt",
          "type": "u64"
        },
        {
          "name": "last_report",
          "type": "u64"
        },
        {
          "name": "total_loss",
          "type": "u64"
        },
        {
          "name": "total_profit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "BaseStrategyView",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "decimals",
          "type": "u8"
        },
        {
          "name": "total_debt",
          "type": "u64"
        },
        {
          "name": "total_idle",
          "type": "u64"
        },
        {
          "name": "total_shares",
          "type": "u64"
        },
        {
          "name": "total_asset",
          "type": "u64"
        },
        {
          "name": "asset_address",
          "type": "address"
        },
        {
          "name": "shares_address",
          "type": "address"
        },
        {
          "name": "concrete_address",
          "type": "address"
        },
        {
          "name": "strategy_address",
          "type": "address"
        }
      ]
    },
    {
      "name": "HarvestRequest",
      "is_native": false,
      "is_event": false,
      "abilities": [],
      "generic_type_params": [],
      "fields": [
        {
          "name": "loss",
          "type": "u64"
        },
        {
          "name": "profit",
          "type": "u64"
        },
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
        }
      ]
    },
    {
      "name": "VaultBaseStrategyView",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "decimals",
          "type": "u8"
        },
        {
          "name": "debt_limit",
          "type": "u64"
        },
        {
          "name": "total_loss",
          "type": "u64"
        },
        {
          "name": "total_debt",
          "type": "u64"
        },
        {
          "name": "total_idle",
          "type": "u64"
        },
        {
          "name": "last_report",
          "type": "u64"
        },
        {
          "name": "current_vault_debt",
          "type": "u64"
        },
        {
          "name": "total_shares",
          "type": "u64"
        },
        {
          "name": "total_profit",
          "type": "u64"
        },
        {
          "name": "total_asset",
          "type": "u64"
        },
        {
          "name": "asset_address",
          "type": "address"
        },
        {
          "name": "shares_address",
          "type": "address"
        },
        {
          "name": "concrete_address",
          "type": "address"
        },
        {
          "name": "strategy_address",
          "type": "address"
        },
        {
          "name": "vault_address",
          "type": "address"
        }
      ]
    },
    {
      "name": "WithdrawalRequest",
      "is_native": false,
      "is_event": false,
      "abilities": [],
      "generic_type_params": [],
      "fields": [
        {
          "name": "account",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "remaining",
          "type": "u64"
        },
        {
          "name": "to_withdraw",
          "type": "u64"
        },
        {
          "name": "to_burn",
          "type": "0x1::fungible_asset::FungibleAsset"
        },
        {
          "name": "withdrawn",
          "type": "0x1::fungible_asset::FungibleAsset"
        },
        {
          "name": "debt_offset",
          "type": "u64"
        },
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d::base_strategy::BaseStrategy>"
        }
      ]
    }
  ]
} as const;
