'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Grid, Typography, Button, Box, Tabs, Tab, Divider } from "@mui/material"
import Link from 'next/link'
import { DynamicForm, FormData } from '@app/components/DynamicForm'
import { companyRegistrationConfig, transformRegistrationData } from './companyRegistrationConfig'
import { loginConfig } from './loginConfig'
import { useGlobalAlert } from '@app/components/GlobalAlert'

export default function AuthPage() {
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [externalErrors, setExternalErrors] = useState<Record<string, string>>({})
  const { showError, showSuccess } = useGlobalAlert()

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setExternalErrors({}) // Clear errors when switching tabs
  }

  const handleLogin = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      // TODO: Replace with actual API call
      console.log('Login data:', data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Handle successful login
      showSuccess('Inicio de sesión exitoso')
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.errors) {
        setExternalErrors(error.response.data.errors)
      } else {
        showError(error.message || 'Ocurrió un error. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyRegistration = async (data: FormData) => {
    setLoading(true)
    setExternalErrors({})

    try {
      // Transform form data to API format
      const registrationData = transformRegistrationData(data)

      // TODO: Replace with actual API call
      console.log('Registration data:', registrationData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Handle successful registration
      // Redirect to dashboard or success page
      // router.push('/dashboard')
    } catch (error: any) {
      // Handle API errors
      if (error.response?.data?.errors) {
        setExternalErrors(error.response.data.errors)
      } else {
        showError(error.message || 'Ocurrió un error. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Grid container spacing={4}>
          {/* Título */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                textAlign: "center",
                mb: 2,
              }}
            >
              Bienvenido a NEXA
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                textAlign: "center",
                mb: 4,
              }}
            >
              Gestiona tu organización de forma inteligente
            </Typography>
          </Grid>

          {/* Tabs para Login/Registro */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                }}
              >
                <Tab label="Iniciar sesión" />
                <Tab label="Crear cuenta" />
              </Tabs>
            </Box>
          </Grid>

          {/* Sign In Form */}
          {tabValue === 0 && (
            <Grid size={{ xs: 12 }}>
              <DynamicForm
                config={loginConfig}
                onSubmit={handleLogin}
                loading={loading}
                errors={externalErrors}
              />
            </Grid>
          )}

          {/* Company Registration Form */}
          {tabValue === 1 && (
            <Grid size={{ xs: 12 }}>
              <DynamicForm
                config={companyRegistrationConfig}
                onSubmit={handleCompanyRegistration}
                loading={loading}
                errors={externalErrors}
              />
            </Grid>
          )}

          {/* Link de vuelta al inicio */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button
                  variant="text"
                  sx={{
                    textTransform: "none",
                    color: 'text.secondary',
                  }}
                >
                  Volver al inicio
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
