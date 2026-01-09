# Style Guide

This document defines the design system, styling rules, and visual guidelines for the NEXA project.

## Typography

### Font Family

**Primary Font: Inter**

- **Source**: Google Fonts (loaded via Next.js font optimization)
- **CSS Variable**: `--font-inter`
- **Usage**: Used throughout the entire application
- **Fallback**: `Inter, sans-serif`

The Inter font is configured in `/src/app/layout.tsx` and applied globally via the Material-UI theme.

### Font Weights

- **Headings (h1-h4)**: `600` (Semi-bold)
- **Body Text (body1, body2)**: `400` (Regular)
- **Buttons**: `500` (Medium)

### Typography Variants

Material-UI typography variants are configured as follows:

```typescript
h1, h2, h3, h4: fontWeight: 600
body1, body2: fontWeight: 400
button: fontWeight: 500, textTransform: 'none'
```

**Note**: Buttons use `textTransform: 'none'` to preserve original casing.

## Colors

### Color Palette

The application uses Material-UI's theming system with the following color definitions:

#### Primary Color
- **Main**: `#1976d2` (Blue)
- **Usage**: Primary actions, links, important elements

#### Secondary Color
- **Main**: `#dc004e` (Pink/Red)
- **Usage**: Secondary actions, accents

#### Theme Mode
- **Current Mode**: `light`
- **Support**: Dark mode can be configured by changing `mode` in `palette.ts`

### Color Usage Guidelines

1. **Use theme colors** - Always reference colors from the theme palette
2. **Avoid hardcoded colors** - Use `theme.palette.primary.main` instead of `#1976d2`
3. **Maintain contrast** - Ensure text meets WCAG contrast requirements
4. **Consistent application** - Use primary for main actions, secondary for accents

### Accessing Colors in Code

**In Material-UI Components:**
```tsx
<Button color="primary">Click me</Button>
<Typography color="primary.main">Text</Typography>
```

**In Custom Components:**
```tsx
import { useTheme } from '@mui/material/styles'

const theme = useTheme()
const primaryColor = theme.palette.primary.main
```

**In CSS Modules:**
```css
/* Use CSS variables or theme values */
color: var(--mui-palette-primary-main);
```

## Spacing

Material-UI uses an 8px base spacing unit. Use the theme's spacing function:

```tsx
import { useTheme } from '@mui/material/styles'

const theme = useTheme()
const spacing = theme.spacing(2) // 16px
```

Common spacing values:
- `theme.spacing(1)` = 8px
- `theme.spacing(2)` = 16px
- `theme.spacing(3)` = 24px
- `theme.spacing(4)` = 32px

## Components

### Material-UI Components

The project uses Material-UI v7 as the primary component library. All Material-UI components automatically inherit theme colors, typography, and spacing.

### Custom Component Styling

Custom component overrides are defined in `/src/theme/components.ts`. This is where you can customize Material-UI component defaults.

**Example:**
```typescript
export const components: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
}
```

## CSS Modules

For component-specific styles, use CSS Modules:

1. Create a `.module.css` file alongside your component
2. Import and use classes: `import styles from './component.module.css'`
3. Apply classes: `<div className={styles.container}>`

**Benefits:**
- Scoped styles (no conflicts)
- TypeScript support
- Easy to maintain

## Global Styles

Global styles are defined in `/src/app/globals.css`. This file should contain:

- CSS resets
- Base element styles
- CSS custom properties (variables)
- Utility classes (if needed)

**Current global styles:**
- Color scheme variables (light/dark mode)
- Base body styles
- Font smoothing
- Box-sizing reset

## Responsive Design

### Breakpoints

Material-UI provides default breakpoints:
- `xs`: 0px
- `sm`: 600px
- `md`: 900px
- `lg`: 1200px
- `xl`: 1536px

### Usage

```tsx
import { useMediaQuery, useTheme } from '@mui/material'

const theme = useTheme()
const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
```

## Dark Mode

Dark mode is currently configured but not active. To enable:

1. Update `palette.ts` to set `mode: 'dark'`
2. Or implement a theme toggle using Material-UI's theme switching

## Best Practices

### ✅ Do

- Use Material-UI theme values for colors, spacing, and typography
- Follow the established typography scale
- Use CSS Modules for component-specific styles
- Maintain consistent spacing using theme.spacing()
- Test components in both light and dark modes (when implemented)

### ❌ Don't

- Hardcode colors, fonts, or spacing values
- Mix different styling approaches unnecessarily
- Create global CSS classes that conflict with Material-UI
- Use inline styles for theme values
- Override Material-UI styles without using the theme system

## Theme Customization

To customize the theme:

1. **Colors**: Edit `/src/theme/palette.ts`
2. **Typography**: Edit `/src/theme/typography.ts`
3. **Components**: Edit `/src/theme/components.ts`
4. **Composition**: Edit `/src/theme/index.ts` if adding new theme sections

Changes are automatically applied via the `ThemeProvider` in `providers.tsx`.

## Resources

- [Material-UI Documentation](https://mui.com/)
- [Material-UI Theming](https://mui.com/material-ui/customization/theming/)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Inter Font](https://fonts.google.com/specimen/Inter)
