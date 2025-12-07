import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Grid2 as Grid, Stack, Typography, Tooltip,
  MenuItem, Box, useTheme, Chip,
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

  // STATES
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(dayjs());
  const [incidentDate, setIncidentDate] = useState(dayjs());
  const [incidentType, setIncidentType] = useState('');
  const [actions, setActions] = useState([{ id: Date.now(), value: '' }]);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [narration, setNarration] = useState('');

  // DROPZONE
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

  // Charger écoles
useEffect(() => {
  fetch('https://safeschooldata-6d63cd50a8a3.herokuapp.com/api/schools/')
    .then(res => res.json())
    .then(data => {
      // Si API paginée
      const list = data.results ? data.results : data;
      setSchools(list.map(s => ({ label: s.name, value: s.id })));
    })
    .catch(err => console.error(err));
}, []);

// Charger catégories
useEffect(() => {
  fetch("https://safeschooldata-6d63cd50a8a3.herokuapp.com/api/incident-categories/")
    .then(res => res.json())
    .then(data => {
      const list = data.results ? data.results : data;
      setCategories(list.map((cat, idx) => ({
        label: `${idx + 1}. ${cat.name}`,
        value: cat.id
      })));
    })
    .catch(err => console.error(err));
}, []);

  // Actions dynamiques
  const addAction = () => setActions([...actions, { id: Date.now(), value: '' }]);
  const removeAction = (id) => setActions(actions.filter(a => a.id !== id));
  const updateAction = (id, value) => setActions(actions.map(a => (a.id === id ? { ...a, value } : a)));

  // Soumission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Vérifications simples
  if (!selectedSchool) return alert("Veuillez sélectionner une école");
  if (!selectedCategory) return alert("Veuillez sélectionner une catégorie");
  if (!gender) return alert("Veuillez sélectionner le sexe de l'élève");
  if (!incidentType) return alert("Veuillez sélectionner le type d'incident");

  const formData = new FormData();

  // Infos élève
  formData.append('school', selectedSchool.value);
  formData.append('student', e.target.student.value);
  formData.append('dob_student', birthDate.format('YYYY-MM-DD'));
  formData.append('gender', gender);
  formData.append('add_student', e.target.address.value);
  formData.append('father_name', e.target.father.value);
  formData.append('mather_name', e.target.mother.value);
  formData.append('tutor_name', e.target.tutor.value || '');
  formData.append('tel', e.target.tel.value);

  // Incident
  formData.append('cat_incident', selectedCategory.value);
  formData.append('place', e.target.place.value);
  formData.append('type', incidentType);
  formData.append('date_incident', incidentDate.toISOString());

  // ⚡ Narration — transformer en string HTML si nécessaire
  // Si TiptapEdit renvoie déjà une string HTML, garde comme ça
  // Sinon, utilise `narration.getHTML()` ou `JSON.stringify(narration)`
const plainText = narration.replace(/<[^>]+>/g, '');
formData.append('narration', plainText);
  console.log("Narration:", plainText);
console.log("Type:", typeof plainText);
alert(plainText)

  // Actions dynamiques
  formData.append('actionTaken', JSON.stringify(actions.map(a => a.value)));

  // État
  formData.append('state', "true");

  // Fichiers médias
  mediaFiles.forEach(file => formData.append('uploaded_files', file));


  // 🔹 Debug : vérifier ce qui est envoyé
  console.log("=== FormData ===");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const res = await fetch('https://safeschooldata-6d63cd50a8a3.herokuapp.com/api/incidents/', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Erreur API:', errorData);
      return alert('Erreur lors de la création de l’incident. Vérifiez les champs.');
    }

    const data = await res.json();
    console.log('Incident créé:', data);
    alert('Incident créé avec succès !');

    // Reset du formulaire
    e.target.reset();
    setGender('');
    setBirthDate(dayjs());
    setIncidentDate(dayjs());
    setIncidentType('');
    setActions([{ id: Date.now(), value: '' }]);
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
                  <Typography variant="h5">General</Typography>
                  <Grid container mt={3}>
                    <Grid size={12}>
                      <CustomFormLabel>Nom de l’élève *</CustomFormLabel>
                      <CustomTextField name="student" placeholder="Nom de l'élève" fullWidth />
                    </Grid>
                    <Grid size={12}>
                      <CustomFormLabel>Date de naissance *</CustomFormLabel>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker value={birthDate} onChange={setBirthDate} />
                      </LocalizationProvider>
                    </Grid>
                    <Grid size={12}>
                      <CustomFormLabel>Sexe *</CustomFormLabel>
                      <CustomSelect value={gender} onChange={e => setGender(e.target.value)}>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                      </CustomSelect>
                    </Grid>
                  </Grid>

                  <Grid size={12}>
                    <CustomFormLabel>Adresse élève *</CustomFormLabel>
                    <CustomTextField name="address" fullWidth />
                  </Grid>

                  <Grid container spacing={2} mt={2}>
                    <Grid xs={4}><CustomFormLabel>Nom du père</CustomFormLabel><CustomTextField name="father" fullWidth /></Grid>
                    <Grid xs={4}><CustomFormLabel>Nom de la mère</CustomFormLabel><CustomTextField name="mother" fullWidth /></Grid>
                    <Grid xs={4}><CustomFormLabel>Nom du tuteur</CustomFormLabel><CustomTextField name="tutor" fullWidth /></Grid>
                  </Grid>

                  <Grid size={12} mt={2}>
                    <CustomFormLabel>Narration</CustomFormLabel>
                    <TiptapEdit value={narration} onChange={setNarration} />
                  </Grid>
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

              {/* ACTIONS */}
              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Actions prises</Typography>
                  {actions.map(a => (
                    <Grid container spacing={3} key={a.id} mb={2}>
                      <Grid xs={12} lg={8}><CustomTextField fullWidth value={a.value} onChange={e => updateAction(a.id, e.target.value)} /></Grid>
                      <Grid xs={12} lg={4}><Tooltip title="Supprimer"><Button color="error" onClick={() => removeAction(a.id)}><IconX size={21} /></Button></Tooltip></Grid>
                    </Grid>
                  ))}
                  <Button startIcon={<IconPlus />} onClick={addAction}>Ajouter une autre action</Button>
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
                  <CustomTextField name="tel" />
                </Box>
              </BlankCard>

              <BlankCard>
                <Box p={3}>
                  <Typography variant="h6">Lieu de l’incident</Typography>
                  <CustomTextField name="place" fullWidth />
                  <CustomFormLabel mt={3}>Type</CustomFormLabel>
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

              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Catégorie d’incident</Typography>
                  <Autocomplete
                    options={categories}
                    getOptionLabel={(opt) => opt.label}
                    value={selectedCategory}
                    disableClearable
                    onChange={(e, v) => setSelectedCategory(v)}
                    renderInput={(params) => <TextField {...params} label="Sélectionner une catégorie" fullWidth />}
                  />
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
    </PageContainer>
  );
};

export default Add;
