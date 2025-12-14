import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';

const DeleteEcoleDialog = ({
  open,
  onClose,
  ecole,
  onDeleted
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${apiUrl}/api/schools/${ecole.id}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      onDeleted();
      onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!ecole) return null;

  return (
    <Dialog open={open} onClose={loading ? null : onClose}>
      <DialogTitle>Supprimer l’école</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography>
            Voulez-vous vraiment supprimer l’école :
            <strong> {ecole.name}</strong> ?
          </Typography>

          <Typography color="error" variant="body2">
            ⚠️ Cette action est irréversible.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} color="inherit" />}
        >
          {loading ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteEcoleDialog;
