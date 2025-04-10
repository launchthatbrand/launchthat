# ACME Theme System

A flexible, extensible, and developer-friendly theme system for React applications.

## Features

- 🎨 Multiple ready-to-use themes (Glass, Brutalist, Aggressive, Minimal)
- 🔌 Plugin-based architecture for custom themes
- 🌓 Built-in dark mode support
- 📱 Responsive design across devices
- ♿ Accessibility focused
- 🛠️ Developer tools for theme creation

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see the theme system in action.

## Theme Development

We now provide a template theme package you can use as a starting point for building custom themes:

```bash
# Copy the template
cp -r packages/theme-template packages/theme-mytheme

# Follow the instructions in the README.md file inside theme-mytheme
```

The theme template includes:

- Basic structure for theme packages
- CSS variables for light and dark modes
- Preview generation tools
- Documentation on customizing and integrating your theme

For more detailed guidance, see the following resources in the theme template:

- `README.md` - Step-by-step guide to using the template
- `CHEATSHEET.md` - Quick reference for theme development
- `INTEGRATION.md` - Detailed guide on integrating with the theme system

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate-previews` - Generate theme previews
- `pnpm capture-theme-previews` - Generate screenshots of themes
- `pnpm build-themes` - Build all theme packages

## Documentation

For more details on using and customizing the theme system, see the `docs` directory.
