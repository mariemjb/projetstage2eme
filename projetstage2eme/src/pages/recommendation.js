import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './recommandation.css';

function Recommendation() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCardClick = () => {
    navigate('/select-doctor'); // Navigate to the form page
  };

  const handleCardClick1 = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/available-doctors');
      const availableDoctors = response.data;
      navigate('/doctor_dispo', { state: { doctors: availableDoctors } }); // Pass data to DoctorDispo
    } catch (error) {
      console.error('Error fetching available doctors:', error);
    }
  };

  return (
    <div className="recommendation-container">
      <h2 className="recommendation-title">Recommandations</h2>
      <div className="recommendation-card-container">
        <div className="recommendation-card" onClick={handleCardClick}>
          <h3>Qui peut remplacer</h3>
        </div>
        <div className="recommendation-card">
          <h3>Médecin plus approprié pour ce cas</h3>
        </div>
        <div className="recommendation-card" onClick={handleCardClick1}>
          <h3>Médecin disponible</h3>
        </div>
      </div>
    </div>
  );
}

export default Recommendation;