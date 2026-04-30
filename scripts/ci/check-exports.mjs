#!/usr/bin/env node
import assert from "node:assert/strict";

const [sdk, core, deployments, bindings] = await Promise.all([
  import("@canopyhub/canopy-sdk"),
  import("@canopyhub/canopy-sdk/core"),
  import("@canopyhub/canopy-sdk/deployments"),
  import("@canopyhub/canopy-sdk/bindings"),
]);

assert.equal(typeof sdk.CanopySdk, "function");
assert.equal(typeof sdk.createCanopySdk, "function");
assert.equal(
  core.normalizeMoveAddress("0x1"),
  "0x0000000000000000000000000000000000000000000000000000000000000001"
);
assert.equal(deployments.getDeployment("movement-mainnet").chainId, 126);
assert.equal(deployments.getDeployment("movement-testnet").features.canopy, false);
assert.equal(deployments.getDeployment("aptos-mainnet").features.almMeridian, true);
assert.equal(
  bindings.getAbisForChain("movement-mainnet").canopyRouter.address,
  "0x717b417949cd5bfa6dc02822eacb727d820de2741f6ea90bf16be6c0ed46ff4b"
);
assert.equal(
  bindings.getAbisForChain("movement-testnet").aptosFrameworkObject.name,
  "object"
);
assert.equal(
  bindings.getAbisForChain("aptos-testnet").canopyRouter.address,
  "0x6db956973bb73aff8b6c3712a7b4fff18bfefd850cce81c558d20a7ab1fc37d9"
);
assert.equal(
  bindings.getAbisForChain("aptos-mainnet").meridianVault.address,
  "0xeb57695cd494c59ea7b1356580f1e7d5666fd84827322369e21d712e22397b54"
);
assert.equal(
  bindings.getAbisForChain("movement-mainnet").meridianMedianStableV2.name,
  "median_stable_v2"
);

console.log("package exports ok");
