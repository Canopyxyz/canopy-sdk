#!/usr/bin/env node
/**
 * `prepublishOnly` guard: refuses any publish that did not come through `scripts/release.mjs`.
 *
 * WHY A GUARD AND NOT `publishConfig.tag`
 * ---------------------------------------
 * A pinned `publishConfig.tag` routes one release correctly and then keeps routing every
 * release after it the same way, until somebody remembers to delete it. Sticky state that
 * silently misroutes future releases is a worse problem than the one it solves — this repo
 * has already been through one such hold, when the whole 2.x line sat on `next`.
 *
 * This instead forces the tag to be chosen explicitly at every release, and leaves nothing
 * behind to unwind.
 *
 * Note what remains load-bearing now that normal releases go to `latest`, which is also npm's
 * default: the tag check itself is close to vacuous, and the real value is in the wrapper this
 * guard forces you through — the release branch check, the printed four-package plan, and the
 * refusal to publish a single package on its own. Do not read a passing guard as more assurance
 * than that.
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
      "  Publishing directly skips the branch check and the four-package plan, and would take",
      "  the `latest` dist-tag by default rather than by decision.",
      "",
      "  Use the release wrapper, which sets the tag and publishes every package:",
      "",
      "    pnpm release:latest    # normal releases",
      "    pnpm release:next      # pre-releases only",
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
