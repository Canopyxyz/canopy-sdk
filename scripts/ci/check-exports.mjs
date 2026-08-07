#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectManifestTargets,
  discoverPublishedPackages,
  runsBuild,
  runsReleaseGuard,
} from "./lib/workspace-packages.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const publishedPackages = discoverPublishedPackages(rootDir);

/**
 * A floor, not an equality check.
 *
 * Discovery returning a short list — a mis-parsed workspace file, a glob that expands to
 * nothing, or only the root — would leave the loop below asserting almost nothing while still
 * exiting 0. Requiring these four to be present makes that impossible.
 *
 * Deliberately a subset test: a fifth published package must still be picked up automatically.
 * Tightening this to an exact match would reintroduce the hard-coded-list problem that the
 * discovery above exists to solve.
 */
const MUST_BE_DISCOVERED = [
  "@canopyhub/canopy-sdk",
  "@canopyhub/canopy-sdk-core",
  "@canopyhub/canopy-sdk-deployments",
  "@canopyhub/canopy-sdk-bindings",
];

const discoveredNames = new Set(publishedPackages.map((pkg) => pkg.name));
for (const name of MUST_BE_DISCOVERED) {
  assert.equal(discoveredNames.has(name), true, `package discovery must find ${name}`);
}

/** The release guard, which every published package must run before packing. */
const GUARD_PATH = path.join(rootDir, "scripts/ci/require-release-tag.mjs");

for (const { name, dir, manifest } of publishedPackages) {
  // ── target existence ──────────────────────────────────────────────────────
  // Generalised over every export entry rather than assuming a single `.`, because the root
  // publishes `./core`, `./deployments` and `./bindings` subpaths plus `typesVersions` — the
  // documented way consumers reach those packages.
  //
  // The dynamic imports at the top of this file already exercise the ESM side of those
  // subpaths, so what this adds for the root is the `require` (CJS) and `types` conditions and
  // the `typesVersions` targets: 18 checks where the imports covered 4, and the CJS half is the
  // one a bundler-free consumer hits.
  for (const [label, target] of collectManifestTargets(manifest)) {
    assert.equal(
      fs.existsSync(path.join(dir, target)),
      true,
      `${name} ${label} target must exist: ${target}`
    );
  }

  // ── release-manifest invariants ───────────────────────────────────────────
  // Every release bug found so far has been a manifest defect no check could see: a missing
  // peer dependency, `default access` (restricted) instead of public, and a package that never
  // built itself and so published a tarball containing only its manifest.
  const prepublish = manifest.scripts?.prepublishOnly;

  assert.equal(
    runsReleaseGuard(prepublish, dir, GUARD_PATH),
    true,
    `${name} prepublishOnly must run the release guard`
  );
  assert.equal(fs.existsSync(GUARD_PATH), true, "the release guard script must exist");
  assert.equal(
    runsBuild(prepublish),
    true,
    `${name} prepublishOnly must build, or it can publish an empty tarball`
  );
  assert.equal(
    manifest.publishConfig?.access,
    "public",
    `${name} must publish with public access; scoped packages default to restricted`
  );
}

/**
 * Runtime smoke test of the published entry points.
 *
 * Deliberately after the manifest loop above. These are `import()` calls, so a missing ESM
 * target aborts the whole script with `ERR_MODULE_NOT_FOUND` naming a file path — which does
 * catch the defect, but replaces the assertion that would have named
 * `exports["./core"].import`. Running the existence checks first means the diagnostic points at
 * the manifest entry that is wrong, and these then confirm the modules actually load and export
 * what they claim.
 */
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

console.log(`package exports ok (${publishedPackages.length} published packages checked)`);
