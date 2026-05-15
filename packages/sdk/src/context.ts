import type { Aptos } from "@aptos-labs/ts-sdk";
import { getAbisForChain } from "@canopyhub/canopy-sdk/bindings";
import { getDeployment, type ChainName } from "@canopyhub/canopy-sdk/deployments";
import { CanopyError, CanopyErrorCode } from "@canopyhub/canopy-sdk/core";
import {
  aptosTestnetMovePositionConfig,
  movementMainnetMovePositionConfig,
  movementTestnetMovePositionConfig,
} from "./data/moveposition";
import type { SdkContext } from "./types";
import type { MovePositionConfig } from "./canopy/moveposition";

type CanopyFeatureChain = "movement-mainnet" | "aptos-testnet";
type MeridianFeatureChain = "movement-mainnet" | "aptos-mainnet";

export type CanopyFeatureContext = SdkContext<CanopyFeatureChain>;

export type MeridianFeatureContext = SdkContext<MeridianFeatureChain>;

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

export function requireCanopyFeatureContext<Chain extends ChainName>(
  context: SdkContext<Chain>
): SdkContext<Extract<Chain, CanopyFeatureChain>> {
  if (
    !context.deployment.features.canopy ||
    (context.chain !== "movement-mainnet" && context.chain !== "aptos-testnet") ||
    !("canopyVault" in context.abis) ||
    !("canopyRouter" in context.abis)
  ) {
    throw invalidFeatureContextError(context, "canopy");
  }

  return context as SdkContext<Extract<Chain, CanopyFeatureChain>>;
}

export function requireRewardsFeatureContext<Chain extends ChainName>(
  context: SdkContext<Chain>
): SdkContext<Extract<Chain, CanopyFeatureChain>> {
  if (
    !context.deployment.features.rewards ||
    (context.chain !== "movement-mainnet" && context.chain !== "aptos-testnet") ||
    !("multiRewards" in context.abis) ||
    !("multiRewardsRouter" in context.abis)
  ) {
    throw invalidFeatureContextError(context, "rewards");
  }

  return context as SdkContext<Extract<Chain, CanopyFeatureChain>>;
}

export function requireMeridianFeatureContext<Chain extends ChainName>(
  context: SdkContext<Chain>
): SdkContext<Extract<Chain, MeridianFeatureChain>> {
  if (
    !context.deployment.features.almMeridian ||
    (context.chain !== "movement-mainnet" && context.chain !== "aptos-mainnet") ||
    !("meridianRouter" in context.abis) ||
    !("meridianVault" in context.abis) ||
    !("meridianRegistry" in context.abis)
  ) {
    throw invalidFeatureContextError(context, "almMeridian");
  }

  return context as SdkContext<Extract<Chain, MeridianFeatureChain>>;
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

function invalidFeatureContextError(
  context: SdkContext<ChainName>,
  feature: "canopy" | "rewards" | "almMeridian"
): CanopyError {
  return new CanopyError(
    "SDK context does not satisfy the requested feature requirements",
    CanopyErrorCode.InvalidDeployment,
    {
      chain: context.chain,
      feature,
      features: context.deployment.features,
    }
  );
}
