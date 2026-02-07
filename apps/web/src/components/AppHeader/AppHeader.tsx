'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useMemo, useCallback, useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import { getUnreadCount } from '@app/services/notificationService'

const NOTIFICATIONS_UPDATED_EVENT = 'nexa-notifications-updated'

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  const isProfile = useMemo(() => pathname === '/profile', [pathname])
  const isNotifications = useMemo(() => pathname === '/notifications', [pathname])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch {
      setUnreadCount(0)
    }
  }, [])

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  useEffect(() => {
    const handleUpdated = () => {
      fetchUnreadCount()
    }
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdated)
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdated)
  }, [fetchUnreadCount])

  const handleHomeClick = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  const handleProfileClick = useCallback(() => {
    router.push('/profile')
  }, [router])

  const handleNotificationsClick = useCallback(() => {
    router.push('/notifications')
  }, [router])

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left side - Logo and Home icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            NEXA
          </Typography>
          <IconButton
            size="small"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Right side - Notifications and User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="large"
            aria-label="notificaciones"
            onClick={handleNotificationsClick}
            sx={{
              color: isNotifications ? 'primary.main' : 'text.primary',
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account"
            sx={{
              color: isProfile ? 'primary.main' : 'text.primary',
            }}
            onClick={handleProfileClick}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export function dispatchNotificationsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT))
  }
}
