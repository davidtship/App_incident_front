import React, { useState, useContext } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import SchoolCategorieTableList from 'src/components/apps/schoolcategories/SchoolCategoriesTableList';
import { SchoolCategoryProvider, SchoolCategoryContext } from 'src/context/SchoolCategorieContext';
import BlankCard from 'src/components/shared/BlankCard';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { IconPlus } from '@tabler/icons-react';

const BCrumb = [
  { to: '/', title: 'Catégories scolaires' },
  { title: 'Liste des catégories' },
];

// --- Dialog pour AJOUT ---
const AddSchoolCategorieDialog = ({ open, handleClose }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addCategory } = useContext(SchoolCategoryContext);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const newCategory = { name: name.trim() };

    try {
      const res = await fetch(`${apiUrl}/api/school-categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        const savedCategory = data || newCategory;
        addCategory(savedCategory); // Mettre à jour le contexte
        setName('');
        handleClose();
        setSnackbar({
          open: true,
          message: `Catégorie "${savedCategory.name}" ajoutée avec succès !`,
          severity: 'success'
        });
      } else {
        setSnackbar({ open: true, message: data?.detail || 'Erreur lors de l’ajout', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur réseau ou serveur', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#f9fafb', boxShadow: 6 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', textAlign: 'center' }}>
          Ajouter une catégorie scolaire
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la catégorie"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1, '& .MuiInputBase-root': { bgcolor: '#fff', borderRadius: 1 } }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="secondary" variant="outlined" disabled={loading}>Annuler</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <Box display="flex" alignItems="center" gap={1}><CircularProgress size={20} color="inherit" />Ajout...</Box> : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

// --- Dialog pour MODIFICATION ---
const EditSchoolCategorieDialog = ({ open, handleClose, category }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { updateCategory } = useContext(SchoolCategoryContext);
  const [name, setName] = useState(category?.name || '');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  React.useEffect(() => { setName(category?.name || ''); }, [category]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const updatedCategory = { name: name.trim() };

    try {
      const res = await fetch(`${apiUrl}/api/school-categories/${category.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        const savedCategory = data || { ...category, ...updatedCategory };
        updateCategory(savedCategory); // Mettre à jour le contexte
        handleClose();
        setSnackbar({ open: true, message: `Catégorie "${savedCategory.name}" modifiée !`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data?.detail || 'Erreur lors de la modification', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Erreur réseau ou serveur', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#f9fafb', boxShadow: 6 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', textAlign: 'center' }}>
          Modifier la catégorie scolaire
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la catégorie"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1, '& .MuiInputBase-root': { bgcolor: '#fff', borderRadius: 1 } }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="secondary" variant="outlined" disabled={loading}>Annuler</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <Box display="flex" alignItems="center" gap={1}><CircularProgress size={20} color="inherit" />Modification...</Box> : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

// --- Page principale ---
const SchoolCategorieList = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <SchoolCategoryProvider>
      <PageContainer title="Liste des catégories scolaires" description="Page de gestion des catégories scolaires">
        <Breadcrumb title="Catégories scolaires" items={BCrumb} />

        <BlankCard sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} p={2} sx={{ bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={700} color="#0d47a1">Catégories scolaires</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus size={20} />}
              onClick={() => setOpenAddDialog(true)}
              sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 3, borderRadius: 2, px: 3 }}
            >
              Ajouter
            </Button>
          </Box>

          <SchoolCategorieTableList setSelectedCategory={setSelectedCategory} setOpenEditDialog={setOpenEditDialog} />
        </BlankCard>

        {/* Dialogs */}
        <AddSchoolCategorieDialog open={openAddDialog} handleClose={() => setOpenAddDialog(false)} />
        <EditSchoolCategorieDialog
          open={openEditDialog}
          handleClose={() => setOpenEditDialog(false)}
          category={selectedCategory}
        />
      </PageContainer>
    </SchoolCategoryProvider>
  );
};

export default SchoolCategorieList;