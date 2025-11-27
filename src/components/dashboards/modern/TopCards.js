import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-bars.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-dd-message-box.svg';
import icon6 from '../../../assets/images/svgs/icon-user-male.svg';

const topcards = [
  {
    icon: icon2,
    title: 'Incidents',
    digits: '10',
    bgcolor: 'primary',
  },
  {
    icon: icon3,
    title: 'Traité',
    digits: '4',
    bgcolor: 'warning',
  },
  {
    icon: icon4,
    title: 'Non traité',
    digits: '6',
    bgcolor: 'secondary',
  },
  {
    icon: icon5,
    title: "Ecoles",
    digits: '4',
    bgcolor: 'error',
  },
  
  {
    icon: icon1,
    title: 'Rapports',
    digits: '12',
    bgcolor: 'info',
  },
  {
    icon: icon6,
    title: 'Utilisateurs',
    digits: '3',
    bgcolor: 'success',
  }
];

const TopCards = () => {
  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={i}>
          <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
            <CardContent>
              <img src={topcard.icon} alt={topcard.icon} width="50" />
              <Typography
                color={topcard.bgcolor + '.main'}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
