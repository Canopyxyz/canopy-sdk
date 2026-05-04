#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [sdk, core, deployments, bindings] = await Promise.all([
  import("@canopyhub/canopy-sdk"),
  import("@canopyhub/canopy-sdk/core"),
  import("@canopyhub/canopy-sdk/deployments"),
  import("@canopyhub/canopy-sdk/bindings"),
]);

assert.equal(typeof sdk.CanopySdk, "function");
assert.equal(typeof sdk.createCanopySdk, "function");
assert.equal(typeof sdk.getContract, "function");
assert.equal(typeof sdk.requireContract, "function");
assert.equal(typeof sdk.getCanopyStrategyContract, "function");
assert.equal(typeof sdk.requireCanopyStrategyContract, "function");
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
assert.deepEqual(bindings.getAbisForChain("movement-mainnet").canopyRouter.structs, []);

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const leafPackages = [
  "packages/core/package.json",
  "packages/deployments/package.json",
  "packages/bindings/package.json",
];

for (const packagePath of leafPackages) {
  const absolutePackagePath = path.join(rootDir, packagePath);
  const packageDir = path.dirname(absolutePackagePath);
  const manifest = JSON.parse(fs.readFileSync(absolutePackagePath, "utf8"));
  const exportMap = manifest.exports["."];

  assert.equal(
    fs.existsSync(path.join(packageDir, manifest.main)),
    true,
    `${manifest.name} main target must exist`
  );
  assert.equal(
    fs.existsSync(path.join(packageDir, manifest.module)),
    true,
    `${manifest.name} module target must exist`
  );
  assert.equal(
    fs.existsSync(path.join(packageDir, exportMap.import)),
    true,
    `${manifest.name} import target must exist`
  );
  assert.equal(
    fs.existsSync(path.join(packageDir, exportMap.require)),
    true,
    `${manifest.name} require target must exist`
  );
}

console.log("package exports ok");
