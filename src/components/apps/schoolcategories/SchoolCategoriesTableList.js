import React, { useContext, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  TextField,
  InputAdornment,
  Paper,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';

import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import { SchoolCategoryContext } from '../../../context/SchoolCategorieContext';

import EditCategorieDialog from './EditCategorieDialog';
import DeleteCategorieDialog from './DeleteCategorieDialog';

const SchoolCategoriesTableList = () => {
  const {
    categories,
    loading,
    search,
    handleSearch,
    fetchCategories
  } = useContext(SchoolCategoryContext);

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState(null);

  /* ================= ACTIONS ================= */

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(categories.map((c) => c.id));
      return;
    }
    setSelected([]);
  };

  const handleOpenEdit = (categorie) => {
    setSelectedCategorie(categorie);
    setOpenEditDialog(true);
  };

  const handleOpenDelete = (categorie) => {
    setSelectedCategorie(categorie);
    setOpenDeleteDialog(true);
  };

  /* ================= PAGINATION ================= */

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - categories.length)
      : 0;

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>

      {/* -------- SEARCH -------- */}
      <Toolbar>
        <TextField
          size="small"
          placeholder="Rechercher une catégorie"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>

      {/* -------- TABLE -------- */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={
                      categories.length > 0 &&
                      selected.length === categories.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell padding="checkbox">
                      <CustomCheckbox
                        checked={selected.includes(row.id)}
                      />
                    </TableCell>

                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description || '-'}</TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenEdit(row)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDelete(row)}
                        >
                          Supprimer
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>

      {/* -------- DIALOGS -------- */}
      <EditCategorieDialog
        open={openEditDialog}
        categorie={selectedCategorie}
        onClose={() => setOpenEditDialog(false)}
        onUpdated={fetchCategories}
      />

      <DeleteCategorieDialog
        open={openDeleteDialog}
        categorie={selectedCategorie}
        onClose={() => setOpenDeleteDialog(false)}
        onDeleted={fetchCategories}
      />
    </Box>
  );
};

export default SchoolCategoriesTableList;
