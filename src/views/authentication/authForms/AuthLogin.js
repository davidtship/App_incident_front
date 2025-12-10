import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/auth/jwt/create/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Erreur de connexion');
        setOpenDialog(true);
        setLoading(false);
        return;
      }

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

      setLoading(false);
      navigate('/dashboards');
    } catch (err) {
      setError('Erreur serveur. Veuillez réessayer.');
      setOpenDialog(true);
      setLoading(false);
    }
  };

  return (
    <>
      {/* TITLE */}
      <Typography
        fontWeight="700"
        variant="h4"
        textAlign="center"
        mb={1}
        sx={{ letterSpacing: '0.5px' }}
      >
        {title}
      </Typography>

      {/* SUBTEXT */}
      <Typography textAlign="center">{subtext}</Typography>

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
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
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
          sx={{
            py: 1.5,
            fontWeight: 600,
            borderRadius: 3,
            textTransform: 'none',
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </Box>

      {/* SUBTITLE / REGISTER LINK */}
      {subtitle}

      {/* DIALOG ERROR */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Erreur de connexion</DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AuthLogin;
