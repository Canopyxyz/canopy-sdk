export const ABI = {
  "address": "0x707462571715301b063d79c2cdb57c3bd1cfe2189889793b00077ceed86e0219",
  "name": "rewards_view",
  "friends": [],
  "exposed_functions": [
    {
      "name": "add_pool",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
      ],
      "return": []
    },
    {
      "name": "get_all_pool_list",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "vector<0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>>"
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
      "name": "get_paginated_pools",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64",
        "u64"
      ],
      "return": [
        "vector<0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>>"
      ]
    },
    {
      "name": "get_pool_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
      ],
      "return": [
        "0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::PoolDetails"
      ]
    },
    {
      "name": "get_pool_info",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
      ],
      "return": [
        "0x1::option::Option<0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>>"
      ]
    },
    {
      "name": "get_registered_pool_count",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "u64"
      ]
    },
    {
      "name": "get_registry_overview",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "bool"
      ],
      "return": [
        "u64",
        "bool",
        "bool",
        "bool",
        "0x1::option::Option<vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::PoolDetails>>"
      ]
    },
    {
      "name": "get_reward_token_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
      ],
      "return": [
        "vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::RewardTokenDetails>"
      ]
    },
    {
      "name": "get_rewards_snapshot",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<address>"
      ],
      "return": [
        "vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::PoolDetails>",
        "0x1::option::Option<vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::UserPoolPosition>>"
      ]
    },
    {
      "name": "get_user_pool_positions",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::UserPoolPosition>"
      ]
    },
    {
      "name": "get_user_pool_positions_by_token",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::UserPoolPosition>"
      ]
    },
    {
      "name": "get_user_pool_positions_by_tokens",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "vector<0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4::batcher_view::UserPoolPosition>"
      ]
    },
    {
      "name": "is_pool_registered",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "remove_pool",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
      ],
      "return": []
    },
    {
      "name": "transfer_ownership",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "AddPoolEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pool",
          "type": "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
        }
      ]
    },
    {
      "name": "OwnershipTransferEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "previous_owner",
          "type": "address"
        },
        {
          "name": "new_owner",
          "type": "address"
        }
      ]
    },
    {
      "name": "RemovePoolEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pool",
          "type": "0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>"
        }
      ]
    },
    {
      "name": "RewardsRegistry",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "pool_list",
          "type": "vector<0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>>"
        },
        {
          "name": "pool_indices",
          "type": "0x1::table::Table<0x1::object::Object<0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b::multi_rewards::StakingPool>, u64>"
        }
      ]
    }
  ]
} as const;
