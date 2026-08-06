# Releasing

Four packages publish, in lockstep, all on the same version:

| package | path |
| --- | --- |
| `@canopyhub/canopy-sdk` | repo root |
| `@canopyhub/canopy-sdk-core` | `packages/core` |
| `@canopyhub/canopy-sdk-bindings` | `packages/bindings` |
| `@canopyhub/canopy-sdk-deployments` | `packages/deployments` |

`packages/sdk` and `examples/react` are `private: true` and never publish.

## Publishing

```bash
pnpm release:next --dry-run   # rehearse; publishes nothing
pnpm release:next             # for real
```

`pnpm publish` on its own is **refused** — see [Why a wrapper](#why-a-wrapper).

The wrapper prints its plan before doing anything: the dist-tag, whether it is a dry run, and
the exact commands it will execute. Read that before letting it proceed. pnpm additionally
refuses to publish from an unclean working tree, so commit or stash first.

## Which dist-tag

**2.0.0 goes to `next`, not `latest`.**

2.0.0 moves `@aptos-labs/ts-sdk` to `peerDependencies` with a `^7.0.0` range. Until canopy-cli
ships its own ts-sdk 7 major, a consumer still on ts-sdk 6 gets one of two bad outcomes from
npm:

- as a direct dependency — `ERESOLVE unable to resolve dependency tree`
- transitively — ts-sdk 7 installed *alongside* 6, which is the duplicate-copy bug 2.0.0 exists
  to remove

pnpm only warns, which is why neither shows up from inside this repo.

**A consequence worth knowing before you plan CLI work:** the CLI cannot adopt 2.0.0's other
fixes — `readMoveU8` accepting JSON numbers, the `fungible_asset::decimals` type argument,
submittable entry payloads — ahead of its own ts-sdk 7 migration. It is one change or nothing.
That is a deliberate cost of the narrow peer range, not an oversight.

### Promoting to `latest`

Once canopy-cli's ts-sdk 7 major has landed, move the tag **per package** — four commands, no
republish:

```bash
npm dist-tag add @canopyhub/canopy-sdk@2.0.0 latest
npm dist-tag add @canopyhub/canopy-sdk-core@2.0.0 latest
npm dist-tag add @canopyhub/canopy-sdk-bindings@2.0.0 latest
npm dist-tag add @canopyhub/canopy-sdk-deployments@2.0.0 latest
```

Releases after that point use `pnpm release:latest`. Nothing in the repo needs editing to
switch — that is the whole reason the tag is not stored in a manifest.

## Why a wrapper

**A guard cannot check the tag that was really used.** pnpm exposes exactly one `npm_config_*`
variable to lifecycle scripts:

```
$ pnpm exec node -e '…Object.keys(process.env).filter(k => k.startsWith("npm_config_"))…'
npm_config_user_agent
```

So `npm_config_tag` is unavailable, and an env-var guard can only prove *intent*.
`CANOPY_RELEASE_TAG=next pnpm publish -r` would satisfy the guard and still publish to
`latest`. The wrapper closes that by deriving both the env var and `--tag` from one validated
value.

`scripts/ci/require-release-tag.mjs` runs as `prepublishOnly` in all four published manifests,
so publishing a single package directly is refused too.

**A release from the wrong branch would look like a success.** pnpm defaults `publish-branch`
to `master|main`; off those branches it prompts, defaults to no, and then **exits 0**:

```
$ CANOPY_RELEASE_TAG=next pnpm publish --tag next --dry-run </dev/null; echo $?
0
```

So nothing publishes and the command reports success — and in CI there is no TTY to answer the
prompt at all. The wrapper checks the branch itself and fails loudly instead. `--allow-branch`
waives it for rehearsals, and also passes `--publish-branch` so the prompt never appears.

## What `pnpm publish -r` covers

All four packages, **including the repo root**. Confirm it rather than trusting it:

```bash
pnpm publish -r --tag next --dry-run --publish-branch "$(git branch --show-current)" \
  | grep '^npm notice name:'
```

Four names must appear. The wrapper prints the expected list before running for this reason.

This is worth stating because the obvious inference from `pnpm-workspace.yaml` is wrong. It
lists only `packages/*` and `examples/*`, and other recursive commands really do skip the root:

```
$ pnpm -r exec node -e 'console.log(process.cwd())'
./examples/react  ./packages/core  ./packages/deployments  ./packages/bindings  ./packages/sdk
                                                                        ^ no repo root
```

`publish` does not behave like `exec` here. An earlier version of the wrapper published the
root separately to "fix" the apparent gap, which would have published it twice — the second
attempt failing on a version conflict after the first had already reached the registry.

### What the guard does not do

It stops accidental publishes, not determined ones — anyone can export `CANOPY_RELEASE_TAG` by
hand. It is a wrong-default guard, not an access control.

### Not a release path

```bash
CANOPY_RELEASE_TAG=next pnpm publish -r    # passes the guard, then publishes to `latest`
```

## Public access

All four manifests now set `publishConfig.access: "public"`. The three sub-packages did not,
which a dry run surfaced — they were packing with `default access`, and scoped packages default
to **restricted**:

```
name: @canopyhub/canopy-sdk               ... with tag next and public access
name: @canopyhub/canopy-sdk-core          ... with tag next and default access
name: @canopyhub/canopy-sdk-deployments   ... with tag next and default access
name: @canopyhub/canopy-sdk-bindings      ... with tag next and default access
```

Worth re-reading that line in the dry-run output before any release: `public access` on all
four. It is the difference between `@canopyhub/canopy-sdk-core` being installable and being
invisible to everyone outside the org.
