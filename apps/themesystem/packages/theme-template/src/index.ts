import type { ThemeDefinition } from "@acme/theme-system";

// Import preview image
import previewUrl from "./assets/preview.png";

const templateTheme: ThemeDefinition = {
  id: "template",
  name: "Template",
  description:
    "A starter template theme that you can customize to create your own unique visual style.",
  preview: {
    strategy: "static",
    asset: previewUrl,
  },
  variables: {
    // These would normally be extracted from the CSS
    "--template-background": "rgba(250, 250, 255, 0.9)",
    "--template-blur": "5px",
    "--template-border": "1px solid rgba(200, 200, 255, 0.3)",
    "--template-shadow": "0 8px 20px rgba(0, 0, 0, 0.1)",
    "--template-radius": "0.5rem",
    // Add more variables as needed
  },
};

export default templateTheme;
