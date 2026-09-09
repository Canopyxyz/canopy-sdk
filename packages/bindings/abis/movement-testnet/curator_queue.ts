export const ABI = {
  "address": "0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09",
  "name": "queue",
  "friends": [
    "0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::vault"
  ],
  "exposed_functions": [
    {
      "name": "create",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>"
      ]
    },
    {
      "name": "is_frozen",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "apply_recovery",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "u64"
      ],
      "return": [
        "address",
        "u64"
      ]
    },
    {
      "name": "cancel_recovery",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "cancel_request",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "address"
      ],
      "return": []
    },
    {
      "name": "convert_shares_to_assets",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "u64",
        "u64",
        "u64"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "deny_request",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "effective_force_process_at",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "u64"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "escrowed_shares_store",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::FungibleStore>"
      ]
    },
    {
      "name": "expire_request",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "finish_claimback",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "address"
      ],
      "return": []
    },
    {
      "name": "finish_partial_claim",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "force_process",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "vector<address>",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64"
      ],
      "return": [
        "vector<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedFundedRequest>",
        "u64",
        "vector<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedExpiredRequest>",
        "vector<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::FundingMinimumNotMet>"
      ]
    },
    {
      "name": "force_processed_expired_request_address",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedExpiredRequest"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "force_processed_expired_request_locked_assets_out",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedExpiredRequest"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "force_processed_funded_request_address",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedFundedRequest"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "force_processed_funded_request_amount",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedFundedRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "force_processed_funded_request_claimable_at",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedFundedRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "force_processed_funded_request_force_process_at",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedFundedRequest"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "force_processed_funded_request_locked_assets_out",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::ForceProcessedFundedRequest"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "freeze_request_impl",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "fund_request",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "address",
        "u64",
        "u64",
        "u64",
        "u64"
      ],
      "return": [
        "u64",
        "bool",
        "bool",
        "u64",
        "0x1::option::Option<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::FundingMinimumNotMet>"
      ]
    },
    {
      "name": "funded_escrowed_shares_total",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "funding_minimum_not_met_calculated_assets_out",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::FundingMinimumNotMet"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "funding_minimum_not_met_min_assets_out",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::FundingMinimumNotMet"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "funding_minimum_not_met_request_address",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::FundingMinimumNotMet"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "max_open_requests_per_user",
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
      "name": "open_request_count",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "address"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "propose_recovery",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "request_claim_accounting",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64",
        "u64",
        "u64",
        "u64"
      ]
    },
    {
      "name": "request_claimable_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_claimed_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_detail",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RequestDetail"
      ]
    },
    {
      "name": "request_escrowed_shares",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_expires_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_frozen_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "request_funded_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_funded_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "request_has_pending_recovery",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "request_locked_assets_out",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "request_original_escrowed_shares",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "request_pending_recovery_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "request_recovery_not_before",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "request_remaining_funded_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_status",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RequestStatus"
      ]
    },
    {
      "name": "request_stored_force_process_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_submitted_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "reserved_assets_total",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "shortfall_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "shortfall_recorded_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "start_claim",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "address",
        "u64"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "submit",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "address",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "u64",
        "u64",
        "u64",
        "u64",
        "u64",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ]
    },
    {
      "name": "too_many_open_requests_error_code",
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
      "name": "unfreeze_request",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "user_request_addresses",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "address"
      ],
      "return": [
        "vector<address>"
      ]
    },
    {
      "name": "verify_claimback_eligible",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionQueue>",
        "0x1::object::Object<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RedemptionRequest>",
        "address"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "ForceProcessedExpiredRequest",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "locked_assets_out",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "ForceProcessedFundedRequest",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "claimable_at",
          "type": "u64"
        },
        {
          "name": "force_process_at",
          "type": "u64"
        },
        {
          "name": "funded_amount",
          "type": "u64"
        },
        {
          "name": "locked_assets_out",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "FundingMinimumNotMet",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "calculated_assets_out",
          "type": "u64"
        },
        {
          "name": "min_assets_out",
          "type": "u64"
        }
      ]
    },
    {
      "name": "QueueShortfall",
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
          "name": "shortfall_amount",
          "type": "u64"
        },
        {
          "name": "recorded_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "QueueShortfallRecordedEvent",
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
          "name": "queue",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shortfall_amount",
          "type": "u64"
        },
        {
          "name": "recorded_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RedemptionQueue",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "reserved_assets_total",
          "type": "u64"
        },
        {
          "name": "funded_escrowed_shares_total",
          "type": "u64"
        },
        {
          "name": "last_recorded_shortfall",
          "type": "0x1::option::Option<0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::QueueShortfall>"
        },
        {
          "name": "request_registry",
          "type": "0x1::table::Table<address, bool>"
        },
        {
          "name": "user_requests",
          "type": "0x1::table::Table<address, vector<address>>"
        }
      ]
    },
    {
      "name": "RedemptionRequest",
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
          "name": "min_assets_out",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "locked_assets_out",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "submitted_at",
          "type": "u64"
        },
        {
          "name": "claimable_at",
          "type": "u64"
        },
        {
          "name": "funded_at",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "expires_at",
          "type": "u64"
        },
        {
          "name": "force_process_at",
          "type": "u64"
        },
        {
          "name": "funded_amount",
          "type": "u64"
        },
        {
          "name": "claimed_amount",
          "type": "u64"
        },
        {
          "name": "original_escrowed_shares",
          "type": "u64"
        },
        {
          "name": "status",
          "type": "0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RequestStatus"
        },
        {
          "name": "frozen_at",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_recovery_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "pending_recovery_not_before",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "RequestDetail",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "status",
          "type": "0x6a7b799d69fb088fad29b249901b94cbe902a1faca77c218496b9095cf4d3a09::queue::RequestStatus"
        },
        {
          "name": "escrowed_shares",
          "type": "u64"
        },
        {
          "name": "min_assets_out",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "locked_assets_out",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "submitted_at",
          "type": "u64"
        },
        {
          "name": "claimable_at",
          "type": "u64"
        },
        {
          "name": "funded_at",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "expires_at",
          "type": "u64"
        },
        {
          "name": "force_process_at",
          "type": "u64"
        },
        {
          "name": "funded_amount",
          "type": "u64"
        },
        {
          "name": "claimed_amount",
          "type": "u64"
        },
        {
          "name": "original_escrowed_shares",
          "type": "u64"
        },
        {
          "name": "frozen_at",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_recovery_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "pending_recovery_not_before",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "RequestStatus",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": []
    }
  ]
} as const;
