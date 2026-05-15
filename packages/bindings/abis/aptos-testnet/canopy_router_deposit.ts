export const ABI = {
  "address": "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9",
  "name": "deposit",
  "friends": [
    "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9::router"
  ],
  "exposed_functions": [
    {
      "name": "deploy_coin_funds",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "0x1::simple_map::SimpleMap<0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>, vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "deploy_fa_funds",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "0x1::simple_map::SimpleMap<0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>, vector<u8>>"
      ],
      "return": []
    },
    {
      "name": "deposit_coin",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::option::Option<vector<u8>>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "deposit_fa",
      "visibility": "friend",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault::Vault>",
        "0x1::object::Object<0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::base_strategy::BaseStrategy>",
        "0x1::option::Option<vector<u8>>",
        "u64"
      ],
      "return": []
    },
    {
      "name": "get_allocations_view",
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
    }
  ],
  "structs": []
} as const;
