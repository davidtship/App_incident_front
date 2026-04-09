import React, { useState } from 'react';  
import {
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Stack } from '@mui/system';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '' });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowPasswordConfirm = () =>
    setShowPasswordConfirm((prev) => !prev);

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);

  const showAlert = (message) => {
    setAlert({ open: true, message });
    setTimeout(() => setAlert({ open: false, message: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, last_name, email, password, passwordConfirm } = formData;

    if (password !== passwordConfirm)
      return showAlert('Les mots de passe ne correspondent pas.');
    if (!validatePassword(password))
      return showAlert(
        'Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.'
      );

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auths/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name, last_name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 🔹 Messages personnalisés
        if (data.email && data.email[0].includes('already exists')) {
          return showAlert('Un utilisateur avec cet email existe déjà.');
        } else if (data.password) {
          return showAlert('Erreur mot de passe : ' + data.password.join(' '));
        } else if (data.first_name) {
          return showAlert('Erreur prénom : ' + data.first_name.join(' '));
        } else if (data.last_name) {
          return showAlert('Erreur nom : ' + data.last_name.join(' '));
        } else {
          return showAlert('Erreur lors de la création du compte.');
        }
      }

      showAlert('Compte créé avec succès !');
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (error) {
      console.error(error);
      showAlert('Erreur serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box position="relative">
      {/* 🔹 ALERTE CENTRÉE AVEC COULEUR DU BOUTON */}
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

      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            Inscription
          </Typography>
        </Divider>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={3} spacing={2}>
          <CustomFormLabel htmlFor="first_name">Nom</CustomFormLabel>
          <CustomTextField
            id="first_name"
            variant="outlined"
            fullWidth
            value={formData.first_name}
            onChange={handleChange}
          />

          <CustomFormLabel htmlFor="last_name">Postnom</CustomFormLabel>
          <CustomTextField
            id="last_name"
            variant="outlined"
            fullWidth
            value={formData.last_name}
            onChange={handleChange}
          />

          <CustomFormLabel htmlFor="email">Adresse email</CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />

          <CustomFormLabel htmlFor="password">Mot de passe</CustomFormLabel>
          <CustomTextField
            id="password"
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <CustomFormLabel htmlFor="passwordConfirm">
            Mot de passe de nouveau
          </CustomFormLabel>
          <CustomTextField
            id="passwordConfirm"
            variant="outlined"
            fullWidth
            type={showPasswordConfirm ? 'text' : 'password'}
            value={formData.passwordConfirm}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPasswordConfirm} edge="end">
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            "S'inscrire"
          )}
        </Button>
      </Box>

      {subtitle}
    </Box>
  );
};

export default AuthRegister;