import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './doctorDispo.css';

function DoctorDispo() {
  const location = useLocation();
  const { doctors } = location.state || {};
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, [doctors]);

  return (
    <div className="doctor-dispo-container">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          <h2>Médecins Disponibles</h2>
          {doctors && doctors.length > 0 ? (
            <ul>
              {doctors.map(doctor => (
                <li key={doctor.id}>
                  {doctor.name} {doctor.surname} - {doctor.specialty} - Niveau {doctor.level}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun médecin disponible</p>
          )}
        </>
      )}
    </div>
  );
}

export default DoctorDispo;
