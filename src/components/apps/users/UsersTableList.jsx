import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Stack, MenuItem, Select, FormControl, InputLabel, Chip
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { UserContext } from '../../../context/UsersContext';

import EditUserDialog from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';

const UsersTableList = () => {

  const { users, search, handleSearch } = useContext(UserContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [schools, setSchools] = useState([]);
  const [affectations, setAffectations] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const apiUrl = "https://app-educollect-7113fe5825d7.herokuapp.com";
  const token = localStorage.getItem("access");

  // 🔥 LOAD DATA
  useEffect(() => {

    const fetchData = async () => {
      const [schoolsRes, affRes] = await Promise.all([
        fetch(`${apiUrl}/api/schools/`),
        fetch(`${apiUrl}/api/affectations-users/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const schoolsData = await schoolsRes.json();
      const affData = await affRes.json();

      setSchools(schoolsData.results ?? schoolsData);
      setAffectations(affData.results ?? affData);
    };

    fetchData();

  }, []);

  // 🔥 AFFECTATION
  const getAffectation = (userId) => {
    return affectations.find(a => a.user === userId);
  };

  const getSchoolName = (schoolId) => {
    return schools.find(s => s.id === schoolId)?.name;
  };

  // ✅ ACTIVER / DÉSACTIVER (CORRIGÉ BACKEND CUSTOM ENDPOINT)
  const toggleActive = async (user) => {
    try {
      const res = await fetch(
        `${apiUrl}/auths/activation/${user.id}/toggle-active/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!res.ok) {
        alert("Erreur activation utilisateur");
        return;
      }

      const data = await res.json();

      // update UI sans reload brutal
      const updated = users.map(u =>
        u.id === user.id ? { ...u, is_active: data.is_active } : u
      );

      // option simple : reload (tu peux enlever si store global)
      window.location.reload();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 AFFECTATION OPEN
  const handleOpen = (user) => {
    const existing = getAffectation(user.id);

    setSelectedUser(user);
    setSelectedSchool(existing ? existing.school : '');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedSchool('');
  };

  // 🔥 SAVE AFFECTATION
  const handleSubmit = async () => {

    const existing = getAffectation(selectedUser.id);

    const res = await fetch(`${apiUrl}/api/affectations-users/`, {
      method: existing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(
        existing
          ? { id: existing.id, user: selectedUser.id, school: selectedSchool }
          : { user: selectedUser.id, school: selectedSchool }
      )
    });

    if (!res.ok) {
      alert("Erreur affectation");
      return;
    }

    handleClose();

    const affRes = await fetch(`${apiUrl}/api/affectations-users/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const affData = await affRes.json();
    setAffectations(affData.results ?? affData);
  };

  const filteredData = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>

      {/* SEARCH */}
      <Toolbar sx={{ display: 'flex', gap: 2 }}>
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
            )
          }}
        />
      </Toolbar>

      {/* TABLE */}
      <Paper>
        <TableContainer>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell>Prénom</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Is Staff</TableCell>
                <TableCell>Is Active</TableCell>
                <TableCell>Affectation</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {

                  const aff = getAffectation(user.id);
                  const schoolName = aff ? getSchoolName(aff.school) : null;

                  return (
                    <TableRow key={user.id}>

                      <TableCell>{user.first_name}</TableCell>
                      <TableCell>{user.last_name}</TableCell>
                      <TableCell>{user.email}</TableCell>

                      <TableCell>{user.is_staff ? "Oui" : "Non"}</TableCell>
                      <TableCell>{user.is_active ? "Oui" : "Non"}</TableCell>

                      {/* AFFECTATION */}
                      <TableCell>
                        {aff ? (
                          <Chip label={schoolName} color="success" />
                        ) : (
                          <Chip label="Non affecté" color="warning" />
                        )}
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <Stack direction="row" spacing={1}>

                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setOpenEditDialog(true)}
                          >
                            Modifier
                          </Button>

                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => setOpenDeleteDialog(true)}
                          >
                            Supprimer
                          </Button>

                          <Button
                            variant="contained"
                            size="small"
                            color={aff ? "warning" : "primary"}
                            onClick={() => handleOpen(user)}
                          >
                            {aff ? "Modifier affectation" : "Affecter"}
                          </Button>

                          {/* 🔥 ACTIVER / DÉSACTIVER */}
                          <Button
                            variant="contained"
                            size="small"
                            color={user.is_active ? "error" : "success"}
                            onClick={() => toggleActive(user)}
                          >
                            {user.is_active ? "Désactiver" : "Activer"}
                          </Button>

                        </Stack>
                      </TableCell>

                    </TableRow>
                  );
                })}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

      {/* DIALOG */}
      <Dialog open={openDialog} onClose={handleClose} fullWidth>

        <DialogTitle>Affectation utilisateur</DialogTitle>

        <DialogContent>

          <Typography mb={2}>
            {selectedUser?.first_name} {selectedUser?.last_name}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>École</InputLabel>
            <Select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
            >
              {schools.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Sauvegarder
          </Button>
        </DialogActions>

      </Dialog>

      <EditUserDialog />
      <DeleteUserDialog />

    </Box>
  );
};

export default UsersTableList;