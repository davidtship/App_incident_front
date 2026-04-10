import React, { useEffect, useState } from 'react';
import { Box, CardContent, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import DashboardWidgetCard from '../../components/shared/DashboardWidgetCard';

import icon1 from '../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../assets/images/svgs/icon-bars.svg';
import icon3 from '../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../assets/images/svgs/icon-dd-message-box.svg';
import icon6 from '../../assets/images/svgs/icon-user-male.svg';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Modern = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const theme = useTheme();

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

  const token = localStorage.getItem("access");

  const COLORS = [
    "#4facfe",
    "#00f2fe",
    "#43e97b",
    "#fa709a",
    "#ffb347",
    "#8e24aa",
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [incidentsRes, schoolsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/api/incidents/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/api/schools/`),
          fetch(`${apiUrl}/auths/users/`),
        ]);

        const [incidentsData, schoolsData, usersData] = await Promise.all([
          incidentsRes.json(),
          schoolsRes.json(),
          usersRes.json(),
        ]);

        const incidents = incidentsData.results ?? incidentsData;

        const treated = incidents.filter(i => i.state === true).length;
        const untreated = incidents.filter(i => i.state === false).length;

        setTopData({
          totalIncidents: incidents.length,
          treatedIncidents: treated,
          untreatedIncidents: untreated,
          schoolsCount: schoolsData.count ?? (schoolsData.results?.length ?? schoolsData.length),
          usersCount: usersData.count ?? (usersData.results?.length ?? usersData.length),
        });

        // DONUT
        const counter = {};
        incidents.forEach(i => {
          const type = i.type || "Non défini";
          counter[type] = (counter[type] || 0) + 1;
        });

        setDonutLabels(Object.keys(counter));
        setDonutSeries(Object.values(counter));

        // MONTHS
        const now = new Date();

        const months = Array.from({ length: 12 }, (_, i) => ({
          label: new Date(now.getFullYear(), i, 1)
            .toLocaleString("fr-FR", { month: "short" }),
          month: i,
          count: 0,
        }));

        incidents.forEach(i => {
          const dateValue = i.created_at || i.date || i.timestamp;
          if (!dateValue) return;

          const date = new Date(dateValue);
          const m = months.find(x => x.month === date.getMonth());

          if (m) m.count += 1;
        });

        setBarCategories(months.map(m => m.label));
        setBarSeries(months.map(m => m.count));

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const chartData = barCategories.map((m, i) => ({
    mois: m,
    incidents: barSeries[i] || 0
  }));

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

      {/* TOP CARDS */}
      <Grid container spacing={3}>
        <Grid size={12}>
          <Grid container spacing={3}>
            {topcards.map((card, i) => (
              <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={i}>
                <Box bgcolor={`${card.bgcolor}.light`} textAlign="center">
                  <CardContent>
                    <img src={card.icon} alt={card.title} width={50} />
                    <Typography color={`${card.bgcolor}.main`} mt={1} fontWeight={600}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {loading ? <Skeleton width={50} /> : card.digits}
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* CHARTS SECTION */}
      <Box mt={4}>

        <Grid container spacing={3}>

          <Box display="flex" gap={3} width="100%" flexWrap="wrap">

            {/* BAR CHART - CHAQUE MOIS UNE COULEUR */}
<Box flex={3} minWidth={340}>
  <DashboardWidgetCard
    title="📊 Incidents par mois"
    subtitle="Comparaison mensuelle"
  >
    {loading ? (
      <Skeleton width="100%" height={360} />
    ) : (
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis dataKey="mois" />
          <YAxis />

          <Tooltip
            formatter={(value) => [`${value} incidents`, "Total"]}
          />

          {/* 🔥 BARRES MULTI-COULEURS */}
          <Bar dataKey="incidents" radius={[6, 6, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    )}
  </DashboardWidgetCard>
</Box>
        {/* DONUT */}
<Box flex={1} minWidth={280}>
  <DashboardWidgetCard
    title="🍩 Répartition"
    subtitle="Types d’incidents"
  >
    {loading ? (
      <Skeleton width="100%" height={320} />
    ) : (
      <Box>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>

            {/* 🔥 TOTAL AU CENTRE */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={26}
              fontWeight="bold"
              fill="#333"
            >
              {donutSeries.reduce((a, b) => a + b, 0)}
            </text>

            <Pie
              data={donutLabels.map((l, i) => ({
                name: l,
                value: donutSeries[i]
              }))}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={5}
            >
              {donutSeries.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

        {/* 🔥 LÉGENDE CUSTOM */}
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={1}
          mt={1}
        >
          {donutLabels.map((label, i) => (
            <Box
              key={i}
              display="flex"
              alignItems="center"
              gap={0.5}
              px={1}
              py={0.3}
              borderRadius={2}
              sx={{
                backgroundColor: "#f5f5f5",
                fontSize: 12
              }}
            >
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                sx={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span>{label}</span>
            </Box>
          ))}
        </Box>

      </Box>
    )}
  </DashboardWidgetCard>
</Box>

          </Box>

        </Grid>

      </Box>

    </Box>
  );
};

export default Modern;