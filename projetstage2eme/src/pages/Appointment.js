// src/pages/Appointments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointments.css'; // Assurez-vous d'importer les styles CSS si nécessaire

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visibleDoctor, setVisibleDoctor] = useState(null);
  const [visiblePatient, setVisiblePatient] = useState(null);

  // Fetch appointments when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/getappointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  // Fetch doctor details
  const fetchDoctorDetails = (id) => {
    axios.get(`http://localhost:5000/api/doctor/${id}`)
      .then(response => {
        setSelectedDoctor(response.data);
        setVisibleDoctor(prev => (prev === id ? null : id)); // Toggle visibility
      })
      .catch(error => console.error('Error fetching doctor details:', error));
  };

  // Fetch patient details
  const fetchPatientDetails = (id) => {
    axios.get(`http://localhost:5000/api/patient/${id}`)
      .then(response => {
        setSelectedPatient(response.data);
        setVisiblePatient(prev => (prev === id ? null : id)); // Toggle visibility
      })
      .catch(error => console.error('Error fetching patient details:', error));
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Liste des Rendez-vous</h2>
      <div className="appointments-table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>ID Médecin</th>
              <th>ID Patient</th>
              <th>Date et Heure</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => fetchDoctorDetails(appt.id_medecin)}>
                    {appt.id_medecin}
                  </button>
                </td>
                <td>
                  <button onClick={() => fetchPatientDetails(appt.id_patient)}>
                    {appt.id_patient}
                  </button>
                </td>
                <td>{new Date(appt.date_rendez_vous).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoctor && visibleDoctor === selectedDoctor.idmedecin && (
        <div className="details-container">
          <h3>Détails du Médecin</h3>
          <p><strong>ID:</strong> {selectedDoctor.idmedecin}</p>
          <p><strong>Nom:</strong> {selectedDoctor.nom}</p>
          <p><strong>Prénom:</strong> {selectedDoctor.prenom}</p>
          {/* Ajoutez d'autres détails ici */}
        </div>
      )}

      {selectedPatient && visiblePatient === selectedPatient.matricule && (
        <div className="details-container">
          <h3>Détails du Patient</h3>
          <p><strong>Matricule:</strong> {selectedPatient.matricule}</p>
          <p><strong>Nom:</strong> {selectedPatient.nom}</p>
          <p><strong>Prénom:</strong> {selectedPatient.prenom}</p>
          {/* Ajoutez d'autres détails ici */}
        </div>
      )}
    </div>
  );
}

export default Appointments;