import {
  getAbisForChain,
  type MoveModuleAbi,
} from "../packages/bindings/src";
import {
  listDeployments,
  type ChainDeployment,
} from "../packages/deployments/src";

type AbiMap = Record<string, MoveModuleAbi | undefined>;

describe("deployment and ABI registry consistency", () => {
  it("keeps bound framework ABIs at 0x1 for every chain", () => {
    for (const deployment of listDeployments()) {
      const abis = getAbiMap(deployment);

      expectAbiAddress(abis, "aptosFrameworkObject", "0x1", deployment.chain);
      expectAbiAddress(
        abis,
        "aptosFrameworkPrimaryFungibleStore",
        "0x1",
        deployment.chain
      );
      expectAbiAddress(abis, "aptosFrameworkCoin", "0x1", deployment.chain);
      expectAbiAddress(
        abis,
        "aptosFrameworkMultisigAccount",
        "0x1",
        deployment.chain
      );
    }
  });

  it("has matching ABIs for deployed Canopy and rewards packages", () => {
    for (const deployment of listDeployments()) {
      const abis = getAbiMap(deployment);

      expectOptionalAbiAddress(
        abis,
        "canopyVault",
        deployment.canopy?.core,
        `${deployment.chain}: canopy.core`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyRouter",
        deployment.canopy?.router,
        `${deployment.chain}: canopy.router`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyRouterDeposit",
        deployment.canopy?.router,
        `${deployment.chain}: canopy.router deposit module`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyRouterWithdraw",
        deployment.canopy?.router,
        `${deployment.chain}: canopy.router withdraw module`
      );

      expectOptionalAbiAddress(
        abis,
        "multiRewards",
        deployment.rewards?.module,
        `${deployment.chain}: rewards.module`
      );
      expectOptionalAbiAddress(
        abis,
        "multiRewardsRouter",
        deployment.rewards?.router,
        `${deployment.chain}: rewards.router`
      );
      expectOptionalAbiAddress(
        abis,
        "multiRewardsBatcherView",
        deployment.rewards?.batcher,
        `${deployment.chain}: rewards.batcher view module`
      );
      expectOptionalAbiAddress(
        abis,
        "multiRewardsBatcherEntry",
        deployment.rewards?.batcher,
        `${deployment.chain}: rewards.batcher entry module`
      );
      expectOptionalAbiAddress(
        abis,
        "multiRewardsStdViews",
        deployment.rewards?.stdBatcher,
        `${deployment.chain}: rewards.stdBatcher`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyRewardsView",
        deployment.canopy?.views,
        `${deployment.chain}: canopy.views`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyHelpers",
        deployment.canopy?.helpers,
        `${deployment.chain}: canopy.helpers`
      );

      expectOptionalAbiAddress(
        abis,
        "canopyStrategyEchelonSimple",
        deployment.canopy?.strategies.echelonSimple,
        `${deployment.chain}: canopy.strategies.echelonSimple`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyStrategyMovepositionSimple",
        deployment.canopy?.strategies.movepositionSimple,
        `${deployment.chain}: canopy.strategies.movepositionSimple`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyStrategyMovepositionTicket",
        deployment.canopy?.strategies.movepositionSimple,
        `${deployment.chain}: canopy.strategies.movepositionSimple ticket module`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyStrategyLayerbankSimple",
        deployment.canopy?.strategies.layerbankSimple,
        `${deployment.chain}: canopy.strategies.layerbankSimple`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyStrategyPlaceholderSimple",
        deployment.canopy?.strategies.placeholderSimple,
        `${deployment.chain}: canopy.strategies.placeholderSimple`
      );
      expectOptionalAbiAddress(
        abis,
        "canopyStrategyMeridianRewards",
        deployment.canopy?.strategies.meridianRewards,
        `${deployment.chain}: canopy.strategies.meridianRewards`
      );
    }
  });

  it("has matching ABIs for deployed Meridian ALM packages", () => {
    for (const deployment of listDeployments()) {
      const abis = getAbiMap(deployment);
      const meridian = deployment.alm?.meridian;

      expectOptionalAbiAddress(
        abis,
        "meridianVault",
        meridian?.vaults,
        `${deployment.chain}: alm.meridian.vaults`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianRouter",
        meridian?.vaults,
        `${deployment.chain}: alm.meridian.vaults router module`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianRegistry",
        meridian?.registry,
        `${deployment.chain}: alm.meridian.registry`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianBatchViews",
        meridian?.batchViews,
        `${deployment.chain}: alm.meridian.batchViews`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianRegularV4",
        meridian?.strategies.regularV4,
        `${deployment.chain}: alm.meridian.strategies.regularV4`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianRegularV4Entry",
        meridian?.strategies.regularV4,
        `${deployment.chain}: alm.meridian.strategies.regularV4 entry module`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianMedianStableV2",
        meridian?.strategies.medianStableV2,
        `${deployment.chain}: alm.meridian.strategies.medianStableV2`
      );
      expectOptionalAbiAddress(
        abis,
        "meridianMedianStableV2Entry",
        meridian?.strategies.medianStableV2,
        `${deployment.chain}: alm.meridian.strategies.medianStableV2 entry module`
      );
    }
  });
});

function getAbiMap(deployment: ChainDeployment): AbiMap {
  return getAbisForChain(deployment.chain) as unknown as AbiMap;
}

function expectOptionalAbiAddress(
  abis: AbiMap,
  abiName: string,
  expectedAddress: string | undefined,
  label: string
): void {
  if (expectedAddress === undefined) {
    return;
  }

  expectAbiAddress(abis, abiName, expectedAddress, label);
}

function expectAbiAddress(
  abis: AbiMap,
  abiName: string,
  expectedAddress: string,
  label: string
): void {
  const abi = abis[abiName];

  if (abi === undefined) {
    throw new Error(`${label} should have ${abiName} ABI`);
  }

  expect(normalizeAddress(abi?.address)).toBe(normalizeAddress(expectedAddress));
}

function normalizeAddress(address: string | undefined): string | undefined {
  if (address === undefined) {
    return undefined;
  }

  const hex = address.toLowerCase().replace(/^0x/, "").replace(/^0+/, "");
  return `0x${hex.length === 0 ? "0" : hex}`;
}
