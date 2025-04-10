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

  // Function to improve SVG gradients before conversion
  function fixSvgGradient(svgContent: string): string {
    // Fix malformed gradient in SVG files
    return svgContent.replace(
      'stop-color="linear-gradient(135deg',
      'stop-color="#4dabf7',
    );
  }

  // Process a single theme
  async function processTheme(themeName: string): Promise<void> {
    const themeDir = path.join(PACKAGES_DIR, `theme-${themeName}`);
    const svgPath = path.join(themeDir, "src", "assets", "preview.svg");
    const pngPath = path.join(PUBLIC_DIR, `${themeName}.png`);

    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
      console.error(
        `SVG file not found for theme "${themeName}" at ${svgPath}`,
      );
      return;
    }

    // Read and fix SVG content
    const svgContent = fs.readFileSync(svgPath, "utf8");
    const fixedSvgContent = fixSvgGradient(svgContent);

    // Create a temporary fixed SVG file
    const tmpSvgPath = path.join(
      themeDir,
      "src",
      "assets",
      "_preview_fixed.svg",
    );
    fs.writeFileSync(tmpSvgPath, fixedSvgContent);

    try {
      // Convert to PNG using sharp
      await sharp(tmpSvgPath).resize(600, 400).png().toFile(pngPath);

      console.log(`✓ Generated preview for ${themeName} theme`);

      // Clean up temporary file
      if (fs.existsSync(tmpSvgPath)) {
        fs.unlinkSync(tmpSvgPath);
      }
    } catch (error) {
      console.error(`Error generating PNG for ${themeName}:`, error);
      // Clean up temporary file if it exists
      if (fs.existsSync(tmpSvgPath)) {
        fs.unlinkSync(tmpSvgPath);
      }
    }
  }

  // Main function to process all themes or a specific theme
  async function generatePreviews(): Promise<void> {
    const themesToProcess =
      process.argv.length > 2
        ? [process.argv[2] as string] // Use the first argument as theme name and assert it's a string
        : ["glass", "brutalist", "aggressive"]; // Process all themes if no argument provided

    console.log(`Generating theme previews for: ${themesToProcess.join(", ")}`);

    // Process each theme
    for (const theme of themesToProcess) {
      await processTheme(theme);
    }

    console.log(`\nPreviews saved to: ${PUBLIC_DIR}`);
  }

  // Run the main function
  generatePreviews().catch((error) => {
    console.error("Error in preview generation:", error);
    process.exit(1);
  });
} catch (error) {
  console.error(
    "Missing required dependencies. Please install:\n  npm install sharp",
  );
  process.exit(1);
}
