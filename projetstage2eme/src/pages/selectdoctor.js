import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './selectdoctor.css';

function SelectDoctorForm() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false); // Ajout de l'état pour le chargement

  useEffect(() => {
    // Fetch all doctors
    axios.get('http://localhost:5000/api/doctors')
      .then(response => setDoctors(response.data))
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  const handleDoctorChange = (event) => {
    const selectedId = event.target.value;
    setSelectedDoctorId(selectedId);

    if (selectedId) {
      setLoading(true); // Afficher le cercle d'attente avant de faire la requête
      // Fetch recommendations based on the selected doctor
      axios.get(`http://localhost:5000/api/recommendations?selectedDoctorId=${selectedId}`)
        .then(response => {
          console.log('Recommendations Response:', response.data);
          setRecommendations(response.data);
        })
        .catch(error => console.error('Error fetching recommendations:', error))
        .finally(() => setLoading(false)); // Cacher le cercle d'attente après la réponse
    } else {
      setRecommendations([]);
    }
  };

  return (
    <div className="select-doctor-form-container">
      <h2>Sélectionner un Médecin</h2>
      <div className="form-group">
        <label htmlFor="doctor">Choisir un Médecin</label>
        <select
          id="doctor"
          name="doctor"
          value={selectedDoctorId}
          onChange={handleDoctorChange}
          required
        >
          <option value="">Sélectionner un médecin</option>
          {doctors.map(doctor => (
            <option key={doctor.idmedecin} value={doctor.idmedecin}>
              {doctor.nom} {doctor.prenom} - {doctor.specialite}
            </option>
          ))}
        </select>
      </div>

      {/* Cercle d'attente affiché pendant le chargement */}
      {loading && <div className="loading-spinner"></div>}

      {/* Affichage des recommandations si elles sont disponibles */}
      {!loading && recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommandations</h3>
          <ul>
            {recommendations.map(rec => (
              <li key={rec.id}>
                {rec.name} {rec.surname}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SelectDoctorForm;
