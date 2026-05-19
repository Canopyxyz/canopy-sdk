import type {
  AbiChainName,
  ChainAbiSet,
  MoveExposedFunction,
  MoveModuleAbi,
} from "../types";

type RequiredKeyOf<T> = Exclude<
  {
    [Key in keyof T]-?: {} extends Pick<T, Key> ? never : Key;
  }[keyof T],
  undefined
>;

export interface MoveExposedFunctionInput extends Omit<
  MoveExposedFunction,
  "generic_type_params" | "params" | "return"
> {
  generic_type_params: readonly unknown[];
  params: readonly string[];
  return: readonly string[];
}

export interface MoveModuleAbiInput extends Omit<
  MoveModuleAbi,
  "exposed_functions" | "structs"
> {
  exposed_functions: readonly MoveExposedFunctionInput[];
  structs: readonly unknown[];
}

type RawAbiSet<Chain extends AbiChainName> = {
  [Name in RequiredKeyOf<ChainAbiSet[Chain]>]: MoveModuleAbiInput;
} & Partial<
  Record<
    Exclude<keyof ChainAbiSet[Chain], RequiredKeyOf<ChainAbiSet[Chain]>>,
    MoveModuleAbiInput
  >
>;

export function defineChainAbis<Chain extends AbiChainName, Abis extends RawAbiSet<Chain>>(
  _chain: Chain,
  abis: Abis
): Abis {
  return abis;
}
