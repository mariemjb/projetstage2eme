import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './details.css';
import MyForm from '../components/habitude';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MedicalConditionsForm = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null); // New state for patient details
    const [formData, setFormData] = useState({
        1: { id_antecedant: 1, name: 'Pathologie respiratoire chronique', answer: '', anciennete: '', traitement: '', equilibre: '', description:'' },
        2: { id_antecedant: 2, name: 'Cardiopathie', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
        3: { id_antecedant: 3, name: 'Trouble de rythme cardiaque', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
        4: { id_antecedant: 4, name: 'HTA', answer: '', anciennete: '', traitement: '', equilibre: '',description:'' },
        5: { id_antecedant: 5, name: 'Diabète', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
        6: { id_antecedant: 6, name: 'Insuffisance rénale chronique', answer: '', anciennete: '', traitement: '', equilibre: '',description:'' },
        7: { id_antecedant: 7, name: 'AVC', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
        8: { id_antecedant: 8, name: 'Rétinopathie', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
        9: { id_antecedant: 9, name: 'ATCD chirurgicaux', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
        10: { id_antecedant: 10, name: 'Grossesse en cours', answer: '', anciennete: '', traitement: '' ,description:''},
        11: { id_antecedant: 11, name: 'Prise récente d’AINS', answer: '', anciennete: '', traitement: '' ,description:''},
        12: { id_antecedant: 12, name: 'Traitement immunosuppresseur', answer: '', anciennete: '', traitement: '' ,description:''},
    });
    const [formDataHabits, setFormDataHabits] = useState({
        1: { id_hab: 1, namehab: 'Tabagisme', answerhab: '', quantite: '' },
        2: { id_hab: 2, namehab: 'Consommation De Drogues/Cannabis', answerhab: '', quantite: '' },
        3: { id_hab: 3, namehab: 'Alcool', answerhab: '', quantite: '' },
    });
    useEffect(() => {
        // Fetch patients data
        axios.get('http://localhost:5000/api/patients')
            .then(response => setPatients(response.data))
            .catch(error => console.error('Error fetching patients:', error));
    }, []);

    useEffect(() => {
        // Fetch selected patient details when selectedPatient changes
        if (selectedPatient) {
            axios.get(`http://localhost:5000/api/patient/${selectedPatient}`)
                .then(response => setSelectedPatientDetails(response.data))
                .catch(error => console.error('Error fetching patient details:', error));
        }
    }, [selectedPatient]);

    const handlePatientChange = (event) => {
        setSelectedPatient(event.target.value);
    };

    const handleChange = (id, field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [id]: {
                ...prevData[id],
                [field]: value
            }
        }));
        setFormDataHabits(prevData => ({
            ...prevData,
            [id]: {
                ...prevData[id],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        try {
          // Filtrer les données du formulaire pour inclure uniquement celles avec des réponses "Oui"
          const filteredDataConditions = Object.values(formData).filter(condition => condition.answer === 'oui');
      
          // S'assurer que chaque condition inclut un id_antecedant
          const dataToSendConditions = filteredDataConditions.map(condition => ({
            id_antecedant: condition.id_antecedant,
            answer: condition.answer,
            name: condition.name,
            anciennete: condition.anciennete,
            traitement: condition.traitement,
            equilibre: condition.equilibre,
            description: condition.description,
            matricule: selectedPatientDetails?.matricule // Utilisation des détails du patient
          }));
      
          // Filtrer les habitudes pour inclure uniquement celles avec des réponses "Oui"
          const filteredHabits = Object.values(formDataHabits).filter(habit => habit.answerhab === 'oui');
      
          // S'assurer que chaque habitude inclut un id_hab
          const dataToSendHabits = filteredHabits.map(habit => ({
            id_hab: habit.id_hab,
            answerhab: habit.answerhab,
            namehab: habit.namehab,
            quantite: habit.quantite,
            matricule: selectedPatientDetails?.matricule // Utilisation des détails du patient
          }));
      
          // Combiner les données dans un seul objet
          const dataToSend = {
            conditions: dataToSendConditions,
            habits: dataToSendHabits
          };
      
          // Envoyer les données filtrées au serveur via Axios
          const response = await axios.post('http://localhost:5000/api/medical-conditions', dataToSend, {
            headers: { 'Content-Type': 'application/json' }
          });
      
          console.log('Success:', response.data);
      
          // Réinitialiser les champs du formulaire
          setFormData({
            1: { id_antecedant: 1, name: 'Pathologie respiratoire chronique', answer: '', anciennete: '', traitement: '', equilibre: '', description:'' },
            2: { id_antecedant: 2, name: 'Cardiopathie', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
            3: { id_antecedant: 3, name: 'Trouble de rythme cardiaque', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
            4: { id_antecedant: 4, name: 'HTA', answer: '', anciennete: '', traitement: '', equilibre: '',description:'' },
            5: { id_antecedant: 5, name: 'Diabète', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
            6: { id_antecedant: 6, name: 'Insuffisance rénale chronique', answer: '', anciennete: '', traitement: '', equilibre: '',description:'' },
            7: { id_antecedant: 7, name: 'AVC', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
            8: { id_antecedant: 8, name: 'Rétinopathie', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
            9: { id_antecedant: 9, name: 'ATCD chirurgicaux', answer: '', anciennete: '', traitement: '', equilibre: '' ,description:''},
            10: { id_antecedant: 10, name: 'Grossesse en cours', answer: '', anciennete: '', traitement: '' ,description:''},
            11: { id_antecedant: 11, name: 'Prise récente d’AINS', answer: '', anciennete: '', traitement: '' ,description:''},
            12: { id_antecedant: 12, name: 'Traitement immunosuppresseur', answer: '', anciennete: '', traitement: '' ,description:''},
          });
      
          setFormDataHabits({
            1: { id_hab: 1, namehab: 'Tabagisme', answerhab: '', quantite: '' },
            2: { id_hab: 2, namehab: 'Consommation De Drogues/Cannabis', answerhab: '', quantite: '' },
            3: { id_hab: 3, namehab: 'Alcool', answerhab: '', quantite: '' },
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
        <div className="medical-conditions-form">
            <h2> d'Antécédents Médicaux</h2>
            <form onSubmit={handleSubmit}>
                {/* Patient Selection */}
                <div className="patient-selection">
                    <label>
                        Sélectionner un patient:
                        <select value={selectedPatient} onChange={handlePatientChange}>
                            <option value="">Sélectionnez un patient</option>
                            {patients.map(patient => (
                                <option key={patient.matricule} value={patient.matricule}>
                                    {patient.nom} {patient.prenom}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Pathologie respiratoire chronique */}
                <div className="condition-section">
                    <h3>Pathologie respiratoire chronique</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-1"
                            value="oui"
                            checked={formData[1].answer === 'oui'}
                            onChange={(e) => handleChange(1, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-1"
                            value="non"
                            checked={formData[1].answer === 'non'}
                            onChange={(e) => handleChange(1, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[1].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[1].anciennete}
                                    onChange={(e) => handleChange(1, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[1].traitement}
                                    onChange={(e) => handleChange(1, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Équilibré:
                                <select
                                    value={formData[1].equilibre}
                                    onChange={(e) => handleChange(1, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="oui">Oui</option>
                                    <option value="non">Non</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[1].description}
                                    onChange={(e) => handleChange(1, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Cardiopathie */}
                <div className="condition-section">
                    <h3>Cardiopathie</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-2"
                            value="oui"
                            checked={formData[2].answer === 'oui'}
                            onChange={(e) => handleChange(2, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-2"
                            value="non"
                            checked={formData[2].answer === 'non'}
                            onChange={(e) => handleChange(2, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[2].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[2].anciennete}
                                    onChange={(e) => handleChange(2, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[2].traitement}
                                    onChange={(e) => handleChange(2, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Équilibré:
                                <select
                                    value={formData[2].equilibre}
                                    onChange={(e) => handleChange(2, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="oui">Oui</option>
                                    <option value="non">Non</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[2].description}
                                    onChange={(e) => handleChange(2, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Trouble de rythme cardiaque */}
                <div className="condition-section">
                    <h3>Trouble de rythme cardiaque</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-3"
                            value="oui"
                            checked={formData[3].answer === 'oui'}
                            onChange={(e) => handleChange(3, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-3"
                            value="non"
                            checked={formData[3].answer === 'non'}
                            onChange={(e) => handleChange(3, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[3].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[3].anciennete}
                                    onChange={(e) => handleChange(3, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[3].traitement}
                                    onChange={(e) => handleChange(3, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Équilibré:
                                <select
                                    value={formData[3].equilibre}
                                    onChange={(e) => handleChange(3, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="oui">Oui</option>
                                    <option value="non">Non</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[3].description}
                                    onChange={(e) => handleChange(3, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* HTA */}
                <div className="condition-section">
                    <h3>HTA</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-4"
                            value="oui"
                            checked={formData[4].answer === 'oui'}
                            onChange={(e) => handleChange(4, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-4"
                            value="non"
                            checked={formData[4].answer === 'non'}
                            onChange={(e) => handleChange(4, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[4].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[4].anciennete}
                                    onChange={(e) => handleChange(4, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[4].traitement}
                                    onChange={(e) => handleChange(4, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Équilibré:
                                <select
                                    value={formData[4].equilibre}
                                    onChange={(e) => handleChange(4, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="oui">Oui</option>
                                    <option value="non">Non</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[4].description}
                                    onChange={(e) => handleChange(4, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Diabète */}
                <div className="condition-section">
                    <h3>Diabète</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-5"
                            value="oui"
                            checked={formData[5].answer === 'oui'}
                            onChange={(e) => handleChange(5, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-5"
                            value="non"
                            checked={formData[5].answer === 'non'}
                            onChange={(e) => handleChange(5, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[5].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[5].anciennete}
                                    onChange={(e) => handleChange(5, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[5].traitement}
                                    onChange={(e) => handleChange(5, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Équilibré:
                                <select
                                    value={formData[5].equilibre}
                                    onChange={(e) => handleChange(5, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="oui">Oui</option>
                                    <option value="non">Non</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[5].description}
                                    onChange={(e) => handleChange(5, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Insuffisance rénale chronique */}
                <div className="condition-section">
                    <h3>Insuffisance rénale chronique</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-6"
                            value="oui"
                            checked={formData[6].answer === 'oui'}
                            onChange={(e) => handleChange(6, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-6"
                            value="non"
                            checked={formData[6].answer === 'non'}
                            onChange={(e) => handleChange(6, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[6].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[6].anciennete}
                                    onChange={(e) => handleChange(6, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[6].traitement}
                                    onChange={(e) => handleChange(6, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Hémodialyse:
                                <select
                                    value={formData[6].hémodialyse}
                                    onChange={(e) => handleChange(6, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="oui">Oui</option>
                                    <option value="non">Non</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[6].description}
                                    onChange={(e) => handleChange(6, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* AVC */}
                <div className="condition-section">
                    <h3>AVC</h3>
                    <label>
                        Oui,un seul épisode
                        <input
                            type="radio"
                            name="answer-7"
                            value="oui"
                            checked={formData[7].answer === 'oui'}
                            onChange={(e) => handleChange(7, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Oui,plusieurs épisodes
                        <input
                            type="radio"
                            name="answer-7"
                            value="oui"
                            checked={formData[7].answer === 'oui'}
                            onChange={(e) => handleChange(7, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-7"
                            value="non"
                            checked={formData[7].answer === 'non'}
                            onChange={(e) => handleChange(7, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[7].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[7].anciennete}
                                    onChange={(e) => handleChange(7, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[7].traitement}
                                    onChange={(e) => handleChange(7, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Handicap:
                                <select
                                    value={formData[7].handicap}
                                    onChange={(e) => handleChange(7, 'equilibre', e.target.value)}
                                >
                                    <option value="">Sélectionnez</option>
                                    <option value="mineur">mineur</option>
                                    <option value="moyen">moyen</option>
                                    <option value="majeur">majeur</option>
                                </select>
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[7].description}
                                    onChange={(e) => handleChange(7, 'description', e.target.value)}
                                />
                            </label>
                            
                        </div>
                    )}
                </div>

                {/* Rétinopathie */}
                <div className="condition-section">
                    <h3>Rétinopathie</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-8"
                            value="oui"
                            checked={formData[8].answer === 'oui'}
                            onChange={(e) => handleChange(8, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-8"
                            value="non"
                            checked={formData[8].answer === 'non'}
                            onChange={(e) => handleChange(8, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[8].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[8].anciennete}
                                    onChange={(e) => handleChange(8, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[8].traitement}
                                    onChange={(e) => handleChange(8, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[8].description}
                                    onChange={(e) => handleChange(8, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* ATCD chirurgicaux */}
                <div className="condition-section">
                    <h3>ATCD chirurgicaux</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-9"
                            value="oui"
                            checked={formData[9].answer === 'oui'}
                            onChange={(e) => handleChange(9, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-9"
                            value="non"
                            checked={formData[9].answer === 'non'}
                            onChange={(e) => handleChange(9, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[9].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[9].anciennete}
                                    onChange={(e) => handleChange(9, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[9].traitement}
                                    onChange={(e) => handleChange(9, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[9].description}
                                    onChange={(e) => handleChange(9, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Grossesse en cours */}
                <div className="condition-section">
                    <h3>Grossesse en cours</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-10"
                            value="oui"
                            checked={formData[10].answer === 'oui'}
                            onChange={(e) => handleChange(10, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-10"
                            value="non"
                            checked={formData[10].answer === 'non'}
                            onChange={(e) => handleChange(10, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[10].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[10].anciennete}
                                    onChange={(e) => handleChange(10, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[10].traitement}
                                    onChange={(e) => handleChange(10, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[10].description}
                                    onChange={(e) => handleChange(10, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Prise récente d’AINS */}
                <div className="condition-section">
                    <h3>Prise récente d’AINS</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-11"
                            value="oui"
                            checked={formData[11].answer === 'oui'}
                            onChange={(e) => handleChange(11, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-11"
                            value="non"
                            checked={formData[11].answer === 'non'}
                            onChange={(e) => handleChange(11, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[11].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[11].anciennete}
                                    onChange={(e) => handleChange(11, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[11].traitement}
                                    onChange={(e) => handleChange(11, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[11].description}
                                    onChange={(e) => handleChange(11, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Traitement immunosuppresseur */}
                <div className="condition-section">
                    <h3>Traitement immunosuppresseur (corticoïdes,chimiothérapies...)</h3>
                    <label>
                        Oui
                        <input
                            type="radio"
                            name="answer-12"
                            value="oui"
                            checked={formData[12].answer === 'oui'}
                            onChange={(e) => handleChange(12, 'answer', e.target.value)}
                        />
                    </label>
                    <label>
                        Non
                        <input
                            type="radio"
                            name="answer-12"
                            value="non"
                            checked={formData[12].answer === 'non'}
                            onChange={(e) => handleChange(12, 'answer', e.target.value)}
                        />
                    </label>
                    {formData[12].answer === 'oui' && (
                        <div>
                            <label>
                                Ancienneté:
                                <input
                                    type="number"
                                    value={formData[12].anciennete}
                                    onChange={(e) => handleChange(12, 'anciennete', e.target.value)}
                                />
                            </label>
                            <label>
                                Traitement:
                                <input
                                    type="text"
                                    value={formData[12].traitement}
                                    onChange={(e) => handleChange(12, 'traitement', e.target.value)}
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={formData[12].description}
                                    onChange={(e) => handleChange(12, 'description', e.target.value)}
                                />
                            </label>
                        </div>
                    )}
                </div>
                <MyForm formDataHabits={formDataHabits} handleChange={handleChange} />
                <button type="submit">Soumettre</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default MedicalConditionsForm;
