import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import AuthSocialButtons from './AuthSocialButtons';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, last_name, email, password, passwordConfirm } = formData;

    // Vérifier que les mots de passe correspondent
    if (password !== passwordConfirm) {
      return alert('Les mots de passe ne correspondent pas.');
    }

    // Vérifier la force du mot de passe
    if (!validatePassword(password)) {
      return alert('Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.');
    }

    // Préparer les données à envoyer
    const payload = { first_name, last_name, email, password };

    try {
      const response = await fetch('https://safeschooldata-6d63cd50a8a3.herokuapp.com/auths/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      if (!response.ok) {
        return alert("cc");
      }

      alert('Compte créé avec succès !');
      navigate('/auth/login');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création du compte.');
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}
      <AuthSocialButtons title="Sign up with" />

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
            or sign up with
          </Typography>
        </Divider>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={3}>
          <CustomFormLabel htmlFor="first_name">Nom</CustomFormLabel>
          <CustomTextField id="first_name" variant="outlined" fullWidth value={formData.first_name} onChange={handleChange} />

          <CustomFormLabel htmlFor="last_name">Postnom</CustomFormLabel>
          <CustomTextField id="last_name" variant="outlined" fullWidth value={formData.last_name} onChange={handleChange} />

          <CustomFormLabel htmlFor="email">Adresse email</CustomFormLabel>
          <CustomTextField id="email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />

          <CustomFormLabel htmlFor="password">Mot de passe</CustomFormLabel>
          <CustomTextField id="password" type="password" variant="outlined" fullWidth value={formData.password} onChange={handleChange} />

          <CustomFormLabel htmlFor="passwordConfirm">Mot de passe de nouveau</CustomFormLabel>
          <CustomTextField id="passwordConfirm" type="password" variant="outlined" fullWidth value={formData.passwordConfirm} onChange={handleChange} />
        </Stack>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
        >
          S'inscrire
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
