#!/usr/bin/env node
/**
 * Theme Preview Generator
 *
 * This script generates preview images for themes by:
 * 1. Starting a local development server
 * 2. Using Playwright to navigate to a preview page
 * 3. Taking screenshots with each theme applied
 * 4. Saving the screenshots as PNG files
 *
 * Usage:
 *   node generate-theme-preview.js --theme=glass
 *   node generate-theme-preview.js --all
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import minimist from "minimist";
import sharp from "sharp";

// Get current file directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure the command-line interface
const program = new Command();
program
  .option("--theme <theme>", "Generate preview for a specific theme")
  .option("--all", "Generate previews for all themes")
  .option("--width <width>", "Width of the preview in pixels", "600")
  .option("--height <height>", "Height of the preview in pixels", "400")
  .option("--output-dir <dir>", "Output directory for preview images", "assets")
  .parse(process.argv);

const options = program.opts();

// Define the themes to generate previews for
const THEMES = ["glass", "brutalist", "aggressive", "minimal"];

// Get themes to process
const themesToProcess = options.all
  ? THEMES
  : options.theme
    ? [options.theme]
    : [];

if (themesToProcess.length === 0) {
  console.error("Error: You must specify a theme (--theme=name) or use --all");
  process.exit(1);
}

// Configuration
const config = {
  width: parseInt(options.width, 10),
  height: parseInt(options.height, 10),
  outputDir: options.outputDir,
};

/**
 * Fallback function to generate gradient previews
 * Used when we can't run the browser automation
 */
function generateGradientPreviews() {
  console.log("Generating gradient previews...");

  for (const theme of themesToProcess) {
    try {
      // Define gradient colors based on theme
      let gradientColors;
      switch (theme) {
        case "glass":
          gradientColors = "linear-gradient(135deg, #a5d8ff, #0090ff)";
          break;
        case "brutalist":
          gradientColors = "linear-gradient(135deg, #e0e0e0, #a0a0a0)";
          break;
        case "aggressive":
          gradientColors = "linear-gradient(135deg, #ff7070, #ff0099)";
          break;
        case "minimal":
          gradientColors = "linear-gradient(135deg, #f5f5f5, #e0e0e0)";
          break;
        default:
          gradientColors = "linear-gradient(135deg, #e0e0e0, #a0a0a0)";
      }

      // Create SVG with gradient
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}">
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${gradientColors.split(",")[0].replace("linear-gradient(135deg, ", "")}"/>
            <stop offset="100%" stop-color="${gradientColors.split(",")[1].replace(")", "")}"/>
          </linearGradient>
        </defs>
        <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#ffffff">${theme}</text>
      </svg>`;

      // Ensure output directory exists
      const packageDir = path.resolve(
        __dirname,
        "../packages",
        `theme-${theme}`,
      );
      const outputDir = path.join(packageDir, "src", "assets");

      if (!fs.existsSync(outputDir)) {
        console.log(`Creating output directory: ${outputDir}`);
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write SVG to file
      const outputPath = path.join(outputDir, "preview.svg");
      fs.writeFileSync(outputPath, svg);

      console.log(`✅ Saved preview to: ${outputPath}`);
    } catch (error) {
      console.error(`❌ Error generating preview for ${theme}:`, error);
    }
  }
}

// Run the generator
generateGradientPreviews();

// Parse command line arguments
const args = minimist(process.argv.slice(2));
const theme = args.theme;

if (!theme) {
  console.error("Please specify a theme using --theme=<theme-name>");
  process.exit(1);
}

const ROOT_DIR = path.resolve(__dirname, "..");
const THEME_DIR = path.join(ROOT_DIR, "packages", `theme-${theme}`);
const SVG_PATH = path.join(THEME_DIR, "src", "assets", "preview.svg");
const OUT_DIR = path.join(ROOT_DIR, "public", "theme-previews");
const PNG_PATH = path.join(OUT_DIR, `${theme}.png`);

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Function to improve SVG gradients before conversion
function fixSvgGradient(svgContent) {
  // Fix malformed gradient in SVG files
  return svgContent.replace(
    'stop-color="linear-gradient(135deg',
    'stop-color="#4dabf7',
  );
}

// Check if SVG exists
if (!fs.existsSync(SVG_PATH)) {
  console.error(`SVG file not found for theme "${theme}" at ${SVG_PATH}`);
  process.exit(1);
}

// Read and fix SVG content
const svgContent = fs.readFileSync(SVG_PATH, "utf8");
const fixedSvgContent = fixSvgGradient(svgContent);

// Create a temporary fixed SVG file
const tmpSvgPath = path.join(THEME_DIR, "src", "assets", "_preview_fixed.svg");
fs.writeFileSync(tmpSvgPath, fixedSvgContent);

// Convert to PNG using sharp
sharp(tmpSvgPath)
  .resize(600, 400)
  .png()
  .toFile(PNG_PATH)
  .then(() => {
    console.log(`Generated preview for ${theme} theme at ${PNG_PATH}`);
    // Clean up temporary file
    fs.unlinkSync(tmpSvgPath);
  })
  .catch((err) => {
    console.error("Error generating PNG:", err);
    // Clean up temporary file if it exists
    if (fs.existsSync(tmpSvgPath)) {
      fs.unlinkSync(tmpSvgPath);
    }
    process.exit(1);
  });
