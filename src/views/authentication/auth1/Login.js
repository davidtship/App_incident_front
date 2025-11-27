import React, { useEffect } from 'react';
import { Link } from 'react-router';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/back.png';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';

const Login = () => {

  // Vider le localStorage au montage du composant
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <PageContainer title="Login" description="Login page">
      <Grid container spacing={0} sx={{ overflow: 'hidden', minHeight: '100vh' }}>

        {/* COLONNE GAUCHE */}
        <Grid
          size={{ xs: 12, sm: 12, lg: 7, xl: 8 }}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            color: '#ffffff',
            px: { xs: 3, lg: 8 },
            background: `linear-gradient(135deg, #2152FF 0%, #3A7BFF 40%, #74D4FF 100%)`,
            backgroundSize: '200% 200%',
            animation: 'gradientMove 10s ease infinite',
            clipPath: {
              xs: 'none',
              lg: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)'
            },
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* Effet lumière */}
          <Box
            sx={{
              position: 'absolute',
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              top: 50,
              left: 80,
              filter: 'blur(50px)',
              zIndex: 1,
            }}
          />

          <Box width="100%" position="relative" zIndex={2}>

            {/* TITRE */}
            <Typography
              variant="h2"
              sx={{
                mb: 3,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 900,
                fontSize: { xs: "2.4rem", md: "3.2rem" },
                lineHeight: 1.1,
                letterSpacing: "-1px",
                textShadow: '0 6px 18px rgba(0,0,0,0.25)',
                textRendering: "optimizeLegibility",
                color: "#fff",
              }}
            >
              Bienvenue sur <br /> EduCollect
            </Typography>

            {/* SOUS-TITRE */}
            <Typography
              variant="h6"
              sx={{
                maxWidth: 500,
                opacity: 0.95,
                mt: 2,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.2px",
                lineHeight: 1.55,
                fontSize: "1.15rem",
                color: "rgba(255,255,255,0.95)",
                textRendering: "optimizeLegibility",
              }}
            >
              Une plateforme intelligente dédiée à la collecte, l’analyse et la gestion
              fiable des données scolaires pour les établissements modernes.
            </Typography>

            {/* IMAGE + TEXTES */}
            <Stack direction="row" spacing={3} mt={6} alignItems="center">
              <Paper
                elevation={10}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255,255,255,0.25)',
                }}
              >
                <img
                  src={img1}
                  alt="Illustration"
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: 24,
                    objectFit: 'cover',
                  }}
                />
              </Paper>
            </Stack>
          </Box>
        </Grid>

        {/* COLONNE FORMULAIRE */}
        <Grid
          size={{ xs: 12, sm: 12, lg: 5, xl: 4 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ p: { xs: 3, md: 6 } }}
        >
          <Paper
            elevation={8}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 420,
              borderRadius: 5,
              backdropFilter: 'blur(10px)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <AuthLogin
              title="Connexion"
              subtext={
                <Typography variant="subtitle1" mb={1}>
                  Accédez à votre espace EduCollect.
                </Typography>
              }
              subtitle={
                <Typography
                  component={Link}
                  to="/auth/register"
                  fontWeight={600}
                  sx={{
                    textDecoration: 'none',
                    color: 'primary.main',
                    textAlign: 'center',
                    mt: 3,
                  }}
                >
                  Pas encore de compte ? S’inscrire
                </Typography>
              }
            />
          </Paper>
        </Grid>

      </Grid>

      {/* ANIMATION CSS */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

    </PageContainer>
  );
};

export default Login;
