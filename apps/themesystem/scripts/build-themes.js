#!/usr/bin/env node
/**
 * Theme Package Builder
 *
 * This script builds all theme packages in the packages directory
 * It runs the build script for each package and generates previews
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";

// Get current file directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CLI options
const program = new Command();
program
  .option("--theme <theme>", "Build a specific theme package")
  .option("--all", "Build all theme packages (default)")
  .parse(process.argv);

const options = program.opts();

// Path to packages directory
const packagesDir = path.resolve(__dirname, "../packages");

// Get all theme packages
const getThemePackages = () => {
  return fs
    .readdirSync(packagesDir)
    .filter((dir) => dir.startsWith("theme-"))
    .map((dir) => ({
      name: dir,
      path: path.join(packagesDir, dir),
    }));
};

// Build a single package
const buildPackage = (packagePath, packageName) => {
  console.log(`Building ${packageName}...`);

  try {
    // Install dependencies
    console.log(`Installing dependencies for ${packageName}...`);
    execSync("pnpm install", { cwd: packagePath, stdio: "inherit" });

    // Build the package
    console.log(`Running build script for ${packageName}...`);
    execSync("pnpm build", { cwd: packagePath, stdio: "inherit" });

    console.log(`✅ Successfully built ${packageName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build ${packageName}:`, error.message);
    return false;
  }
};

// Main function
const buildThemes = () => {
  console.log("Theme Package Builder");
  console.log("--------------------");

  const packages = getThemePackages();

  if (packages.length === 0) {
    console.log("No theme packages found.");
    return;
  }

  console.log(`Found ${packages.length} theme packages.`);

  // Filter packages if a specific theme was specified
  const packagesToProcess = options.theme
    ? packages.filter((pkg) => pkg.name === `theme-${options.theme}`)
    : packages;

  if (packagesToProcess.length === 0) {
    console.error(`Theme package "theme-${options.theme}" not found.`);
    return;
  }

  // Build each package
  const results = packagesToProcess.map((pkg) => ({
    name: pkg.name,
    success: buildPackage(pkg.path, pkg.name),
  }));

  // Summary
  console.log("\nBuild Summary:");
  console.log("-------------");

  const successCount = results.filter((r) => r.success).length;

  results.forEach((result) => {
    console.log(
      `${result.name}: ${result.success ? "✅ Success" : "❌ Failed"}`,
    );
  });

  console.log(
    `\n${successCount}/${results.length} packages built successfully.`,
  );
};

// Execute
buildThemes();
