#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tscEntrypoint = path.join(rootDir, "node_modules", "typescript", "bin", "tsc");
const fixtureDir = path.join(rootDir, "tests", "fixtures", "import-smoke");
const modes = ["node", "node16", "nodenext", "bundler"];

assert.equal(
  typeof process.versions.node,
  "string",
  "Node.js is required to run import smoke checks"
);

const tempProjectDir = fs.mkdtempSync(path.join(os.tmpdir(), "canopy-sdk-import-smoke-"));
const packageLinks = {
  "canopy-sdk": rootDir,
  "canopy-sdk-core": path.join(rootDir, "packages", "core"),
  "canopy-sdk-deployments": path.join(rootDir, "packages", "deployments"),
  "canopy-sdk-bindings": path.join(rootDir, "packages", "bindings"),
};

try {
  fs.cpSync(fixtureDir, tempProjectDir, { recursive: true });
  for (const [packageName, packagePath] of Object.entries(packageLinks)) {
    ensureSymlink(
      path.join(tempProjectDir, "node_modules", "@canopyhub", packageName),
      packagePath
    );
  }

  for (const mode of modes) {
    const configPath = path.join(tempProjectDir, `tsconfig.${mode}.json`);

    execFileSync(process.execPath, [tscEntrypoint, "--noEmit", "-p", configPath], {
      cwd: tempProjectDir,
      stdio: "inherit",
    });
  }
} finally {
  fs.rmSync(tempProjectDir, { recursive: true, force: true });
}

console.log(`import smoke checks ok (${modes.join(", ")})`);

function ensureSymlink(linkPath, targetPath) {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.symlinkSync(targetPath, linkPath, "dir");
}
