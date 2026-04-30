import type { AbiChainName, ChainAbiSet } from "../types";

type RequiredKeyOf<T> = Exclude<
  {
    [Key in keyof T]-?: {} extends Pick<T, Key> ? never : Key;
  }[keyof T],
  undefined
>;

type RawAbiSet<Chain extends AbiChainName> = {
  [Name in RequiredKeyOf<ChainAbiSet[Chain]>]: unknown;
} & Partial<
  Record<Exclude<keyof ChainAbiSet[Chain], RequiredKeyOf<ChainAbiSet[Chain]>>, unknown>
>;

export function defineChainAbis<Chain extends AbiChainName>(
  _chain: Chain,
  abis: RawAbiSet<Chain>
): ChainAbiSet[Chain] {
  return abis as ChainAbiSet[Chain];
}
