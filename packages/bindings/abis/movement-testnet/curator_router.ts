export const ABI = {
  "address": "0xa1e7649274d0d74e80e1cdfd201402d654c47631f853a52454bd5cd1609b58f6",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>"
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>"
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>"
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault::Vault>",
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
