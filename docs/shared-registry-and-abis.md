# Shared Registry And ABIs

`packages/deployments` is the source of truth for public deployment addresses.
`packages/bindings` is the source of truth for checked-in Move module ABIs.

ABIs are scoped by chain because module addresses and exposed functions can differ
between networks.

## Update Deployment Addresses

Edit the relevant file in `packages/deployments/addresses/`:

- `movement-mainnet.json`
- `movement-testnet.json`
- `aptos-mainnet.json`
- `aptos-testnet.json`

Use feature flags to describe supported protocol surfaces on each chain. If a
feature is enabled, validation requires the addresses needed by that feature.

Run:

```bash
pnpm run typecheck
pnpm run validate:deployments
```

## Fetch ABIs From Deployed Modules

ABI fetches are driven by `scripts/abi/abi-manifest.mjs`. Each manifest entry
maps a chain, deployment address path, module name, and output file.

Fetch ABIs for one chain:

```bash
pnpm run abi:fetch -- --chain=movement-mainnet
pnpm run abi:fetch -- --chain=movement-testnet
pnpm run abi:fetch -- --chain=aptos-testnet
pnpm run abi:fetch -- --chain=aptos-mainnet
```

Check local ABI files against deployment addresses and manifest module names:

```bash
pnpm run abi:check-local
```

Check checked-in ABIs against live fullnodes:

```bash
pnpm run abi:check -- --chain=movement-mainnet
pnpm run abi:check -- --chain=movement-testnet
pnpm run abi:check -- --chain=aptos-testnet
pnpm run abi:check -- --chain=aptos-mainnet
```

## Known Issue: Move Abort Names Are Not Resolved On Movement

`extractMoveAbortDetails` in `packages/core/src/errors.ts` does not parse the abort
strings movement-testnet actually returns, so `details.moveAbort` is `undefined` and
`KNOWN_MOVE_ABORTS` never matches. This affects every client, not just curator.

Observed live (simulating a below-minimum curator deposit):

```text
Move abort in 0xdefc3f12...c879f::vault: EDEPOSIT_BELOW_MIN(0x65): Deposit amount is below the minimum required.
```

Two mismatches:

1. `parseAbortCode` requires a literal `abort code N` or `code: N`. The real string
   carries the code as `ENAME(0xHEX)`, so no code is found and the abort is
   discarded. The raw text still reaches callers as `details.vmStatus`.
2. `KNOWN_MOVE_ABORTS` keys are `module::function:code`, but the chain reports only
   `address::module` — there is no function name to key on.

The existing unit tests pass because they feed a synthetic
`…::module::function: abort code N` string with a decimal code.

Worth noting the chain already supplies both the error name and a human-readable
message. If this is fixed, prefer those over a hand-maintained table rather than
growing the table.

Until then, `deposit_preview` / `instant_redeem_preview` /
`queued_redemption_preview` are the working pre-flight validation path for curator
vaults — they return decoded blocking reasons before anything is signed.

## Open Data-Source Findings

- Rewards staking token-to-pool mappings should ideally come from on-chain
  protocol state, or from an indexed source derived from on-chain state. Avoid
  manually maintained hardcoded mappings in SDK or CLI code.
- If static mappings are temporarily unavoidable, generate them with provenance
  and freshness metadata, and make callers aware that the lookup source is a
  degraded fallback.
