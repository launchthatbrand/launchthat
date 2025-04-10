import type { ThemeDefinition } from "@acme/theme-system";

// Import preview image
import previewUrl from "./assets/preview.png";

const brutalistTheme: ThemeDefinition = {
  id: "brutalist",
  name: "Brutalist",
  description:
    "Bold, raw design with high contrast, sharp edges, and minimal decoration.",
  preview: {
    strategy: "static",
    asset: previewUrl,
  },
  variables: {
    // These would normally be extracted from the CSS
    "--card-bg": "#f5f5f5",
    "--card-border": "2px solid #000",
    "--card-shadow": "none",
    // ...more variables
  },
};

export default brutalistTheme;
