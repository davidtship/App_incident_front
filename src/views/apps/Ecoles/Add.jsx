import React, { useContext, useState } from 'react';
import {
  Button, TextField, Stack, Typography, Box, Grid,
  MenuItem, Chip, Tooltip
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { IconX, IconPlus } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import BlankCard from 'src/components/shared/BlankCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Autocomplete } from '@mui/material';
import { EcoleContext } from '../../../context/EcoleContext';

const BCrumb = [
  { to: '/', title: 'Écoles' },
  { title: 'Ajouter une école' },
];

const AddEcole = () => {
  const { regions, categories } = useContext(EcoleContext);

  const [numAffect, setNumAffect] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [gerant, setGerant] = useState('');
  const [numGerant, setNumGerant] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // Dropzone pour fichiers
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => setMediaFiles(prev => [...prev, ...acceptedFiles]),
  });

  const removeFile = (file) => setMediaFiles(prev => prev.filter(f => f !== file));
  const files = mediaFiles.map((file, idx) => (
    <Box key={idx} display="flex" justifyContent="space-between" py={1} mt={2} sx={{ borderTop: '1px solid #ccc' }}>
      <Typography>{file.name}</Typography>
      <Chip label={`${Math.round(file.size / 1024)} KB`} onDelete={() => removeFile(file)} />
    </Box>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifications
    if (!numAffect || !name || !address || !contact || !gerant || !numGerant || !selectedRegion || !selectedCategory) {
      return alert("Veuillez remplir tous les champs obligatoires !");
    }

    const formData = new FormData();
    formData.append('num_affect', numAffect);
    formData.append('name', name);
    formData.append('address', address);
    formData.append('contact', contact);
    formData.append('gerant', gerant);
    formData.append('num_gerant', numGerant);
    formData.append('region', selectedRegion.id);
    formData.append('categorie', selectedCategory.id);

    mediaFiles.forEach(file => formData.append('uploaded_files', file));

    try {
      const res = await fetch(`${apiUrl}/api/schools/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erreur API :", errorData);
        return alert("Erreur lors de la création de l'école");
      }

      alert("École créée avec succès !");
      // reset formulaire
      setNumAffect('');
      setName('');
      setAddress('');
      setContact('');
      setGerant('');
      setNumGerant('');
      setSelectedRegion(null);
      setSelectedCategory(null);
      setMediaFiles([]);

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l'école");
    }
  };

  return (
    <PageContainer title="Ajouter une école">
      <Breadcrumb title="Écoles" items={BCrumb} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item lg={8} xs={12}>
            <Stack spacing={3}>

              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Informations de l'école</Typography>
                  <Stack spacing={2} mt={2}>
                    <CustomFormLabel>Numéro Affectation *</CustomFormLabel>
                    <CustomTextField value={numAffect} onChange={e => setNumAffect(e.target.value)} fullWidth />

                    <CustomFormLabel>Nom *</CustomFormLabel>
                    <CustomTextField value={name} onChange={e => setName(e.target.value)} fullWidth />

                    <CustomFormLabel>Adresse *</CustomFormLabel>
                    <CustomTextField value={address} onChange={e => setAddress(e.target.value)} fullWidth />

                    <CustomFormLabel>Contact *</CustomFormLabel>
                    <CustomTextField value={contact} onChange={e => setContact(e.target.value)} fullWidth />

                    <CustomFormLabel>Gérant *</CustomFormLabel>
                    <CustomTextField value={gerant} onChange={e => setGerant(e.target.value)} fullWidth />

                    <CustomFormLabel>Num Gérant *</CustomFormLabel>
                    <CustomTextField value={numGerant} onChange={e => setNumGerant(e.target.value)} fullWidth />

                    <CustomFormLabel>Région *</CustomFormLabel>
                    <Autocomplete
                      options={regions ?? []}
                      getOptionLabel={(opt) => opt.name || ''}
                      value={selectedRegion}
                      onChange={(e, v) => setSelectedRegion(v)}
                      noOptionsText="No option"
                      renderInput={(params) => <TextField {...params} label="Sélectionner une région" fullWidth />}
                    />

                    <CustomFormLabel>Catégorie *</CustomFormLabel>
                    <Autocomplete
                      options={categories ?? []}
                      getOptionLabel={(opt) => opt.name || ''}
                      value={selectedCategory}
                      onChange={(e, v) => setSelectedCategory(v)}
                      noOptionsText="No option"
                      renderInput={(params) => <TextField {...params} label="Sélectionner une catégorie" fullWidth />}
                    />
                  </Stack>
                </Box>
              </BlankCard>

              <BlankCard>
                <Box p={3}>
                  <Typography variant="h5">Media</Typography>
                  <Box mt={2} {...getRootProps()} sx={{ border: '1px dashed #1976d2', p: 4, textAlign: 'center', cursor: 'pointer' }}>
                    <input {...getInputProps()} />
                    <p>Cliquez pour ajouter des fichiers</p>
                  </Box>
                  {files}
                </Box>
              </BlankCard>

            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} mt={3}>
          <Button type="submit" variant="contained">Enregistrer</Button>
          <Button type="button" variant="outlined" color="error">Annuler</Button>
        </Stack>
      </form>
    </PageContainer>
  );
};

export default AddEcole;
