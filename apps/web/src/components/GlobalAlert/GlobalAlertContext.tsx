'use client'

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react'

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success'

export interface Alert {
  id: string
  message: string
  severity: AlertSeverity
  duration?: number // Duration in milliseconds, undefined means no auto-dismiss
}

interface GlobalAlertContextType {
  alerts: Alert[]
  showAlert: (message: string, severity?: AlertSeverity, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  removeAlert: (id: string) => void
  clearAlerts: () => void
}

const GlobalAlertContext = createContext<GlobalAlertContextType | undefined>(undefined)

export function GlobalAlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current.clear()
    }
  }, [])

  const removeAlert = useCallback((id: string) => {
    // Clear timeout if exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }

    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const showAlert = useCallback(
    (message: string, severity: AlertSeverity = 'info', duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`
      const newAlert: Alert = {
        id,
        message,
        severity,
        duration,
      }

      setAlerts((prev) => [...prev, newAlert])

      // Auto-dismiss if duration is provided
      if (duration !== undefined && duration > 0) {
        const timeout = setTimeout(() => {
          removeAlert(id)
        }, duration)
        timeoutsRef.current.set(id, timeout)
      }
    },
    [removeAlert]
  )

  const showError = useCallback(
    (message: string, duration?: number) => {
      showAlert(message, 'error', duration)
    },
    [showAlert]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showAlert(message, 'success', duration)
    },
    [showAlert]
  )

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showAlert(message, 'warning', duration)
    },
    [showAlert]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showAlert(message, 'info', duration)
    },
    [showAlert]
  )

  const clearAlerts = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current.clear()
    setAlerts([])
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<GlobalAlertContextType>(
    () => ({
      alerts,
      showAlert,
      showError,
      showSuccess,
      showWarning,
      showInfo,
      removeAlert,
      clearAlerts,
    }),
    [alerts, showAlert, showError, showSuccess, showWarning, showInfo, removeAlert, clearAlerts]
  )

  return (
    <GlobalAlertContext.Provider value={contextValue}>
      {children}
    </GlobalAlertContext.Provider>
  )
}

export function useGlobalAlert() {
  const context = useContext(GlobalAlertContext)
  if (context === undefined) {
    throw new Error('useGlobalAlert must be used within a GlobalAlertProvider')
  }
  return context
}
