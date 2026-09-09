export const ABI = {
  "address": "0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b",
  "name": "sanctions_oracle",
  "friends": [
    "0x8e775fdafef441551521237c279fda77b5010947c8c7b921f1fd0861ea2fe1b::vault"
  ],
  "exposed_functions": [
    {
      "name": "owner",
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
      "name": "assert_not_blocked",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": []
    },
    {
      "name": "blocked_error_code",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "u64"
      ]
    },
    {
      "name": "is_blocked",
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
      "name": "add_address",
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
      "name": "add_manager",
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
      "name": "ensure_initialized",
      "visibility": "friend",
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
      "name": "is_manager",
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
      "name": "managers",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "vector<address>"
      ]
    },
    {
      "name": "remove_address",
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
      "name": "remove_manager",
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
      "name": "set_owner",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "SanctionAddedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "oracle",
          "type": "address"
        },
        {
          "name": "addr",
          "type": "address"
        },
        {
          "name": "actor",
          "type": "address"
        }
      ]
    },
    {
      "name": "SanctionRemovedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "oracle",
          "type": "address"
        },
        {
          "name": "addr",
          "type": "address"
        },
        {
          "name": "actor",
          "type": "address"
        }
      ]
    },
    {
      "name": "SanctionsOracle",
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
          "name": "blocked",
          "type": "0x1::table::Table<address, bool>"
        },
        {
          "name": "managers",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "SanctionsOracleManagerAddedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "oracle",
          "type": "address"
        },
        {
          "name": "manager",
          "type": "address"
        },
        {
          "name": "actor",
          "type": "address"
        }
      ]
    },
    {
      "name": "SanctionsOracleManagerRemovedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "oracle",
          "type": "address"
        },
        {
          "name": "manager",
          "type": "address"
        },
        {
          "name": "actor",
          "type": "address"
        }
      ]
    }
  ]
} as const;
