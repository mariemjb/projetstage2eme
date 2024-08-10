// PatientEditDialog.js
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import './dialog.css';
function PatientEditDialog({ open, handleClose, patient, handleChange, handleSubmit, handleFileChange }) {
  return (
    <Dialog open={open} onClose={handleClose}  PaperProps={{
        className: 'custom-dialog-paper',
      }}>
      <DialogTitle>Modifier Patient</DialogTitle>
      <DialogContent>
        {patient && (
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              label="Matricule"
              type="text"
              name="matricule"
              value={patient.matricule}
              onChange={handleChange}
              fullWidth
              required
              disabled
            />
            <TextField
              margin="dense"
              label="Nom"
              type="text"
              name="nom"
              value={patient.nom}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Prénom"
              type="text"
              name="prenom"
              value={patient.prenom}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Sexe</InputLabel>
              <Select
                name="sexe"
                value={patient.sexe}
                onChange={handleChange}
                required
              >
                <MenuItem value="M">Homme</MenuItem>
                <MenuItem value="F">Femme</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Date de Naissance"
              type="date"
              name="date_de_naissance"
              value={patient.date_de_naissance ? patient.date_de_naissance.slice(0, 10) : ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Âge"
              type="number"
              name="age"
              value={patient.age}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Adresse"
              type="text"
              name="adresse"
              value={patient.adresse}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Nationalité"
              type="text"
              name="nationalite"
              value={patient.nationalite}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Gouvernorat"
              type="text"
              name="gouvernorat"
              value={patient.gouvernorat}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Téléphone Domicile"
              type="text"
              name="tel_domicile"
              value={patient.tel_domicile}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Téléphone Portable"
              type="text"
              name="tel_portable"
              value={patient.tel_portable}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Profession"
              type="text"
              name="profession"
              value={patient.profession}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Taille"
              type="text"
              name="taille"
              value={patient.taille}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Poids"
              type="text"
              name="poids"
              value={patient.poids}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Globules Rouges"
              type="text"
              name="globule_rouge"
              value={patient.globule_rouge}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Statut Marital</InputLabel>
              <Select
                name="marie"
                value={patient.marie}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Marié(e)</MenuItem>
                <MenuItem value={0}>Célibataire</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Vie Seul</InputLabel>
              <Select
                name="vie_seul"
                value={patient.vie_seul}
                onChange={handleChange}
                required
              >
                <MenuItem value={1}>Oui</MenuItem>
                <MenuItem value={0}>Non</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" component="label" margin="dense" fullWidth>
                Télécharger le PDF
            <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            <OpenInNewIcon /> {/* Use the icon here */}
            </Button>

            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Annuler
              </Button>
              <Button type="submit" color="primary">
                Enregistrer
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PatientEditDialog;
