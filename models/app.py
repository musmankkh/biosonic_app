from fastapi import FastAPI, UploadFile, File
import uvicorn
import numpy as np
import pywt
from tensorflow.keras.models import load_model
import librosa
import io
import soundfile as sf
from scipy.signal import butter, lfilter

app = FastAPI()

# Load model and labels
model = load_model("biosonic_augmented_model.h5")
DISEASE_LABELS = [
    "asthma", "asthma + lung fibrosis", "bronchiectasis", "bronchiolitis", "copd",
    "healthy", "heart failure", "heart failure + copd", "heart failure + lung fibrosis",
    "lrti", "lung fibrosis", "pleural effusion", "pneumonia", "urti"
]

# Wavelet Denoising
def wavelet_denoise(y, wavelet='db8', level=1):
    coeffs = pywt.wavedec(y, wavelet, mode="per")
    sigma = np.median(np.abs(coeffs[-level])) / 0.6745
    uthresh = sigma * np.sqrt(2 * np.log(len(y)))
    coeffs_thresh = [pywt.threshold(c, value=uthresh, mode='soft') if i > 0 else c for i, c in enumerate(coeffs)]
    return pywt.waverec(coeffs_thresh, wavelet, mode="per")

# High-pass filter
def highpass_filter(y, sr, cutoff=100.0):
    nyq = 0.5 * sr
    norm_cutoff = cutoff / nyq
    b, a = butter(4, norm_cutoff, btype='high')
    return lfilter(b, a, y)

# Bandpass filter
def bandpass_filter(y, sr, lowcut=100.0, highcut=2000.0):
    nyq = 0.5 * sr
    low = max(lowcut / nyq, 0.001)
    high = min(highcut / nyq, 0.999)

    if high <= low:
        return y  # skip filtering if invalid
    b, a = butter(4, [low, high], btype='band')
    return lfilter(b, a, y)


# Notch filter
def notch_filter(y, sr, notch_freq=50.0, Q=30.0):
    nyq = 0.5 * sr
    notch = notch_freq / nyq
    low = max(notch - 0.01, 0.001)
    high = min(notch + 0.01, 0.999)

    if high <= low:
        return y
    b, a = butter(2, [low, high], btype='bandstop')
    return lfilter(b, a, y)


# Process audio: applies denoising, filters, then extracts MFCC
def process_audio(file_bytes, max_len=100, n_mfcc=13):
    y, sr = sf.read(io.BytesIO(file_bytes))
    if len(y.shape) > 1:
        y = np.mean(y, axis=1)  # Convert stereo to mono

    y = wavelet_denoise(y)
    y = highpass_filter(y, sr)
    y = bandpass_filter(y, sr)
    y = notch_filter(y, sr)

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc).T

    if mfcc.shape[0] < max_len:
        mfcc = np.pad(mfcc, ((0, max_len - mfcc.shape[0]), (0, 0)))
    else:
        mfcc = mfcc[:max_len, :]

    return np.expand_dims(mfcc, axis=0)

@app.post("/predict")
async def predict(audio: UploadFile = File(...)):
    file_bytes = await audio.read()
    mfcc_features = process_audio(file_bytes)

    

    prediction = model.predict([mfcc_features])[0]
    top_indices = prediction.argsort()[-3:][::-1]
    result = {DISEASE_LABELS[i]: f"{round(prediction[i]*100, 2)}%" for i in top_indices}
    return {"Top-3 Predictions": result}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=7860)

# uvicorn app:app --reload --host 127.0.0.1 --port 7860
