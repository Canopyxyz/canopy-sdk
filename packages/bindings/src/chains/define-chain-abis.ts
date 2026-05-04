import type { AbiChainName, ChainAbiSet, MoveModuleAbi } from "../types";

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
  return Object.fromEntries(
    Object.entries(abis).map(([name, abi]) => [name, normalizeMoveModuleAbi(abi)])
  ) as unknown as ChainAbiSet[Chain];
}

export function retargetMoveModuleAbi(
  abi: unknown,
  address: string
): MoveModuleAbi {
  const normalized = normalizeMoveModuleAbi(abi);
  const sourceAddress = normalized.address;

  if (sourceAddress === address) {
    return normalized;
  }

  return JSON.parse(
    JSON.stringify(normalized).split(sourceAddress).join(address)
  ) as MoveModuleAbi;
}

function normalizeMoveModuleAbi(abi: unknown): MoveModuleAbi {
  const moduleAbi = abi as Omit<MoveModuleAbi, "structs"> & {
    structs?: MoveModuleAbi["structs"];
  };

  return {
    ...moduleAbi,
    structs: moduleAbi.structs ?? [],
  };
}
