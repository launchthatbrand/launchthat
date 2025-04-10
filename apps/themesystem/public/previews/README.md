# Theme Previews

This directory contains preview images for all themes in the ACME Theme System.

## Directory Structure

- `/static/` - Contains manually created preview images
- `/generated/` - Contains automatically generated preview images (gradients, component screenshots, etc.)

## Naming Conventions

- Static previews: `{themeId}.png` (e.g., `glass.png`)
- Generated gradient previews: `{themeId}-gradient.png` (e.g., `minimal-gradient.png`)
- Component previews: `{themeId}-component.png` (e.g., `brutalist-component.png`)

## Preview Generation

The system supports multiple preview types:

1. **Manual previews**: Custom-designed PNG files placed in the `/static/` directory
2. **Gradient previews**: Automatically generated based on theme colors
3. **Component previews**: Generated from component screenshots with theme applied

## Usage in Code

These previews are accessed through the `StaticPreviewProvider` which uses the following logic:

1. If a theme defines a static preview URL, use that
2. If no preview is defined, generate a gradient preview URL: `/previews/generated/{themeId}-gradient.png`

## Adding New Theme Previews

When creating a new theme:

1. If you have a custom preview image, place it in `/static/{themeId}.png`
2. If not, the system will automatically generate a gradient preview

For the best user experience, it's recommended to provide custom preview images whenever possible.
