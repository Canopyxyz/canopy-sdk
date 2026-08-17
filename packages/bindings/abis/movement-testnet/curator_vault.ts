export const ABI = {
  "address": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2",
  "name": "vault",
  "friends": [],
  "exposed_functions": [
    {
      "name": "hard_max_instant_redeem_fee_bps",
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
      "name": "hard_max_management_fee_bps",
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
      "name": "hard_max_performance_fee_bps",
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
      "name": "hard_min_allocator_sla_seconds",
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
      "name": "hard_min_max_pause_duration",
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
      "name": "max_offchain_nav_report_cooldown_seconds",
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
      "name": "max_requests_per_transaction",
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
      "name": "owner_rotation_min_timelock",
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
      "name": "role_transfer_min_timelock",
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
      "name": "transfer_sanctions_enabled",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "recovery_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "share_metadata",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ]
    },
    {
      "name": "unfreeze_request",
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
      "name": "pending_recovery_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<address>>"
      ]
    },
    {
      "name": "accept_allocator",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "accept_curator",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "accept_global_guardian",
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
      "name": "accept_guardian",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "accept_owner",
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
      "name": "is_nav_fresh",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "active_router",
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
      "name": "adapter_cap",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "adapter_cap_headroom",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "allocate_offchain_from_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "allocator",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "underlying_metadata",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ]
    },
    {
      "name": "allocator_sla_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "apply_allocator_sla_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "curator",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "apply_auto_allocation_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_cap_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_deposit_velocity_caps_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_fee_recipient_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_frictionless_threshold_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_idle_limit_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_instant_redeem_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_lock_duration_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_management_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_mandatory_tier0_velocity_caps_change",
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
      "name": "apply_max_frictionless_threshold_change",
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
      "name": "apply_max_instant_redeem_fee_bps_change",
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
      "name": "apply_max_management_fee_bps_change",
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
      "name": "apply_max_nav_24h_share_price_deviation_bps_change",
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
      "name": "apply_max_nav_deviation_threshold_bps_change",
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
      "name": "apply_max_nav_freshness_override_change",
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
      "name": "apply_max_pause_duration_change",
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
      "name": "apply_max_performance_fee_bps_change",
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
      "name": "apply_min_allocator_sla_change",
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
      "name": "apply_min_nav_24h_share_price_deviation_bps_change",
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
      "name": "guardian",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "apply_min_nav_deviation_threshold_bps_change",
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
      "name": "apply_nav_24h_share_price_deviation_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_nav_deviation_threshold_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_nav_freshness_override_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_nav_freshness_tiers_change",
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
      "name": "apply_nav_override",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "reported_offchain_nav",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "apply_normal_nav_report_interval_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_offchain_nav_report_cooldown_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_performance_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_pricing_control_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_queued_redemption_recovery",
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
      "name": "apply_recovery_address_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_redemption_velocity_caps_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_reporters_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_request_expiry_window_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_router_update",
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
      "name": "apply_stale_nav_action_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_strategy_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_vault_timelock_config_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "apply_withdrawal_delay_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "approve_allocator_address",
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
      "name": "approve_curator_address",
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
      "name": "frictionless_threshold",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "instant_redeem_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "lock_duration",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "management_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "nav_24h_share_price_deviation_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "nav_deviation_threshold_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "nav_freshness_override",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "normal_nav_report_interval_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "performance_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "request_expiry_window",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "withdrawal_delay_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "auto_allocate_on_deposit",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "begin_strategy_movement",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StrategyMovementReceipt"
      ]
    },
    {
      "name": "block_wallet",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "cancel_allocator_proposal",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_allocator_sla_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_auto_allocation_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_cap_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_curator_proposal",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_deposit_velocity_caps_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_fee_recipient_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_frictionless_threshold_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_global_guardian_proposal",
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
      "name": "cancel_guardian_proposal",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_idle_limit_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_instant_redeem_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_lock_duration_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_management_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_mandatory_tier0_velocity_caps_change",
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
      "name": "cancel_max_frictionless_threshold_change",
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
      "name": "cancel_max_instant_redeem_fee_bps_change",
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
      "name": "cancel_max_management_fee_bps_change",
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
      "name": "cancel_max_nav_24h_share_price_deviation_bps_change",
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
      "name": "cancel_max_nav_deviation_threshold_bps_change",
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
      "name": "cancel_max_nav_freshness_override_change",
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
      "name": "cancel_max_pause_duration_change",
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
      "name": "cancel_max_performance_fee_bps_change",
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
      "name": "cancel_min_allocator_sla_change",
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
      "name": "cancel_min_nav_24h_share_price_deviation_bps_change",
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
      "name": "cancel_min_nav_deviation_threshold_bps_change",
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
      "name": "cancel_nav_24h_share_price_deviation_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_nav_deviation_threshold_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_nav_freshness_override_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_nav_freshness_tiers_change",
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
      "name": "cancel_nav_override",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_normal_nav_report_interval_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_offchain_nav_report_cooldown_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_owner_proposal",
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
      "name": "cancel_performance_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_pricing_control_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_queued_redemption",
      "visibility": "public",
      "is_entry": false,
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
      "name": "cancel_queued_redemption_recovery",
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
      "name": "cancel_recovery_address_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_redemption_velocity_caps_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_reporters_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_request_expiry_window_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_router_update",
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
      "name": "cancel_stale_nav_action_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_strategy_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_vault_timelock_config_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "cancel_withdrawal_delay_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "claim_queued_redemption",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionRequest>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "claimback_escrowed_shares",
      "visibility": "public",
      "is_entry": false,
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
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "create_vault",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "address",
        "address",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "0x1::string::String",
        "0x1::string::String",
        "bool",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "address",
        "address",
        "vector<address>"
      ],
      "return": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ]
    },
    {
      "name": "max_pending_locked_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "deposit_cap",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "fee_recipient",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "address"
      ]
    },
    {
      "name": "reporters",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "vector<address>"
      ]
    },
    {
      "name": "create_vault_entry",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "address",
        "address",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "0x1::string::String",
        "0x1::string::String",
        "bool",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "address",
        "address",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "deallocate_offchain_to_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "default_system_bounds",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::SystemBounds"
      ]
    },
    {
      "name": "deny_queued_redemption",
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
      "name": "deposit_aggregate_velocity_usage",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage"
      ]
    },
    {
      "name": "deposit_preview",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::DepositPreview"
      ]
    },
    {
      "name": "deposit_velocity_caps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
      ]
    },
    {
      "name": "deposit_wallet_velocity_usage",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage>"
      ]
    },
    {
      "name": "deposits_paused_until",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "disable_transfer_sanctions",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "effective_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "emergency_clear_allocator",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "enable_transfer_sanctions",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "expire_pending_request",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionRequest>"
      ],
      "return": []
    },
    {
      "name": "force_process_queue",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "freeze_request",
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
      "name": "fund_requests",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "get_signer_for_router",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef"
      ],
      "return": [
        "signer"
      ]
    },
    {
      "name": "global_guardian",
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
      "name": "guardian_set_deposit_velocity_caps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "guardian_set_redemption_velocity_caps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "has_pending_offchain_nav_override",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "has_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "high_water_mark_e18",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u128"
      ]
    },
    {
      "name": "idle_limits",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>"
      ]
    },
    {
      "name": "idle_limits_fields",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits"
      ],
      "return": [
        "u64",
        "u64"
      ]
    },
    {
      "name": "pricing_policy",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
      ]
    },
    {
      "name": "instant_redeem",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "instant_redeem_preview",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::InstantRedeemPreview"
      ]
    },
    {
      "name": "is_approved_allocator",
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
      "name": "is_approved_curator",
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
      "name": "is_guardian",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
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
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "is_wallet_blocked",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "last_nav_update_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "liquidity_breakdown",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::LiquidityBreakdown"
      ]
    },
    {
      "name": "locked_profit",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "mandatory_tier0_velocity_caps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
      ]
    },
    {
      "name": "max_frictionless_threshold",
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
      "name": "max_instant_redeem_fee_bps",
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
      "name": "max_management_fee_bps",
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
      "name": "max_nav_24h_share_price_deviation_bps",
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
      "name": "max_nav_deviation_threshold_bps",
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
      "name": "max_nav_freshness_override",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "max_pause_duration",
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
      "name": "max_performance_fee_bps",
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
      "name": "min_allocator_sla_seconds",
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
      "name": "min_delay_seconds",
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
      "name": "min_deposit_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "min_nav_24h_share_price_deviation_bps",
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
      "name": "min_nav_deviation_threshold_bps",
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
      "name": "min_recovery_timelock",
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
      "name": "min_request_expiry_window",
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
      "name": "min_role_change_timelock",
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
      "name": "nav_24h_share_price_band",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavSharePriceBandView"
      ]
    },
    {
      "name": "nav_freshness_tiers",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavFreshnessTier>"
      ]
    },
    {
      "name": "strategy_idle_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "offchain_nav_report_cooldown_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "partner_attribution_enabled",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "bool"
      ]
    },
    {
      "name": "pause_deposits",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "pause_redemptions",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "pending_adapter_cap",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x1::option::Option<u64>>>"
      ]
    },
    {
      "name": "pending_allocator",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "pending_allocator_effective_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_allocator_proposed_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_allocator_sla_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_auto_allocate_on_deposit",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<bool>>"
      ]
    },
    {
      "name": "pending_curator",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "pending_curator_effective_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_curator_proposed_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_deposit_cap",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x1::option::Option<u64>>>"
      ]
    },
    {
      "name": "pending_deposit_velocity_caps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>>"
      ]
    },
    {
      "name": "pending_fee_recipient",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<address>>"
      ]
    },
    {
      "name": "pending_frictionless_threshold",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_global_guardian",
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
      "name": "pending_global_guardian_effective_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_global_guardian_proposed_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_guardian",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "pending_guardian_effective_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_guardian_proposed_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_idle_limits",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>>>"
      ]
    },
    {
      "name": "pending_instant_redeem_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_lock_duration",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_management_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_mandatory_tier0_velocity_caps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>>"
      ]
    },
    {
      "name": "pending_max_frictionless_threshold",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_max_instant_redeem_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_max_management_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_max_nav_24h_share_price_deviation_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_max_nav_deviation_threshold_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_max_nav_freshness_override",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x1::option::Option<u64>>>"
      ]
    },
    {
      "name": "pending_max_pause_duration",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_max_pending_locked_assets",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x1::option::Option<u64>>>"
      ]
    },
    {
      "name": "pending_max_performance_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_min_allocator_sla_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_min_nav_24h_share_price_deviation_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_min_nav_deviation_threshold_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_nav_24h_share_price_deviation_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_nav_deviation_threshold_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_nav_freshness_override",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x1::option::Option<u64>>>"
      ]
    },
    {
      "name": "pending_nav_freshness_tiers",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavFreshnessTier>>>"
      ]
    },
    {
      "name": "pending_normal_nav_report_interval_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_offchain_nav_override",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_performance_fee_bps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_pricing_policy",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy>>"
      ]
    },
    {
      "name": "pending_recovery_timelock",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_redemption_velocity_caps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>>"
      ]
    },
    {
      "name": "pending_request_expiry_window",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_role_change_timelock",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "pending_router",
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
      "name": "pending_stale_nav_action",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction>>"
      ]
    },
    {
      "name": "pending_strategy_change_not_before",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_strategy_module_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "pending_strategy_object_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "pending_system_owner",
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
      "name": "pending_system_owner_effective_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_system_owner_proposed_at",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "pending_withdrawal_delay_seconds",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::PendingUpdate<u64>>"
      ]
    },
    {
      "name": "propose_allocator",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "propose_curator",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "propose_fee_recipient_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "propose_global_guardian",
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
      "name": "propose_guardian",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "propose_nav_override",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "propose_owner",
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
      "name": "propose_queued_redemption_recovery",
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
      "name": "propose_recovery_address_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "propose_router_update",
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
      "name": "queue_object",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionQueue>"
      ]
    },
    {
      "name": "queued_redemption_preview",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::QueuedRedemptionPreview"
      ]
    },
    {
      "name": "record_router_recall",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "record_strategy_allocation",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StrategyMovementReceipt",
        "u64"
      ],
      "return": []
    },
    {
      "name": "record_strategy_deallocation",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StrategyMovementReceipt",
        "u64"
      ],
      "return": []
    },
    {
      "name": "recovery_timelock",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "redemption_aggregate_velocity_usage",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage"
      ]
    },
    {
      "name": "redemption_velocity_caps",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
      ]
    },
    {
      "name": "redemption_wallet_velocity_usage",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": [
        "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage>"
      ]
    },
    {
      "name": "redemptions_paused_until",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<u64>"
      ]
    },
    {
      "name": "remove_reporter",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "report_strategy_offchain_nav",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address",
        "u64"
      ],
      "return": []
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
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef"
      ]
    },
    {
      "name": "revoke_approved_allocator",
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
      "name": "revoke_approved_curator",
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
      "name": "role_change_timelock",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "router_deposit",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address",
        "0x1::fungible_asset::FungibleAsset",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "router_fund_strategy",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_allocator_sla_seconds",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_auto_allocate_on_deposit",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_caps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_deposit_velocity_caps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_frictionless_threshold",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_idle_limits",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_instant_redeem_fee_bps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_lock_duration",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_management_fee_bps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_mandatory_tier0_velocity_caps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_max_frictionless_threshold",
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
      "name": "set_max_instant_redeem_fee_bps",
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
      "name": "set_max_management_fee_bps",
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
      "name": "set_max_nav_24h_share_price_deviation_bps",
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
      "name": "set_max_nav_deviation_threshold_bps",
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
      "name": "set_max_nav_freshness_override",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_max_pause_duration",
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
      "name": "set_max_performance_fee_bps",
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
      "name": "set_min_allocator_sla",
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
      "name": "set_min_deposit_amount",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_min_nav_24h_share_price_deviation_bps",
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
      "name": "set_min_nav_deviation_threshold_bps",
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
      "name": "set_nav_24h_share_price_deviation_bps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_nav_deviation_threshold_bps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_nav_freshness_override",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_nav_freshness_tiers",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "vector<u64>",
        "vector<u64>"
      ],
      "return": []
    },
    {
      "name": "set_normal_nav_report_interval_seconds",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_offchain_nav_report_cooldown_seconds",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_partner_policy",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_performance_fee_bps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_pricing_controls",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "bool",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_redemption_velocity_caps",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "set_reporters",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "vector<address>"
      ],
      "return": []
    },
    {
      "name": "set_request_expiry_window",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_stale_nav_action",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "bool"
      ],
      "return": []
    },
    {
      "name": "set_strategy",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "0x1::option::Option<address>",
        "0x1::option::Option<address>"
      ],
      "return": []
    },
    {
      "name": "strategy_module_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "strategy_object_address",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x1::option::Option<address>"
      ]
    },
    {
      "name": "set_vault_timelocks",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "set_withdrawal_delay_seconds",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "share_balance_of",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "share_price_e18",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u128"
      ]
    },
    {
      "name": "share_total_supply",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "stale_nav_action",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction"
      ]
    },
    {
      "name": "strategy_clearability",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StrategyClearability"
      ]
    },
    {
      "name": "submit_queued_redemption",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionRequest>"
      ]
    },
    {
      "name": "system_owner",
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
      "name": "unblock_wallet",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": []
    },
    {
      "name": "unpause_deposits",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "unpause_redemptions",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "unpriced_strategy_surplus",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "user_position_view",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>",
        "address"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::UserPositionView"
      ]
    },
    {
      "name": "vault_accounting",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::AccountingSnapshot"
      ]
    },
    {
      "name": "vault_config_view",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VaultConfigView"
      ]
    },
    {
      "name": "vault_count",
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
      "name": "vault_unreserved_underlying_balance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "vaults",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "u64",
        "u64"
      ],
      "return": [
        "vector<address>"
      ]
    },
    {
      "name": "veto_allocator_sla_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_auto_allocation_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_cap_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_deposit_velocity_caps_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_fee_recipient_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_frictionless_threshold_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_idle_limit_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_instant_redeem_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_lock_duration_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_management_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_nav_24h_share_price_deviation_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_nav_deviation_threshold_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_nav_freshness_override_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_nav_override",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_normal_nav_report_interval_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_offchain_nav_report_cooldown_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_performance_fee_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_pricing_control_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_recovery_address_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_redemption_velocity_caps_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_reporters_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_request_expiry_window_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_router_update",
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
      "name": "veto_stale_nav_action_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_strategy_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_vault_timelock_config_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    },
    {
      "name": "veto_withdrawal_delay_change",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::Vault>"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "AccountingSnapshot",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "unreserved_buffer",
          "type": "u64"
        },
        {
          "name": "reserved_for_queue",
          "type": "u64"
        },
        {
          "name": "strategy_idle_assets",
          "type": "u64"
        },
        {
          "name": "reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "total_assets",
          "type": "u64"
        },
        {
          "name": "locked_profit",
          "type": "u64"
        },
        {
          "name": "effective_assets",
          "type": "u64"
        },
        {
          "name": "share_total_supply",
          "type": "u64"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        },
        {
          "name": "last_nav_update_at",
          "type": "u64"
        },
        {
          "name": "is_nav_fresh",
          "type": "bool"
        },
        {
          "name": "has_pending_offchain_nav_override",
          "type": "bool"
        }
      ]
    },
    {
      "name": "AllocatorAddressRevokedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "allocator",
          "type": "address"
        },
        {
          "name": "revoked_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "AllocatorClearedEvent",
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
          "name": "cleared_by",
          "type": "address"
        },
        {
          "name": "previous_allocator",
          "type": "address"
        },
        {
          "name": "cancelled_pending_allocator",
          "type": "0x1::option::Option<address>"
        }
      ]
    },
    {
      "name": "AllocatorSlaBreachedEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "effective_sla_start",
          "type": "u64"
        },
        {
          "name": "breached_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "AllocatorSlaChangeAppliedEvent",
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
          "name": "new_allocator_sla_seconds",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "AllocatorSlaChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "AllocatorSlaChangeProposedEvent",
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
          "name": "current_allocator_sla_seconds",
          "type": "u64"
        },
        {
          "name": "proposed_allocator_sla_seconds",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "AllocatorSlaChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "AllocatorTransferCancelledEvent",
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
          "name": "current_allocator",
          "type": "address"
        },
        {
          "name": "cancelled_allocator",
          "type": "address"
        }
      ]
    },
    {
      "name": "AllocatorTransferProposedEvent",
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
          "name": "current_allocator",
          "type": "address"
        },
        {
          "name": "proposed_allocator",
          "type": "address"
        },
        {
          "name": "effective_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "AllocatorTransferredEvent",
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
          "name": "old_allocator",
          "type": "address"
        },
        {
          "name": "new_allocator",
          "type": "address"
        }
      ]
    },
    {
      "name": "AutoAllocationChangeAppliedEvent",
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
          "name": "new_enabled",
          "type": "bool"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "AutoAllocationChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "AutoAllocationChangeProposedEvent",
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
          "name": "current_enabled",
          "type": "bool"
        },
        {
          "name": "proposed_enabled",
          "type": "bool"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "AutoAllocationChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "CapChangeAppliedEvent",
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
          "name": "new_deposit_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "new_adapter_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "CapChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "CapChangeProposedEvent",
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
          "name": "current_deposit_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposed_deposit_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "current_adapter_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposed_adapter_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "CapChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "CuratorAddressRevokedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "curator",
          "type": "address"
        },
        {
          "name": "revoked_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "CuratorTransferCancelledEvent",
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
          "name": "current_curator",
          "type": "address"
        },
        {
          "name": "cancelled_curator",
          "type": "address"
        }
      ]
    },
    {
      "name": "CuratorTransferProposedEvent",
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
          "name": "current_curator",
          "type": "address"
        },
        {
          "name": "proposed_curator",
          "type": "address"
        },
        {
          "name": "effective_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "CuratorTransferredEvent",
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
          "name": "old_curator",
          "type": "address"
        },
        {
          "name": "new_curator",
          "type": "address"
        }
      ]
    },
    {
      "name": "CuratorVaultSystem",
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
          "name": "pending_owner",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PendingRoleTransfer>"
        },
        {
          "name": "global_guardian",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "pending_global_guardian",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PendingRoleTransfer>"
        },
        {
          "name": "system_bounds",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::TimelockedSystemBounds"
        },
        {
          "name": "approved_curators",
          "type": "0x1::table::Table<address, bool>"
        },
        {
          "name": "approved_allocators",
          "type": "0x1::table::Table<address, bool>"
        },
        {
          "name": "router_update",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::RouterRef>>"
        },
        {
          "name": "vaults",
          "type": "vector<address>"
        }
      ]
    },
    {
      "name": "DepositPreview",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "can_deposit",
          "type": "bool"
        },
        {
          "name": "blocking_reasons",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PreviewBlockingReason>"
        },
        {
          "name": "is_sanctioned",
          "type": "bool"
        },
        {
          "name": "is_vault_blocklisted",
          "type": "bool"
        },
        {
          "name": "shares_out",
          "type": "u64"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        },
        {
          "name": "deposit_cap_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "adapter_cap_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "wallet_usage_after",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage"
        },
        {
          "name": "aggregate_usage_after",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage"
        },
        {
          "name": "vault_velocity_check",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityCapCheckResult"
        },
        {
          "name": "mandatory_velocity_check",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityCapCheckResult"
        },
        {
          "name": "is_nav_fresh",
          "type": "bool"
        }
      ]
    },
    {
      "name": "DepositVelocityCapsChangeAppliedEvent",
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
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "DepositVelocityCapsChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "DepositVelocityCapsChangeProposedEvent",
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
          "name": "current_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "proposed_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "DepositVelocityCapsChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "DepositVelocityCapsEmergencyTightenedEvent",
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
          "name": "previous_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "new_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "cleared_pending_velocity_caps",
          "type": "0x1::option::Option<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>"
        },
        {
          "name": "guardian",
          "type": "address"
        }
      ]
    },
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
          "name": "vault",
          "type": "address"
        },
        {
          "name": "user",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "shares_minted",
          "type": "u64"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        }
      ]
    },
    {
      "name": "DepositsPausedEvent",
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
          "name": "paused_by",
          "type": "address"
        },
        {
          "name": "until",
          "type": "u64"
        }
      ]
    },
    {
      "name": "DepositsUnpausedEvent",
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
          "name": "unpaused_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "FeeRecipientBlocklistedWarningEvent",
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
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "blocker",
          "type": "address"
        }
      ]
    },
    {
      "name": "FeeRecipientChangeAppliedEvent",
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
          "name": "old_fee_recipient",
          "type": "address"
        },
        {
          "name": "new_fee_recipient",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "FeeRecipientChangeCancelledEvent",
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
          "name": "cancelled_fee_recipient",
          "type": "address"
        },
        {
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "FeeRecipientChangeProposedEvent",
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
          "name": "current_fee_recipient",
          "type": "address"
        },
        {
          "name": "proposed_fee_recipient",
          "type": "address"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "FeeRecipientChangeVetoedEvent",
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
          "name": "vetoed_fee_recipient",
          "type": "address"
        },
        {
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "ForceProcessQueueCalledEvent",
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
          "name": "caller",
          "type": "address"
        },
        {
          "name": "requests_processed",
          "type": "u64"
        },
        {
          "name": "processed_request_addresses",
          "type": "vector<address>"
        },
        {
          "name": "unserved_amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "FrictionlessThresholdChangeAppliedEvent",
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
          "name": "new_frictionless_threshold",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "FrictionlessThresholdChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "FrictionlessThresholdChangeProposedEvent",
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
          "name": "current_frictionless_threshold",
          "type": "u64"
        },
        {
          "name": "proposed_frictionless_threshold",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "FrictionlessThresholdChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "GlobalGuardianProposalCancelledEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "cancelled_global_guardian",
          "type": "address"
        },
        {
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "GlobalGuardianProposedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "current_global_guardian",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "proposed_global_guardian",
          "type": "address"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "effective_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "GlobalGuardianSetEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "old_global_guardian",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "new_global_guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "GuardianTransferCancelledEvent",
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
          "name": "current_guardian",
          "type": "address"
        },
        {
          "name": "cancelled_guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "GuardianTransferProposedEvent",
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
          "name": "current_guardian",
          "type": "address"
        },
        {
          "name": "proposed_guardian",
          "type": "address"
        },
        {
          "name": "effective_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "GuardianTransferredEvent",
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
          "name": "old_guardian",
          "type": "address"
        },
        {
          "name": "new_guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "IdleBreachResolvedEvent",
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
          "name": "strategy_idle_assets",
          "type": "u64"
        },
        {
          "name": "resolved_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "IdleBreachStartedEvent",
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
          "name": "strategy_idle_assets",
          "type": "u64"
        },
        {
          "name": "max_idle_in_strategy_amount",
          "type": "u64"
        },
        {
          "name": "max_idle_in_strategy_duration",
          "type": "u64"
        },
        {
          "name": "breached_at",
          "type": "u64"
        },
        {
          "name": "blocking_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "IdleLimitChangeAppliedEvent",
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
          "name": "new_idle_limits",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "IdleLimitChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "IdleLimitChangeProposedEvent",
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
          "name": "current_idle_limits",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>"
        },
        {
          "name": "proposed_idle_limits",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "IdleLimitChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "IdleLimits",
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
          "name": "max_idle_in_strategy_amount",
          "type": "u64"
        },
        {
          "name": "max_idle_in_strategy_duration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "InstantRedeemFeeChangeAppliedEvent",
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
          "name": "new_instant_redeem_fee_bps",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "InstantRedeemFeeChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "InstantRedeemFeeChangeProposedEvent",
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
          "name": "current_instant_redeem_fee_bps",
          "type": "u64"
        },
        {
          "name": "proposed_instant_redeem_fee_bps",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "InstantRedeemFeeChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "InstantRedeemFeeSkippedEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "fee_shares_forgone",
          "type": "u64"
        },
        {
          "name": "fee_bps",
          "type": "u64"
        },
        {
          "name": "skipped_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "InstantRedeemPreview",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "can_redeem",
          "type": "bool"
        },
        {
          "name": "blocking_reasons",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PreviewBlockingReason>"
        },
        {
          "name": "is_sanctioned",
          "type": "bool"
        },
        {
          "name": "is_vault_blocklisted",
          "type": "bool"
        },
        {
          "name": "assets_out",
          "type": "u64"
        },
        {
          "name": "fee_shares",
          "type": "u64"
        },
        {
          "name": "fee_bps",
          "type": "u64"
        },
        {
          "name": "instant_buffer_remaining",
          "type": "u64"
        },
        {
          "name": "is_within_frictionless_threshold",
          "type": "bool"
        },
        {
          "name": "wallet_usage_after",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage"
        },
        {
          "name": "aggregate_usage_after",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage"
        },
        {
          "name": "vault_velocity_check",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityCapCheckResult"
        },
        {
          "name": "mandatory_velocity_check",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityCapCheckResult"
        },
        {
          "name": "is_nav_fresh",
          "type": "bool"
        }
      ]
    },
    {
      "name": "InstantRedeemedEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "shares_burned",
          "type": "u64"
        },
        {
          "name": "assets_out",
          "type": "u64"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        },
        {
          "name": "fee_shares",
          "type": "u64"
        },
        {
          "name": "fee_bps",
          "type": "u64"
        }
      ]
    },
    {
      "name": "LiquidityBreakdown",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "unreserved_buffer",
          "type": "u64"
        },
        {
          "name": "reserved_for_queue",
          "type": "u64"
        },
        {
          "name": "strategy_idle_assets",
          "type": "u64"
        },
        {
          "name": "reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "total_assets",
          "type": "u64"
        }
      ]
    },
    {
      "name": "LockDurationChangeAppliedEvent",
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
          "name": "new_lock_duration",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "LockDurationChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "LockDurationChangeProposedEvent",
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
          "name": "current_lock_duration",
          "type": "u64"
        },
        {
          "name": "proposed_lock_duration",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "LockDurationChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "LockedSharesMintedEvent",
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
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "ManagementFeeAccrualSkippedEvent",
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
          "name": "fee_shares_forgone",
          "type": "u64"
        },
        {
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "management_fee_bps",
          "type": "u64"
        },
        {
          "name": "accrued_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "ManagementFeeAccruedEvent",
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
          "name": "fee_shares",
          "type": "u64"
        },
        {
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "management_fee_bps",
          "type": "u64"
        },
        {
          "name": "accrued_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "ManagementFeeChangeAppliedEvent",
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
          "name": "new_management_fee_bps",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "ManagementFeeChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "ManagementFeeChangeProposedEvent",
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
          "name": "current_management_fee_bps",
          "type": "u64"
        },
        {
          "name": "proposed_management_fee_bps",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "ManagementFeeChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "MinDepositAmountChangedEvent",
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
          "name": "old_min_deposit_amount",
          "type": "u64"
        },
        {
          "name": "new_min_deposit_amount",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "Nav24hSharePriceDeviationChangeAppliedEvent",
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
          "name": "new_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "Nav24hSharePriceDeviationChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "Nav24hSharePriceDeviationChangeProposedEvent",
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
          "name": "current_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "proposed_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "Nav24hSharePriceDeviationChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavDeviationThresholdChangeAppliedEvent",
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
          "name": "new_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavDeviationThresholdChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavDeviationThresholdChangeProposedEvent",
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
          "name": "current_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "proposed_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NavDeviationThresholdChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavFreshnessOverrideChangeAppliedEvent",
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
          "name": "new_nav_freshness_override",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavFreshnessOverrideChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavFreshnessOverrideChangeProposedEvent",
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
          "name": "current_nav_freshness_override",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposed_nav_freshness_override",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NavFreshnessOverrideChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavFreshnessTier",
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
          "name": "min_tvl",
          "type": "u64"
        },
        {
          "name": "max_age",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NavOverrideAppliedEvent",
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
          "name": "reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavOverrideCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavOverrideProposedEvent",
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
          "name": "proposed_reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NavOverrideVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "NavSharePriceBand",
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
          "name": "buckets",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::SharePriceBucket>"
        }
      ]
    },
    {
      "name": "NavSharePriceBandView",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "has_samples",
          "type": "bool"
        },
        {
          "name": "low_e18",
          "type": "u128"
        },
        {
          "name": "high_e18",
          "type": "u128"
        },
        {
          "name": "range_bps",
          "type": "u64"
        },
        {
          "name": "threshold_bps",
          "type": "u64"
        },
        {
          "name": "bucket_count",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NavState",
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
          "name": "reported_offchain_nav",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "last_total_strategy_value",
          "type": "u64"
        },
        {
          "name": "last_nav_update_at",
          "type": "u64"
        },
        {
          "name": "last_nav_reporter",
          "type": "address"
        },
        {
          "name": "allocated_since_last_report",
          "type": "u64"
        },
        {
          "name": "deallocated_since_last_report",
          "type": "u64"
        },
        {
          "name": "capital_out_since_last_nav",
          "type": "u64"
        },
        {
          "name": "capital_in_since_last_nav",
          "type": "u64"
        },
        {
          "name": "share_price_band",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavSharePriceBand"
        },
        {
          "name": "pending_movement_idle_before",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "NavUpdatedEvent",
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
          "name": "reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "reporter",
          "type": "address"
        },
        {
          "name": "updated_at",
          "type": "u64"
        },
        {
          "name": "share_price_e18",
          "type": "0x1::option::Option<u128>"
        }
      ]
    },
    {
      "name": "NormalNavReportIntervalChangeAppliedEvent",
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
          "name": "new_normal_nav_report_interval_seconds",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "NormalNavReportIntervalChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "NormalNavReportIntervalChangeProposedEvent",
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
          "name": "current_normal_nav_report_interval_seconds",
          "type": "u64"
        },
        {
          "name": "proposed_normal_nav_report_interval_seconds",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "NormalNavReportIntervalChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "OffchainNavReportCooldownChangeAppliedEvent",
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
          "name": "new_offchain_nav_report_cooldown_seconds",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "OffchainNavReportCooldownChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "OffchainNavReportCooldownChangeProposedEvent",
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
          "name": "current_offchain_nav_report_cooldown_seconds",
          "type": "u64"
        },
        {
          "name": "proposed_offchain_nav_report_cooldown_seconds",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "OffchainNavReportCooldownChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "OwnerTransferCancelledEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "current_owner",
          "type": "address"
        },
        {
          "name": "cancelled_owner",
          "type": "address"
        }
      ]
    },
    {
      "name": "OwnerTransferProposedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "current_owner",
          "type": "address"
        },
        {
          "name": "proposed_owner",
          "type": "address"
        },
        {
          "name": "effective_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "OwnerTransferredEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "old_owner",
          "type": "address"
        },
        {
          "name": "new_owner",
          "type": "address"
        }
      ]
    },
    {
      "name": "PartnerPolicyChangedEvent",
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
          "name": "old_partner_attribution_enabled",
          "type": "bool"
        },
        {
          "name": "new_partner_attribution_enabled",
          "type": "bool"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "PauseState",
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
          "name": "deposits_paused_until",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "redemptions_paused_until",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "PendingRoleTransfer",
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
          "name": "addr",
          "type": "address"
        },
        {
          "name": "proposed_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PerformanceFeeAccrualSkippedEvent",
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
          "name": "fee_shares_forgone",
          "type": "u64"
        },
        {
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "new_hwm_e18",
          "type": "u128"
        },
        {
          "name": "accrued_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PerformanceFeeAccruedEvent",
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
          "name": "fee_shares",
          "type": "u64"
        },
        {
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "new_hwm_e18",
          "type": "u128"
        },
        {
          "name": "accrued_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PerformanceFeeChangeAppliedEvent",
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
          "name": "new_performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "PerformanceFeeChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "PerformanceFeeChangeProposedEvent",
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
          "name": "current_performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "proposed_performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PerformanceFeeChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "PreviewBlockingReason",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "reason_id",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::ReasonId"
        },
        {
          "name": "raw_abort",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PreviewErrorPath"
        }
      ]
    },
    {
      "name": "PreviewErrorPath",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "package_address",
          "type": "address"
        },
        {
          "name": "module_name",
          "type": "0x1::string::String"
        },
        {
          "name": "error_code",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PricingControlChangeAppliedEvent",
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
          "name": "new_pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "new_max_pending_locked_assets",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "PricingControlChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "PricingControlChangeProposedEvent",
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
          "name": "current_pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "proposed_pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "current_max_pending_locked_assets",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposed_max_pending_locked_assets",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "PricingControlChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "PricingPolicy",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": []
    },
    {
      "name": "QueuedRedemptionPreview",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "can_submit",
          "type": "bool"
        },
        {
          "name": "blocking_reasons",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PreviewBlockingReason>"
        },
        {
          "name": "is_sanctioned",
          "type": "bool"
        },
        {
          "name": "is_vault_blocklisted",
          "type": "bool"
        },
        {
          "name": "estimated_assets_out",
          "type": "u64"
        },
        {
          "name": "pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "estimated_claimable_at",
          "type": "u64"
        },
        {
          "name": "request_expiry_at",
          "type": "u64"
        },
        {
          "name": "allocator_sla_seconds",
          "type": "u64"
        },
        {
          "name": "shares_to_escrow",
          "type": "u64"
        }
      ]
    },
    {
      "name": "ReasonId",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": []
    },
    {
      "name": "RecoveryAddressChangeAppliedEvent",
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
          "name": "old_recovery_address",
          "type": "address"
        },
        {
          "name": "new_recovery_address",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "RecoveryAddressChangeCancelledEvent",
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
          "name": "cancelled_recovery_address",
          "type": "address"
        },
        {
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "RecoveryAddressChangeProposedEvent",
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
          "name": "current_recovery_address",
          "type": "address"
        },
        {
          "name": "proposed_recovery_address",
          "type": "address"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RecoveryAddressChangeVetoedEvent",
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
          "name": "vetoed_recovery_address",
          "type": "address"
        },
        {
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "RecoveryCancelledEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "cancelled_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RecoveryExecutedEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "recovery_address",
          "type": "address"
        },
        {
          "name": "shares_recovered",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RecoveryProposedEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "recovery_address",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        },
        {
          "name": "proposed_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionCancelledEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shares_escrowed",
          "type": "u64"
        },
        {
          "name": "cancelled_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionClaimedEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shares_burned",
          "type": "u64"
        },
        {
          "name": "usdc_out",
          "type": "u64"
        },
        {
          "name": "remaining_funded_amount",
          "type": "u64"
        },
        {
          "name": "pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        }
      ]
    },
    {
      "name": "RedemptionDeniedEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shares_escrowed",
          "type": "u64"
        },
        {
          "name": "denied_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionExpiredEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shares_escrowed",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RedemptionFrozenEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "frozen_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionFundedEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "funded_assets_out",
          "type": "u64"
        },
        {
          "name": "funded_at",
          "type": "u64"
        },
        {
          "name": "funded_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionRequestedEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shares_escrowed",
          "type": "u64"
        },
        {
          "name": "usdc_estimate",
          "type": "u64"
        },
        {
          "name": "claimable_at",
          "type": "u64"
        },
        {
          "name": "expires_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RedemptionUnfrozenEvent",
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
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "unfrozen_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionVelocityCapsChangeAppliedEvent",
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
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionVelocityCapsChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionVelocityCapsChangeProposedEvent",
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
          "name": "current_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "proposed_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RedemptionVelocityCapsChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionVelocityCapsEmergencyTightenedEvent",
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
          "name": "previous_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "new_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "cleared_pending_velocity_caps",
          "type": "0x1::option::Option<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>"
        },
        {
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "RedemptionsPausedEvent",
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
          "name": "paused_by",
          "type": "address"
        },
        {
          "name": "until",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RedemptionsUnpausedEvent",
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
          "name": "unpaused_by",
          "type": "address"
        }
      ]
    },
    {
      "name": "ReporterRemovedEvent",
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
          "name": "removed_reporter",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "ReportersChangeAppliedEvent",
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
          "name": "old_reporters",
          "type": "vector<address>"
        },
        {
          "name": "new_reporters",
          "type": "vector<address>"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "ReportersChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "ReportersChangeProposedEvent",
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
          "name": "current_reporters",
          "type": "vector<address>"
        },
        {
          "name": "proposed_reporters",
          "type": "vector<address>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "ReportersChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "RequestExpiryWindowChangeAppliedEvent",
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
          "name": "new_request_expiry_window",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "RequestExpiryWindowChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "RequestExpiryWindowChangeProposedEvent",
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
          "name": "current_request_expiry_window",
          "type": "u64"
        },
        {
          "name": "proposed_request_expiry_window",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RequestExpiryWindowChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "RouterRef",
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
          "name": "router",
          "type": "address"
        }
      ]
    },
    {
      "name": "RouterUpdateAppliedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "old_router",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "new_router",
          "type": "address"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "RouterUpdateCancelledEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "cancelled_router",
          "type": "address"
        },
        {
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "RouterUpdateProposedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "current_router",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "proposed_router",
          "type": "address"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "RouterUpdateVetoedEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vetoed_router",
          "type": "address"
        },
        {
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "SharePriceBandExtremes",
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
          "name": "has_samples",
          "type": "bool"
        },
        {
          "name": "low_e18",
          "type": "u128"
        },
        {
          "name": "high_e18",
          "type": "u128"
        },
        {
          "name": "bucket_count",
          "type": "u64"
        }
      ]
    },
    {
      "name": "SharePriceBucket",
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
          "name": "bucket_epoch",
          "type": "u64"
        },
        {
          "name": "min_share_price_e18",
          "type": "u128"
        },
        {
          "name": "max_share_price_e18",
          "type": "u128"
        }
      ]
    },
    {
      "name": "SharesClaimedBackEvent",
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
          "name": "user",
          "type": "address"
        },
        {
          "name": "request_object_address",
          "type": "address"
        },
        {
          "name": "shares_returned",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StaleNavAction",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": []
    },
    {
      "name": "StaleNavActionChangeAppliedEvent",
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
          "name": "new_stale_nav_action",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "StaleNavActionChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "StaleNavActionChangeProposedEvent",
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
          "name": "current_stale_nav_action",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction"
        },
        {
          "name": "proposed_stale_nav_action",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StaleNavActionChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "StrategyChangeAppliedEvent",
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
          "name": "new_strategy_module_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "new_strategy_object_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "StrategyChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "StrategyChangeProposedEvent",
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
          "name": "proposed_strategy_module_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "proposed_strategy_object_address",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "StrategyChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "StrategyClearability",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "has_strategy",
          "type": "bool"
        },
        {
          "name": "effective_reported_offchain_nav",
          "type": "u64"
        },
        {
          "name": "live_strategy_idle",
          "type": "u64"
        },
        {
          "name": "externally_held_shares",
          "type": "u64"
        },
        {
          "name": "is_clearable",
          "type": "bool"
        }
      ]
    },
    {
      "name": "StrategyConfig",
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
          "name": "module_address",
          "type": "address"
        },
        {
          "name": "object_address",
          "type": "address"
        }
      ]
    },
    {
      "name": "StrategyMovementReceipt",
      "is_native": false,
      "is_event": false,
      "abilities": [],
      "generic_type_params": [],
      "fields": [
        {
          "name": "vault",
          "type": "address"
        },
        {
          "name": "strategy",
          "type": "address"
        }
      ]
    },
    {
      "name": "SystemBounds",
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
          "name": "nav_freshness_tiers",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavFreshnessTier>"
        },
        {
          "name": "mandatory_tier0_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "max_nav_freshness_override",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_frictionless_threshold",
          "type": "u64"
        },
        {
          "name": "min_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "max_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "min_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "max_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "max_management_fee_bps",
          "type": "u64"
        },
        {
          "name": "max_instant_redeem_fee_bps",
          "type": "u64"
        },
        {
          "name": "max_performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "max_pause_duration",
          "type": "u64"
        },
        {
          "name": "min_allocator_sla",
          "type": "u64"
        },
        {
          "name": "min_lock_duration",
          "type": "u64"
        },
        {
          "name": "max_lock_duration",
          "type": "u64"
        }
      ]
    },
    {
      "name": "SystemBoundsSnapshotEvent",
      "is_native": false,
      "is_event": true,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "field_name",
          "type": "0x1::string::String"
        },
        {
          "name": "operation",
          "type": "0x1::string::String"
        },
        {
          "name": "actor",
          "type": "address"
        },
        {
          "name": "nav_freshness_tiers",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavFreshnessTier>"
        },
        {
          "name": "pending_nav_freshness_tiers",
          "type": "0x1::option::Option<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavFreshnessTier>>"
        },
        {
          "name": "pending_nav_freshness_tiers_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "mandatory_tier0_velocity_caps",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>"
        },
        {
          "name": "pending_mandatory_tier0_velocity_caps",
          "type": "0x1::option::Option<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>"
        },
        {
          "name": "pending_mandatory_tier0_velocity_caps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_nav_freshness_override",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_nav_freshness_override",
          "type": "0x1::option::Option<0x1::option::Option<u64>>"
        },
        {
          "name": "pending_max_nav_freshness_override_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_frictionless_threshold",
          "type": "u64"
        },
        {
          "name": "pending_max_frictionless_threshold",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_frictionless_threshold_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "min_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "pending_min_nav_deviation_threshold_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_min_nav_deviation_threshold_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "pending_max_nav_deviation_threshold_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_nav_deviation_threshold_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "min_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "pending_min_nav_24h_share_price_deviation_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_min_nav_24h_share_price_deviation_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "pending_max_nav_24h_share_price_deviation_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_nav_24h_share_price_deviation_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_management_fee_bps",
          "type": "u64"
        },
        {
          "name": "pending_max_management_fee_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_management_fee_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_instant_redeem_fee_bps",
          "type": "u64"
        },
        {
          "name": "pending_max_instant_redeem_fee_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_instant_redeem_fee_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "pending_max_performance_fee_bps",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_performance_fee_bps_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_pause_duration",
          "type": "u64"
        },
        {
          "name": "pending_max_pause_duration",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_pause_duration_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "min_allocator_sla",
          "type": "u64"
        },
        {
          "name": "pending_min_allocator_sla",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_min_allocator_sla_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "min_lock_duration",
          "type": "u64"
        },
        {
          "name": "pending_min_lock_duration",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_min_lock_duration_not_before",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_lock_duration",
          "type": "u64"
        },
        {
          "name": "pending_max_lock_duration",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pending_max_lock_duration_not_before",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "SystemInitializedEvent",
      "is_native": false,
      "is_event": true,
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
          "name": "global_guardian",
          "type": "0x1::option::Option<address>"
        },
        {
          "name": "active_router",
          "type": "0x1::option::Option<address>"
        }
      ]
    },
    {
      "name": "TimelockedSystemBounds",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop",
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "nav_freshness_tiers",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavFreshnessTier>>"
        },
        {
          "name": "mandatory_tier0_velocity_caps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>"
        },
        {
          "name": "max_nav_freshness_override",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<u64>>"
        },
        {
          "name": "max_frictionless_threshold",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "min_nav_deviation_threshold_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_nav_deviation_threshold_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "min_nav_24h_share_price_deviation_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_nav_24h_share_price_deviation_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_management_fee_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_instant_redeem_fee_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_performance_fee_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_pause_duration",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "min_allocator_sla",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "min_lock_duration",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "max_lock_duration",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        }
      ]
    },
    {
      "name": "TransferSanctionsUpdatedEvent",
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
          "name": "enabled",
          "type": "bool"
        },
        {
          "name": "updater",
          "type": "address"
        }
      ]
    },
    {
      "name": "UserPositionView",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "share_balance",
          "type": "u64"
        },
        {
          "name": "share_value",
          "type": "u64"
        },
        {
          "name": "share_price_e18",
          "type": "u128"
        },
        {
          "name": "is_sanctioned",
          "type": "bool"
        },
        {
          "name": "is_vault_blocklisted",
          "type": "bool"
        },
        {
          "name": "ownership_chain_too_deep",
          "type": "bool"
        },
        {
          "name": "open_request_count",
          "type": "u64"
        },
        {
          "name": "deposit_wallet_usage",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage>"
        },
        {
          "name": "redemption_wallet_usage",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityUsage>"
        }
      ]
    },
    {
      "name": "Vault",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "curator",
          "type": "address"
        },
        {
          "name": "pending_curator",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PendingRoleTransfer>"
        },
        {
          "name": "allocator",
          "type": "address"
        },
        {
          "name": "pending_allocator",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PendingRoleTransfer>"
        },
        {
          "name": "guardian",
          "type": "address"
        },
        {
          "name": "pending_guardian",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PendingRoleTransfer>"
        },
        {
          "name": "reporters",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<vector<address>>"
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
          "name": "queue_object",
          "type": "0x1::object::Object<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::queue::RedemptionQueue>"
        },
        {
          "name": "active_strategy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StrategyConfig>>"
        },
        {
          "name": "strategy_idle_breach_since",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "pause_state",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PauseState"
        },
        {
          "name": "config",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VaultConfig"
        },
        {
          "name": "nav_state",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::NavState"
        },
        {
          "name": "total_locked",
          "type": "u64"
        },
        {
          "name": "last_profit_lock_at",
          "type": "u64"
        },
        {
          "name": "pending_locked_assets",
          "type": "u64"
        }
      ]
    },
    {
      "name": "VaultConfig",
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
          "name": "min_deposit_amount",
          "type": "u64"
        },
        {
          "name": "deposit_cap",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<u64>>"
        },
        {
          "name": "adapter_cap",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<u64>>"
        },
        {
          "name": "auto_allocate_on_deposit",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<bool>"
        },
        {
          "name": "partner_attribution_enabled",
          "type": "bool"
        },
        {
          "name": "idle_limits",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>>"
        },
        {
          "name": "frictionless_threshold",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy>"
        },
        {
          "name": "max_pending_locked_assets",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<u64>>"
        },
        {
          "name": "withdrawal_delay_seconds",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "lock_duration",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "nav_freshness_override",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x1::option::Option<u64>>"
        },
        {
          "name": "nav_deviation_threshold_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "nav_24h_share_price_deviation_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "offchain_nav_report_cooldown_seconds",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "normal_nav_report_interval_seconds",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "stale_nav_action",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction>"
        },
        {
          "name": "request_expiry_window",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "allocator_sla_seconds",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "role_change_timelock",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "recovery_address",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<address>"
        },
        {
          "name": "recovery_timelock",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        }
      ]
    },
    {
      "name": "VaultConfigView",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "underlying_metadata",
          "type": "0x1::object::Object<0x1::fungible_asset::Metadata>"
        },
        {
          "name": "min_deposit_amount",
          "type": "u64"
        },
        {
          "name": "deposit_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "adapter_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "max_pending_locked_assets",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "management_fee_bps",
          "type": "u64"
        },
        {
          "name": "instant_redeem_fee_bps",
          "type": "u64"
        },
        {
          "name": "performance_fee_bps",
          "type": "u64"
        },
        {
          "name": "frictionless_threshold",
          "type": "u64"
        },
        {
          "name": "pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "stale_nav_action",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::StaleNavAction"
        },
        {
          "name": "nav_deviation_threshold_bps",
          "type": "u64"
        },
        {
          "name": "nav_24h_share_price_deviation_bps",
          "type": "u64"
        },
        {
          "name": "partner_attribution_enabled",
          "type": "bool"
        },
        {
          "name": "auto_allocate_on_deposit",
          "type": "bool"
        },
        {
          "name": "deposits_paused_until",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "redemptions_paused_until",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "withdrawal_delay_seconds",
          "type": "u64"
        },
        {
          "name": "request_expiry_window",
          "type": "u64"
        },
        {
          "name": "lock_duration",
          "type": "u64"
        },
        {
          "name": "allocator_sla_seconds",
          "type": "u64"
        },
        {
          "name": "idle_limits",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>"
        },
        {
          "name": "normal_nav_report_interval_seconds",
          "type": "u64"
        }
      ]
    },
    {
      "name": "VaultCreatedEvent",
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
          "name": "curator",
          "type": "address"
        },
        {
          "name": "allocator",
          "type": "address"
        },
        {
          "name": "guardian",
          "type": "address"
        },
        {
          "name": "reporters",
          "type": "vector<address>"
        },
        {
          "name": "underlying_metadata",
          "type": "address"
        },
        {
          "name": "pricing_policy",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::PricingPolicy"
        },
        {
          "name": "max_pending_locked_assets",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "deposit_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "adapter_cap",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "idle_limits",
          "type": "0x1::option::Option<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::IdleLimits>"
        },
        {
          "name": "fee_recipient",
          "type": "address"
        },
        {
          "name": "recovery_address",
          "type": "address"
        }
      ]
    },
    {
      "name": "VaultFees",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "fee_recipient",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<address>"
        },
        {
          "name": "management_fee_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "instant_redeem_fee_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "performance_fee_bps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<u64>"
        },
        {
          "name": "high_water_mark_e18",
          "type": "u128"
        },
        {
          "name": "last_fee_accrual_at",
          "type": "u64"
        }
      ]
    },
    {
      "name": "VaultTimelockConfigChangeAppliedEvent",
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
          "name": "new_role_change_timelock",
          "type": "u64"
        },
        {
          "name": "new_recovery_timelock",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "VaultTimelockConfigChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "VaultTimelockConfigChangeProposedEvent",
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
          "name": "current_role_change_timelock",
          "type": "u64"
        },
        {
          "name": "proposed_role_change_timelock",
          "type": "u64"
        },
        {
          "name": "current_recovery_timelock",
          "type": "u64"
        },
        {
          "name": "proposed_recovery_timelock",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "VaultTimelockConfigChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    },
    {
      "name": "VaultVelocityState",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "deposit_per_wallet",
          "type": "0x1::table::Table<address, 0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityState>"
        },
        {
          "name": "deposit_aggregate",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityState"
        },
        {
          "name": "deposit_velocity_caps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>"
        },
        {
          "name": "redemption_per_wallet",
          "type": "0x1::table::Table<address, 0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityState>"
        },
        {
          "name": "redemption_aggregate",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityState"
        },
        {
          "name": "redemption_velocity_caps",
          "type": "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::timelock::TimeLocked<vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityWindowCap>>"
        }
      ]
    },
    {
      "name": "VelocityCapCheckResult",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "passes",
          "type": "bool"
        },
        {
          "name": "wallet_day_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "wallet_week_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "wallet_month_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "aggregate_day_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "aggregate_week_headroom",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "aggregate_month_headroom",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "VelocityRecord",
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
          "name": "bucket_epoch",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u128"
        }
      ]
    },
    {
      "name": "VelocityState",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "store"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "day",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityRecord>"
        },
        {
          "name": "week",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityRecord>"
        },
        {
          "name": "month",
          "type": "vector<0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2::vault::VelocityRecord>"
        }
      ]
    },
    {
      "name": "VelocityUsage",
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
          "name": "day",
          "type": "u64"
        },
        {
          "name": "week",
          "type": "u64"
        },
        {
          "name": "month",
          "type": "u64"
        }
      ]
    },
    {
      "name": "VelocityUsageU128",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "copy",
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "day",
          "type": "u128"
        },
        {
          "name": "week",
          "type": "u128"
        },
        {
          "name": "month",
          "type": "u128"
        }
      ]
    },
    {
      "name": "VelocityWindowCap",
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
          "name": "per_wallet_cap_amount",
          "type": "0x1::option::Option<u64>"
        },
        {
          "name": "aggregate_cap_amount",
          "type": "0x1::option::Option<u64>"
        }
      ]
    },
    {
      "name": "WithdrawalDelayChangeAppliedEvent",
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
          "name": "new_withdrawal_delay_seconds",
          "type": "u64"
        },
        {
          "name": "executor",
          "type": "address"
        }
      ]
    },
    {
      "name": "WithdrawalDelayChangeCancelledEvent",
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
          "name": "canceller",
          "type": "address"
        }
      ]
    },
    {
      "name": "WithdrawalDelayChangeProposedEvent",
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
          "name": "current_withdrawal_delay_seconds",
          "type": "u64"
        },
        {
          "name": "proposed_withdrawal_delay_seconds",
          "type": "u64"
        },
        {
          "name": "proposer",
          "type": "address"
        },
        {
          "name": "not_before",
          "type": "u64"
        }
      ]
    },
    {
      "name": "WithdrawalDelayChangeVetoedEvent",
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
          "name": "guardian",
          "type": "address"
        }
      ]
    }
  ]
} as const;
