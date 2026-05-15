import { CanopyErrorCode, isCanopyError } from "../packages/core/src";
import {
  getContractAddress,
  getDeployment,
  listDeployments,
  requireContractAddress,
  validateDeployment,
} from "../packages/deployments/src";

describe("deployment registry", () => {
  it("loads initial chain deployments", () => {
    expect(listDeployments().map((deployment) => deployment.chain)).toEqual([
      "movement-mainnet",
      "movement-testnet",
      "aptos-mainnet",
      "aptos-testnet",
    ]);
  });

  it("exposes Movement testnet as a framework-only chain", () => {
    const deployment = getDeployment("movement-testnet");

    expect(deployment.chainId).toBe(250);
    expect(deployment.fullnode).toBe("https://testnet.movementnetwork.xyz/v1");
    expect(deployment.features.canopy).toBe(false);
    expect(deployment.features.rewards).toBe(false);
    expect(deployment.features.almMeridian).toBe(false);
    expect(deployment.canopy).toBeUndefined();
    expect(deployment.rewards).toBeUndefined();
    expect(deployment.alm).toBeUndefined();
  });

  it("exposes Movement mainnet Canopy and rewards addresses", () => {
    const deployment = getDeployment("movement-mainnet");

    expect(deployment.chainId).toBe(126);
    expect(deployment.canopy?.router).toBe(
      "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b"
    );
    expect(deployment.rewards?.module).toBe(
      "0x113a1769acc5ce21b5ece6f9533eef6dd34c758911fa5235124c87ff1298633b"
    );
    expect(deployment.canopy?.blocks?.moveposition).toBe(
      "0xf35c3fb25b800e4e25b71e255bd3194812d08a0044b45373c53798280db58dca"
    );
    expect(deployment.canopy?.strategies.placeholderSimple).toBe(
      "0xa9cebc4e3a52f186c831666a6e2f0475d32ebd23244b207ffde0ce06d9813414"
    );
    expect(deployment.rewards?.batcher).toBe(
      "0x265d62018bb6ec05859cdf5520cfc1efa8e84a4f9a853c66f139a2184d367be4"
    );
    expect(deployment.alm?.meridian?.vaults).toBe(
      "0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83"
    );
    expect(deployment.alm?.meridian?.strategies.medianStableV2).toBe(
      "0xce4cb4a684e38346910686cf63fcbb9f3678c2b2fdd9d297bd375e617cee5cee"
    );
    expect(deployment.sharedPackages?.largePackages).toBe(
      "0x1f33887fba324884468f326ab741e937fb2b9563faa467dca15e4eb198817531"
    );
  });

  it("exposes Aptos testnet Canopy and rewards addresses", () => {
    const deployment = getDeployment("aptos-testnet");

    expect(deployment.features.canopy).toBe(true);
    expect(deployment.features.rewards).toBe(true);
    expect(deployment.features.almMeridian).toBe(false);
    expect(deployment.canopy?.router).toBe(
      "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9"
    );
    expect(deployment.canopy?.blocks?.placeholder).toBe(
      "0xae643384070b7e5772e29628a99098a8f7dd86ebb747eea70c6e210a66c7ef37"
    );
    expect(deployment.canopy?.strategies.movepositionSimple).toBe(
      "0x0374b4443dbd6cd1ce289b47b7cc8cdc468571871161b6d672157fac41f5c6ab"
    );
    expect(deployment.rewards?.module).toBe(
      "0xd56da69b420f88aa56d713e0453f4dba2ccc6ebd1d1810c821c80b4874ae81d3"
    );
    expect(deployment.rewards?.batcher).toBe(
      "0x266c450e37b89350e8f22c7d994fe5fbc489801221679d39a915d42e2f239e55"
    );
  });

  it("exposes Aptos mainnet Meridian addresses", () => {
    const deployment = getDeployment("aptos-mainnet");

    expect(deployment.features.canopy).toBe(false);
    expect(deployment.features.rewards).toBe(false);
    expect(deployment.features.almMeridian).toBe(true);
    expect(deployment.alm?.meridian?.vaults).toBe(
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54"
    );
    expect(deployment.alm?.meridian?.standard).toBe(
      "0x781a660f7f6e1f3b6318c365ccb3fe01804ac318224784fd5c955c0f53ed77c7"
    );
    expect(deployment.alm?.meridian?.registry).toBe(
      "0xae645c9ef6a7d68d64e2beb1c6896f73f189ab609e650ace8bdeeac390b0dd38"
    );
    expect(deployment.alm?.meridian?.strategies.regularV4).toBe(
      "0xad879f655500986d56972c95817575b5ddc1a65c5181be15cbf1f5f6ad685d04"
    );
  });

  it("rejects enabled features with incomplete required addresses", () => {
    const deployment = structuredClone(getDeployment("aptos-testnet"));
    delete deployment.canopy?.strategies.movepositionSimple;

    expect(() => validateDeployment(deployment)).toThrow("movepositionSimple");
    try {
      validateDeployment(deployment);
      throw new Error("expected validateDeployment to fail");
    } catch (error) {
      expect(isCanopyError(error)).toBe(true);
      expect(error).toMatchObject({
        name: "DeploymentError",
        code: CanopyErrorCode.InvalidDeployment,
      });
    }
  });

  it("allows custom fullnodes and fills defaults when omitted", () => {
    const custom = {
      ...getDeployment("aptos-testnet"),
      fullnode: "http://127.0.0.1:8080/v1",
    };
    const withoutFullnode = structuredClone(getDeployment("aptos-testnet"));
    delete (withoutFullnode as Partial<typeof withoutFullnode>).fullnode;

    expect(validateDeployment(custom).fullnode).toBe(
      "http://127.0.0.1:8080/v1"
    );
    expect(validateDeployment(withoutFullnode).fullnode).toBe(
      "https://api.testnet.aptoslabs.com/v1"
    );
  });

  it("defaults missing feature flags to false", () => {
    const withoutFeatures = structuredClone(getDeployment("aptos-testnet"));
    delete (withoutFeatures as Partial<typeof withoutFeatures>).features;

    expect(validateDeployment(withoutFeatures).features).toEqual({
      canopy: false,
      rewards: false,
      almMeridian: false,
    });
  });

  it("distinguishes nullable and required contract address lookup", () => {
    expect(getContractAddress("movement-testnet", "canopy.router")).toBeUndefined();
    expect(getContractAddress("movement-mainnet", "canopy.protocol")).toBe(
      "0xb10bd32b3979c9d04272c769d9ef52afbc6edc4bf03982a9e326b96ac25e7f2d"
    );
    expect(getContractAddress("movement-mainnet", "meridian.router")).toBe(
      "0x96cfeae5e78eeb1b6215bb83ed9023106e0df49e6d4380783e0e40aa8e771f83"
    );
    expect(requireContractAddress("aptos-mainnet", "meridian.vault")).toBe(
      "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54"
    );
    expect(() =>
      requireContractAddress("movement-testnet", "canopy.router")
    ).toThrow('Contract "canopy.router" is not deployed on "movement-testnet"');
  });

  it("throws a specific error for unsupported deployment chains", () => {
    expect(() => getDeployment("aptos-devnet" as never)).toThrow(
      'Unknown chain "aptos-devnet". Supported deployment chains: movement-mainnet, movement-testnet, aptos-mainnet, aptos-testnet'
    );
  });
});
