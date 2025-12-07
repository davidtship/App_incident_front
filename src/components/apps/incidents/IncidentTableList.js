import React, { useContext, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, Toolbar, TextField, InputAdornment,
  Paper,IconButton, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, Avatar, Divider, Slide
} from '@mui/material';
import { IconSearch,IconDownload, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import CustomCheckbox from '../../forms/theme-elements/CustomCheckbox';
import CustomSwitch from '../../forms/theme-elements/CustomSwitch';
import { IncidentContext } from '../../../context/IncidentContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Animation Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Icons selon type
const typeIconMap = {
  'moral': <IconAlertCircle size={20} color="#1976d2" />,
  'autre': <IconCheck size={20} color="#388e3c" />,
};

const IncidentTableList = () => {
  const { incidents, search, handleSearch } = useContext(IncidentContext);

  const data = incidents ?? [];

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

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

  // Fonction PDF


const handleDownloadPDF = async (incident) => {
  if (!incident) return;

  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const margin = 40;
  let y = margin;

  // ---------------- HEADER ----------------
  doc.setFillColor(25, 118, 210);
  doc.rect(0, 0, pageWidth, 70, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor('#fff');
  doc.text('Rapport d’Incident', pageWidth / 2, 45, { align: 'center' });
  y += 90;

  // ---------------- INFOS ----------------
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
    `Lieu de l’incident: ${incident.place}`,
    `Type d’incident: ${incident.type}`,
    `Date: ${new Date(incident.date).toLocaleDateString()}`
  ];
  infoLines.forEach(line => { doc.text(line, margin, y); y += 18; });

  y += 10;
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // ---------------- NARRATION ----------------
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

  // ---------------- ACTIONS ----------------
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#d84315');
  doc.text('Actions prises', margin, y);
  y += 20;

  let actions = [];
  try {
    const parsed = JSON.parse(incident.actionTaken[0]);
    if (Array.isArray(parsed)) actions = parsed;
  } catch {
    actions = incident.actionTaken;
  }

  doc.setFont('helvetica', 'normal');
  actions.forEach(action => {
    const actionLines = doc.splitTextToSize(`• ${action}`, pageWidth - margin * 2);
    doc.setTextColor('#000');
    doc.text(actionLines, margin, y);
    y += actionLines.length * 18;
  });

  y += 20;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // ---------------- IMAGES ----------------
if (incident.picture && incident.picture.length > 0) {
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1976d2');
  doc.text('Images capturées', margin, y);
  y += 20;

  const reductionFactor = 0.5; // 50% de taille

  for (let imgUrl of incident.picture) {
    try {
      // Convertir en base64
      const imgData = await getBase64ImageFromURL("https://safeschooldata-6d63cd50a8a3.herokuapp.com" + imgUrl);
      const imgProps = doc.getImageProperties(imgData);
      let pdfWidth = (pageWidth - margin * 2) * reductionFactor;
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Nouvelle page si nécessaire
      if (y + pdfHeight > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = margin;
      }

      doc.addImage(imgData, 'PNG', margin, y, pdfWidth, pdfHeight);
      y += pdfHeight + 10;
    } catch (err) {
      console.error('Erreur image PDF:', err);
    }
  }
}


  // ---------------- FOOTER ----------------
  const dateStr = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor('#555');
  doc.text(`Rapport généré le ${dateStr}`, pageWidth / 2, doc.internal.pageSize.height - 20, { align: 'center' });

  // ---------------- SAVE ----------------
  doc.save(`incident_${incident.id}.pdf`);
};

// Fonction utilitaire pour convertir URL en base64
const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = error => reject(error);
    img.src = url;
  });
};


  return (
    <Box>
      {/* Barre de recherche */}
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

      {/* Tableau */}
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
                {['Élève', 'Date de naissance', 'Adresse', 'Téléphone', 'Lieu', "Type d'incident", 'Date', 'Voir'].map((label, idx) => (
                  <TableCell key={idx}>{label}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const isItemSelected = selected.indexOf(row.id) !== -1;
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
                    <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleOpenDialog(row)}>Afficher</Button>
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

      {/* DIALOG */}
 <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="sm"
  fullWidth
  TransitionComponent={Transition}
  keepMounted
  PaperProps={{
    sx: { borderRadius: 3, overflow: 'hidden', bgcolor: '#f3f6f9', boxShadow: 5 },
  }}
>
  <DialogTitle
    sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center', letterSpacing: 0.5 }}
  >
    Détails de l'incident
  </DialogTitle>

  <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
    {selectedIncident && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Avatar */}
        <Box display="flex" justifyContent="center" mt={2} mb={1}>
          <Avatar
            sx={{ bgcolor: '#1976d2', width: 80, height: 80, fontSize: 36, border: '2px solid #90caf9' }}
          >
            {typeIconMap[selectedIncident.type?.toLowerCase()] || <IconAlertCircle size={36} color="#fff" />}
          </Avatar>
        </Box>

        <Typography variant="h6" fontWeight={700} textAlign="center" sx={{ color: '#0d47a1' }}>
          {selectedIncident.student}
        </Typography>
        <Divider />

        {/* Infos */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          <Typography><strong>Date de naissance:</strong> {selectedIncident.dob_student}</Typography>
          <Typography><strong>Téléphone:</strong> {selectedIncident.tel}</Typography>
          <Typography><strong>Adresse:</strong> {selectedIncident.add_student}</Typography>
          <Typography><strong>Lieu:</strong> {selectedIncident.place}</Typography>
          <Typography><strong>Type d'incident:</strong> {selectedIncident.type}</Typography>
          <Typography><strong>Date:</strong> {new Date(selectedIncident.date).toLocaleDateString()}</Typography>
        </Box>

        {/* Narration */}
        <Box mt={1}>
          <Typography><strong>Narration:</strong> {selectedIncident.narration || 'Aucune'}</Typography>
        </Box>

        {/* Actions */}
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ color: '#1976d2' }}>
            Actions prises :
          </Typography>
          {(() => {
            let actions = [];
            if (selectedIncident.actionTaken && selectedIncident.actionTaken.length > 0) {
              try {
                const parsed = JSON.parse(selectedIncident.actionTaken[0]);
                if (Array.isArray(parsed)) actions = parsed;
              } catch {
                actions = selectedIncident.actionTaken;
              }
            }
            return actions.length > 0 ? (
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                {actions.map((action, index) => (
                  <li key={index} style={{ fontSize: '16px' }}>{action}</li>
                ))}
              </ul>
            ) : <Typography>Aucune action enregistrée.</Typography>;
          })()}
        </Box>

        {/* Images */}
        {selectedIncident.picture && selectedIncident.picture.length > 0 && (
          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ color: '#1976d2' }}>
              Images capturées :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
              {selectedIncident.picture.map((img, idx) => (
                <Box 
  key={idx} 
  sx={{ 
    width: 80,
    height: 80,
    borderRadius: 2, 
    overflow: 'hidden', 
    boxShadow: 2,
    position: 'relative',  // pour positionner le logo
    cursor: 'pointer'
  }}
  onClick={() => {
    // Téléchargement direct
    const link = document.createElement('a');
    link.href = "https://safeschooldata-6d63cd50a8a3.herokuapp.com" + img;
    link.download = img.split('/').pop(); // nom du fichier
    link.click();
  }}
>
  {/* Logo téléchargement */}
  <IconButton
    size="small"
    sx={{ 
      position: 'absolute', 
      top: 4, 
      right: 4, 
      bgcolor: 'rgba(255,255,255,0.7)', 
      p: 0.5, 
      borderRadius: 1 
    }}
  >
    <IconDownload size={16} />
  </IconButton>

  {/* Image */}
  <img
    src={"https://safeschooldata-6d63cd50a8a3.herokuapp.com" + img}
    alt={`Incident ${idx + 1}`}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    }}
  />
</Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Footer avec bouton PDF */}
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
            sx={{ textTransform: 'none', fontWeight: 600, boxShadow: 2, '&:hover': { bgcolor: '#1565c0' } }}
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
