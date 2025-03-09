export type ThemeStyle =
  | "glass"
  | "brutalist"
  | "aggressive"
  | "retro"
  | "cyberpunk"
  | "minimal"
  | "terminal"
  | "handwritten"
  | "tradingview"
  | "monday";

export interface ThemeConfig {
  label: string;
  value: ThemeStyle;
  icon?: string;
  description?: string;
  className: string;
}

export const themes: ThemeConfig[] = [
  {
    label: "Glass",
    value: "glass",
    description: "Modern, translucent design with smooth effects",
    className: "theme-glass",
  },
  {
    label: "Brutalist",
    value: "brutalist",
    description: "Raw, bold design with sharp edges",
    className: "theme-brutalist",
  },
  {
    label: "Aggressive",
    value: "aggressive",
    description: "Dynamic, energetic design with bold colors",
    className: "theme-aggressive",
  },
  {
    label: "Retro",
    value: "retro",
    description: "Nostalgic 80s/90s style with pixel art elements",
    className: "theme-retro",
  },
  {
    label: "Cyberpunk",
    value: "cyberpunk",
    description: "Futuristic neon aesthetic with glitch effects",
    className: "theme-cyberpunk",
  },
  {
    label: "Minimal",
    value: "minimal",
    description: "Clean, distraction-free design with subtle interactions",
    className: "theme-minimal",
  },
  {
    label: "Terminal",
    value: "terminal",
    description: "Classic command-line interface inspired design",
    className: "theme-terminal",
  },
  {
    label: "Handwritten",
    value: "handwritten",
    description: "Organic, sketch-like design with natural animations",
    className: "theme-handwritten",
  },
  {
    label: "TradingView",
    value: "tradingview",
    description:
      "Professional financial interface with crisp data visualization",
    className: "theme-tradingview",
  },
  {
    label: "Monday",
    value: "monday",
    description:
      "Colorful, modern project management interface with rounded elements",
    className: "monday",
  },
];

// Helper functions
export function getThemeClassName(style: ThemeStyle): string {
  const theme = themes.find((t) => t.value === style);
  if (!theme) {
    console.warn(`Theme "${style}" not found, falling back to default theme`);
    return themes[0]?.className ?? "theme-glass";
  }
  return theme.className;
}

export function getAllThemeClassNames(): string[] {
  return themes.map((theme) => theme.className);
}
