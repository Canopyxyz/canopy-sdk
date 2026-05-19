export const ABI = {
  "address": "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9",
  "name": "withdraw",
  "friends": [
    "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router"
  ],
  "exposed_functions": [
    {
      "name": "get_withdrawal_map",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "&0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::WithdrawalRequest"
      ],
      "return": [
        "0x1::simple_map::SimpleMap<0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>, u64>"
      ]
    },
    {
      "name": "get_withdrawal_map_view",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "u64"
      ],
      "return": [
        "0x1::simple_map::SimpleMap<0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>, u64>"
      ]
    },
    {
      "name": "withdraw_coin",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "&mut 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::WithdrawalRequest",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::option::Option<vector<u8>>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::hot_coin::HotCoin<T0>"
      ]
    },
    {
      "name": "withdraw_fa",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "&mut 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::WithdrawalRequest",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::option::Option<vector<u8>>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::hot_asset::HotAsset"
      ]
    },
    {
      "name": "withdraw_fa_with_coin_type",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&signer",
        "&mut 0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::WithdrawalRequest",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::option::Option<vector<u8>>",
        "u64",
        "0x1::option::Option<u64>"
      ],
      "return": [
        "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::hot_asset::HotAsset"
      ]
    }
  ],
  "structs": []
} as const;
