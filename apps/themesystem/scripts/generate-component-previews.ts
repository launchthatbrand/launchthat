/**
 * Script to generate component preview images for themes using Playwright
 * Usage: pnpm tsx scripts/generate-component-previews.ts
 */

import fs from "fs/promises";
import path from "path";

// Use require for Playwright to avoid type issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { chromium } = require("playwright");

// Define paths
const THEMES_DIR = path.resolve(__dirname, "../packages");
const OUTPUT_DIR = path.resolve(__dirname, "../public/previews/generated");

interface ThemeConfig {
  id: string;
  name: string;
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
        const packageJson = JSON.parse(packageJsonContent) as {
          name: string;
          themeConfig?: {
            name?: string;
          };
        };

        // Extract theme data from package.json
        themes.push({
          id: dir.replace("theme-", ""),
          name: packageJson.themeConfig?.name ?? packageJson.name,
        });
      } catch (err) {
        console.error(
          `Error processing ${dir}:`,
          err instanceof Error ? err.message : String(err),
        );
      }
    }
  } catch (err) {
    console.error(
      "Error reading themes directory:",
      err instanceof Error ? err.message : String(err),
    );
  }

  return themes;
}

/**
 * Generates a preview for a specific theme
 */
async function generatePreviewForTheme(
  browser: any,
  theme: ThemeConfig,
): Promise<void> {
  console.log(`Generating preview for theme: ${theme.name} (${theme.id})`);

  let page: any = null;

  try {
    // Create a new page
    page = await browser.newPage();

    // Navigate to the theme preview page with the specific theme
    await page.goto(`http://localhost:3000/theme-preview?theme=${theme.id}`, {
      waitUntil: "networkidle",
    });

    // Wait for the component preview to load
    await page.waitForSelector(".theme-preview-component", { timeout: 5000 });

    // Take a screenshot
    const screenshotPath = path.join(OUTPUT_DIR, `${theme.id}-component.png`);
    await page.screenshot({
      path: screenshotPath,
      type: "png",
    });

    console.log(
      `✅ Generated component preview for ${theme.name} (${theme.id})`,
    );
  } catch (err) {
    console.error(
      `❌ Failed to generate component preview for ${theme.id}:`,
      err instanceof Error ? err.message : String(err),
    );
  } finally {
    if (page) {
      await page.close().catch((error: unknown) => {
        console.error(
          "Error closing page:",
          error instanceof Error ? error.message : String(error),
        );
      });
    }
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  let browser: any = null;

  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Get theme configurations
    const themes = await getThemeConfigs();

    if (themes.length === 0) {
      console.log("No themes found");
      return;
    }

    console.log(
      `Found ${themes.length} themes. Generating component previews...`,
    );
    console.log(
      "Make sure your Next.js app is running on http://localhost:3000",
    );

    // Launch browser
    browser = await chromium.launch();

    // Generate previews for all themes
    for (const theme of themes) {
      await generatePreviewForTheme(browser, theme);
    }

    console.log("✨ All component previews generated successfully");
  } catch (err) {
    console.error(
      "Error generating previews:",
      err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close().catch((error: unknown) => {
        console.error(
          "Error closing browser:",
          error instanceof Error ? error.message : String(error),
        );
      });
    }
  }
}

// Run the script
void main();
