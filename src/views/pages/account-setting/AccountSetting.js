import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import Grid from '@mui/material/Grid2';
import BlankCard from 'src/components/shared/BlankCard';
import Typography from '@mui/material/Typography';
import ChangePassword from 'src/components/pages/account-setting/ChangePassword';

const BCrumb = [
  { to: '/', title: 'Utilisateurs' },
  { title: 'Changer le mot de passe' },
];

const AccountSetting = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    
    if (!token) return;

    fetch(`${apiUrl}/auth/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <PageContainer title="Changer le mot de passe" description="Modification du mot de passe">
      <Breadcrumb title="Changer le mot de passe" items={BCrumb} />

      {/* 👤 NOM DE L’UTILISATEUR CONNECTÉ */}
      {user && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Compte connecté :{' '}
            {user.first_name} {user.last_name}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BlankCard>
            <ChangePassword />
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AccountSetting;
