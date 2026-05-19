export const ABI = {
  "address": "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a",
  "name": "protocol",
  "friends": [
    "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy",
    "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault"
  ],
  "exposed_functions": [
    {
      "name": "get_signer",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "signer"
      ]
    },
    {
      "name": "accept_governance",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "approve_pending_router",
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
      "name": "get_address",
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
      "name": "get_deployer",
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
      "name": "get_governance",
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
      "name": "get_management_fee",
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
      "name": "get_pending_governance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "get_performance_fee",
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
      "name": "get_protocol_fee",
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
      "name": "get_protocol_fee_recipient",
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
      "name": "get_protocol_fee_recipient_store",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::FungibleStore>"
      ]
    },
    {
      "name": "get_router",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "is_governance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_pending_governance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_valid_block_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::protocol::BlockRef"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_valid_router_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::protocol::RouterRef"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "new_block_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<u8>"
      ],
      "return": [
        "0x1::object::ConstructorRef",
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::protocol::BlockRef"
      ]
    },
    {
      "name": "request_router_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": [
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::protocol::RouterRef"
      ]
    },
    {
      "name": "set_auto_harvest",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_auto_report",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_governance",
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
      "name": "set_management_fee",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_performance_fee",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_protocol_fee",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_protocol_fee_recipient",
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
      "name": "should_auto_harvest",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "bool"
      ]
    },
    {
      "name": "should_auto_report",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "bool"
      ]
    }
  ],
  "structs": [
    {
      "name": "BlockRef",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "block",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "FeatureConfig",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "auto_harvest",
          "type": "bool"
        },
        {
          "name": "auto_report",
          "type": "bool"
        }
      ],
      "variants": []
    },
    {
      "name": "FeeConfig",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "protocol_fee",
          "type": "u64"
        },
        {
          "name": "protocol_fee_recipient",
          "type": "address"
        },
        {
          "name": "performance_fee",
          "type": "u64"
        },
        {
          "name": "management_fee",
          "type": "u64"
        }
      ],
      "variants": []
    },
    {
      "name": "GovernanceChanged",
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
          "name": "governance",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "Protocol",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "governance",
          "type": "address"
        },
        {
          "name": "pending_governance",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "router",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "pending_router",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "fee_config",
          "type": "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::protocol::FeeConfig"
        },
        {
          "name": "feature_config",
          "type": "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::protocol::FeatureConfig"
        }
      ],
      "variants": []
    },
    {
      "name": "ProtocolController",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "extend_ref",
          "type": "0x1::object::ExtendRef"
        }
      ],
      "variants": []
    },
    {
      "name": "RouterRef",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "router",
          "type": "address"
        }
      ],
      "variants": []
    }
  ]
} as const;
