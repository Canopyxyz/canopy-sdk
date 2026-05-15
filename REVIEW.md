# Canopy SDK PR #4 (`refactor-2`) — Comprehensive Review

> Two-pass review: (1) design + TS implementation review of the latest tree state, (2) correctness pass against the actual Move source (`canopy-helpers-contracts`, `satay-movement`, `ichi-vaults-thala`, `multi-rewards-aptos`) and the Sentio processor (`canopyxyz/sentio-processors`). Findings are ranked by priority — fix top-down.

## Executive summary

- **3 critical correctness bugs** that silently produce wrong on-chain outcomes: every Canopy deposit/withdraw payload is malformed; every Meridian withdraw is missing slippage protection on one asset; the "all metadata + balances" batch view returns base/shares swapped.
- **The biggest architectural issue is the absence of a typed contract-binding layer.** All ABIs are typed `unknown`, every view return is parsed via hand-rolled `Record<string, unknown>` casts, and entry-function builders pass stringly-typed function names with positional argument arrays. This is the upstream cause of #1, #2, #3 and most of the brittleness elsewhere. Adopting `@thalalabs/surf` (or any typed binding layer that connects ABI literals to TS signatures) would prevent this class of bug at compile time and meaningfully shrink the hand-written parser surface.
- **The four-package workspace split is half-finished.** `packages/sdk` is named `@canopyhub/canopy-sdk-client`, marked `private: true`, and never built independently; the root `tsup` re-bundles every leaf via aliases so two copies of `CanopyError` ship side by side.
- **Reward discovery is fragile end-to-end**: hardcoded 30-entry fallback mapping, Sentio endpoint that doesn't match the deployed processor's project name, and an over-broad catch that swallows non-network errors.
- **Tests are mock-string-matching with no ABI cross-check.** A field rename in a Move struct silently breaks the SDK while tests stay green.

Severity tags below (`[CRITICAL]`, `[MAJOR]`, `[MINOR]`) are reviewer judgment, not measured. Treat as ranking, not authority.

---

## Priority-ordered findings

### Tier 0 — Critical correctness bugs (fix this week)

These produce silently wrong on-chain outcomes for users. They are not theoretical; each is confirmed by reading the Move source.

---

#### 1. [CRITICAL] Meridian `withdraw` payload passes wrong arguments

**Location:** `packages/sdk/src/alm/meridian/client.ts:203-215` (SDK) vs `ichi-vaults-thala/packages/ichi-vaults/sources/router.move:97-124` (Move).

**What's wrong:** The Move router signature is `withdraw(account, vault, shares_amount: u64, min_asset_0: u64, min_asset_1: u64)` — three u64s: shares plus per-asset slippage floors. The SDK builds `(vault, shares, maxLossBps, minAmountOut)`. So a user who supplies `maxLossBps=500` (intending 0.05% slippage) and `minAmountOut=99_000_000` (intending an exit floor in asset 1's units) is actually telling Move `min_asset_0 = 500, min_asset_1 = 99_000_000`. The slippage check on asset 0 is silently disabled (500 raw units is ~0); the value semantically intended as a percent is interpreted as a raw u64 amount.

**Why it matters:** A withdrawal that should revert on bad market conditions will silently complete with whatever the pool gives back. There is no compile-time signal, no warning. Loss of user funds is realistic.

**Recommended fix:** Change `MeridianWithdrawPayloadInput` to `{ vault, shares, minAsset0, minAsset1 }` (drop `maxLossBps` — it is not a concept in Meridian's Move router). Update `buildWithdrawPayload` accordingly. Add a unit test that asserts the exact `arguments` array produced.

---

#### 2. [CRITICAL — pending simulation proof] Canopy router `Option<u64>` payload encoding likely wrong

**Location:** `packages/sdk/src/canopy/client.ts:91-209` (six payload builders) vs `satay-movement/packages/router/sources/router.move:28-305` and `bindings/abis/movement-mainnet/canopy_router.json`.

**What's wrong:** Move declares `min_shares_out: Option<u64>`, `max_loss: Option<u64>`, `min_amount_out: Option<u64>`. The SDK serializes them with `moveUintArgument(input.minSharesOut)` (`packages/core/src/payloads.ts:55-60`), which produces a raw u64 string. The standard Aptos JSON entry-function encoding for Option args is `[]` (none) or `["value"]` (some) — passing a raw scalar where Move expects an Option is documented as a malformed payload. The SDK already has `moveOptionU64Argument` (`rewards/client.ts:793-794`) used correctly elsewhere, which is evidence the canopy path is the outlier.

**Why it matters:** If confirmed, every canopy deposit/withdraw payload built by the SDK either fails at simulate or submits with garbage values. Pre-prod, this hasn't been hit visibly; post-deploy it would break every wallet click in the example app.

**Confidence:** High that the encoding is wrong; **not yet verified by simulation.** Before treating as a confirmed merge-blocker, run a one-shot test that builds a payload via `CanopyProtocolClient.buildDepositCoinPayload({...})` and calls `simulateTransaction` against movement-mainnet. If it fails with an Option/argument error, this is confirmed and the fix below applies.

**Recommended fix:** Use `moveOptionU64Argument` for all three Option<u64> args across both `deposit_*` and `withdraw_*` builders. Change the TS input types to `minSharesOut?: bigint | string` (truly optional). Add tests that assert the exact JSON `arguments` array shape, not just successful build.

---

#### 3. [CRITICAL] `getBatchVaultAllMetadataAndBalances` returns base/shares swapped

**Location:** `packages/sdk/src/canopy/client.ts:393-417` (destructure) and `:608-619` (zipper) vs `canopy-helpers-contracts/packages/helpers/sources/helpers.move:81-106`.

**Move source (verified)** — `helpers.move:82-105`:
```move
public fun batch_get_vault_all_metadata_and_balance(
    vaults: vector<Object<Vault>>, user_address: address
): (vector<Object<Metadata>>, vector<u64>, vector<Object<Metadata>>, vector<u64>) {
    // ...
    vector::push_back(&mut shares_metadatas, shares_metadata);
    vector::push_back(&mut shares_balances, shares_balance);
    vector::push_back(&mut base_metadatas, base_metadata);
    vector::push_back(&mut base_balances, base_balance);
    // ...
    (shares_metadatas, shares_balances, base_metadatas, base_balances)
}
```

**What's wrong:** Move returns `(shares_metadatas, shares_balances, base_metadatas, base_balances)` — shares first, base second. The SDK destructures as `[baseMetadata, baseBalances, sharesMetadata, sharesBalances]`, then passes them in that order to `zipVaultAllMetadataBalances`. Every returned `CanopyBatchVaultAllMetadataBalance` has base/shares fields inverted.

**Why it matters:** Any UI using this batch read displays vault-shares metadata where it should show the underlying asset and vice versa. Users see "shares decimals: 8" labeled as the deposit asset; balances are wrong by a different decimal scale. Visually obvious only if the two assets happen to have different decimals.

**Recommended fix:** Two options (pick one):
- **SDK-side (smaller blast radius):** flip the destructure to `[sharesMetadata, sharesBalances, baseMetadata, baseBalances]`.
- **Move-side (cleaner naming symmetry):** reorder Move's tuple to `(base_metadatas, base_balances, shares_metadatas, shares_balances)` so it matches the function name "base and shares" and the order of the two narrower batch views.

Add a regression test: a 2-vault input where base address ≠ shares address; assert the returned object's `baseMetadata.address` matches a known vault's underlying FA and `sharesMetadata.address` matches the known shares FA.

---

### Tier 1 — Critical architectural problems (P1)

These are not single-line bugs; they are design issues that have produced the Tier 0 bugs and will produce more like them. Fix sequence: typed bindings first, then everything cascades.

---

#### 4. [CRITICAL] No typed contract-binding layer

**Location:** `packages/bindings/src/chains/define-chain-abis.ts:10-23` (root cause); every view callsite in `packages/sdk/src/{canopy,rewards,alm/meridian}/client.ts`.

**What's wrong:** `RawAbiSet<Chain>` types every imported JSON ABI as `unknown`. `MoveModuleAbi.exposed_functions[].params/return` are `string[]` with no type-level connection to TS values. `callViewFunction<Result extends unknown[]>` returns whatever the caller asserts. Consumers then write `view.shares_address`, `view.paired_coin_type`, etc. against `Record<string, unknown>` casts. A typo, a Move-side field rename, or a missing field never trips the type system.

**Why it matters:** This is the upstream cause of bugs #1, #2, #3. None of those would have made it through review if the SDK had typed Move-derived signatures. The user explicitly asked for typesafe contract interactions; the current SDK is no safer at compile time than `fetch().json()`.

**Recommended fix:** Adopt `@thalalabs/surf` (Aptos-native typed ABI client). Concretely:
- Re-type each JSON ABI file with `as const`, or use Surf's `createSurfClient` / `useABI` to derive typed view callers and entry builders directly from the ABI literal.
- Replace `defineChainAbis` with `defineChainAbis<const T>(abis: T): T` so consumers see a fully typed ABI tree (no `unknown`).
- Replace every `callSingleViewResult` / `callViewFunction<[unknown,...]>` site with Surf-derived calls of the shape `surf.useABI(canopyVaultAbi).view.vault_view({ typeArguments: [], functionArguments: [...] })`, which returns typed tuples derived from the ABI's `return: string[]` literal.
- Hand-written `parseCanopyVaultView`, `parsePaginatedVaults`, `readPoolDetails`, `readBatchVaultInfo`, `parseAllocationMap`, `parseStrategies` reduce to thin snake_case → camelCase mappers plus typed BCS-aware decoders for `Option<T>`, `Object<T>`, `vector<T>` — most of which Surf already ships.
- Replace `entryFunctionPayload({ moduleAddress, moduleName, functionName, ... })` with `surf.useABI(canopyRouterAbi).entry.deposit_coin({ ... })`. This eliminates the runtime ABI-probing in `canopy/client.ts:106-124, 176-194` — Surf knows at the type level which entry functions exist for each chain's ABI.

Rough scope: 1-2 weeks of work; meaningfully reduces parser surface area and structurally prevents the Tier 0 class of bug at compile time. Specific tool and scope are a recommendation — any typed binding layer that connects ABI literals to TS signatures would achieve the same outcome.

---

#### 5. [CRITICAL] `CanopySdk` chain-aware typing is fake — three `as unknown as` casts

**Location:** `packages/sdk/src/client.ts:45, 50, 56`.

**What's wrong:** The narrowed contexts (`SdkContext<"movement-mainnet" | "aptos-testnet">` for Canopy, etc.) cannot be derived from `Chain` at construction time, so the author papers over the generic-typing mismatch with `as unknown as`. If a new chain's JSON flips a feature flag on without the corresponding ABIs, `CanopyProtocolClient` will silently receive a context whose `abis.canopyVault` is undefined — the cast bypasses TS and the code blows up with `Cannot read properties of undefined` rather than failing fast or being prevented by the type system.

**Why it matters:** Encodes a load-bearing invariant (feature flag ⇒ ABI present) only in JSON, with no type-level and no runtime check. The per-chain context narrowing is purely cosmetic.

**Recommended fix:** Define feature-keyed context aliases that are *derived* from the bindings, not declared separately:
```ts
type ChainsWithFeature<F extends keyof DeploymentFeatures> =
  { [C in ChainName]: DeploymentFeatures[F] extends true ? C : never }[ChainName];

type CanopyContext = SdkContext<ChainsWithFeature<"canopy">>;
```
Then narrow via an assertion function inside the constructor:
```ts
function assertCanopyContext(c: SdkContext<SdkChainName>): asserts c is CanopyContext {
  if (!c.deployment.features.canopy) throw new CanopyError(InvalidDeployment, ...);
  if (!c.abis.canopyVault) throw new CanopyError(InvalidDeployment, ...);
}
```
No `as unknown` anywhere. Better still, derive `features` from ABI/address presence (see #13) so there is one source of truth.

---

#### 6. [CRITICAL] `meridian.router` deployment lookup returns the wrong address

**Location:** `packages/deployments/src/contracts.ts:34-35`; ABI at `bindings/abis/movement-mainnet/meridian_router.json` is keyed to a different address than the deployment lookup returns.

**What's wrong:** `getContractAddress("movement-mainnet", "meridian.router")` returns `alm.meridian.standard` (`0xec1d…`). The ABI is keyed to `alm.meridian.vaults` (`0x96cf…`). Anyone consuming `requireContract("meridian.router")` gets `{ address: 0xec1d…, abi: { address: 0x96cf…, ... } }` — an internally inconsistent record. The Meridian SDK client itself reads `this.context.abis.meridianRouter.address` directly so the high-level API works, but every other caller of `getContract`/`requireContract` builds broken payloads.

**Why it matters:** `getContract`/`requireContract` are advertised public APIs. Anyone scripting against the registry will hit this. The bug is invisible in tests because no test exercises the lookup vs. ABI cross-check.

**Recommended fix:** Change `contracts.ts:34-35` to point at `deployment.alm?.meridian?.vaults` (where the router module actually lives). Add a registry-consistency assertion that for every `ContractId`, the resolved address equals the ABI's embedded address.

---

#### 7. [MAJOR] Four-package workspace split is half-baked

**Location:** `packages/sdk/package.json` (currently `"name": "@canopyhub/canopy-sdk-client", "private": true, "main": "./src/index.ts"`); root `tsup.config.ts:7-23`.

**What's wrong:** Two structural problems:
- **The "fourth package" isn't really one.** Root `package.json` claims to publish `@canopyhub/canopy-sdk` containing `dist/index.*` built from `packages/sdk/src/index.ts`. But `packages/sdk` is named `@canopyhub/canopy-sdk-client`, marked private, points its `main` at the raw source, and has no `tsup.config.ts` of its own. There's no consistent identity; the leaf-package split is half-baked.
- **Root tsup re-bundles every leaf.** The `alias` map in `tsup.config.ts` inlines `packages/core/src/index.ts`, `packages/deployments/src/index.ts`, and `packages/bindings/src/index.ts` directly into `dist/index.{mjs,js}`, while separately producing `dist/{core,deployments,bindings}.{mjs,js,d.ts}`. So the same code ships twice: once inside the umbrella, once inside each leaf. Consumers that mix `@canopyhub/canopy-sdk` and `@canopyhub/canopy-sdk-core` get two copies of `CanopyError` / `normalizeMoveAddress` and `instanceof CanopyError` fails across copies.

**Why it matters:** Footgun. Silently doubles bundle size, breaks identity equality, and confuses anyone trying to depend on a specific leaf.

**Recommended fix:** Pick one:
- **Real four-package split:** rename `packages/sdk` to `@canopyhub/canopy-sdk` (or whichever public name), set `private: false`, give it a `tsup.config.ts`, depend on the three leaves via `workspace:*`. Mark `@canopyhub/canopy-sdk-{core,bindings,deployments}` as `external` in any remaining bundle config. Drop the root-level umbrella build.
- **Single-package with subpath exports:** scrap the split; ship one `@canopyhub/canopy-sdk` with `./core`, `./deployments`, `./bindings` subpath exports. No internal cross-package workspace deps.

The current half-state is the worst of both worlds.

---

### Tier 2 — Major brittleness and design issues (P2)

---

#### 8. [MAJOR] Reward discovery cluster: hardcoded fallback, wrong endpoint, swallowed errors

**Location:** `packages/sdk/src/data/rewards-discovery.ts:12-109` (static mapping), `:9` (Sentio endpoint), `:155-187` (fallback flow).

**What's wrong:** Three problems stacked:
- **Static fallback is a 30-entry mainnet-only snapshot** baked into source with no version stamp, no `staleAfter`, and no way for a consumer to inspect "what date is this from?". New pools on-chain silently won't be found via fallback.
- **Sentio endpoint may be stale.** SDK default is `solo-labs/canopy-multi-rewards-movement`. `sentio-processors/sentio.yaml:4` declares `project: canopy-sentio-indexer`, with commented-out historical names for movement-porto and aptos-mainnet. These may both be valid (different processors) or the SDK default may be stale — the canonical deployed Sentio project URL needs to be verified against the dashboard. If the SDK endpoint is wrong, it 404s and silently falls back to static mappings on movement-mainnet (and returns nothing on aptos-testnet, which has no static fallback at all).
- **Catch is over-broad.** `resolvePoolAddresses` (rewards-discovery.ts:172-187) wraps the Sentio call in a try/catch that returns static pools on any error — including `CanopyError(InvalidAddress)` from input normalization. A bug in the SDK is masked as "Sentio is flaky."

**Why it matters:** Three independent ways the rewards discovery path can be silently wrong, all in a system whose entire point is "give me the current pools."

**Recommended fix:**
- Generate `STATIC_STAKING_TOKEN_POOL_MAPPINGS` at SDK build time from the multi_rewards registry (call the existing rewards-view module's `get_all_pool_list` and snapshot to a JSON file with a timestamp). Surface `client.staticMappingAge()` on `RewardsDiscoveryClient`.
- Verify the live Sentio project name against the dashboard. If wrong, update the default endpoint OR change the processor's `sentio.yaml` to publish under the name the SDK expects. Make the SDK *throw* on a 404 / wrong-schema response rather than silently fall back.
- Filter the catch: only fall back on `CanopyError.code === NetworkError`. Re-throw everything else.
- Make endpoint per-chain (a map) and populate at least movement-mainnet and aptos-testnet; allow override.

---

#### 9. [MAJOR] `parseAllocationMap` accepts three shapes; two are dead code

**Location:** `packages/sdk/src/canopy/client.ts:780-829` vs `satay-movement/packages/router/sources/deposit.move:217-243` and `withdraw.move:121-143`.

**What's wrong:** Move returns `SimpleMap<Object<BaseStrategy>, u64>`. The Aptos REST API serializes `SimpleMap<K, V>` as `{ "data": [{ "key": ..., "value": ... }] }` — always. The SDK's "accept any of three shapes" code paves over a non-existent ambiguity; branches 2 (raw array) and 3 (top-level `{key, value}` record) are dead.

**Why it matters:** Brittle: a future Move-side change to a fourth shape produces a runtime error with no useful context; a Move-side change that produces the *wrong* shape silently (e.g. a SimpleMap of metadata→address rather than address→amount) mis-parses without detection. Allocation correctness is load-bearing — `validateAllocation` gates the user's deposit.

**Recommended fix:**
```ts
const entries = (rawMap as { data?: Array<{ key: unknown; value: unknown }> }).data ?? [];
for (const { key, value } of entries) {
  const strategy = readMoveAddress(key);
  const amount = readMoveU64(value);
  if (amount > 0n) { strategies.push(strategy); amounts.push(amount); }
}
```
Delete the array/positional and raw-record branches. Add a typed error if `data` is missing or non-array (with the actual received shape in the error payload).

---

#### 10. [MAJOR] Batch helpers — no dedup, no size bound, all-or-nothing, helper presence checked per-call

**Location:** `packages/sdk/src/canopy/client.ts:303-417`; `packages/sdk/src/alm/meridian/client.ts:217-305`; `packages/sdk/src/rewards/client.ts:269-407`. Helper-presence checks at `canopy/client.ts:516-528`, `rewards/client.ts:685-697`, `meridian/client.ts:307-319`.

**What's wrong:**
- No dedup. Passing the same address twice produces two columns of identical results and wastes gas.
- No size bound. `batch_get_vault_all_metadata_and_balance` on 5,000 vaults times out the RPC or DOSes the node.
- No partial-failure path. Any single view RPC failure rolls back the entire batch.
- Helper-module presence is checked per-call rather than at SDK construction. A chain without `canopyHelpers` only fails at the first batch call, not at `new CanopySdk(...)`, so the consumer finds out at runtime.

**Why it matters:** Two of the PR's headline features ("reduce RPC roundtrips", "batch helper-module reads") are *worse* than naïve loop calls for any caller who hands the SDK their full vault list.

**Recommended fix:** In each `getBatchXxx`:
- Dedup before sending; map back to original indices for stable output ordering.
- Chunk above a configurable `maxBatchSize` (default ~200). Run chunks in parallel via `Promise.allSettled`. Return per-input results or per-input errors.
- Add `{ onError: "throw" | "perItem" }`.
- Introduce per-feature sub-flags (e.g. `features.canopyHelpers`, `features.rewardsViews`, `features.meridianBatchViews`) that consumers can query. Compute them from ABI presence (see #13).

Additionally, where the Move helper returns parallel vectors keyed by index, ask the Move team to return `vector<Option<T>>` so missing inputs are explicit nulls. Meridian's `batch_views` already does this correctly (`ichi-vaults-views/sources/batch_views.move:76`); canopy_helpers does not.

---

#### 11. [MAJOR] Three view-parsing patterns are reimplemented in every client

**Location:** `canopy/client.ts:541-619` (zip helpers); `rewards/client.ts:700-791` (`readPoolDetails*Vector`, etc.); `alm/meridian/client.ts:322-377` (`readBatchVaultInfo`, etc.).

**What's wrong:** Five recurring patterns appear ~15+ times across three files: (a) "assert array, map to typed parser", (b) "read snake_case fields from `Record<string, unknown>`", (c) "zip parallel vectors with same-length assertion", (d) "read `Option<T>` `{ vec: [] | [v] }`", (e) "read `Object<T>` `{ inner: addr }`". DRY violation.

**Why it matters:** Every new view function re-implements the same boilerplate. Once Surf is adopted (#4), most of this collapses; until then, centralize it.

**Recommended fix:** Move shared Move-codec helpers into `packages/core/src/move-codec.ts`: `readObject(v, parseInner)`, `readVector(v, parseItem)`, `readOption(v, parseInner)`, `readStruct<T>(v, shape)` where `shape` is a small object mapping camelCase keys to field-type readers. Each per-protocol parser reduces to ~5 lines.

---

#### 12. [MAJOR] Entry-function builders use string field references with positional arg arrays

**Location:** every `buildXxxPayload` method in `packages/sdk/src/{canopy,rewards,alm/meridian}/client.ts`.

**What's wrong:** All entry builders take `{ moduleAddress, moduleName, functionName }` plus a positional `functionArguments` array. Function names are string literals; TS doesn't check that `withdraw_fa_with_coin_type`, `stake_and_subscribe_token`, `unsubscribe_and_withdraw_fa` actually exist on the named module, nor that arities match. The `as never` casts at `rewards/client.ts:335, 360, 403, 425, 447` are explicit acknowledgment that the typing is lying — the author is laundering `{ vec: [...] }` Move option encodings through an `EntryFunctionArgumentsJSON` type that doesn't admit them.

**Why it matters:** Tier 0 bug #2 is a direct consequence of this. A typo silently builds a transaction that the wallet will sign and the chain will reject.

**Recommended fix:** Subsumed by Surf adoption (#4). As an interim, derive a discriminated union of valid function names from the ABI JSON (`type DepositFnName<Chain> = ChainAbiSet[Chain]["canopyRouter"]["exposed_functions"][number]["name"]`) so a typo is a TS error.

---

#### 13. [MAJOR] Deployment + feature-flag system has two sources of truth

**Location:** `packages/deployments/src/loader.ts:16-19` (`as unknown as`); `addresses/*.json` (`features` block).

**What's wrong:** Two issues:
- **JSON deployments cast `as unknown as`.** No structural validation at module init; only field-by-field defensive checks in `validateDeployment`. The chain-name string in JSON isn't cross-checked against the file path — a file named `aptos-mainnet.json` could have `"chain": "movement-mainnet"` and silently pass.
- **`features.canopy = true` is asserted independently of address/ABI presence.** A chain can have all addresses without flipping the flag (in which case `CanopySdk` doesn't instantiate the client), or flip the flag without having all ABIs (in which case the `as unknown as` casts in #5 mask the missing ABI). Two sources of truth invite drift.

**Why it matters:** Pre-publish, a typo in a JSON file only gets caught if the chainId mismatches; chain-name mismatches with the filename slip through. The `features` block is redundant with the `canopy`/`rewards`/`alm` blocks' presence.

**Recommended fix:**
- In `loader.ts`, key the validator off the map key, not the embedded `chain` field: `validateDeployment("movement-mainnet", movementMainnet)`. Reject if `input.chain !== expectedChain`. Replace manual checks with `zod.parse` of a typed schema.
- Drop the explicit `features` block from JSON. Derive it from address + ABI presence:
```ts
features.canopy = canopy?.core !== undefined && canopy?.router !== undefined && abis.canopyVault !== undefined && abis.canopyRouter !== undefined;
```
Compute and expose as the runtime `features` map.

---

#### 14. [MAJOR] `getCanopyStrategyContract` swallows unknown strategy kinds

**Location:** `packages/sdk/src/strategy.ts:13-40`; consumer at `canopy/client.ts:660`.

**What's wrong:** `CANOPY_STRATEGIES` is a closed enum-like map; a vault that uses a strategy kind not listed (a future `eulerSimple` deployed before the next SDK release) returns `null` from `inferCanopyStrategyProtocol`. `parseStrategies` blindly returns whatever the chain says, and downstream code that calls `inferCanopyStrategyProtocol(strategy.concreteAddress)` gets `null` and likely silently filters those strategies.

**Why it matters:** SDK consumers integrating new vaults between SDK releases will silently misbehave with no signal.

**Recommended fix:** Return a discriminated union: `{ kind: "known"; protocol: ... } | { kind: "unknown"; address: string }`. Force consumers to handle both. Add a test that simulates an unknown concrete address.

---

#### 15. [MINOR] Add a strict canonical address validator alongside the permissive normalizer

**Location:** `packages/core/src/address.ts:6-16`.

**What's wrong:** `normalizeMoveAddress` accepts `1-64` hex chars and left-pads. That's correct behavior for user input (Move addresses are routinely shortened in tooling). What's missing is a *strict* variant for cases where we expect a canonical 32-byte address — ABI-baked addresses, on-chain reads from `Object<T>.inner`, deployment-registry values. Errors also lack a `label` parameter so they can't say which field failed.

**Why it matters:** Not a bug per se. But adding the strict variant gives a useful integrity check at the SDK / on-chain boundary and improves error messages on the user-input side.

**Recommended fix:**
- Add `assertCanonicalMoveAddress` (no padding, exact 32-byte hex) for ABI/deployment data.
- Add a `label` parameter to `normalizeMoveAddress` so errors say "Invalid Move address for vault.assetAddress".
- Add property-based tests: round-trip a random 32-byte hex through `normalizeMoveAddress` → must equal `0x${64-pad}`. Confirm `sameMoveAddress("0x1","0X01")` is true.

---

#### 16. [MINOR] Three ABIs bundled with no internal SDK references

**Location:** `packages/bindings/src/chains/movement-mainnet.ts`; `multi_rewards_batcher_view.json`, `multi_rewards_batcher_entry.json`, `multi_rewards_std_views.json`.

**What's wrong:** `multiRewardsBatcherView`, `multiRewardsBatcherEntry`, and `multiRewardsStdViews` are loaded into the bindings package and bundled, but `grep -rn "multiRewardsBatcherView|multiRewardsBatcherEntry|multiRewardsStdViews|batcher_view|batcher_entry|std_views" packages/sdk/src` returns zero hits. These may be intentionally exposed as public bindings for downstream consumers, but if so it's undocumented.

**Why it matters:** Bundle bloat for sure; design intent unclear. The Move side provides useful functionality the SDK isn't surfacing — if these are meant as raw exposure, fine; if they were meant to power the SDK's rewards reads, they're wired wrong.

**Recommended fix:** Either (a) document them as intentional raw bindings and exclude from the SDK umbrella bundle (`external` in tsup); or (b) expose SDK methods over them — `batcher_view::get_user_system_overview(user, staking_tokens)` would replace the N+1 view loop in `rewards/client.ts:610-647`; `batcher_view::get_pools_by_staking_token` could replace the static-mapping rot (#8); `batcher_entry::batch_subscribe` would be a meaningful gas-saving public API.

---

#### 17. [MINOR / ROADMAP] No structured Move abort-code surface

**Location:** `packages/core/src/errors.ts` (8 generic codes, no Move abort handling); Move sources with rich abort codes:
- `satay_router::router`: `ENOT_ENOUGH_OUT_SHARES=1`, `ENOT_ENOUGH_OUT_AMOUNT=2`.
- `satay_router::withdraw`: `EUNKNOWN_STRATEGY=0`.
- `ichi_vaults_meridian::router`: `EINVALID_ASSET_AMOUNT=1`, `ESLIPPAGE_SHARES_OUT=3`, `ESLIPPAGE_ASSETS_OUT=4`, `ENO_MATCH_COIN_DEPOSIT_FA=6`, `EPRICE_OUT_OF_RANGE_PRE=9`, `EPRICE_OUT_OF_RANGE_POST=10`.
- `satay::vault`: 35+ codes including `EVAULT_PAUSED=117`, `EINSUFFICIENT_BALANCE=106`, `ETOO_MUCH_LOSS=129`, `EINVALID_DEPOSIT_AMOUNT=113`.

**What's wrong:** A user hitting `EVAULT_PAUSED` gets a raw `Error: ... abort code 117 ... at function vault::deposit ...` string. No way for downstream UI to discriminate "vault is paused, retry later" from "slippage exceeded, increase tolerance".

**Why it matters:** This is the kind of structured error surface a user-facing SDK should provide. Without it every consumer hand-parses substrings.

**Recommended fix:** Add `CanopyErrorCode.MoveAbort` plus a `moveAbort: { module, code, name, message }` field. Build a static map of the well-known codes per module (start with the ~10 user-facing ones listed above) and surface them by parsing the failure VMStatus from `simulateTransaction` / `submitTransaction` responses.

---

#### 18. [MINOR / ROADMAP] `CanopyError` design could be more discriminable

**Location:** `packages/core/src/errors.ts:18-49`.

**What's wrong:** One error class with a `code` enum. `details: Record<string, unknown>`, so the structured payload is best-effort. No per-feature subclasses or discriminated-union types — consumers writing `catch (e) { if (e instanceof RewardsError) ... }` cannot. They have to introspect `code` and pattern-match on `details.chain`.

**Why it matters:** Discriminability is half-broken. Surfacing chain/module/function context on view errors is the difference between actionable debugging and "something failed."

**Recommended fix:** Define a discriminated union with `details` typed per code:
```ts
type CanopyError =
  | { code: "InvalidAddress"; details: { address: string; label?: string } }
  | { code: "ViewCallFailed"; details: { function: MoveFunctionId; chain: ChainName } }
  | { code: "MoveAbort"; details: { module: string; code: number; name?: string } }
  | ...
```
Or subclass per feature. Either way, require chain + module + function on every view error.

Also, drop the explicit `cause: unknown | undefined` field — use the standard ES2022 `super(message, { cause })`. Include `cause` in `toJSON`.

---

#### 19. [MAJOR] Tests don't verify fixtures against ABIs; high-value cases missing

**Location:** `tests/sdk.test.ts` (2,035 lines of inline JSON literals); `tests/registry-consistency.test.ts:34-200`.

**What's wrong:**
- Every test fixture is a hand-written JSON literal of what the chain "would return." No check that the keys (`asset_address`, `paired_coin_type`, `total_subscribed`, `staking_token_supply`, etc.) match real Move view returns. A field rename caught by `scripts/abi/check-local-abis.mjs` would not invalidate these tests because the tests don't read from ABI return-type metadata.
- `registry-consistency.test.ts` checks "every deployed address has a matching ABI" but not the inverse (an orphan ABI is invisible). Module-name mismatches between chains (e.g. `meridianVault.name` is `ichi_vault_thala` on Aptos vs. `ichi_vault_meridian` on Movement — see `abi-manifest.mjs:121` vs `:233`) are not asserted.
- Missing high-value tests:
  - Address normalization fuzz (random hex 1-64 chars, embedded uppercase, leading zeros, idempotency).
  - View parsing on malformed Move data — only `vault_view` has a malformed test (`sdk.test.ts:702-726`); none for `RewardsPoolDetails`, `MeridianBatchVaultInfo`, `MeridianBatchPositionSummary`, the `Option<vector<UserPoolPosition>>` shape.
  - Strategy resolution with an unknown concrete address.
  - Batcher edge cases: empty input → empty output; duplicate inputs → consistent output; mismatched-length response from Move → typed error; helper-module-not-present on the active chain.
  - Sentio fallback ordering: only happy paths tested. No test for "Sentio throws NetworkError → static fallback used" or "non-network error → not swallowed."
  - Allocation tolerance: `ALLOCATION_TOLERANCE_BPS = 10n` is asserted nowhere. No threshold-boundary test.
  - Payload-builder argument shape: no test asserts the exact JSON `arguments` array (would have caught Tier 0 bug #2).
  - ABI feature consistency: `getAbi("aptos-testnet", "rewards.batcher")` — no test confirms presence/absence.

**Why it matters:** Exactly the brittleness called out in the brief: tests pass while the SDK breaks against a real chain.

**Recommended fix:** Add a fixture-vs-ABI cross-check test: for each view function the SDK calls, look up the ABI's `exposed_functions[].return` and assert the fixture is shape-compatible. Better: snapshot real Movement-mainnet responses for representative addresses and use those as fixtures. Add the missing test categories above. Split `sdk.test.ts` into per-protocol files.

---

#### 20. [MAJOR] Workspace import-style inconsistency

**Location:** `packages/sdk/src/**/*.ts` uses `@canopyhub/canopy-sdk/core` (umbrella subpath); `packages/bindings/src/{contracts.ts,types.ts}` uses `@canopyhub/canopy-sdk-deployments` (leaf package). Both resolve only because `tsconfig.json` has `paths` entries for both.

**What's wrong:** Two import schemes coexist with no rule. When published, consumers should import via leaf-package names — but the SDK's compiled JS references `require("@canopyhub/canopy-sdk/deployments")` (forwarded via the umbrella's own exports map), self-referentially.

**Why it matters:** Confusing for anyone navigating the codebase; fragile when consumed externally.

**Recommended fix:** Pick one. Best: every cross-package import inside `packages/*` uses `@canopyhub/canopy-sdk-<leaf>` (workspace package names). Remove umbrella-subpath aliases from `tsconfig.json` and the `alias` block in `tsup.config.ts`. The umbrella's `exports["./core"]` etc. can still exist for external consumers; internal source code should never use them.

---

#### 21. [MAJOR] ABI drift tooling lives only in CI, not pre-commit

**Location:** `.github/workflows/ci.yml:54-64`; `scripts/abi/fetch-abis.mjs`.

**What's wrong:** `abi:check` re-fetches every ABI from the live RPC and diffs against the checked-in JSON. CI failure on drift is good. But:
- No `husky` / pre-commit hook — a developer can land an address change without re-running `abi:fetch`. CI catch is late.
- Sequential per chain, no retries on flaky RPC.
- `abi:check-local` (the offline check) does NOT verify that `packages/bindings/src/chains/<chain>.ts` actually imports every JSON in the manifest. A removed binding (or added JSON without binding) slips past.

**Recommended fix:**
- Add `lint-staged` + `husky` invoking `abi:check-local` on every commit touching `addresses/` or `abis/`.
- Make CI retry the live `abi:check` on transient RPC errors; run chains in parallel.
- Add a manifest-vs-binding-source consistency check to `abi:check-local`.

---

### Tier 3 — Polish (P3)

---

#### 22. [MAJOR] `canopy_rewards_view` Move source not in any supplied repo

**Location:** `packages/bindings/abis/movement-mainnet/canopy_rewards_view.json` (ABI present); module `rewards_view` at `0x2da6e…`; **Move source not found in `canopy-helpers-contracts`, `satay-movement`, or `multi-rewards-aptos`.**

**What's wrong:** The SDK calls `get_pool_details`, `get_reward_token_details`, `get_rewards_snapshot`, `get_registry_overview`, `get_registered_pool_count`, `get_user_pool_positions{,_by_token,_by_tokens}`, `is_pool_registered` against this module. The returned struct shapes (`PoolDetails`, `RewardTokenDetails`, `UserPoolPosition`) match those defined in `multi-rewards-aptos/packages/batcher/sources/batcher_view.move:11-54`, so field reads in `rewards/client.ts:540-680` look correct. But the *wrapper* module's source isn't accessible for review.

**Recommended fix:** Commit the `rewards_view` Move source somewhere reviewable. Until then, this whole code path is verified only against the JSON ABI, not against Move semantics.

---

#### 23. [MAJOR] Clients aren't constructible in isolation for testing

**Location:** `packages/sdk/src/canopy/client.ts:47`; `rewards/client.ts:55`; `alm/meridian/client.ts:34`.

**What's wrong:** Each client constructor takes a fully-built `SdkContext<...>` (pulls `getAbisForChain` + `getDeployment` from leaf packages). No narrower interface is extracted; existing tests work around with `client as never`.

**Recommended fix:** Accept a narrower, well-typed dependency object (injection bundle) — only the ABI keys + deployment fields each client actually uses. Add a static factory `CanopyProtocolClient.fromContext(context)` for the production path; keep the narrow constructor for tests.

---

#### 24. [MINOR] Example uses `@ts-expect-error` and bypasses the SDK for balance reads

**Location:** `examples/react/src/VaultCard.tsx:75` (`@ts-expect-error` before wallet payload); `:40-46` (raw `movementClient.view` for asset balance).

**What's wrong:** `@ts-expect-error` indicates the SDK's `TransactionPayload` type isn't compatible with the wallet adapter's expected `InputTransactionData`. The example also bypasses the SDK to read a single user FA balance because there's no `sdk.canopy.getUserAssetBalance(user, vault)` single-vault helper.

**Recommended fix:** Either return `InputTransactionData` (wrapped) from SDK payload builders or document why the example needs to wrap. Add a single-vault asset-balance helper to the canopy client.

---

#### 25. [MINOR] `typesVersions` is redundant with `exports`

**Location:** `package.json:11-22`.
**Recommended fix:** Drop `typesVersions` once moduleResolution `bundler`/`node16` consumers are confirmed to resolve types through `exports`.

---

#### 26. [MINOR] `isMoveAddress` regex duplicated three times

**Location:** `packages/core/src/address.ts:9`; `packages/deployments/src/loader.ts:204`; `scripts/abi/check-local-abis.mjs:83`.
**Recommended fix:** Let `deployments` depend on `core`. Single shared validator.

---

#### 27. [MINOR] `data.rewardsDiscovery` always constructed regardless of chain
**Location:** `packages/sdk/src/client.ts:33-42`.
**Recommended fix:** Construct only when rewards feature enabled or chain supports static mappings.

---

#### 28. [MINOR] `RewardsDiscoveryClient.cache` is unbounded
**Location:** `packages/sdk/src/data/rewards-discovery.ts:146`.
**Recommended fix:** Bounded LRU, or drop per-asset cache and only cache `listPools()`.

---

#### 29. [MINOR] `cause: unknown | undefined` is `unknown`
**Location:** `packages/core/src/errors.ts:21`; `packages/deployments/src/errors.ts:11`.
**Recommended fix:** Drop the explicit field; use standard `Error.cause`. Include `cause` in `toJSON` as `{ name, message }` if it's an Error.

---

#### 30. [MINOR] `sdk.test.ts` is a 2,000-line monolith
**Location:** `tests/sdk.test.ts`.
**Recommended fix:** Split into `canopy.test.ts`, `rewards.test.ts`, `meridian.test.ts`, `rewards-discovery.test.ts`.

---

#### 31. [MINOR] `readMoveU64`/`readMoveU128` accept `number`, risking precision loss
**Location:** `packages/sdk/src/internal/move-readers.ts:69-85`.
**What's wrong:** `stringifyMoveScalar` accepts `string | number | bigint`. The Aptos REST API returns u64/u128 as strings; the `number` branch is dead code that risks loss > 2^53. Worse, `Number(view.decimals ?? 0)` in `canopy/client.ts:642, 667` bypasses this and silently truncates.
**Recommended fix:** Reject `number` in `stringifyMoveScalar`. Use `Number(parseU64(value))` for u8 fields. Add a `readMoveU8` helper.

---

#### 32. [MINOR] `parseCanopyVaultView` silently treats missing decimals as 0
**Location:** `packages/sdk/src/canopy/client.ts:642, 667`.
**Recommended fix:** Either require the field (throw if missing) or model as `decimals: number | null`. A 0-decimals vault is ambiguous with a missing field.

---

#### 33. [MINOR] `reward_rate_u12` / `reward_per_token_stored_u12` need documentation
**Location:** `rewards/client.ts:744-745`; `data/rewards-discovery.ts:294-295`.
**What's wrong:** SDK preserves raw u128 (correct for a low-level SDK), but the `_u12` suffix means 12-decimal fixed-point — downstream consumers must know to divide by `10^12`.
**Recommended fix:** Document on the `RewardData.rewardRate` and `RewardData.rewardPerTokenStored` TS type definitions. Consider adding a `RewardData.rewardRateScaled1e18` precomputed view for convenience.

---

#### 34. [MINOR] ABI-probing for router entry variants is implicit and load-bearing
**Location:** `canopy/client.ts:106-124, 176-194, 737-746`.
**What's wrong:** SDK selects between `deposit_coin`/`deposit_fa`/`deposit_fa_with_coin_type` via ABI probing. Works today; brittle to future router changes. The `wrapperCoinType` defaulting to `0x1::aptos_coin::AptosCoin` works only because the type parameter is ignored on FA paths — the comment is in Move (`satay-movement/.../router.move:247-250`) but absent on the SDK side.
**Recommended fix:** Add an SDK-side comment cross-referencing the Move comment. Better, once Surf is adopted (#4), use type-level discrimination from the ABI.

---

## What this review could not verify

1. **`canopy_rewards_view` Move source** — the rewards-view wrapper module at `0x2da6e…` is referenced by the SDK but not present in any provided repo. All rewards-side field-name verifications are against `batcher_view.move` struct definitions (which match the ABI), not against the wrapper's behavior.
2. **`STATIC_STAKING_TOKEN_POOL_MAPPINGS`** — 30 hardcoded mappings; format looks correct but cannot be cross-referenced against the on-chain registry without live RPC access.
3. **Sentio deployed endpoint** — `solo-labs/canopy-multi-rewards-movement` (SDK default) doesn't match `canopy-sentio-indexer` (processor `sentio.yaml`). Confirm with the Sentio dashboard which is canonical.
4. **`base_strategy::vault_base_strategy_view`** — read the struct definition but not the populator body. SDK assumes the struct is fully populated (no Option fields).
5. **MovePosition strategy packet HTTP endpoints** — off-chain; outside this review's scope.

---

## Recommended sequencing

**This week (Tier 0 — silently wrong on-chain):**
1. Fix Meridian withdraw arg mismatch (#1) — confirmed against Move source; pure SDK change.
2. **Verify** the Canopy router `Option<u64>` encoding by simulating one payload against movement-mainnet (#2). If confirmed, apply the fix using existing `moveOptionU64Argument`.
3. Fix `getBatchVaultAllMetadataAndBalances` destructure swap (#3) — confirmed against Move source; pure SDK change (or coordinate a Move-side tuple reorder).

For each, add a test asserting the exact JSON shape produced. #1 and #3 are confirmed merge blockers. #2 is a merge blocker conditional on the simulation result.

**Next 1-2 weeks (Tier 1 — architectural):**
4. Adopt typed contract bindings (#4) — `@thalalabs/surf` is the obvious candidate. Structurally prevents the Tier 0 class of bug.
5. Eliminate the `as unknown as` casts in `CanopySdk` (#5) — derive chain-aware contexts from the ABI tree; assertion-narrow at construction.
6. Fix `meridian.router` deployment lookup (#6) — point at `vaults` package address.
7. Decide and execute the package-split shape (#7) — real four-package split or single-package with subpath exports. The half-state is worse than either.

**Next 2-4 weeks (Tier 2 — robustness):**
8. Rewards discovery cleanup (#8) — build-time-generated snapshot, verify and fix Sentio endpoint, filter the catch.
9. Simplify `parseAllocationMap` (#9).
10. Real batch helpers (#10) — dedup, size bound, partial failure, per-feature flags computed from ABI presence (#13).
11. Centralize Move codecs (#11). Replace typed-entry stringliness (#12) — partially folded into #4.
12. Strategy unknowns (#14). Tests overhaul (#19). Import-style normalization (#20). ABI drift pre-commit (#21).

**Cleanup pass (Tier 3 — minor/roadmap):**
13. Address validator (#15). Decide intent of bundled ABIs (#16). Abort-code mapping (#17). Error-type redesign (#18). Other minor items (#22-#34).

---

## Cross-cutting recommendations

- **Adopt Surf.** Single biggest quality win. Eliminates the `unknown` ABI handling, deletes most parsers, gives typed entry-function builders.
- **One source of truth for features.** Derive `features` from ABI + address presence. Delete the JSON `features` block.
- **One source of truth for cross-package imports.** Always leaf package names. Remove subpath aliases from `tsconfig` and `tsup`.
- **Centralize Move codecs.** `readObject`, `readVector`, `readOption`, `readStruct`, `readSimpleMap` in `packages/core/src/move-codec.ts`.
- **Tighten errors** with a discriminated union; require chain + module + function on view errors; add `MoveAbort` with a code map.
- **Replace `STATIC_STAKING_TOKEN_POOL_MAPPINGS`** with a build-time-generated snapshot + on-disk cache of the last successful Sentio response. Surface staleness.
- **Add the missing test categories** (batcher edges, address fuzz, Sentio fallback ordering, ABI-vs-fixture compatibility).
