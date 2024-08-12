import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import './showdetails.css';
const PatientDetailsDialog = ({ open, handleClose, patient, antecedents = [], habits = [] }) => {
  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle>Détails du Patient</DialogTitle>
      <DialogContent>
        <p><strong>Matricule:</strong> {patient?.matricule}</p>
        <p><strong>Nom:</strong> {patient?.nom}</p>
        <p><strong>Prénom:</strong> {patient?.prenom}</p>

        <Typography variant="h6">Antécédents Médicaux</Typography>
        {antecedents.length > 0 ? (
          <ul> 
            {antecedents.map(antecedent => (
               <li key={antecedent.idantecedant}>
               {antecedent.libelle_antecedant} 
                 <br/>Ancienneté: {antecedent.anciennete}
                 <br/>Traitement: {antecedent.traitement}
                 <br/> Équilibre: {antecedent.equilibre ? 'Oui' : 'Non'}
                 <br/>  Description: {antecedent.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun antécédent médical trouvé</p>
        )}

        <Typography variant="h6">Habitudes</Typography>
        {habits.length > 0 ? (
          <ul>
            {habits.map(habit => (
              <li key={habit.idhabitude}>
                {habit.libelle} <br/> Quantité: {habit.quantite}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune habitude trouvée</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDetailsDialog;
