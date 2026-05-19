export const ABI = {
  "address": "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55",
  "name": "batcher_entry",
  "friends": [],
  "exposed_functions": [
    {
      "name": "batch_add_multiple_rewards_to_pool",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<address>",
        "vector<u64>"
      ],
      "return": []
    },
    {
      "name": "batch_add_reward_to_multiple_pools",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "batch_add_rewards_matrix",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<address>",
        "vector<u64>",
        "vector<u8>"
      ],
      "return": []
    },
    {
      "name": "batch_create_staking_pools",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>"
      ],
      "return": []
    },
    {
      "name": "batch_notify_reward_amounts",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<u64>"
      ],
      "return": []
    },
    {
      "name": "batch_set_rewards_durations",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3::multi_rewards::StakingPool>>",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<u64>"
      ],
      "return": []
    },
    {
      "name": "create_pools_with_multiple_rewards",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<vector<0x1::object::Object<0x1::fungible_asset::Metadata>>>",
        "vector<vector<address>>",
        "vector<vector<u64>>"
      ],
      "return": []
    },
    {
      "name": "create_pools_with_rewards",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "vector<address>",
        "vector<u64>"
      ],
      "return": []
    },
    {
      "name": "create_pools_with_same_reward",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "address",
        "u64"
      ],
      "return": []
    }
  ],
  "structs": []
} as const;
