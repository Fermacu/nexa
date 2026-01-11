import { PaletteOptions } from '@mui/material/styles'

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#ff6b35', // Orange primary color
    light: '#ff8c61',
    dark: '#e55a2b',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#dc004e',
  },
  background: {
    default: '#1e3a8a', // Nice blue background
    paper: '#2563eb', // Slightly lighter blue for paper surfaces
  },
  text: {
    primary: '#ffffff', // White text
    secondary: '#e0e7ff', // Light blue-gray for secondary text
  },
}
