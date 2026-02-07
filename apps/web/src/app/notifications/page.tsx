'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { AppHeader, dispatchNotificationsUpdated } from '@app/components/AppHeader'
import { useGlobalAlert } from '@app/components/GlobalAlert'
import { getNotifications, type Notification } from '@app/services/notificationService'
import { acceptInvitation, declineInvitation } from '@app/services/invitationService'
import { getRoleLabel } from '@app/utils/roleUtils'
import { formatDate } from '@app/utils/dateUtils'
import { getCurrentUserCompanies } from '@app/services/userService'
import type { CompanyInvitationData } from '@app/services/notificationService'

function isCompanyInvitation(data: Record<string, unknown>): data is CompanyInvitationData {
  return (
    typeof data.invitationId === 'string' &&
    typeof data.companyName === 'string' &&
    typeof data.role === 'string' &&
    typeof data.inviterName === 'string'
  )
}

export default function NotificationsPage() {
  const { showError, showSuccess } = useGlobalAlert()
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const list = await getNotifications()
      setNotifications(list)
      dispatchNotificationsUpdated()
    } catch (error) {
      showError((error as Error).message || 'Error al cargar notificaciones')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleAccept = useCallback(
    async (invitationId: string) => {
      try {
        setActionLoadingId(invitationId)
        await acceptInvitation(invitationId)
        showSuccess('Invitación aceptada. Ya eres miembro de la organización.')
        await fetchNotifications()
        await getCurrentUserCompanies() // Refresh companies list in case user navigates to dashboard
      } catch (error) {
        showError((error as Error).message || 'Error al aceptar la invitación')
      } finally {
        setActionLoadingId(null)
      }
    },
    [showSuccess, showError, fetchNotifications]
  )

  const handleDecline = useCallback(
    async (invitationId: string) => {
      try {
        setActionLoadingId(invitationId)
        await declineInvitation(invitationId)
        showSuccess('Invitación rechazada.')
        await fetchNotifications()
      } catch (error) {
        showError((error as Error).message || 'Error al rechazar la invitación')
      } finally {
        setActionLoadingId(null)
      }
    },
    [showSuccess, showError, fetchNotifications]
  )

  const invitationNotifications = notifications.filter((n) => n.type === 'company_invitation')
  const otherNotifications = notifications.filter((n) => n.type !== 'company_invitation')

  return (
    <Box>
      <AppHeader />
      <Box
        component="main"
        sx={{
          pt: 8,
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <NotificationsIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Notificaciones
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Invitaciones a organizaciones y otras notificaciones
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No tienes notificaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cuando recibas una invitación a una organización o otras notificaciones, aparecerán aquí.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {invitationNotifications.map((notification) => {
                const data = notification.data
                if (!isCompanyInvitation(data)) return null

                const loadingThis = actionLoadingId === data.invitationId

                return (
                  <Card
                    key={notification.id}
                    variant="outlined"
                    sx={{
                      borderLeft: 4,
                      borderLeftColor: notification.read ? 'divider' : 'primary.main',
                      backgroundColor: notification.read ? 'action.hover' : 'background.paper',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <BusinessIcon color="primary" sx={{ mt: 0.5 }} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Invitación a organización
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            <strong>{data.inviterName}</strong> te ha invitado a unirte a{' '}
                            <strong>{data.companyName}</strong> como{' '}
                            <strong>{getRoleLabel(data.role)}</strong>.
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {formatDate(notification.createdAt)}
                          </Typography>
                          {!notification.read && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={loadingThis ? null : <CheckCircleIcon />}
                                onClick={() => handleAccept(data.invitationId)}
                                disabled={loadingThis}
                                sx={{ textTransform: 'none' }}
                              >
                                {loadingThis ? 'Procesando...' : 'Aceptar'}
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={loadingThis ? null : <CancelIcon />}
                                onClick={() => handleDecline(data.invitationId)}
                                disabled={loadingThis}
                                sx={{ textTransform: 'none' }}
                              >
                                Rechazar
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}

              {otherNotifications.length > 0 && (
                <>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                    Otras notificaciones
                  </Typography>
                  {otherNotifications.map((n) => (
                    <Card key={n.id} variant="outlined">
                      <CardContent>
                        <Typography variant="body2">{n.type}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(n.createdAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}
