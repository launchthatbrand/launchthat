import type { ThemeDefinition } from "@acme/theme-system";

// Import preview image
import previewUrl from "./assets/preview.png";

const glassTheme: ThemeDefinition = {
  id: "glass",
  name: "Glass",
  description:
    "Clean, minimal interface with subtle transparency effects and soft shadows.",
  preview: {
    strategy: "static",
    asset: previewUrl,
  },
  variables: {
    // These would normally be extracted from the CSS
    "--card-bg": "hsla(0, 0%, 100%, 0.8)",
    "--card-border": "1px solid hsla(0, 0%, 100%, 0.5)",
    "--card-shadow": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    // ...more variables
  },
};

export default glassTheme;
