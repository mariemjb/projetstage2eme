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
  const [errorMessage, setErrorMessage] = useState('');

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

  // Function to reset form and messages
  const resetFormAndMessages = () => {
    setTimeout(() => {
      setMessage('');
      setErrorMessage('');
      setDoctor('');
      setPatient('');
      setDate('');
    }, 5000); // 5 seconds delay
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setErrorMessage('');

    try {
      // Check availability of the selected doctor
      const availabilityResponse = await axios.get(`http://localhost:5000/api/check-availability/${doctor}/${date}`);
      if (!availabilityResponse.data.available) {
        setErrorMessage('Médecin non disponible à cette date.');
        resetFormAndMessages();
        return;
      }

      // Create the appointment
      await axios.post('http://localhost:5000/api/appointments', { id_medecin: doctor, id_patient: patient, date_rendez_vous: date });
      setMessage('Rendez-vous pris avec succès.');

      // Reset form fields and messages after success
      resetFormAndMessages();
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrorMessage('Erreur lors de la prise de rendez-vous.');
      resetFormAndMessages();
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the corresponding state
    if (name === 'patient') {
      setPatient(value);
    } else if (name === 'doctor') {
      setDoctor(value);
    } else if (name === 'date') {
      setDate(value);
    }

    // Clear messages when input changes
    setMessage('');
    setErrorMessage('');
  };

  // Inline styles
  const formStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '1200px',
    width: '95%',
    boxSizing: 'border-box',
    textAlign: 'center',
    margin: '20px auto'
  };

  const groupStyle = {
    marginBottom: '20px',
    width: '100%',
    maxWidth: '900px'
  };

  return (
    <div className="book-appointment-container" style={formStyle}>
      <h2>Prendre un Rendez-vous</h2>
      <form className="book-appointment-form" onSubmit={handleSubmit}>
        <div className="book-appointment-group" style={groupStyle}>
          <label>Patient:</label>
          <select name="patient" value={patient} onChange={handleInputChange} required>
            <option value="">Sélectionner un patient</option>
            {patients.map(p => (
              <option key={p.matricule} value={p.matricule}>
                {p.nom} {p.prenom} (Matricule: {p.matricule})
              </option>
            ))}
          </select>
        </div>
        <div className="book-appointment-group" style={groupStyle}>
          <label>Médecin:</label>
          <select name="doctor" value={doctor} onChange={handleInputChange} required>
            <option value="">Sélectionner un médecin</option>
            {doctors.map(d => (
              <option key={d.idmedecin} value={d.idmedecin}>
                {d.nom} {d.prenom} (ID: {d.idmedecin})
              </option>
            ))}
          </select>
        </div>
        <div className="book-appointment-group" style={groupStyle}>
          <label>Date:</label>
          <input type="datetime-local" name="date" value={date} onChange={handleInputChange} required />
        </div>
        <button type="submit" className="book-appointment-submit-button">Prendre Rendez-vous</button>
      </form>
      {message && <p className="book-appointment-message">{message}</p>}
      {errorMessage && <p className="book-appointment-error-message">{errorMessage}</p>}
    </div>
  );
}

export default BookAppointment;
