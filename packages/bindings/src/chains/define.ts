import type { AbiChainName, ChainAbiSet } from "../types";

type RawAbiSet<Chain extends AbiChainName> = {
  [Name in keyof ChainAbiSet[Chain]]: unknown;
};

export function defineChainAbis<Chain extends AbiChainName>(
  _chain: Chain,
  abis: RawAbiSet<Chain>
): ChainAbiSet[Chain] {
  return abis as ChainAbiSet[Chain];
}
