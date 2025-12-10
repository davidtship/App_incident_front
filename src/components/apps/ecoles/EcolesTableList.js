import React, { useContext, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Divider, Slide, Stack, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../forms/theme-elements/CustomSwitch';
import { EcoleContext } from '../../../context/EcoleContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EcolesTableList = () => {
  const { ecoles, regions, categories, search, handleSearch } = useContext(EcoleContext);

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [regionFilter, setRegionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedEcole, setSelectedEcole] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(ecoles.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleOpenDetailDialog = (ecole) => {
    setSelectedEcole(ecole);
    setOpenDetailDialog(true);
  };
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedEcole(null);
  };

  const handleOpenDeleteDialog = (ecole) => {
    setSelectedEcole(ecole);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedEcole(null);
  };
  const handleDelete = () => {
    console.log('Supprimer école:', selectedEcole.id);
    handleCloseDeleteDialog();
  };

  // Filtrage texte + région + catégorie
  const filteredData = ecoles
    .filter((ecole) => 
      (ecole.name?.toLowerCase().includes(search.toLowerCase()) ||
      ecole.num_affect?.toLowerCase().includes(search.toLowerCase()) ||
      ecole.gerant?.toLowerCase().includes(search.toLowerCase())) &&
      (regionFilter ? ecole.region === regionFilter : true) &&
      (categoryFilter ? ecole.categorie === categoryFilter : true)
    );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  return (
    <Box>

      {/* ---------------- SEARCH & FILTRES ---------------- */}
      <Toolbar sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher une école"
          size="small"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            ),
          }}
        />

        {/* Filtre Région */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filtrer par Région</InputLabel>
          <Select
            value={regionFilter}
            label="Filtrer par Région"
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <MenuItem value="">Toutes</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
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
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Toolbar>

      {/* ---------------- TABLE ---------------- */}
      <Paper>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selected.length === filteredData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Numéro Affectation</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Gérant</TableCell>
                <TableCell>Num Gérant</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Région</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                    <TableCell padding="checkbox">
                      <CustomCheckbox checked={selected.includes(row.id)} />
                    </TableCell>
                    <TableCell>{row.num_affect}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                    <TableCell>{row.gerant}</TableCell>
                    <TableCell>{row.num_gerant}</TableCell>
                    <TableCell>{row.categorie_name}</TableCell>
                    <TableCell>{row.region_name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDetailDialog(row)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(row)}
                        >
                          Supprimer
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={10} />
                </TableRow>
              )}
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
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>
    </Box>
  );
};

export default EcolesTableList;
