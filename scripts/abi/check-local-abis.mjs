#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import { ABI_MANIFEST } from "./abi-manifest.mjs";

const requestedChain = getArgValue("--chain");
const chains = requestedChain ? [requestedChain] : Object.keys(ABI_MANIFEST);
let failed = false;

for (const chain of chains) {
  const entries = ABI_MANIFEST[chain];

  if (!entries) {
    throw new Error(`Unknown ABI manifest chain: ${chain}`);
  }

  const deployment = await readJson(`packages/deployments/addresses/${chain}.json`);
  for (const entry of entries) {
    const abi = await readJson(`packages/bindings/abis/${chain}/${entry.file}`);
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

function normalizeMoveAddress(address) {
  const hex = address.startsWith("0x") ? address.slice(2) : address;
  return `0x${hex.padStart(64, "0").toLowerCase()}`;
}
