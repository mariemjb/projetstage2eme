// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Assurez-vous que ce fichier CSS est correctement configuré

function Dashboard() {
  const [stats, setStats] = useState({
    medecins: 0,
    departements: 0,
    patients: 0,
    rendez_vous_total: 0,
    rendez_vous_today: 0,
    medecins_conge: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Tableau de Bord</h2>
      <div className="stats-card">
        <h3>Nombre de Médecins</h3>
        <p>{stats.medecins}</p>
      </div>
      <div className="stats-card">
        <h3>Nombre de Départements</h3>
        <p>{stats.departements}</p>
      </div>
      <div className="stats-card">
        <h3>Nombre de Patients</h3>
        <p>{stats.patients}</p>
      </div>
      <div className="stats-card">
        <h3>Nombre Total de Rendez-vous</h3>
        <p>{stats.rendez_vous_total}</p>
      </div>
      <div className="stats-card">
        <h3>Nombre de Rendez-vous pour Aujourd'hui</h3>
        <p>{stats.rendez_vous_today}</p>
      </div>
      <div className="stats-card">
        <h3>Nombre de Médecins en Congé</h3>
        <p>{stats.medecins_conge}</p>
      </div>
    </div>
  );
}

export default Dashboard;
