'use client'

import { useEffect, useState } from 'react'
import { Alert, Stack, Portal } from '@mui/material'
import { useGlobalAlert } from './GlobalAlertContext'

export function GlobalAlert() {
  const { alerts, removeAlert } = useGlobalAlert()
  const [mounted, setMounted] = useState(false)

  // Ensure component only renders on client side (Next.js App Router)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || alerts.length === 0) {
    return null
  }

  return (
    <Portal>
      <Stack
        spacing={2}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          maxWidth: { xs: 'calc(100% - 32px)', sm: 400 },
          pointerEvents: 'none',
          '& > *': {
            pointerEvents: 'auto',
          },
        }}
      >
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            onClose={() => removeAlert(alert.id)}
            severity={alert.severity}
            variant="filled"
            sx={{
              width: '100%',
              boxShadow: 3,
            }}
          >
            {alert.message}
          </Alert>
        ))}
      </Stack>
    </Portal>
  )
}
