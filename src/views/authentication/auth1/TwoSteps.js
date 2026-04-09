import React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PageContainer from 'src/components/container/PageContainer';
import img1 from 'src/assets/images/backgrounds/login-bg.svg';
import Logo from 'src/layouts/full/shared/logo/Logo';

import AuthTwoSteps from '../authForms/AuthTwoSteps';

const TwoSteps = () => (
  <PageContainer title="Two Steps" description="this is Two Steps page">
    <Grid container spacing={0} sx={{ overflowX: 'hidden' }}>
      <Grid
        size={{ xs: 12, sm: 12, }}
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
       
        <Box position="relative">
          <Box px={3}>
            <Logo />
          </Box>
          <Box
         
            height={'calc(100vh - 75px)'}
          
          >
            <img
              src={img1}
              alt="bg"
              style={{
                width: '100%',
                maxWidth: '500px',
              }}
            />
             

          </Box>
        </Box>
      </Grid>
     
    </Grid>
  </PageContainer>
);

export default TwoSteps;
