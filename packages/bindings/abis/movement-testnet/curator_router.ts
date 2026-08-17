export const ABI = {
  "address": "0x97b28d98b0e76f529a12d4d37671be3954aaf619afe600c0bee58349a8ce02d0",
  "name": "router",
  "friends": [],
  "exposed_functions": [
    {
      "name": "deposit",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>",
        "0x1::option::Option<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "claimback_escrowed_shares",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "total_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64",
        "u64",
        "u64"
      ]
    },
    {
      "name": "instant_redeem",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>"
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
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>",
        "0x1::option::Option<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "idle_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "can_sign_for_vault",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "cancel_redemption",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "claim_redemption",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "deposit_with_partner",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>",
        "u64",
        "0x1::option::Option<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "finalize_deallocate",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<vector<u8>>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "fund_strategy",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "has_valid_router_ref",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "bool"
      ]
    },
    {
      "name": "request_redemption",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "DepositWithPartnerEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "depositor",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "partner_id",
          "type": "u64"
        },
        {
          "name": "shares_minted",
          "type": "u64"
        }
      ]
    }
  ]
} as const;
