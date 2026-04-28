# Phase 3 Follow-Ups

These items were identified during Phase 3 work but are not required to finish
the current validation and drift-check milestone.

## Dev ABI Generation

Current ABI tooling is centered on supported deployed networks:

- production and testnet ABIs are fetched from fullnodes
- checked-in ABI files are validated against deployment addresses and expected
  module names

What is still missing is a clean path for unreleased or dev-only modules whose
ABIs should come from local Move build artifacts rather than deployed modules.

### Recommended Approach

- Extend the ABI manifest so each entry declares a source mode:
  - `deployed`
  - `artifact`
- Keep deployed networks fullnode-driven.
- Add support for local artifact generation through a configurable root such as
  `CANOPY_MOVE_ARTIFACTS_ROOT` or a CLI flag like
  `--artifacts-root=/path/to/build`.
- Normalize both source modes into the same checked-in output layout under
  `packages/bindings/abis/<chain>/`.
- Keep the local ABI checker source-agnostic so it validates the final ABI files
  regardless of whether they came from deployed modules or local artifacts.

### Priority

This is useful, but not essential for the current Phase 3 finish line.
Supported public networks should remain the priority, and dev ABI generation can
be added when we start supporting unreleased modules or developer-only chains in
the shared workflow.
