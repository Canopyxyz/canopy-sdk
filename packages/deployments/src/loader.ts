import aptosMainnet from "../addresses/aptos-mainnet.json";
import aptosTestnet from "../addresses/aptos-testnet.json";
import movementMainnet from "../addresses/movement-mainnet.json";
import { CHAIN_IDS, FULLNODE_DEFAULTS } from "./chains";
import { DeploymentError } from "./errors";
import { CANOPY_REQUIRED, MERIDIAN_REQUIRED_STRATEGIES } from "./schema";
import type { ChainDeployment, ChainDeploymentInput, ChainName } from "./types";

const DEPLOYMENTS = {
  "movement-mainnet": movementMainnet as ChainDeploymentInput,
  "aptos-mainnet": aptosMainnet as ChainDeploymentInput,
  "aptos-testnet": aptosTestnet as ChainDeploymentInput,
} as const satisfies Record<ChainName, ChainDeploymentInput>;

export function listDeployments(): ChainDeployment[] {
  return Object.values(DEPLOYMENTS).map(validateDeployment);
}

export function getDeployment(chain: ChainName): ChainDeployment {
  return validateDeployment(DEPLOYMENTS[chain]);
}

export function validateDeployment(input: ChainDeploymentInput): ChainDeployment {
  const deployment = withDeploymentDefaults(input);
  const expectedChainId = CHAIN_IDS[deployment.chain];

  if (deployment.chainId !== expectedChainId) {
    throw new DeploymentError(
      `${deployment.chain}: chainId must be ${expectedChainId}, got ${deployment.chainId}`,
      {
        chain: deployment.chain,
        expected: expectedChainId,
        got: deployment.chainId,
      }
    );
  }

  if (deployment.fullnode.length === 0) {
    throw new DeploymentError(`${deployment.chain}: fullnode is required`, {
      chain: deployment.chain,
    });
  }

  validateOptionalAddress(deployment.canopy?.core, "canopy.core");
  validateOptionalAddress(deployment.canopy?.router, "canopy.router");
  validateAddressMap(deployment.canopy?.blocks, "canopy.blocks");
  validateAddressMap(deployment.canopy?.strategies, "canopy.strategies");
  validateOptionalAddress(deployment.canopy?.helpers, "canopy.helpers");
  validateOptionalAddress(deployment.canopy?.views, "canopy.views");
  validateOptionalAddress(deployment.rewards?.module, "rewards.module");
  validateOptionalAddress(deployment.rewards?.router, "rewards.router");
  validateOptionalAddress(deployment.rewards?.batcher, "rewards.batcher");
  validateOptionalAddress(deployment.rewards?.stdBatcher, "rewards.stdBatcher");
  validateOptionalAddress(
    deployment.alm?.meridian?.vaults,
    "alm.meridian.vaults"
  );
  validateOptionalAddress(
    deployment.alm?.meridian?.standard,
    "alm.meridian.standard"
  );
  validateOptionalAddress(
    deployment.alm?.meridian?.registry,
    "alm.meridian.registry"
  );
  validateAddressMap(deployment.alm?.meridian?.strategies, "alm.meridian.strategies");
  validateOptionalAddress(
    deployment.sharedPackages?.largePackages,
    "sharedPackages.largePackages"
  );
  validateFeatureRequirements(deployment);

  return deployment;
}

function validateFeatureRequirements(deployment: ChainDeployment): void {
  if (deployment.features?.canopy) {
    requireAddress(deployment.canopy?.core, "canopy.core");
    requireAddress(deployment.canopy?.router, "canopy.router");
    requireAddressMapEntries(
      deployment.canopy?.blocks,
      CANOPY_REQUIRED[deployment.chain].blocks,
      "canopy.blocks"
    );
    requireAddressMapEntries(
      deployment.canopy?.strategies,
      CANOPY_REQUIRED[deployment.chain].strategies,
      "canopy.strategies"
    );
  }

  if (deployment.features?.rewards) {
    requireAddress(deployment.rewards?.module, "rewards.module");
    requireAddress(deployment.rewards?.router, "rewards.router");
    requireAddress(deployment.rewards?.batcher, "rewards.batcher");
  }

  if (deployment.features?.almMeridian) {
    requireAddress(deployment.alm?.meridian?.vaults, "alm.meridian.vaults");
    requireAddress(deployment.alm?.meridian?.standard, "alm.meridian.standard");
    requireAddress(deployment.alm?.meridian?.registry, "alm.meridian.registry");
    requireAddressMapEntries(
      deployment.alm?.meridian?.strategies,
      MERIDIAN_REQUIRED_STRATEGIES,
      "alm.meridian.strategies"
    );
  }
}

function validateAddressMap(
  addresses: Record<string, string> | undefined,
  label: string
): void {
  if (!addresses) {
    return;
  }

  for (const [name, address] of Object.entries(addresses)) {
    validateOptionalAddress(address, `${label}.${name}`);
  }
}

function validateOptionalAddress(address: string | undefined, label: string): void {
  if (address === undefined) {
    return;
  }

  if (!isMoveAddress(address)) {
    throw new DeploymentError(`Invalid deployment address: ${label}`, {
      label,
      address,
    });
  }
}

function requireAddress(address: string | undefined, label: string): void {
  if (address === undefined) {
    throw new DeploymentError(`Missing required deployment address: ${label}`, {
      label,
    });
  }

  validateOptionalAddress(address, label);
}

function requireAddressMapEntries(
  addresses: Record<string, string> | undefined,
  requiredNames: readonly string[],
  label: string
): void {
  for (const requiredName of requiredNames) {
    requireAddress(addresses?.[requiredName], `${label}.${requiredName}`);
  }
}

function withDeploymentDefaults(input: ChainDeploymentInput): ChainDeployment {
  return {
    ...input,
    fullnode: input.fullnode ?? FULLNODE_DEFAULTS[input.chain],
  };
}

function isMoveAddress(address: string): boolean {
  const input = address.startsWith("0x") ? address.slice(2) : address;
  return /^[0-9a-fA-F]{1,64}$/.test(input);
}
