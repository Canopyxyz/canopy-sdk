import {
  callSingleViewPayloadResult,
  callViewPayloadFunction,
  viewFunctionPayload,
  type MoveViewClient,
} from "@canopyhub/canopy-sdk-core";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk-bindings";

/**
 * View payload construction against a bound ABI.
 *
 * Replaces `internal/surf.ts`, which wrapped Surf's `createViewPayload`. Surf was
 * removed because it pulls in `@initia/initia.js` (a different chain's SDK) from its
 * main entry, which requires Node's `Buffer` and so breaks any browser bundle.
 *
 * The module id comes from the ABI's own `address` / `name`, exactly as Surf derived
 * it, so behaviour is unchanged. Those fields are pinned to the deployment registry
 * by `abi:check-local` and `tests/registry-consistency.test.ts`.
 *
 * Function names are plain strings here. The compile-time checking Surf gave is
 * replaced by per-client literal unions (e.g. `CanopyRouterFunction`) plus a
 * hermetic ABI-conformance test, which also covers argument arity — the thing that
 * actually broke.
 */
export function abiViewPayload(
  abi: MoveModuleAbi,
  functionName: string,
  functionArguments?: unknown[],
  typeArguments?: string[]
) {
  return viewFunctionPayload({
    moduleAddress: abi.address,
    moduleName: abi.name,
    functionName,
    ...(typeArguments ? { typeArguments } : {}),
    ...(functionArguments ? { functionArguments: functionArguments as never } : {}),
  });
}

/** Reads a single value from a view function on a bound ABI. */
export function callAbiView<Result = unknown>(
  client: MoveViewClient,
  abi: MoveModuleAbi,
  functionName: string,
  functionArguments?: unknown[],
  typeArguments?: string[]
): Promise<Result> {
  return callSingleViewPayloadResult(
    client,
    abiViewPayload(abi, functionName, functionArguments, typeArguments)
  );
}

/** Reads the full result tuple from a view function returning multiple values. */
export function callAbiViewFunction<Result extends unknown[] = unknown[]>(
  client: MoveViewClient,
  abi: MoveModuleAbi,
  functionName: string,
  functionArguments?: unknown[],
  typeArguments?: string[]
): Promise<Result> {
  return callViewPayloadFunction<Result>(
    client,
    abiViewPayload(abi, functionName, functionArguments, typeArguments)
  );
}
