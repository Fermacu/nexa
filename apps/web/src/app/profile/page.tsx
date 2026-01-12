'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material'
import { useGlobalAlert } from '@app/components/GlobalAlert'
import { AppHeader } from '@app/components/AppHeader'
import type { User, CompanyMembership } from '@app/types'
import { getRoleLabel, getRoleColor } from '@app/utils/roleUtils'
import { formatDate } from '@app/utils/dateUtils'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </Box>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { showError, showSuccess } = useGlobalAlert()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [companies, setCompanies] = useState<CompanyMembership[]>([])
  
  // Form states for personal info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data - replace with actual API response
        const mockUser: User = {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+1 (555) 123-4567',
          createdAt: '2024-01-15T10:30:00Z',
        }

        const mockCompanies: CompanyMembership[] = [
          {
            companyId: '1',
            companyName: 'Tech Solutions Inc.',
            role: 'admin',
            joinedAt: '2024-01-15T10:30:00Z',
            company: {
              id: '1',
              name: 'Tech Solutions Inc.',
              email: 'contact@techsolutions.com',
              phone: '+1 (555) 123-4567',
              address: {
                street: 'Av. Reforma 123',
                city: 'Ciudad de México',
                state: 'Ciudad de México',
                postalCode: '06600',
                country: 'México',
              },
              website: 'https://www.techsolutions.com',
              description: 'Empresa líder en soluciones tecnológicas innovadoras',
              industry: 'Tecnología',
              createdAt: '2024-01-15T10:30:00Z',
            },
          },
          {
            companyId: '2',
            companyName: 'Digital Agency',
            role: 'member',
            joinedAt: '2024-02-20T14:15:00Z',
            company: {
              id: '2',
              name: 'Digital Agency',
              email: 'info@digitalagency.com',
              phone: '+1 (555) 987-6543',
              address: {
                street: 'Calle Libertad 456',
                city: 'Guadalajara',
                state: 'Jalisco',
                postalCode: '44100',
                country: 'México',
              },
              website: 'https://www.digitalagency.com',
              description: 'Agencia digital especializada en marketing y diseño',
              industry: 'Marketing',
              createdAt: '2024-02-20T14:15:00Z',
            },
          },
        ]

        setUser(mockUser)
        setCompanies(mockCompanies)
        setFormData({
          name: mockUser.name,
          email: mockUser.email,
          phone: mockUser.phone || '',
        })
      } catch (error) {
        const apiError = error as { message?: string }
        showError(apiError.message || 'Error al cargar la información del usuario')
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [showError])

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }, [])

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSavePersonalInfo = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Saving personal info:', formData)
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess('Información personal actualizada correctamente')
    } catch (error) {
      const apiError = error as { message?: string }
      showError(apiError.message || 'Error al actualizar la información personal')
    }
  }, [formData, showSuccess, showError])

  const handleRequestPasswordRecovery = useCallback(async () => {
    if (!user?.email) return

    try {
      // TODO: Replace with actual API call
      console.log('Requesting password recovery for:', user.email)
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico')
    } catch (error) {
      const apiError = error as { message?: string }
      showError(apiError.message || 'Error al solicitar recuperación de contraseña')
    }
  }, [user?.email, showSuccess, showError])

  const handleResetForm = useCallback(() => {
    if (!user) return
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    })
  }, [user])

  if (loading) {
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
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography>Cargando...</Typography>
          </Container>
        </Box>
      </Box>
    )
  }

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
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Page Header */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Mi Perfil
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona tu información personal y configuraciones
              </Typography>
            </Grid>

            {/* Tabs Navigation */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                      },
                    }}
                  >
                    <Tab
                      icon={<PersonIcon />}
                      iconPosition="start"
                      label="Información Personal"
                      id="profile-tab-0"
                      aria-controls="profile-tabpanel-0"
                    />
                    <Tab
                      icon={<BusinessIcon />}
                      iconPosition="start"
                      label="Organizaciones"
                      id="profile-tab-1"
                      aria-controls="profile-tabpanel-1"
                    />
                    <Tab
                      icon={<LockIcon />}
                      iconPosition="start"
                      label="Seguridad"
                      id="profile-tab-2"
                      aria-controls="profile-tabpanel-2"
                    />
                  </Tabs>
                </Box>

                <CardContent>
                  {/* Personal Info Tab */}
                  <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Información Personal
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Actualiza tu información personal y de contacto
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Nombre completo"
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon sx={{ color: 'text.secondary' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Correo electrónico"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon sx={{ color: 'text.secondary' }} />
                              </InputAdornment>
                            ),
                          }}
                          helperText="Este correo se usa para iniciar sesión"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Teléfono"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleFormChange('phone', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: 'text.secondary' }} />
                              </InputAdornment>
                            ),
                          }}
                          helperText="Opcional, se usa para recuperación de cuenta"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2 }}>
                          <CalendarIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Miembro desde
                            </Typography>
                            <Typography variant="body1">
                              {user ? formatDate(user.createdAt) : '-'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                          <Button variant="outlined" onClick={handleResetForm}>
                            Cancelar
                          </Button>
                          <Button variant="contained" onClick={handleSavePersonalInfo}>
                            Guardar cambios
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Organizations Tab */}
                  <TabPanel value={tabValue} index={1}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Mis Organizaciones
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Organizaciones donde eres miembro
                        </Typography>
                      </Grid>

                      {companies.length === 0 ? (
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              No estás registrado en ninguna organización
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => router.push('/auth')}
                              sx={{ mt: 2 }}
                            >
                              Crear organización
                            </Button>
                          </Box>
                        </Grid>
                      ) : (
                        companies.map((company) => (
                          <Grid size={{ xs: 12, md: 6 }} key={company.companyId}>
                            <Card variant="outlined">
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                      {company.companyName}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={getRoleLabel(company.role)}
                                    color={getRoleColor(company.role)}
                                    size="small"
                                  />
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Miembro desde: {formatDate(company.joinedAt)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </TabPanel>

                  {/* Security Tab */}
                  <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          Seguridad y Contraseña
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Gestiona la seguridad de tu cuenta
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <LockIcon color="primary" />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                  Recuperar Contraseña
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Si olvidaste tu contraseña, podemos enviarte un enlace de recuperación a tu correo electrónico
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              variant="outlined"
                              onClick={handleRequestPasswordRecovery}
                              sx={{ mt: 2 }}
                            >
                              Enviar enlace de recuperación
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <EmailIcon color="primary" />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                  Correo electrónico actual
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {user?.email || '-'}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              El enlace de recuperación se enviará a este correo
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
