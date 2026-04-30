import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "packages/sdk/src/index.ts",
    core: "packages/core/src/index.ts",
    deployments: "packages/deployments/src/index.ts",
    bindings: "packages/bindings/src/index.ts",
  },
  format: ["cjs", "esm"],
  dts: {
    resolve: false,
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  target: "es2020",
  external: ["@moveindustries/ts-sdk"],
  banner: {
    js: "// Canopy SDK",
  },
});
