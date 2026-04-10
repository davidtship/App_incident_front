import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper, Button, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import { RegionContext } from '../../../context/RegionContext';
import axios from 'axios';

// ---------------- Ajouter Région ----------------
const AddRegionDialog = ({ open, onClose, onAdded }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [name, setName] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [provincesList, setProvincesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

  // Récupérer les provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/provinces/`);
        setProvincesList(res.data.results || []);
      } catch (err) {
        console.error('Erreur fetch provinces', err);
      }
    };
    fetchProvinces();
  }, []);

  const generateCodeRegion = () => `REG${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  const handleAdd = async () => {
    if (!name || !provinceId) {
      setAlert({ open: true, severity: 'error', message: 'Veuillez remplir tous les champs.' });
      return;
    }
    setLoading(true);
    const code_region = generateCodeRegion();
    try {
      const res = await axios.post(`${apiUrl}/api/region/`, { name, province: provinceId, code_region });
      onAdded(res.data); // ajoute la nouvelle région
      setAlert({ open: true, severity: 'success', message: 'Région ajoutée avec succès !' });
      setName('');
      setProvinceId('');
      onClose();
    } catch (err) {
      console.error('Erreur ajout région', err);
      setAlert({ open: true, severity: 'error', message: 'Erreur lors de l’ajout. Vérifie le serveur ou les données.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Ajouter une Région</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la région"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Province</InputLabel>
            <Select value={provinceId} onChange={(e) => setProvinceId(e.target.value)} label="Province">
              {provincesList.map((prov) => <MenuItem key={prov.id} value={prov.id}>{prov.name}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Annuler</Button>
          <Button onClick={handleAdd} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled" onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// ---------------- Composant principal ----------------
const EcolesTableList = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { regions: initialRegions, search, handleSearch } = useContext(RegionContext);

  const [regions, setRegions] = useState([]);
  const [provincesList, setProvincesList] = useState([]);
  const [openAddRegionDialog, setOpenAddRegionDialog] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
  const [loadingDelete, setLoadingDelete] = useState(false);

  // --- Met à jour la liste quand le contexte change
  useEffect(() => {
    setRegions(initialRegions || []);
  }, [initialRegions]);

  // --- Récupérer toutes les provinces pour afficher le nom
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/provinces/`);
        setProvincesList(res.data.results || []);
      } catch (err) {
        console.error('Erreur fetch provinces', err);
      }
    };
    fetchProvinces();
  }, []);

  const filteredData = regions.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()));
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const handleAddRegionToList = (newRegion) => setRegions(prev => [...prev, newRegion]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette région ?')) return;
    setLoadingDelete(true);
    try {
      await axios.delete(`${apiUrl}/api/region/${id}/`);
      setRegions(regions.filter(r => r.id !== id));
      setAlert({ open: true, severity: 'success', message: 'Région supprimée avec succès !' });
    } catch (err) {
      console.error('Erreur suppression région', err);
      setAlert({ open: true, severity: 'error', message: 'Erreur lors de la suppression.' });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Box>
      <Toolbar sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          placeholder="Rechercher une région"
          size="small"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><IconSearch /></InputAdornment> }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpenAddRegionDialog(true)}>
          Ajouter Région
        </Button>
      </Toolbar>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selected.length === filteredData.length}
                    onChange={() => setSelected(filteredData.map(r => r.id))}
                  />
                </TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Code Région</TableCell>
                <TableCell>Province</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                  <TableCell padding="checkbox"><CustomCheckbox checked={selected.includes(row.id)} /></TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.code_region}</TableCell>
                  <TableCell>{provincesList.find(p => p.id === row.province)?.name || ''}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? <CircularProgress size={24} /> : 'Supprimer'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}><TableCell colSpan={5} /></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      <AddRegionDialog
        open={openAddRegionDialog}
        onClose={() => setOpenAddRegionDialog(false)}
        onAdded={handleAddRegionToList}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled" onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EcolesTableList;