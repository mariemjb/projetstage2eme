import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientListDialog from './Showdetailsdoctor';
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import 'react-toastify/dist/ReactToastify.css';
import './doctors.css';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [patientDoctor, setPatientDoctor] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(response => {
        console.log(response.data); // Pour vérifier les données
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the Doctors!', error);
      });
  }, []);



  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const handleViewDetails = async (doctor) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/doctors/${doctor.idmedecin}/liste`);
        setSelectedDoctor(response.data.doctor);
        setPatientDoctor(response.data.patients);
        setOpenDialog(true);
    } catch (error) {
        console.error('There was an error fetching the doctor details!', error);
    }
};
const transformStatus = (value) => {
  
    return value === 1 ? 'En Congé' : 'Disponible';
  
  
};


  return (
    <div>
      <TableContainer component={Paper} className="table-container1">
        <div className="list-header">
          <h2 className="list-title">Liste Des Docteurs</h2>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id Médecin</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Specialité</TableCell>
              <TableCell>Status Congé</TableCell>
              <TableCell>Études</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Détails</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(doctor => (
              <TableRow key={doctor.idmedecin}>
                <TableCell>
                  
                    {doctor.idmedecin}
                  
                </TableCell>
                
                <TableCell>{doctor.nom}</TableCell>
                <TableCell>{doctor.prenom}</TableCell>
                <TableCell>{doctor.specialite}</TableCell>
                <TableCell>{transformStatus(doctor.statut_congé)}</TableCell>
                <TableCell>{doctor.études}</TableCell>
                <TableCell>{doctor.nom_dept}</TableCell>
                <TableCell>{doctor.libellé}</TableCell>
                <TableCell>
      
                  <Button  startIcon={<OpenInNewIcon />}
                    color="primary" 
                    onClick={() => handleViewDetails(doctor)}
                  >
                    Détails
                  </Button>
                </TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PatientListDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        doctor={selectedDoctor}
        patients={patientDoctor}
      />
    </div>
  );
}

export default DoctorsList;
