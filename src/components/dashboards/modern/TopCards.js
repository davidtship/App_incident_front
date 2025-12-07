import React, { useEffect, useState } from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-bars.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-dd-message-box.svg';
import icon6 from '../../../assets/images/svgs/icon-user-male.svg';

const TopCards = () => {
  const [topData, setTopData] = useState({
    totalIncidents: 0,
    treatedIncidents: 0,
    untreatedIncidents: 0,
    schoolsCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lancer toutes les requêtes en parallèle
        const [incidentsRes, schoolsRes, usersRes] = await Promise.all([
          fetch("https://safeschooldata-6d63cd50a8a3.herokuapp.com/api/incidents/"),
          fetch("https://safeschooldata-6d63cd50a8a3.herokuapp.com/api/schools/"),
          fetch("https://safeschooldata-6d63cd50a8a3.herokuapp.com/auths/users/"),
        ]);

        const [incidentsData, schoolsData, usersData] = await Promise.all([
          incidentsRes.json(),
          schoolsRes.json(),
          usersRes.json(),
        ]);

        // Comptage incidents
        const incidentsList = incidentsData.results ? incidentsData.results : incidentsData;
        const treated = incidentsList.filter(inc => inc.state === true).length;
        const untreated = incidentsList.filter(inc => inc.state === false).length;

        setTopData({
          totalIncidents: incidentsList.length,
          treatedIncidents: treated,
          untreatedIncidents: untreated,
          schoolsCount: schoolsData.count || (schoolsData.results ? schoolsData.results.length : schoolsData.length),
          usersCount: usersData.count || (usersData.results ? usersData.results.length : usersData.length),
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  const topcards = [
    { icon: icon2, title: 'Incidents', digits: topData.totalIncidents, bgcolor: 'primary' },
    { icon: icon3, title: 'Traité', digits: topData.treatedIncidents, bgcolor: 'warning' },
    { icon: icon4, title: 'Non traité', digits: topData.untreatedIncidents, bgcolor: 'secondary' },
    { icon: icon5, title: 'Écoles', digits: topData.schoolsCount, bgcolor: 'error' },
    { icon: icon1, title: 'Rapports', digits: '0', bgcolor: 'info' },
    { icon: icon6, title: 'Utilisateurs', digits: topData.usersCount, bgcolor: 'success' },
  ];

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
