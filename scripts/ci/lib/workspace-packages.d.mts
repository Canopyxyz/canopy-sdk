/**
 * Types for `workspace-packages.mjs`.
 *
 * The helper is plain ESM because `scripts/` is not part of the TypeScript build — it runs
 * straight off disk in CI. This declaration exists so `tests/workspace-packages.test.ts` gets
 * real type checking instead of a blanket `@ts-expect-error`, which would also suppress genuine
 * mistakes in those tests.
 */

export interface DiscoveredPackage {
  name: string;
  dir: string;
  manifest: Record<string, unknown>;
}

/** `prepublishOnly` segments that count as a build. */
export const BUILD_COMMANDS: ReadonlySet<string>;

/** Globs from the `packages:` block of `pnpm-workspace.yaml`. Throws on an empty parse. */
export function workspaceGlobs(rootDir: string): string[];

/** Expands `dir/*` or a literal path. Throws on any other pattern shape. */
export function expandGlob(rootDir: string, glob: string): string[];

/** The root plus every workspace package whose manifest is not `private`. */
export function discoverPublishedPackages(rootDir: string): DiscoveredPackage[];

/** Every file path a manifest promises, as `[label, target]` pairs. */
export function collectManifestTargets(
  manifest: Record<string, unknown>
): Array<[string, string]>;

/** Splits a `prepublishOnly` script on `&&`, trimmed. */
export function scriptSegments(script: string | undefined): string[];

/** Whether the script runs the guard at `guardPath`, resolved against `packageDir`. */
export function runsReleaseGuard(
  script: string | undefined,
  packageDir: string,
  guardPath: string
): boolean;

/** Whether the script contains a segment that is itself a build command. */
export function runsBuild(script: string | undefined): boolean;
