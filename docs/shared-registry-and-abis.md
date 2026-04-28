# Shared Registry And ABIs

`packages/deployments` is the source of truth for public deployment addresses.
`packages/bindings` is the source of truth for checked-in Move module ABIs.

ABIs are scoped by chain because module addresses and exposed functions can differ
between networks.

## Update Deployment Addresses

Edit the relevant file in `packages/deployments/addresses/`:

- `movement-mainnet.json`
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
pnpm run abi:check -- --chain=aptos-testnet
pnpm run abi:check -- --chain=aptos-mainnet
```

## Open Data-Source Findings

- Rewards staking token-to-pool mappings should ideally come from on-chain
  protocol state, or from an indexed source derived from on-chain state. Avoid
  manually maintained hardcoded mappings in SDK or CLI code.
- If static mappings are temporarily unavoidable, generate them with provenance
  and freshness metadata, and make callers aware that the lookup source is a
  degraded fallback.
