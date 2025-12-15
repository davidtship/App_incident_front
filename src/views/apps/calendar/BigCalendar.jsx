// CalendarIncidents.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CardContent, Dialog, DialogTitle, DialogContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from 'src/components/shared/BlankCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';

moment.locale('fr');
const localizer = momentLocalizer(moment);

const BCrumb = [
  { to: '/', title: 'Accueil' },
  { title: 'Calendrier des incidents' },
];

// Couleurs par type d'incident
const typeColors = {
  Faible: '#1a97f5',
  Moyen: '#39b69a',
  Grave: '#fc4b6c',
  Critique: '#fdd43f',
  ParDefaut: '#615dff'
};

const CalendarIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [schools, setSchools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // ---- FETCH INCIDENTS ------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const incidentsRes = await fetch(`${apiUrl}/api/incidents/`);
        const incidentsData = await incidentsRes.json();
        setIncidents(incidentsData.results ?? []);

        const schoolsRes = await fetch(`${apiUrl}/api/schools/`);
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.results ?? []);

        const categoriesRes = await fetch(`${apiUrl}/api/school-categories/`);
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.results ?? []);
      } catch (error) {
        console.error('Erreur fetch:', error);
      }
    };
    fetchData();
  }, []);

  // ---- TRANSFORMATION INCIDENTS EN EVENTS ----
  useEffect(() => {
    // Filtrage par école et catégorie
    const filtered = incidents.filter(
      (i) =>
        (schoolFilter ? i.school === parseInt(schoolFilter) : true) &&
        (categoryFilter ? i.cat_incident === parseInt(categoryFilter) : true)
    );

    // Regroupement par date
    const groupedByDate = {};
    filtered.forEach((incident) => {
      const date = moment(incident.date_incident).format('YYYY-MM-DD');
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(incident);
    });

    // Création des events pour le calendrier
    const tempEvents = [];
    Object.keys(groupedByDate).forEach((date) => {
      groupedByDate[date].forEach((incident, index) => {
        tempEvents.push({
          title: `${incident.student} - ${incident.type}`,
          start: new Date(incident.date_incident),
          end: new Date(incident.date_incident),
          color: typeColors[incident.type] ?? typeColors.ParDefaut,
          incident,
          allDay: true
        });
      });
    });

    setEvents(tempEvents);
  }, [incidents, schoolFilter, categoryFilter]);

  const eventColors = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        color: 'white',
        borderRadius: '4px',
        padding: '2px'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedIncident(event.incident);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIncident(null);
  };

  return (
    <PageContainer title="Calendrier des incidents" description="Calendrier des incidents scolaires">
      <Breadcrumb title="Calendrier" items={BCrumb} />

      <BlankCard>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {/* Filtre École */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filtrer par École</InputLabel>
            <Select
              value={schoolFilter}
              label="Filtrer par École"
              onChange={(e) => setSchoolFilter(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtre Catégorie */}
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filtrer par Catégorie</InputLabel>
            <Select
              value={categoryFilter}
              label="Filtrer par Catégorie"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <CardContent>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 250px)' }}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day']}
            eventPropGetter={eventColors}
          />
        </CardContent>
      </BlankCard>

      {/* DIALOG DETAILS INCIDENT */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Détails de l'incident</DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <>
              <Typography><strong>Étudiant :</strong> {selectedIncident.student}</Typography>
              <Typography><strong>Genre :</strong> {selectedIncident.gender}</Typography>
              <Typography><strong>Date de naissance :</strong> {selectedIncident.dob_student}</Typography>
              <Typography><strong>Adresse :</strong> {selectedIncident.add_student}</Typography>
              <Typography><strong>Père :</strong> {selectedIncident.father_name}</Typography>
              <Typography><strong>Mère :</strong> {selectedIncident.mather_name}</Typography>
              <Typography><strong>Tuteur :</strong> {selectedIncident.tutor_name}</Typography>
              <Typography><strong>Téléphone :</strong> {selectedIncident.tel}</Typography>
              <Typography><strong>Lieu :</strong> {selectedIncident.place}</Typography>
              <Typography><strong>Type :</strong> {selectedIncident.type}</Typography>
              <Typography><strong>Date :</strong> {moment(selectedIncident.date_incident).format('LLL')}</Typography>
              <Typography><strong>Récit :</strong> {selectedIncident.narration}</Typography>
              {selectedIncident.actions.length > 0 && (
                <Typography><strong>Actions :</strong> {selectedIncident.actions.map(a => a.name).join(', ')}</Typography>
              )}
              {selectedIncident.picture.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {selectedIncident.picture.map((pic, i) => (
                    <img key={i} src={`http://127.0.0.1:8000${pic}`} alt="incident" style={{ width: 100, marginRight: 10 }} />
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <Button onClick={handleCloseDialog}>Fermer</Button>
      </Dialog>
    </PageContainer>
  );
};

export default CalendarIncidents;
