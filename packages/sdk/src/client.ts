import type { Movement } from "@moveindustries/ts-sdk";
import { CanopyMetadataClient, RewardsDiscoveryClient } from "./data";
import type { CanopyProtocolClient } from "./canopy";
import { CanopyProtocolClient as CanopyProtocolClientImpl } from "./canopy";
import { createSdkContext } from "./context";
import { RewardsClient } from "./rewards";
import type { CanopySdkOptions, SdkChainName, SdkContext } from "./types";
import { MeridianClient } from "./alm/meridian";

type CanopyContext = SdkContext<"movement-mainnet" | "aptos-testnet">;
type MeridianContext = SdkContext<"movement-mainnet" | "aptos-mainnet">;

export class CanopySdk<Chain extends SdkChainName = SdkChainName> {
  readonly alm: {
    meridian?: MeridianClient;
  };
  readonly canopy?: CanopyProtocolClient;
  readonly chain: Chain;
  readonly data: {
    canopyMetadata: CanopyMetadataClient;
    rewardsDiscovery: RewardsDiscoveryClient;
  };
  readonly rewards?: RewardsClient;

  constructor(client: Movement, options: CanopySdkOptions<Chain>) {
    const context = createSdkContext(
      client,
      options.chain,
      options.moveposition ? { moveposition: options.moveposition } : undefined
    );
    this.chain = context.chain;

    this.alm = {};
    this.data = {
      canopyMetadata: new CanopyMetadataClient({
        chainId: context.deployment.chainId,
        ...(options.offchain?.canopyMetadataEndpoint
          ? { endpoint: options.offchain.canopyMetadataEndpoint }
          : {}),
        ...(options.offchain?.cacheTimeoutMs !== undefined
          ? { cacheTimeoutMs: options.offchain.cacheTimeoutMs }
          : {}),
      }),
      rewardsDiscovery: new RewardsDiscoveryClient({
        chain: context.chain,
        ...(options.offchain?.sentioEndpoint ? { endpoint: options.offchain.sentioEndpoint } : {}),
        ...(options.offchain?.sentioApiKey ? { apiKey: options.offchain.sentioApiKey } : {}),
        ...(options.offchain?.cacheTimeoutMs !== undefined
          ? { cacheTimeoutMs: options.offchain.cacheTimeoutMs }
          : {}),
      }),
    };

    if (context.deployment.features?.canopy && context.chain !== "aptos-mainnet") {
      this.canopy = new CanopyProtocolClientImpl(context as unknown as CanopyContext);
    }

    if (context.deployment.features?.rewards && context.chain !== "aptos-mainnet") {
      this.rewards = new RewardsClient(
        context as unknown as CanopyContext,
        this.data.rewardsDiscovery
      );
    }

    if (context.deployment.features?.almMeridian && context.chain !== "aptos-testnet") {
      this.alm.meridian = new MeridianClient(context as unknown as MeridianContext);
    }
  }
}

export function createCanopySdk<Chain extends SdkChainName>(
  client: Movement,
  options: CanopySdkOptions<Chain>
): CanopySdk<Chain> {
  return new CanopySdk(client, options);
}
