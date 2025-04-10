# ThemeSystem Implementation Plan

## Overview

This document outlines the implementation plan for our modular ThemeSystem, which will provide consistent theming capabilities across all applications in our monorepo. The system will support:

1. **Base Themes** - Light/dark/system mode support
2. **Theme Library** - Visual styles (glass, brutalist, etc.)
3. **Extensions** - App-specific theme templates (e.g., resume templates)

## Architecture

The ThemeSystem will follow a layered architecture:

```
ThemeSystem
├── Core Provider (manages state, loads config)
├── Theme Components (toggle, drawer, selectors)
│   ├── ThemeToggle (positioned bottom-right)
│   └── ThemeDrawer (with theme previews)
├── Theme Styles
│   ├── Base Variables (light/dark foundation)
│   ├── Theme Library (glass, brutalist, etc.)
│   └── Extensions (app-specific styles)
└── Configuration (theme.config.ts)
```

## Implementation Steps

### Phase 1: Foundation - Theme Provider and Configuration

- [x] **1.1 Create theme config structure**
  - Definition of theme configuration structure in TypeScript
  - Explanation: Using a TypeScript configuration file gives us type safety while maintaining flexibility, similar to Payload CMS's approach

```tsx
// src/config/theme.config.ts
export default {
  baseThemes: ["light", "dark", "system"],
  themeLibrary: [
    {
      id: "glass",
      name: "Glass",
      preview: "/themes/glass-preview.png",
      description: "Clean, minimal glass-like interface",
    },
    // Other themes...
  ],
  extensions: {
    // Extension definitions
  },
  permissions: {
    baseTheme: "user", // 'user', 'admin', 'none'
    themeLibrary: "admin", // Who can change the global theme
    extensions: "user", // Who can use extensions
  },
  defaultTheme: "system",
  defaultStyle: "glass",
};
```

- [x] **1.2 Create ThemeProvider component**
  - Enhanced version of the current BaseProvider
  - Explanation: We build upon the existing BaseProvider to maintain compatibility while adding new features

```tsx
// src/providers/ThemeProvider.tsx
// Enhanced provider that reads from theme.config.ts
```

- [x] **1.3 Create theme context and hooks**
  - Define TypeScript interfaces and create hooks for accessing theme state
  - Explanation: Hooks provide a clean API for components to interact with the theme system

```tsx
// src/hooks/useTheme.ts
// Extended hook with more functionality than the current useTheme
```

### Phase 2: CSS Structure and Theme Library

- [x] **2.1 Define CSS variable structure**
  - Create consistent naming conventions for CSS variables
  - Explanation: Consistent naming makes themes easier to create and maintain

```css
/* Base variables structure */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* Other base variables */
}
```

- [x] **2.2 Create layered CSS architecture**
  - Use `@layer` directives for proper CSS cascade
  - Explanation: Layers help control specificity and prevent CSS conflicts

```css
@layer base {
  /* Base variables */
}

@layer themes {
  /* Theme overrides */
}

@layer extensions {
  /* Extension-specific styles */
}
```

- [x] **2.3 Refactor existing themes (glass, brutalist, etc.)**

  - Update existing theme CSS to follow new convention
  - Explanation: Standardizing the existing themes ensures consistency moving forward

- [x] **2.4 Configure Tailwind integration**
  - Update tailwind.config.ts to use theme CSS variables
  - Explanation: This allows us to use Tailwind's utility classes with our theme variables

```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        // Other color mappings
      },
    },
  },
};
```

### Phase 3: Core UI Components

- [x] **3.1 Create enhanced ThemeToggle component**
  - Implement toggle positioned absolutely in bottom-right
  - Use ToggleGroup for light/dark/system selection
  - Explanation: The toggle should be easily accessible but not intrusive

```tsx
// src/components/ThemeToggle.tsx
// Enhanced version of the current toggle
```

- [x] **3.2 Create ThemeDrawer component**
  - Implement drawer that slides up from bottom (40% of screen)
  - Explanation: A drawer provides more space for theme previews while being unobtrusive

```tsx
// src/components/ThemeDrawer.tsx
// New component for theme selection
```

- [x] **3.3 Create ThemePreview component**
  - Visual preview cards for themes in a carousel
  - Explanation: Visual previews make it easier for users to choose themes

```tsx
// src/components/ThemePreview.tsx
// Theme preview cards
```

- [x] **3.4 Implement permission controls**
  - Show/hide UI elements based on configured permissions
  - Explanation: Different users should have different theming capabilities (e.g., admin vs regular user)

### Phase 4: Extensions System

- [ ] **4.1 Design extension registration API**
  - Create system for apps to register theme extensions
  - Explanation: Registration allows extensions to integrate with the core theme system

```tsx
// src/extensions/registerExtension.ts
// API for registering extensions
```

- [ ] **4.2 Implement extension hooks**
  - Create hooks for extensions to interact with theme system
  - Explanation: Extensions need an API to get/set their theme state

```tsx
// src/hooks/useThemeExtension.ts
// Extension-specific hook
```

- [ ] **4.3 Create example extension (ResumeBuilder)**
  - Implement a sample extension to prove the concept
  - Explanation: A real-world example helps validate our design

```tsx
// examples/ResumeExtension.tsx
// Example implementation
```

### Phase 5: Integration and Packaging

- [ ] **5.1 Create single entry point for package**
  - Consolidate exports into index.ts
  - Explanation: A clean API makes the package easier to use

```tsx
// src/index.ts
// Export all public components/hooks
```

- [ ] **5.2 Document API and usage examples**

  - Create README and usage examples
  - Explanation: Documentation ensures developers can use the system correctly

- [ ] **5.3 Prepare for monorepo integration**
  - Configure package.json and tsconfig.json
  - Explanation: Proper configuration ensures the package works within the monorepo

## CSS Layering Strategy

We've chosen a layered approach to CSS to ensure proper cascade and specificity:

1. **Base Layer**: Default CSS variables in `:root`
2. **Theme Layer**: Theme-specific overrides (`.theme-glass`, etc.)
3. **Mode Layer**: Light/dark mode overrides
4. **Extension Layer**: App-specific theme extensions

This approach allows themes and extensions to be **decoupled** - changing the main theme doesn't require redefining all extension templates, and vice versa. This substantially reduces maintenance overhead and allows both systems to evolve independently.

## Design Decisions

### Why Use CSS Variables?

CSS variables provide a clean way to define themeable properties that can be changed at runtime. They're widely supported and work well with Tailwind.

### Why Separate Extensions from Themes?

By keeping extensions separate from the main theme library, we avoid having to define each extension for each theme combination (e.g., glass + modern resume, brutalist + modern resume, etc.). This significantly reduces maintenance overhead.

### Why Use a Configuration File?

A TypeScript configuration file provides a clear structure for theme definitions while maintaining type safety. This approach is similar to Payload CMS and provides a familiar pattern for developers.

### Why Position the Toggle Absolutely?

Positioning the toggle absolutely in the bottom-right ensures it's always accessible without disrupting the page layout. This is particularly important for a theme system that might be used across multiple applications.

## Usage Examples

### Basic Usage

```tsx
// Wrap your app with the ThemeProvider
import { ThemeProvider } from "@acme/theme-system";

import themeConfig from "./theme.config";

export default function App({ children }) {
  return <ThemeProvider config={themeConfig}>{children}</ThemeProvider>;
}
```

### Using Theme Hooks

```tsx
// Access theme in a component
import { useTheme } from "@acme/theme-system";

function MyComponent() {
  const { theme, setTheme, isDarkMode } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("glass")}>Switch to Glass Theme</button>
    </div>
  );
}
```

### Using Extensions

```tsx
// Access extension themes
import { useThemeExtension } from "@acme/theme-system";

function ResumeEditor() {
  const { templates, currentTemplate, setTemplate } =
    useThemeExtension("resumeBuilder");

  return (
    <div className={`resume-template-${currentTemplate}`}>
      <select onChange={(e) => setTemplate(e.target.value)}>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      {/* Resume content */}
    </div>
  );
}
```
