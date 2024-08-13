import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import './showdetails.css';
import { format } from 'date-fns';
const PatientListDialog = ({ open, handleClose, doctor, patients = [] }) => {
    
  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle>Liste Des patients</DialogTitle>
      <DialogContent>
        <p><strong>Id Médecin:</strong> {doctor?.matricule}</p>
        <p><strong>Nom:</strong> {doctor?.nom}</p>
        <p><strong>Prénom:</strong> {doctor?.prenom}</p>

        <Typography variant="h6">Les Patients</Typography>
        {patients.length > 0 ? (
          <ul> 
            {patients.map(patient => (
               <li key={patient.matricule}>
               {patient.matricule} 
                 <br/>Nom: {patient.nom}
                 <br/>Prénom: {patient.prenom}
                 <br/>Date Consultation: {format(new Date(patient.date), 'dd-MM-yyyy HH:mm:ss')}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun patient trouvé</p>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientListDialog;
