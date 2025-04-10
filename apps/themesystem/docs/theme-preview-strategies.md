# Theme Preview Strategies for a Portable Theme System

## Context and Requirements

The theme system is being designed as an NPM package where:

- Users can create custom themes as "plugins"
- The system should be as universal as possible
- Previews need to accurately represent themes
- The solution should be developer-friendly

## Approaches to Theme Previews

### 1. Static Approach: Pre-generated PNG Assets

**Description:**
Themes ship with pre-generated PNG preview images.

**Implementation:**

```typescript
// In theme definition
const myTheme = {
  id: "corporate",
  name: "Corporate",
  preview: "/themes/corporate-preview.png", // Static PNG file
  description: "Professional, subdued design for business applications",
};
```

**Pros:**

- Simple to implement
- No runtime cost
- Predictable result across all environments
- Complete creative control over preview aesthetics

**Cons:**

- Manual work for theme creators
- Preview may not accurately reflect actual implementation
- No interactivity
- No automatic updates if theme changes

**Best For:**
Theme libraries with infrequent updates or where visual fidelity isn't critical.

### 2. Component-Based Approach: Themed UI Samples

**Description:**
Render a collection of themed UI components to a canvas or offscreen DOM.

**Implementation:**

```tsx
// ThemePreviewRenderer.tsx
function ThemePreviewRenderer({ theme, width = 300, height = 200 }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Apply theme temporarily
  useEffect(() => {
    const previewRoot = document.createElement("div");
    previewRoot.className = `theme-${theme.id}`;
    document.body.appendChild(previewRoot);

    // Render components to HTML
    const componentsHtml = renderToString(
      <div>
        <Button variant="primary">Button</Button>
        <Card title="Card Title">Content</Card>
        <Badge>Badge</Badge>
      </div>,
    );
    previewRoot.innerHTML = componentsHtml;

    // Use html2canvas or similar to create image
    html2canvas(previewRoot).then((canvas) => {
      setImageUrl(canvas.toDataURL());
      document.body.removeChild(previewRoot);
    });
  }, [theme]);

  return imageUrl ? (
    <img src={imageUrl} alt={theme.name} />
  ) : (
    <div>Loading...</div>
  );
}
```

**Pros:**

- More accurate representation of actual components
- Can be automated as part of theme creation
- Shows how real UI elements will appear
- Can generate on-demand

**Cons:**

- More complex implementation
- Runtime performance cost
- May require server-side rendering for consistent results
- Potential inconsistencies across different browsers/environments

**Best For:**
Component libraries where accurate representation of styled components is important.

### 3. Dynamic Approach: Live Toggle Preview

**Description:**
Preview the current page or application with different themes applied.

**Implementation:**

```tsx
// ThemePreviewToggle.tsx
function ThemePreviewToggle({ themes, currentTheme, onSelect }) {
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  // Apply preview theme temporarily on hover
  const handleMouseEnter = useCallback((theme) => {
    document.documentElement.dataset.previewTheme = theme.id;
    setPreviewTheme(theme.id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    delete document.documentElement.dataset.previewTheme;
    setPreviewTheme(null);
  }, []);

  // CSS to apply preview theme
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html[data-preview-theme="glass"] { /* glass theme vars */ }
      html[data-preview-theme="brutalist"] { /* brutalist theme vars */ }
      /* ... */
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="theme-previews">
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={theme.id === currentTheme ? "active" : ""}
          onMouseEnter={() => handleMouseEnter(theme)}
          onMouseLeave={handleMouseLeave}
          onClick={() => onSelect(theme.id)}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}
```

**Pros:**

- Most accurate preview - shows the actual UI
- Interactive - users see how UI elements respond
- Leverages existing CSS variables without duplication
- Adapts to any page/scenario automatically

**Cons:**

- Most complex implementation
- Could cause flickering or layout shifts
- Might interfere with current application state
- Requires JavaScript to be functional

**Best For:**
Design/customization tools where immediate visual feedback on the actual UI is critical.

### 4. Iframe-Based Live Preview

**Description:**
Use iframes to render the current page with different themes applied.

**Implementation:**

```tsx
// ThemePreviewIframe.tsx
function ThemePreviewIframe({ themes, currentPage }) {
  return (
    <div className="theme-preview-grid">
      {themes.map((theme) => (
        <div key={theme.id} className="preview-container">
          <h3>{theme.name}</h3>
          <iframe
            src={`${currentPage}?theme=${theme.id}&preview=true`}
            title={`${theme.name} preview`}
            className="theme-preview-frame"
          />
        </div>
      ))}
    </div>
  );
}
```

**Pros:**

- Clean separation between main UI and preview
- Can show multiple theme previews simultaneously
- No risk of CSS leakage between themes
- Shows exact rendering of the page

**Cons:**

- Performance impact of multiple iframes
- Complex state management across frames
- Requires server-side support for theme parameter
- Security considerations with iframe content

**Best For:**
Theme design tools or theme galleries where multiple themes need to be compared simultaneously.

### 5. Hybrid Approach: Static + Dynamic Toggle

**Description:**
Combine static thumbnails for initial display with dynamic preview on hover/interaction.

**Implementation:**

```tsx
// HybridThemePreview.tsx
function HybridThemePreview({ themes, currentTheme, onSelect }) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  useEffect(() => {
    if (hoveredTheme) {
      document.documentElement.dataset.previewTheme = hoveredTheme;
    } else {
      delete document.documentElement.dataset.previewTheme;
    }

    return () => {
      delete document.documentElement.dataset.previewTheme;
    };
  }, [hoveredTheme]);

  return (
    <div className="theme-selector">
      {themes.map((theme) => (
        <div
          key={theme.id}
          className={`theme-option ${theme.id === currentTheme ? "active" : ""}`}
          onMouseEnter={() => setHoveredTheme(theme.id)}
          onMouseLeave={() => setHoveredTheme(null)}
          onClick={() => onSelect(theme.id)}
        >
          {/* Static thumbnail for initial view */}
          <img src={theme.preview} alt={theme.name} />
          <span className="theme-name">{theme.name}</span>
        </div>
      ))}

      {hoveredTheme && (
        <div className="live-preview-indicator">
          Previewing {themes.find((t) => t.id === hoveredTheme)?.name} Theme
        </div>
      )}
    </div>
  );
}
```

**Pros:**

- Best of both worlds - static thumbnails with dynamic preview
- Progressive enhancement - works without JS (basic functionality)
- Performance-friendly initial load
- Engaging UX with hover previews

**Cons:**

- More complex implementation than either approach alone
- Requires maintaining both static and dynamic preview systems
- Potential mismatch between thumbnail and actual appearance
- UI complexity in communicating the preview state

**Best For:**
Production-grade theme systems where both performance and accuracy are important.

## Recommendations for Different Scenarios

### For Theme Package Developers

**Recommended Approach: Component-Based + Automation Tools**

1. **Core Package Features:**

   - Provide a `generateThemePreview()` utility
   - Include standard component template for consistent previews
   - Support both automated and manual preview creation

2. **Automation Script:**
   - Create a CLI tool for theme preview generation
   - Automatically render core components with theme applied
   - Output standard thumbnail sizes

```typescript
// Example usage of CLI tool
// npx generate-theme-preview --theme=./my-theme.css --output=./my-theme-preview.png
```

3. **Documentation:**
   - Clear guidelines for theme authors on preview requirements
   - Templates and examples for creating effective previews

### For Application Developers

**Recommended Approach: Hybrid with User Configuration**

1. **Default Experience:**
   - Use static thumbnails by default for performance
   - Fallback to gradient generation for missing previews
2. **Progressive Enhancement:**

   - Offer opt-in live preview on hover/interaction
   - Allow app developers to customize preview behavior

3. **Configuration Options:**

```typescript
const themeConfig = {
  previewStrategy: "static" | "dynamic" | "hybrid" | "iframe" | "component",
  generateMissingPreviews: boolean,
  previewComponents: [
    /* list of components to show in previews */
  ],
  dynamicPreviewTimeout: number, // ms before applying live preview on hover
};
```

## Creating A Plugin-Friendly System

For a truly extensible theme system as an NPM package, consider this architecture:

1. **Theme Interface Definition:**

```typescript
interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  variables: Record<string, string>;
  preview?:
    | string
    | {
        strategy: "static" | "dynamic" | "component";
        asset?: string;
        components?: string[];
      };
}
```

2. **Preview Provider System:**

```typescript
// Base class
abstract class ThemePreviewProvider {
  abstract generatePreview(theme: ThemeDefinition): Promise<string>;
}

// Implementations
class StaticPreviewProvider extends ThemePreviewProvider {
  /* ... */
}
class ComponentPreviewProvider extends ThemePreviewProvider {
  /* ... */
}
class DynamicPreviewProvider extends ThemePreviewProvider {
  /* ... */
}

// Registry
const previewProviders = {
  static: new StaticPreviewProvider(),
  component: new ComponentPreviewProvider(),
  dynamic: new DynamicPreviewProvider(),
};
```

3. **Plugin Registration:**

```typescript
// Theme system API
themeSystem.registerTheme(myCustomTheme);
themeSystem.registerPreviewProvider("custom", new CustomPreviewProvider());
```

## Conclusion

The ideal approach depends on the specific needs of your theme system:

| Factor          | Recommended Approach            |
| --------------- | ------------------------------- |
| Performance     | Static PNG previews             |
| Accuracy        | Dynamic/Iframe preview          |
| Flexibility     | Component-based with automation |
| Simplicity      | Static with fallback gradients  |
| Plugin-friendly | Hybrid with provider system     |

For most production use cases, a hybrid approach with appropriate developer tooling provides the best balance:

1. **For theme creators:**

   - Automated tools to generate standard previews
   - Well-defined interfaces for custom preview strategies

2. **For end users:**

   - Fast initial load with static thumbnails
   - Interactive live preview on hover/selection
   - Seamless theme transitions

3. **For application developers:**
   - Configuration options to suit app requirements
   - Extensible provider system for custom needs
   - Performance optimizations for production

This creates a system that is both developer-friendly and flexible enough to adapt to different use cases within your NPM package ecosystem.
