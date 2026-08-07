import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  collectManifestTargets,
  discoverPublishedPackages,
  expandGlob,
  runsBuild,
  runsReleaseGuard,
  workspaceGlobs,
} from "../scripts/ci/lib/workspace-packages.mjs";

/**
 * Guards the discovery and manifest-walking `check:exports` relies on.
 *
 * These were verified by hand-mutating the real repo for two review rounds, which proves they
 * work against *this* tree and pins nothing. Their whole purpose is to behave correctly against
 * trees that do not exist yet — a fifth published package, a new workspace glob, an export map
 * written in a shape this repo does not currently use — so the fixtures below are throwaway
 * directories rather than the repo itself.
 *
 * That gap is not hypothetical: the recursive `collectManifestTargets` walk replaced a flat one
 * that iterated a string-shorthand export character by character, and a test here would have
 * caught it.
 */
function makeTree(files: Record<string, string>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "canopy-ws-"));

  for (const [relative, contents] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }

  return root;
}

const pkg = (name: string, extra: Record<string, unknown> = {}) =>
  JSON.stringify({ name, version: "1.0.0", ...extra });

const WORKSPACE = 'packages:\n  - "packages/*"\n  - "examples/*"\n';

describe("workspace package discovery", () => {
  const trees: string[] = [];
  const tree = (files: Record<string, string>) => {
    const root = makeTree(files);
    trees.push(root);
    return root;
  };

  afterAll(() => {
    for (const root of trees) fs.rmSync(root, { recursive: true, force: true });
  });

  describe("workspaceGlobs", () => {
    it("reads quoted and unquoted entries from the packages block", () => {
      const root = tree({
        "pnpm-workspace.yaml": 'packages:\n  - "packages/*"\n  - examples/*\n',
      });

      expect(workspaceGlobs(root)).toEqual(["packages/*", "examples/*"]);
    });

    it("ignores list items under sibling keys such as catalog", () => {
      const root = tree({
        "pnpm-workspace.yaml": 'packages:\n  - "packages/*"\ncatalog:\n  - not-a-glob\n',
      });

      expect(workspaceGlobs(root)).toEqual(["packages/*"]);
    });

    it("throws rather than returning an empty list", () => {
      // Returning [] would make every downstream assertion vacuous while still exiting 0.
      const root = tree({ "pnpm-workspace.yaml": "catalog:\n  foo: 1\n" });

      expect(() => workspaceGlobs(root)).toThrow(/could not read any workspace globs/);
    });
  });

  describe("expandGlob", () => {
    const root = () =>
      tree({
        "packages/a/package.json": pkg("a"),
        "packages/b/package.json": pkg("b"),
        "packages/not-a-package/readme.md": "no manifest here",
        "solo/package.json": pkg("solo"),
      });

    it("expands dir/* to directories that have a manifest", () => {
      const dir = root();
      const found = expandGlob(dir, "packages/*").map((p) => path.basename(p)).sort();

      expect(found).toEqual(["a", "b"]);
    });

    it("resolves a literal path", () => {
      const dir = root();

      expect(expandGlob(dir, "solo").map((p) => path.basename(p))).toEqual(["solo"]);
    });

    it("returns nothing for a base directory that does not exist", () => {
      expect(expandGlob(root(), "nope/*")).toEqual([]);
    });

    /**
     * An allowlist, not a blocklist. `packages/*&#47;plugins` is the case that motivated it: one
     * `*`, no trailing `/*`, so an earlier version fell through to literal-path handling and
     * matched nothing — narrowing discovery silently, which is the failure this whole check
     * exists to prevent.
     */
    it.each([
      "packages/*/plugins",
      "packages/**",
      "!packages/core",
      "packages/{a,b}",
      "packages/pkg-?",
    ])("throws on the unsupported shape %s", (glob) => {
      expect(() => expandGlob(root(), glob)).toThrow(/unsupported workspace glob/);
    });
  });

  describe("discoverPublishedPackages", () => {
    it("includes the root, which is not a workspace member", () => {
      const dir = tree({
        "pnpm-workspace.yaml": WORKSPACE,
        "package.json": pkg("@scope/root"),
        "packages/a/package.json": pkg("@scope/a"),
      });

      expect(discoverPublishedPackages(dir).map((p) => p.name).sort()).toEqual([
        "@scope/a",
        "@scope/root",
      ]);
    });

    it("skips private packages and manifests with no name", () => {
      const dir = tree({
        "pnpm-workspace.yaml": WORKSPACE,
        "package.json": pkg("@scope/root"),
        "packages/a/package.json": pkg("@scope/a"),
        "packages/hidden/package.json": pkg("@scope/hidden", { private: true }),
        "examples/demo/package.json": pkg("@scope/demo", { private: true }),
        "packages/anon/package.json": JSON.stringify({ version: "1.0.0" }),
      });

      expect(discoverPublishedPackages(dir).map((p) => p.name).sort()).toEqual([
        "@scope/a",
        "@scope/root",
      ]);
    });

    it("picks up a package added under an existing glob", () => {
      const dir = tree({
        "pnpm-workspace.yaml": WORKSPACE,
        "package.json": pkg("@scope/root"),
        "packages/a/package.json": pkg("@scope/a"),
        "packages/fifth/package.json": pkg("@scope/fifth"),
      });

      expect(discoverPublishedPackages(dir).map((p) => p.name)).toContain("@scope/fifth");
    });

    it("picks up a package under a newly added glob", () => {
      // The reason the globs are read rather than hard-coded.
      const dir = tree({
        "pnpm-workspace.yaml": 'packages:\n  - "packages/*"\n  - "apps/*"\n',
        "package.json": pkg("@scope/root"),
        "apps/thing/package.json": pkg("@scope/thing"),
      });

      expect(discoverPublishedPackages(dir).map((p) => p.name)).toContain("@scope/thing");
    });

    it("does not list the root twice when a glob also matches it", () => {
      const dir = tree({
        "pnpm-workspace.yaml": 'packages:\n  - "."\n',
        "package.json": pkg("@scope/root"),
      });

      expect(discoverPublishedPackages(dir).map((p) => p.name)).toEqual(["@scope/root"]);
    });
  });
});

/**
 * The export map has several legal shapes and only one is a flat `{condition: string}` object.
 * The previous walk assumed that one: a string shorthand was iterated character by character and
 * asserted on a file named `p`, and nested conditions handed `path.join` an object. Both failed
 * closed, so nothing shipped — but both pointed away from the cause.
 */
describe("collectManifestTargets", () => {
  const labels = (manifest: Record<string, unknown>) =>
    collectManifestTargets(manifest).map(([label]) => label);
  const targets = (manifest: Record<string, unknown>) =>
    collectManifestTargets(manifest).map(([, target]) => target);

  it("collects main, module and types", () => {
    const manifest = { main: "./a.cjs", module: "./a.mjs", types: "./a.d.ts" };

    expect(collectManifestTargets(manifest)).toEqual([
      ["main", "./a.cjs"],
      ["module", "./a.mjs"],
      ["types", "./a.d.ts"],
    ]);
  });

  it("walks a flat condition map, bracketing subpaths and dotting conditions", () => {
    const manifest = { exports: { "./core": { types: "./c.d.ts", import: "./c.mjs" } } };

    expect(collectManifestTargets(manifest)).toEqual([
      ['exports["./core"].types', "./c.d.ts"],
      ['exports["./core"].import', "./c.mjs"],
    ]);
  });

  it("handles a string shorthand instead of iterating it character by character", () => {
    const manifest = { exports: { "./package.json": "./package.json" } };

    expect(collectManifestTargets(manifest)).toEqual([
      ['exports["./package.json"]', "./package.json"],
    ]);
  });

  it("handles a bare string export map", () => {
    expect(collectManifestTargets({ exports: "./dist/index.js" })).toEqual([
      ["exports", "./dist/index.js"],
    ]);
  });

  it("descends into nested conditions", () => {
    const manifest = {
      exports: { ".": { node: { import: "./n.mjs", require: "./n.cjs" }, default: "./d.mjs" } },
    };

    expect(collectManifestTargets(manifest)).toEqual([
      ['exports["."].node.import', "./n.mjs"],
      ['exports["."].node.require', "./n.cjs"],
      ['exports["."].default', "./d.mjs"],
    ]);
  });

  it("descends into array fallbacks, labelling by index", () => {
    const manifest = { exports: { "./x": [{ import: "./a.mjs" }, "./b.cjs"] } };

    expect(collectManifestTargets(manifest)).toEqual([
      ['exports["./x"].0.import', "./a.mjs"],
      ['exports["./x"].1', "./b.cjs"],
    ]);
  });

  it("ignores a null export, which blocks a subpath deliberately", () => {
    expect(collectManifestTargets({ exports: { "./blocked": null } })).toEqual([]);
  });

  it("collects typesVersions targets", () => {
    const manifest = { typesVersions: { "*": { core: ["dist/core.d.ts"] } } };

    expect(collectManifestTargets(manifest)).toEqual([
      ["typesVersions.*.core.0", "dist/core.d.ts"],
    ]);
  });

  it("returns nothing for a manifest that promises nothing", () => {
    expect(collectManifestTargets({ name: "x", version: "1.0.0" })).toEqual([]);
  });

  it("never yields a non-string target, whatever the shape", () => {
    // The property that matters: every target reaches path.join, so an object here is a crash.
    const manifest = {
      exports: { ".": { node: { import: "./a.mjs" } }, "./s": "./b.mjs", "./n": null },
      typesVersions: { "*": { core: ["c.d.ts"] } },
    };

    for (const target of targets(manifest)) expect(typeof target).toBe("string");
    expect(labels(manifest).length).toBe(3);
  });
});

describe("prepublishOnly invariants", () => {
  const ROOT = "/repo";
  const GUARD = path.join(ROOT, "scripts/ci/require-release-tag.mjs");

  describe("runsReleaseGuard", () => {
    it("accepts the root form", () => {
      expect(
        runsReleaseGuard("node scripts/ci/require-release-tag.mjs && tsup", ROOT, GUARD)
      ).toBe(true);
    });

    it("accepts the leaf form", () => {
      expect(
        runsReleaseGuard(
          "node ../../scripts/ci/require-release-tag.mjs && pnpm run build",
          path.join(ROOT, "packages/core"),
          GUARD
        )
      ).toBe(true);
    });

    /**
     * The counter-example a suffix match waves through: from `packages/core` this resolves to
     * `packages/core/scripts/…`, which does not exist, so the publish breaks at release time.
     */
    it("rejects a path that suffix-matches but resolves inside the package", () => {
      expect(
        runsReleaseGuard(
          "node scripts/ci/require-release-tag.mjs && pnpm run build",
          path.join(ROOT, "packages/core"),
          GUARD
        )
      ).toBe(false);
    });

    it.each([undefined, "", "pnpm run build", "node other-script.mjs"])(
      "rejects %p",
      (script) => {
        expect(runsReleaseGuard(script, path.join(ROOT, "packages/core"), GUARD)).toBe(false);
      }
    );
  });

  describe("runsBuild", () => {
    it.each(["tsup", "node guard.mjs && tsup", "node guard.mjs && pnpm run build"])(
      "accepts %p",
      (script) => {
        expect(runsBuild(script)).toBe(true);
      }
    );

    it.each([undefined, "", "node guard.mjs", "echo building"])("rejects %p", (script) => {
      // A substring test for "build" would pass the last one.
      expect(runsBuild(script)).toBe(false);
    });
  });
});
