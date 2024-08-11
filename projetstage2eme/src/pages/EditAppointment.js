import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditAppointment() {
  const urlParams = new URLSearchParams(window.location.search);
  const id_medecin = urlParams.get('id_medecin');
  const id_patient = urlParams.get('id_patient');
  const initialDate = urlParams.get('date_rendez_vous');
  
  const [newDate, setNewDate] = useState(initialDate);

  const handleEditAppointment = () => {
    axios.put(`http://localhost:5000/api/appointments`, {
      id_medecin,
      matricule: id_patient,
      date_rendez_vous: newDate
    })
    .then(() => {
      window.close(); // Close the popup after saving
    })
    .catch(error => console.error('Error updating appointment:', error));
  };

  return (
    <div>
      <h3>Modifier le Rendez-vous</h3>
      <label>Date et Heure:</label>
      <input
        type="datetime-local"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <button onClick={handleEditAppointment}>Sauvegarder</button>
      <button onClick={() => window.close()}>Fermer</button>
    </div>
  );
}

export default EditAppointment;
