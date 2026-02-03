'use client'

import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '@app/theme'
import { GlobalAlertProvider, GlobalAlert } from '@app/components/GlobalAlert'
import { AuthProvider } from '@app/contexts/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalAlertProvider>
        <AuthProvider>
          {children}
          <GlobalAlert />
        </AuthProvider>
      </GlobalAlertProvider>
    </ThemeProvider>
  )
}
