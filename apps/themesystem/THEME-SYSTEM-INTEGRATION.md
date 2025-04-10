# ACME Theme System Integration

This document outlines how we integrated the `@acme/theme-system` package into the ThemeSystem application.

## Changes Made

1. **Package Integration**

   - Linked `@acme/theme-system` using PNPM workspaces
   - Removed local implementation code that is now redundant

2. **Component Updates**

   - Replaced `ThemeProvider` with the one from `@acme/theme-system`
   - Replaced `ThemeToggle` with `ThemeSelector`
   - Updated theme card components to use `ThemePreview`
   - Created a simple theme preview page at `/theme-preview` for generating previews

3. **CSS Migration**

   - Centralized all theme CSS imports in the theme system package
   - Added a main `styles/index.css` file in the theme system that imports all theme styles
   - Updated the app to import only from the theme system package
   - Added theme component styling within the theme system

4. **Theme Definition**
   - Added proper theme definitions in `layout.tsx`
   - Defined theme variables directly in the theme configuration

## Project Structure

The application's current structure is as follows:

```
apps/themesystem/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Main layout with ThemeProvider
│   │   ├── page.tsx          # Home page with theme showcases
│   │   ├── themes/           # Theme selection page
│   │   │   └── page.tsx      # Updated to use new theme components
│   │   └── theme-preview/    # Theme preview page for generating previews
│   │       └── page.tsx
│   └── styles/               # Application styles (legacy)
└── packages/                 # Theme packages
    ├── theme-system/         # Core theme system
    │   ├── src/
    │   │   ├── components/   # Theme components
    │   │   ├── providers/    # Theme providers
    │   │   └── styles/       # Theme CSS files
    │   │       ├── base.css  # Base theme variables
    │   │       └── index.css # Main CSS file that imports all themes
    ├── theme-glass/          # Glass theme package
    ├── theme-brutalist/      # Brutalist theme package
    ├── theme-aggressive/     # Aggressive theme package
    └── theme-minimal/        # Minimal theme package
```

## Configuration

The theme system is now configured in `layout.tsx` using the following structure:

```tsx
<ThemeProvider
  config={{
    themes: [
      {
        id: "glass",
        name: "Glass",
        description: "Clean, minimal glass-like interface",
        preview: "/previews/static/glass.png",
        variables: {
          // Theme variables
        },
      },
      // Other themes...
    ],
    defaultTheme: "system",
    defaultStyle: "glass",
    permissions: {
      baseTheme: "user",
      themeLibrary: "user",
      extensions: "user",
    },
  }}
  initialDebugMode={true}
>
  {...}
</ThemeProvider>
```

## CSS Structure

The CSS implementation now follows a centralized approach:

1. **Theme System Package**:

   - `src/styles/index.css` imports all theme-specific CSS
   - Individual theme packages provide their CSS files
   - Component-specific styling is included in the theme system

2. **Application**:
   - `globals.css` imports only from the theme system package
   - Application-specific overrides remain in the globals.css

## Theme Previews

Previews are now generated using the theme preview component:

```tsx
<ThemePreview themeId="glass" width={300} height={80} showFallback={true} />
```

## Remaining Tasks

Here are the remaining tasks to fully replace the local implementation:

1. **Refine Theme Preview Page**: Enhance the `/theme-preview` page for more comprehensive theme previews
2. **Update Remaining Pages**: Update other pages to use the new theme system
3. **Organize Theme Packages**: Structure theme packages to be more consistent
4. **Performance Testing**: Test performance with the new theme system
5. **Documentation**: Create comprehensive documentation for the new system

## Notes for Development

- Debug mode is enabled (`initialDebugMode={true}`) to help with troubleshooting
- Theme packages should include proper theme definitions and CSS
- Make sure to update the base CSS variables when adding new themes
