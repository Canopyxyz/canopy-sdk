#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { ABI_MANIFEST } from "./abi-manifest.mjs";

const repoRoot = new URL("../..", import.meta.url);
const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const requestedChain = getArgValue("--chain");

const chains = requestedChain ? [requestedChain] : Object.keys(ABI_MANIFEST);
let hasDiff = false;

for (const chain of chains) {
  const entries = ABI_MANIFEST[chain];

  if (!entries) {
    throw new Error(`Unknown ABI manifest chain: ${chain}`);
  }

  if (entries.length === 0) {
    console.log(`abi:${chain}: no ABI entries configured`);
    continue;
  }

  const deployment = await readDeployment(chain);
  const outputDir = new URL(`../../packages/bindings/abis/${chain}/`, import.meta.url);
  await mkdir(outputDir, { recursive: true });

  for (const entry of entries) {
    const address = readPath(deployment, entry.addressPath);
    const abi = await fetchModuleAbi(deployment.fullnode, address, entry.moduleName);
    const formatted = `${JSON.stringify(abi, null, 2)}\n`;
    const outputUrl = new URL(entry.file, outputDir);

    if (checkOnly) {
      const current = await readFile(outputUrl, "utf8");
      if (current !== formatted) {
        console.error(`abi:${chain}:${entry.key}: drift detected at ${toRelativePath(outputUrl)}`);
        hasDiff = true;
      }
    } else {
      await writeFile(outputUrl, formatted);
      console.log(`abi:${chain}:${entry.key}: wrote ${toRelativePath(outputUrl)}`);
    }
  }
}

if (hasDiff) {
  process.exitCode = 1;
}

function getArgValue(name) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

async function readDeployment(chain) {
  const deploymentUrl = new URL(
    `../../packages/deployments/addresses/${chain}.json`,
    import.meta.url
  );
  return JSON.parse(await readFile(deploymentUrl, "utf8"));
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

async function fetchModuleAbi(fullnode, address, moduleName) {
  const endpoint = `${fullnode.replace(/\/$/, "")}/accounts/${address}/module/${moduleName}`;
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${address}::${moduleName}: ${response.status} ${response.statusText}`);
  }

  const module = await response.json();
  if (!module.abi) {
    throw new Error(`Missing ABI in response for ${address}::${moduleName}`);
  }

  return module.abi;
}

function toRelativePath(fileUrl) {
  return path.relative(new URL(".", repoRoot).pathname, fileUrl.pathname);
}
