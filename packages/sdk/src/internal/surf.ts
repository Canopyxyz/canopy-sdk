import { createViewPayload } from "@thalalabs/surf";
import type { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import type { MoveModuleAbi } from "@canopyhub/canopy-sdk-bindings";
import { normalizeMoveAddress } from "@canopyhub/canopy-sdk-core";

export type SurfViewFunctionName<TAbi extends MoveModuleAbi> = Extract<
  TAbi["exposed_functions"][number],
  { is_view: true }
>["name"];

type AbiViewFunction<
  TAbi extends MoveModuleAbi,
  TFn extends SurfViewFunctionName<TAbi>,
> = Extract<TAbi["exposed_functions"][number], { name: TFn; is_view: true }>;

type MoveViewArgument<TMoveType extends string> =
  TMoveType extends "bool"
    ? boolean
    : TMoveType extends "u8" | "u16" | "u32"
      ? number
      : TMoveType extends "u64" | "u128" | "u256"
        ? bigint | number | string
        : TMoveType extends `vector<${infer TInner}>`
          ? MoveViewArgument<TInner>[]
          : TMoveType extends `0x1::option::Option<${infer TInner}>`
            ? MoveViewArgument<TInner> | undefined
            : TMoveType extends `0x${string}`
              ? `0x${string}`
              : unknown;

type MoveViewArguments<TParams extends readonly string[]> =
  TParams extends readonly [infer TArg extends string, ...infer TRest extends readonly string[]]
    ? [MoveViewArgument<TArg>, ...MoveViewArguments<TRest>]
    : [];

type MoveViewTypeArguments<TAbiFunction extends { generic_type_params: readonly unknown[] }> =
  TAbiFunction["generic_type_params"] extends readonly [
    unknown,
    ...infer TRest extends readonly unknown[],
  ]
    ? [string, ...MoveViewTypeArguments<{ generic_type_params: TRest }>]
    : [];

export type SurfViewFunctionArguments<
  TAbi extends MoveModuleAbi,
  TFn extends SurfViewFunctionName<TAbi>,
> = MoveViewArguments<AbiViewFunction<TAbi, TFn>["params"]>;

export type SurfViewFunctionTypeArguments<
  TAbi extends MoveModuleAbi,
  TFn extends SurfViewFunctionName<TAbi>,
> = MoveViewTypeArguments<AbiViewFunction<TAbi, TFn>>;

type SurfViewInput<
  TAbi extends MoveModuleAbi,
  TFn extends SurfViewFunctionName<TAbi>,
> = {
  functionName: TFn;
  functionArguments?: SurfViewFunctionArguments<TAbi, TFn>;
  typeArguments?: SurfViewFunctionTypeArguments<TAbi, TFn>;
  address?: `0x${string}`;
};

export function createSurfViewFunctionPayload<
  TAbi extends MoveModuleAbi,
  TFn extends SurfViewFunctionName<TAbi>,
>(
  abi: TAbi,
  input: SurfViewInput<TAbi, TFn>
): InputViewFunctionData {
  const functionArguments =
    input.functionArguments ??
    ([] as SurfViewFunctionArguments<TAbi, TFn>);
  const typeArguments =
    input.typeArguments ?? ([] as SurfViewFunctionTypeArguments<TAbi, TFn>);

  // Surf's generic payload helpers still expect their own extractor-derived tuple types here.
  // We preserve ABI literals on our side and keep the one final cast at this boundary local.
  const payload = createViewPayload<TAbi, TFn>(abi, {
    function: input.functionName,
    functionArguments: functionArguments as never,
    typeArguments: typeArguments as never,
    ...(input.address ? { address: normalizeMoveAddress(input.address) } : {}),
  });

  return {
    function: normalizePayloadFunctionId(payload.function) as InputViewFunctionData["function"],
    ...(payload.typeArguments ? { typeArguments: payload.typeArguments } : {}),
    ...(payload.functionArguments ? { functionArguments: payload.functionArguments } : {}),
    ...(payload.abi ? { abi: payload.abi } : {}),
  };
}

function normalizePayloadFunctionId(functionId: string): string {
  const [address, moduleName, functionName, ...rest] = functionId.split("::");

  if (!address || !moduleName || !functionName || rest.length > 0) {
    return functionId;
  }

  return `${normalizeMoveAddress(address)}::${moduleName}::${functionName}`;
}
