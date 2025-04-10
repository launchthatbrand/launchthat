#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const THEMES = ["glass", "brutalist", "aggressive", "minimal"];
const BASE_URL = "http://localhost:3000";
const VIEWPORT = { width: 1200, height: 800 };
const WAIT_TIME = 2000; // ms to wait for theme to fully load
const THEME_URL = (theme: string) => `${BASE_URL}/themes?preview=${theme}`;
const SCREENSHOT_DIR = path.join(__dirname, "..", "public", "theme-previews");

// Ensure the screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Main function
async function captureThemePreviews(): Promise<void> {
  console.log("Launching browser to capture theme previews...");

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
  });
  const page = await context.newPage();

  try {
    // Process each theme
    for (const theme of THEMES) {
      console.log(`Capturing preview for ${theme} theme...`);

      // Navigate to the theme page
      await page.goto(THEME_URL(theme));

      // Wait for the theme to fully load and apply styles
      await page.waitForTimeout(WAIT_TIME);

      // Find and click on the theme card
      const themeCard = await page
        .locator(`[data-theme-id="${theme}"]`)
        .first();
      if ((await themeCard.count()) > 0) {
        await themeCard.click();

        // Wait for theme to apply
        await page.waitForTimeout(WAIT_TIME);

        // Take the screenshot
        const screenshotPath = path.join(SCREENSHOT_DIR, `${theme}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`✓ Saved screenshot to ${screenshotPath}`);
      } else {
        console.warn(`Theme card for "${theme}" not found on the page`);
      }
    }
  } catch (error) {
    console.error("Error during screenshot capture:", error);
  } finally {
    // Clean up
    await browser.close();
    console.log("Browser closed. Capture process complete.");
  }
}

// Check if the app is running before proceeding
async function checkAppIsRunning(): Promise<boolean> {
  try {
    const response = await fetch(BASE_URL);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  console.log("Checking if the app is running...");

  const isRunning = await checkAppIsRunning();
  if (!isRunning) {
    console.error(
      "The app does not appear to be running. Please start it with `pnpm dev` before running this script.",
    );
    process.exit(1);
  }

  await captureThemePreviews();
})().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
