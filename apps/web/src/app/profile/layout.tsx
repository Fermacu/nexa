'use client'

import { RequireAuth } from '@app/components/RequireAuth'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RequireAuth>{children}</RequireAuth>
}
