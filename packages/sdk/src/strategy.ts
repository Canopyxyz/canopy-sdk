import { sameMoveAddress } from "@canopyhub/canopy-sdk/core";
import {
  getContractAddress,
  type ChainName,
  type ContractId,
} from "@canopyhub/canopy-sdk/deployments";
import {
  getContract,
  requireContract,
  type ResolvedContract,
} from "./contracts";

const CANOPY_STRATEGIES = {
  echelon: {
    contractId: "canopy.strategy.echelonSimple",
    displayName: "Echelon Simple",
  },
  layerbank: {
    contractId: "canopy.strategy.layerbankSimple",
    displayName: "LayerBank Simple",
  },
  moveposition: {
    contractId: "canopy.strategy.movepositionSimple",
    displayName: "MovePosition Simple",
  },
  placeholder: {
    contractId: "canopy.strategy.placeholderSimple",
    displayName: "Placeholder",
  },
  meridianRewards: {
    contractId: "canopy.strategy.meridianRewards",
    displayName: "Meridian Rewards",
  },
} as const satisfies Record<
  string,
  {
    contractId: ContractId;
    displayName: string;
  }
>;

export type CanopyStrategyProtocol = keyof typeof CANOPY_STRATEGIES;

const CANOPY_STRATEGY_PROTOCOLS = Object.keys(
  CANOPY_STRATEGIES
) as CanopyStrategyProtocol[];

export function getCanopyStrategyContractId(
  protocol: CanopyStrategyProtocol
): ContractId {
  return CANOPY_STRATEGIES[protocol].contractId;
}

export function getCanopyStrategyDisplayName(
  protocol: CanopyStrategyProtocol
): string {
  return CANOPY_STRATEGIES[protocol].displayName;
}

export function inferCanopyStrategyProtocol(
  chain: ChainName,
  address: string
): CanopyStrategyProtocol | null {
  for (const protocol of CANOPY_STRATEGY_PROTOCOLS) {
    const deployed = getContractAddress(
      chain,
      getCanopyStrategyContractId(protocol)
    );
    if (deployed !== undefined && sameMoveAddress(deployed, address)) {
      return protocol;
    }
  }

  return null;
}

export function inferCanopyStrategyContractId(
  chain: ChainName,
  address: string
): ContractId | null {
  const protocol = inferCanopyStrategyProtocol(chain, address);
  return protocol === null ? null : getCanopyStrategyContractId(protocol);
}

export function getCanopyStrategyContract(
  chain: ChainName,
  protocol: CanopyStrategyProtocol
): ResolvedContract | null {
  return getContract(chain, getCanopyStrategyContractId(protocol));
}

export function requireCanopyStrategyContract(
  chain: ChainName,
  protocol: CanopyStrategyProtocol
): ResolvedContract {
  return requireContract(chain, getCanopyStrategyContractId(protocol));
}
