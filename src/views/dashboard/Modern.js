import React, { useEffect, useState } from 'react';
import { Box, CardContent, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import DashboardWidgetCard from '../../components/shared/DashboardWidgetCard';

import icon1 from '../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../assets/images/svgs/icon-bars.svg';
import icon3 from '../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../assets/images/svgs/icon-dd-message-box.svg';
import icon6 from '../../assets/images/svgs/icon-user-male.svg';

const Modern = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const theme = useTheme();

  // 🔹 États globaux
  const [loading, setLoading] = useState(true);
  const [topData, setTopData] = useState({
    totalIncidents: 0,
    treatedIncidents: 0,
    untreatedIncidents: 0,
    schoolsCount: 0,
    usersCount: 0,
  });
  const [donutLabels, setDonutLabels] = useState([]);
  const [donutSeries, setDonutSeries] = useState([]);
  const [barCategories, setBarCategories] = useState([]);
  const [barSeries, setBarSeries] = useState([]);

  // 🔹 Couleurs
  const primaryColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    '#FFB300', '#8E24AA', '#D81B60', '#1E88E5', '#43A047', '#F4511E'
  ];
  const greyLight = theme.palette.grey[300];

  // 🔹 Chargement des données
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [incidentsRes, schoolsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/api/incidents/`),
          fetch(`${apiUrl}/api/schools/`),
          fetch(`${apiUrl}/auths/users/`),
        ]);

        const [incidentsData, schoolsData, usersData] = await Promise.all([
          incidentsRes.json(),
          schoolsRes.json(),
          usersRes.json(),
        ]);

        const incidents = incidentsData.results ?? incidentsData;

        // 🔹 Top cards
        const treated = incidents.filter(i => i.state === true).length;
        const untreated = incidents.filter(i => i.state === false).length;
        setTopData({
          totalIncidents: incidents.length,
          treatedIncidents: treated,
          untreatedIncidents: untreated,
          schoolsCount: schoolsData.count ?? (schoolsData.results?.length ?? schoolsData.length),
          usersCount: usersData.count ?? (usersData.results?.length ?? usersData.length),
        });

        // 🔹 Donut chart par type
        const counter = {};
        incidents.forEach(i => {
          const type = i.type || 'Non défini';
          counter[type] = (counter[type] || 0) + 1;
        });
        setDonutLabels(Object.keys(counter));
        setDonutSeries(Object.values(counter));

        // 🔹 Bar chart 12 mois
        const now = new Date();
        const months = Array.from({ length: 12 }, (_, i) => ({
          label: new Date(now.getFullYear(), i, 1).toLocaleString('fr-FR', { month: 'short' }),
          month: i,
          count: 0,
        }));

        incidents.forEach(i => {
          const dateValue = i.created_at || i.date || i.timestamp;
          if (!dateValue) return;
          const date = new Date(dateValue);
          const monthData = months.find(m => m.month === date.getMonth());
          if (monthData) monthData.count += 1;
        });

        setBarCategories(months.map(m => m.label));
        setBarSeries(months.map(m => m.count));

      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // 🔹 Options charts
  const barOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: '50%' } },
    colors: barSeries.map((val, i) => (val > 0 ? primaryColors[i % 12] : greyLight)),
    dataLabels: { enabled: true },
    xaxis: { categories: barCategories, labels: { rotate: -45 }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { title: { text: 'Nombre d\'incidents' }, min: 0, forceNiceScale: true },
    tooltip: { y: { formatter: val => `${val} incident(s)` } },
  };

  const donutOptions = {
    chart: { type: 'donut', fontFamily: "'Plus Jakarta Sans', sans-serif", height: 250 },
    labels: donutLabels,
    colors: primaryColors,
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => opts.w.config.series[opts.seriesIndex],
      style: { fontSize: '12px', fontWeight: 600, colors: ['#fff'] },
    },
    legend: { position: 'bottom', fontSize: '12px', markers: { width: 8, height: 8 } },
    tooltip: { y: { formatter: val => `${val} incident(s)` } },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { fontSize: '12px' },
            value: { fontSize: '16px', fontWeight: 700 },
            total: { show: true, label: 'Total', fontSize: '12px', formatter: () => donutSeries.reduce((a, b) => a + b, 0) },
          },
        },
      },
    },
  };

  // 🔹 Top cards
  const topcards = [
    { icon: icon2, title: 'Incidents', digits: topData.totalIncidents, bgcolor: 'primary' },
    { icon: icon3, title: 'Traité', digits: topData.treatedIncidents, bgcolor: 'warning' },
    { icon: icon4, title: 'Non traité', digits: topData.untreatedIncidents, bgcolor: 'secondary' },
    { icon: icon5, title: 'Écoles', digits: topData.schoolsCount, bgcolor: 'error' },
    { icon: icon1, title: 'Rapports', digits: '0', bgcolor: 'info' },
    { icon: icon6, title: 'Utilisateurs', digits: topData.usersCount, bgcolor: 'success' },
  ];

  return (
    <Box>
      <Grid container spacing={3} alignItems="stretch">
        {/* Top Cards */}
        <Grid size={12}>
          <Grid container spacing={3}>
            {topcards.map((card, i) => (
              <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={i}>
                <Box bgcolor={`${card.bgcolor}.light`} textAlign="center">
                  <CardContent>
                    <img src={card.icon} alt={card.title} width={50} />
                    <Typography color={`${card.bgcolor}.main`} mt={1} variant="subtitle1" fontWeight={600}>
                      {card.title}
                    </Typography>
                    <Typography color={`${card.bgcolor}.main`} variant="h4" fontWeight={600}>
                      {loading ? <Skeleton width={50} /> : card.digits}
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

{/* Courbe 12 mois avec style coloré */}
<DashboardWidgetCard title="Incidents par mois" subtitle="Comparaison sur 12 mois">
  {loading ? (
    <Skeleton variant="rectangular" width="100%" height={350} />
  ) : barSeries.length === 0 ? (
    <Typography align="center" color="text.secondary">Aucun incident</Typography>
  ) : (
    <Chart
      options={{
        chart: {
          id: 'line-incidents',
          toolbar: { show: false },
          zoom: { enabled: false },
          foreColor: '#333'
        },
        stroke: {
          curve: 'smooth', // courbe lisse
          width: 3
        },
        markers: {
          size: 6,           // points ronds
          colors: ['#fff'],  // couleur intérieure
          strokeColors: ['#1976d2'], // contour des points
          strokeWidth: 3,
          hover: { size: 8 }
        },
        colors: ['#1976d2'], // couleur de la ligne
        grid: {
          borderColor: '#e7e7e7',
          row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 }
        },
        xaxis: {
          categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          title: { text: 'Mois' }
        },
        yaxis: {
          title: { text: 'Nombre d\'incidents' },
          min: 0
        },
        tooltip: {
          enabled: true,
          theme: 'dark'
        }
      }}
      series={[
        {
          name: 'Incidents',
          data: barSeries
        }
      ]}
      type="line"
      height={350}
    />
  )}
</DashboardWidgetCard>

        {/* Donut Chart par type */}
        <DashboardWidgetCard title="Répartition des incidents" subtitle="Par type">
          {loading ? <Skeleton variant="rectangular" width="100%" height={250} /> :
            donutSeries.length === 0 ? <Typography align="center" color="text.secondary">Aucun incident</Typography> :
            <Chart options={donutOptions} series={donutSeries} type="donut" height={250} />}
        </DashboardWidgetCard>

      </Grid>
    </Box>
  );
};

export default Modern;
