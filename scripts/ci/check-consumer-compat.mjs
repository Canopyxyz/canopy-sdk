#!/usr/bin/env node
/**
 * Verifies the published packages actually install and work against each
 * `@aptos-labs/ts-sdk` major the `peerDependencies` range claims to support — not just that the
 * range *text* says so.
 *
 * WHY THIS EXISTS
 * ---------------
 * 2.0.0 through 2.1.0 declared `peerDependencies: { "@aptos-labs/ts-sdk": "^7.0.0" }` while this
 * repo's own dogfooding (canopy-cli) ran ts-sdk 6.3.1 successfully — the range was simply wrong,
 * and nothing caught it because pnpm only warns on an unmet peer instead of failing. 2.1.1 widens
 * the range to `^6.3.1 || ^7.0.0`; this script is what makes that range a tested claim rather
 * than a repeat of the same mistake with different numbers.
 *
 * WHAT IT DOES
 * ------------
 * 0. Packs all four published packages once (`pnpm pack`, shared across every ts-sdk version
 *    below), then reads `package/package.json` back out of each tarball directly — not the
 *    source-tree file — and asserts root/`-core`'s `peerDependencies` and `-bindings`'s sibling
 *    dependency on `-deployments` are correct in what was actually packed. `pnpm pack` rewrites
 *    `workspace:*` to a real version at pack time, and an aggregate install (next) can't tell a
 *    correct manifest from a broken one that merely happens to be bailed out by its neighbors
 *    being installed alongside it.
 *
 * WHAT IT DOES, PER TS-SDK VERSION
 * ---------------------------------
 * 1. In a fresh project directory — isolated from this workspace, not from each other — installs
 *    all four tarballs together plus that exact ts-sdk version via `npm install
 *    --strict-peer-deps`, no `--legacy-peer-deps`, no `--force`. Both stdout and stderr are
 *    checked for a peer warning even on exit code 0.
 * 2. Confirms exactly one physical install of `@aptos-labs/ts-sdk` exists anywhere under that
 *    project's `node_modules`, matching the requested version — found by walking the filesystem
 *    and deduplicating by real path, not by asking `npm ls` (a logical dependency tree over-counts
 *    a correctly deduped package referenced by several dependents).
 * 3. Runs an ESM script and a CJS script that both import every published subpath off the root
 *    package (`.`, `./core`, `./deployments`, `./bindings`) *and* the three standalone packages
 *    directly by their own names (`@canopyhub/canopy-sdk-core` etc.), construct a real
 *    `Aptos`-shaped client that only implements `.view()` (matching `MoveViewClient`, the actual
 *    runtime surface the SDK's view path calls) for a deterministic view-call decode, and then
 *    make one real, retried, fail-closed call to aptos-testnet to build and BCS-serialize a real
 *    entry payload — entry payloads carry no local ABI by design (see below), so this one step is
 *    not deterministic/network-free the way the rest of the script is. `check-live-payloads.mjs`
 *    already covers live-chain *correctness* on the one ts-sdk version this repo develops against;
 *    this narrow, single-payload call exists only to prove serialization works AT ALL under each
 *    ts-sdk major, and fails the run (after a short transport-only retry) rather than passing
 *    silently if it can't complete.
 * 4. Runs `tsc --noEmit` against a `.ts` file (module resolution `bundler`) that passes a real
 *    `Aptos` instance into `createCanopySdk` with no cast — the same shape of check that caught
 *    2.0.0 needing an `as any` on ts-sdk 6 before the peer range was fixed.
 * 5. Builds (real `tsc` emit, not `--noEmit`) and runs a second, minimal consumer file — proving
 *    the code actually compiles to something executable, which typechecking alone never does.
 * 6. Runs a family of `nodenext` typechecks (the resolution mode that actually surfaced the
 *    dual-`Aptos`-type `exports`-map bug this release fixed, by performing per-file,
 *    `resolution-mode`-sensitive export lookups that `bundler` above does not), covering every
 *    public entry point in both ESM (`.mts`) and CJS (`.cts`):
 *      - a `skipLibCheck: true` canopy-sdk-integration fixture, REQUIRED for every version —
 *        empirically confirmed against a deliberately reintroduced copy of the original
 *        `pluginConfig` conflict that this still fails it, so `skipLibCheck` suppressing ts-sdk
 *        6.3.1's own unrelated internal issue (next) does not also hide a real regression here;
 *      - the same fixture WITHOUT `skipLibCheck`, REQUIRED for every version — CJS unconditionally,
 *        ESM for every version except 6.3.1 (the known defect below is ESM-only; strict CJS is
 *        unaffected and still runs for 6.3.1 too);
 *      - for 6.3.1's ESM only, a strict check of a fixture importing ts-sdk ALONE (no canopy-sdk
 *        at all) is run as an XFAIL instead: ts-sdk 6.3.1's own `.d.mts` references
 *        `eventemitter3`'s default export in a way `nodenext` rejects — reproducible with zero
 *        canopy-sdk packages installed, so it can never be attributed to this package, and
 *        `xfailStep` rejects the xfail outright if a canopy-sdk-shaped diagnostic
 *        (`pluginConfig`/`TS2345`) shows up too.
 *
 * WHICH VERSIONS, AND WHY PINNED EXACTLY
 * ----------------------------------------
 * Pinned, not "latest": the merge gate must not depend on a moving target. `6.3.1` is the version
 * this range exists to support; `7.0.0` is the declared floor; `7.3.0` is a real ts-sdk release
 * recent enough to matter, deliberately NOT derived from this repo's own `@aptos-labs/ts-sdk`
 * devDependency — that pin can itself go stale (at the time this was written it sat on a version
 * npm marks deprecated for a known HTTP/2 bug), and inheriting it here would silently narrow this
 * gate to whatever this repo forgot to update rather than to something genuinely current. All
 * three versions are literals for exactly that reason; bump them by hand as ts-sdk moves. A
 * separate, non-gating canary job can track ts-sdk's real `latest` continuously if that coverage
 * is wanted — deliberately not this script's job.
 */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverPublishedPackages } from "./lib/workspace-packages.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rootManifest = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));

const TS_SDK_VERSIONS = ["6.3.1", "7.0.0", "7.3.0"];

const failures = [];
const passes = [];
const xfails = [];

// ── steps ─────────────────────────────────────────────────────────────────

/** Packs all four published packages once; every version's project reuses the same tarballs. */
function packAll(destDir) {
  const published = discoverPublishedPackages(rootDir);
  assert.equal(published.length, 4, `expected 4 published packages, discovered ${published.length}`);

  const tarballs = {};
  for (const { name, dir } of published) {
    const output = execFileSync("pnpm", ["pack", "--pack-destination", destDir], {
      cwd: dir,
      encoding: "utf8",
    });
    const tarballPath = output.trim().split("\n").pop();
    assert.ok(tarballPath && fs.existsSync(tarballPath), `pnpm pack in ${dir} did not produce a tarball`);
    tarballs[name] = tarballPath;
  }

  return tarballs;
}

/**
 * Reads `package/package.json` out of a tarball directly — what actually got packed, not the
 * source-tree file on disk. They can diverge: `pnpm pack` rewrites `workspace:*` sibling
 * dependencies to a real version at pack time (confirmed: `-bindings`'s `dependencies` field
 * says `"@canopyhub/canopy-sdk-deployments": "2.1.1"` in the tarball, `"workspace:*"` in the
 * source file).
 */
function readPackedManifest(tarballPath) {
  const raw = execFileSync("tar", ["-xzO", "-f", tarballPath, "package/package.json"], { encoding: "utf8" });
  return JSON.parse(raw);
}

/**
 * Aggregate installs (all four tarballs plus ts-sdk, together) can mask a manifest that is
 * itself wrong: if `-core`'s `peerDependencies` were dropped entirely, or `-bindings` lost its
 * dependency on `-deployments`, the *other* packages' presence in the same `npm install` would
 * still satisfy Node's module resolution at runtime, and every check above would keep passing
 * for the wrong reason. This reads each packed manifest directly, independent of what else
 * happens to be sitting in node_modules alongside it.
 */
function assertPackedManifests(tarballs) {
  const expectedPeerRange = "^6.3.1 || ^7.0.0";
  const manifests = Object.fromEntries(Object.entries(tarballs).map(([name, tarballPath]) => [name, readPackedManifest(tarballPath)]));

  // All four publish in lockstep (RELEASING.md) — a version mismatch between them, packed, is
  // itself a real defect regardless of what caused it.
  const versionByPackage = Object.fromEntries(Object.entries(manifests).map(([name, manifest]) => [name, manifest.version]));
  const versions = new Set(Object.values(versionByPackage));
  assert.equal(versions.size, 1, `packed package versions are not aligned: ${JSON.stringify(versionByPackage)}`);
  const [releasedVersion] = versions;

  for (const name of ["@canopyhub/canopy-sdk", "@canopyhub/canopy-sdk-core"]) {
    const manifest = manifests[name];
    assert.equal(
      manifest.peerDependencies?.["@aptos-labs/ts-sdk"],
      expectedPeerRange,
      `${name}'s packed manifest peerDependencies["@aptos-labs/ts-sdk"] should be "${expectedPeerRange}", got ${JSON.stringify(manifest.peerDependencies)}`
    );
    // The whole point of 2.1.1 is peer-only ts-sdk consumption (see RELEASING.md) — a direct
    // `dependencies` entry would silently reintroduce the duplicate-copy bug this release fixes.
    assert.equal(
      manifest.dependencies?.["@aptos-labs/ts-sdk"],
      undefined,
      `${name}'s packed manifest declares @aptos-labs/ts-sdk as a direct dependency, not peer-only`
    );
  }

  // Not just "truthy and not workspace:*" — that would accept `latest`, `1.0.0`, `workspace:^`, or
  // an unrelated file: reference. The only correct value, once `-deployments` has actually been
  // packed at this same release, is the exact version that got packed.
  const deploymentsDependency = manifests["@canopyhub/canopy-sdk-bindings"].dependencies?.["@canopyhub/canopy-sdk-deployments"];
  assert.equal(
    deploymentsDependency,
    releasedVersion,
    `@canopyhub/canopy-sdk-bindings's packed manifest should depend on exactly "${releasedVersion}" (the version actually packed) of ` +
      `@canopyhub/canopy-sdk-deployments, got ${JSON.stringify(deploymentsDependency)}`
  );
}

function checkVersion(tsSdkVersion, tarballs) {
  const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), `canopy-sdk-consumer-compat-${tsSdkVersion}-`));

  try {
    writeProject(projectDir, tsSdkVersion, tarballs);

    if (!step(tsSdkVersion, "npm install (strict, no peer overrides)", () => npmInstall(projectDir))) {
      return; // Every later step needs a successful install.
    }

    step(tsSdkVersion, "exactly one resolved @aptos-labs/ts-sdk, matching the requested version", () =>
      assertSingleResolvedVersion(projectDir, tsSdkVersion)
    );

    step(tsSdkVersion, "ESM import + view/payload round trip", () =>
      execFileSync(process.execPath, ["esm-check.mjs"], { cwd: projectDir, encoding: "utf8" })
    );

    step(tsSdkVersion, "CJS require + view/payload round trip", () =>
      execFileSync(process.execPath, ["cjs-check.cjs"], { cwd: projectDir, encoding: "utf8" })
    );

    step(tsSdkVersion, "typecheck: createCanopySdk accepts a real Aptos instance with no cast", () =>
      execFileSync(
        process.execPath,
        [path.join(projectDir, "node_modules", "typescript", "bin", "tsc"), "--noEmit", "-p", "tsconfig.json"],
        { cwd: projectDir, encoding: "utf8" }
      )
    );

    step(tsSdkVersion, "build: consumer code actually compiles and the output runs", () =>
      buildAndRunConsumer(projectDir)
    );

    writeNodenextFixtures(projectDir);

    const runTsc = configName =>
      execFileSync(process.execPath, [path.join(projectDir, "node_modules", "typescript", "bin", "tsc"), "--noEmit", "-p", configName], {
        cwd: projectDir,
        encoding: "utf8",
      });

    // Required for every version: every public entry point, CJS and ESM, `skipLibCheck` so a
    // real canopy-sdk regression here still surfaces (confirmed against a deliberately
    // reintroduced copy of the original `pluginConfig` conflict) without upstream ts-sdk noise
    // (like 6.3.1's eventemitter3 issue below) failing a check that isn't about canopy-sdk at all.
    step(tsSdkVersion, "typecheck under nodenext (ESM, .mts, canopy-sdk integration)", () => runTsc("tsconfig.nodenext-esm-canopy-integration.json"));
    step(tsSdkVersion, "typecheck under nodenext (CJS, .cts, canopy-sdk integration)", () => runTsc("tsconfig.nodenext-cjs-canopy-integration.json"));

    // ts-sdk 6.3.1 itself — independent of canopy-sdk; reproduces with zero canopy-sdk packages
    // installed at all — fails to typecheck under nodenext ESM: its own `.d.mts` files reference
    // `eventemitter3`'s default export in a way nodenext's stricter resolution rejects
    // (`TS2507: ... is not a constructor function type`). This is exactly the class of thing an
    // xfail exists for: asserted to still be broken, so the day ts-sdk fixes it this flips to an
    // unexpected pass and says "remove this", rather than silently skipping forever. The fixture
    // imports ts-sdk alone — no canopy-sdk at all — so this xfail can never be satisfied by a
    // canopy-sdk-side diagnostic; `xfailStep` also rejects one explicitly if it shows up anyway.
    // The known defect is ESM-only (ts-sdk 6.3.1's `.d.mts`, not its CJS declarations), so strict
    // CJS runs unconditionally for every version, 6.3.1 included — only strict ESM is replaced by
    // the xfail below.
    step(tsSdkVersion, "typecheck under nodenext (CJS, .cts, strict)", () => runTsc("tsconfig.nodenext-cjs-strict.json"));

    if (tsSdkVersion === "6.3.1") {
      xfailStep(
        tsSdkVersion,
        "typecheck under nodenext (ESM, .mts, ts-sdk alone) — known upstream ts-sdk 6.3.1/eventemitter3 issue",
        () => runTsc("tsconfig.nodenext-esm-upstream-only.json"),
        /eventemitter3.*is not a constructor function type/s,
        "ts-sdk@6.3.1's own .d.mts references eventemitter3's default export in a way nodenext's " +
          "resolution rejects; reproduces with no canopy-sdk packages installed at all, so it is not " +
          "a canopy-sdk defect and not something this package's exports map or API can fix"
      );
    } else {
      // Full strictness (no skipLibCheck) where nothing upstream is known to be broken.
      step(tsSdkVersion, "typecheck under nodenext (ESM, .mts, strict)", () => runTsc("tsconfig.nodenext-esm-strict.json"));
    }
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
}

function step(tsSdkVersion, label, run) {
  const name = `ts-sdk ${tsSdkVersion}: ${label}`;
  try {
    run();
    passes.push(name);
    return true;
  } catch (error) {
    failures.push({ name, message: error.stdout ?? error.stderr ?? error.message ?? String(error) });
    return false;
  }
}

/**
 * A check expected to FAIL for a known, external, already-diagnosed reason — see
 * `check-live-payloads.mjs`'s own `checkXfail` for the pattern this mirrors. Four outcomes:
 *   - fails with the expected message -> XFAIL, does not gate. The upstream gap is still there.
 *   - succeeds                        -> FAIL. Upstream fixed it; remove this xfail.
 *   - fails some other way            -> FAIL, so an unrelated new break is never masked.
 */
// A disallowed pattern any xfail is checked against, on top of its own expected pattern: if a
// canopy-sdk-attributable diagnostic (the original `pluginConfig`/dual-`Aptos`-type conflict)
// shows up *alongside* a known upstream failure, that is a real regression, not the known gap —
// `expectedPattern.test()` alone can't tell the two apart since it only checks for presence, not
// exclusivity. Checked generically here rather than trusted to each call site remembering to
// re-derive it, since a forgotten check is exactly how this class of bug hides.
const CANOPY_REGRESSION_SYMPTOM = /pluginConfig|TS2345/;

function xfailStep(tsSdkVersion, label, run, expectedPattern, reason) {
  const name = `ts-sdk ${tsSdkVersion}: ${label}`;
  try {
    run();
    failures.push({ name, message: "now SUCCEEDS — the known upstream gap is fixed, so remove this xfail (" + reason + ")" });
  } catch (error) {
    const text = String(error.stdout ?? error.stderr ?? error.message ?? error);
    if (CANOPY_REGRESSION_SYMPTOM.test(text)) {
      failures.push({ name, message: `a canopy-sdk-attributable diagnostic appeared alongside the expected upstream failure — this is a real regression, not the known gap:\n${text}` });
    } else if (expectedPattern.test(text)) {
      xfails.push({ name, reason });
    } else {
      failures.push({ name, message: `expected /${expectedPattern.source}/ but got: ${text}` });
    }
  }
}

/**
 * `--strict-peer-deps` turns npm's default "warn in ambiguous cases" behaviour into a hard
 * failure, so an accepted-but-imperfect peer resolution cannot pass silently. stderr is checked
 * too, on top of the exit code: npm has, in the past, printed a peer warning to stderr while
 * still exiting 0 for cases `--strict-peer-deps` does not cover, and a check that only trusted
 * the exit code would have missed exactly that. `execFileSync`'s return value is stdout only —
 * silently discarding stderr even when it's piped — which is exactly how this assertion read as
 * present but checked nothing; `spawnSync` is used instead so stderr is actually inspected.
 */
function npmInstall(projectDir) {
  const result = spawnSync("npm", ["install", "--no-audit", "--no-fund", "--strict-peer-deps"], {
    cwd: projectDir,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`npm install exited ${result.status}:\n${result.stdout}\n${result.stderr}`);
  }

  const peerWarningPattern = /peer dep missing|unmet peer|ERESOLVE/i;
  assert.doesNotMatch(result.stdout, peerWarningPattern, "npm install reported a peer dependency problem on stdout despite exiting 0");
  assert.doesNotMatch(result.stderr, peerWarningPattern, "npm install reported a peer dependency problem on stderr despite exiting 0");
}

/**
 * Counts physical installs on disk, not logical references in `npm ls`'s dependency tree. A
 * single physical copy is legitimately *referenced* by several dependents (canopy-sdk, -core,
 * -bindings all declare the same peer), so counting tree occurrences would over-count a correctly
 * deduped install. What actually matters — and what the duplicate-copy bug this migration removes
 * would violate — is how many distinct `@aptos-labs/ts-sdk/package.json` files exist anywhere
 * under `node_modules`, deduplicated by real path in case two npm-managed paths point at the same
 * physical install.
 */
function assertSingleResolvedVersion(projectDir, expectedVersion) {
  const physicalInstalls = new Set();
  findPackageInstalls(path.join(projectDir, "node_modules"), "@aptos-labs/ts-sdk", physicalInstalls);

  const versions = [...physicalInstalls].map(
    (dir) => JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")).version
  );

  assert.deepEqual(
    versions,
    [expectedVersion],
    `expected exactly one physical install of @aptos-labs/ts-sdk@${expectedVersion}, found ${versions.length}: ${versions.join(", ") || "none"}`
  );
}

/** Recursively finds every physical directory named `packageName` under `node_modules` trees. */
function findPackageInstalls(nodeModulesDir, packageName, into) {
  const directPath = path.join(nodeModulesDir, packageName);
  if (fs.existsSync(path.join(directPath, "package.json"))) {
    into.add(fs.realpathSync(directPath));
  }

  if (!fs.existsSync(nodeModulesDir)) {
    return;
  }

  for (const entry of fs.readdirSync(nodeModulesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const nestedNodeModules = path.join(nodeModulesDir, entry.name, "node_modules");
    if (fs.existsSync(nestedNodeModules)) {
      findPackageInstalls(nestedNodeModules, packageName, into);
    }

    // Scoped packages (`@scope/name`) are themselves one directory level, holding their
    // dependents' `node_modules` one level deeper than an unscoped package would.
    if (entry.name.startsWith("@")) {
      const scopeDir = path.join(nodeModulesDir, entry.name);
      for (const scoped of fs.readdirSync(scopeDir, { withFileTypes: true })) {
        if (scoped.isDirectory()) {
          const scopedNestedNodeModules = path.join(scopeDir, scoped.name, "node_modules");
          if (fs.existsSync(scopedNestedNodeModules)) {
            findPackageInstalls(scopedNestedNodeModules, packageName, into);
          }
        }
      }
    }
  }
}

/**
 * Actually builds (emits JS, does not stop at `--noEmit`) a second, minimal consumer file and
 * runs the result — the literal claim "typecheck and build" from the migration plan, kept as two
 * separate steps because a project can typecheck cleanly while its build config still fails to
 * emit (different `tsconfig` fields, a bundler-only `moduleResolution` that `tsc` alone can't
 * finish building, etc.).
 */
function buildAndRunConsumer(projectDir) {
  const buildOutDir = path.join(projectDir, "build-out");
  const buildTsconfigPath = path.join(projectDir, "tsconfig.build.json");
  fs.writeFileSync(
    buildTsconfigPath,
    JSON.stringify(
      {
        compilerOptions: {
          ...TSCONFIG.compilerOptions,
          // Same resolution mode as the typecheck step (`bundler`) — nodenext's own coverage
          // (the resolution mode that actually surfaced the dual-`Aptos`-type `exports`-map bug,
          // now fixed) lives in `writeNodenextFixtures`/`checkVersion` below; this step's only job
          // is proving the code actually emits and the output actually runs, which `--noEmit`
          // never exercises, so it stays on the same resolution mode as the typecheck step above
          // rather than duplicating that separate coverage.
          noEmit: false,
          outDir: "build-out",
        },
        files: ["build-check.mts"],
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(projectDir, "build-check.mts"),
    `import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { createCanopySdk } from '@canopyhub/canopy-sdk';
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
const sdk = createCanopySdk(aptos, { chain: 'aptos-testnet' });
console.log(typeof sdk.rewards === 'object' ? 'built-and-ran' : 'unexpected-shape');
`
  );

  execFileSync(process.execPath, [path.join(projectDir, "node_modules", "typescript", "bin", "tsc"), "-p", "tsconfig.build.json"], {
    cwd: projectDir,
    encoding: "utf8",
  });

  const output = execFileSync(process.execPath, [path.join(buildOutDir, "build-check.mjs")], {
    cwd: projectDir,
    encoding: "utf8",
  });
  assert.match(output, /built-and-ran/, "compiled consumer output did not run as expected");
}

/**
 * `nodenext` is the resolution mode a real, non-bundler-based consumer actually gets when it asks
 * for modern per-file ESM/CJS resolution — unlike `bundler`, it performs per-file,
 * `resolution-mode`-sensitive export-map lookups, which is exactly what surfaced the original
 * `pluginConfig` dual-`Aptos`-type conflict this package's `exports` map needed
 * condition-specific `types` entries to fix. Both a `.mts` (ESM) and a `.cts` (CJS) probe are
 * written, matching how a real consumer chooses one or the other depending on their own
 * package's `"type"` field.
 */
/**
 * Every public entry point, not just root — root subpaths and the three standalone packages are
 * separate declaration branches in the `exports` map this fix touched, and a nodenext-specific
 * regression could live in any one of them.
 */
const NODENEXT_CANOPY_IMPORTS = `import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { createCanopySdk } from '@canopyhub/canopy-sdk';
import type * as CanopyCore from '@canopyhub/canopy-sdk/core';
import type * as CanopyDeployments from '@canopyhub/canopy-sdk/deployments';
import type * as CanopyBindings from '@canopyhub/canopy-sdk/bindings';
import type * as StandaloneCore from '@canopyhub/canopy-sdk-core';
import type * as StandaloneDeployments from '@canopyhub/canopy-sdk-deployments';
import type * as StandaloneBindings from '@canopyhub/canopy-sdk-bindings';
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
const sdk = createCanopySdk(aptos, { chain: 'aptos-testnet' });
export type Check = [typeof sdk, CanopyCore.HexString, CanopyDeployments.ChainName, CanopyBindings.MoveModuleAbi,
  StandaloneCore.HexString, StandaloneDeployments.ChainName, StandaloneBindings.MoveModuleAbi];
`;

function writeTsconfig(projectDir, name, files, extraCompilerOptions = {}) {
  fs.writeFileSync(
    path.join(projectDir, name),
    JSON.stringify(
      {
        compilerOptions: { target: "ES2020", module: "NodeNext", moduleResolution: "nodenext", strict: true, noEmit: true, ...extraCompilerOptions },
        files,
      },
      null,
      2
    )
  );
}

function writeNodenextFixtures(projectDir) {
  // Required for every ts-sdk version: proves canopy-sdk's own nodenext story — every public
  // entry point, CJS and ESM — actually works. `skipLibCheck` isolates this from ts-sdk's own
  // unrelated internal declaration issues (see `nodenext-esm-upstream-only.mts` below):
  // empirically confirmed against a deliberately-reintroduced version of the original
  // `pluginConfig` conflict that skipLibCheck does NOT suppress a real canopy-sdk regression here
  // — that error surfaces at the consumer call site, not inside a dependency's own `.d.ts`, which
  // is exactly what skipLibCheck leaves checked.
  fs.writeFileSync(path.join(projectDir, "nodenext-esm-canopy-integration.mts"), NODENEXT_CANOPY_IMPORTS);
  writeTsconfig(projectDir, "tsconfig.nodenext-esm-canopy-integration.json", ["nodenext-esm-canopy-integration.mts"], {
    skipLibCheck: true,
  });

  fs.writeFileSync(path.join(projectDir, "nodenext-cjs-canopy-integration.cts"), NODENEXT_CANOPY_IMPORTS);
  writeTsconfig(projectDir, "tsconfig.nodenext-cjs-canopy-integration.json", ["nodenext-cjs-canopy-integration.cts"], {
    skipLibCheck: true,
  });

  // Both fixtures are written for every version; only the ESM step is skipped for 6.3.1 in
  // `checkVersion` (replaced by the upstream-only xfail there) — the known defect is ESM-only, so
  // strict CJS runs for 6.3.1 too. Both prove full strictness (no skipLibCheck) where nothing
  // upstream is broken.
  fs.writeFileSync(path.join(projectDir, "nodenext-esm-strict.mts"), NODENEXT_CANOPY_IMPORTS);
  writeTsconfig(projectDir, "tsconfig.nodenext-esm-strict.json", ["nodenext-esm-strict.mts"]);

  fs.writeFileSync(path.join(projectDir, "nodenext-cjs-strict.cts"), NODENEXT_CANOPY_IMPORTS);
  writeTsconfig(projectDir, "tsconfig.nodenext-cjs-strict.json", ["nodenext-cjs-strict.cts"]);

  // xfail fixture for 6.3.1 only: ts-sdk alone, deliberately with NO canopy-sdk import at all, so
  // the failure can only ever be attributed to ts-sdk itself — never to anything this package
  // does or doesn't export.
  fs.writeFileSync(
    path.join(projectDir, "nodenext-esm-upstream-only.mts"),
    `import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
export type Check = typeof aptos;
`
  );
  writeTsconfig(projectDir, "tsconfig.nodenext-esm-upstream-only.json", ["nodenext-esm-upstream-only.mts"]);
}

// ── fixture project ──────────────────────────────────────────────────────────

function writeProject(projectDir, tsSdkVersion, tarballs) {
  const packageJson = {
    name: "canopy-sdk-consumer-compat-probe",
    private: true,
    version: "0.0.0",
    dependencies: {
      "@aptos-labs/ts-sdk": tsSdkVersion,
      "@canopyhub/canopy-sdk": `file:${tarballs["@canopyhub/canopy-sdk"]}`,
      "@canopyhub/canopy-sdk-core": `file:${tarballs["@canopyhub/canopy-sdk-core"]}`,
      "@canopyhub/canopy-sdk-bindings": `file:${tarballs["@canopyhub/canopy-sdk-bindings"]}`,
      "@canopyhub/canopy-sdk-deployments": `file:${tarballs["@canopyhub/canopy-sdk-deployments"]}`,
    },
    devDependencies: {
      typescript: rootManifest.devDependencies.typescript.replace(/^[\^~]/, ""),
      // Kept as a range, deliberately NOT pinned to the floor like ts-sdk/typescript above:
      // ts-sdk 7's own emitted `.d.ts` references `NodeJS.NonSharedUint8Array`, a symbol
      // `@types/node` only gained partway through its 24.x line. Pinning this to `^24.4.0`'s
      // literal floor (24.4.0 itself lacks it) reintroduces the exact "stale pin masquerading as
      // current" bug this script's own ts-sdk version list was fixed to avoid — any real
      // consumer's `npm install` resolves this range to whatever is current today, and this
      // fixture should match that.
      "@types/node": rootManifest.devDependencies["@types/node"],
    },
  };

  fs.writeFileSync(path.join(projectDir, "package.json"), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.join(projectDir, "tsconfig.json"), JSON.stringify(TSCONFIG, null, 2));
  fs.writeFileSync(path.join(projectDir, "index.ts"), TS_CHECK_SOURCE);
  fs.writeFileSync(path.join(projectDir, "esm-check.mjs"), ESM_CHECK_SOURCE);
  fs.writeFileSync(path.join(projectDir, "cjs-check.cjs"), CJS_CHECK_SOURCE);
}

const TSCONFIG = {
  compilerOptions: {
    target: "ES2020",
    module: "ESNext",
    moduleResolution: "bundler",
    strict: true,
    // Deliberately NOT skipLibCheck: this typecheck's whole point is catching a `.d.ts`-level
    // incompatibility between the installed ts-sdk major and canopy-sdk's own public types —
    // exactly what skipLibCheck would suppress.
    noEmit: true,
  },
  files: ["index.ts"],
};

/**
 * No cast on the `Aptos` instance passed to `createCanopySdk` — the exact shape of check that
 * would have caught 2.0.0's `^7.0.0`-only peer range breaking ts-sdk 6 consumers before it shipped.
 */
const TS_CHECK_SOURCE = `import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { createCanopySdk } from '@canopyhub/canopy-sdk';

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
const sdk = createCanopySdk(aptos, { chain: 'aptos-testnet' });
export type Check = typeof sdk;
`;

/**
 * Shared logic between the ESM and CJS checks, expressed once and duplicated by the two thin
 * entry points below rather than imported, since the whole point is exercising each module
 * system's own resolution of the package with no shared runtime module between them.
 *
 * The entry-payload half makes one real call to aptos-testnet. `entryFunctionPayload` (and every
 * rewards entry builder built on it) deliberately carries no local `abi` field, so
 * `@aptos-labs/ts-sdk` resolves the entry-function ABI itself at build time — the same reason
 * `check-live-payloads.mjs` exists as a live check at all. There is no way to BCS-serialize one of
 * these payloads without a fullnode, so proving it across ts-sdk majors means calling one.
 *
 * Fail-closed, matching `check-live-payloads.mjs`'s own precedent: that script's `report()`
 * explicitly gates on infra failures too ("a sustained outage would otherwise report green with
 * no coverage at all"), specifically so a transport blip can never make CI pass without the
 * serialization actually having run. A short retry (transport symptoms only) absorbs a single
 * transient blip without either hiding a real defect or accepting a compatibility leg that never
 * executed.
 */
function checkBody(requireStyle) {
  return `
${requireStyle}

const TRANSPORT_SYMPTOM = /fetch failed|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|timed? ?out|bad gateway|service unavailable|too many requests/i;

async function withTransportRetry(attempt, attempts = 3) {
  let lastError;
  for (let index = 0; index < attempts; index += 1) {
    try {
      return await attempt();
    } catch (error) {
      lastError = error;
      const text = String((error && error.message) || error);
      if (!TRANSPORT_SYMPTOM.test(text)) {
        throw error;
      }
      if (index < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * 2 ** index));
      }
    }
  }
  throw new Error('aptos-testnet unreachable after ' + attempts + ' attempts: ' + ((lastError && lastError.message) || lastError));
}

async function main() {
  const fakeAptos = {
    view: async ({ payload }) => {
      if (payload.function.endsWith('::get_pool_info')) {
        return ['0x2', ['0x3'], '1000'];
      }
      throw new Error('unexpected view call: ' + payload.function);
    },
  };

  const sdk = createCanopySdk(fakeAptos, { chain: 'aptos-testnet' });
  if (!sdk.rewards) {
    throw new Error('rewards client missing on aptos-testnet');
  }

  const payload = sdk.rewards.buildClaimRewardsPayload({ rewardTokenAddresses: ['0x3'] });
  if (!payload || typeof payload !== 'object' || !payload.functionArguments) {
    throw new Error('buildClaimRewardsPayload did not return a transaction payload');
  }

  const poolInfo = await sdk.rewards.getPoolInfo('0x1');
  if (poolInfo.totalStaked !== 1000n) {
    throw new Error('getPoolInfo did not decode the fake view response correctly');
  }

  if (typeof core.normalizeMoveAddress !== 'function') {
    throw new Error('canopy-sdk/core subpath missing normalizeMoveAddress export');
  }
  if (typeof deployments.getDeployment !== 'function') {
    throw new Error('canopy-sdk/deployments subpath missing getDeployment export');
  }
  if (typeof bindings.getAbisForChain !== 'function') {
    throw new Error('canopy-sdk/bindings subpath missing getAbisForChain export');
  }
  if (typeof standaloneCore.normalizeMoveAddress !== 'function') {
    throw new Error('standalone @canopyhub/canopy-sdk-core package missing normalizeMoveAddress export');
  }
  if (typeof standaloneDeployments.getDeployment !== 'function') {
    throw new Error('standalone @canopyhub/canopy-sdk-deployments package missing getDeployment export');
  }
  if (typeof standaloneBindings.getAbisForChain !== 'function') {
    throw new Error('standalone @canopyhub/canopy-sdk-bindings package missing getAbisForChain export');
  }

  const realAptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
  const rawTransaction = await withTransportRetry(() =>
    realAptos.transaction.build.simple({ sender: '0x1', data: payload })
  );
  const bytes = rawTransaction.bcsToBytes();
  if (!(bytes instanceof Uint8Array) || bytes.length === 0) {
    throw new Error('built transaction produced no BCS bytes');
  }

  console.log('ok');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
`;
}

const ESM_CHECK_SOURCE = checkBody(`import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { createCanopySdk } from '@canopyhub/canopy-sdk';
import * as core from '@canopyhub/canopy-sdk/core';
import * as deployments from '@canopyhub/canopy-sdk/deployments';
import * as bindings from '@canopyhub/canopy-sdk/bindings';
import * as standaloneCore from '@canopyhub/canopy-sdk-core';
import * as standaloneDeployments from '@canopyhub/canopy-sdk-deployments';
import * as standaloneBindings from '@canopyhub/canopy-sdk-bindings';`);

const CJS_CHECK_SOURCE = checkBody(`const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const { createCanopySdk } = require('@canopyhub/canopy-sdk');
const core = require('@canopyhub/canopy-sdk/core');
const deployments = require('@canopyhub/canopy-sdk/deployments');
const bindings = require('@canopyhub/canopy-sdk/bindings');
const standaloneCore = require('@canopyhub/canopy-sdk-core');
const standaloneDeployments = require('@canopyhub/canopy-sdk-deployments');
const standaloneBindings = require('@canopyhub/canopy-sdk-bindings');`);

// ── reporting ─────────────────────────────────────────────────────────────

function report() {
  console.log(`\nconsumer compat check: ${passes.length} passed, ${xfails.length} xfail, ${failures.length} failed\n`);

  for (const name of passes) {
    console.log(`  pass  ${name}`);
  }

  for (const xfail of xfails) {
    console.log(`  XFAIL ${xfail.name}\n          expected failure: ${xfail.reason}`);
  }

  for (const failure of failures) {
    console.log(`  FAIL  ${failure.name}\n${indent(failure.message)}`);
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nall consumer compat checks passed across ts-sdk ${TS_SDK_VERSIONS.join(", ")}`);
}

function indent(text) {
  return String(text)
    .trimEnd()
    .split("\n")
    .map(line => `          ${line}`)
    .join("\n");
}

// ── entry point ───────────────────────────────────────────────────────────
// Deliberately last: everything above (fixture sources, TSCONFIG) must be fully initialized
// before any of it runs.

const packDir = fs.mkdtempSync(path.join(os.tmpdir(), "canopy-sdk-consumer-compat-pack-"));

try {
  const tarballs = packAll(packDir);

  try {
    assertPackedManifests(tarballs);
    passes.push("packed manifests: peer/sibling dependency fields are correct in the tarballs themselves");
  } catch (error) {
    failures.push({ name: "packed manifests: peer/sibling dependency fields", message: error.message ?? String(error) });
  }

  for (const tsSdkVersion of TS_SDK_VERSIONS) {
    checkVersion(tsSdkVersion, tarballs);
  }
} finally {
  fs.rmSync(packDir, { recursive: true, force: true });
}

report();
