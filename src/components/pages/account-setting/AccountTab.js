import React, { useState } from 'react';
import {
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import BlankCard from '../../shared/BlankCard';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';

// image
import user1 from 'src/assets/images/profile/user-1.jpg';

const AccountTab = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = async () => {
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
            'Erreur lors du changement de mot de passe'
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
    <Grid container spacing={3}>
      {/* ================= PROFILE ================= */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Profile
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Change your profile picture from here
            </Typography>

            <Box textAlign="center">
              <Avatar
                src={user1}
                sx={{ width: 120, height: 120, margin: '0 auto' }}
              />
              <Stack direction="row" justifyContent="center" spacing={2} my={3}>
                <Button variant="contained" component="label">
                  Upload
                  <input hidden type="file" />
                </Button>
                <Button variant="outlined" color="error">
                  Reset
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </BlankCard>
      </Grid>

      {/* ================= CHANGE PASSWORD ================= */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Password
            </Typography>
            <Typography color="textSecondary" mb={3}>
              To change your password please confirm here
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <CustomFormLabel htmlFor="current-password">
              Current Password
            </CustomFormLabel>
            <CustomTextField
              id="current-password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <CustomFormLabel htmlFor="new-password">
              New Password
            </CustomFormLabel>
            <CustomTextField
              id="new-password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <CustomFormLabel htmlFor="confirm-password">
              Confirm Password
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
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? 'Modification...' : 'Change Password'}
              </Button>
            </Stack>
          </CardContent>
        </BlankCard>
      </Grid>
    </Grid>
  );
};

export default AccountTab;
