export const ABI = {
  "address": "0x1",
  "name": "multisig_account",
  "friends": [],
  "exposed_functions": [
    {
      "name": "create",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "u64",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "is_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "metadata",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "0x1::simple_map::SimpleMap<0x1::string::String, vector<u8>>"
      ]
    },
    {
      "name": "vote",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "u64",
        "address"
      ],
      "return": [
        "bool",
        "bool"
      ]
    },
    {
      "name": "add_owner",
      "visibility": "private",
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
      "name": "add_owners",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "add_owners_and_update_signatures_required",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "approve_transaction",
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
      "name": "available_transaction_queue_capacity",
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
      "name": "can_be_executed",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "u64"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "can_be_rejected",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "u64"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "can_execute",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "address",
        "u64"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "can_reject",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "address",
        "u64"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "num_signatures_required",
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
      "name": "create_transaction",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "vector<u8>"
      ],
      "return": []
    },
    {
      "name": "create_transaction_with_hash",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "vector<u8>"
      ],
      "return": []
    },
    {
      "name": "create_with_existing_account",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "vector<address>",
        "u64",
        "u8",
        "vector<u8>",
        "vector<u8>",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "owners",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "vector<address>"
      ]
    },
    {
      "name": "create_with_existing_account_and_revoke_auth_key",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address",
        "vector<address>",
        "u64",
        "u8",
        "vector<u8>",
        "vector<u8>",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "create_with_existing_account_and_revoke_auth_key_call",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "u64",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "create_with_existing_account_call",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "u64",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "create_with_owners",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "u64",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "create_with_owners_then_remove_bootstrapper",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "u64",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "execute_rejected_transaction",
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
      "name": "execute_rejected_transactions",
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
      "name": "get_next_multisig_account_address",
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
    },
    {
      "name": "get_next_transaction_payload",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "vector<u8>"
      ],
      "return": [
        "vector<u8>"
      ]
    },
    {
      "name": "get_pending_transactions",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "vector<0x1::multisig_account::MultisigTransaction>"
      ]
    },
    {
      "name": "get_transaction",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address",
        "u64"
      ],
      "return": [
        "0x1::multisig_account::MultisigTransaction"
      ]
    },
    {
      "name": "last_resolved_sequence_number",
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
      "name": "next_sequence_number",
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
      "name": "reject_transaction",
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
      "name": "remove_owner",
      "visibility": "private",
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
      "name": "remove_owners",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "swap_owner",
      "visibility": "private",
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
      "name": "swap_owners",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "swap_owners_and_update_signatures_required",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<address>",
        "vector<address>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "update_metadata",
      "visibility": "private",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<0x1::string::String>",
        "vector<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "update_signatures_required",
      "visibility": "private",
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
      "name": "vote_transaction",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64",
        "bool"
      ],
      "return": []
    },
    {
      "name": "vote_transactions",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64",
        "u64",
        "bool"
      ],
      "return": []
    },
    {
      "name": "vote_transanction",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64",
        "bool"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "Vote",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "approved",
          "type": "bool"
        }
      ]
    },
    {
      "name": "VoteEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "approved",
          "type": "bool"
        }
      ]
    },
    {
      "name": "AddOwners",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "owners_added",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "AddOwnersEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owners_added",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "CreateTransaction",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "creator",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "transaction",
          "type": "0x1::multisig_account::MultisigTransaction"
        }
      ]
    },
    {
      "name": "CreateTransactionEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "creator",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "transaction",
          "type": "0x1::multisig_account::MultisigTransaction"
        }
      ]
    },
    {
      "name": "ExecuteRejectedTransaction",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "num_rejections",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "ExecuteRejectedTransactionEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "num_rejections",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "ExecutionError",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "abort_location",
          "type": "0x1::string::String"
        },
        {
          "name": "error_type",
          "type": "0x1::string::String"
        },
        {
          "name": "error_code",
          "type": "u64"
        }
      ]
    },
    {
      "name": "MetadataUpdated",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "old_metadata",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, vector<u8>>"
        },
        {
          "name": "new_metadata",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, vector<u8>>"
        }
      ]
    },
    {
      "name": "MetadataUpdatedEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "old_metadata",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, vector<u8>>"
        },
        {
          "name": "new_metadata",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, vector<u8>>"
        }
      ]
    },
    {
      "name": "MultisigAccount",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owners",
          "type": "vector<address>"
        },
        {
          "name": "num_signatures_required",
          "type": "u64"
        },
        {
          "name": "transactions",
          "type": "0x1::table::Table<u64, 0x1::multisig_account::MultisigTransaction>"
        },
        {
          "name": "last_executed_sequence_number",
          "type": "u64"
        },
        {
          "name": "next_sequence_number",
          "type": "u64"
        },
        {
          "name": "signer_cap",
          "type": "0x1::option::Option<0x1::account::SignerCapability>"
        },
        {
          "name": "metadata",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, vector<u8>>"
        },
        {
          "name": "add_owners_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::AddOwnersEvent>"
        },
        {
          "name": "remove_owners_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::RemoveOwnersEvent>"
        },
        {
          "name": "update_signature_required_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::UpdateSignaturesRequiredEvent>"
        },
        {
          "name": "create_transaction_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::CreateTransactionEvent>"
        },
        {
          "name": "vote_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::VoteEvent>"
        },
        {
          "name": "execute_rejected_transaction_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::ExecuteRejectedTransactionEvent>"
        },
        {
          "name": "execute_transaction_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::TransactionExecutionSucceededEvent>"
        },
        {
          "name": "transaction_execution_failed_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::TransactionExecutionFailedEvent>"
        },
        {
          "name": "metadata_updated_events",
          "type": "0x1::event::EventHandle<0x1::multisig_account::MetadataUpdatedEvent>"
        }
      ]
    },
    {
      "name": "MultisigAccountCreationMessage",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "chain_id",
          "type": "u8"
        },
        {
          "name": "account_address",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "owners",
          "type": "vector<address>"
        },
        {
          "name": "num_signatures_required",
          "type": "u64"
        }
      ]
    },
    {
      "name": "MultisigAccountCreationWithAuthKeyRevocationMessage",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "chain_id",
          "type": "u8"
        },
        {
          "name": "account_address",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "owners",
          "type": "vector<address>"
        },
        {
          "name": "num_signatures_required",
          "type": "u64"
        }
      ]
    },
    {
      "name": "MultisigTransaction",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "payload",
          "type": "0x1::option::Option<vector<u8>>"
        },
        {
          "name": "payload_hash",
          "type": "0x1::option::Option<vector<u8>>"
        },
        {
          "name": "votes",
          "type": "0x1::simple_map::SimpleMap<address, bool>"
        },
        {
          "name": "creator",
          "type": "address"
        },
        {
          "name": "creation_time_secs",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RemoveOwners",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "owners_removed",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "RemoveOwnersEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owners_removed",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "TransactionExecutionFailed",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "transaction_payload",
          "type": "vector<u8>"
        },
        {
          "name": "num_approvals",
          "type": "u64"
        },
        {
          "name": "execution_error",
          "type": "0x1::multisig_account::ExecutionError"
        }
      ]
    },
    {
      "name": "TransactionExecutionFailedEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "executor",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "transaction_payload",
          "type": "vector<u8>"
        },
        {
          "name": "num_approvals",
          "type": "u64"
        },
        {
          "name": "execution_error",
          "type": "0x1::multisig_account::ExecutionError"
        }
      ]
    },
    {
      "name": "TransactionExecutionSucceeded",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "transaction_payload",
          "type": "vector<u8>"
        },
        {
          "name": "num_approvals",
          "type": "u64"
        }
      ]
    },
    {
      "name": "TransactionExecutionSucceededEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "executor",
          "type": "address"
        },
        {
          "name": "sequence_number",
          "type": "u64"
        },
        {
          "name": "transaction_payload",
          "type": "vector<u8>"
        },
        {
          "name": "num_approvals",
          "type": "u64"
        }
      ]
    },
    {
      "name": "UpdateSignaturesRequired",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "multisig_account",
          "type": "address"
        },
        {
          "name": "old_num_signatures_required",
          "type": "u64"
        },
        {
          "name": "new_num_signatures_required",
          "type": "u64"
        }
      ]
    },
    {
      "name": "UpdateSignaturesRequiredEvent",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "old_num_signatures_required",
          "type": "u64"
        },
        {
          "name": "new_num_signatures_required",
          "type": "u64"
        }
      ]
    }
  ]
} as const;
