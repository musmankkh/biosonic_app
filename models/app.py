from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import numpy as np
import pandas as pd
import librosa
import tensorflow as tf
import os
import uvicorn
from sklearn.preprocessing import MinMaxScaler

# Load model
model = tf.keras.models.load_model("biosonic_balanced_model.h5") 

# Load and clean metadata
metadata = pd.read_csv("metadata_balanced.csv")
metadata.columns = [col.strip().lower() for col in metadata.columns]  # Normalize column names

# Encoding mappings
chest_locations = sorted(metadata["chest location"].dropna().unique())
genders = sorted(metadata["gender"].dropna().unique())
diagnosis_labels = metadata[['encoded_diagnosis', 'diagnosis']].drop_duplicates()
label_map = dict(zip(diagnosis_labels['encoded_diagnosis'], diagnosis_labels['diagnosis']))

# Input shape
MFCC_SHAPE = (100, 13)

# FastAPI app
app = FastAPI()

# 🎧 Preprocess audio
def preprocess_audio(file_path):
    y, sr = librosa.load(file_path, sr=4000)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13).T
    mfcc = mfcc[:MFCC_SHAPE[0]]
    if mfcc.shape[0] < MFCC_SHAPE[0]:
        pad = np.zeros((MFCC_SHAPE[0] - mfcc.shape[0], 13))
        mfcc = np.vstack([mfcc, pad])
    return mfcc.astype(np.float32)

# 🧬 Normalize age
def normalize_age(age):
    scaler = MinMaxScaler()
    age_array = metadata['age'].dropna().values.reshape(-1, 1)
    scaler.fit(age_array)
    return float(scaler.transform([[age]])[0][0])

# 🚻 One-hot encode gender
def encode_gender(gender):
    gender = gender.upper().strip()
    if gender not in ["F", "M"]:
        raise ValueError("Gender must be 'F' or 'M'")
    return np.array([1.0 if gender == "F" else 0.0, 1.0 if gender == "M" else 0.0], dtype=np.float32)

# 📍 One-hot encode chest location
def encode_chest(chest_location):
    if chest_location not in chest_locations:
        raise ValueError(f"Invalid chest location. Choose one of: {chest_locations}")
    one_hot = np.zeros(len(chest_locations), dtype=np.float32)
    one_hot[chest_locations.index(chest_location)] = 1.0
    return one_hot

# 🔮 Predict API
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    age: float = Form(...),
    gender: str = Form(...),
    chest_location: str = Form(...)
):
    try:
        # Save uploaded file temporarily
        temp_file = f"temp.wav"
        with open(temp_file, "wb") as f:
            f.write(await file.read())

        # Preprocess inputs
        mfcc = preprocess_audio(temp_file)
        os.remove(temp_file)

        age_input = normalize_age(age)
        gender_input = encode_gender(gender)
        chest_input = encode_chest(chest_location)

        # 🔁 Pad chest_input to 42 if model expects 42-length input
        if chest_input.shape[0] < 42:
            padded = np.zeros(42, dtype=np.float32)
            padded[:chest_input.shape[0]] = chest_input
            chest_input = padded

        # Prepare inputs for model
        inputs = {
            'audio_input': np.expand_dims(mfcc, axis=0),
            'age_input': np.expand_dims(age_input, axis=0),
            'gender_input': np.expand_dims(gender_input, axis=0),
            'chest_input': np.expand_dims(chest_input, axis=0)
        }

        # Predict
        probs = model.predict(inputs)[0]
        top3_indices = probs.argsort()[-3:][::-1]
        top3 = [
            {"label": label_map.get(i, "Unknown"), "confidence": float(f"{probs[i]*100:.2f}")}
            for i in top3_indices
        ]
        return JSONResponse({"predictions": top3})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})



# 🚀 Start server
if __name__ == "__main__":
    
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
