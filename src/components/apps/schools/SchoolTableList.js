import React, { useContext, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TableSortLabel, Toolbar, TextField, InputAdornment,
  Paper, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, Avatar, Divider, Slide
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../forms/theme-elements/CustomSwitch';
import { IconSearch, IconCheck, IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react';

import { IncidentContext } from '../../../context/IncidentContext';

// Animation du dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const typeIconMap = {
  'physique': <IconAlertTriangle size={20} color="#d32f2f" />,
  'moral': <IconAlertCircle size={20} color="#1976d2" />,
  'autre': <IconCheck size={20} color="#388e3c" />,
};


const IncidentTableList = () => {
  const { incidents, search, handleSearch } = useContext(IncidentContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(incidents.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else newSelected = selected.filter((s) => s !== id);
    setSelected(newSelected);
  };

  const handleOpenDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIncident(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - incidents.length) : 0;

  return (
    <Box>
      <Toolbar>
        <TextField
          placeholder="Rechercher un incident"
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

      <Paper>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selected.length === incidents.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {['Élève', 'Date de naissance', 'Adresse', 'Téléphone', 'Lieu', "Type d'incident", 'Date', 'Voir'].map((label, idx) => (
                  <TableCell key={idx}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = selected.indexOf(row.id) !== -1;
                  return (
                    <TableRow key={row.id} hover selected={isItemSelected}>
                      <TableCell padding="checkbox"><CustomCheckbox checked={isItemSelected} /></TableCell>
                      <TableCell>{row.student}</TableCell>
                      <TableCell>{row.dob_student}</TableCell>
                      <TableCell>{row.add_student}</TableCell>
                      <TableCell>{row.tel}</TableCell>
                      <TableCell>{row.place}</TableCell>
                      <TableCell>{typeIconMap[row.type?.toLowerCase()] || <IconCheck size={20} color="#388e3c" />} {row.type}</TableCell>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(row)}>Afficher</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
          count={incidents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      <Box ml={2}>
        <CustomSwitch checked={dense} onChange={(e) => setDense(e.target.checked)} />
        <Typography display="inline" ml={1}>Dense padding</Typography>
      </Box>

      {/* Dialog avec animation et style pro */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700 }}>
          Détails de l'incident
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          {selectedIncident && (
            <Paper elevation={6} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', animation: 'fadeIn 0.3s ease' }}>
              <Stack spacing={2}>
                {/* Avatar / Icon selon type */}
                <Box display="flex" justifyContent="center">
                  <Avatar
                    sx={{
                      bgcolor: '#1976d2',
                      width: 80,
                      height: 80,
                      fontSize: 36,
                      mb: 2,
                    }}
                  >
                    {typeIconMap[selectedIncident.type?.toLowerCase()] || <IconCheck size={28} color="#fff" />}
                  </Avatar>
                </Box>

                <Typography variant="h6" fontWeight={700}>{selectedIncident.student}</Typography>
                <Divider />
                <Typography><strong>Date de naissance:</strong> {selectedIncident.dob_student}</Typography>
                <Typography><strong>Adresse:</strong> {selectedIncident.add_student}</Typography>
                <Typography><strong>Téléphone:</strong> {selectedIncident.tel}</Typography>
                <Typography><strong>Lieu:</strong> {selectedIncident.place}</Typography>
                <Typography><strong>Type d'incident:</strong> {selectedIncident.type}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedIncident.date).toLocaleDateString()}</Typography>
                <Typography><strong>Narration:</strong> {selectedIncident.narration}</Typography>

                {/* Timeline actions */}
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>Actions prises:</Typography>
                  {selectedIncident.actionTaken && selectedIncident.actionTaken.length > 0 ? (
                    <Stack spacing={2} sx={{ maxHeight: 200, overflowY: 'auto', pr: 1 }}>
                      {selectedIncident.actionTaken.map((action, index) => (
                        <Paper key={index} sx={{ p: 1, borderRadius: 2, bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.3s ease', '&:hover': { bgcolor: '#bbdefb', transform: 'scale(1.02)' } }}>
                          <Avatar sx={{ bgcolor: '#1976d2', width: 28, height: 28 }}>
                            <IconCheck size={18} color="#fff" />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={500}>{action.measure}</Typography>
                            <Typography variant="caption" color="textSecondary">Date: {new Date(action.date).toLocaleDateString()}</Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Typography>Aucune action enregistrée.</Typography>
                  )}
                </Box>
              </Stack>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IncidentTableList;
