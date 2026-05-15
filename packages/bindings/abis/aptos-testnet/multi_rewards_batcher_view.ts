export const ABI = {
  "address": "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55",
  "name": "batcher_view",
  "friends": [],
  "exposed_functions": [
    {
      "name": "get_active_rewards_pools",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::ActivePoolInfo>"
      ]
    },
    {
      "name": "get_pool_all_rewards_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::RewardTokenDetails>"
      ]
    },
    {
      "name": "get_pool_full_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>"
      ],
      "return": [
        "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::PoolDetails"
      ]
    },
    {
      "name": "get_pool_reward_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": [
        "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::RewardTokenDetails"
      ]
    },
    {
      "name": "get_pools_by_staking_token",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": [
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>"
      ]
    },
    {
      "name": "get_pools_full_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::PoolDetails>"
      ]
    },
    {
      "name": "get_pools_reward_tokens_details",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::PoolRewardDetails>"
      ]
    },
    {
      "name": "get_user_multiple_pools_positions",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserPoolPosition>"
      ]
    },
    {
      "name": "get_user_pool_position",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>"
      ],
      "return": [
        "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserPoolPosition"
      ]
    },
    {
      "name": "get_user_pools_positions_by_token",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserPoolPosition>"
      ]
    },
    {
      "name": "get_user_rewards_by_pool",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>"
      ],
      "return": [
        "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserReward>"
      ]
    },
    {
      "name": "get_user_staking_overview",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": [
        "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserStakingOverview"
      ]
    },
    {
      "name": "get_user_system_overview",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>"
      ],
      "return": [
        "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserSystemOverview"
      ]
    }
  ],
  "structs": [
    {
      "name": "ActivePoolInfo",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pool",
          "type": "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>"
        },
        {
          "name": "staking_token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "total_subscribed",
          "type": "u64"
        },
        {
          "name": "active_reward_tokens",
          "type": "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>"
        },
        {
          "name": "reward_end_times",
          "type": "vector<u64>"
        }
      ],
      "variants": []
    },
    {
      "name": "PoolDetails",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "staking_token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "reward_tokens",
          "type": "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>"
        },
        {
          "name": "total_subscribed",
          "type": "u64"
        },
        {
          "name": "staking_token_supply",
          "type": "0x1::option::Option<u128>"
        },
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "pool_address",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "PoolRewardDetails",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pool_details",
          "type": "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::PoolDetails"
        },
        {
          "name": "reward_details",
          "type": "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::RewardTokenDetails>"
        }
      ],
      "variants": []
    },
    {
      "name": "RewardTokenDetails",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "distributor",
          "type": "address"
        },
        {
          "name": "duration",
          "type": "u64"
        },
        {
          "name": "period_finish",
          "type": "u64"
        },
        {
          "name": "last_update_time",
          "type": "u64"
        },
        {
          "name": "reward_rate",
          "type": "u128"
        },
        {
          "name": "reward_per_token",
          "type": "u128"
        },
        {
          "name": "remaining_rewards",
          "type": "u64"
        },
        {
          "name": "unallocated_rewards",
          "type": "u64"
        }
      ],
      "variants": []
    },
    {
      "name": "TokenBalance",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "variants": []
    },
    {
      "name": "UserPoolPosition",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "pool",
          "type": "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>"
        },
        {
          "name": "is_subscribed",
          "type": "bool"
        },
        {
          "name": "pool_staking_token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "effective_staked_amount",
          "type": "u64"
        },
        {
          "name": "rewards",
          "type": "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserReward>"
        }
      ],
      "variants": []
    },
    {
      "name": "UserReward",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "reward_token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "earned_amount",
          "type": "u64"
        },
        {
          "name": "reward_per_token_paid",
          "type": "u128"
        }
      ],
      "variants": []
    },
    {
      "name": "UserStakingOverview",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "staking_token",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "staked_balance",
          "type": "u64"
        },
        {
          "name": "subscribed_pools",
          "type": "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>"
        }
      ],
      "variants": []
    },
    {
      "name": "UserSystemOverview",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "staked_balances",
          "type": "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::TokenBalance>"
        },
        {
          "name": "pool_positions",
          "type": "vector<0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55::batcher_view::UserPoolPosition>"
        }
      ],
      "variants": []
    }
  ]
} as const;
