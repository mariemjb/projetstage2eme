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
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PatientEditDialog from './PatientEditDialog'; // Import du composant

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

  const formatDateForDb = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};
const refreshPatientsList = async () => {
  try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
  } catch (error) {
      console.error('There was an error fetching the patients!', error);
  }
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
            } else if (key === 'date_de_naissance') {
                formDataToSend.append(key, formatDateForDb(selectedPatient[key]));
            } else {
                formDataToSend.append(key, selectedPatient[key]);
            }
        });

        // Log the form data to inspect its content
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        const response = await axios.put(`http://localhost:5000/api/patients/${selectedPatient.matricule}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setPatients(patients.map(patient => patient.matricule === selectedPatient.matricule ? response.data : patient));
        console.log('Update Response:', response.data); // Log the update response
        // Refresh the patients list after updating
        refreshPatientsList();
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
      <PatientEditDialog 
        open={openDialog} 
        handleClose={handleCloseDialog}
        patient={selectedPatient}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
      />
    </div>
  );
}

export default PatientsList;
