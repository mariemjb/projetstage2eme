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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PatientEditDialog from './PatientEditDialog'; // Import du composant
import PatientDetailsDialog from './Showdetailspatient';
import './list.css';

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientEdit, setSelectedPatientEdit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [patientAntecedents, setPatientAntecedents] = useState([]);
  const [patientHabits, setPatientHabits] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the patients!', error);
      });
  }, []);
  useEffect(() => {
    if (selectedPatient && selectedPatient.matricule) {
      axios.get(`http://localhost:5000/api/patients/${selectedPatient.matricule}/details`)
        .then(response => {
          setSelectedPatient(response.data.patient);
          setPatientAntecedents(response.data.antecedents);
          setPatientHabits(response.data.habits);
          console.log('Patient:', response.data.patient);
          console.log('Antecedents:', response.data.antecedents);
          console.log('Habits:', response.data.habits);
        })
        .catch(error => console.error('Error fetching patient details:', error));
    }
  }, []);
  useEffect(() => {
    if (selectedPatientEdit && selectedPatientEdit.matricule) {
      axios.get(`http://localhost:5000/api/patients/${selectedPatientEdit.matricule}`)
        .then(response => {
          setSelectedPatientEdit(response.data.patient);
          console.log('Patient:', response.data.patient);
        })
        .catch(error => console.error('Error fetching patient details:', error));
    }
  }, []);
  const handleEdit = (patient) => {
    setSelectedPatientEdit(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatientEdit(null);
  };
  const handleCloseDialogdetails = () => {
    setOpenDetailsDialog(false);
    setSelectedPatient(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPatientEdit({
      ...selectedPatientEdit,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    console.log('File Change:', e.target.files[0]);
    setSelectedPatientEdit({
        ...selectedPatientEdit,
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
        Object.keys(selectedPatientEdit).forEach(key => {
            if (key === 'pdf') {
                if (selectedPatientEdit[key]) {
                    formDataToSend.append(key, selectedPatientEdit[key]);
                }
            } else if (key === 'date_de_naissance') {
                formDataToSend.append(key, formatDateForDb(selectedPatientEdit[key]));
            } else {
                formDataToSend.append(key, selectedPatientEdit[key]);
            }
        });

        // Log the form data to inspect its content
        for (let [key, value] of formDataToSend.entries()) {
            console.log(key, value);
        }

        const response = await axios.put(`http://localhost:5000/api/patients/${selectedPatientEdit.matricule}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        setPatients(patients.map(patient => patient.matricule === selectedPatientEdit.matricule ? response.data : patient));
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

        // Display success toast
        toast.success('Patient supprimé avec succès !', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(error => {
          // Display error toast for appointment case
          toast.error('Ce patient ne peut pas être supprimé car il a un rendez-vous.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        console.error('There was an error deleting the patient!', error);
      });
  }
};
const handleViewDetails = async (patient) => {
  try {
    // Clear previous selected patient data to avoid showing stale data
    setSelectedPatient(null);
    setPatientAntecedents([]);
    setPatientHabits([]);

    // Fetch new patient details
    const response = await axios.get(`http://localhost:5000/api/patients/${patient.matricule}/details`);

    // Set the new patient data after fetching
    setSelectedPatient(response.data.patient);
    setPatientAntecedents(response.data.antecedents);
    setPatientHabits(response.data.habits);

    // Open the dialog to display patient details
    setOpenDetailsDialog(true);
  } catch (error) {
    console.error('There was an error fetching the patient details!', error);
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
            <div className="table-wrapper">
                <TableContainer component={Paper} className="table-container">
                    <div className="list-header">
                        <h2 className="list-title">Liste Des Patient</h2>
                    </div>
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
                                    <TableCell>
                                        <p
                                            style={{ cursor: "pointer", color: "blue" }}
                                            onClick={() => handleViewDetails(patient)}
                                        >
                                            {patient.matricule}
                                        </p>
                                    </TableCell>
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
            </div>
            <ToastContainer />

            {/* Dialog de modification */}
            <PatientEditDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                patient={selectedPatientEdit}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleFileChange={handleFileChange}
            />
            <PatientDetailsDialog
                open={openDetailsDialog}
                handleClose={handleCloseDialogdetails}
                patient={selectedPatient}
                antecedents={patientAntecedents}
                habits={patientHabits}
            />
        </div>
    );
}

export default PatientsList;
