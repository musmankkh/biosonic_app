from fastapi import FastAPI, UploadFile, File
import uvicorn
import numpy as np
from tensorflow.keras.models import load_model
import librosa
import io
import soundfile as sf
from scipy.signal import butter, lfilter

app = FastAPI()

# Load model
model = load_model(r"D:\c\testing\biosonic_augmented_model.h5")

# Disease labels — make sure this matches the number of classes in your model
DISEASE_LABELS = [
    "asthma", "asthma + lung fibrosis", "bronchiectasis", "bronchiolitis", "copd",
    "healthy", "heart failure", "heart failure + copd", "heart failure + lung fibrosis",
    "lrti", "lung fibrosis", "pleural effusion", "pneumonia", "urti", "unknown"
]  # <-- 15 labels; adjust if needed

# -----------------------------
# Bandpass filter
# -----------------------------
def bandpass_filter(y, sr, lowcut=100.0, highcut=2000.0):
    nyq = 0.5 * sr
    low = max(lowcut / nyq, 1e-5)
    high = min(highcut / nyq, 0.999)
    if not 0 < low < high < 1:
        raise ValueError(f"Invalid bandpass frequencies: low={low}, high={high}")
    b, a = butter(4, [low, high], btype='band')
    return lfilter(b, a, y)

# -----------------------------
# Notch filter
# -----------------------------
def notch_filter(y, sr, notch_freq=50.0, Q=30.0):
    nyq = 0.5 * sr
    notch = notch_freq / nyq
    low = max(notch - 0.01, 1e-5)
    high = min(notch + 0.01, 0.999)
    if not 0 < low < high < 1:
        raise ValueError(f"Invalid notch frequencies: low={low}, high={high}")
    b, a = butter(2, [low, high], btype='bandstop')
    return lfilter(b, a, y)

# -----------------------------
# Audio preprocessing
# -----------------------------
def process_audio(file_bytes, max_len=100, n_mfcc=13):
    y, sr = sf.read(io.BytesIO(file_bytes))
    if len(y.shape) > 1:
        y = np.mean(y, axis=1)  # Convert to mono
    y = bandpass_filter(y, sr)
    y = notch_filter(y, sr)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc).T
    if mfcc.shape[0] < max_len:
        mfcc = np.pad(mfcc, ((0, max_len - mfcc.shape[0]), (0, 0)))
    else:
        mfcc = mfcc[:max_len, :]
    return np.expand_dims(mfcc, axis=0)

# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
async def predict(audio: UploadFile = File(...)):
    try:
        file_bytes = await audio.read()
        mfcc_features = process_audio(file_bytes)
        prediction = model.predict(mfcc_features)[0]

        # Debug info (optional)
        print("Model output shape:", prediction.shape)
        print("Prediction vector:", prediction)

        # Validate output shape
        if len(prediction) != len(DISEASE_LABELS):
            return {
                "error": f"Model output size ({len(prediction)}) does not match number of labels ({len(DISEASE_LABELS)})."
            }

        # Get top-3 predictions
        top_indices = prediction.argsort()[-3:][::-1]
        result = {
            DISEASE_LABELS[i]: f"{round(prediction[i]*100, 2)}%" for i in top_indices
        }

        return {"Top-3 Predictions": result}

    except Exception as e:
        return {"error": str(e)}

# -----------------------------
# Run the server
# -----------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=7860)
