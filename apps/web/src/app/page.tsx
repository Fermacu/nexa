'use client'

import { Container, Grid, Typography, Button, Box } from "@mui/material";
import Link from 'next/link';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Título principal */}
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Gestiona tu organización de forma inteligente
            </Typography>
          </Grid>

          {/* Descripción */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h5"
              component="p"
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              NEXA es la plataforma HR que crece contigo. Organiza equipos, gestiona permisos y conecta a tu gente con una solución que se adapta a tu empresa, sin importar su tamaño o industria.
            </Typography>
          </Grid>

          {/* Beneficios principales */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    ✓ Escala sin límites
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Desde startups hasta grandes empresas. Una solución que crece cuando tú creces, sin migraciones complejas ni costos ocultos.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    ✓ Adaptable a tu negocio
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sin estructuras rígidas. Configura roles, permisos y organizaciones que reflejen cómo realmente funciona tu empresa.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    ✓ Centrado en las personas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Una plataforma pensada para facilitar la gestión de tu equipo, con herramientas intuitivas que ahorran tiempo y recursos.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    ✓ Tecnología moderna
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Arquitectura modular y extensible. Integra con tus sistemas existentes y agrega funcionalidades cuando las necesites.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Botones de acción */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Link href="/auth" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Comenzar gratis
                </Button>
              </Link>
              <Button
                variant="text"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  textTransform: "none",
                }}
              >
                Ver precios
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
