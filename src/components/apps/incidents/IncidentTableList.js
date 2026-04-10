import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper, Typography, Button, Avatar, Divider, Slide, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { IconSearch, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../forms/theme-elements/CustomSwitch';
import { IncidentContext } from '../../../context/IncidentContext';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Icônes selon type
const typeIconMap = {
  'moral': <IconAlertCircle size={20} color="#1976d2" />,
  'autre': <IconCheck size={20} color="#388e3c" />,
};

const IncidentTableList = () => {
  const [schools, setSchools] = useState([]);
  const { incidents, search, handleSearch } = useContext(IncidentContext);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const data = incidents ?? [];
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);
  const [allActions, setAllActions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/actions/`);
        if (!res.ok) throw new Error("Erreur lors du chargement des actions");
        const data = await res.json();
        setAllActions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setAllActions([]);
      }
    };
    fetchActions();
  }, [apiUrl]);
  useEffect(() => {
  const fetchSchools = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/schools/`);
      if (!res.ok) throw new Error("Erreur schools");
      const data = await res.json();
      setSchools(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
      setSchools([]);
    }
  };

  fetchSchools();
}, [apiUrl]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  };
const getSchoolName = (schoolId) => {
  const school = schools.find(s => s.id === schoolId);
  return school ? school.name : "N/A";
};
  const handleOpenDialog = (incident) => {
    setSelectedIncident(incident);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIncident(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // ---------------- Excel (tous les incidents) ----------------
  const handleDownloadExcelAll = () => {
    const worksheetData = data.map((inc) => ({
      Élève: inc.student,
      Genre: inc.gender,
      "Date de naissance": inc.dob_student,
      Adresse: inc.add_student,
      "Nom du père": inc.father_name,
      "Nom de la mère": inc.mather_name,
      Tuteur: inc.tutor_name,
      Téléphone: inc.tel,
      Lieu: inc.place,
      Type: inc.type,
      "Date de l'incident": new Date(inc.date_incident).toLocaleString(),
      Narration: inc.narration,
      State: inc.state ? "Traité" : "Non traité",
      Actions: inc.actions.map(a => a.name).join(", "),
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Incidents");
    XLSX.writeFile(wb, "incidents.xlsx");
  };

  // ---------------- Excel (incident particulier) ----------------
  const handleDownloadExcelIncident = (incident) => {
    const worksheetData = [{
      Élève: incident.student,
      Genre: incident.gender,
      "Date de naissance": incident.dob_student,
      Adresse: incident.add_student,
      "Nom du père": incident.father_name,
      "Nom de la mère": incident.mather_name,
      Tuteur: incident.tutor_name,
      Téléphone: incident.tel,
      Lieu: incident.place,
      Type: incident.type,
      "Date de l'incident": new Date(incident.date_incident).toLocaleString(),
      Narration: incident.narration,
      State: incident.state ? "Traité" : "Non traité",
      Actions: incident.actions.map(a => a.name).join(", "),
    }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(wb, ws, `Incident_${incident.id}`);
    XLSX.writeFile(wb, `incident_${incident.id}.xlsx`);
  };

  // ---------------- Media (ZIP) ----------------
  const handleDownloadMedia = async (incident) => {
    if (!incident.picture || incident.picture.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder(`incident_${incident.id}_media`);

    await Promise.all(
      incident.picture.map(async (pic) => {
        const url = `https://app-educollect-7113fe5825d7.herokuapp.com${pic}`;
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          folder.file(pic.split("/").pop(), blob);
        } catch (err) {
          console.error(`Erreur téléchargement fichier ${pic}:`, err);
        }
      })
    );

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `incident_${incident.id}_media.zip`);
    });
  };

  return (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
        <Button variant="contained" color="success" onClick={handleDownloadExcelAll}>
          Exporter en Excel 
        </Button>
      </Toolbar>

      <Paper>
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Élève</TableCell>
                <TableCell>Date de naissance</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Lieu</TableCell>
                <TableCell>Ecole</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Voir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                const isItemSelected = selected.includes(row.id);
                return (
                  <TableRow key={row.id} hover selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <CustomCheckbox checked={isItemSelected} />
                    </TableCell>
                    <TableCell>{row.student}</TableCell>
                    <TableCell>{row.dob_student}</TableCell>
                    <TableCell>{row.add_student}</TableCell>
                    <TableCell>{row.tel}</TableCell>
                    <TableCell>{row.place}</TableCell>
                    <TableCell>
                        {getSchoolName(row.school)}
                      </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.state ? "Traité" : "Non traité"}</TableCell>
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleOpenDialog(row)}>Afficher</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      <Box ml={2}>
        <CustomSwitch checked={dense} onChange={(e) => setDense(e.target.checked)} />
      </Box>

      {/* DIALOG DETAIL INCIDENT */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', bgcolor: '#f3f6f9', boxShadow: 5 } }}
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>
          Détails de l'incident
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {selectedIncident && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box display="flex" justifyContent="center" mt={2} mb={1}>
                <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, fontSize: 36, border: '2px solid #90caf9' }}>
                  {typeIconMap[selectedIncident.type?.toLowerCase()] || <IconAlertCircle size={36} color="#fff" />}
                </Avatar>
              </Box>

              <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ color: '#0d47a1' }}>
                {selectedIncident.student}
              </Typography>

              <Divider />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Typography><strong>Date de naissance:</strong> {selectedIncident.dob_student}</Typography>
                <Typography><strong>Téléphone:</strong> {selectedIncident.tel}</Typography>
                <Typography><strong>Adresse:</strong> {selectedIncident.add_student}</Typography>
                <Typography><strong>Lieu:</strong> {selectedIncident.place}</Typography>
                <Typography><strong>Type:</strong> {selectedIncident.type}</Typography>
                <Typography><strong>State:</strong> {selectedIncident.state ? "Traité" : "Non traité"}</Typography>
                <Typography><strong>Date:</strong> {new Date(selectedIncident.date).toLocaleDateString()}</Typography>
                <Typography><strong>Père:</strong> {selectedIncident.father_name}</Typography>
                <Typography><strong>Mère:</strong> {selectedIncident.mather_name}</Typography>
                <Typography><strong>Tuteur:</strong> {selectedIncident.tutor_name}</Typography>
              </Box>

              <Box mt={1}>
                <Typography><strong>Narration:</strong> {selectedIncident.narration || 'Aucune'}</Typography>
              </Box>

              {/* Actions prises */}
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ color: '#1976d2' }}>
                  Actions prises :
                </Typography>
                {selectedIncident.actions && selectedIncident.actions.length > 0 ? (
                  <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                    {selectedIncident.actions.map((action, index) => (
                      <li key={index} style={{ fontSize: '16px' }}>{action.name}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography>Aucune action enregistrée.</Typography>
                )}
              </Box>

              {/* Media download */}
              {selectedIncident.picture && selectedIncident.picture.length > 0 && (
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDownloadMedia(selectedIncident)}
                    sx={{ textTransform: 'none', fontWeight: 600, mr: 1 }}
                  >
                    Télécharger les médias (ZIP)
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => handleDownloadExcelIncident(selectedIncident)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Exporter en excel
                  </Button>
                </Box>
              )}

              {/* Close button */}
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseDialog}
                  sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 2 }}
                >
                  Fermer
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IncidentTableList;