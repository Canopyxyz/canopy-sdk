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

## Move Abort Shapes

`extractMoveAbortDetails` in `packages/core/src/errors.ts` parses three abort string
shapes. The endpoints do not agree with each other, and **simulation and `/v1/view` on
the same chain disagree**, so handling one is not handling the other. This applies to
every client, not just curator.

**`/v1/view` on Movement**, captured by calling `partner_registry::payout_address` with
an unregistered id:

```text
Failed to execute function: VMError { major_status: ABORTED, sub_status: Some(2),
message: Some("0xdefc...c879f::partner_registry::payout_address at offset 17"),
exec_state: ..., location: Module(ModuleId { address: defc...c879f,
name: Identifier("partner_registry") }), indices: [], offsets: [...] }
```

**Simulation on Movement**, captured by simulating a below-minimum curator deposit:

```text
Move abort in 0xdefc3f12...c879f::vault: EDEPOSIT_BELOW_MIN(0x65): Deposit amount is below the minimum required.
```

**Aptos:**

```text
Move abort in 0x1::vault::deposit: abort code 117
```

Three differences matter:

1. **Whether the string says "abort" at all.** The view shape says `ABORTED`, which
   `\babort\b` does not match — there is no word boundary before `ED`. That one
   character silently discarded every view abort in the SDK.
2. **Where the code lives.** Views put it in `sub_status: Some(N)`; simulation puts it
   inside `ENAME(0xHEX)`; Aptos writes `abort code N` in decimal. They are read
   most-specific-first, because the bare-code patterns are loose enough to match an
   unrelated `code` elsewhere in the same string.
3. **How much of the location is reported.** Views name the full
   `address::module::function`; simulation stops at `address::module`; Aptos names the
   function too. `KNOWN_MOVE_ABORTS` keys are `module::function:code`, so it can only
   ever match shapes that carry a function name.

The `sub_status` read is gated on `major_status: ABORTED`, and that gate is
load-bearing: a missing object reports the bare string `PartialVMError with status
ABORTED`, which clears the `abort(ed)?` guard but carries no code. Without the gate it
would fall through to the loose bare-code pattern and be reported as a Move abort with
whatever number appeared first.

Movement's simulation shape sends both the error name and a human-readable message, so
those win over `KNOWN_MOVE_ABORTS` whenever they are present. The table is a stand-in
for the shapes that send neither — **it is not the place to add Movement error
constants.** The view shape sends no name at all, so a view abort reports the bare code
plus its location; a guessed name would be worse than none.

Table lookups are exact-key only. There used to be two prefix fallbacks — `deposit_*`
with code 1 and `withdraw_*` with code 2 mapped to the router's slippage errors — which
were redundant for every router function in the table (all have exact keys) and wrong
for anything else sharing the prefix. Once views started parsing, a curator
`vault::deposit_preview` aborting with code 1 was labelled "The deposit produced fewer
shares than the caller required." Do not reintroduce prefix matching.

Because the simulation shape names only the aborting module — frequently an inner module
the caller never invoked, such as a router entry function aborting inside a vault — a
function name is borrowed from the caller's own payload only when that payload resolves
to the same address *and* module. Otherwise `moveAbort` reports `module` with no
`functionName` and no `function`, rather than inventing a function id that does not
exist. The function the caller actually invoked is always on the enclosing
`details.function`. Both branches occur in practice: a below-minimum `router::deposit`
aborts in `vault` (no function reported), while `router::deposit_with_partner` with an
unregistered id aborts in `router` itself (function reported).

`deposit_preview` / `instant_redeem_preview` / `queued_redemption_preview` remain the
better pre-flight validation path for curator vaults — they return decoded blocking
reasons before anything is signed, rather than after a simulated abort.

## Open Data-Source Findings

- Rewards staking token-to-pool mappings should ideally come from on-chain
  protocol state, or from an indexed source derived from on-chain state. Avoid
  manually maintained hardcoded mappings in SDK or CLI code.
- If static mappings are temporarily unavoidable, generate them with provenance
  and freshness metadata, and make callers aware that the lookup source is a
  degraded fallback.
