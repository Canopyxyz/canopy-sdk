import type { Aptos } from "@aptos-labs/ts-sdk";
import { getAbisForChain } from "@canopyhub/canopy-sdk/bindings";
import { getDeployment, type ChainName } from "@canopyhub/canopy-sdk/deployments";
import {
  aptosTestnetMovePositionConfig,
  movementMainnetMovePositionConfig,
  movementTestnetMovePositionConfig,
} from "./data/moveposition";
import type { SdkContext } from "./types";
import type { MovePositionConfig } from "./canopy/moveposition";

export function createSdkContext<Chain extends ChainName>(
  client: Aptos,
  chain: Chain,
  options?: { moveposition?: Partial<MovePositionConfig> }
): SdkContext<Chain> {
  const moveposition = resolveMovePositionConfig(chain, options?.moveposition);

  return {
    abis: getAbisForChain(chain),
    chain,
    client,
    deployment: getDeployment(chain),
    ...(moveposition ? { moveposition } : {}),
  };
}

function resolveMovePositionConfig(
  chain: ChainName,
  override?: Partial<MovePositionConfig>
): MovePositionConfig | undefined {
  const base =
    chain === "movement-mainnet"
      ? movementMainnetMovePositionConfig
      : chain === "movement-testnet"
        ? movementTestnetMovePositionConfig
        : chain === "aptos-testnet"
          ? aptosTestnetMovePositionConfig
          : undefined;

  if (!base && !override) {
    return undefined;
  }

  const apiUrl = override?.apiUrl ?? base?.apiUrl;
  const nameMap = { ...(base?.nameMap ?? {}), ...(override?.nameMap ?? {}) };
  const virtualCoinMap = {
    ...(base?.virtualCoinMap ?? {}),
    ...(override?.virtualCoinMap ?? {}),
  };

  if (!apiUrl || Object.keys(nameMap).length === 0 || Object.keys(virtualCoinMap).length === 0) {
    return undefined;
  }

  return {
    apiUrl,
    nameMap,
    virtualCoinMap,
  };
}
