from flask import Flask, request, jsonify
import torch
import pandas as pd
import numpy as np
from flask_cors import CORS 
# Flask uygulamasını başlat
app = Flask(__name__)

CORS(app) 

# Modeli Torch formatında yükle
class SklearnModelWrapper(torch.nn.Module):
    def __init__(self, sklearn_model):
        super(SklearnModelWrapper, self).__init__()
        self.sklearn_model = sklearn_model

    def forward(self, x):
        x = x.detach().numpy()  # Torch tensörünü numpy'a çevir
        return torch.tensor(self.sklearn_model.predict(x))

# Modeli yükleme
model = torch.load("random_forest_model.pt")
model.eval()

# Dataseti yükleme ve özelliklerin çıkarılması
df = pd.read_csv('dataset.csv')  # Veri dosyasının doğru yolunu kontrol edin
print(df.columns)
features = df.iloc[:, :-1]  # Özellikler

# Tahmin için endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        print("Raw request data:", request.data)
        print("Request headers:", request.headers)
        # JSON verisini alma
        data = request.get_json()
        print("Received data:", data)  # Konsola gelen veriyi yazdırın
        # Özellikleri almak (age, sex, cp vb.)
        features_data = [
            data['age'], data['sex'], data['cp'], data['trestbps'], 
            data['chol'], data['fbs'], data['restecg'], data['thalach'], 
            data['exang'], data['oldpeak'], data['slope'], data['ca'], data['thal']
        ]

        # Özellikleri Torch tensörüne çevirme
        input_tensor = torch.tensor(features_data, dtype=torch.float32).unsqueeze(0)  # (1, 13) boyutunda tensor

        # Tahmin yapma
        with torch.no_grad():
            predictions = model(input_tensor)

        # Sonuçları JSON formatında döndürme
        return jsonify({
            'prediction': predictions.tolist()  # Listeye çevirerek döndür
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ana sayfa endpointi
@app.route('/')
def home():
    return "Random Forest Model API is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)