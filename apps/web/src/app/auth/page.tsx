'use client'

import { useState } from 'react'
import { Container, Grid, Typography, Button, Box, TextField, Tabs, Tab } from "@mui/material"
import Link from 'next/link'

export default function AuthPage() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
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

          {/* Formulario de Inicio de Sesión */}
          {tabValue === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                />
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "none",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Iniciar sesión
                </Button>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', mt: 1 }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Formulario de Registro */}
          {tabValue === 1 && (
            <Grid size={{ xs: 12 }}>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Nombre completo"
                  type="text"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                />
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "none",
                    fontWeight: 600,
                    mt: 1,
                  }}
                >
                  Crear cuenta
                </Button>
              </Box>
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
