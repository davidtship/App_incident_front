import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';

const EditEcoleDialog = ({
  open,
  onClose,
  ecole,
  regions,
  categories,
  onUpdated
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    num_affect: '',
    address: '',
    contact: '',
    gerant: '',
    num_gerant: '',
    region: '',
    categorie: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 🔹 Pré-remplissage
  useEffect(() => {
    if (ecole) {
      setFormData({
        name: ecole.name || '',
        num_affect: ecole.num_affect || '',
        address: ecole.address || '',
        contact: ecole.contact || '',
        gerant: ecole.gerant || '',
        num_gerant: ecole.num_gerant || '',
        region: ecole.region || '',
        categorie: ecole.categorie || '',
      });
    }
  }, [ecole]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 UPDATE
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(
        `${apiUrl}/api/schools/${ecole.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      setSuccess(true);
      onUpdated();

      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 800);

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (!ecole) return null;

  return (
    <Dialog open={open} onClose={loading ? null : onClose} maxWidth="md" fullWidth>
      <DialogTitle>Modifier l’école</DialogTitle>

      {/* 🔄 BARRE DE PROGRESSION */}
      {loading && <LinearProgress />}

      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Modification réussie</Alert>}

          <TextField label="Nom de l’école" name="name" value={formData.name} onChange={handleChange} fullWidth disabled={loading} />
          <TextField label="Numéro d’affectation" name="num_affect" value={formData.num_affect} onChange={handleChange} fullWidth disabled={loading} />
          <TextField label="Adresse" name="address" value={formData.address} onChange={handleChange} fullWidth disabled={loading} />
          <TextField label="Contact" name="contact" value={formData.contact} onChange={handleChange} fullWidth disabled={loading} />
          <TextField label="Gérant" name="gerant" value={formData.gerant} onChange={handleChange} fullWidth disabled={loading} />
          <TextField label="Téléphone gérant" name="num_gerant" value={formData.num_gerant} onChange={handleChange} fullWidth disabled={loading} />

          <TextField
            select
            label="Région"
            name="region"
            value={formData.region}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          >
            {regions.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Catégorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} color="inherit" />}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEcoleDialog;
