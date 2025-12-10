import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Grid2 as Grid, Stack, Typography, Tooltip,
  MenuItem, Box, useTheme, Chip, Checkbox, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { useDropzone } from "react-dropzone";
import { IconX, IconPlus } from '@tabler/icons-react';
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

  // --- FETCH ÉCOLES ---
  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        let allSchools = [];
        let page = 1;
        while (true) {
          const res = await fetch(`${apiUrl}/api/schools/?page=${page}`);
          const data = await res.json();
          allSchools = [...allSchools, ...(data.results || data)];
          if (!data.next) break;
          page++;
        }
        setSchools(allSchools.map(s => ({ label: s.name, value: s.id })));
      } catch (err) { console.error(err); }
    };
    fetchAllSchools();
  }, []);

  // --- FETCH CATÉGORIES ---
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        let allCategories = [];
        let page = 1;
        while (true) {
          const res = await fetch(`${apiUrl}/api/incident-categories/?page=${page}`);
          const data = await res.json();
          allCategories = [...allCategories, ...(data.results || data)];
          if (!data.next) break;
          page++;
        }
        setCategories(allCategories.map((cat, idx) => ({ label: cat.name, value: cat.id })));
      } catch (err) { console.error(err); }
    };
    fetchAllCategories();
  }, []);

  // --- FETCH TYPES D'INCIDENTS ---
  useEffect(() => {
    const fetchAllIncidentTypes = async () => {
      try {
        let allTypes = [];
        let page = 1;
        while (true) {
          const res = await fetch(`${apiUrl}/api/incident-types/?page=${page}`);
          const data = await res.json();
          allTypes = [...allTypes, ...(data.results || data)];
          if (!data.next) break;
          page++;
        }
        setIncidentTypes(allTypes);
      } catch (err) { console.error(err); }
    };
    fetchAllIncidentTypes();
  }, []);

  // --- FETCH ACTIONS DE L'API ---
  useEffect(() => {
    const fetchActions = async () => {
      try {
        let allActions = [];
        let page = 1;
        while (true) {
          const res = await fetch(`${apiUrl}/api/actions/?page=${page}`);
          const data = await res.json();
          allActions = [...allActions, ...(data.results || data)];
          if (!data.next) break;
          page++;
        }
        setActions(allActions.map(a => ({ ...a, checked: false })));
      } catch (err) { console.error(err); }
    };
    fetchActions();
  }, []);

  const toggleAction = (id) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, checked: !a.checked } : a));
  };

  // --- AJOUTER CATÉGORIE ---
  const handleAddCategory = async () => {
    if (!newCategoryName || !selectedIncidentType) return alert("Veuillez remplir le nom et le type d'incident");
    try {
      const res = await fetch(`${apiUrl}/api/incident-categories/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, typeIncident: selectedIncidentType.id })
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      const cat = await res.json();
      setCategories(prev => [...prev, { label: cat.name, value: cat.id }]);
      setNewCategoryName(''); setSelectedIncidentType(null); setShowAddCategoryForm(false);
      alert("Catégorie ajoutée avec succès !");
    } catch (err) { console.error(err); alert("Erreur lors de l'ajout de la catégorie"); }
  };

  // --- AJOUTER ACTION ---
  const handleAddAction = async () => {
    if (!newActionName) return alert("Veuillez entrer le nom de l'action");
    try {
      const res = await fetch(`${apiUrl}/api/actions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newActionName })
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de l'action");
      const act = await res.json();
      setActions(prev => [...prev, { ...act, checked: false }]);
      setNewActionName(''); setShowAddActionForm(false);
      alert("Action ajoutée avec succès !");
    } catch (err) { console.error(err); alert("Erreur lors de l'ajout de l'action"); }
  };

  // --- SUBMIT FORMULAIRE ---
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedSchool || !selectedCategory || !gender || !incidentType)
    return alert("Veuillez remplir tous les champs obligatoires");

  const formData = new FormData();
  formData.append('school', selectedSchool.value);
  formData.append('student', e.target.student.value);
  formData.append('dob_student', birthDate.format('YYYY-MM-DD'));
  formData.append('gender', gender);
  formData.append('add_student', e.target.address.value);
  formData.append('father_name', e.target.father.value);
  formData.append('mather_name', e.target.mother.value);
  formData.append('tutor_name', e.target.tutor.value || '');
  formData.append('tel', e.target.tel.value);
  formData.append('cat_incident', selectedCategory.value);
  formData.append('place', e.target.place.value);
  formData.append('type', incidentType);
  formData.append('date_incident', incidentDate.toISOString());
  formData.append('narration', narration.replace(/<[^>]+>/g, ''));
  formData.append('state', "false");

  // --- AJOUTER LES ACTIONS --- 
  const selectedActions = actions.filter(a => a.checked);
  if (selectedActions.length === 0) return alert("Veuillez sélectionner au moins une action prise");
  selectedActions.forEach(a => formData.append('action_ids', a.id)); // <-- nom exact du champ serializer

  // --- AJOUTER LES FICHIERS ---
  mediaFiles.forEach(file => formData.append('uploaded_files', file));

  try {
    const res = await fetch(`${apiUrl}/api/incidents/`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Erreur API:", errorData);
      return alert("Erreur lors de la création de l'incident");
    }

    await res.json();
    alert('Incident créé avec succès !');

    // --- RESET FORM ---
    e.target.reset();
    setGender('M');
    setBirthDate(dayjs());
    setIncidentDate(dayjs());
    setIncidentType('');
    setActions(prev => prev.map(a => ({ ...a, checked: false })));
    setSelectedSchool(null);
    setSelectedCategory(null);
    setMediaFiles([]);
    setNarration('');

  } catch (err) {
    console.error(err);
    alert('Erreur lors de la création de l’incident');
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
              {/* GENERAL */}
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
                  <CustomFormLabel>Lieu de l'incident</CustomFormLabel>
                  <CustomTextField name="place" fullWidth />
                  <CustomFormLabel mt={3}>Gravité</CustomFormLabel>
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
                renderInput={(params) => (
                  <TextField {...params} label="Type d'incident" fullWidth sx={{ mt: 1, fontSize: 16 }} />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={() => setShowAddCategoryForm(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddCategory}>Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* --- POPUP AJOUT ACTION --- */}
      <Dialog open={showAddActionForm} onClose={() => setShowAddActionForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Ajouter une action</DialogTitle>
        <DialogContent>
          <TextField label="Nom de l'action" value={newActionName} onChange={e => setNewActionName(e.target.value)} fullWidth sx={{ mt: 1, fontSize: 16 }} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={() => setShowAddActionForm(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddAction}>Ajouter</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Add;
