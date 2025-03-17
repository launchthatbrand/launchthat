// This file registers TypeScript path aliases for Node.js runtime
// It's useful for development mode or scripts
const { resolve } = require("path");
const tsConfigPaths = require("tsconfig-paths");

// Load tsconfig.json
const tsConfig = require("../tsconfig.json");

// Register paths
tsConfigPaths.register({
  baseUrl: resolve(__dirname, ".."),
  paths: tsConfig.compilerOptions.paths,
});
