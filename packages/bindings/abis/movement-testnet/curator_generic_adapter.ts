export const ABI = {
  "address": "0x893690b020cddc1be874efb2fc3fcb2209f6e863264d3885c742a58c7a3b12c7",
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
        "&0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b::vault::RouterRef",
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
        "0x1::object::Object<0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b::vault::Vault>"
      ],
      "return": [
        "0x1::object::Object<0x893690b020cddc1be874efb2fc3fcb2209f6e863264d3885c742a58c7a3b12c7::generic_adapter::GenericAdapter>"
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
        "0x1::object::Object<0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b::vault::Vault>"
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
        "&0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b::vault::RouterRef",
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
        "&0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b::vault::RouterRef",
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
