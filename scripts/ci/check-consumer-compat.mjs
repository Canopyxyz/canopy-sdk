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
 * WHAT IT DOES, PER TS-SDK VERSION
 * ---------------------------------
 * 1. Packs all four published packages (`pnpm pack`, once, shared across versions).
 * 2. In a fresh, isolated project directory, installs the tarballs plus that exact ts-sdk
 *    version via plain `npm install` — no `--legacy-peer-deps`, no `--force`. A real, resolvable
 *    peer range installs cleanly under npm's default (strict) resolver; this only passes if npm
 *    accepts the version with zero peer conflicts.
 * 3. Confirms via `npm ls` that exactly the requested ts-sdk version resolved (not npm silently
 *    substituting something else it found acceptable).
 * 4. Runs an ESM script and a CJS script that both import every published subpath
 *    (`.`, `./core`, `./deployments`, `./bindings`), construct a real `Aptos`-shaped client that
 *    only implements `.view()` (matching `MoveViewClient`, the actual runtime surface the SDK's
 *    view path calls), and exercise one real payload build and one real view-call decode through
 *    it — deterministic, no live fullnode. `check-live-payloads.mjs` already covers live-chain
 *    behaviour on the pinned ts-sdk version this repo develops against; this script's job is
 *    narrower and different: does the package work AT ALL against each ts-sdk major.
 * 5. Runs `tsc --noEmit` against a `.ts` file that passes a real `Aptos` instance into
 *    `createCanopySdk` with no cast — the same shape of check that caught 2.0.0 needing an `as
 *    any` on ts-sdk 6 before the peer range was fixed.
 *
 * WHICH VERSIONS, AND WHY PINNED EXACTLY
 * ----------------------------------------
 * Pinned, not "latest": the merge gate must not depend on a moving target. `6.3.1` is the version
 * this range exists to support; `7.0.0` is the declared floor; the third is whatever this repo's
 * own root manifest already pins as a devDependency, so it never drifts out of sync with what the
 * rest of this repo's test suite already exercises. A separate, non-gating canary job can track
 * ts-sdk's real `latest` if that coverage is wanted — deliberately not this script's job.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverPublishedPackages } from "./lib/workspace-packages.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rootManifest = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));

const currentPinnedTsSdk = rootManifest.devDependencies["@aptos-labs/ts-sdk"].replace(/^[\^~]/, "");
const TS_SDK_VERSIONS = Array.from(new Set(["6.3.1", "7.0.0", currentPinnedTsSdk]));

const failures = [];
const passes = [];

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

function npmInstall(projectDir) {
  execFileSync("npm", ["install", "--no-audit", "--no-fund"], { cwd: projectDir, encoding: "utf8" });
}

function assertSingleResolvedVersion(projectDir, expectedVersion) {
  const raw = execFileSync("npm", ["ls", "@aptos-labs/ts-sdk", "--all", "--json"], {
    cwd: projectDir,
    encoding: "utf8",
  });
  const tree = JSON.parse(raw);
  const resolvedVersions = new Set();
  collectVersions(tree.dependencies ?? {}, resolvedVersions);

  assert.deepEqual(
    [...resolvedVersions],
    [expectedVersion],
    `expected exactly one resolved @aptos-labs/ts-sdk@${expectedVersion}, found: ${[...resolvedVersions].join(", ") || "none"}`
  );
}

function collectVersions(dependencies, into) {
  for (const [name, info] of Object.entries(dependencies)) {
    if (name === "@aptos-labs/ts-sdk" && info.version) {
      into.add(info.version);
    }
    if (info.dependencies) {
      collectVersions(info.dependencies, into);
    }
  }
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
    skipLibCheck: true,
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
 */
function checkBody(requireStyle) {
  return `
${requireStyle}

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

  console.log('ok');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
`;
}

const ESM_CHECK_SOURCE = checkBody(`import { createCanopySdk } from '@canopyhub/canopy-sdk';
import * as core from '@canopyhub/canopy-sdk/core';
import * as deployments from '@canopyhub/canopy-sdk/deployments';
import * as bindings from '@canopyhub/canopy-sdk/bindings';`);

const CJS_CHECK_SOURCE = checkBody(`const { createCanopySdk } = require('@canopyhub/canopy-sdk');
const core = require('@canopyhub/canopy-sdk/core');
const deployments = require('@canopyhub/canopy-sdk/deployments');
const bindings = require('@canopyhub/canopy-sdk/bindings');`);

// ── reporting ─────────────────────────────────────────────────────────────

function report() {
  console.log(`\nconsumer compat check: ${passes.length} passed, ${failures.length} failed\n`);

  for (const name of passes) {
    console.log(`  pass  ${name}`);
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

  for (const tsSdkVersion of TS_SDK_VERSIONS) {
    checkVersion(tsSdkVersion, tarballs);
  }
} finally {
  fs.rmSync(packDir, { recursive: true, force: true });
}

report();
