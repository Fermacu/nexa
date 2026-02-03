'use client'

import { RequireAuth } from '@app/components/RequireAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAuth>{children}</RequireAuth>
}
