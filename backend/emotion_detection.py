import os
import glob
import pandas as pd
import librosa
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from typing import Tuple

# --- Configuration ---
DIARIZED_METADATA_FILE = "diarized_asr_data.csv"
FINAL_METADATA_FILE = "final_analytics_data.csv"
TARGET_SR = 16000

# --- Feature Extraction ---
def extract_features(file_path: str) -> Tuple[float, float, float]:
    """
    Extracts basic prosodic features (pitch, energy, rate) for stress detection.
    """
    try:
        y, sr = librosa.load(file_path, sr=TARGET_SR)
        
        # 1. Pitch (Fundamental Frequency - F0 Mean)
        # Use pyin to estimate F0, often a strong indicator of stress
        f0 = librosa.yin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'), sr=sr)
        pitch_mean = np.mean(f0[f0 > 0]) if np.any(f0 > 0) else 0.0

        # 2. Energy (Root Mean Square Energy - RMSE Mean)
        rmse = librosa.feature.rms(y=y)[0]
        energy_mean = np.mean(rmse)

        # 3. Speech Rate Proxy (using Zero-Crossing Rate)
        # Higher ZCR can sometimes indicate faster, stressed speech (though complex)
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        rate_proxy = np.mean(zcr)

        return pitch_mean, energy_mean, rate_proxy
    
    except Exception as e:
        print(f"Feature extraction failed for {os.path.basename(file_path)}. Error: {e}")
        return 0.0, 0.0, 0.0

# --- Stress Prediction Placeholder Model ---
def train_and_predict_stress(df: pd.DataFrame) -> np.ndarray:
    """
    Simulates a simple stress classification model.
    In a real project, this requires a labeled dataset (Normal/Stressed).
    """
    # ⚠️ Placeholder: You need to add a 'stress_label' column (1=Stressed, 0=Normal)
    # based on manual review of the audio/transcript for a real model.
    # For prototyping, we'll generate mock stress scores based on energy/pitch.
    
    features = np.array(df['features'].tolist())
    
    # Scale features
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    # Mock Stress Model: A simple rule based on high energy and high pitch variance
    pitch_scaled = scaled_features[:, 0]
    energy_scaled = scaled_features[:, 1]
    
    # Generate a "Stress Index" score (0 to 100)
    # Stress Score = (Pitch Deviation + Energy Level) * 50
    stress_scores = (pitch_scaled + energy_scaled) * 25 + 50
    stress_scores = np.clip(stress_scores, 0, 100)

    print("Note: Stress detection is based on generated mock scores (Pitch/Energy) for prototyping.")
    return stress_scores


# --- Script Execution ---
if __name__ == "__main__":
    
    try:
        df = pd.read_csv(DIARIZED_METADATA_FILE)
    except FileNotFoundError:
        print("Error: diarized_asr_data.csv not found. Run speaker_diarization.py first.")
        exit()

    # 1. Extract Features
    print("Extracting prosodic features for stress analysis...")
    df['features'] = df['file_path'].apply(extract_features)

    # 2. Predict Stress Score
    df['stress_score'] = train_and_predict_stress(df)
    
    # Clean up intermediate column before saving
    df.drop(columns=['features'], inplace=True)
    
    # Save the updated DataFrame
    df.to_csv(FINAL_METADATA_FILE, index=False)
    print(f"\nPhase 3: Stress Detection Complete. Final data saved to {FINAL_METADATA_FILE}")