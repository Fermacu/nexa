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
  Drawer,
  IconButton,
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useGlobalAlert } from '@app/components/GlobalAlert'
import { AppHeader } from '@app/components/AppHeader'
import { DynamicForm, FormData } from '@app/components/DynamicForm'
import type { CompanyMembership } from '@app/types'
import { getRoleLabel, getRoleColor } from '@app/utils/roleUtils'
import { formatDate } from '@app/utils/dateUtils'
import {
  companyEditConfig,
  transformCompanyToFormData,
  transformFormDataToCompany,
} from './companyEditConfig'
import { getCurrentUserCompanies } from '@app/services/userService'
import { updateCompany } from '@app/services/companyService'
import type { ApiError } from '@app/services/api'

export default function DashboardPage() {
  const router = useRouter()
  const { showError, showSuccess } = useGlobalAlert()
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<CompanyMembership[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Get user's companies from API
        const companies = await getCurrentUserCompanies()

        setCompanies(companies)
        // Select first company by default
        if (companies.length > 0) {
          setSelectedCompanyId(companies[0].companyId)
        }
      } catch (error) {
        const apiError = error as ApiError
        showError(apiError.message || 'Error al cargar la información')
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCompanyChange = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId)
  }, [])

  const handleOpenDrawer = useCallback(() => {
    setDrawerOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false)
  }, [])

  const selectedCompany = useMemo(
    () => companies.find((c) => c.companyId === selectedCompanyId),
    [companies, selectedCompanyId]
  )

  const isAdmin = useMemo(
    () => selectedCompany?.role === 'admin',
    [selectedCompany?.role]
  )

  const handleSaveCompany = useCallback(
    async (formData: FormData) => {
      if (!selectedCompany) return

      try {
        setEditLoading(true)
        
        // Transform form data to company update format
        const updateData = transformFormDataToCompany(formData)

        // Update company via API
        const updatedCompany = await updateCompany(selectedCompany.companyId, updateData)

        // Update local state
        setCompanies((prevCompanies) =>
          prevCompanies.map((c) =>
            c.companyId === selectedCompany.companyId
              ? {
                  ...c,
                  companyName: updatedCompany.name,
                  company: {
                    ...c.company,
                    ...updatedCompany,
                  },
                }
              : c
          )
        )

        showSuccess('Información de la empresa actualizada correctamente')
        handleCloseDrawer()
      } catch (error) {
        const apiError = error as ApiError
        if (apiError.errors) {
          // Handle validation errors if needed
          showError(apiError.message || 'Error al actualizar la información de la empresa')
        } else {
          showError(apiError.message || 'Error al actualizar la información de la empresa')
        }
      } finally {
        setEditLoading(false)
      }
    },
    [selectedCompany, showSuccess, showError, handleCloseDrawer]
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    {isAdmin && (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleOpenDrawer}
                        sx={{ textTransform: 'none' }}
                      >
                        Editar información
                      </Button>
                    )}
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

      {/* Edit Company Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        ModalProps={{
          sx: {
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 500 },
            p: 3,
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Editar información de la empresa
          </Typography>
          <IconButton onClick={handleCloseDrawer} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedCompany && (
          <DynamicForm
            config={companyEditConfig}
            onSubmit={handleSaveCompany}
            initialValues={transformCompanyToFormData(selectedCompany.company)}
            loading={editLoading}
          />
        )}
      </Drawer>
      </Box>
  )
}
