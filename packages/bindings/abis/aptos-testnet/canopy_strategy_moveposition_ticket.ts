export const ABI = {
  "address": "0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab",
  "name": "ticket",
  "friends": [],
  "exposed_functions": [
    {
      "name": "amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "deserialize",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "vector<u8>"
      ],
      "return": [
        "0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket"
      ]
    },
    {
      "name": "get_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "validate_amount",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket",
        "u64"
      ],
      "return": []
    },
    {
      "name": "validate_coin_type",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [
        {
          "constraints": []
        }
      ],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket"
      ],
      "return": []
    },
    {
      "name": "validate_operation",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket",
        "0x1::string::String"
      ],
      "return": []
    },
    {
      "name": "validate_portfolio_collaterals",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket",
        "&0x1::simple_map::SimpleMap<0x1::string::String, u64>"
      ],
      "return": []
    },
    {
      "name": "validate_portfolio_liabilities",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket",
        "&0x1::simple_map::SimpleMap<0x1::string::String, u64>"
      ],
      "return": []
    },
    {
      "name": "validate_user",
      "visibility": "public",
      "is_entry": false,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::BasicTicket",
        "address"
      ],
      "return": []
    }
  ],
  "structs": [
    {
      "name": "BasicTicket",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "operation",
          "type": "0x1::string::String"
        },
        {
          "name": "user",
          "type": "address"
        },
        {
          "name": "coin_type",
          "type": "0x1::string::String"
        },
        {
          "name": "portfolio_snapshot",
          "type": "0x374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab::ticket::PortfolioSnapshot"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "variants": []
    },
    {
      "name": "PortfolioSnapshot",
      "is_native": false,
      "is_event": false,
      "is_enum": false,
      "abilities": [
        "drop"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "liabilities",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, u64>"
        },
        {
          "name": "collaterals",
          "type": "0x1::simple_map::SimpleMap<0x1::string::String, u64>"
        }
      ],
      "variants": []
    }
  ]
} as const;
