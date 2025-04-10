/**
 * Script to generate gradient preview images for themes
 * Usage: pnpm tsx scripts/generate-gradient-previews.ts
 */

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Define paths
const THEMES_DIR = path.resolve(__dirname, "../packages");
const OUTPUT_DIR = path.resolve(__dirname, "../public/previews/generated");

// Configuration for preview images
const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 450;
const DEFAULT_COLORS = ["#1a1a1a", "#3a3a3a"]; // Default dark colors if theme doesn't define any

interface ThemeConfig {
  id: string;
  name: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    accent?: string;
  };
}

/**
 * Extracts theme configuration from package.json
 */
async function getThemeConfigs(): Promise<ThemeConfig[]> {
  const themes: ThemeConfig[] = [];

  try {
    // Get all directories in the packages folder that start with 'theme-'
    const entries = await fs.readdir(THEMES_DIR);
    const themeDirs = entries.filter((entry) => entry.startsWith("theme-"));

    for (const dir of themeDirs) {
      try {
        const packageJsonPath = path.join(THEMES_DIR, dir, "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
        const packageJson = JSON.parse(packageJsonContent);

        // Extract theme data from package.json
        if (packageJson.themeConfig) {
          themes.push({
            id: dir.replace("theme-", ""),
            name: packageJson.themeConfig.name || packageJson.name,
            colors: packageJson.themeConfig.colors || {},
          });
        }
      } catch (err) {
        console.error(`Error processing ${dir}:`, err);
      }
    }
  } catch (err) {
    console.error("Error reading themes directory:", err);
  }

  return themes;
}

/**
 * Generates an SVG with a gradient based on the theme's colors
 */
function generateGradientSvg(colors: string[]): string {
  return `
    <svg width="${PREVIEW_WIDTH}" height="${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          ${colors
            .map(
              (color, index) =>
                `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}" />`,
            )
            .join("")}
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
      <rect 
        x="30" 
        y="30" 
        width="${PREVIEW_WIDTH - 60}" 
        height="${PREVIEW_HEIGHT - 60}" 
        fill="none" 
        stroke="rgba(255,255,255,0.3)" 
        stroke-width="2" 
        rx="8" 
      />
    </svg>
  `;
}

/**
 * Extracts colors from a theme configuration
 */
function getThemeColors(theme: ThemeConfig): string[] {
  const colors = [];

  if (theme.colors) {
    // Add colors in priority order
    if (theme.colors.primary) colors.push(theme.colors.primary);
    if (theme.colors.secondary) colors.push(theme.colors.secondary);
    if (theme.colors.accent) colors.push(theme.colors.accent);
    if (theme.colors.background) colors.push(theme.colors.background);
  }

  // If we don't have at least 2 colors, use defaults
  if (colors.length < 2) {
    return DEFAULT_COLORS;
  }

  // If we have too many colors, limit to the most important ones
  if (colors.length > 4) {
    return colors.slice(0, 4);
  }

  return colors;
}

/**
 * Generates a preview image for a theme
 */
async function generatePreviewForTheme(theme: ThemeConfig): Promise<void> {
  const outputFilePath = path.join(OUTPUT_DIR, `${theme.id}-gradient.png`);

  // Get colors from theme or use defaults
  const themeColors = getThemeColors(theme);

  // Generate SVG with gradient
  const svgContent = generateGradientSvg(themeColors);

  try {
    // Convert SVG to PNG using sharp
    await sharp(Buffer.from(svgContent)).png().toFile(outputFilePath);

    console.log(`✅ Generated preview for ${theme.name} (${theme.id})`);
  } catch (err) {
    console.error(`❌ Failed to generate preview for ${theme.id}:`, err);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get theme configurations
    const themes = await getThemeConfigs();

    if (themes.length === 0) {
      console.log("No themes found");
      return;
    }

    console.log(`Found ${themes.length} themes. Generating previews...`);

    // Generate previews for all themes
    for (const theme of themes) {
      await generatePreviewForTheme(theme);
    }

    console.log("✨ All previews generated successfully");
  } catch (err) {
    console.error("Error generating previews:", err);
    process.exit(1);
  }
}

// Run the script
main();
