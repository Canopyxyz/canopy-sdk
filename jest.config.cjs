module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  moduleNameMapper: {
    "^@canopyhub/canopy-sdk/core$": "<rootDir>/packages/core/src/index.ts",
    "^@canopyhub/canopy-sdk/bindings$": "<rootDir>/packages/bindings/src/index.ts",
    "^@canopyhub/canopy-sdk/deployments$": "<rootDir>/packages/deployments/src/index.ts",
  },
};
