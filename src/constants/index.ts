/**
 * Network Configuration
 */
export const DEFAULT_CHAIN_ID = 126; // Movement mainnet

/**
 * GraphQL API Configuration
 */
export const GRAPHQL_ENDPOINT =
  "https://rwf3uyiewzdnhavtega3imkynm.appsync-api.us-east-1.amazonaws.com/graphql";

/**
 * Sentio Multi-Rewards API Configuration
 */
export const SENTIO_MULTI_REWARDS_ENDPOINT =
  "https://app.sentio.xyz/api/v1/graphql/solo-labs/canopy-multi-rewards-movement";

export const DEFAULT_MIN_SHARES_OUT = "0";
export const DEFAULT_MAX_LOSS = "100";

/**
 * Withdrawal Configuration
 */
export const WITHDRAW_MIN_AMOUNT_OUT = "0";
export const WITHDRAW_MIN_AMOUNT_OUT_MOVEPOSITION = "100";

/**
 * Transaction Defaults
 */
export const EMPTY_STRATEGIES: string[] = [];
export const EMPTY_PACKETS: Uint8Array[] = [];

/**
 * Cache Configuration
 */
export const CACHE_TIMEOUT_MS = 60000; // 1 minute in milliseconds

/**
 * Network Names
 */
export const NETWORK_TYPES = {
  MOVEMENT_MAINNET: "movement-mainnet",
} as const;

export type NetworkType = (typeof NETWORK_TYPES)[keyof typeof NETWORK_TYPES];

/**
 * Network API Names
 */
export const NETWORK_API_NAMES = {
  [NETWORK_TYPES.MOVEMENT_MAINNET]: "movement-mainnet",
  DEFAULT: "aptos",
} as const;

/**
 * MovePosition API Configuration
 */
export const MOVEPOSITION_API_ENDPOINTS = {
  PORTFOLIOS: "/portfolios/",
  BROKERS_LEND: "/brokers/lend/v2",
  BROKERS_REDEEM: "/brokers/redeem/v2",
} as const;

export const MOVEPOSITION_OPERATIONS = {
  LEND: "lend",
  REDEEM: "redeem",
} as const;

/**
 * Investment Types
 */
export const INVESTMENT_TYPES = {
  YIELD_FARMING: "yield-farming",
  STAKING: "staking",
  LENDING: "lending",
  LIQUIDITY: "liquidity",
} as const;

/**
 * Risk Scores
 */
export const RISK_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
} as const;

/**
 * API Operation Names
 */
export const GQL_OPERATIONS = {
  GET_CANOPY_METADATA: "GetCanopyMetadata",
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  APTOS_CLIENT_REQUIRED: "Aptos client is required",
  VAULT_ADDRESS_REQUIRED: "Vault address is required and must be a string",
  VAULT_ADDRESS_FORMAT: "Vault address must start with 0x",
  STRATEGY_ADDRESS_REQUIRED:
    "Strategy address is required and must be a string",
  INVALID_VAULT_ADDRESS_FORMAT: "Invalid vault address format",
  INVALID_USER_ADDRESS_FORMAT: "Invalid user address format",
  INVALID_TOKEN_ADDRESS_FORMAT: "Invalid token address format",
  INVALID_POOL_ADDRESS_FORMAT: "Invalid pool address format",
  USER_ADDRESS_REQUIRED: "User address is required and must be a string",
  TOKEN_ADDRESS_REQUIRED: "Token address is required and must be a string",
  POOL_ADDRESS_REQUIRED: "Pool address is required and must be a string",
  INVALID_INPUT_FORMAT: "Invalid input format",
  VAULT_PAUSED: "Vault is currently paused and cannot accept transactions",
  VAULT_NOT_FOUND: "Vault not found or inaccessible",
  FAILED_TO_DETECT_VAULT: "Failed to detect vault type",
  FAILED_TO_GET_VAULT_DETAILS: "Failed to get vault details",
  FAILED_TO_GET_VAULTS_LIST: "Failed to get vaults list",
  FAILED_TO_GET_STRATEGY_DETAILS: "Failed to get strategy details",
  FAILED_TO_GET_ENRICHED_DATA: "Failed to get enriched vault data",
  FAILED_TO_FETCH_METADATA: "Failed to fetch vault metadata from GraphQL API",
  AMOUNT_TOO_SMALL: "amount must be greater than zero",
  AMOUNT_MUST_BE_BIGINT: "amount must be a bigint",
  DEPOSIT_FAILED: "Deposit failed",
  WITHDRAWAL_FAILED: "Withdrawal failed",
  MOVEPOSITION_API_ERROR: "Failed to communicate with MovePosition API",
  MOVEPOSITION_CONFIG_MISSING: "MovePosition configuration is missing",
  MOVEPOSITION_BROKER_NOT_FOUND: "MovePosition broker not found for token",
  PACKET_GENERATION_FAILED: "Failed to generate MovePosition packet",
  PORTFOLIO_FETCH_FAILED: "Failed to fetch portfolio data from MovePosition",
} as const;

/**
 * HTTP Configuration
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  APPLICATION_JSON: "application/json",
} as const;

export const ECHELON_SIMPLE_CONCRETE_ADDRESS =
  "0x5d2b6a8b6478d86f62c9d3378e2a1fa265e85e69046946632d1fecae1940e851";
export const MERIDIAN_SIMPLE_CONCRETE_ADDRESS =
  "0x133b23036f4ac78279fd4cc75b798ccfe2d3c002585049d7483230653b924b7d";
export const LAYERBANK_SIMPLE_CONCRETE_ADDRESS =
  "0xad1b34939f164ec6f6c0157da3a30bf9e5d408250978691872a79aa584852b85";
export const MOVEPOSITION_SIMPLE_CONCRETE_ADDRESS =
  "0xd7c7b27e361434e18d2410fd02f7140a8c10d174c9be0efd5324578d243953bd";

export const MAINNET_MOVEVEPOSITION_NAMES_MAP: { [key: string]: string } = {
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::MOVE":
    "movement-move-fa",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::USDC":
    "movement-usdc",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::USDt":
    "movement-usdt",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::WETH":
    "movement-weth",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::WBTC":
    "movement-wbtc",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::EZETH":
    "movement-ezeth",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::RSETH":
    "movement-rseth",
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::STBTC":
    "movement-stbtc",
};

const MAINNET_MOVE_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::MOVE";
const MAINNET_USDC_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::USDC";
const MAINNET_USDT_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::USDt";
const MAINNET_WETH_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::WETH";
const MAINNET_WBTC_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::WBTC";
const MAINNET_EZETH_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::EZETH";
const MAINNET_RSETH_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::RSETH";
const MAINNET_STBTC_VIRTUAL =
  "0xccd2621d2897d407e06d18e6ebe3be0e6d9b61f1e809dd49360522b9105812cf::coins::STBTC";

const MAINNET_MOVE_FA =
  "0x000000000000000000000000000000000000000000000000000000000000000a";
const MAINNET_USDC_FA =
  "0x83121c9f9b0527d1f056e21a950d6bf3b9e9e2e8353d0e95ccea726713cbea39";
const MAINNET_WETH_FA =
  "0x908828f4fb0213d4034c3ded1630bbd904e8a3a6bf3c63270887f0b06653a376";
const MAINNET_WBTC_FA =
  "0xb06f29f24dde9c6daeec1f930f14a441a8d6c0fbea590725e88b340af3e1939c";
const MAINNET_USDT_FA =
  "0x447721a30109c662dde9c73a0c2c9c9c459fb5e5a9c92f03c50fa69737f5d08d";
const MAINNET_EZETH_FA =
  "0x2f6af255328fe11b88d840d1e367e946ccd16bd7ebddd6ee7e2ef9f7ae0c53ef";
const MAINNET_RSETH_FA =
  "0x51ffc9885233adf3dd411078cad57535ed1982013dc82d9d6c433a55f2e0035d";
const MAINNET_STBTC_FA =
  "0x95c0fd13373299ada1b9f09ff62473ab8b3908e6a30011730210c141dffdc990";

export const MAINNET_MOVEVEPOSITION_VIRTUAL_COIN_MAP: {
  [key: string]: string;
} = {
  [MAINNET_MOVE_FA]: MAINNET_MOVE_VIRTUAL,
  [MAINNET_USDC_FA]: MAINNET_USDC_VIRTUAL,
  [MAINNET_USDT_FA]: MAINNET_USDT_VIRTUAL,
  [MAINNET_WETH_FA]: MAINNET_WETH_VIRTUAL,
  [MAINNET_WBTC_FA]: MAINNET_WBTC_VIRTUAL,
  [MAINNET_EZETH_FA]: MAINNET_EZETH_VIRTUAL,
  [MAINNET_RSETH_FA]: MAINNET_RSETH_VIRTUAL,
  [MAINNET_STBTC_FA]: MAINNET_STBTC_VIRTUAL,
};
