from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2
import os

app = Flask(__name__)

# 1. Pastikan mengarah ke file model FairFace yang baru saja disimpan!
MODEL_PATH = 'models/model_deteksi_wajah.h5'
model = load_model(MODEL_PATH)

# 2. Kamus Terjemahan FairFace (7 Kelas)
gender_dict = {0: 'Laki-laki', 1: 'Perempuan'}
race_dict = {
    0: 'Kaukasia', 
    1: 'Afrika', 
    2: 'India', 
    3: 'Asia Timur', 
    4: 'ASEAN', 
    5: 'Arab', 
    6: 'Latino'
}

@app.route('/predict', methods=['POST'])
def predict():
    if 'foto' not in request.files:
        return jsonify({'status': 'error', 'message': 'Tidak ada file foto yang diunggah'}), 400

    file = request.files['foto']
    file_path = "temp_image.jpg"
    file.save(file_path)

    try:
        # Preprocessing gambar (sama seperti yang kita lakukan di Jupyter Notebook)
        img = cv2.imread(file_path)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (224, 224))
        img_normalized = img_resized / 255.0
        img_input = np.expand_dims(img_normalized, axis=0)

        # AI Melakukan Prediksi
        prediksi = model.predict(img_input)

        # Membongkar hasil
        pred_age = int(np.round(prediksi[0][0][0]))
        pred_gender_val = prediksi[1][0][0]
        pred_gender = 'Perempuan' if pred_gender_val > 0.5 else 'Laki-laki'
        pred_race_idx = np.argmax(prediksi[2][0])
        pred_race = race_dict[pred_race_idx]

        # Mengembalikan hasil ke Laravel
        return jsonify({
            'status': 'success',
            'data': {
                'umur': pred_age,
                'gender': pred_gender,
                'ras': pred_race
            }
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        # Hapus file sementara agar storage tidak penuh
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == '__main__':
    # Jalankan server Flask di port 5000
    app.run(debug=True, port=5000)