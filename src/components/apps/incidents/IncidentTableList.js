import React, { useContext, useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper, IconButton, Typography, Button, Avatar, Divider, Slide, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import { IconSearch, IconDownload, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../forms/theme-elements/CustomSwitch';
import { IncidentContext } from '../../../context/IncidentContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Icônes selon type
const typeIconMap = {
  'moral': <IconAlertCircle size={20} color="#1976d2" />,
  'autre': <IconCheck size={20} color="#388e3c" />,
};

const IncidentTableList = () => {
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

  // Charger toutes les actions depuis l'API
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
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

  // ---------------- PDF ----------------
  const handleDownloadPDF = async (incident) => {
    if (!incident) return;
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    let y = margin;

    doc.setFillColor(25, 118, 210);
    doc.rect(0, 0, pageWidth, 70, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#fff');
    doc.text('Rapport d’Incident', pageWidth / 2, 45, { align: 'center' });

    y += 90;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1976d2');
    doc.text('Informations Élève', margin, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    const infoLines = [
      `Nom: ${incident.student}`,
      `Date de naissance: ${incident.dob_student}`,
      `Téléphone: ${incident.tel}`,
      `Adresse: ${incident.add_student}`,
      `Lieu: ${incident.place}`,
      `Type: ${incident.type}`,
      `État: ${incident.state ? "Traité" : "Non traité"}`,
      `Date: ${new Date(incident.date).toLocaleDateString()}`
    ];
    infoLines.forEach(line => { doc.text(line, margin, y); y += 18; });

    y += 10;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#388e3c');
    doc.text('Narration', margin, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    const narrationLines = doc.splitTextToSize(incident.narration || 'Aucune', pageWidth - margin * 2);
    doc.text(narrationLines, margin, y);
    y += narrationLines.length * 18 + 10;

    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#d84315');
    doc.text('Actions prises', margin, y);
    y += 20;

    const actionsList = Array.isArray(incident.actions) ? incident.actions : [];
    actionsList.forEach(actionId => {
      const idNum = typeof actionId === 'string' ? parseInt(actionId, 10) : actionId;
      const action = allActions.find(a => a.id === idNum);
      const line = `• ${action ? action.name : `ID inconnu (${actionId})`}`;
      const textLines = doc.splitTextToSize(line, pageWidth - margin * 2);
      doc.setTextColor('#000');
      doc.text(textLines, margin, y);
      y += textLines.length * 18;
    });

    const dateStr = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Rapport généré le ${dateStr}`, pageWidth / 2, doc.internal.pageSize.height - 20, { align: 'center' });

    doc.save(`incident_${incident.id}.pdf`);
  };

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
                    checked={selected.length === data.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>Élève</TableCell>
                <TableCell>Date de naissance</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Lieu</TableCell>
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
    {selectedIncident.actions.map((actionId, index) => {
      // Convertir en nombre pour être sûr
      const idNum = Number(actionId); 
      // Chercher dans allActions par id
      const action = allActions.find(a => Number(a.id) === idNum);
      return (
        <li key={index} style={{ fontSize: '16px' }}>
          {action ? action.name : `${actionId.name}`}
        </li>
      );
    })}
  </ul>
) : (
  <Typography>Aucune action enregistrée.</Typography>
)}

              </Box>

              {/* Actions buttons */}
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 1 }}
                  onClick={() => handleDownloadPDF(selectedIncident)}
                >
                  Télécharger PDF
                </Button>
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
