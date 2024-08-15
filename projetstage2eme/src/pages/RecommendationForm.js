import React, { useState } from 'react';
import axios from 'axios';
import './recomandationform.css'
function RecommendationForm() {
    const [symptoms, setSymptoms] = useState({
        itching: 0,
        skin_rash: 0,
        nodal_skin_eruptions: 0,
        dischromic_patches: 0,
        headache: 0,
        chills: 0,
        high_fever: 0,
        cough: 0,
        chest_pain: 0,
        nausea: 0,
        vomiting: 0,
        abdominal_pain: 0,
        diarrhoea: 0,
        loss_of_appetite: 0,
        fatigue: 0,
        muscle_pain: 0,
        dizziness: 0,
        joint_pain: 0,
        weight_loss: 0,
        dehydration: 0,
        yellowing_of_eyes: 0,
        weakness_in_limbs: 0,
        dark_urine: 0,
        breathlessness: 0,
        blood_in_sputum: 0,
        pain_during_bowel_movements: 0,
        anxiety: 0,
        shivering: 0,
        runny_nose: 0,
        acidity: 0,
        restlessness: 0,
        indigestion: 0,
        obesity: 0,
        family_history: 0,
        cramps: 0
        // Ajoutez tous les autres symptômes nécessaires ici
    });
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setSymptoms({ ...symptoms, [e.target.name]: parseInt(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5002/predict', { symptoms });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error making prediction', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Démangeaison:
                    <input type="number" name="itching" value={symptoms.itching} onChange={handleChange} />
                </label>
                <label>
                    Eruption Cutanee:
                    <input type="number" name="skin_rash" value={symptoms.skin_rash} onChange={handleChange} />
                </label>
                <label>
                    Eruptions Cutanees Nodales:
                    <input type="number" name="nodal_skin_eruptions" value={symptoms.nodal_skin_eruptions} onChange={handleChange} />
                </label>
                <label>
                    Plaques Dyschromiques:
                    <input type="number" name="dischromic_patches" value={symptoms.dischromic_patches} onChange={handleChange} />
                </label>
                <label>
                    Maux de Tete:
                    <input type="number" name="headache" value={symptoms.headache} onChange={handleChange} />
                </label>
                <label>
                    Frissons:
                    <input type="number" name="chills" value={symptoms.chills} onChange={handleChange} />
                </label>
                <label>
                    Forte Fièvre:
                    <input type="number" name="high_fever" value={symptoms.high_fever} onChange={handleChange} />
                </label>
                <label>
                    Toux:
                    <input type="number" name="cough" value={symptoms.cough} onChange={handleChange} />
                </label>
                <label>
                    Douleur Thoracique:
                    <input type="number" name="chest_pain" value={symptoms.chest_pain} onChange={handleChange} />
                </label>
                <label>
                    Nausée:
                    <input type="number" name="nausea" value={symptoms.nausea} onChange={handleChange} />
                </label>
                <label>
                    Vomissements:
                    <input type="number" name="vomiting" value={symptoms.vomiting} onChange={handleChange} />
                </label>
                <label>
                    Douleur Abdominale:
                    <input type="number" name="abdominal_pain" value={symptoms.abdominal_pain} onChange={handleChange} />
                </label>
                <label>
                    Diarrhée:
                    <input type="number" name="diarrhoea" value={symptoms.diarrhoea} onChange={handleChange} />
                </label>
                <label>
                    Perte d'Appétit:
                    <input type="number" name="loss_of_appetite" value={symptoms.loss_of_appetite} onChange={handleChange} />
                </label>
                <label>
                    Fatigue:
                    <input type="number" name="fatigue" value={symptoms.fatigue} onChange={handleChange} />
                </label>
                <label>
                    Douleur Musculaire:
                    <input type="number" name="muscle_pain" value={symptoms.muscle_pain} onChange={handleChange} />
                </label>
                <label>
                    Vertiges:
                    <input type="number" name="dizziness" value={symptoms.dizziness} onChange={handleChange} />
                </label>
                <label>
                    Douleur Articulaire:
                    <input type="number" name="joint_pain" value={symptoms.joint_pain} onChange={handleChange} />
                </label>
                <label>
                    Perte de Poids:
                    <input type="number" name="weight_loss" value={symptoms.weight_loss} onChange={handleChange} />
                </label>
                <label>
                    Déshydratation:
                    <input type="number" name="dehydration" value={symptoms.dehydration} onChange={handleChange} />
                </label>
                <label>
                    Jaunisse:
                    <input type="number" name="yellowing_of_eyes" value={symptoms.yellowing_of_eyes} onChange={handleChange} />
                </label>
                <label>
                    Faiblesse des Membres:
                    <input type="number" name="weakness_in_limbs" value={symptoms.weakness_in_limbs} onChange={handleChange} />
                </label>
                <label>
                    Urine Foncée:
                    <input type="number" name="dark_urine" value={symptoms.dark_urine} onChange={handleChange} />
                </label>
                <label>
                    Essoufflement:
                    <input type="number" name="breathlessness" value={symptoms.breathlessness} onChange={handleChange} />
                </label>
                <label>
                    Sang dans les Crachat:
                    <input type="number" name="blood_in_sputum" value={symptoms.blood_in_sputum} onChange={handleChange} />
                </label>
                <label>
                    Douleur lors des Mouvements Intestinaux:
                    <input type="number" name="pain_during_bowel_movements" value={symptoms.pain_during_bowel_movements} onChange={handleChange} />
                </label>
                <label>
                    Anxiété:
                    <input type="number" name="anxiety" value={symptoms.anxiety} onChange={handleChange} />
                </label>
                <label>
                    Tremblements:
                    <input type="number" name="shivering" value={symptoms.shivering} onChange={handleChange} />
                </label>
                <label>
                    Écoulement Nasal:
                    <input type="number" name="runny_nose" value={symptoms.runny_nose} onChange={handleChange} />
                </label>
                <label>
                    Acidité:
                    <input type="number" name="acidity" value={symptoms.acidity} onChange={handleChange} />
                </label>
                <label>
                    Agitation:
                    <input type="number" name="restlessness" value={symptoms.restlessness} onChange={handleChange} />
                </label>
                <label>
                    Indigestion:
                    <input type="number" name="indigestion" value={symptoms.indigestion} onChange={handleChange} />
                </label>
                <label>
                    Obésité:
                    <input type="number" name="obesity" value={symptoms.obesity} onChange={handleChange} />
                </label>
                <label>
                    Antécédents Familiaux:
                    <input type="number" name="family_history" value={symptoms.family_history} onChange={handleChange} />
                </label>
                <label>
                    Crampes:
                    <input type="number" name="cramps" value={symptoms.cramps} onChange={handleChange} />
                </label>
                <button type="submit">Get Recommendation</button>
            </form>
            {prediction && <p>Recommended Specialist: {prediction}</p>}
        </div>
    );
}

export default RecommendationForm;
