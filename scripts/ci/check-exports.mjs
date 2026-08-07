#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * Workspace globs, read from `pnpm-workspace.yaml` itself.
 *
 * Parsed rather than hard-coded so that adding a glob — `apps/*` — brings those packages under
 * these checks automatically. Only the `packages:` block is read; pnpm allows sibling keys such
 * as `catalog:` whose list items are not workspace globs.
 */
function workspaceGlobs() {
  const file = path.join(rootDir, "pnpm-workspace.yaml");
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const globs = [];
  let inPackages = false;

  for (const line of lines) {
    if (/^packages:\s*$/.test(line)) {
      inPackages = true;
      continue;
    }
    // A non-indented, non-empty line ends the block.
    if (inPackages && /^\S/.test(line)) break;
    if (!inPackages) continue;

    const item = /^\s+-\s*(.+?)\s*$/.exec(line);
    if (item) globs.push(item[1].replace(/^["']|["']$/g, ""));
  }

  assert.ok(
    globs.length > 0,
    "could not read any workspace globs from pnpm-workspace.yaml; package discovery would be empty"
  );

  return globs;
}

/**
 * Expands one workspace glob to directories containing a `package.json`.
 *
 * Supports exactly the two shapes this workspace uses — `dir/*` and a literal path. Any other
 * pattern **throws** rather than matching nothing: silently under-matching would reintroduce
 * exactly the gap these checks exist to close, and a loud failure tells whoever added the glob
 * to teach this function about it.
 */
function expandGlob(glob) {
  const hasManifest = (dir) => fs.existsSync(path.join(dir, "package.json"));
  // Characters that make a path a pattern rather than a literal directory.
  const GLOB_CHARS = /[*?![\]{}]/;
  // Exactly the trailing-single-level form: `dir/*`, with no pattern characters before it.
  const SINGLE_LEVEL = /^[^*?![\]{}]+\/\*$/;

  if (SINGLE_LEVEL.test(glob)) {
    const base = path.join(rootDir, glob.slice(0, -2));
    if (!fs.existsSync(base)) return [];

    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(base, entry.name))
      .filter(hasManifest);
  }

  // Allowlist, not a blocklist. An earlier version rejected a fixed set of exotic shapes and let
  // everything else fall through to literal-path handling — so `packages/*/plugins` resolved to a
  // directory name containing a literal `*`, matched nothing, and silently narrowed discovery.
  // Anything not recognised above must be a literal path, or it throws.
  if (GLOB_CHARS.test(glob)) {
    throw new Error(
      `unsupported workspace glob ${JSON.stringify(glob)} in pnpm-workspace.yaml; ` +
        `expandGlob() understands "dir/*" and literal paths only — teach it this shape ` +
        `rather than letting discovery miss those packages`
    );
  }

  const dir = path.join(rootDir, glob);
  return hasManifest(dir) ? [dir] : [];
}

/**
 * Every package that publishes.
 *
 * The list used to be three literal paths, so a fourth published package — and then a fifth —
 * went unchecked. An earlier version of this asked `pnpm -r list --json` instead, which is
 * authoritative but proved fragile: it can exit 0 with empty stdout, and `JSON.parse("")` then
 * crashes the check before any assertion runs. Reading the workspace file directly keeps the
 * "new glob is honoured" property with no child process to misbehave.
 *
 * The repo root is included explicitly. It is not a workspace member — `pnpm-workspace.yaml`
 * lists only `packages/*` and `examples/*` — but it is `@canopyhub/canopy-sdk`, the package
 * consumers actually install, and `pnpm publish -r` does pack it.
 */
function discoverPublishedPackages() {
  const dirs = [rootDir, ...workspaceGlobs().flatMap(expandGlob)];
  const seen = new Set();

  return dirs
    .filter((dir) => (seen.has(dir) ? false : seen.add(dir)))
    .map((dir) => ({
      dir,
      manifest: JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")),
    }))
    .filter(({ manifest }) => manifest.private !== true && manifest.name)
    .map(({ dir, manifest }) => ({ name: manifest.name, dir, manifest }));
}

const publishedPackages = discoverPublishedPackages();

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
/** A `prepublishOnly` segment that genuinely builds. Matched whole, never as a substring. */
const BUILD_COMMANDS = new Set(["tsup", "pnpm run build"]);

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
  const targets = [];

  for (const field of ["main", "module", "types"]) {
    if (manifest[field]) targets.push([`${field}`, manifest[field]]);
  }

  for (const [subpath, conditions] of Object.entries(manifest.exports ?? {})) {
    for (const [condition, target] of Object.entries(conditions)) {
      targets.push([`exports["${subpath}"].${condition}`, target]);
    }
  }

  for (const [range, mapping] of Object.entries(manifest.typesVersions ?? {})) {
    for (const [key, entries] of Object.entries(mapping)) {
      for (const target of entries) {
        targets.push([`typesVersions["${range}"].${key}`, target]);
      }
    }
  }

  for (const [label, target] of targets) {
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
  const prepublish = manifest.scripts?.prepublishOnly ?? "";
  const segments = prepublish.split("&&").map((segment) => segment.trim());

  // Resolved against the package directory, not suffix-matched: a leaf carrying
  // `node scripts/ci/require-release-tag.mjs` ends with the right path but resolves inside the
  // package, where nothing exists, so the publish would break at release time.
  const runsGuard = segments.some((segment) => {
    const match = /^node\s+(\S+)$/.exec(segment);
    return match !== null && path.resolve(dir, match[1]) === GUARD_PATH;
  });

  assert.equal(runsGuard, true, `${name} prepublishOnly must run the release guard`);
  assert.equal(fs.existsSync(GUARD_PATH), true, "the release guard script must exist");
  assert.equal(
    segments.some((segment) => BUILD_COMMANDS.has(segment)),
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
