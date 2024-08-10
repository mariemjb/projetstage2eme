
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './book-appointment.css';  // Assurez-vous que le chemin est correct

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [patient, setPatient] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  // Fetch doctors and patients when the component mounts
  useEffect(() => {
    // Fetch doctors
    axios.get('http://localhost:5000/api/doctors')
      .then(response => setDoctors(response.data))
      .catch(error => console.error('Error fetching doctors:', error));

    // Fetch patients
    axios.get('http://localhost:5000/api/patients')
      .then(response => setPatients(response.data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check availability of the selected doctor
      const availabilityResponse = await axios.get(`http://localhost:5000/api/check-availability/${doctor}/${date}`);
      if (!availabilityResponse.data.available) {
        setMessage('Le médecin n\'est pas disponible à cette date.');
        return;
      }

      // Create the appointment
      await axios.post('http://localhost:5000/api/appointments', { id_medecin: doctor, id_patient: patient, date_rendez_vous: date });
      setMessage('Rendez-vous pris avec succès.');

      // Reset form
      setDoctor('');
      setPatient('');
      setDate('');
    } catch (error) {
      console.error('Error creating appointment:', error);
      setMessage('Erreur lors de la prise de rendez-vous.');
    }
  };

  return (
    <div className="book-appointment-container">
      <h2>Prendre un Rendez-vous</h2>
      <form className="book-appointment-form" onSubmit={handleSubmit}>
        <div className="book-appointment-group">
          <label>Patient:</label>
          <select value={patient} onChange={(e) => setPatient(e.target.value)} required>
            <option value="">Sélectionner un patient</option>
            {patients.map(p => (
              <option key={p.matricule} value={p.matricule}>
                {p.nom} {p.prenom} (Matricule: {p.matricule})
              </option>
            ))}
          </select>
        </div>
        <div className="book-appointment-group">
          <label>Médecin:</label>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
            <option value="">Sélectionner un médecin</option>
            {doctors.map(d => (
              <option key={d.idmedecin} value={d.idmedecin}>
                {d.nom} {d.prenom} (ID: {d.idmedecin})
              </option>
            ))}
          </select>
        </div>
        <div className="book-appointment-group">
          <label>Date:</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit" className="book-appointment-submit-button">Prendre Rendez-vous</button>
      </form>
      {message && <p className="book-appointment-message">{message}</p>}
    </div>
  );
}

export default BookAppointment;
