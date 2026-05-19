import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig({
  entry: { index: "src/index.ts" },
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  esbuildOptions(options) {
    options.alias = {
      "@canopyhub/canopy-sdk-deployments": resolve(__dirname, "../deployments/src/index.ts"),
    };
  },
});
