from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Charger le modèle depuis un fichier
with open('model/Specalist.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Récupérer les noms des caractéristiques du modèle
feature_names = model.feature_names_in_

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Récupérer les données JSON envoyées dans la requête POST
        data = request.get_json()
        
        # Extraire les symptômes des données JSON
        symptoms = data.get('symptoms', {})

        # Créer un DataFrame avec les symptômes
        df = pd.DataFrame([symptoms])

        # Vérifier les noms des caractéristiques et ajuster les colonnes
        missing_features = set(feature_names) - set(df.columns)
        if missing_features:
            # Ajouter les colonnes manquantes avec des valeurs par défaut (0 dans ce cas)
            for feature in missing_features:
                df[feature] = 0
            df = df[feature_names]  # Réorganiser les colonnes selon l'ordre du modèle

        # Faire une prédiction avec le modèle
        prediction = model.predict(df)
        
        # Retourner la prédiction comme réponse JSON
        return jsonify({'prediction': prediction[0]})
    
    except Exception as e:
        # Retourner une erreur en cas d'exception
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
