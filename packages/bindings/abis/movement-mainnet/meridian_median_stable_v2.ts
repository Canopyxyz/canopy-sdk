export const ABI = {
  "address": "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee",
  "name": "median_stable_v2",
  "friends": [],
  "exposed_functions": [
    {
      "name": "rebalance",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "bool"
      ],
      "return": []
    },
    {
      "name": "check_upkeep",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "bool",
        "u64"
      ]
    },
    {
      "name": "claim_ownership",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "create_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "u64",
        "bool",
        "u64",
        "bool",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64"
      ],
      "return": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ]
    },
    {
      "name": "debug_twap_calculation",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64",
        "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64",
        "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64",
        "u64"
      ]
    },
    {
      "name": "get_action_code",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_base_liq_increase_pct",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_execution_delay",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_hysteresis",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_is_paused",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "get_last_rebalance_time",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_max_distance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_max_swap_pct",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_min_time_between_rebalances",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_num_observations",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_observation_period",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "address"
      ]
    },
    {
      "name": "get_pending_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "address"
      ]
    },
    {
      "name": "get_pending_tokens_pct",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_pos_radius",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
      ]
    },
    {
      "name": "get_rebalance_initiation_time",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_resource_signer_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "address"
      ]
    },
    {
      "name": "get_tick_peg",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
      ]
    },
    {
      "name": "get_twap_fast_secs",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_vault_info",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "bool",
        "u64"
      ]
    },
    {
      "name": "get_vault_summary",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "bool",
        "u64"
      ]
    },
    {
      "name": "has_enough_observations",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_observation_cooldown_active",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "multi_check_upkeep",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>>"
      ],
      "return": [
        "vector<bool>"
      ]
    },
    {
      "name": "multi_perform_upkeep",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "vector<0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>>"
      ],
      "return": []
    },
    {
      "name": "pause",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": []
    },
    {
      "name": "perform_upkeep",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": []
    },
    {
      "name": "perform_upkeep_internal",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "bool",
        "u64"
      ]
    },
    {
      "name": "record_observation",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": []
    },
    {
      "name": "reset_observations",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64",
        "bool"
      ],
      "return": []
    },
    {
      "name": "reset_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": []
    },
    {
      "name": "set_base_liq_increase_pct",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_execution_delay",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_hysteresis",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_max_distance",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_max_swap_pct",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_min_time_between_rebalances",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_num_observations",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_observation_period",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_pending_tokens_pct",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_pos_radius",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_tick_peg",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_twap_fast",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "simulate",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": [
        "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Positions"
      ]
    },
    {
      "name": "transfer_ownership",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address"
      ],
      "return": []
    },
    {
      "name": "unpause",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
      ],
      "return": []
    },
    {
      "name": "update_strategy_settings",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<bool>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<bool>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "Observation",
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
          "name": "tick",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "timestamp",
          "type": "u64"
        },
        {
          "name": "next_higher",
          "type": "u8"
        }
      ]
    },
    {
      "name": "GlobalConfig",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "resource_signer_address",
          "type": "address"
        },
        {
          "name": "resource_signer_cap",
          "type": "0x1::account::SignerCapability"
        },
        {
          "name": "pending_owner",
          "type": "address"
        },
        {
          "name": "owner",
          "type": "address"
        }
      ]
    },
    {
      "name": "MedianStableCtx",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "current_tick",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "tick_peg",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "current_price",
          "type": "u128"
        },
        {
          "name": "twap_fast_tick",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "token0_total",
          "type": "u64"
        },
        {
          "name": "token1_total",
          "type": "u64"
        },
        {
          "name": "pending_token0_ratio",
          "type": "u64"
        },
        {
          "name": "pending_token1_ratio",
          "type": "u64"
        },
        {
          "name": "token0_swap_amount",
          "type": "u64"
        },
        {
          "name": "token1_swap_amount",
          "type": "u64"
        },
        {
          "name": "base_position_could_increase",
          "type": "bool"
        },
        {
          "name": "below_range",
          "type": "bool"
        },
        {
          "name": "above_range",
          "type": "bool"
        },
        {
          "name": "peg_moved",
          "type": "bool"
        },
        {
          "name": "observation_cooldown_active",
          "type": "bool"
        },
        {
          "name": "has_enough_observations",
          "type": "bool"
        },
        {
          "name": "twap_fast_available",
          "type": "bool"
        },
        {
          "name": "observation_twap_available",
          "type": "bool"
        }
      ]
    },
    {
      "name": "NewObservationEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
        },
        {
          "name": "observation_index",
          "type": "u8"
        },
        {
          "name": "tick",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "timestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Observations",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "buf",
          "type": "vector<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Observation>"
        },
        {
          "name": "lowest_index",
          "type": "u8"
        },
        {
          "name": "next_index",
          "type": "u8"
        }
      ]
    },
    {
      "name": "PausedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
        },
        {
          "name": "paused",
          "type": "bool"
        }
      ]
    },
    {
      "name": "PegUpdateEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
        },
        {
          "name": "old_tick_peg",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "new_tick_peg",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        }
      ]
    },
    {
      "name": "PerformUpkeepFailureEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy_address",
          "type": "address"
        },
        {
          "name": "error_code",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Positions",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "first_lower",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "first_upper",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "second_lower",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "second_upper",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        }
      ]
    },
    {
      "name": "RebalanceActionEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
        },
        {
          "name": "action_code",
          "type": "u64"
        },
        {
          "name": "last_rebalance_time",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Strategy",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "strategy_info",
          "type": "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::StrategyInfo"
        },
        {
          "name": "strategy_config",
          "type": "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::StrategyConfig"
        },
        {
          "name": "state",
          "type": "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::StrategyState"
        },
        {
          "name": "obs",
          "type": "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Observations"
        }
      ]
    },
    {
      "name": "StrategyConfig",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "tick_peg",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "pos_radius",
          "type": "0xcff27db92178da13d6543c9036552fcee0f4c7a2cca464e58bab1f40db2296e7::i64::I64"
        },
        {
          "name": "num_observations",
          "type": "u64"
        },
        {
          "name": "observation_period_hours",
          "type": "u64"
        },
        {
          "name": "hysteresis",
          "type": "u64"
        },
        {
          "name": "twap_fast_secs",
          "type": "u64"
        },
        {
          "name": "execution_delay",
          "type": "u64"
        },
        {
          "name": "min_time_between_rebalances",
          "type": "u64"
        },
        {
          "name": "pending_tokens_pct",
          "type": "u64"
        },
        {
          "name": "max_swap_pct",
          "type": "u64"
        },
        {
          "name": "base_liquidity_increase_pct",
          "type": "u64"
        },
        {
          "name": "max_distance",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StrategyCreatedEvent",
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
          "type": "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>"
        },
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee::median_stable_v2::Strategy>"
        }
      ]
    },
    {
      "name": "StrategyInfo",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vault",
          "type": "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>"
        },
        {
          "name": "is_inverted",
          "type": "bool"
        },
        {
          "name": "tick_spacing",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StrategyState",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "paused",
          "type": "bool"
        },
        {
          "name": "last_rebalance_time",
          "type": "u64"
        },
        {
          "name": "rebalance_initiation_time",
          "type": "u64"
        }
      ]
    }
  ]
} as const;
