# Canopy SDK

TypeScript SDK for integrating Canopy Protocol into your dApp.

## Features

- **Canopy Vaults** — Deposit, withdraw, and query vault positions
- **Staking & Rewards** — Stake vault shares into reward pools and claim rewards
- **ALM Vaults** — Interact with Meridian concentrated liquidity vaults
- **Multi-chain** — Movement mainnet, Movement testnet, Aptos mainnet, Aptos testnet
- **Pool Discovery** — Static mappings + optional Sentio GraphQL fallback

## Installation

```bash
npm install @canopyhub/canopy-sdk
# or
pnpm add @canopyhub/canopy-sdk
```

## Quick Start

```typescript
import { Movement, MovementConfig, Network } from "@moveindustries/ts-sdk";
import { CanopySdk } from "@canopyhub/canopy-sdk";

const client = new Movement(
  new MovementConfig({
    network: Network.CUSTOM,
    fullnode: "https://mainnet.movementnetwork.xyz/v1",
  })
);

const sdk = new CanopySdk(client, {
  chain: "movement-mainnet",
  offchain: {
    sentioApiKey: "your-sentio-api-key", // optional, enables dynamic pool discovery
  },
});
```

On `movement-mainnet`, all three protocol clients are available:
`sdk.canopy`, `sdk.rewards`, and `sdk.alm.meridian`.

## Canopy Vaults

```typescript
// List vaults
const { vaults } = await sdk.canopy.listVaults({ limit: 50, offset: 0 });

// Get a single vault
const vault = await sdk.canopy.getVault(vaultAddress);
// vault: { vaultAddress, assetAddress, sharesAddress, assetName, sharesName,
//          decimals, totalAsset, totalShares, strategies, ... }

// Get user position
const position = await sdk.canopy.getUserVaultPosition(userAddress, vaultAddress);
// position: { sharesBalance, assetValue, userAddress, vaultAddress }

// Build deposit payload
const payload = await sdk.canopy.buildDepositPayload({
  vaultAddress,
  amount: 1_000_000_000n, // with decimals
  minSharesOut: 0n,
});

// Build withdraw payload
const payload = await sdk.canopy.buildWithdrawPayload({
  vaultAddress,
  shares: 1_000_000_000n,
  maxLossBps: 0n,
  minAmountOut: 0n,
});
```

## Staking & Rewards

```typescript
// Stake vault shares (auto-discovers pools via Sentio or static fallback)
const payload = await sdk.rewards.buildStakeVaultSharesPayload({
  stakingAsset: vault.sharesAddress,
  amount: 1_000_000_000n,
  userAddress,          // optional: filters out already-subscribed pools
  poolAddresses: [...], // optional: skip auto-discovery
});

// Unstake
const payload = sdk.rewards.buildWithdrawAssetPayload({
  stakingAsset: vault.sharesAddress,
  amount: 1_000_000_000n,
});

// Claim rewards
const payload = sdk.rewards.buildClaimRewardsPayload({
  rewardTokenAddresses: ["0x..."],
});

// Get full staking position
const position = await sdk.rewards.getUserStakingPosition({
  userAddress,
  stakingAsset: vault.sharesAddress,
});
// position: { totalStaked, subscribedPools, pendingRewards, stakingAsset }
// pendingRewards: [{ amount, poolAddress, rewardTokenAddress }]
```

## ALM Vaults (Meridian)

Available on `movement-mainnet` and `aptos-mainnet`.

```typescript
// List all registered ALM vault addresses
const addresses = await sdk.alm.meridian.listVaults({ limit: 50, offset: 0 });

// Get vault details
const vault = await sdk.alm.meridian.getVaultSummary(vaultAddress);
// vault: { vaultAddress, depositAssetAddress, quoteAssetAddress,
//          depositAssetDecimals, quoteAssetDecimals, shareDecimals,
//          sharePriceE18, totalHoldings, depositIsAsset0 }

// Get user position
const position = await sdk.alm.meridian.getUserVaultPosition(vaultAddress, userAddress);
// position: { shares, valueE18, vaultAddress }

// Build deposit payload
const payload = sdk.alm.meridian.buildDepositPayload({
  vaultAddress,
  amount: 1_000_000_000n,
  minSharesOut: 0n,
});

// Build withdraw payload
const payload = sdk.alm.meridian.buildWithdrawPayload({
  vaultAddress,
  shares: 1_000_000_000n,
  maxLossBps: 0n,
  minAmountOut: 0n,
});
```

## Submitting Transactions

All `build*Payload` methods return a payload object. Submit it with your wallet:

```typescript
// With @aptos-labs/wallet-adapter-react
const { signAndSubmitTransaction } = useWallet();
const payload = await sdk.canopy.buildDepositPayload({ ... });
const response = await signAndSubmitTransaction({ data: payload });
```

## Staking Pool Discovery

The SDK resolves staking pools in priority order:

1. **Explicit** — pass `poolAddresses` directly to `buildStakeVaultSharesPayload`
2. **Sentio GraphQL** — dynamic lookup, requires `sentioApiKey` in options
3. **Static mapping** — built-in fallback table covering known pools when Sentio is unavailable or returns no match

For production, prefer passing pool addresses explicitly or provide `sentioApiKey`; the static mapping is a fallback safety net.

## Chain Support

| Chain | Canopy Vaults | Rewards | ALM (Meridian) |
|---|---|---|---|
| `movement-mainnet` | ✓ | ✓ | ✓ |
| `movement-testnet` | — | — | — |
| `aptos-testnet` | ✓ | ✓ | — |
| `aptos-mainnet` | — | — | ✓ |

## Deployment Addresses

```typescript
import { getDeployment } from "@canopyhub/canopy-sdk/deployments";

const deployment = getDeployment("movement-mainnet");
// deployment.canopy.core, deployment.canopy.router, deployment.rewards.module, ...
```

## Contract And ABI Lookup

```typescript
import {
  getContract,
  requireContract,
  type ContractId,
} from "@canopyhub/canopy-sdk";
import { getContractAddress } from "@canopyhub/canopy-sdk/deployments";
import { requireAbi } from "@canopyhub/canopy-sdk/bindings";

const chain = "movement-mainnet";
const contractId: ContractId = "canopy.router";

const maybeAddress = getContractAddress(chain, contractId);
const abi = requireAbi(chain, contractId);
const resolved = requireContract(chain, contractId);
const maybeResolved = getContract("movement-testnet", contractId);

// resolved: { id, chain, address, abi, moduleName }
// maybeResolved: null when the contract is not deployed on that supported chain
```

## Strategy Helpers

```typescript
import {
  getCanopyStrategyContract,
  getCanopyStrategyContractId,
  getCanopyStrategyDisplayName,
  inferCanopyStrategyProtocol,
  requireCanopyStrategyContract,
} from "@canopyhub/canopy-sdk";

const protocol = inferCanopyStrategyProtocol(
  "movement-mainnet",
  "0xad1b34939f164ec6f6c0157da3a30bf9e5d408250978691872a79aa584852b85"
);

if (protocol) {
  const contractId = getCanopyStrategyContractId(protocol);
  const displayName = getCanopyStrategyDisplayName(protocol);
  const maybeContract = getCanopyStrategyContract("movement-mainnet", protocol);
  const contract = requireCanopyStrategyContract("movement-mainnet", protocol);
}
```

## Shared Address Type

```typescript
import type { HexString } from "@canopyhub/canopy-sdk/core";
import { normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";

const userAddress: HexString = normalizeMoveAddress("0x1");
```

## Missing Deployment Semantics

Lookup-style APIs follow one rule consistently:

- `get*` returns `undefined` or `null` when the chain is supported but the deployment or ABI is missing
- `require*` throws when the chain is supported but the deployment or ABI is missing
- unsupported chain names throw explicit errors rather than silently returning empty values

```typescript
import { getContractAddress, requireContractAddress } from "@canopyhub/canopy-sdk/deployments";

const maybeRouter = getContractAddress("movement-testnet", "canopy.router");
// undefined: movement-testnet is supported, but Canopy is not deployed there

try {
  requireContractAddress("movement-testnet", "canopy.router");
} catch (error) {
  console.error(error);
}
```

## CLI-Style Consumption

```typescript
import type { HexString } from "@canopyhub/canopy-sdk/core";
import { requireContract, inferCanopyStrategyProtocol } from "@canopyhub/canopy-sdk";
import { getContractAddress } from "@canopyhub/canopy-sdk/deployments";
import { requireAbi } from "@canopyhub/canopy-sdk/bindings";

const vaultAddress = getContractAddress("movement-mainnet", "canopy.vault");
const vaultContract = requireContract("movement-mainnet", "canopy.vault");
const vaultAbi = requireAbi("movement-mainnet", "canopy.vault");

const strategyAddress = "0xad1b34939f164ec6f6c0157da3a30bf9e5d408250978691872a79aa584852b85" as HexString;
const strategyProtocol = inferCanopyStrategyProtocol("movement-mainnet", strategyAddress);
```

## Error Handling

```typescript
import { CanopyError, CanopyErrorCode } from "@canopyhub/canopy-sdk/core";

try {
  await sdk.canopy.buildDepositPayload({ ... });
} catch (error) {
  if (error instanceof CanopyError) {
    console.error(error.code, error.details);
    // error codes: TransactionBuildFailed, ViewCallFailed, NetworkError,
    //              InvalidAddress, InvalidAmount, InvalidTypeTag
  }
}
```

## Example App

See [examples/react](./examples/react) for a full working React app covering vault deposits/withdrawals, staking, rewards claiming, and ALM vault interaction.

```bash
cd examples/react
cp .env.example .env.local  # add your Sentio API key
pnpm install
pnpm dev
```

## Decimal Handling

All amounts use `bigint` at full precision. Scale manually:

```typescript
// "10.5" with 8 decimals → 1050000000n
function scaleToDecimals(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole + fraction.padEnd(decimals, "0").slice(0, decimals));
}

// 1050000000n with 8 decimals → "10.5"
function scaleFromDecimals(amount: bigint, decimals: number): string {
  const str = amount.toString().padStart(decimals + 1, "0");
  const whole = str.slice(0, -decimals) || "0";
  const fraction = str.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}
```

## Chain-Gated Modules

`CanopySdk` exposes protocol clients only when the selected chain supports them. On
`movement-mainnet`, all three are available together: `sdk.canopy`, `sdk.rewards`,
and `sdk.alm.meridian`.

## Development

```bash
pnpm install
pnpm build
pnpm typecheck
```

## License

MIT
