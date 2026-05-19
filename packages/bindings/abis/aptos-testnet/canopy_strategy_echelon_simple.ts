export const ABI = {
  "address": "0x1b4ec80d5161b9669974b051a3e2db1503304c69073afdbfc1e8d2cfb947a55b",
  "name": "strategy",
  "friends": [],
  "exposed_functions": [
    {
      "name": "add_reward_coin_type",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "add_reward_metadata",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "claim_non_base_asset_coin_rewards",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "claim_non_base_asset_fa_rewards",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
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
        "0x1::object::Object<0xdaaf1cca3f702b3d94425e4f0a7bfb921142666846a916f5be91edf1f1911d4::lending::Market>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "deposit_coin",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64"
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
      "name": "get_last_upkeep_timestamp",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_market",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::object::Object<0xdaaf1cca3f702b3d94425e4f0a7bfb921142666846a916f5be91edf1f1911d4::lending::Market>"
      ]
    },
    {
      "name": "harvest",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "harvest_fa",
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
      "name": "notify_all_rewards",
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
      "name": "notify_rewards_coin",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "perform_upkeep_coin",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "perform_upkeep_fa",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "remove_reward_coin_type",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": []
    },
    {
      "name": "remove_reward_metadata",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "set_rewards_pool_address",
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
      "name": "set_upkeep_interval",
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
      "name": "tend_coin",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
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
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
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
        "&mut 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::WithdrawalRequest",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::hot_coin::HotCoin<T0>"
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
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
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "EchelonStrategy",
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
          "name": "market",
          "type": "0x1::object::Object<0xdaaf1cca3f702b3d94425e4f0a7bfb921142666846a916f5be91edf1f1911d4::lending::Market>"
        },
        {
          "name": "reward_assets",
          "type": "0x1b4ec80d5161b9669974b051a3e2db1503304c69073afdbfc1e8d2cfb947a55b::strategy::RewardAssets"
        }
      ],
      "variants": []
    },
    {
      "name": "RewardAssets",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "coin_types",
          "type": "vector<0x1::string::String>"
        },
        {
          "name": "fa_metadatas",
          "type": "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>"
        }
      ],
      "variants": []
    },
    {
      "name": "RewardsPoolDetails",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
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
          "name": "market",
          "type": "0x1::object::Object<0xdaaf1cca3f702b3d94425e4f0a7bfb921142666846a916f5be91edf1f1911d4::lending::Market>"
        },
        {
          "name": "strategy",
          "type": "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>"
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
