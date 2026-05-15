import type { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { CanopyError, CanopyErrorCode } from "./errors";
import { viewFunctionPayload, type ViewFunctionPayloadInput } from "./payloads";

export interface ViewFunctionRequest {
  payload: InputViewFunctionData;
}

export interface MoveViewClient {
  view(input: ViewFunctionRequest): Promise<unknown[]>;
}

export function viewFunctionRequest(
  input: ViewFunctionPayloadInput
): ViewFunctionRequest {
  return {
    payload: viewFunctionPayload(input),
  };
}

export async function callViewFunction<Result extends unknown[] = unknown[]>(
  client: MoveViewClient,
  input: ViewFunctionPayloadInput
): Promise<Result> {
  const request = viewFunctionRequest(input);

  try {
    return (await client.view(request)) as Result;
  } catch (error) {
    throw new CanopyError(
      "View function call failed",
      CanopyErrorCode.ViewCallFailed,
      { function: request.payload.function },
      { cause: error }
    );
  }
}

export async function callSingleViewResult<Result = unknown>(
  client: MoveViewClient,
  input: ViewFunctionPayloadInput
): Promise<Result> {
  const result = await callViewFunction(client, input);
  return readViewResult<Result>(result);
}

export function readViewResult<Result = unknown>(
  result: unknown[],
  index = 0
): Result {
  if (!Array.isArray(result) || index < 0 || index >= result.length) {
    throw new CanopyError(
      "View result is missing",
      CanopyErrorCode.ViewCallFailed,
      { index, resultLength: Array.isArray(result) ? result.length : undefined }
    );
  }

  return result[index] as Result;
}
