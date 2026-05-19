export const ABI = {
  "address": "0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83",
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
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "withdraw",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "u64",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "create_vault",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x88def51006db6ae8f90051a1531d1b43877eeb233f4c0d99dcb24f49cd27ad5b::pool::Pool>",
        "bool",
        "0x1::option::Option<u64>"
      ],
      "return": []
    },
    {
      "name": "donate_quote",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "recover_assets",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "0x1::object::Object<0x1::fungible_asset::Metadata>"
      ],
      "return": []
    },
    {
      "name": "batch_recover_assets",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "vector<0x1::object::Object<0x1::fungible_asset::Metadata>>"
      ],
      "return": []
    },
    {
      "name": "deposit_coin",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "donate_quote_coin",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "rebalance_with_liquidity",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "vector<u64>",
        "vector<bool>",
        "vector<u64>",
        "vector<bool>",
        "vector<u64>",
        "u64",
        "bool",
        "bool",
        "u64"
      ],
      "return": []
    },
    {
      "name": "rebalance_with_liquidity_with_checks",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "vector<u64>",
        "vector<bool>",
        "vector<u64>",
        "vector<bool>",
        "vector<u64>",
        "u64",
        "bool",
        "bool",
        "u64",
        "u64",
        "bool",
        "u64",
        "u64"
      ],
      "return": []
    },
    {
      "name": "rebalance_zero_liquidity",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "vector<bool>",
        "vector<u64>",
        "vector<bool>",
        "vector<u64>",
        "u64",
        "bool",
        "bool",
        "u64"
      ],
      "return": []
    },
    {
      "name": "rebalance_zero_liquidity_with_checks",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "0x1::object::Object<0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83::ichi_vault_meridian::Vault>",
        "vector<bool>",
        "vector<u64>",
        "vector<bool>",
        "vector<u64>",
        "u64",
        "bool",
        "bool",
        "u64",
        "u64",
        "bool",
        "u64",
        "u64"
      ],
      "return": []
    }
  ],
  "structs": []
} as const;
