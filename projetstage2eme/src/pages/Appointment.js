import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import './Appointments.css';

Modal.setAppElement('#root');

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [visibleDoctor, setVisibleDoctor] = useState(null);
  const [visiblePatient, setVisiblePatient] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showValidatePopup, setShowValidatePopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [validateMessage, setValidateMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAppointment, setEditAppointment] = useState({
    id_medecin: '',
    id_patient: '',
    date_rendez_vous: '',
    oldDate: ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  const doctorDetailsRef = useRef(null);
  const patientDetailsRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/getappointments')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  const toggleDoctorDetails = (id, date) => {
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
          if (doctorDetailsRef.current) {
            doctorDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })
        .catch(error => console.error('Error fetching doctor details:', error));
    }
  };

  const togglePatientDetails = (id, date) => {

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
          if (patientDetailsRef.current) {
            patientDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })
        .catch(error => console.error('Error fetching patient details:', error));
    }
  };

  const refreshList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getappointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('There was an error fetching the appointments!', error);
    }
  };

  const handleDeleteClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDeleteMessage('');
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      const { id_medecin, id_patient, date_rendez_vous } = selectedAppointment;
      axios.delete('http://localhost:5000/api/deleteappointments', {
        data: { id_medecin, id_patient, date_rendez_vous }
      })
        .then(() => {
          setAppointments(appointments.filter(appt =>
            !(appt.id_medecin === id_medecin && appt.id_patient === id_patient && appt.date_rendez_vous === date_rendez_vous)
          ));
          setDeleteMessage('Suppression réussie !');
          setTimeout(() => {
            setDeleteMessage('');
            setShowDeletePopup(false);
          }, 3000);
        })
        .catch(error => {
          console.error('Error deleting appointment:', error.response ? error.response.data : error.message);
          setDeleteMessage('Erreur lors de la suppression.');
        });
    }
  };

  const openEditModal = (appointment) => {
    const oldDate = new Date(appointment.date_rendez_vous).toLocaleString();
    setEditAppointment({
      id_medecin: appointment.id_medecin,
      id_patient: appointment.id_patient,
      date_rendez_vous: appointment.date_rendez_vous,
      oldDate: oldDate
    });
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put('http://localhost:5000/api/appointments', editAppointment);
      setAppointments(appointments.map(appt =>
        appt.date_rendez_vous === editAppointment.date_rendez_vous ? editAppointment : appt
      ));
      setSaveMessage('Modifications enregistrées avec succès !');
      
      // Validation du rendez-vous après la sauvegarde
      if (editAppointment.date_rendez_vous) {
        confirmValidate();
      }

      setTimeout(() => {
        setSaveMessage('');
        setIsEditModalOpen(false);
      }, 3000);
      refreshList();
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSaveMessage('Erreur lors de la sauvegarde.');
    }
  };

  const handleValidateClick = (appointment) => {
    setSelectedAppointment(appointment);
    setValidateMessage('');
    setShowValidatePopup(true);
  };

  const confirmValidate = () => {
    if (selectedAppointment) {
      const { id_medecin, id_patient, date_rendez_vous } = selectedAppointment;
      axios.post('http://localhost:5000/api/validateappointment', {
        id_medecin, id_patient, date_rendez_vous
      })
        .then(() => {
          setAppointments(appointments.filter(appt =>
            !(appt.id_medecin === id_medecin && appt.id_patient === id_patient && appt.date_rendez_vous === date_rendez_vous)
          ));
          setValidateMessage('Rendez-vous validé avec succès !');
          setTimeout(() => {
            setValidateMessage('');
            setShowValidatePopup(false);
          }, 3000);
        })
        .catch(error => {
          console.error('Error validating appointment:', error.response ? error.response.data : error.message);
          setValidateMessage('Erreur lors de la validation.');
        });
    }
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2 className="appointments-title">Liste des Rendez-vous</h2>
      </div>
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
                  <button className="icon-button icon-validate" onClick={() => handleValidateClick(appt)}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={doctorDetailsRef}>
        {selectedDoctor && visibleDoctor === selectedDoctor.idmedecin && (
          <div className="details-container">
            <h3>Détails du Médecin</h3>
            <p><strong>ID:</strong> {selectedDoctor.idmedecin}</p>
            <p><strong>Nom:</strong> {selectedDoctor.nom}</p>
            <p><strong>Prénom:</strong> {selectedDoctor.prenom}</p>
            <p><strong>ID Département:</strong> {selectedDoctor.id_dept}</p>
            <p><strong>Spécialité:</strong> {selectedDoctor.specialite}</p>
          </div>
        )}
      </div>

      <div ref={patientDetailsRef}>
        {console.log("selectedPatient", selectedPatient)}
        {console.log("visiblePatient", visiblePatient)}
        {selectedPatient && visiblePatient === selectedPatient.matricule && (
          <div className="details-container">
            <h3>Détails du Patient</h3>
            {console.log(selectedPatient)}
            <p><strong>ID:</strong> {selectedPatient.matricule}</p>
            <p><strong>Nom:</strong> {selectedPatient.nom}</p>
            <p><strong>Prénom:</strong> {selectedPatient.prenom}</p>
            <p><strong>Date de Naissance:</strong> {new Date(selectedPatient.date_de_naissance).toLocaleDateString()}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Nationalite:</strong> {selectedPatient.nationalite}</p>
            <p><strong>Adresse:</strong> {selectedPatient.adresse}</p>
            <p><strong>Gouvernorat:</strong> {selectedPatient.gouvernorat}</p>
            <p><strong>Numéro de Téléphone domicile:</strong> {selectedPatient.tel_domicile}</p>
            <p><strong>Numéro de Téléphone portable:</strong> {selectedPatient.tel_portable}</p>
          </div>
        )}
      </div>

      {showDeletePopup && selectedAppointment && (
        <div className="popup visible">
          <div className="popup-header">Confirmer la Suppression</div>
          <div className="popup-body">
            <p><strong>ID Médecin:</strong> {selectedAppointment.id_medecin}</p>
            <p><strong>ID Patient:</strong> {selectedAppointment.id_patient}</p>
            <p><strong>Date et Heure:</strong> {new Date(selectedAppointment.date_rendez_vous).toLocaleString()}</p>
            <p>Êtes-vous sûr de vouloir supprimer ce rendez-vous ?</p>
            {deleteMessage && <p className="delete-message">{deleteMessage}</p>}
          </div>
          <div className="popup-footer">
            <button className="popup-button popup-button-confirm" onClick={confirmDelete}>Confirmer</button>
            <button className="popup-button popup-button-cancel" onClick={() => setShowDeletePopup(false)}>Annuler</button>
          </div>
        </div>
      )}

      {showValidatePopup && selectedAppointment && (
        <div className="popup visible">
          <div className="popup-header">Confirmer la Validation</div>
          <div className="popup-body">
            <p><strong>ID Médecin:</strong> {selectedAppointment.id_medecin}</p>
            <p><strong>ID Patient:</strong> {selectedAppointment.id_patient}</p>
            <p><strong>Date et Heure:</strong> {new Date(selectedAppointment.date_rendez_vous).toLocaleString()}</p>
            <p>Êtes-vous sûr de vouloir valider ce rendez-vous ?</p>
            {validateMessage && <p className="validate-message">{validateMessage}</p>}
          </div>
          <div className="popup-footer">
            <button className="popup-button popup-button-confirm" onClick={confirmValidate}>Confirmer</button>
            <button className="popup-button popup-button-cancel" onClick={() => setShowValidatePopup(false)}>Annuler</button>
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
        {saveMessage && (
          <div className="save-message">{saveMessage}</div>
        )}
        <div className="edit-modal-body">
          <div className="form-group">
            <label>ID Médecin:</label>
            <input
              type="text"
              value={editAppointment.id_medecin}
              disabled
            />
          </div>
          <div className="form-group">
            <label>ID Patient:</label>
            <input
              type="text"
              value={editAppointment.id_patient}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Date et Heure:</label>
            <input
              type="datetime-local"
              value={editAppointment.date_rendez_vous}
              onChange={(e) =>
                setEditAppointment({ ...editAppointment, date_rendez_vous: e.target.value })
              }
            />
          </div>
        </div>
        <div className="edit-modal-footer">
          <button className="edit-modal-button edit-modal-button-save" onClick={handleSaveChanges}>
            Sauvegarder
          </button>
          <button className="edit-modal-button edit-modal-button-cancel" onClick={() => setIsEditModalOpen(false)}>
            Annuler
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Appointments;
