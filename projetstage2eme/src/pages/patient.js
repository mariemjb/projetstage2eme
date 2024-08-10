import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './patient.css'; 

function Patients() {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    sexe: '',
    dateDeNaissance: '',
    age: '',
    adresse: '',
    nationalite: '',
    gouvernorat: '',
    telDomicile: '',
    telPortable: '',
    profession: '',
    niveauEtude: '',
    taille: '',
    poids: '',
    globulesRouges: '',
    maritalStatus: '',
    vieSeul: '',
    pdf: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      pdf: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs (simple exemple)
    if (!formData.pdf) {
      toast.error('Veuillez sélectionner un fichier PDF.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const maritalStatusMap = {
      'celibataire': 0,
      'marie': 1
    };

    const vieSeulMap = {
      'oui': 1,
      'non': 0
    };

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'pdf') {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      } else if (key === 'maritalStatus') {
        formDataToSend.append(key, maritalStatusMap[formData[key]] || 0);
      } else if (key === 'vieSeul') {
        formDataToSend.append(key, vieSeulMap[formData[key]] || 0);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/patients', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      // Réinitialiser les champs du formulaire
      setFormData({
        matricule: '',
        nom: '',
        prenom: '',
        sexe: '',
        dateDeNaissance: '',
        age: '',
        adresse: '',
        nationalite: '',
        gouvernorat: '',
        telDomicile: '',
        telPortable: '',
        profession: '',
        niveauEtude: '',
        taille: '',
        poids: '',
        globulesRouges: '',
        maritalStatus: '',
        vieSeul: '',
        pdf: null,
      });

      // Afficher une popup de succès
      toast.success('Envoi réussi !', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'envoi des données.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Patients Management</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Matricule:</label>
          <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Nom:</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Prénom:</label>
          <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Sexe:</label>
          <select name="sexe" value={formData.sexe} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date de Naissance:</label>
          <input type="date" name="dateDeNaissance" value={formData.dateDeNaissance} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Âge:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Adresse:</label>
          <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Nationalité:</label>
          <input type="text" name="nationalite" value={formData.nationalite} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gouvernorat:</label>
          <input type="text" name="gouvernorat" value={formData.gouvernorat} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Téléphone Domicile:</label>
          <input type="tel" name="telDomicile" value={formData.telDomicile} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Téléphone Portable:</label>
          <input type="tel" name="telPortable" value={formData.telPortable} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Profession:</label>
          <input type="text" name="profession" value={formData.profession} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Niveau d'Étude:</label>
          <input type="text" name="niveauEtude" value={formData.niveauEtude} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Taille (cm):</label>
          <input type="number" name="taille" value={formData.taille} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Poids (kg):</label>
          <input type="number" name="poids" value={formData.poids} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Globules Rouges:</label>
          <input type="text" name="globulesRouges" value={formData.globulesRouges} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>État Civil:</label>
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="marie">Marié</option>
            <option value="celibataire">Célibataire</option>
          </select>
        </div>
        <div className="form-group">
          <label>Vie Seul:</label>
          <select name="vieSeul" value={formData.vieSeul} onChange={handleChange} required>
            <option value="">Sélectionner</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
          </select>
        </div>
        <div className="form-group">
          <label>Document PDF:</label>
          <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange} />
        </div>
        <button type="submit">Soumettre</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Patients;
