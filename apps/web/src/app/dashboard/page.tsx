'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'
import { useGlobalAlert } from '@app/components/GlobalAlert'
import { AppHeader } from '@app/components/AppHeader'
import type { CompanyMembership } from '@app/types'
import { getRoleLabel, getRoleColor } from '@app/utils/roleUtils'
import { formatDate } from '@app/utils/dateUtils'

export default function DashboardPage() {
  const router = useRouter()
  const { showError } = useGlobalAlert()
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<CompanyMembership[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data - replace with actual API response
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

        setCompanies(mockCompanies)
        // Select first company by default
        if (mockCompanies.length > 0) {
          setSelectedCompanyId(mockCompanies[0].companyId)
        }
      } catch (error) {
        const apiError = error as { message?: string }
        showError(apiError.message || 'Error al cargar la información')
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [showError])

  const handleCompanyChange = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId)
  }, [])

  const selectedCompany = useMemo(
    () => companies.find((c) => c.companyId === selectedCompanyId),
    [companies, selectedCompanyId]
  )

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

  if (companies.length === 0) {
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
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No tienes organizaciones
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Crea una organización para comenzar a gestionar tu empresa
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/auth')}
              >
                Crear organización
              </Button>
            </Box>
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
          pt: 8, // Padding top to account for fixed AppBar (64px + 16px)
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Page Header */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Organización
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Selecciona y gestiona tu organización
              </Typography>
            </Grid>

            {/* Company Selector */}
            {companies.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel id="company-select-label">Seleccionar organización</InputLabel>
                      <Select
                        labelId="company-select-label"
                        id="company-select"
                        value={selectedCompanyId}
                        label="Seleccionar organización"
                        onChange={(e) => handleCompanyChange(e.target.value)}
                      >
                        {companies.map((company) => (
                          <MenuItem key={company.companyId} value={company.companyId}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <BusinessIcon sx={{ color: 'primary.main' }} />
                              <Typography sx={{ flex: 1 }}>{company.companyName}</Typography>
                              <Chip
                                label={getRoleLabel(company.role)}
                                color={getRoleColor(company.role)}
                                size="small"
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            )}

        {/* Selected Company Information */}
        {selectedCompany && (
          <>
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                    <Box>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                        {selectedCompany.companyName}
                      </Typography>
                      <Chip
                        label={getRoleLabel(selectedCompany.role)}
                        color={getRoleColor(selectedCompany.role)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={3}>
                    {/* Contact Information */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Información de contacto
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                          <EmailIcon color="action" sx={{ mt: 0.5 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Correo electrónico
                            </Typography>
                            <Typography variant="body1">{selectedCompany.company.email}</Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                          <PhoneIcon color="action" sx={{ mt: 0.5 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Teléfono
                            </Typography>
                            <Typography variant="body1">{selectedCompany.company.phone}</Typography>
                          </Box>
                        </Box>

                        {selectedCompany.company.website && (
                          <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                            <LanguageIcon color="action" sx={{ mt: 0.5 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Sitio web
                              </Typography>
                              <Typography variant="body1">
                                <a
                                  href={selectedCompany.company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                  {selectedCompany.company.website}
                                </a>
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Address Information */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Dirección
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <LocationIcon color="action" sx={{ mt: 0.5 }} />
                        <Box>
                          <Typography variant="body1">
                            {selectedCompany.company.address.street}
                          </Typography>
                          <Typography variant="body1">
                            {selectedCompany.company.address.city}, {selectedCompany.company.address.state}
                          </Typography>
                          <Typography variant="body1">
                            {selectedCompany.company.address.postalCode}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 0.5 }}>
                            {selectedCompany.company.address.country}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Additional Information */}
                    {(selectedCompany.company.description || selectedCompany.company.industry) && (
                      <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                          Información adicional
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {selectedCompany.company.industry && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Industria
                              </Typography>
                              <Typography variant="body1">{selectedCompany.company.industry}</Typography>
                            </Box>
                          )}

                          {selectedCompany.company.description && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                <DescriptionIcon sx={{ fontSize: 16 }} />
                                Descripción
                              </Typography>
                              <Typography variant="body1">{selectedCompany.company.description}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Membership Information */}
                    <Grid size={{ xs: 12 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="caption" color="text.secondary">
                        Miembro desde: {formatDate(selectedCompany.joinedAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
