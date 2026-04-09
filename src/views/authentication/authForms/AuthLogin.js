import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '' });

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const showAlert = (message) => {
    setAlert({ open: true, message });
    setTimeout(() => setAlert({ open: false, message: '' }), 3000);
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(data.detail || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      // Sauvegarde des tokens
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        })
      );

      showAlert('Connexion réussie !');

      setTimeout(() => navigate('/dashboards'), 1500);
    } catch (err) {
      console.error(err);
      showAlert('Erreur serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative">
      {/* 🔹 ALERTE CENTRÉE */}
      {alert.open && (
        <Fade in={alert.open}>
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'primary.main',
              color: '#fff',
              px: 4,
              py: 2,
              borderRadius: 2,
              boxShadow: 3,
              zIndex: 10000,
              minWidth: 250,
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {alert.message}
          </Box>
        </Fade>
      )}

      {/* TITLE */}
      {title && (
        <Typography fontWeight="700" variant="h4" textAlign="center" mb={1} sx={{ letterSpacing: '0.5px' }}>
          {title}
        </Typography>
      )}

      {subtext && <Typography textAlign="center">{subtext}</Typography>}

      {/* DIVIDER */}
      <Box mt={3} mb={3}>
        <Divider>
          <Typography variant="subtitle2" color="textSecondary">
            Front Office
          </Typography>
        </Divider>
      </Box>

      {/* FORM */}
      <Stack spacing={2}>
        <Box>
          <CustomFormLabel htmlFor="email">Adresse email</CustomFormLabel>
          <CustomTextField id="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        </Box>

        <Box>
          <CustomFormLabel htmlFor="password">Mot de passe</CustomFormLabel>
          <CustomTextField
            id="password"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Typography
          component="span"
          fontWeight="500"
          sx={{
            textDecoration: 'none',
            color: 'primary.main',
            textAlign: 'right',
            mt: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/auth/forgot-password')}
        >
          Mot de passe oublié ?
        </Typography>
      </Stack>

      {/* BUTTON */}
      <Box mt={3}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.5, fontWeight: 600, borderRadius: 3, textTransform: 'none' }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Se connecter'}
        </Button>
      </Box>

      {subtitle}
    </Box>
  );
};

export default AuthLogin;