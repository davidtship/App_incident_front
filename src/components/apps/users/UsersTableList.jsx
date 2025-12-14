import React, { useContext, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Divider, Slide, Stack, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import { UserContext } from '../../../context/UsersContext';
import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UsersTableList = () => {
  const { users, search, handleSearch } = useContext(UserContext);

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(users.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  // Filtrage texte
  const filteredData = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  return (
    <Box>
      {/* ---------------- SEARCH ---------------- */}
      <Toolbar sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher un utilisateur"
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
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Is Staff</TableCell>
                <TableCell>Is Active</TableCell>
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
                    <TableCell>{row.first_name}</TableCell>
                    <TableCell>{row.last_name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.is_staff ? 'Oui' : 'Non'}</TableCell>
                    <TableCell>{row.is_active ? 'Oui' : 'Non'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenEditDialog(row)}
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
                  <TableCell colSpan={8} />
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

      {/* ---------------- DIALOGS ---------------- */}
      <EditUserDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        user={selectedUser}
        onUpdated={() => window.location.reload()}
      />
      <DeleteUserDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        user={selectedUser}
        onDeleted={() => window.location.reload()}
      />
    </Box>
  );
};

export default UsersTableList;
