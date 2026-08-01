#!/usr/bin/env node
/**
 * Guards the browser bundle against Node-only dependency paths.
 *
 * Reads an already-built `examples/react/dist` — it does not build anything. Run
 * `pnpm build && pnpm --filter @canopy-sdk-example/sdk-react run build` first; CI does
 * that in a separate step.
 *
 * WHY THIS EXISTS
 * ---------------
 * `@thalalabs/surf` reached `@initia/initia.js` (a different chain's SDK) from its
 * main entry, which requires Node's `Buffer`. That made the SDK unusable in any
 * browser: `examples/react` died on `ReferenceError: Buffer is not defined` before
 * it could even list vaults. Nothing in CI caught it because the unit tests run in
 * Node, where `Buffer` exists.
 *
 * TOKEN CHOICE IS EMPIRICAL, NOT OBVIOUS
 * --------------------------------------
 * Measured against the pre-removal bundle:
 *
 *   initia.move   73 -> 0    protobuf type-URL fragment; Initia-specific
 *   MsgExecute    84 -> 0    Initia/cosmos message type
 *   bech32        33 -> 0    cosmos address encoding
 *   cosmos       418 -> 1    residual; wallet adapters legitimately carry some
 *   secp256k1     75 -> 6    residual; a real Aptos key type in ts-sdk 7
 *   Buffer       546 -> 47   contaminated by ArrayBuffer / appendToBuffer / axios
 *   App chunk   4.46MB -> 1.86MB
 *
 * Two traps this avoids:
 *   - `@initia` reads 0 even when Initia IS bundled, because bare module specifiers
 *     do not survive minification. Only string *contents* do.
 *   - bare `initia` matches `initialize` / `initiation` / `initialPromise`. In one
 *     pre-Surf bundle all 48 hits were English words.
 *
 * So only the three unambiguous, verified-zero tokens gate. The rest are reported.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const bundleDir = new URL("../../examples/react/dist/assets/", import.meta.url);
const FORBIDDEN = ["initia.move", "MsgExecute", "bech32"];
const REPORTED = ["cosmos", "secp256k1", "Buffer"];

let files;
try {
  files = readdirSync(bundleDir).filter((name) => name.endsWith(".js"));
} catch {
  console.error(
    "browser bundle not found. Run `pnpm build && cd examples/react && pnpm build` first."
  );
  process.exit(1);
}

if (files.length === 0) {
  console.error("browser bundle contains no .js assets");
  process.exit(1);
}

const sources = files.map((name) => ({
  name,
  size: statSync(new URL(name, bundleDir)).size,
  text: readFileSync(new URL(name, bundleDir), "utf8"),
}));

const failures = [];

for (const token of FORBIDDEN) {
  const total = sources.reduce((sum, file) => sum + countOccurrences(file.text, token), 0);
  if (total > 0) {
    failures.push(`${token}: ${total} occurrence(s) — a Node-only dependency path is bundled`);
  } else {
    console.log(`  ok    ${token}: 0`);
  }
}

for (const token of REPORTED) {
  const total = sources.reduce((sum, file) => sum + countOccurrences(file.text, token), 0);
  console.log(`  info  ${token}: ${total} (reported, not a gate)`);
}

for (const file of sources.sort((a, b) => b.size - a.size)) {
  console.log(`  info  ${path.basename(file.name)}: ${file.size.toLocaleString()} bytes`);
}

if (failures.length > 0) {
  console.error("\nbrowser bundle check failed:");
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  process.exit(1);
}

console.log("\nbrowser bundle is free of Node-only dependency paths");

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }

  return count;
}
