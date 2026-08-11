import {
  normalizeMoveAddress,
  type MoveAbortResolution,
  type MoveAbortResolverInput,
} from "@canopyhub/canopy-sdk-core";
import { getContractAddress, type ChainName } from "@canopyhub/canopy-sdk-deployments";
import { CURATOR_ABORTS } from "../curator/aborts";

/**
 * Builds an address-scoped abort resolver for the curator vault packages.
 *
 * See `../curator/aborts.ts` for why this does not fire on movement-testnet today:
 * `packages/core` cannot parse the chain's actual abort string, so it never reaches
 * a resolver. This is wired anyway to match how the other protocol clients declare
 * their abort codes, and so the plumbing is correct once core is fixed.
 *
 * `KNOWN_MOVE_ABORTS` in `packages/core` is keyed only by module and function
 * name, and those are not unique across protocols — curator and Canopy both ship
 * `vault` and `router` modules. Scoping by the aborting module's address is what
 * makes curator's table unambiguous.
 *
 * Returns `undefined` when the abort did not come from a curator package, so the
 * default lookup still handles Canopy / rewards / Meridian exactly as before.
 * Returns `{ kind: "unknown" }` when the abort *is* curator's but the code is not
 * in the table — that suppresses the default lookup and its heuristics, so an
 * unmapped curator code surfaces as a bare code instead of borrowing a same-named
 * Canopy message.
 */
export function createCuratorAbortResolver(
  chain: ChainName
): ((input: MoveAbortResolverInput) => MoveAbortResolution | undefined) | undefined {
  const ownedAddresses = [
    getContractAddress(chain, "curator.vault"),
    getContractAddress(chain, "curator.router"),
  ].flatMap((address) => (address ? [normalizeMoveAddress(address)] : []));

  if (ownedAddresses.length === 0) {
    return undefined;
  }

  return (input) => {
    if (input.moduleAddress === undefined) {
      return undefined;
    }

    const moduleAddress = normalizeMoveAddress(input.moduleAddress);
    if (!ownedAddresses.includes(moduleAddress)) {
      return undefined;
    }

    const known =
      input.moduleName && input.functionName
        ? CURATOR_ABORTS[`${input.moduleName}::${input.functionName}:${input.abortCode}`]
        : undefined;

    return known ? { kind: "known", ...known } : { kind: "unknown" };
  };
}
