'use client'

import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '@app/theme'
import { GlobalAlertProvider, GlobalAlert } from '@app/components/GlobalAlert'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalAlertProvider>
        {children}
        <GlobalAlert />
      </GlobalAlertProvider>
    </ThemeProvider>
  )
}
