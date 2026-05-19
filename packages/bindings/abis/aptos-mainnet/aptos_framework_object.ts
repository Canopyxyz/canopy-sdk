export const ABI = {
  "address": "0x1",
  "name": "object",
  "friends": [
    "0x1::primary_fungible_store",
    "0x1::coin"
  ],
  "exposed_functions": [
    {
      "name": "new_event_handle",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "drop",
            "store"
          ]
        }
      ],
      "params": [
        "&signer"
      ],
      "return": [
        "0x1::event::EventHandle<T0>"
      ]
    },
    {
      "name": "create_guid",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": [
        "0x1::guid::GUID"
      ]
    },
    {
      "name": "address_from_constructor_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "address_from_delete_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::DeleteRef"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "address_from_extend_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ExtendRef"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "address_to_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "address"
      ],
      "return": [
        "0x1::object::Object<T0>"
      ]
    },
    {
      "name": "burn",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<T0>"
      ],
      "return": []
    },
    {
      "name": "owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "can_generate_delete_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "convert",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        },
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>"
      ],
      "return": [
        "0x1::object::Object<T1>"
      ]
    },
    {
      "name": "create_guid_object_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "u64"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "create_named_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<u8>"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "create_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "create_object_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&address",
        "vector<u8>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "create_object_from_account",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "create_object_from_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "create_sticky_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "create_sticky_object_at_address",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "address"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "object_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&0x1::object::Object<T0>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "create_user_derived_object",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "&0x1::object::DeriveRef"
      ],
      "return": [
        "0x1::object::ConstructorRef"
      ]
    },
    {
      "name": "create_user_derived_object_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "address"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "delete",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::DeleteRef"
      ],
      "return": []
    },
    {
      "name": "disable_ungated_transfer",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::TransferRef"
      ],
      "return": []
    },
    {
      "name": "enable_ungated_transfer",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::TransferRef"
      ],
      "return": []
    },
    {
      "name": "generate_delete_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "0x1::object::DeleteRef"
      ]
    },
    {
      "name": "generate_derive_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "0x1::object::DeriveRef"
      ]
    },
    {
      "name": "generate_extend_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "0x1::object::ExtendRef"
      ]
    },
    {
      "name": "generate_linear_transfer_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::TransferRef"
      ],
      "return": [
        "0x1::object::LinearTransferRef"
      ]
    },
    {
      "name": "generate_signer",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "signer"
      ]
    },
    {
      "name": "generate_signer_for_extending",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ExtendRef"
      ],
      "return": [
        "signer"
      ]
    },
    {
      "name": "generate_transfer_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "0x1::object::TransferRef"
      ]
    },
    {
      "name": "grant_permission",
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
        "&signer",
        "0x1::object::Object<T0>"
      ],
      "return": []
    },
    {
      "name": "grant_permission_with_transfer_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x1::object::TransferRef"
      ],
      "return": []
    },
    {
      "name": "is_burnt",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>",
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_untransferable",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "object_exists",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "object_from_constructor_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": [
        "0x1::object::Object<T0>"
      ]
    },
    {
      "name": "object_from_delete_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&0x1::object::DeleteRef"
      ],
      "return": [
        "0x1::object::Object<T0>"
      ]
    },
    {
      "name": "owns",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>",
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "root_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "set_untransferable",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x1::object::ConstructorRef"
      ],
      "return": []
    },
    {
      "name": "transfer",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<T0>",
        "address"
      ],
      "return": []
    },
    {
      "name": "transfer_call",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "address"
      ],
      "return": []
    },
    {
      "name": "transfer_raw",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "address"
      ],
      "return": []
    },
    {
      "name": "transfer_to_object",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        },
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<T0>",
        "0x1::object::Object<T1>"
      ],
      "return": []
    },
    {
      "name": "transfer_with_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::LinearTransferRef",
        "address"
      ],
      "return": []
    },
    {
      "name": "unburn",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<T0>"
      ],
      "return": []
    },
    {
      "name": "ungated_transfer_allowed",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": [
            "key"
          ]
        }
      ],
      "params": [
        "0x1::object::Object<T0>"
      ],
      "return": [
        "bool"
      ]
    }
  ],
  "structs": [
    {
      "name": "ConstructorRef",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "self",
          "type": "address"
        },
        {
          "name": "can_delete",
          "type": "bool"
        }
      ],
      "variants": []
    },
    {
      "name": "DeleteRef",
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
          "name": "self",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "DeriveRef",
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
          "name": "self",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "ExtendRef",
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
          "name": "self",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "LinearTransferRef",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "self",
          "type": "address"
        },
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "Object",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "fields": [
        {
          "name": "inner",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "ObjectCore",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "guid_creation_num",
          "type": "u64"
        },
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "allow_ungated_transfer",
          "type": "bool"
        },
        {
          "name": "transfer_events",
          "type": "0x1::event::EventHandle<0x1::object::TransferEvent>"
        }
      ],
      "variants": []
    },
    {
      "name": "ObjectGroup",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [],
      "generic_type_params": [],
      "fields": [
        {
          "name": "dummy_field",
          "type": "bool"
        }
      ],
      "variants": []
    },
    {
      "name": "TombStone",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "original_owner",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "Transfer",
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
          "name": "object",
          "type": "address"
        },
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "TransferEvent",
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
          "name": "object",
          "type": "address"
        },
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "to",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "TransferPermission",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "object",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "TransferRef",
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
          "name": "self",
          "type": "address"
        }
      ],
      "variants": []
    },
    {
      "name": "Untransferable",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "key"
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
