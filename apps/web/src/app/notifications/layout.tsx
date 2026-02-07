'use client'

import { RequireAuth } from '@app/components/RequireAuth'

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAuth>{children}</RequireAuth>
}
