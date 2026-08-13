export const ABI = {
  "address": "0xdefc3f12b2d34e03f48b54cfa1d37e58064d3a71b9f546f07ed2a2e9571c879f",
  "name": "partner_registry",
  "friends": [],
  "exposed_functions": [
    {
      "name": "add_partner",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "address"
      ],
      "return": []
    },
    {
      "name": "payout_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "add_partner_manager",
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
      "name": "is_partner_manager",
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
      "name": "is_registered",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "partner_managers",
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
      "name": "remove_partner",
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
      "name": "remove_partner_manager",
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
      "name": "PartnerAddedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "partner_id",
          "type": "u64"
        },
        {
          "name": "payout_address",
          "type": "address"
        },
        {
          "name": "actor",
          "type": "address"
        }
      ]
    },
    {
      "name": "PartnerManagerAddedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "manager",
          "type": "address"
        }
      ]
    },
    {
      "name": "PartnerManagerRemovedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "manager",
          "type": "address"
        }
      ]
    },
    {
      "name": "PartnerRegistry",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "entries",
          "type": "0x1::table::Table<u64, address>"
        },
        {
          "name": "managers",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "PartnerRemovedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "partner_id",
          "type": "u64"
        },
        {
          "name": "actor",
          "type": "address"
        }
      ]
    }
  ]
} as const;
