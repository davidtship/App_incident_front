import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Stack, Typography, Box, Grid,
  Chip
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import BlankCard from 'src/components/shared/BlankCard';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { Autocomplete } from '@mui/material';

const BCrumb = [
  { to: '/', title: 'Écoles' },
  { title: 'Ajouter une école' },
];

const AddEcole = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [numAffect, setNumAffect] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [gerant, setGerant] = useState('');
  const [numGerant, setNumGerant] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);


  /* ================= FETCH REGIONS & CATEGORIES ================= */

useEffect(() => {
  const fetchData = async () => {
    try {
      const [regionRes, categoryRes] = await Promise.all([
        fetch(`${apiUrl}/api/region/`),
        fetch(`${apiUrl}/api/school-categories/`)
      ]);

      const regionData = await regionRes.json();
      const categoryData = await categoryRes.json();

      // ✅ DRF pagination => results
      setRegions(Array.isArray(regionData.results) ? regionData.results : []);
      setCategories(Array.isArray(categoryData.results) ? categoryData.results : []);

    } catch (err) {
      console.error('Erreur chargement régions/catégories', err);
      setRegions([]);
      setCategories([]);
    }
  };

  fetchData();
}, [apiUrl]);

  /* ================= DROPZONE ================= */




  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !numAffect || !name || !address || !contact ||
      !gerant || !numGerant || !selectedRegion || !selectedCategory
    ) {
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

    try {
      const res = await fetch(`${apiUrl}/api/schools/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        return alert("Erreur lors de la création");
      }

      alert("École créée avec succès !");
      setNumAffect('');
      setName('');
      setAddress('');
      setContact('');
      setGerant('');
      setNumGerant('');
      setSelectedRegion(null);
      setSelectedCategory(null);
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  /* ================= RENDER ================= */

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
                    <CustomTextField value={numAffect} onChange={(e) => setNumAffect(e.target.value)} fullWidth />

                    <CustomFormLabel>Nom *</CustomFormLabel>
                    <CustomTextField value={name} onChange={(e) => setName(e.target.value)} fullWidth />

                    <CustomFormLabel>Adresse *</CustomFormLabel>
                    <CustomTextField value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />

                    <CustomFormLabel>Contact *</CustomFormLabel>
                    <CustomTextField value={contact} onChange={(e) => setContact(e.target.value)} fullWidth />

                    <CustomFormLabel>Gérant *</CustomFormLabel>
                    <CustomTextField value={gerant} onChange={(e) => setGerant(e.target.value)} fullWidth />

                    <CustomFormLabel>Num Gérant *</CustomFormLabel>
                    <CustomTextField value={numGerant} onChange={(e) => setNumGerant(e.target.value)} fullWidth />

                    <CustomFormLabel>Région *</CustomFormLabel>
                    <Autocomplete
                      options={regions}
                      getOptionLabel={(opt) => opt.name || ''}
                      value={selectedRegion}
                      onChange={(e, v) => setSelectedRegion(v)}
                      renderInput={(params) =>
                        <TextField {...params} label="Sélectionner une région" />
                      }
                    />

                    <CustomFormLabel>Catégorie *</CustomFormLabel>
                    <Autocomplete
                      options={categories}
                      getOptionLabel={(opt) => opt.name || ''}
                      value={selectedCategory}
                      onChange={(e, v) => setSelectedCategory(v)}
                      renderInput={(params) =>
                        <TextField {...params} label="Sélectionner une catégorie" />
                      }
                    />
                  </Stack>
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
