import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight } from '@tabler/icons';
import Grid from '@mui/material/Grid2';
import DashboardCard from '../../shared/DashboardCard';

const YearlyBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const successlight = theme.palette.success.light;
  const errorlight = theme.palette.error.light;
const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [currentYearCount, setCurrentYearCount] = useState(0);
  const [lastYearCount, setLastYearCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/incidents/`);
        const data = await res.json();
        const incidents = data.results ?? data;

        let current = 0;
        let last = 0;

        incidents.forEach((incident) => {
          const dateValue =
            incident.created_at ||
            incident.date ||
            incident.date_incident ||
            incident.created ||
            incident.timestamp;

          if (!dateValue) return;

          const year = new Date(dateValue).getFullYear();
          if (year === currentYear) current++;
          if (year === lastYear) last++;
        });

        setCurrentYearCount(current);
        setLastYearCount(last);

        if (last > 0) {
          setPercentage((((current - last) / last) * 100).toFixed(1));
        } else {
          setPercentage(current > 0 ? 100 : 0);
        }
      } catch (error) {
        console.error('Erreur chargement incidents', error);
      }
    };

    fetchIncidents();
  }, []);

  const isIncrease = currentYearCount >= lastYearCount;

  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      height: 220, // 👈 même taille que l’autre donut
    },
    colors: [primary, primarylight, theme.palette.grey[200]],
    plotOptions: {
      pie: {
        donut: {
          size: '65%', // 👈 même épaisseur
        },
      },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { enabled: false },
  };

  const seriescolumnchart = [
    currentYearCount,
    lastYearCount,
    Math.max(1, currentYearCount + lastYearCount),
  ];

  return (
    <DashboardCard title="Incidents par années">
      <Grid container spacing={3}>
        <Grid size={7}>
          <Typography variant="h3" fontWeight="700">
            {currentYearCount}
          </Typography>

          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar
              sx={{
                bgcolor: isIncrease ? successlight : errorlight,
                width: 27,
                height: 27,
              }}
            >
              {isIncrease ? (
                <IconArrowUpLeft width={18} color="#39B69A" />
              ) : (
                <IconArrowDownRight width={18} color="#E53935" />
              )}
            </Avatar>

            <Typography variant="subtitle2" fontWeight="600">
              {percentage}%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              par rapport à l’année passée
            </Typography>
          </Stack>

          <Stack spacing={3} mt={4} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primary }} />
              <Typography variant="subtitle2" color="textSecondary">
                {currentYear}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primarylight }} />
              <Typography variant="subtitle2" color="textSecondary">
                {lastYear}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid size={5}>
          <Box display="flex" justifyContent="center">
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="donut"
              height={220}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
