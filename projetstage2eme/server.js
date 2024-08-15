
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const axios = require('axios');
const app = express();
const port = 5000;
// Servir les fichiers statiques depuis le dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configurez CORS
app.use(cors({
    origin: 'http://localhost:3000',
}));

// Configurez multer pour les fichiers PDF
const upload = multer({ dest: 'uploads/' });

// Configurez le middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Créez une connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'patients'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});
// Configurer la connexion à Neo4j
const neo4jDriver = neo4j.driver('bolt://127.0.0.1:7687', neo4j.auth.basic('neo4j', 'safamariem'));
const neo4jSession = neo4jDriver.session();
// Route pour gérer la soumission du formulaire
// Route pour gérer la soumission du formulaire
app.post('/api/patients', upload.single('pdf'), (req, res) => {
    const { matricule, nom, prenom, sexe, dateDeNaissance, age, adresse, nationalite, gouvernorat, telDomicile, telPortable, profession, taille, poids, globulesRouges, maritalStatus, vieSeul } = req.body;
    const pdf = req.file ? req.file.filename : null; // Sauvegarder le nom du fichier

    const sql = `INSERT INTO patients (matricule, nom, prenom, sexe, date_de_naissance, age, adresse, nationalite, gouvernorat, tel_domicile, tel_portable, profession, taille, poids, globule_rouge, marie, vie_seul, dossier_medical) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [matricule, nom, prenom, sexe, dateDeNaissance, age, adresse, nationalite, gouvernorat, telDomicile, telPortable, profession, taille, poids, globulesRouges, maritalStatus, vieSeul, pdf];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json({ message: 'Patient information saved successfully' });
        }
    });
});



// Route pour récupérer les patients
app.get('/api/patients', (req, res) => {
    const sql = 'SELECT * FROM patients';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Route pour mettre à jour un patient

app.put('/api/patients/:id', upload.single('pdf'), (req, res) => {
    const patientId = req.params.id;
    const {
        matricule,
        nom,
        prenom,
        sexe,
        date_de_naissance,
        age,
        adresse,
        nationalite,
        gouvernorat,
        tel_domicile,
        tel_portable,
        profession,
        taille,
        poids,
        globule_rouge,
        marie,
        vie_seul
    } = req.body;
    const pdfPath = req.file ? req.file.filename : null;

    console.log('Received data:', {
        matricule,
        nom,
        prenom,
        sexe,
        date_de_naissance,
        age,
        adresse,
        nationalite,
        gouvernorat,
        tel_domicile,
        tel_portable,
        profession,
        taille,
        poids,
        globule_rouge,
        marie,
        vie_seul,
        pdfPath
    });

    // Format the date for MySQL
    const formattedDate = new Date(date_de_naissance).toISOString().split('T')[0];

    let updateSql;
    let updateValues;

    if (!pdfPath) {
        db.query('SELECT dossier_medical FROM patients WHERE matricule = ?', [patientId], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            const existingPdfPath = results[0].dossier_medical;
            updateSql = `UPDATE patients SET matricule = ?, nom = ?, prenom = ?, sexe = ?, date_de_naissance = ?, age = ?, adresse = ?, nationalite = ?, gouvernorat = ?, tel_domicile = ?, tel_portable = ?, profession = ?, taille = ?, poids = ?, globule_rouge = ?, marie = ?, vie_seul = ?, dossier_medical = ? WHERE matricule = ?`;
            updateValues = [matricule, nom, prenom, sexe, formattedDate, age, adresse, nationalite, gouvernorat, tel_domicile, tel_portable, profession, taille, poids, globule_rouge, marie, vie_seul, existingPdfPath, patientId];
            
            db.query(updateSql, updateValues, (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(200).json({ message: 'Patient information updated successfully' });
            });
        });
    } else {
        updateSql = `UPDATE patients SET matricule = ?, nom = ?, prenom = ?, sexe = ?, date_de_naissance = ?, age = ?, adresse = ?, nationalite = ?, gouvernorat = ?, tel_domicile = ?, tel_portable = ?, profession = ?, taille = ?, poids = ?, globule_rouge = ?, marie = ?, vie_seul = ?, dossier_medical = ? WHERE matricule = ?`;
        updateValues = [matricule, nom, prenom, sexe, formattedDate, age, adresse, nationalite, gouvernorat, tel_domicile, tel_portable, profession, taille, poids, globule_rouge, marie, vie_seul, pdfPath, patientId];
        
        db.query(updateSql, updateValues, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Patient information updated successfully' });
        });
    }
});


// Route pour supprimer un patient
app.delete('/api/patients/:id', (req, res) => {
    const patientId = req.params.id;

    const sql = 'DELETE FROM patients WHERE matricule = ?';
    db.query(sql, [patientId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json({ message: 'Patient deleted successfully' });
        }
    });
});

// Route pour servir les fichiers PDF


app.get('/api/patients/:id/dossier-medical', (req, res) => {
    const patientId = req.params.id;
    
    const sql = 'SELECT dossier_medical FROM patients WHERE matricule = ?';
    db.query(sql, [patientId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            if (results.length > 0 && results[0].dossier_medical) {
                const fileName = results[0].dossier_medical;
                const filePath = path.join(__dirname, 'uploads', fileName);
                
                // Log the full path to help debug
                console.log(`Serving file: ${filePath}`);
                
                res.sendFile(filePath, (err) => {
                    if (err) {
                        console.error('File sending error:', err);
                        res.status(500).json({ error: 'File sending error' });
                    }
                });
            } else {
                console.error('File not found for patient:', patientId);
                res.status(404).json({ error: 'File not found' });
            }
        }
    });
});

app.get('/api/doctors', (req, res) => {
    db.query('SELECT * FROM patients.medecin AS d JOIN patients.departement AS dept ON d.id_dept = dept.id_departement JOIN patients.service AS s ON dept.id_service = s.idservice;', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json(results);
        }
    });
});
// Route pour vérifier la disponibilité d'un médecin
app.get('/api/check-availability/:id_medecin/:date_rendez_vous', (req, res) => {
    const { id_medecin, date_rendez_vous } = req.params;

    // Vérifiez si toutes les valeurs sont présentes
    if (!id_medecin || !date_rendez_vous) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Préparez la requête SQL pour vérifier la disponibilité du médecin et son statut de congé
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM rendez_vous WHERE id_medecin = ? AND date_rendez_vous = ?) AS rendezvous_count,
            (SELECT statut_congé FROM medecin WHERE idmedecin = ?) AS statut_congé
    `;
    const values = [id_medecin, date_rendez_vous, id_medecin];

    // Exécutez la requête SQL
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Débogage : Afficher les résultats pour vérifier leur structure
        console.log('SQL Query Results:', results);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Vérifiez si le médecin est disponible ou en congé
        const result = results[0];
        const rendezvous_count = result.rendezvous_count;
        const statut_congé = result.statut_congé;

        console.log('Rendezvous Count:', rendezvous_count);
        console.log('Statut Congé:', statut_congé);

        // Déterminez la disponibilité
        if (statut_congé === 1) {
            // Le médecin est en congé
            return res.status(200).json({ available: false, message: 'Doctor is on leave' });
        } else if (rendezvous_count > 0) {
            // Le médecin a déjà un rendez-vous à cette date
            return res.status(200).json({ available: false, message: 'Doctor has appointments at this date' });
        } else {
            // Le médecin est disponible
            return res.status(200).json({ available: true });
        }
    });
});

// Route pour créer un rendez-vous
app.post('/api/appointments', (req, res) => {
    const { id_medecin, id_patient, date_rendez_vous } = req.body;

    // Affichez les valeurs pour débogage
    console.log(`Creating appointment with doctor ID: ${id_medecin}, patient ID: ${id_patient}, date: ${date_rendez_vous}`);

    // Vérifiez si toutes les valeurs sont présentes
    if (!id_medecin || !id_patient || !date_rendez_vous) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Préparez la requête SQL
    const sql = 'INSERT INTO rendez_vous (id_medecin, id_patient, date_rendez_vous) VALUES (?, ?, ?)';
    const values = [id_medecin, id_patient, date_rendez_vous];

    // Exécutez la requête SQL
    db.query(sql, values, (err) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        // Réponse en cas de succès
        res.status(200).json({ message: 'Appointment created successfully' });
    });
});
// Route pour obtenir les rendez-vous
app.get('/api/getappointments', (req, res) => {
    // Préparez la requête SQL pour obtenir tous les rendez-vous
    const sql = 'SELECT * FROM rendez_vous';
  
    // Exécutez la requête SQL
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      // Réponse en cas de succès
      res.status(200).json(results);
    });
  });

// Route pour modifier les rendez-vous
app.put('/api/appointments', (req, res) => {
    const { id_medecin, id_patient, date_rendez_vous, oldDate } = req.body;

    console.log('Received data:', { id_medecin, id_patient, date_rendez_vous, oldDate });
    console.log("old data",oldDate)
    const date = new Date(date_rendez_vous);
    const old_Date = new Date(oldDate);
    if (!id_medecin || !id_patient || !date_rendez_vous) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    const formattedOldDate = `${old_Date.getFullYear()}-${String(old_Date.getMonth() + 1).padStart(2, '0')}-${String(old_Date.getDate()).padStart(2, '0')} ${String(old_Date.getHours()).padStart(2, '0')}:${String(old_Date.getMinutes()).padStart(2, '0')}:${String(old_Date.getSeconds()).padStart(2, '0')}`;

    // Vérifiez s'il existe une entrée avec cette date pour cet id_medecin et id_patient
    const checkSql = `SELECT * FROM rendez_vous WHERE id_medecin = ? AND id_patient = ? AND date_rendez_vous = ?`;
    const checkValues = [id_medecin, id_patient, formattedDate];
  
    db.query(checkSql, checkValues, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Si une entrée existe déjà avec cette combinaison, envoyez une erreur
        if (results.length > 0) {
            return res.status(400).json({ error: 'This appointment already exists' });
        }

        // Si aucun conflit, procédez à la mise à jour
        const updateSql = `UPDATE rendez_vous SET date_rendez_vous = ? WHERE id_medecin = ? AND id_patient = ? AND date_rendez_vous = ?`;
        const updateValues = [formattedDate, id_medecin, id_patient, formattedOldDate];
    
        console.log('Executing SQL:', { sql: updateSql, values: updateValues });
    
        db.query(updateSql, updateValues, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Appointment updated successfully' });
        });
    });
});

  
// Route pour obtenir les détails d'un médecin par son ID
app.get('/api/doctor/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT idmedecin, nom, prenom, id_dept, specialite, études, statut_congé FROM medecin WHERE idmedecin = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results[0]);
    });
});
  
  // Route pour obtenir les détails d'un patient par son ID
  app.get('/api/patient/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM patients WHERE matricule = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(results[0]);
    });
  });
   // Route pour supprimer un rendez vous
  app.delete('/api/deleteappointments', (req, res) => {
    const { id_medecin, id_patient, date_rendez_vous } = req.body;
  
    if (!id_medecin || !id_patient || !date_rendez_vous) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Convertir la date ISO 8601 en format DATETIME
    const date = new Date(date_rendez_vous);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  
    const sql = 'DELETE FROM rendez_vous WHERE id_medecin = ? AND id_patient = ? AND date_rendez_vous = ?';
    const values = [id_medecin, id_patient, formattedDate];
  
    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.status(200).json({ message: 'Appointment deleted successfully' });
    });
});
// Endpoint to save medical condition data
app.post('/api/medical-conditions', (req, res) => {
    console.log('Received Body:', req.body); // Log the received body

    const { conditions, habits, matricule } = req.body;

    if (!Array.isArray(conditions) || !Array.isArray(habits)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    // Filtrer les conditions avec la réponse "oui"
    const filteredConditions = conditions.filter(condition => condition.answer === 'oui');
    
    // Filtrer les habitudes avec la réponse "oui"
    const filteredHabits = habits.filter(habit => habit.answerhab === 'oui');

    if (filteredConditions.length === 0 && filteredHabits.length === 0) {
        return res.status(400).json({ message: 'No conditions or habits with "Oui" found' });
    }

    // SQL queries for checking existing records
    const checkConsultationSql = 'SELECT * FROM antecedant_medical WHERE matricule = ?';
    const checkHabitSql = 'SELECT * FROM habitude_vie WHERE matricule = ?';

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction Error:', err);
            return res.status(500).json({ message: 'Transaction error', error: err });
        }

        // Check for existing consultations and habits in parallel
        const checkConsultationPromise = new Promise((resolve, reject) => {
            db.query(checkConsultationSql, [matricule], (err, results) => {
                if (err) {
                    return reject({ type: 'consultation', error: err });
                }
                resolve(results.length > 0);
            });
        });

        const checkHabitPromise = new Promise((resolve, reject) => {
            db.query(checkHabitSql, [matricule], (err, results) => {
                if (err) {
                    return reject({ type: 'habit', error: err });
                }
                resolve(results.length > 0);
            });
        });

        Promise.all([checkConsultationPromise, checkHabitPromise])
            .then(([consultationExists, habitExists]) => {
                if (consultationExists || habitExists) {
                    let message = 'Record already exists for this patient';
                    if (consultationExists && habitExists) {
                        message = 'Consultation and habit records already exist for this patient';
                    } 
                    return db.rollback(() => {
                        res.status(400).json({ message });
                    });
                }

                // Requêtes pour les conditions médicales
                const conditionQueries = filteredConditions.map(condition => {
                    return new Promise((resolve, reject) => {
                        const { id_antecedant, name, anciennete, traitement, equilibre, description, matricule } = condition;
                        const sql = `
                           INSERT INTO antecedant_medical (idantecedant, libelle_antecedant, anciennete, traitement, equilibre, description, matricule) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)`;

                        db.query(sql, [id_antecedant, name, anciennete, traitement, equilibre, description, matricule], (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(result);
                        });
                    });
                });

                // Requêtes pour les habitudes
                const habitQueries = filteredHabits.map(habit => {
                    return new Promise((resolve, reject) => {
                        const { id_hab, namehab, quantite, matricule } = habit;
                        const sql = `
                           INSERT INTO habitude_vie (idhabitude, libelle, quantite, matricule) 
                           VALUES (?, ?, ?, ?)`;

                        db.query(sql, [id_hab, namehab, quantite, matricule], (err, result) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(result);
                        });
                    });
                });

                // Exécuter toutes les requêtes
                Promise.all([...conditionQueries, ...habitQueries])
                    .then(() => {
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error('Commit Error:', err);
                                    res.status(500).json({ message: 'Error during commit', error: err });
                                });
                            }
                            res.status(200).json({ message: 'Data successfully saved' });
                        });
                    })
                    .catch(err => {
                        db.rollback(() => {
                            console.error('Error during processing:', err);
                            res.status(500).json({ message: 'Database error', error: err });
                        });
                    });
            })
            .catch(({ type, error }) => {
                db.rollback(() => {
                    console.error(`Database Error (${type} Check):`, error);
                    res.status(500).json({ message: 'Database error during record check', error });
                });
            });
    });
});


app.post('/api/validateappointment', (req, res) => {
    const { id_medecin, id_patient, date_rendez_vous } = req.body;

    // Convertir les dates depuis le format reçu
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    // Vérifier si la date et l'heure du rendez-vous sont supérieures à la date actuelle
    const currentDateTime = new Date();
    const appointmentDateTime = new Date(date_rendez_vous);

    console.log({ currentDateTime, appointmentDateTime });
    if ( currentDateTime <= appointmentDateTime) {
        console.log('Appointment date is in the future');
        return res.status(400).json({ message: 'Le rendez-vous doit être à une date et une heure futures.' });
    }
    const formattedDate = formatDate(new Date(date_rendez_vous));

    // Ajouter le rendez-vous à la table 'consultation'
    const insertQuery = 'INSERT INTO consultation (idmedecin, idpatient, date) VALUES (?, ?, ?)';
    db.query(insertQuery, [id_medecin, id_patient, formattedDate], (err, result) => {
        if (err) {
            console.log('Error during insertion:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'ajout à la table consultation.' });
        }

        // Supprimer le rendez-vous de la table 'rendez_vous'
        const deleteQuery = 'DELETE FROM rendez_vous WHERE id_medecin = ? AND id_patient = ? AND date_rendez_vous = ?';
        db.query(deleteQuery, [id_medecin, id_patient, formattedDate], (err, result) => {
            if (err) return res.status(500).json({ message: 'Erreur lors de la suppression de la table rendez_vous.' });

            res.status(200).json({ message: 'Rendez-vous validé et déplacé vers la table consultation.' });
        });
    });
});



// Route pour obtenir les détails d'un patient avec les données des tables antecedant_medical et habitude
app.get('/api/patients/:matricule/details', (req, res) => {
    const matricule = req.params.matricule;

    // Requête SQL pour obtenir les détails du patient
    const patientQuery = 'SELECT * FROM patients WHERE matricule = ?';
    const antecedentsQuery = 'SELECT * FROM antecedant_medical WHERE matricule = ?';
    const habitsQuery = 'SELECT * FROM habitude_vie WHERE matricule = ?';

    db.query(patientQuery, [matricule], (err, patientResults) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (patientResults.length === 0) return res.status(404).json({ message: 'Patient not found' });

        const patient = patientResults[0];

        // Récupérer les antécédents médicaux
        db.query(antecedentsQuery, [matricule], (err, antecedentsResults) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            // Récupérer les habitudes
            db.query(habitsQuery, [matricule], (err, habitsResults) => {
                if (err) return res.status(500).json({ error: 'Database error' });

                // Retourner toutes les données au frontend
                res.json({
                    patient,
                    antecedents: antecedentsResults,
                    habits: habitsResults
                });
            });
        });
    });
});
// Route pour obtenir la liste des patients du docteur
app.get('/api/doctors/:idmedecin/liste', (req, res) => {
    const id_medecin = req.params.idmedecin;

    // Requête SQL pour obtenir les détails du docteur
    const medecinQuery = 'SELECT * FROM medecin WHERE idmedecin = ?';

    // Requête SQL pour obtenir les détails des patients associés
    const patientsQuery = `
        SELECT p.*, c.date
        FROM consultation AS c
        JOIN patients.patients AS p ON c.idpatient = p.matricule
        JOIN patients.medecin AS m ON c.idmedecin = m.idmedecin
        WHERE c.idmedecin = ?;
    `;

        // Récupérer les détails du docteur
        db.query(medecinQuery, [id_medecin], (err, doctorResults) => {
            if (err) {
                console.error('Error fetching doctor details:', err); // Log l'erreur pour débogage
                return res.status(500).json({ error: 'Database error' });
            }

            if (doctorResults.length === 0) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            const doctor = doctorResults[0];

            // Récupérer les patients associés
            db.query(patientsQuery, [id_medecin], (err, patientResults) => {
                if (err) {
                    console.error('Error fetching patient details:', err); // Log l'erreur pour débogage
                    return res.status(500).json({ error: 'Database error' });
                }

                // Retourner toutes les données au frontend
                res.json({
                    doctor,
                    patients: patientResults
                });
            });
        });
    
});

// Route pour obtenir les statistiques du tableau de bord
app.get('/api/dashboard/stats', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM medecin) AS medecins,
            (SELECT COUNT(*) FROM departement) AS departements,
            (SELECT COUNT(*) FROM patients) AS patients,
            (SELECT COUNT(*) FROM rendez_vous) AS rendez_vous_total,
            (SELECT COUNT(*) FROM rendez_vous WHERE DATE(date_rendez_vous) = CURDATE()) AS rendez_vous_today,
            (SELECT COUNT(*) FROM medecin WHERE statut_congé = 1) AS medecins_conge
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});
// Fetch recommendations from MySQL and insert into Neo4j
app.get('/api/recommendations', async (req, res) => {
    const session = neo4jDriver.session();

    try {
        const mysqlResults = await new Promise((resolve, reject) => {
            db.query('SELECT idmedecin, nom, prenom, specialite, études, statut_congé FROM medecin', (error, results) => {
                if (error) {
                    console.error('MySQL Error:', error);
                    return reject('Error fetching data from MySQL');
                }
                resolve(results);
            });
        });

        console.log('MySQL Results:', mysqlResults);
        // Clear existing data in Neo4j
        await session.run('MATCH (n:Doctor) DETACH DELETE n');
        console.log('Existing data cleared.');
        for (const doctor of mysqlResults) {
            try {
                await session.run(
                    `MERGE (d:Doctor {id: $id, name: $name, surname: $surname, specialty: $specialty, level: $level})
                     SET d.leave_status = $leave_status`,
                    {
                        id: doctor.idmedecin,
                        name: doctor.nom,
                        surname: doctor.prenom,
                        specialty: doctor.specialite,
                        level: doctor.études,
                        leave_status: doctor.statut_congé
                    }
                );
            } catch (err) {
                console.error('Neo4j Insertion Error:', err);
            }
        }

        const cypherQuery = `
            MATCH (selected:Doctor {id: $id})
            MATCH (other:Doctor)
            WHERE (other.specialty = selected.specialty
                OR other.level = selected.level)
            AND other.leave_status = 0
            AND other.id <> selected.id
            RETURN other AS recommended_doctor

        `;

        const selectedDoctorId = req.query.selectedDoctorId;
        if (!selectedDoctorId) {
            await session.close();
            return res.status(400).send('Selected doctor ID is required');
        }

        console.log('Selected Doctor ID:', selectedDoctorId);
        console.log('Cypher Query:', cypherQuery);
        const selectedDoctor = parseFloat(req.query.selectedDoctorId);
        const result = await session.run(cypherQuery, { id: selectedDoctor });

        console.log('Neo4j Query Result:', result.records);

        const recommendations = result.records.map(record => {
            const doctor = record.get('recommended_doctor');
            return {
                id: doctor.properties.id,
                name: doctor.properties.name,
                surname: doctor.properties.surname
            };
        });

        res.json(recommendations);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Error processing request');
    } finally {
        await session.close();
    }
});



// Endpoint to get available doctors
app.get('/api/available-doctors', async (req, res) => {
    const session = neo4jDriver.session();

    try {
        // Fetch doctor data from MySQL
        const mysqlResults = await new Promise((resolve, reject) => {
            db.query('SELECT idmedecin, nom, prenom, specialite, études, statut_congé FROM medecin', (error, results) => {
                if (error) {
                    console.error('MySQL Error:', error);
                    return reject('Error fetching data from MySQL');
                }
                resolve(results);
            });
        });

        console.log('MySQL Results:', mysqlResults);

        // Clear existing data in Neo4j
        await session.run('MATCH (n:Doctor) DETACH DELETE n');
        console.log('Existing data cleared.');

        // Insert data into Neo4j
        for (const doctor of mysqlResults) {
            try {
                await session.run(
                    `MERGE (d:Doctor {id: $id})
                     SET d.name = $name, 
                         d.surname = $surname, 
                         d.specialty = $specialty, 
                         d.level = $level,
                         d.leave_status = $leave_status`,
                    {
                        id: doctor.idmedecin,
                        name: doctor.nom,
                        surname: doctor.prenom,
                        specialty: doctor.specialite,
                        level: doctor.études,
                        leave_status: doctor.statut_congé
                    }
                );
            } catch (err) {
                console.error('Neo4j Insertion Error:', err);
            }
        }

        // Query Neo4j to get available doctors
        const result = await session.run(
            `MATCH (d:Doctor)
             WHERE d.leave_status = 0
             RETURN d`
        );

        console.log('Neo4j Query Result:', result.records);

        // Format the response with available doctors
        const doctors = result.records.map(record => {
            const doctor = record.get('d');
            return {
                id: doctor.properties.id,
                name: doctor.properties.name,
                surname: doctor.properties.surname,
                specialty: doctor.properties.specialty,
                level: doctor.properties.level
            };
        });

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching available doctors:', error);
        res.status(500).send('Error fetching available doctors');
    } finally {
        await session.close();
    }
});
app.get('/api/best-doctors', async (req, res) => {
    const session = neo4jDriver.session();

    try {
        // Fetch doctor data and their number of appointments from MySQL
        const mysqlResults = await new Promise((resolve, reject) => {
            db.query(`
                SELECT m.idmedecin, m.nom, m.prenom, m.specialite, m.études, m.statut_congé, COUNT(r.id_medecin) AS rdv_count
                FROM medecin m
                LEFT JOIN rendez_vous r ON m.idmedecin = r.id_medecin
                GROUP BY m.idmedecin, m.specialite
            `, (error, results) => {
                if (error) {
                    console.error('MySQL Error:', error);
                    return reject('Error fetching data from MySQL');
                }
                resolve(results);
            });
        });

        console.log('MySQL Results:', mysqlResults);

        // Clear existing data in Neo4j
        await session.run('MATCH (n:BDoctor) DETACH DELETE n');
        console.log('Existing data cleared.');

        // Insert data into Neo4j
        for (const doctor of mysqlResults) {
            try {
                await session.run(
                    `MERGE (d:BDoctor {id: $id})
                     SET d.name = $name, 
                         d.surname = $surname, 
                         d.specialty = $specialty, 
                         d.level = $level,
                         d.leave_status = $leave_status,
                         d.rdv_count = $rdv_count`,
                    {
                        id: doctor.idmedecin,
                        name: doctor.nom,
                        surname: doctor.prenom,
                        specialty: doctor.specialite,
                        level: doctor.études,
                        leave_status: doctor.statut_congé,
                        rdv_count: doctor.rdv_count
                    }
                );
            } catch (err) {
                console.error('Neo4j Insertion Error:', err);
            }
        }

        // Query Neo4j to get the best doctor per specialty
        const result = await session.run(
            `MATCH (d:BDoctor)
                WHERE d.rdv_count > 0
                WITH d.specialty AS specialty, d
                ORDER BY d.rdv_count DESC
                WITH specialty, collect(d)[0] AS topDoctor
                RETURN topDoctor`
        );

        console.log('Neo4j Query Result:', result.records);

        // Format the response with the best doctors
        const doctors = result.records.map(record => {
            const doctor = record.get('topDoctor');
            return {
                id: doctor.properties.id,
                name: doctor.properties.name,
                surname: doctor.properties.surname,
                specialty: doctor.properties.specialty,
                level: doctor.properties.level,
                rdv_count: doctor.properties.rdv_count
            };
        });

        res.json(doctors);
    } catch (error) {
        console.error('Error fetching best doctors:', error);
        res.status(500).send('Error fetching best doctors');
    } finally {
        await session.close();
    }
});

app.post('/predict', async (req, res) => {
    try {
        // Envoyer les données à l'API Python
        const response = await axios.post('http://localhost:5001/predict', {
            symptoms: req.body.symptoms
        });

        // Renvoyer la réponse de l'API Python
        res.json(response.data);
    } catch (error) {
        console.error('Error making prediction:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});
// Démarrez le serveur
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
