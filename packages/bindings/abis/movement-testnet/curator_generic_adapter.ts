export const ABI = {
  "address": "0x98158ac8cda7c40da87c2102c5b45b96efe3d21b9363bab25f0980ba39707dd3",
  "name": "generic_adapter",
  "friends": [],
  "exposed_functions": [
    {
      "name": "deposit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::RouterRef",
        "address",
        "address",
        "0x1::fungible_asset::FungibleAsset",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "u64",
        "u64"
      ]
    },
    {
      "name": "underlying_metadata",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ]
    },
    {
      "name": "allocate",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "create_adapter",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>"
      ],
      "return": [
        "0x1::object::Object<0x98158ac8cda7c40da87c2102c5b45b96efe3d21b9363bab25f0980ba39707dd3::generic_adapter::GenericAdapter>"
      ]
    },
    {
      "name": "create_adapter_entry",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "deallocate",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "fund_from_vault",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::RouterRef",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "idle_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "recall_to_vault",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::RouterRef",
        "&signer",
        "address",
        "u64"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "report_offchain_nav",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "sweep_strategy_idle_surplus",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address"
      ],
      "return": []
    },
    {
      "name": "vault_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "address"
      ]
    }
  ],
  "structs": [
    {
      "name": "DepositedEvent",
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
          "type": "address"
        },
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "AllocatedEvent",
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
          "type": "address"
        },
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "allocator",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "DeallocatedEvent",
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
          "type": "address"
        },
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "allocator",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "GenericAdapter",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "underlying_metadata",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "extend_ref",
          "type": "0x1::object::ExtendRef"
        },
        {
          "name": "last_offchain_movement_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "GenericAdapterCreatedEvent",
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
          "type": "address"
        },
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "underlying_metadata",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavReportedEvent",
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
          "type": "address"
        },
        {
          "name": "reporter",
          "type": "address"
        },
        {
          "name": "reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "idle_assets",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RecalledEvent",
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
          "type": "address"
        },
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StrategyIdleSurplusSweptEvent",
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
          "type": "address"
        },
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "recovery_address",
          "type": "address"
        },
        {
          "name": "sweeper",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ]
} as const;
