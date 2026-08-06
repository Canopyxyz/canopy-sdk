#!/usr/bin/env node
/**
 * The only supported way to publish this repo.
 *
 * Usage:
 *   node scripts/release.mjs <next|latest> [--dry-run]
 *
 * WHY THIS OWNS THE PUBLISH COMMAND
 * ---------------------------------
 * The `prepublishOnly` guard (`scripts/ci/require-release-tag.mjs`) can only read an env var,
 * because pnpm does not expose `npm_config_tag` to lifecycle scripts. On its own that proves
 * intent and nothing more — `CANOPY_RELEASE_TAG=next pnpm publish -r` would pass the guard and
 * still publish to `latest`.
 *
 * Deriving both the env var and `--tag` from one validated value here is what makes them
 * impossible to desync.
 *
 * WHY ONE RECURSIVE STEP, AND A WARNING ABOUT A PLAUSIBLE WRONG TURN
 * ------------------------------------------------------------------
 * `pnpm publish -r` covers all four published packages, **including the repo root**. Verified
 * by counting what a dry run actually packs:
 *
 *   $ pnpm publish -r --tag next --dry-run | grep '^npm notice name:'
 *   @canopyhub/canopy-sdk  @canopyhub/canopy-sdk-core
 *   @canopyhub/canopy-sdk-bindings  @canopyhub/canopy-sdk-deployments
 *
 * This is worth stating because the obvious inference from `pnpm-workspace.yaml` is wrong.
 * That file lists only `packages/*` and `examples/*`, and other recursive commands really do
 * skip the root:
 *
 *   $ pnpm -r exec node -e 'console.log(process.cwd())'
 *   ./examples/react  ./packages/core  ./packages/deployments  ./packages/bindings
 *   ./packages/sdk                                       <- no repo root
 *
 * `publish` does not behave like `exec` here. An earlier version of this script "fixed" the
 * apparent gap by publishing the root separately first, which would have published it twice —
 * the second attempt failing on a version conflict *after* the first had already gone to the
 * registry. Do not re-add a separate root step without re-running the dry-run count above.
 *
 * `packages/sdk` and `examples/react` are `private: true`; pnpm skips them.
 */
import process from "node:process";
import { spawnSync } from "node:child_process";

const VALID_TAGS = ["next", "latest"];
const USAGE = "usage: node scripts/release.mjs <next|latest> [--dry-run] [--allow-branch]";

/**
 * Parses argv strictly and fails closed.
 *
 * Unknown arguments are an error rather than being ignored, and that is load-bearing: a wrapper
 * that read `argv[2]` and dropped the rest would turn `release.mjs next --dry-run` — the
 * command used to rehearse a release — into a real publish.
 */
function parseArgs(argv) {
  const positional = [];
  let dryRun = false;
  let allowBranch = false;

  for (const arg of argv) {
    if (arg === "--dry-run") {
      if (dryRun) return { error: `repeated --dry-run\n${USAGE}` };
      dryRun = true;
      continue;
    }

    if (arg === "--allow-branch") {
      if (allowBranch) return { error: `repeated --allow-branch\n${USAGE}` };
      allowBranch = true;
      continue;
    }

    if (arg.startsWith("-")) {
      return { error: `unknown option: ${arg}\n${USAGE}` };
    }

    positional.push(arg);
  }

  if (positional.length === 0) {
    return { error: `missing release tag\n${USAGE}` };
  }

  if (positional.length > 1) {
    return { error: `expected exactly one tag, got: ${positional.join(", ")}\n${USAGE}` };
  }

  const [tag] = positional;
  if (!VALID_TAGS.includes(tag)) {
    return { error: `invalid tag: ${tag} (expected ${VALID_TAGS.join(" or ")})\n${USAGE}` };
  }

  return { tag, dryRun, allowBranch };
}

/** Current git branch, or undefined if git cannot answer. */
function currentBranch() {
  const result = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : undefined;
}

const parsed = parseArgs(process.argv.slice(2));

if (parsed.error) {
  console.error(`\n  ${parsed.error}\n`);
  process.exit(1);
}

const { tag, dryRun, allowBranch } = parsed;

/**
 * Refuse to release from a non-release branch, rather than letting pnpm handle it.
 *
 * pnpm defaults `publish-branch` to `master|main` and, off those branches, asks
 * "Do you want to continue?" — which defaults to no and then **exits 0**. Verified:
 *
 *   $ CANOPY_RELEASE_TAG=next pnpm publish --tag next --dry-run </dev/null; echo $?
 *   0
 *
 * So a release run from a feature branch publishes nothing and reports success. Checking here
 * turns that silent no-op into a loud failure, and passing `--publish-branch` when the check is
 * deliberately waived stops the prompt appearing at all — which also matters in CI, where there
 * is no TTY to answer it.
 */
const RELEASE_BRANCHES = ["main", "master"];
const branch = currentBranch();

if (!allowBranch && branch !== undefined && !RELEASE_BRANCHES.includes(branch)) {
  console.error(
    [
      "",
      `  Refusing to release from branch "${branch}".`,
      `  Releases are cut from ${RELEASE_BRANCHES.join(" or ")}.`,
      "",
      "  pnpm would otherwise prompt, default to no, and exit 0 — publishing nothing while",
      "  reporting success. Failing here instead.",
      "",
      "  To rehearse from this branch anyway:",
      `    node scripts/release.mjs ${tag} --dry-run --allow-branch`,
      "",
    ].join("\n")
  );
  process.exit(1);
}

// Both steps get --dry-run. Forwarding it to only one would publish half a release while
// reporting a rehearsal.
const dryRunArgs = dryRun ? ["--dry-run"] : [];
// Only when the branch check was waived: suppresses pnpm's own prompt, which has no TTY to
// answer it in CI and silently declines.
const branchArgs = allowBranch && branch ? ["--publish-branch", branch] : [];

const EXPECTED_PACKAGES = [
  "@canopyhub/canopy-sdk",
  "@canopyhub/canopy-sdk-core",
  "@canopyhub/canopy-sdk-bindings",
  "@canopyhub/canopy-sdk-deployments",
];

const steps = [
  {
    label: `all ${EXPECTED_PACKAGES.length} published packages, root included; private ones skipped`,
    args: ["publish", "-r", "--tag", tag, ...dryRunArgs, ...branchArgs],
  },
];

// Printed before anything runs, so a rehearsal is visually distinguishable from a real release
// and the exact commands are auditable rather than implied.
console.log("");
console.log(`  release plan`);
console.log(`    dist-tag : ${tag}`);
console.log(`    dry run  : ${dryRun ? "yes — nothing will be published" : "NO — THIS PUBLISHES"}`);
console.log(`    expected : ${EXPECTED_PACKAGES.join(", ")}`);
for (const [index, step] of steps.entries()) {
  console.log(`    step ${index + 1}   : pnpm ${step.args.join(" ")}`);
  console.log(`               ${step.label}`);
}
console.log("");
console.log(
  `  Confirm all ${EXPECTED_PACKAGES.length} appear below. A recursive publish that covers`
);
console.log(`  fewer has silently narrowed, and a partial release is worse than none.`);
console.log("");

for (const [index, step] of steps.entries()) {
  console.log(`==> step ${index + 1}/${steps.length}: pnpm ${step.args.join(" ")}`);

  const result = spawnSync("pnpm", step.args, {
    stdio: "inherit",
    // The guard reads this. Same validated value as --tag above, which is the point.
    env: { ...process.env, CANOPY_RELEASE_TAG: tag },
  });

  if (result.error) {
    console.error(`\n  step ${index + 1} could not start: ${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(
      `\n  step ${index + 1} failed with exit code ${result.status}.` +
        (index > 0
          ? "\n  NOTE: an earlier step may already have published. Check the registry before" +
            "\n  retrying, and see RELEASING.md.\n"
          : "\n")
    );
    process.exit(result.status ?? 1);
  }
}

console.log(
  dryRun
    ? `\n  dry run complete — nothing was published. Re-run without --dry-run to release on \`${tag}\`.\n`
    : `\n  published on the \`${tag}\` dist-tag. See RELEASING.md for promoting to \`latest\`.\n`
);
