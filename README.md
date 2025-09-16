# Canopy SDK

TypeScript SDK for integrating Canopy Protocol vaults into your dApp.

## Features

- 🏦 **Vault Operations** - Deposit and withdraw from Canopy vaults
- 💰 **Staking & Rewards** - Stake LP tokens and claim rewards
- 🔍 **View Functions** - Query vault data and user positions
- 🎯 **Simple API** - Auto-detects token types, handles complexity internally
- ⚡ **Movement Network** - Optimized for Movement mainnet

## Installation

```bash
npm install @canopyhub/canopy-sdk
# or
yarn add @canopyhub/canopy-sdk
# or
bun add @canopyhub/canopy-sdk
```

## Quick Start

```typescript
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { CanopyClient } from "@canopyhub/canopy-sdk";

// Initialize Aptos client for Movement Network
const aptos = new Aptos(
  new AptosConfig({
    network: Network.CUSTOM,
    fullnode: "https://mainnet.movementnetwork.xyz/v1",
  })
);

// Create Canopy client
const canopyClient = new CanopyClient(aptos, {
  network: "movement-mainnet", // optional, defaults to movement-mainnet
  sentioApiKey: "your-sentio-api-key", // optional, for staking pool data
});

// Fetch available vaults
const vaults = await canopyClient.getVaults();

// Deposit into a vault
const depositPayload = await canopyClient.deposit(
  "0x123...", // vault address
  1000000000n // amount with decimals
);

// Submit transaction (using wallet adapter)
await signAndSubmitTransaction({ data: depositPayload });
```

## Core Functions

### Vault Operations

```typescript
// Deposit funds into a vault
const payload = await canopyClient.deposit(vaultAddress, amount);

// Withdraw from a vault
const payload = await canopyClient.withdraw(vaultAddress, shares);

// Get all vaults
const vaults = await canopyClient.getVaults();

// Get specific vault details
const vault = await canopyClient.getVault(vaultAddress);
```

### Staking Operations

```typescript
// Stake vault shares into reward pools
// stakingToken should be the vault's shares token (vault.token1)
// userAddress is optional for subscription checking
// poolAddresses is optional - provide specific pool addresses to skip auto-discovery

const vault = await canopyClient.getVault(vaultAddress);
const payload = await canopyClient.stake(
  vault.token1, // Maybe easier to understand it like this? Alternatively, we can make the VaultData object the input, to ensure ONLY a vault token will be used in this SDK
  amount,
  userAddress,
  poolAddresses
);

// Unstake tokens (auto-detects coin vs FA based on format)
// Fungible Asset: "0x123..."
// Coin Type: "0x1::aptos_coin::AptosCoin"
// Whhat is tokenAddress? same as stakingToken/vault.token1?
const payload = await canopyClient.unstake(tokenAddress, amount);

// Claim all pending rewards for multiple staking tokens
// Rename stakingToken from earlier to stakingToken1, to make it easier to understand we're talking about the same. Or again use vault.token1 here.
const payload = await canopyClient.claimRewards([stakingToken1, stakingToken2]);
```

### View Functions

```typescript
// Get user's complete staking position
const position = await canopyClient.getUserStakingPosition(
  userAddress,
  stakingToken
);
// Returns: { totalStaked, subscribedPools, pendingRewards }

// Get user's staked balance only
const balance = await canopyClient.getUserStakedBalance(
  userAddress,
  stakingToken
);

// Get earned rewards for a specific pool
// Where do we get this pool address from? Is auto-discovery also available here?
const earned = await canopyClient.getUserEarned(userAddress, pool, rewardToken);
```

## React Example

See the [examples/react](./examples/react) directory for a complete working application showing:

- Wallet connection with Aptos Wallet Adapter
- Depositing and withdrawing from vaults
- Vault selection and shares staking workflow
- Staking vault shares, unstaking, and claiming rewards
- Displaying vault shares balance, staked balance, and earned rewards

To run the example:

```bash
cd examples/react
npm install
npm run dev
```

## Decimal Handling

All amounts in the SDK use `bigint` with full decimal precision. You need to scale your values:

// Probably too much to add now, but maybe for backlog. Would it make sense to instead of decimals, have the tokenAddress as input. We can get decimals from metadata.

```typescript
// Helper functions for decimal conversion
function scaleToDecimals(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

function scaleFromDecimals(amount: bigint, decimals: number): string {
  const str = amount.toString().padStart(decimals + 1, "0");
  const whole = str.slice(0, -decimals) || "0";
  const fraction = str.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

// Example: Deposit 10.5 tokens (with 8 decimals)
const amount = scaleToDecimals("10.5", 8); // 1050000000n
const payload = await canopyClient.deposit(vaultAddress, amount);
```

## Staking Pool Resolution

The SDK uses a multi-layer approach to find staking pools for your tokens, ensuring reliability even without API access:

### Layer 1: Direct Pool Addresses

```typescript
// Provide specific pool addresses directly
const poolAddresses = ["0xpool1...", "0xpool2..."];
const payload = await canopyClient.stake(
  stakingToken,
  amount,
  userAddress,
  poolAddresses
);
```

### Layer 2: Static Mapping Fallback
// Add a reminder to keep this SDK up to date for user relying on this static mapping, as newer pools might be added in a recent SDK version.
Built-in mappings for common staking tokens. The SDK automatically checks these when no pool addresses are provided.

// Should the API come before the static fallback (which is incomplete and maybe outdated in the future?)
### Layer 3: GraphQL API (Requires API Key)

```typescript
const canopyClient = new CanopyClient(aptos, {
  sentioApiKey: "your-sentio-api-key", // For dynamic pool discovery
});
```

### Layer 4: Error Messages

If all layers fail, you'll get a error explaining your options:

```
"No staking pools found for token. Options: 1) Provide poolAddresses parameter, 2) Ensure staking token is in static mapping, 3) Provide sentioApiKey for dynamic lookup"
```

**For Production Use:** We recommend using Layer 1 (direct pool addresses) for the most reliable and fastest staking operations.

## External Data Integration

The SDK provides on-chain data. For complete dApp integration, combine with external APIs for:

- **APY/APR** - Real-time yield calculations
- **TVL in USD** - Vault total value locked in dollars
- **Token Prices** - For displaying USD values

Calculate user's vault position value:

```typescript
// Get on-chain data
const vault = await canopyClient.getVault(vaultAddress);
// Is this not implemented yet? It's a bit confusing, why wouldn't this be a part of the SDK, it's quite simple to get a FA balance for a user right?
const userShares = await getUserVaultShares(userAddress, vaultAddress); // You need to implement this

// Get external data
// Maybe add a comment here saying fetchTVLFromAPI is not part of the SDK.
const tvlUSD = await fetchTVLFromAPI(vaultAddress);

// Calculate user's position value
const userValueUSD = (userShares / vault.totalSupply) * tvlUSD;
```

## Transaction Submission

The SDK returns transaction payloads. Submit them using your preferred method:

### With Aptos Wallet Adapter (React)

```typescript
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { signAndSubmitTransaction } = useWallet();

const payload = await canopyClient.deposit(vaultAddress, amount);
const response = await signAndSubmitTransaction({ data: payload });
```

### Direct with Aptos SDK

```typescript
const payload = await canopyClient.deposit(vaultAddress, amount);
const transaction = await aptos.transaction.build.simple({
  sender: account.address,
  data: payload,
});
const response = await aptos.signAndSubmitTransaction({
  signer: account,
  transaction,
});
```

## Error Handling

The SDK throws `CanopyError` with specific error codes:

```typescript
import { CanopyError, CanopyErrorCode } from "@canopyhub/canopy-sdk";

try {
  await canopyClient.deposit(vaultAddress, amount);
} catch (error) {
  if (error instanceof CanopyError) {
    switch (error.code) {
      case CanopyErrorCode.VAULT_NOT_FOUND:
        console.error("Vault doesn't exist");
        break;
      case CanopyErrorCode.AMOUNT_TOO_SMALL:
        console.error("Amount must be greater than zero");
        break;
      case CanopyErrorCode.TRANSACTION_BUILD_FAILED:
        console.error("Failed to build transaction");
        break;
      case CanopyErrorCode.NETWORK_ERROR:
        console.error("Network or API error");
        break;
      case CanopyErrorCode.STAKING_POOLS_NOT_FOUND:
        console.error(
          "No staking pools found - check pool addresses or API key"
        );
        break;
    }
  } else {
    // Handle GraphQL API errors, network timeouts, etc.
    console.error("Unexpected error:", error.message);
  }
}
```

## Requirements

- Node.js 20+
- TypeScript 4.5+
- `@aptos-labs/ts-sdk` ^4.0.0

## Development

```bash
# Install dependencies
yarn install

# Build the SDK
yarn build

# Run in development mode
yarn dev

# Type check
yarn typecheck

# Lint
yarn lint
```

## Support

- [GitHub Issues](https://github.com/Canopyxyz/canopy-sdk/issues)

## License

MIT
