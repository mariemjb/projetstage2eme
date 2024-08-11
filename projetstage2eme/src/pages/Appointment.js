import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import './Appointments.css';

Modal.setAppElement('#root');

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visibleDoctor, setVisibleDoctor] = useState(null);
  const [visiblePatient, setVisiblePatient] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(null); // Ajouté pour suivre la date du rendez-vous
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState({
    id_medecin: '',
    id_patient: '',
    date_rendez_vous: ''
  });

  // Références pour les détails du médecin et du patient
  const doctorDetailsRef = useRef(null);
  const patientDetailsRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/getappointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  const toggleDoctorDetails = (id, date) => {
    // Vérifier si les détails du médecin sont déjà visibles pour le même ID et la même date
    if (visibleDoctor === id && selectedAppointmentDate === date) {
      setVisibleDoctor(null);
      setSelectedDoctor(null);
      setSelectedAppointmentDate(null);
    } else {
      axios.get(`http://localhost:5000/api/doctor/${id}`)
        .then(response => {
          setSelectedDoctor(response.data);
          setVisibleDoctor(id);
          setSelectedAppointmentDate(date);
          // Faire défiler jusqu'à la section des détails du médecin
          if (doctorDetailsRef.current) {
            doctorDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })
        .catch(error => console.error('Error fetching doctor details:', error));
    }
  };

  const togglePatientDetails = (id, date) => {
    // Vérifier si les détails du patient sont déjà visibles pour le même ID et la même date
    if (visiblePatient === id && selectedAppointmentDate === date) {
      setVisiblePatient(null);
      setSelectedPatient(null);
      setSelectedAppointmentDate(null);
    } else {
      axios.get(`http://localhost:5000/api/patient/${id}`)
        .then(response => {
          setSelectedPatient(response.data);
          setVisiblePatient(id);
          setSelectedAppointmentDate(date);
          // Faire défiler jusqu'à la section des détails du patient
          if (patientDetailsRef.current) {
            patientDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })
        .catch(error => console.error('Error fetching patient details:', error));
    }
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      const { id_medecin, id_patient, date_rendez_vous } = selectedAppointment;
      axios.delete('http://localhost:5000/api/appointments', {
        data: { id_medecin, id_patient, date_rendez_vous }
      })
        .then(() => {
          setAppointments(appointments.filter(appt => 
            !(appt.id_medecin === id_medecin && appt.id_patient === id_patient && appt.date_rendez_vous === date_rendez_vous)
          ));
          setDeleteMessage('Suppression réussie !');
          setShowDeletePopup(false);
          setTimeout(() => setDeleteMessage(''), 3000);
        })
        .catch(error => {
          console.error('Error deleting appointment:', error.response ? error.response.data : error.message);
          setDeleteMessage('Erreur lors de la suppression.');
          setTimeout(() => setDeleteMessage(''), 3000);
        });
    }
  };

  const openEditModal = (appointment) => {
    setEditAppointment({
      id_medecin: appointment.id_medecin,
      id_patient: appointment.id_patient,
      date_rendez_vous: appointment.date_rendez_vous
    });
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put('http://localhost:5000/api/appointments', editAppointment);
      setAppointments(appointments.map(appt => 
        appt.date_rendez_vous === editAppointment.date_rendez_vous ? editAppointment : appt
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2 className="appointments-title">Liste des Rendez-vous</h2>
      </div>
      {deleteMessage && <div className="delete-message">{deleteMessage}</div>}
      <div className="appointments-table-wrapper">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>ID Médecin</th>
              <th>ID Patient</th>
              <th>Date et Heure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={index}>
                <td>
                  <button className="icon-button" onClick={() => toggleDoctorDetails(appt.id_medecin, appt.date_rendez_vous)}>
                    {appt.id_medecin}
                  </button>
                </td>
                <td>
                  <button
                    className="icon-button"
                    onClick={() => togglePatientDetails(appt.id_patient, appt.date_rendez_vous)}
                  >
                    {appt.id_patient}
                  </button>
                </td>
                <td>{new Date(appt.date_rendez_vous).toLocaleString()}</td>
                <td>
                  <button className="icon-button icon-edit" onClick={() => openEditModal(appt)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="icon-button icon-delete" onClick={() => handleDeleteClick(appt)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section des détails du médecin */}
      <div ref={doctorDetailsRef}>
        {selectedDoctor && visibleDoctor === selectedDoctor.idmedecin && (
          <div className="details-container">
            <h3>Détails du Médecin</h3>
            <p><strong>ID:</strong> {selectedDoctor.idmedecin}</p>
            <p><strong>Nom:</strong> {selectedDoctor.nom}</p>
            <p><strong>Prénom:</strong> {selectedDoctor.prenom}</p>
          </div>
        )}
      </div>

      {/* Section des détails du patient */}
      <div ref={patientDetailsRef}>
        {selectedPatient && visiblePatient === selectedPatient.matricule && (
          <div className="details-container">
            <h3>Détails du Patient</h3>
            <p><strong>Matricule:</strong> {selectedPatient.matricule}</p>
            <p><strong>Nom:</strong> {selectedPatient.nom}</p>
            <p><strong>Prénom:</strong> {selectedPatient.prenom}</p>
          </div>
        )}
      </div>

      {showDeletePopup && selectedAppointment && (
        <div className="popup visible">
          <div className="popup-header">Confirmer la suppression</div>
          <div className="popup-body">
            <p><strong>ID Médecin:</strong> {selectedAppointment.id_medecin}</p>
            <p><strong>ID Patient:</strong> {selectedAppointment.id_patient}</p>
            <p><strong>Date et Heure:</strong> {new Date(selectedAppointment.date_rendez_vous).toLocaleString()}</p>
            <p>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</p>
          </div>
          <div className="popup-footer">
            <button className="popup-button popup-button-confirm" onClick={confirmDelete}>Confirmer</button>
            <button className="popup-button popup-button-cancel" onClick={() => setShowDeletePopup(false)}>Annuler</button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        contentLabel="Edit Appointment"
        className="edit-modal"
        overlayClassName="ReactModal__Overlay"
      >
        <h2 className="edit-modal-title">Modifier le Rendez-vous</h2>

        <form>
          <label>
            Date:
            <input
              type="datetime-local"
              value={editAppointment.date_rendez_vous}
              onChange={(e) => setEditAppointment({ ...editAppointment, date_rendez_vous: e.target.value })}
            />
          </label>
          <label>
            ID Médecin:
            <input
              type="text"
              value={editAppointment.id_medecin}
              disabled // Champ désactivé
            />
          </label>
          <label>
            ID Patient:
            <input
              type="text"
              value={editAppointment.id_patient}
              disabled // Champ désactivé
            />
          </label>
          <div className="modal-buttons">
            <button type="button" className="btn-save" onClick={handleSaveChanges}>Sauvegarder</button>
            <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Annuler</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Appointments;
