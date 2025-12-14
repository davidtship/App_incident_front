import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Grid2 as Grid, Stack, Typography, Tooltip,
  MenuItem, Box, useTheme, Chip, Checkbox, Dialog, DialogTitle,
  DialogContent, DialogActions, Snackbar, Alert, Slide
} from '@mui/material';
import { useDropzone } from "react-dropzone";
import { IconPlus } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import BlankCard from 'src/components/shared/BlankCard';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import TiptapEdit from 'src/views/forms/from-tiptap/TiptapEdit';

const BCrumb = [
  { to: '/', title: 'Incidents' },
  { title: 'Ajouter un incident' },
];

const TransitionUp = (props) => <Slide {...props} direction="down" />;

const Add = () => {
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // --- STATES ---
  const [gender, setGender] = useState('M');
  const [birthDate, setBirthDate] = useState(dayjs());
  const [incidentDate, setIncidentDate] = useState(dayjs());
  const [incidentType, setIncidentType] = useState('');
  const [actions, setActions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [selectedIncidentType, setSelectedIncidentType] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newActionName, setNewActionName] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [narration, setNarration] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const showSnackbar = (message, severity = 'info') => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // --- DROPZONE ---
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => setMediaFiles(prev => [...prev, ...acceptedFiles])
  });
  const removeFile = (file) => setMediaFiles(prev => prev.filter(f => f !== file));
  const files = mediaFiles.map((file, index) => (
    <Box key={index} display="flex" justifyContent="space-between" py={1} mt={2} sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
      <Typography>{file.name}</Typography>
      <Chip color="primary" label={`${Math.round(file.size / 1024)} KB`} onDelete={() => removeFile(file)} />
    </Box>
  ));

  // --- FETCH DATA ---
  useEffect(() => { fetchPaginated(`${apiUrl}/api/schools/`, setSchools, (s) => ({ label: s.name, value: s.id })); }, []);
  useEffect(() => { fetchPaginated(`${apiUrl}/api/incident-categories/`, setCategories, (c) => ({ label: c.name, value: c.id })); }, []);
  useEffect(() => { fetchPaginated(`${apiUrl}/api/incident-types/`, setIncidentTypes, (t) => t); }, []);
  useEffect(() => { fetchPaginated(`${apiUrl}/api/actions/`, setActions, (a) => ({ ...a, checked: false })); }, []);

  const fetchPaginated = async (url, setState, mapper) => {
    try {
      let allItems = [], page = 1;
      while (true) {
        const res = await fetch(`${url}?page=${page}`);
        const data = await res.json();
        allItems = [...allItems, ...(data.results || data)];
        if (!data.next) break;
        page++;
      }
      setState(allItems.map(mapper));
    } catch (err) { console.error(err); }
  };

  const toggleAction = (id) => setActions(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a));

  // --- AJOUT CATÉGORIE ---
  const handleAddCategory = async () => {
    if (!newCategoryName || !selectedIncidentType) return showSnackbar("Nom et type d'incident obligatoires", "warning");
    try {
      const res = await fetch(`${apiUrl}/api/incident-categories/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, typeIncident: selectedIncidentType.id })
      });
      if (!res.ok) throw new Error("Erreur ajout catégorie");
      const cat = await res.json();
      setCategories(prev => [...prev, { label: cat.name, value: cat.id }]);
      setNewCategoryName(''); setSelectedIncidentType(null); setShowAddCategoryForm(false);
      showSnackbar("Catégorie ajoutée !", "success");
    } catch (err) { console.error(err); showSnackbar("Erreur ajout catégorie", "error"); }
  };

  // --- AJOUT ACTION ---
  const handleAddAction = async () => {
    if (!newActionName) return showSnackbar("Nom action obligatoire", "warning");
    try {
      const res = await fetch(`${apiUrl}/api/actions/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newActionName })
      });
      if (!res.ok) throw new Error("Erreur ajout action");
      const act = await res.json();
      setActions(prev => [...prev, { ...act, checked: false }]);
      setNewActionName(''); setShowAddActionForm(false);
      showSnackbar("Action ajoutée !", "success");
    } catch (err) { console.error(err); showSnackbar("Erreur ajout action", "error"); }
  };

  // --- SUBMIT FORMULAIRE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const selectedActions = actions.filter(a => a.checked);
    // --- VALIDATION ---
    if (!selectedSchool) return showSnackbar("Sélectionner une école", "warning");
    if (!form.student.value.trim()) return showSnackbar("Nom élève obligatoire", "warning");
    if (!birthDate) return showSnackbar("Date naissance obligatoire", "warning");
    if (!gender) return showSnackbar("Sélection sexe obligatoire", "warning");
    if (!mediaFiles) return showSnackbar("Les medias sont obligatoires", "warning");
    if (!form.father.value.trim()) return showSnackbar("Le nom du pere est obligatoire", "warning");
    if (!form.mother.value.trim()) return showSnackbar("Le nom de la mere est obligatoire", "warning");
    if (!form.tutor.value.trim()) return showSnackbar("Le nom du tuteur est obligatoire", "warning");
    if (!narration.replace(/<[^>]+>/g, '')) return showSnackbar("La narration est obligatoire", "warning");
    if (!form.address.value.trim()) return showSnackbar("Adresse obligatoire", "warning");
    if (!selectedCategory) return showSnackbar("Sélection catégorie obligatoire", "warning");
    if (!incidentType) return showSnackbar("Sélection gravité obligatoire", "warning");
    if (!form.place.value.trim()) return showSnackbar("Lieu incident obligatoire", "warning");
    if (!incidentDate) return showSnackbar("Date incident obligatoire", "warning");
    if (!form.tel.value.trim()) return showSnackbar("Téléphone obligatoire", "warning");
    if (selectedActions.length === 0) return showSnackbar("Sélectionner au moins une action", "warning");

    try {
      const formData = new FormData();
      formData.append('school', selectedSchool.value);
      formData.append('student', form.student.value.trim());
      formData.append('dob_student', birthDate.format('YYYY-MM-DD'));
      formData.append('gender', gender);
      formData.append('add_student', form.address.value.trim());
      formData.append('father_name', form.father.value.trim());
      formData.append('mather_name', form.mother.value.trim());
      formData.append('tutor_name', form.tutor.value.trim());
      formData.append('tel', form.tel.value.trim());
      formData.append('cat_incident', selectedCategory.value);
      formData.append('place', form.place.value.trim());
      formData.append('type', incidentType);
      formData.append('date_incident', incidentDate.toISOString());
      formData.append('narration', narration.replace(/<[^>]+>/g, ''));
      formData.append('state', "false");
      selectedActions.forEach(a => formData.append('action_ids', a.id));
      mediaFiles.forEach(file => formData.append('uploaded_files', file));

      const res = await fetch(`${apiUrl}/api/incidents/`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error("Erreur création incident");
      await res.json();
      showSnackbar("Incident créé !", "success");

      // Reset complet
      form.reset(); setGender('M'); setBirthDate(dayjs()); setIncidentDate(dayjs());
      setIncidentType(''); setActions(prev => prev.map(a => ({ ...a, checked: false })));
      setSelectedSchool(null); setSelectedCategory(null); setMediaFiles([]); setNarration('');

    } catch (err) {
      console.error(err); showSnackbar("Erreur création incident", "error");
    }
  };

  return (
    <PageContainer title="Ajouter un incident">
      <Breadcrumb title="Incidents" items={BCrumb} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* LEFT */}
          <Grid size={{ lg: 8 }}>
            <Stack spacing={3}>
              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Informations générales</Typography>
                  <Grid container spacing={2} mt={2}>
                    <Grid xs={12}><CustomFormLabel>Nom de l’élève *</CustomFormLabel><CustomTextField name="student" fullWidth /></Grid>
                    <Grid xs={12}><CustomFormLabel>Date de naissance *</CustomFormLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker value={birthDate} onChange={setBirthDate} />
                      </LocalizationProvider>
                    </Grid>
                    <Grid xs={12}><CustomFormLabel>Sexe *</CustomFormLabel>
                      <CustomSelect value={gender} onChange={e => setGender(e.target.value)} fullWidth>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                      </CustomSelect>
                    </Grid>
                    <Grid xs={12}><CustomFormLabel>Adresse élève *</CustomFormLabel><CustomTextField name="address" fullWidth /></Grid>
                  </Grid>

                  {/* Catégorie d'incident */}
                  <Grid container spacing={2} alignItems="flex-start" mt={2}>
                    <Grid xs={8}>
                      <Autocomplete
                        options={categories}
                        getOptionLabel={opt => opt.label}
                        value={selectedCategory}
                        disableClearable
                        onChange={(e, v) => setSelectedCategory(v)}
                        renderInput={(params) => (
                          <TextField {...params} label="Sélectionner une catégorie" fullWidth sx={{ minWidth: 350, '& .MuiInputBase-input': { fontSize: 16, padding: '12px' } }} />
                        )}
                      />
                    </Grid>
                    <Grid xs={4} display="flex" justifyContent="flex-start">
                      <Tooltip title="Ajouter une catégorie">
                        <Button variant="contained" onClick={() => setShowAddCategoryForm(true)} sx={{ height: '40px', ml: 2 }}><IconPlus size={22} /></Button>
                      </Tooltip>
                    </Grid>
                  </Grid>

                  {/* Parents */}
                  <Grid container spacing={2} mt={2}>
                    <Grid xs={4}><CustomFormLabel>Nom du père</CustomFormLabel><CustomTextField name="father" fullWidth /></Grid>
                    <Grid xs={4}><CustomFormLabel>Nom de la mère</CustomFormLabel><CustomTextField name="mother" fullWidth /></Grid>
                    <Grid xs={4}><CustomFormLabel>Nom du tuteur</CustomFormLabel><CustomTextField name="tutor" fullWidth /></Grid>
                  </Grid>

                  {/* Narration */}
                  <Grid xs={12} mt={2}><CustomFormLabel>Narration</CustomFormLabel><TiptapEdit value={narration} onChange={setNarration} /></Grid>
                </Box>
              </BlankCard>

              {/* ACTIONS */}
              <BlankCard>
                <Box p={3}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h5">Actions prises</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<IconPlus />}
                      onClick={() => setShowAddActionForm(true)}
                    >
                      Ajouter une action
                    </Button>
                  </Stack>

                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    options={actions}
                    getOptionLabel={(option) => option.name}
                    value={actions.filter(a => a.checked)}
                    onChange={(event, newValue) => {
                      setActions(prev =>
                        prev.map(a => ({ ...a, checked: newValue.includes(a) }))
                      );
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Sélectionner les actions" placeholder="Choisir..." />
                    )}
                  />
                </Box>
              </BlankCard>

              {/* MEDIA */}
              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Media</Typography>
                  <Box mt={3} {...getRootProps()} sx={{ backgroundColor: 'primary.light', color: 'primary.main', padding: '40px 30px', textAlign: 'center', border: '1px dashed', cursor: 'pointer' }}>
                    <input {...getInputProps()} multiple />
                    <p>Cliquez pour ajouter des medias</p>
                  </Box>
                  <Box mt={2}><Typography variant="h6">Files :</Typography>{files}</Box>
                </Box>
              </BlankCard>

              {/* ECOLE */}
              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">École</Typography>
                  <Autocomplete
                    options={schools}
                    getOptionLabel={opt => opt.label}
                    value={selectedSchool}
                    disableClearable
                    onChange={(e, v) => setSelectedSchool(v)}
                    renderInput={(params) => <TextField {...params} label="Sélectionner une école" fullWidth />}
                  />
                </Box>
              </BlankCard>
            </Stack>
          </Grid>

          {/* RIGHT */}
          <Grid size={{ lg: 4 }}>
            <Stack spacing={3}>
              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Contacts</Typography>
                  <CustomFormLabel>Téléphone *</CustomFormLabel>
                  <CustomTextField name="tel" fullWidth />
                </Box>
              </BlankCard>

              <BlankCard>
                <Box p={3}>
                  <CustomFormLabel>Lieu de l'incident *</CustomFormLabel>
                  <CustomTextField name="place" fullWidth />
                  <CustomFormLabel mt={3}>Gravité *</CustomFormLabel>
                  <CustomSelect value={incidentType} onChange={e => setIncidentType(e.target.value)} fullWidth>
                    <MenuItem value="Faible">Faible</MenuItem>
                    <MenuItem value="Moyen">Moyen</MenuItem>
                    <MenuItem value="Grave">Grave</MenuItem>
                  </CustomSelect>
                  <CustomFormLabel mt={3}>Date de l'incident *</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={incidentDate} onChange={setIncidentDate} />
                  </LocalizationProvider>
                </Box>
              </BlankCard>
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={3}>
          <Button type="submit" variant="contained">Enregistrer</Button>
          <Button variant="outlined" color="error">Annuler</Button>
        </Stack>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        TransitionComponent={TransitionUp}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* --- POPUP AJOUT CATEGORIE --- */}
      <Dialog open={showAddCategoryForm} onClose={() => setShowAddCategoryForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ajouter une catégorie</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField label="Nom catégorie" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} fullWidth sx={{ mt: 1, fontSize: 16 }} />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={incidentTypes}
                getOptionLabel={opt => opt.name}
                value={selectedIncidentType}
                onChange={(e, v) => setSelectedIncidentType(v)}
                renderInput={(params) => <TextField {...params} label="Type d'incident" fullWidth />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddCategoryForm(false)}>Annuler</Button>
          <Button onClick={handleAddCategory} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* --- POPUP AJOUT ACTION --- */}
      <Dialog open={showAddActionForm} onClose={() => setShowAddActionForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ajouter une action</DialogTitle>
        <DialogContent>
          <TextField label="Nom action" value={newActionName} onChange={e => setNewActionName(e.target.value)} fullWidth sx={{ mt: 1, fontSize: 16 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddActionForm(false)}>Annuler</Button>
          <Button onClick={handleAddAction} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Add;
