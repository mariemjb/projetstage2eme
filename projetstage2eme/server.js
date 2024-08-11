const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

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
    password: 'gestion_scolaire123',
    database: 'patients'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

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
    db.query('SELECT * FROM patients.medecin;', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(200).json(results);
        }
    });
});
// Route pour vérifier la disponibilité d'un médecin

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

  
   
  
app.put('/api/appointments', (req, res) => {
    const { id_medecin, id_patient, date_rendez_vous } = req.body;
    console.log('Received data:', { id_medecin, id_patient, date_rendez_vous });

    const date = new Date(date_rendez_vous);
    if (!id_medecin || !id_patient || !date_rendez_vous) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

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
        const updateSql = `UPDATE rendez_vous SET date_rendez_vous = ? WHERE id_medecin = ? AND id_patient = ?`;
        const updateValues = [formattedDate, id_medecin, id_patient];
    
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


// Démarrez le serveur
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});