import React, { useState } from 'react';
import { CardContent, Typography, Button, Alert, Stack } from '@mui/material';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

const ChangePassword = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const token = localStorage.getItem('access');

    if (!token) {
      setError('Utilisateur non authentifié');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/auth/users/set_password/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data?.current_password?.[0] ||
          data?.new_password?.[0] ||
          'Erreur lors du changement du mot de passe'
        );
      }

      setSuccess('Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent>
      <Typography variant="h5" mb={2}>
        Changer le mot de passe
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <CustomFormLabel htmlFor="current-password">
        Mot de passe actuel
      </CustomFormLabel>
      <CustomTextField
        id="current-password"
        type="password"
        fullWidth
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />

      <CustomFormLabel htmlFor="new-password">
        Nouveau mot de passe
      </CustomFormLabel>
      <CustomTextField
        id="new-password"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <CustomFormLabel htmlFor="confirm-password">
        Confirmer le nouveau mot de passe
      </CustomFormLabel>
      <CustomTextField
        id="confirm-password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Stack direction="row" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Modification...' : 'Changer le mot de passe'}
        </Button>
      </Stack>
    </CardContent>
  );
};

export default ChangePassword;
