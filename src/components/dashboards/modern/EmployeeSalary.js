import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const IncidentDonutByType = () => {
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/incidents/`)
      .then((res) => res.json())
      .then((data) => {
        const incidents = data.results ?? data;

        const counter = {};
        incidents.forEach((incident) => {
          const type = incident.type || 'Non défini';
          counter[type] = (counter[type] || 0) + 1;
        });

        setLabels(Object.keys(counter));
        setSeries(Object.values(counter));
      })
      .catch((err) => console.error('Erreur incidents:', err));
  }, []);

  const options = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      height: 220,
    },
    labels,
    legend: {
      position: 'bottom',
      fontSize: '12px',
      markers: {
        width: 8,
        height: 8,
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.secondary.main,
    ],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} incident(s)`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              fontSize: '12px',
            },
            value: {
              fontSize: '14px',
              fontWeight: 600,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              formatter: () => series.reduce((a, b) => a + b, 0),
            },
          },
        },
      },
    },
  };

  return (
    <DashboardWidgetCard
      title="Répartition des incidents"
      subtitle="Par type"
    >
      <Box display="flex" justifyContent="center">
        {series.length === 0 ? (
          <Typography align="center" color="text.secondary">
            Aucun incident
          </Typography>
        ) : (
          <Chart
            options={options}
            series={series}
            type="donut"
            height={220}
          />
        )}
      </Box>
    </DashboardWidgetCard>
  );
};

export default IncidentDonutByType;
