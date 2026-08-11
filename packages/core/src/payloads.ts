import type {
  InputEntryFunctionData,
  InputViewFunctionData,
} from "@aptos-labs/ts-sdk";
import { normalizeMoveAddress } from "./address";
import { formatMoveUint, type MoveUintBits, type MoveUintInput } from "./amounts";

export type MoveFunctionId = `${string}::${string}::${string}`;

export interface MoveFunctionIdInput {
  moduleAddress: string;
  moduleName: string;
  functionName: string;
}

export interface EntryFunctionPayloadInput {
  moduleAddress: string;
  moduleName: string;
  functionName: string;
  typeArguments?: string[];
  functionArguments?: InputEntryFunctionData["functionArguments"];
}

export type ViewFunctionPayloadInput = Omit<
  EntryFunctionPayloadInput,
  "functionArguments"
> & {
  functionArguments?: InputViewFunctionData["functionArguments"];
};

export function entryFunctionPayload(
  input: EntryFunctionPayloadInput
): InputEntryFunctionData {
  return {
    function: moveFunctionId(input),
    typeArguments: input.typeArguments ?? [],
    functionArguments: input.functionArguments ?? [],
  };
}

export function viewFunctionPayload(
  input: ViewFunctionPayloadInput
): InputViewFunctionData {
  return {
    function: moveFunctionId(input),
    typeArguments: input.typeArguments ?? [],
    functionArguments: input.functionArguments ?? [],
  };
}

export function moveFunctionId(input: MoveFunctionIdInput): MoveFunctionId {
  return `${normalizeMoveAddress(input.moduleAddress)}::${input.moduleName}::${input.functionName}`;
}

export function moveUintArgument(
  value: MoveUintInput,
  bits: MoveUintBits = 64
): string {
  return formatMoveUint(value, bits);
}

/**
 * Serializes a Move `Option<uN>` argument for `Aptos.view` / entry payloads.
 *
 * Returns `undefined` for none and the formatted scalar for some. The `ts-sdk`
 * converts arguments against the module ABI rather than passing raw JSON, so an
 * `Option` is expressed by presence, not by a `{ vec: [...] }` envelope — passing
 * that envelope fails with `Type mismatch for argument N, expected
 * 'bigint | number | string'`. (A hand-rolled HTTP `POST /v1/view` does want the
 * envelope; this helper is for the SDK path.)
 */
export function moveOptionArgument(
  value?: MoveUintInput | null,
  bits: MoveUintBits = 64
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return formatMoveUint(value, bits);
}
