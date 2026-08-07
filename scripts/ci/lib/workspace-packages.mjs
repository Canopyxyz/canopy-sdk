/**
 * Pure helpers for `scripts/ci/check-exports.mjs`.
 *
 * Extracted for the same reason `payload-check-helpers.mjs` was: the check script runs dynamic
 * `import()`s of the built bundles at module scope, so a test importing it would need a full
 * build present and would exit the process on the first bad manifest. These functions take a
 * root directory instead of closing over one, which is what lets a test point them at a fixture
 * tree rather than at this repo.
 *
 * Nothing here may have side effects at import time, and nothing may call `process.exit`.
 */
import fs from "node:fs";
import path from "node:path";

/** Characters that make a path a pattern rather than a literal directory. */
const GLOB_CHARS = /[*?![\]{}]/;
/** Exactly the trailing-single-level form `dir/*`, with no pattern characters before it. */
const SINGLE_LEVEL_GLOB = /^[^*?![\]{}]+\/\*$/;

/** `prepublishOnly` segments that genuinely build. Matched whole, never as a substring. */
export const BUILD_COMMANDS = new Set(["tsup", "pnpm run build"]);

/**
 * Workspace globs, read from `pnpm-workspace.yaml` itself.
 *
 * Parsed rather than hard-coded so that adding a glob — `apps/*` — brings those packages under
 * the checks automatically. Only the `packages:` block is read; pnpm allows sibling keys such as
 * `catalog:` whose list items are not workspace globs.
 *
 * Throws on an empty parse rather than returning `[]`: discovery silently finding nothing is the
 * failure mode that would make every downstream assertion vacuous.
 */
export function workspaceGlobs(rootDir) {
  const lines = fs.readFileSync(path.join(rootDir, "pnpm-workspace.yaml"), "utf8").split("\n");
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

  if (globs.length === 0) {
    throw new Error(
      "could not read any workspace globs from pnpm-workspace.yaml; package discovery would be empty"
    );
  }

  return globs;
}

/**
 * Expands one workspace glob to directories containing a `package.json`.
 *
 * Supports exactly the two shapes this workspace uses — `dir/*` and a literal path. Any other
 * pattern **throws** rather than matching nothing: silently under-matching would reintroduce
 * exactly the gap these checks exist to close.
 *
 * An allowlist, not a blocklist. An earlier version rejected a fixed set of exotic shapes and let
 * everything else fall through to literal-path handling, so `packages/*&#47;plugins` resolved to a
 * directory name containing a literal `*`, matched nothing, and narrowed discovery silently.
 */
export function expandGlob(rootDir, glob) {
  const hasManifest = (dir) => fs.existsSync(path.join(dir, "package.json"));

  if (SINGLE_LEVEL_GLOB.test(glob)) {
    const base = path.join(rootDir, glob.slice(0, -2));
    if (!fs.existsSync(base)) return [];

    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(base, entry.name))
      .filter(hasManifest);
  }

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
 * Every package under `rootDir` that publishes.
 *
 * The repo root is included explicitly. It is not a workspace member — `pnpm-workspace.yaml`
 * lists only `packages/*` and `examples/*` — but it is the package consumers actually install,
 * and `pnpm publish -r` does pack it.
 *
 * An earlier version asked `pnpm -r list --json` instead, which is more authoritative but proved
 * fragile: it can exit 0 with empty stdout, and `JSON.parse("")` then crashes before any
 * assertion runs. Reading the workspace file keeps the "new glob is honoured" property with no
 * child process to misbehave.
 */
export function discoverPublishedPackages(rootDir) {
  const dirs = [rootDir, ...workspaceGlobs(rootDir).flatMap((glob) => expandGlob(rootDir, glob))];
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

/**
 * Every file path a manifest promises, as `[label, target]` pairs.
 *
 * Pure: returns targets, resolves nothing. The caller decides what "exists" means.
 */
export function collectManifestTargets(manifest) {
  const targets = [];

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

  return targets;
}

/** Splits a `prepublishOnly` script into its `&&`-separated segments. */
export function scriptSegments(script) {
  return (script ?? "").split("&&").map((segment) => segment.trim());
}

/**
 * Whether `prepublishOnly` runs the release guard at `guardPath`.
 *
 * Resolved against the package directory, never suffix-matched: a leaf carrying
 * `node scripts/ci/require-release-tag.mjs` ends with the right path but resolves *inside* the
 * package, where nothing exists, so the publish would break at release time while a suffix check
 * waved it through.
 */
export function runsReleaseGuard(script, packageDir, guardPath) {
  return scriptSegments(script).some((segment) => {
    const match = /^node\s+(\S+)$/.exec(segment);
    return match !== null && path.resolve(packageDir, match[1]) === guardPath;
  });
}

/** Whether `prepublishOnly` contains a segment that is itself a build command. */
export function runsBuild(script) {
  return scriptSegments(script).some((segment) => BUILD_COMMANDS.has(segment));
}
