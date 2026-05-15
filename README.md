# Canopy SDK

TypeScript SDK for Canopy Protocol on Movement and Aptos.

It includes:

- Canopy vault reads and transaction builders
- rewards staking / claim helpers
- Meridian ALM vault support
- deployment + ABI registries
- contract lookup helpers
- Movement helper-module-backed batch reads

## Packages

The repo publishes four packages:

- `@canopyhub/canopy-sdk`
- `@canopyhub/canopy-sdk-core`
- `@canopyhub/canopy-sdk-deployments`
- `@canopyhub/canopy-sdk-bindings`

Most applications should install only the root SDK:

```bash
pnpm add @canopyhub/canopy-sdk
```

## Quick Start

```ts
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { createCanopySdk } from "@canopyhub/canopy-sdk";

const client = new Aptos(
  new AptosConfig({
    network: Network.MAINNET
  })
);

const sdk = createCanopySdk(client, {
  chain: "movement-mainnet",
  offchain: {
    sentioApiKey: process.env.SENTIO_API_KEY, // optional, enables dynamic rewards pool discovery
  },
});
```

`CanopySdk` only exposes protocol clients that exist on the selected chain:

- `sdk.canopy`
- `sdk.rewards`
- `sdk.alm.meridian`

## Chain Support

| Chain | Canopy | Rewards | Meridian ALM |
| --- | --- | --- | --- |
| `movement-mainnet` | yes | yes | yes |
| `movement-testnet` | no | no | no |
| `aptos-testnet` | yes | yes | no |
| `aptos-mainnet` | no | no | yes |

## What The SDK Exposes

### Canopy vaults

```ts
const { vaults } = await sdk.canopy!.listVaults({ limit: 20, offset: 0 });

const vault = await sdk.canopy!.getVault(vaultAddress);

const position = await sdk.canopy!.getUserVaultPosition(userAddress, vaultAddress);

const depositPayload = await sdk.canopy!.buildDepositPayload({
  vaultAddress,
  amount: 1_000_000n,
  minSharesOut: 0n,
});

const withdrawPayload = await sdk.canopy!.buildWithdrawPayload({
  vaultAddress,
  shares: 1_000_000n,
  maxLossBps: 50n,
  minAmountOut: 0n,
});
```

Other Canopy methods:

- `unstakeAndWithdraw(...)`
- `getStrategyDetails(...)`
- `getVaultAllocation(...)`

### Canopy batch helpers

These are currently backed by the Movement helper module and are available on `movement-mainnet`.

```ts
const balances = await sdk.canopy!.getBatchFungibleAssetBalances(
  [metadataA, metadataB],
  userAddress
);

const shareBalances = await sdk.canopy!.getBatchVaultSharesBalances(
  [vaultA, vaultB],
  userAddress
);

const baseMetadata = await sdk.canopy!.getBatchVaultBaseMetadataAndBalances(
  [vaultA, vaultB],
  userAddress
);

const sharesMetadata = await sdk.canopy!.getBatchVaultSharesMetadataAndBalances(
  [vaultA, vaultB],
  userAddress
);

const fullMetadata = await sdk.canopy!.getBatchVaultAllMetadataAndBalances(
  [vaultA, vaultB],
  userAddress
);
```

### Rewards

Transaction builders:

- `buildStakeCoinPayload(...)`
- `buildStakeAndSubscribeCoinPayload(...)`
- `buildStakeAssetPayload(...)`
- `buildStakeAndSubscribeAssetPayload(...)`
- `buildWithdrawCoinPayload(...)`
- `buildWithdrawAssetPayload(...)`
- `buildClaimRewardsPayload(...)`
- `buildSubscribePayload(...)`
- `buildUnsubscribePayload(...)`
- `buildUnsubscribeAndWithdrawCoinPayload(...)`
- `buildUnsubscribeAndWithdrawAssetPayload(...)`
- `buildCreateStakingPoolPayload(...)`
- `buildStakeTokenPayload(...)`
- `buildStakeVaultSharesPayload(...)`

Core rewards reads:

```ts
const earned = await sdk.rewards!.getEarned({
  userAddress,
  poolAddress,
  rewardTokenAddress,
});

const poolInfo = await sdk.rewards!.getPoolInfo(poolAddress);

const rewardData = await sdk.rewards!.getRewardData(poolAddress, rewardTokenAddress);

const stakingPosition = await sdk.rewards!.getUserStakingPosition({
  userAddress,
  stakingAsset,
});
```

### Rewards helper-module reads

These helper-backed reads are currently available on `movement-mainnet`.

```ts
const snapshot = await sdk.rewards!.getRewardsSnapshot({
  offset: 0,
  limit: 20,
  userAddress,
});

const overview = await sdk.rewards!.getRegistryOverview({
  offset: 0,
  limit: 20,
  includePools: true,
});

const userOverview = await sdk.rewards!.getUserRewardsOverview({
  userAddress,
  offset: 0,
  limit: 20,
  includePools: true,
});
```

Additional helper reads:

- `getRegisteredPoolCount()`
- `getPoolDetails(poolAddress)`
- `getRewardTokenDetails(poolAddress)`
- `getUserPoolPositions({ userAddress, offset, limit })`
- `getUserPoolPositionsByToken({ userAddress, stakingAsset, offset, limit })`
- `getUserPoolPositionsByTokens({ userAddress, stakingAssets, offset, limit })`
- `isPoolRegistered(poolAddress)`
- `getUnsubscribedPools(...)`
- `getUserStakedBalance(...)`
- `getUserSubscribedPools(...)`
- `isUserSubscribed(...)`

### Meridian ALM

Available on `movement-mainnet` and `aptos-mainnet`.

```ts
const vaultAddresses = await sdk.alm.meridian!.listVaults({ limit: 20, offset: 0 });

const count = await sdk.alm.meridian!.getVaultCount();

const summary = await sdk.alm.meridian!.getVaultSummary(vaultAddress);

const position = await sdk.alm.meridian!.getUserVaultPosition(vaultAddress, userAddress);

const preview = await sdk.alm.meridian!.previewWithdraw(vaultAddress, 1_000_000n);

const depositPayload = sdk.alm.meridian!.buildDepositPayload({
  vaultAddress,
  amount: 1_000_000n,
  minSharesOut: 0n,
});
```

Movement batch-view-backed Meridian reads:

- `getBatchVaultInfo(vaultAddresses)`
- `getBatchUserVaultBalances(vaultAddresses, userAddress)`
- `getBatchVaultPositions(vaultAddresses)`

## Transactions

All `build*Payload` methods return `InputEntryFunctionData` compatible with `@aptos-labs/ts-sdk`.

```ts
const payload = await sdk.canopy!.buildDepositPayload({
  vaultAddress,
  amount: 1_000_000n,
  minSharesOut: 0n,
});

await client.transaction.build.simple({
  sender: account.accountAddress,
  data: payload,
});
```

If you are using a wallet adapter, pass the same payload object into your wallet’s sign-and-submit flow.

## Offchain Helpers

The SDK exposes one optional data client under `sdk.data`:

- `sdk.data.rewardsDiscovery`

This is useful for rewards pool discovery. It is only constructed on chains with rewards support, or when you explicitly pass `offchain.sentioEndpoint`.

Rewards pool resolution for `buildStakeVaultSharesPayload(...)` uses:

1. explicit `poolAddresses`
2. Sentio lookup, if configured for the chain

You can inspect the active discovery source with:

```ts
const status = sdk.data.rewardsDiscovery?.getStatus();
```

## Contract And ABI Lookup

```ts
import {
  getContract,
  requireContract,
  getCanopyStrategyContract,
  inferCanopyStrategyProtocol,
} from "@canopyhub/canopy-sdk";
import { getDeployment, getContractAddress } from "@canopyhub/canopy-sdk/deployments";
import { getAbi, requireAbi } from "@canopyhub/canopy-sdk/bindings";

const deployment = getDeployment("movement-mainnet");
const vaultAddress = getContractAddress("movement-mainnet", "canopy.vault");
const rewardsAbi = requireAbi("movement-mainnet", "rewards.module");
const meridianRegistry = requireContract("movement-mainnet", "meridian.registry");
const maybeCanopy = getContract("movement-testnet", "canopy.router");

const protocol = inferCanopyStrategyProtocol("movement-mainnet", strategyAddress);
const strategy = protocol
  ? getCanopyStrategyContract("movement-mainnet", protocol)
  : null;
```

Lookup semantics:

- `get*` returns `undefined` or `null` when a supported chain lacks that deployment
- `require*` throws for missing deployments or ABIs
- unsupported chain names throw explicit errors

## Subpath Imports

The root package also exports three subpaths:

```ts
import { normalizeMoveAddress } from "@canopyhub/canopy-sdk/core";
import { getDeployment } from "@canopyhub/canopy-sdk/deployments";
import { requireAbi } from "@canopyhub/canopy-sdk/bindings";
```

If you need the leaf packages directly:

```ts
import { normalizeMoveAddress } from "@canopyhub/canopy-sdk-core";
import { getDeployment } from "@canopyhub/canopy-sdk-deployments";
import { requireAbi } from "@canopyhub/canopy-sdk-bindings";
```

## Repo Layout

```text
canopy-sdk/
├── packages/
│   ├── core/
│   ├── deployments/
│   ├── bindings/
│   └── sdk/
```

## Surf Follow-Ups

Possible next improvements on top of the current Surf integration:

- Add typed `simulate*` SDK helpers for common Canopy, Rewards, and Meridian transaction flows.
- Use Surf `useABI(...).view` / `useABI(...).entry` selectively for the simplest internal module calls where it reduces SDK plumbing.
- Consider exposing typed resource readers for useful account resources if a real consumer needs them.
- Keep generated ABI files as the source of truth, but consider using Surf `fetchABI(...)` in internal diagnostics or ABI drift tooling.
- Continue reducing custom view plumbing only where Surf return typing stays readable and does not make the SDK API worse.
├── scripts/
├── tests/
└── examples/
```

Package roles:

- `packages/core`
  shared Move/address/view/payload/error utilities
- `packages/deployments`
  chain registry, feature flags, contract addresses
- `packages/bindings`
  checked-in ABI registry by chain
- `packages/sdk`
  user-facing protocol clients

## Development

```bash
pnpm install
pnpm run typecheck
pnpm test
pnpm run check:exports
pnpm run check:imports
pnpm run abi:check-local
pnpm build
```

For the example app:

```bash
cd examples/react
pnpm install
pnpm dev
```

## License

MIT
