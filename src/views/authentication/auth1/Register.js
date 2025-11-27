import React from 'react';
import { Link } from 'react-router';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/back.png';
import Logo from 'src/layouts/full/shared/logo/Logo';

import AuthRegister from '../authForms/AuthRegister';

const Register = () => (
  <PageContainer title="Register" description="Register page">
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

          background: `linear-gradient(135deg, #2f6aff, #467ffe, #7fc8ff)`,
          backgroundSize: '300% 300%',
          animation: 'gradientMove 12s ease infinite',

          clipPath: {
            lg: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
          },
        }}
      >
        {/* Décoration */}
        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            top: 40,
            left: 40,
            filter: 'blur(40px)',
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
              color: "#fff",
            }}
          >
            Créez votre <br /> compte EduCollect
          </Typography>

          {/* SOUS-TITRE */}
          <Typography
            variant="h6"
            sx={{
              maxWidth: 500,
              opacity: 0.95,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.2px",
              lineHeight: 1.55,
              fontSize: "1.15rem",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            Rejoignez la plateforme moderne dédiée à la gestion et
            l’analyse intelligente des données scolaires.
          </Typography>

          {/* IMAGE */}
          <Stack direction="row" spacing={3} mt={5} alignItems="center">
            <Paper
              elevation={10}
              sx={{
                p: 1.5,
                borderRadius: 4,
                backdropFilter: 'blur(14px)',
                background: 'rgba(255,255,255,0.3)',
              }}
            >
              <img
                src={img1}
                alt="Illustration"
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 20,
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Stack>
        </Box>
      </Grid>

      {/* COLONNE DROITE FORMULAIRE */}
      <Grid
        size={{ xs: 12, sm: 12, lg: 5, xl: 4 }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 420,
            borderRadius: 4,
            backdropFilter: 'blur(8px)',
          }}
        >
          <AuthRegister
            title="Créer un compte"
            subtext={
              <Typography variant="subtitle1" mb={1}>
                Rejoignez EduCollect en quelques secondes.
              </Typography>
            }
            subtitle={
              <Typography
                component={Link}
                to="/auth/login"
                fontWeight={600}
                sx={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  textAlign: 'center',
                  mt: 3,
                }}
              >
                Déjà un compte ? Se connecter
              </Typography>
            }
          />
        </Paper>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Register;
