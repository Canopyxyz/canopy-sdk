import type { Aptos } from "@aptos-labs/ts-sdk";
import { RewardsDiscoveryClient } from "./data";
import type { CanopyProtocolClient } from "./canopy";
import { CanopyProtocolClient as CanopyProtocolClientImpl } from "./canopy";
import {
  createSdkContext,
  requireCanopyFeatureContext,
  requireMeridianFeatureContext,
  requireRewardsFeatureContext,
} from "./context";
import { RewardsClient } from "./rewards";
import type { CanopySdkOptions, SdkChainName } from "./types";
import { MeridianClient } from "./alm/meridian";

export class CanopySdk<Chain extends SdkChainName = SdkChainName> {
  readonly alm: {
    meridian?: MeridianClient;
  };
  readonly canopy?: CanopyProtocolClient;
  readonly chain: Chain;
  readonly data: {
    rewardsDiscovery?: RewardsDiscoveryClient;
  };
  readonly rewards?: RewardsClient;

  constructor(client: Aptos, options: CanopySdkOptions<Chain>) {
    const baseContext = createSdkContext(
      client,
      options.chain,
      options.moveposition ? { moveposition: options.moveposition } : undefined
    );
    this.chain = baseContext.chain;

    this.alm = {};
    const rewardsDiscovery =
      baseContext.deployment.features.rewards || options.offchain?.sentioEndpoint
        ? new RewardsDiscoveryClient({
            chain: baseContext.chain,
            ...(options.offchain?.sentioEndpoint
              ? { endpoint: options.offchain.sentioEndpoint }
              : {}),
            ...(options.offchain?.sentioApiKey ? { apiKey: options.offchain.sentioApiKey } : {}),
            ...(options.offchain?.cacheMaxEntries !== undefined
              ? { cacheMaxEntries: options.offchain.cacheMaxEntries }
              : {}),
            ...(options.offchain?.cacheTimeoutMs !== undefined
              ? { cacheTimeoutMs: options.offchain.cacheTimeoutMs }
              : {}),
          })
        : undefined;
    this.data = {
      ...(rewardsDiscovery ? { rewardsDiscovery } : {}),
    };

    if (baseContext.deployment.features.canopy) {
      this.canopy = CanopyProtocolClientImpl.fromContext(
        requireCanopyFeatureContext(baseContext)
      );
    }

    if (baseContext.deployment.features.rewards) {
      this.rewards = RewardsClient.fromContext(
        requireRewardsFeatureContext(baseContext),
        this.data.rewardsDiscovery
      );
    }

    if (baseContext.deployment.features.almMeridian) {
      this.alm.meridian = MeridianClient.fromContext(
        requireMeridianFeatureContext(baseContext)
      );
    }
  }
}

export function createCanopySdk<Chain extends SdkChainName>(
  client: Aptos,
  options: CanopySdkOptions<Chain>
): CanopySdk<Chain> {
  return new CanopySdk(client, options);
}
