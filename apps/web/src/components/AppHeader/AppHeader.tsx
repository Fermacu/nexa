'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
} from '@mui/icons-material'

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const isProfile = pathname === '/profile'

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
            onClick={() => router.push('/dashboard')}
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

        {/* Right side - User menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="end"
            aria-label="account"
            sx={{
              color: isProfile ? 'primary.main' : 'text.primary',
            }}
            onClick={() => router.push('/profile')}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
