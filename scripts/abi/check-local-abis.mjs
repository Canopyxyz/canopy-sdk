#!/usr/bin/env node
import { readFile, readdir } from "node:fs/promises";
import process from "node:process";
import { ABI_MANIFEST } from "./abi-manifest.mjs";
import {
  isMoveAddressFormat,
  isCanonicalMoveAddressFormat,
  normalizeMoveAddressHex,
} from "../../packages/shared/move-address-format.mjs";

const requestedChain = getArgValue("--chain");
const chains = requestedChain ? [requestedChain] : Object.keys(ABI_MANIFEST);
let failed = false;

for (const chain of chains) {
  const entries = ABI_MANIFEST[chain];

  if (!entries) {
    throw new Error(`Unknown ABI manifest chain: ${chain}`);
  }

  const deployment = await readJson(`packages/deployments/addresses/${chain}.json`);
  const importedAbiFiles = await readChainAbiImports(chain);
  const directoryAbiFiles = await readAbiDirectory(chain);
  const manifestAbiFiles = new Set(entries.map((entry) => entry.file));

  for (const file of manifestAbiFiles) {
    if (!importedAbiFiles.has(file)) {
      console.error(`abi:${chain}: manifest file ${file} is not imported by chain bindings`);
      failed = true;
    }
  }

  for (const file of directoryAbiFiles) {
    if (!importedAbiFiles.has(file)) {
      console.error(`abi:${chain}: ABI file ${file} exists on disk but is not imported by chain bindings`);
      failed = true;
    }
  }

  for (const entry of entries) {
    const abi = await readAbi(`packages/bindings/abis/${chain}/${entry.file}`);
    const expectedAddress = readPath(deployment, entry.addressPath);

    if (normalizeMoveAddress(abi.address) !== normalizeMoveAddress(expectedAddress)) {
      console.error(
        `abi:${chain}:${entry.key}: expected address ${expectedAddress}, got ${abi.address}`
      );
      failed = true;
    }

    if (abi.name !== entry.moduleName) {
      console.error(
        `abi:${chain}:${entry.key}: expected module ${entry.moduleName}, got ${abi.name}`
      );
      failed = true;
    }

    if (!Array.isArray(abi.exposed_functions)) {
      console.error(`abi:${chain}:${entry.key}: missing exposed_functions array`);
      failed = true;
    }

    if (!Array.isArray(abi.structs)) {
      console.error(`abi:${chain}:${entry.key}: missing structs array`);
      failed = true;
    }
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("local ABI files ok");
}

function getArgValue(name) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, repoRoot()), "utf8"));
}

async function readAbi(relativePath) {
  const contents = await readFile(new URL(relativePath, repoRoot()), "utf8");

  if (relativePath.endsWith(".ts")) {
    const match = contents.match(/^export const ABI = ([\s\S]+) as const;\s*$/);

    if (!match) {
      throw new Error(`Unsupported ABI module format: ${relativePath}`);
    }

    return JSON.parse(match[1]);
  }

  throw new Error(`Unsupported ABI file extension: ${relativePath}`);
}

async function readAbiDirectory(chain) {
  const directory = new URL(`../../packages/bindings/abis/${chain}/`, import.meta.url);
  const entries = await safeReadDirectory(directory);
  return new Set(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => entry.name)
  );
}

async function readChainAbiImports(chain) {
  const contents = await readFile(
    new URL(`../../packages/bindings/src/chains/${chain}.ts`, import.meta.url),
    "utf8"
  );
  const importPattern = new RegExp(`\\.\\./\\.\\./abis/${escapeRegExp(chain)}/([^"']+)`, "g");
  const importedFiles = new Set();

  for (const match of contents.matchAll(importPattern)) {
    const file = match[1];
    if (file) {
      importedFiles.add(`${file}.ts`);
    }
  }

  return importedFiles;
}

function readPath(value, pathParts) {
  let current = value;

  for (const pathPart of pathParts) {
    current = current?.[pathPart];
  }

  if (typeof current !== "string" || current.length === 0) {
    throw new Error(`Missing deployment address at ${pathParts.join(".")}`);
  }

  return current;
}

function repoRoot() {
  return new URL("../../", import.meta.url);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeMoveAddress(address) {
  if (
    !isCanonicalMoveAddressFormat(address) &&
    !isMoveAddressFormat(address)
  ) {
    throw new Error(`Invalid Move address: ${address}`);
  }

  return `0x${normalizeMoveAddressHex(address)}`;
}

async function safeReadDirectory(directory) {
  try {
    return await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isMissingDirectoryError(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingDirectoryError(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
