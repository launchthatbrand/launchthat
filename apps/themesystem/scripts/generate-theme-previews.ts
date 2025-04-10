#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import required libraries
try {
  // These will be dynamically imported
  const { default: sharp } = await import("sharp");

  const ROOT_DIR = path.resolve(__dirname, "..");
  const PUBLIC_DIR = path.join(ROOT_DIR, "public", "theme-previews");
  const PACKAGES_DIR = path.join(ROOT_DIR, "packages");

  // Ensure output directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Fix SVG gradient if needed
  function fixSvgGradient(svgContent: string): string {
    // Fix malformed gradient in SVG files
    let fixed = svgContent;

    // Fix linear-gradient as stop color (common issue in our SVGs)
    fixed = fixed.replace(
      /stop-color="linear-gradient\([^"]*"/g,
      'stop-color="#4dabf7"',
    );

    // Add missing offset attributes to stops
    fixed = fixed.replace(/<stop\s+(?!offset)/g, '<stop offset="0%" ');

    // Fix any other malformed gradient definitions
    fixed = fixed.replace(
      /stop-color="([^"]*)linear-gradient\([^"]*"/g,
      'stop-color="#4dabf7"',
    );

    // Replace empty or invalid stop colors
    fixed = fixed.replace(/stop-color="[\s]*"/g, 'stop-color="#a5d8ff"');

    return fixed;
  }

  // Process each theme
  async function processTheme(themeName: string): Promise<void> {
    console.log(`\nProcessing theme: ${themeName}`);

    const themePath = path.join(PACKAGES_DIR, `theme-${themeName}`);
    const srcAssetsPath = path.join(themePath, "src", "assets");
    const svgPath = path.join(srcAssetsPath, "preview.svg");

    // Skip if SVG doesn't exist
    if (!fs.existsSync(svgPath)) {
      console.log(`No preview.svg found for ${themeName}, skipping...`);
      return;
    }

    const pngOutputPath = path.join(PUBLIC_DIR, `${themeName}.png`);
    const pngAssetPath = path.join(themePath, "src", "assets", "preview.png");
    const indexPath = path.join(themePath, "src", "index.ts");

    // Read and fix SVG content
    const svgContent = fs.readFileSync(svgPath, "utf8");
    const fixedSvgContent = fixSvgGradient(svgContent);

    // Create a temporary fixed SVG file
    const tmpSvgPath = path.join(
      themePath,
      "src",
      "assets",
      "_preview_fixed.svg",
    );
    fs.writeFileSync(tmpSvgPath, fixedSvgContent);

    try {
      // Convert to PNG using sharp and save to public dir
      await sharp(tmpSvgPath).resize(600, 400).png().toFile(pngOutputPath);

      // Also save a copy to the theme's assets directory
      await sharp(tmpSvgPath).resize(600, 400).png().toFile(pngAssetPath);

      console.log(`✓ Generated preview for ${themeName} theme`);

      // Update the theme's index.ts file to ensure it's using the correct URL
      if (fs.existsSync(indexPath)) {
        const existingIndexContent = fs.readFileSync(indexPath, "utf-8");

        // Update the theme index.ts file to use the PNG preview
        const importLine = `import previewImg from './assets/preview.png';`;
        let updatedIndexContent = existingIndexContent;

        if (
          existingIndexContent.includes(
            "import previewImg from './assets/preview.",
          )
        ) {
          // Replace existing import statement
          updatedIndexContent = existingIndexContent.replace(
            /import previewImg from '\.\/assets\/preview\.[^']+';/,
            importLine,
          );
        } else {
          // Add new import statement at the top
          updatedIndexContent = `${importLine}\n${existingIndexContent}`;
        }

        // Update preview property to use the imported image
        const previewRegex = /preview:\s*[^,}]+/;
        const previewMatch = previewRegex.exec(existingIndexContent);
        if (previewMatch?.[0]) {
          updatedIndexContent = updatedIndexContent.replace(
            previewRegex,
            `preview: {
    strategy: "static",
    asset: "/theme-previews/${themeName}.png"
  }`,
          );
        }

        // Write the updated index.ts file
        fs.writeFileSync(indexPath, updatedIndexContent);

        console.log(`✅ Updated ${themeName} theme to use PNG preview`);
      }

      // Clean up temporary file
      if (fs.existsSync(tmpSvgPath)) {
        fs.unlinkSync(tmpSvgPath);
      }
    } catch (err) {
      console.error(
        `Error generating PNG for ${themeName}:`,
        err instanceof Error ? err.message : String(err),
      );
      // Clean up temporary file if it exists
      if (fs.existsSync(tmpSvgPath)) {
        fs.unlinkSync(tmpSvgPath);
      }
    }
  }

  // Main function to process all themes or a specific theme
  async function generatePreviews(): Promise<void> {
    // Check if a theme name was provided as an argument
    const themesToProcess =
      process.argv.length > 2 && process.argv[2]
        ? [process.argv[2]] // Use the first argument as theme name
        : fs
            .readdirSync(PACKAGES_DIR)
            .filter((dir) => dir.startsWith("theme-"))
            .map((dir) => dir.replace("theme-", "")); // Process all themes if no argument provided

    console.log(`Generating theme previews for: ${themesToProcess.join(", ")}`);

    // Process each theme
    for (const theme of themesToProcess) {
      await processTheme(theme);
    }

    console.log(`\nPreviews saved to: ${PUBLIC_DIR}`);
    console.log(`\nPNGs have also been added to each theme's assets directory`);
  }

  // Run the main function
  generatePreviews().catch((error: unknown) => {
    const err = error instanceof Error ? error.message : String(error);
    console.error("Error in preview generation:", err);
    process.exit(1);
  });
} catch (err) {
  const error = err instanceof Error ? err.message : String(err);
  console.error(
    "Missing required dependencies. Please install:\n  npm install sharp\n\nError details:",
    error,
  );
  process.exit(1);
}
