export const ABI = {
  "address": "0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a",
  "name": "batch_views",
  "friends": [],
  "exposed_functions": [
    {
      "name": "batch_get_rebalance_status",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<address>"
      ],
      "return": [
        "vector<0x1::option::Option<0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::RebalanceStatus>>"
      ]
    },
    {
      "name": "batch_get_user_balances",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<address>",
        "address"
      ],
      "return": [
        "vector<0x1::option::Option<0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::UserVaultBalance>>"
      ]
    },
    {
      "name": "batch_get_vault_configs",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<address>"
      ],
      "return": [
        "vector<0x1::option::Option<0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::VaultConfigInfo>>"
      ]
    },
    {
      "name": "batch_get_vault_info",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<address>"
      ],
      "return": [
        "vector<0x1::option::Option<0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::VaultInfo>>"
      ]
    },
    {
      "name": "batch_get_vault_positions",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<address>"
      ],
      "return": [
        "vector<0x1::option::Option<vector<0xc5f874798691b514476ed1c3c6dd2a4931066f86ba70bd56820da586a84a8b0a::batch_views::PositionSummary>>>"
      ]
    }
  ],
  "structs": [
    {
      "name": "PositionSummary",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "lower_tick_neg",
          "type": "bool"
        },
        {
          "name": "lower_tick_abs",
          "type": "u64"
        },
        {
          "name": "upper_tick_neg",
          "type": "bool"
        },
        {
          "name": "upper_tick_abs",
          "type": "u64"
        },
        {
          "name": "liquidity",
          "type": "u64"
        },
        {
          "name": "amount_0",
          "type": "u64"
        },
        {
          "name": "amount_1",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RebalanceStatus",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "last_rebalance_timestamp",
          "type": "u64"
        },
        {
          "name": "seconds_until_next_rebalance",
          "type": "u64"
        },
        {
          "name": "is_rebalance_paused",
          "type": "bool"
        },
        {
          "name": "is_volatility_within_tolerance",
          "type": "bool"
        }
      ]
    },
    {
      "name": "UserVaultBalance",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "share_balance",
          "type": "u64"
        },
        {
          "name": "value_in_deposit_asset_e18",
          "type": "u128"
        }
      ]
    },
    {
      "name": "VaultConfigInfo",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "amm_fee_recipient",
          "type": "address"
        },
        {
          "name": "affiliate",
          "type": "address"
        },
        {
          "name": "max_deposit_amount",
          "type": "u64"
        },
        {
          "name": "deposit_hysteresis_ticks",
          "type": "u64"
        },
        {
          "name": "rebalance_hysteresis_ticks",
          "type": "u64"
        },
        {
          "name": "deposit_twap_period",
          "type": "u64"
        },
        {
          "name": "aux_deposit_twap_period",
          "type": "u64"
        },
        {
          "name": "withdraw_fee_bps",
          "type": "u64"
        },
        {
          "name": "rebalance_cooldown",
          "type": "u64"
        },
        {
          "name": "is_rebalance_paused",
          "type": "bool"
        },
        {
          "name": "base_fee_bps",
          "type": "u64"
        },
        {
          "name": "base_fee_split_bps",
          "type": "u64"
        },
        {
          "name": "global_fee_recipient",
          "type": "address"
        },
        {
          "name": "amm_fee_bps",
          "type": "u64"
        }
      ]
    },
    {
      "name": "VaultInfo",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "total_0",
          "type": "u64"
        },
        {
          "name": "total_1",
          "type": "u64"
        },
        {
          "name": "total_shares",
          "type": "u128"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        },
        {
          "name": "share_name",
          "type": "0x1::string::String"
        },
        {
          "name": "share_symbol",
          "type": "0x1::string::String"
        },
        {
          "name": "share_decimals",
          "type": "u8"
        },
        {
          "name": "deposit_asset",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "quote_asset",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        }
      ]
    }
  ]
} as const;
