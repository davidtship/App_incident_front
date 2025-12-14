import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

import PageLoader from '../../components/shared/PageLoader';

import TopCards from '../../components/dashboards/modern/TopCards';
import YearlyBreakup from '../../components/dashboards/modern/YearlyBreakup';
import EmployeeSalary from '../../components/dashboards/modern/EmployeeSalary';

const Modern = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ Simulation du chargement global (API)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={12}>
          <TopCards />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <EmployeeSalary />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <YearlyBreakup />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Modern;
