import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const EmployeeSalary = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const secondary = theme.palette.secondary.main;
  const primarylight = theme.palette.grey[500];
  const primaryli = theme.palette.grey[200];

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    colors: [success, secondary, primary, warning, primarylight, secondary],
    plotOptions: {
      bar: {
        borderRadius: 4,
        startingShape: 'flat',
        endingShape: 'flat',
        columnWidth: '45%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [['Apr'], ['May'], ['June'], ['July'], ['Aug'], ['Sept']],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [20, 15, 30, 25, 10, 15],
    },
  ];

  return (
    <DashboardWidgetCard
      title="Incident par mois"
      subtitle="6 derniers mois"
      dataLabel1="Total"
      dataItem1="413"
    >
      <>
        <Box>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="bar"
            height="380px"
            width={550}
          />
        </Box>
      </>
    </DashboardWidgetCard>
  );
};

export default EmployeeSalary;
