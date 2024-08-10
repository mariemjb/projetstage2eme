import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import './list.css';

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the patients!', error);
      });
  }, []);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPatient({
      ...selectedPatient,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedPatient({
      ...selectedPatient,
      pdf: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      Object.keys(selectedPatient).forEach(key => {
        if (key === 'pdf') {
          if (selectedPatient[key]) {
            formDataToSend.append(key, selectedPatient[key]);
          }
        } else {
          formDataToSend.append(key, selectedPatient[key]);
        }
      });
  
      const response = await axios.put(`http://localhost:5000/api/patients/${selectedPatient.matricule}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPatients(patients.map(patient => patient.matricule === selectedPatient.matricule ? response.data : patient));
      console.log('Update Response:', response.data); // Log the update response
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };
  
  const handleDelete = (matricule) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      axios.delete(`http://localhost:5000/api/patients/${matricule}`)
        .then(response => {
          setPatients(patients.filter(patient => patient.matricule !== matricule));
        })
        .catch(error => {
          console.error('There was an error deleting the patient!', error);
        });
    }
  };

  const transformStatus = (value, type) => {
    if (type === 'marie') {
      return value === 1 ? 'Marié(e)' : 'Célibataire';
    } else if (type === 'vie_seul') {
      return value === 1 ? 'Oui' : 'Non';
    }
    return 'Inconnu';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matricule</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Sexe</TableCell>
              <TableCell>Date de Naissance</TableCell>
              <TableCell>Âge</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Nationalité</TableCell>
              <TableCell>Gouvernorat</TableCell>
              <TableCell>Téléphone Domicile</TableCell>
              <TableCell>Téléphone Portable</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Taille</TableCell>
              <TableCell>Poids</TableCell>
              <TableCell>Globules Rouges</TableCell>
              <TableCell>Marié</TableCell>
              <TableCell>Vie Seul</TableCell>
              <TableCell>Dossier Medical</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {patients.map(patient => (
    <TableRow key={patient.matricule}>
      <TableCell>{patient.matricule}</TableCell>
      <TableCell>{patient.nom}</TableCell>
      <TableCell>{patient.prenom}</TableCell>
      <TableCell>{patient.sexe}</TableCell>
      <TableCell>{formatDate(patient.date_de_naissance)}</TableCell>
      <TableCell>{patient.age}</TableCell>
      <TableCell>{patient.adresse}</TableCell>
      <TableCell>{patient.nationalite}</TableCell>
      <TableCell>{patient.gouvernorat}</TableCell>
      <TableCell>{patient.tel_domicile}</TableCell>
      <TableCell>{patient.tel_portable}</TableCell>
      <TableCell>{patient.profession}</TableCell>
      <TableCell>{patient.taille}</TableCell>
      <TableCell>{patient.poids}</TableCell>
      <TableCell>{patient.globule_rouge}</TableCell>
      <TableCell>{transformStatus(patient.marie, 'marie')}</TableCell>
      <TableCell>{transformStatus(patient.vie_seul, 'vie_seul')}</TableCell>
      <TableCell>
        {patient.dossier_medical ? (
          <a href={`http://localhost:5000/uploads/${patient.dossier_medical}`} target="_blank" rel="noopener noreferrer">
            <Button startIcon={<OpenInNewIcon />}>Ouvrir</Button>
          </a>
        ) : 'Pas de dossier'}
      </TableCell>
      <TableCell>
        <Button 
          color="primary" 
          onClick={() => handleEdit(patient)} 
          startIcon={<EditIcon />}
        />
      </TableCell>
      <TableCell>
        <Button 
          color="secondary" 
          onClick={() => handleDelete(patient.matricule)} 
          startIcon={<DeleteIcon />}
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      {/* Dialog de modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Modifier Patient</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <form onSubmit={handleSubmit}>
              <TextField
                margin="dense"
                label="Matricule"
                type="text"
                name="matricule"
                value={selectedPatient.matricule}
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
                value={selectedPatient.nom}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Prénom"
                type="text"
                name="prenom"
                value={selectedPatient.prenom}
                onChange={handleChange}
                fullWidth
                required
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Sexe</InputLabel>
                <Select
                  name="sexe"
                  value={selectedPatient.sexe}
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
              value={selectedPatient.date_de_naissance ? selectedPatient.date_de_naissance.slice(0, 10) : ''}
              onChange={handleChange}
              fullWidth
              required
              />

              <TextField
                margin="dense"
                label="Âge"
                type="number"
                name="age"
                value={selectedPatient.age}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Adresse"
                type="text"
                name="adresse"
                value={selectedPatient.adresse}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Nationalité"
                type="text"
                name="nationalite"
                value={selectedPatient.nationalite}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Gouvernorat"
                type="text"
                name="gouvernorat"
                value={selectedPatient.gouvernorat}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Téléphone Domicile"
                type="text"
                name="tel_domicile"
                value={selectedPatient.tel_domicile}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Téléphone Portable"
                type="text"
                name="tel_portable"
                value={selectedPatient.tel_portable}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Profession"
                type="text"
                name="profession"
                value={selectedPatient.profession}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Taille"
                type="text"
                name="taille"
                value={selectedPatient.taille}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Poids"
                type="text"
                name="poids"
                value={selectedPatient.poids}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="Globules Rouges"
                type="text"
                name="globule_rouge"
                value={selectedPatient.globule_rouge}
                onChange={handleChange}
                fullWidth
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Statut Marital</InputLabel>
                <Select
                  name="marie"
                  value={selectedPatient.marie}
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
                  value={selectedPatient.vie_seul}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value={1}>Oui</MenuItem>
                  <MenuItem value={0}>Non</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                component="label"
                margin="dense"
                fullWidth
              >
                Télécharger le PDF
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </Button>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
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
    </div>
  );
}

export default PatientsList;
