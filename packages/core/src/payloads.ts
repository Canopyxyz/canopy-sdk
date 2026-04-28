import type {
  InputEntryFunctionData,
  InputViewFunctionData,
} from "@moveindustries/ts-sdk";
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
