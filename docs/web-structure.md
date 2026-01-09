# Web Application Structure

This document outlines the structure and organization of the `/nexa/apps/web` Next.js application.

## Overview

The web application is built with:
- **Next.js 16.1.1** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Material-UI (MUI) 7.3.7** for component library and theming
- **Emotion** for CSS-in-JS styling

## Directory Structure

```
apps/web/
├── public/              # Static assets (images, icons, etc.)
├── src/
│   ├── app/            # Next.js App Router directory
│   │   ├── favicon.ico
│   │   ├── globals.css  # Global CSS styles
│   │   ├── layout.tsx   # Root layout component
│   │   ├── page.tsx     # Home page component
│   │   ├── page.module.css  # Page-specific CSS modules
│   │   └── providers.tsx    # Client-side providers (Theme, etc.)
│   └── theme/          # Material-UI theme configuration
│       ├── index.ts     # Theme export and composition
│       ├── palette.ts   # Color palette definitions
│       ├── typography.ts # Typography configuration
│       └── components.ts # Component style overrides
├── eslint.config.mjs    # ESLint configuration
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Key Files

### `/src/app/layout.tsx`
- Root layout component for the Next.js App Router
- Configures Inter font using Next.js font optimization
- Wraps the application with client-side providers
- Sets up the HTML structure and language

### `/src/app/providers.tsx`
- Client component that provides Material-UI theme context
- Wraps children with `ThemeProvider` and `CssBaseline`
- Must be a client component (`'use client'`) to use React Context

### `/src/app/page.tsx`
- Home page component
- Demonstrates usage of Material-UI components
- Uses CSS modules for styling

### `/src/theme/`
Theme configuration directory following Material-UI best practices:

- **`index.ts`**: Main theme file that combines palette, typography, and components
- **`palette.ts`**: Color definitions (primary, secondary, mode, etc.)
- **`typography.ts`**: Font family, weights, and text styling rules
- **`components.ts`**: Custom overrides for Material-UI components

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@app/*` → `./src/*`

Example:
```typescript
import { theme } from '@app/theme'
import { Providers } from '@app/providers'
```

## Styling Approach

The application uses a hybrid styling approach:

1. **Material-UI Theme**: Primary styling system for components
   - Colors, typography, spacing defined in `/src/theme/`
   - Applied via `ThemeProvider` in `providers.tsx`

2. **CSS Modules**: For page-specific styles
   - Files like `page.module.css` for component-scoped styles
   - Prevents style conflicts

3. **Global CSS**: For base styles and resets
   - `globals.css` for global styles and CSS variables

## Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Adding New Features

### Adding a New Page
1. Create a new file in `/src/app/` (e.g., `about/page.tsx`)
2. Export a default React component
3. Optionally add a CSS module file (e.g., `about/page.module.css`)

### Adding Theme Customizations
1. Edit the appropriate file in `/src/theme/`
2. For colors: modify `palette.ts`
3. For typography: modify `typography.ts`
4. For component styles: modify `components.ts`
5. The theme is automatically applied via `ThemeProvider`

### Adding New Components
1. Create component files in an appropriate directory (e.g., `/src/components/`)
2. Use Material-UI components when possible for consistency
3. Import theme values using `useTheme()` hook or `theme` object

## Best Practices

1. **Use Material-UI components** when possible for consistency
2. **Follow the theme system** - avoid hardcoding colors or fonts
3. **Use TypeScript** - all files should be `.ts` or `.tsx`
4. **Keep components focused** - single responsibility principle
5. **Use path aliases** (`@app/*`) for imports from `/src/`
6. **Separate concerns** - keep styling, logic, and presentation separate
