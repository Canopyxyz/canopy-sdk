#!/usr/bin/env node
/**
 * `prepublishOnly` guard: refuses any publish that did not come through `scripts/release.mjs`.
 *
 * WHY A GUARD AND NOT `publishConfig.tag`
 * ---------------------------------------
 * 2.0.0 must land on the `next` dist-tag, not `latest`, until canopy-cli's ts-sdk 7 major
 * ships. A `publishConfig.tag: "next"` would do that — and then keep doing it for 2.0.1, 3.0.0
 * and everything after, until somebody remembered to delete it. Sticky state that silently
 * misroutes future releases is a worse problem than the one it solves.
 *
 * This instead forces the tag to be chosen explicitly at every release, and leaves nothing
 * behind to unwind.
 *
 * WHY AN ENV VAR AND NOT THE PUBLISHED TAG
 * ----------------------------------------
 * A guard cannot read the tag that was actually passed to publish. pnpm exposes exactly one
 * `npm_config_*` variable to lifecycle scripts:
 *
 *   $ pnpm exec node -e '…Object.keys(process.env).filter(k => k.startsWith("npm_config_"))…'
 *   npm_config_user_agent
 *
 * So `npm_config_tag` is not available to cross-check against, which means an env var can only
 * prove *intent*: `CANOPY_RELEASE_TAG=next pnpm publish -r` would satisfy this guard while
 * defaulting to `latest`.
 *
 * That gap is closed by `scripts/release.mjs` owning the publish command — it derives the env
 * var and `--tag` from one validated value, so they cannot desync. This guard's job is only to
 * make sure that wrapper was used.
 *
 * SCOPE, STATED PLAINLY
 * ---------------------
 * This stops accidental publishes, not determined ones. Anyone can export the variable by
 * hand. That is the intended limit — it is a wrong-default guard, not an access control.
 */
import process from "node:process";

const VALID_TAGS = ["next", "latest"];
const tag = process.env.CANOPY_RELEASE_TAG;

if (!tag) {
  console.error(
    [
      "",
      "  Refusing to publish: no release tag was chosen.",
      "",
      "  Publishing directly would default to the `latest` dist-tag. 2.0.0 must go to `next`",
      "  until canopy-cli's ts-sdk 7 major lands, or consumers on ts-sdk 6 hit ERESOLVE.",
      "",
      "  Use the release wrapper, which sets the tag and publishes every package:",
      "",
      "    pnpm release:next      # 2.0.0 and anything before the CLI migration",
      "    pnpm release:latest    # only once the CLI is on ts-sdk 7",
      "",
      "  See RELEASING.md.",
      "",
    ].join("\n")
  );
  process.exit(1);
}

if (!VALID_TAGS.includes(tag)) {
  console.error(
    `\n  Refusing to publish: CANOPY_RELEASE_TAG is "${tag}", expected one of ${VALID_TAGS.join(
      ", "
    )}.\n  See RELEASING.md.\n`
  );
  process.exit(1);
}

console.log(`release tag: ${tag}`);
