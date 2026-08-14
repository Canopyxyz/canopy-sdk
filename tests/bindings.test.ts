import {
  getAbi,
  abisByChain,
  getAbisForChain,
  getFrameworkAbi,
  movementMainnetAbis,
  movementTestnetAbis,
} from "../packages/bindings/src";

describe("ABI bindings", () => {
  it("exports the Movement mainnet ABI set", () => {
    expect(movementMainnetAbis.canopyVault.address).toBe(
      "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d"
    );
    expect(movementMainnetAbis.canopyRouter.exposed_functions?.length).toBeGreaterThan(0);
    expect(movementMainnetAbis.canopySatay.name).toBe("satay");
    expect(movementMainnetAbis.canopyProtocol.name).toBe("protocol");
    expect(movementMainnetAbis.canopyBaseStrategy.name).toBe("base_strategy");
    expect(
      movementMainnetAbis.multiRewardsRouter.exposed_functions?.length
    ).toBeGreaterThan(0);
    expect(movementMainnetAbis.canopyRouter.structs).toEqual([]);
    expect(movementMainnetAbis.multiRewardsBatcherEntry.name).toBe("batcher_entry");
    expect(movementMainnetAbis.multiRewardsBatcherView.name).toBe("batcher_view");
    expect(movementMainnetAbis.multiRewardsStdViews?.name).toBe("std_views");
    expect(movementMainnetAbis.canopyStrategyEchelonSimple?.name).toBe("strategy");
    expect(movementMainnetAbis.canopyStrategyMovepositionTicket?.name).toBe("ticket");
    expect(movementMainnetAbis.aptosFrameworkObject.address).toBe("0x1");
    expect(movementMainnetAbis.aptosFrameworkPrimaryFungibleStore.name).toBe(
      "primary_fungible_store"
    );
    expect(movementMainnetAbis.canopyStrategyPlaceholderSimple?.address).toBe(
      "0xa9cebc4e3a52f186c831666a6e2f0475d32ebd23244b207ffde0ce06d9813414"
    );
  });

  it("keeps ABI sets scoped by chain", () => {
    const movementMainnet = getAbisForChain("movement-mainnet");
    const movementTestnet = getAbisForChain("movement-testnet");
    const aptosMainnet = getAbisForChain("aptos-mainnet");
    const aptosTestnet = getAbisForChain("aptos-testnet");

    expect(movementMainnet).toBe(abisByChain["movement-mainnet"]);
    expect(movementTestnet).toBe(abisByChain["movement-testnet"]);
    expect(aptosMainnet).toBe(abisByChain["aptos-mainnet"]);
    expect(aptosTestnet).toBe(abisByChain["aptos-testnet"]);
    expect(movementTestnet).toBe(movementTestnetAbis);
    expect(movementTestnet.aptosFrameworkCoin.address).toBe("0x1");
    expect(movementTestnet.aptosFrameworkObject.name).toBe("object");
    // Four curator modules share the vault package address; router and adapter are separate.
    expect(movementTestnet.curatorVault.name).toBe("vault");
    expect(movementTestnet.curatorQueue.name).toBe("queue");
    expect(movementTestnet.curatorPartnerRegistry.name).toBe("partner_registry");
    expect(movementTestnet.curatorSanctionsOracle.name).toBe("sanctions_oracle");
    expect(movementTestnet.curatorVault.address).toBe(
      "0x8ff93d763976b0b71ee99e3601ada04800dd372806d6d7248086266613167bd2"
    );
    expect(movementTestnet.curatorQueue.address).toBe(
      movementTestnet.curatorVault.address
    );
    expect(movementTestnet.curatorRouter.name).toBe("router");
    expect(movementTestnet.curatorRouter.address).toBe(
      "0x97b28d98b0e76f529a12d4d37671be3954aaf619afe600c0bee58349a8ce02d0"
    );
    expect(movementTestnet.curatorGenericAdapter.name).toBe("generic_adapter");
    expect(movementTestnet.curatorGenericAdapter.address).toBe(
      "0x362f2f52db6906f1c38ee6c2058633987a400eba1cac6c29de48979faabc5078"
    );
    expect(movementTestnet.curatorSanctionsOracle.address).toBe(
      movementTestnet.curatorVault.address
    );
    expect(aptosMainnet.meridianVault.address).toBe(
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54"
    );
    expect(aptosMainnet.meridianVault.name).toBe(
      "ichi_vault_thala"
    );
    expect(aptosMainnet.meridianRegistry.name).toBe(
      "vaults_registry"
    );
    expect(aptosMainnet.meridianRegularV4Entry?.name).toBe(
      "regular_v4_entry"
    );
    expect(aptosMainnet.aptosFrameworkCoin.name).toBe("coin");
    expect(aptosMainnet.aptosFrameworkMultisigAccount.name).toBe(
      "multisig_account"
    );
    expect(movementMainnet.meridianMedianStableV2?.name).toBe(
      "median_stable_v2"
    );
    expect(movementMainnet.meridianRegistry.address).toBe(
      "0x3b0710d1a0a14a38e2059fc9562f875a1a275a580b7c43c019e68be5a8ae1741"
    );
    expect(
      movementMainnet.meridianMedianStableV2Entry?.name
    ).toBe("median_stable_v2_entry");
    expect(aptosTestnet.canopyVault.address).toBe(
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a"
    );
    expect(aptosTestnet.multiRewards.address).toBe(
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3"
    );
    expect(aptosTestnet.canopyProtocol.address).toBe(
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a"
    );
    expect(aptosTestnet.canopyBaseStrategy.friends).toContain(
      "0xe5ec58845afb1cb164d1c260f2a284b2f1311318973e13355b9e4dc2908eed5a::vault"
    );
    expect(aptosTestnet.multiRewardsBatcherEntry.name).toBe(
      "batcher_entry"
    );
    expect(aptosTestnet.canopyStrategyLayerbankSimple?.address).toBe(
      "0xbc95c89d0117335acb2e05401a8ff5978549fde3f7b789e88de7c685275f5b3c"
    );
    expect(
      aptosTestnet.canopyStrategyMovepositionTicket?.name
    ).toBe("ticket");
    expect(aptosTestnet.aptosFrameworkObject.name).toBe(
      "object"
    );
  });

  it("exposes nullable ABI lookup with normalized structs", () => {
    expect(getAbi("movement-mainnet", "canopy.router")?.structs).toEqual([]);
    expect(getAbi("movement-testnet", "canopy.router")).toBeUndefined();
  });

  it("resolves curator contract ids to curator ABIs on the deployed chain only", () => {
    expect(getAbi("movement-testnet", "curator.vault")?.name).toBe("vault");
    expect(getAbi("movement-testnet", "curator.router")?.name).toBe("router");
    expect(getAbi("movement-testnet", "curator.genericAdapter")?.name).toBe(
      "generic_adapter"
    );
    expect(getAbi("movement-testnet", "curator.sanctionsOracle")?.name).toBe(
      "sanctions_oracle"
    );
    expect(getAbi("movement-mainnet", "curator.vault")).toBeUndefined();
    expect(getAbi("aptos-testnet", "curator.router")).toBeUndefined();
    expect(getAbi("aptos-testnet", "curator.genericAdapter")).toBeUndefined();
  });

  it("exposes named framework ABI helpers", () => {
    expect(
      getFrameworkAbi("movement-mainnet", "aptosFrameworkPrimaryFungibleStore").name
    ).toBe("primary_fungible_store");
    expect(
      getFrameworkAbi("aptos-mainnet", "aptosFrameworkMultisigAccount").name
    ).toBe("multisig_account");
    expect(
      getFrameworkAbi("aptos-testnet", "aptosFrameworkCoin").address
    ).toBe("0x1");
  });

  it("throws a specific error for unsupported ABI chains", () => {
    expect(() =>
      getAbi("aptos-devnet" as never, "canopy.router")
    ).toThrow(
      'Unknown chain "aptos-devnet". Supported ABI chains: movement-mainnet, movement-testnet, aptos-mainnet, aptos-testnet'
    );
  });
});
