import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

import TopCards from '../../components/dashboards/modern/TopCards';
import RevenueUpdates from '../../components/dashboards/modern/RevenueUpdates';
import YearlyBreakup from '../../components/dashboards/modern/YearlyBreakup';
import MonthlyEarnings from '../../components/dashboards/modern/MonthlyEarnings';
import EmployeeSalary from '../../components/dashboards/modern/EmployeeSalary';
import Customers from '../../components/dashboards/modern/Customers';
import Projects from '../../components/dashboards/modern/Projects';
import Social from '../../components/dashboards/modern/Social';
import SellingProducts from '../../components/dashboards/modern/SellingProducts';
import WeeklyStats from '../../components/dashboards/modern/WeeklyStats';
import TopPerformers from '../../components/dashboards/modern/TopPerformers';


const Modern = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* column */}
        <Grid size={12}>
          <TopCards />
        </Grid>
     
        
        {/* column */}
        <Grid  size={{ xs: 12, lg: 6 }}>
          <EmployeeSalary />
        </Grid>   
         <Grid  size={{ xs: 12, lg: 6 }}>
          <YearlyBreakup />
        </Grid>   
      </Grid>
      {/* column */}
     
    </Box>
  );
};

export default Modern;
