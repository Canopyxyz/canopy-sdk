# Canopy SDK

TypeScript SDK for Canopy Protocol on Movement and Aptos.

It includes:

- Canopy vault reads and transaction builders
- curator vault deposits, redemptions, and previews
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

Most applications should install only the root SDK, alongside `@aptos-labs/ts-sdk`:

```bash
pnpm add @canopyhub/canopy-sdk @aptos-labs/ts-sdk
```

`@aptos-labs/ts-sdk` is a **peer dependency** (`^7.0.0`), not a bundled one. The SDK never
imports it at runtime — every reference is `import type` — and its public API takes an
`Aptos` client that you construct. Declaring it as a peer keeps a single copy in your tree,
so the `Aptos` type in your code is the same nominal type the SDK's signatures refer to.
Bundling it produced two copies whose types did not match at the API boundary, forcing
consumers to cast.

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
- `sdk.curator`
- `sdk.rewards`
- `sdk.alm.meridian`

## Chain Support

| Chain | Canopy | Curator | Rewards | Meridian ALM |
| --- | --- | --- | --- | --- |
| `movement-mainnet` | yes | no | yes | yes |
| `movement-testnet` | no | yes | no | no |
| `aptos-testnet` | yes | no | yes | no |
| `aptos-mainnet` | no | no | no | yes |

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

### Curator vaults

This is the curated-vault system with a redemption queue, partner attribution,
and preview-based validation. The SDK covers the depositor surface only —
curator/owner/guardian governance is not exposed.

```ts
const vaults = await sdk.curator!.listVaults({ limit: 20, offset: 0 });

const vault = await sdk.curator!.getVault(vaultAddress);

const position = await sdk.curator!.getUserVaultPosition({ userAddress, vaultAddress });

const depositPayload = sdk.curator!.buildDepositPayload({
  vaultAddress,
  amount: 5_000_000n,
  minSharesOut: 4_900_000n,
});

const partnerPayload = sdk.curator!.buildDepositWithPartnerPayload({
  vaultAddress,
  amount: 5_000_000n,
  partnerId: 7n,
});
```

Payload builders are synchronous and return `InputEntryFunctionData`:

- `buildDepositPayload(...)` / `buildDepositWithPartnerPayload(...)`
- `buildInstantRedeemPayload(...)`
- `buildRequestRedemptionPayload(...)`
- `buildClaimRedemptionPayload(...)` / `buildCancelRedemptionPayload(...)`
- `buildClaimbackEscrowedSharesPayload(...)`

Reads:

- `listVaults({ offset, limit })`, `getVaultCount()`
- `getVault(vaultAddress)`, `getVaultConfig(...)`, `getVaultAccounting(...)`, `getLiquidityBreakdown(...)`
- `getUserVaultPosition({ userAddress, vaultAddress })`, `getShareBalance({ userAddress, vaultAddress })`
- `getRedemptionRequest(requestAddress)`, `getUserRedemptionRequests({ vaultAddress, ownerAddress })`, `getOpenRequestCount({ vaultAddress, ownerAddress })`
- `isPartnerRegistered(partnerId)`, `getPartnerPayoutAddress(partnerId)`

#### Previews are the validation API

Rather than simulating and reading an abort, ask the vault directly. Each preview
returns its own gate field plus stable machine-readable reasons:

```ts
const preview = await sdk.curator!.previewDeposit({
  vaultAddress,
  depositor: userAddress,
  amount: 5_000_000n,
});

if (!preview.canDeposit) {
  // e.g. ["DepositBelowMinimum", "IdleBreachActive"]
  console.log(preview.blockingReasons.map((reason) => reason.reasonId));
}
```

`previewInstantRedeem(...)` gates on `canRedeem` and `previewQueuedRedemption(...)`
on `canSubmit` — the three names differ because they answer different questions.
`reasonId` is a `string`, not a union, because the on-chain reason enum is
append-only.

#### Queued redemptions

`buildRequestRedemptionPayload` does not return the request address, so read it from
the transaction:

```ts
import { findRedemptionRequest } from "@canopyhub/canopy-sdk";

const submitted = await sdk.signSubmitAndWaitForTransaction({
  signer: account,
  payload: sdk.curator!.buildRequestRedemptionPayload({ vaultAddress, shares: 1_000_000n }),
});

const requested = findRedemptionRequest(submitted, { userAddress, vaultAddress });
const request = await sdk.curator!.getRedemptionRequest(requested!.requestAddress);
```

Pass `packageAddress` too when parsing a transaction that may include events from
another `::vault::RedemptionRequestedEvent`.

A queued redemption is not self-service: an allocator must fund the request, and
`request.claimableAt` must pass, before `buildClaimRedemptionPayload` will succeed.

`getUserRedemptionRequests` returns live requests **and** ones awaiting claim-back
(`Cancelled` / `Denied` / `Expired` with escrow outstanding). The latter are
inspect-and-claimback only — filter on `status` before passing an address to claim or
cancel. Ordering is not stable, so never treat position as identity.

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

`rewardRate`, `rewardPerTokenStored`, and `rewardPerToken` are returned as raw fixed-point values scaled by `1e12`.
Divide by `10^12` in application code when you want a human decimal representation.

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

await sdk.simulateTransaction({
  sender: account.accountAddress,
  payload,
});
```

If you are using a wallet adapter, pass the same payload object into your wallet’s sign-and-submit flow.
If a Move abort is hit, whether simulating a transaction or reading a view, it throws a `CanopyError` with `code: "MOVE_ABORT"` and structured `details.moveAbort` metadata for UI handling. All three abort string shapes fullnodes emit are recognized, because simulation and `/v1/view` do not report aborts the same way even on the same chain:

- **View** — `VMError { major_status: ABORTED, sub_status: Some(N), ... }`. Carries the code and a full function id, but no name or description.
- **Simulation on Movement** — `ENAME(0xHEX): description`, where `abortName` and `abortMessage` come from the chain itself, and the location stops at the module.
- **Aptos** — a bare `abort code N`, where the name is looked up from those the SDK knows.

`details.moveAbort.rawMessage` always carries the original text, and `abortName` is absent rather than guessed when the chain does not send one.

A Movement simulation abort names only the module it happened in, which is often an inner module the caller never invoked — a router entry function aborting inside a vault. In that case `details.moveAbort` reports `module` without a `functionName`; the function you actually called is on the enclosing `details.function`.

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
pnpm run hooks:install
pnpm run typecheck
pnpm test
pnpm run check:exports
pnpm run check:imports
pnpm run abi:check-local
pnpm build
pnpm run check:payloads
```

`pnpm run hooks:install` configures the repo-local `.githooks/pre-commit` hook, which runs `abi:check-local` when staged changes touch deployment addresses, generated ABI files, chain bindings, or the ABI manifest.

### Live payload and view checks

`pnpm run check:payloads` builds every `build*Payload` against live fullnodes and asserts
`transaction.build.simple` succeeds, then reads every view the clients use. It must run
**after** `pnpm build`, because it exercises `dist/`.

This exists because the unit tests assert payload *shape* and never build a transaction,
which is how a release shipped where every entry payload was rejected with
`Type mismatch for argument 0, type '&signer'`.

`pnpm run check:bundle` inspects an already-built `examples/react/dist` and fails if a
Node-only dependency path is bundled — a previous dependency pulled in Node's `Buffer`
and made the SDK unusable in browsers. It does not build anything itself:

```bash
pnpm build
pnpm --filter @canopy-sdk-example/sdk-react run build
pnpm run check:bundle
```

Both run in CI. They need network access, as `abi:check` already does.

For the example app:

```bash
cd examples/react
pnpm install
pnpm dev
```

## License

MIT
