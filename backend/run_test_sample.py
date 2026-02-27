import pandas as pd
import numpy as np
import librosa
import os
import re
import io
from typing import Tuple

# --- Configuration ---
TEST_FILE = "test-00000-of-00001.parquet"
TEST_REPORT_FILE = "final_validated_test_report.csv"
TARGET_SR = 16000

# --- Mock / Placeholder Setup ---
CRITICAL_KEYWORDS = r"\b(mayday|emergency|abort|fire|failure|engine out|bird strike)\b"
SEVERE_STRESS_THRESHOLD = 85
ELEVATED_STRESS_THRESHOLD = 70

SPEAKER_MAPPING = {
    "SPEAKER_00": "CAP",
    "SPEAKER_01": "FO",
    "SPEAKER_02": "ATC",
    "SPEAKER_XX": "UNKNOWN"
}

# --- Utility Functions ---

def perform_mock_diarization(segment_id: str) -> str:
    match = re.search(r'seg_(\d+)|_(\d+)$', str(segment_id))
    segment_index = int(match.group(1) or match.group(2)) if match and (match.group(1) or match.group(2)) else 0
    speaker_id = f"SPEAKER_{segment_index % 3}"
    return SPEAKER_MAPPING.get(speaker_id, "UNKNOWN")

def calculate_stress_score(audio_array: np.ndarray, sr: int) -> float:
    """Mock stress computation for fast test."""
    rmse = np.mean(librosa.feature.rms(y=audio_array))
    stress_score = 40 + rmse * 800
    return np.clip(stress_score, 0, 100)

def analyze_transcript_and_alert(row: pd.Series) -> Tuple[str, str]:
    transcript = str(row['transcribed_text']).lower()
    alert_level = "Routine"
    alert_reason = []

    if re.search(CRITICAL_KEYWORDS, transcript):
        alert_level = "EMERGENCY"
        alert_reason.append("Critical Keyword Detected")
    elif row['stress_score'] >= SEVERE_STRESS_THRESHOLD:
        alert_level = "EMERGENCY"
        alert_reason.append(f"Severe Stress (Score: {int(row['stress_score'])})")
    elif row['stress_score'] >= ELEVATED_STRESS_THRESHOLD:
        alert_level = "Elevated Risk"
        alert_reason.append(f"High Stress (Score: {int(row['stress_score'])})")
    
    off_script_phrases = ["say again", "what was that", "uhm", "err"]
    if any(p in transcript for p in off_script_phrases):
        if alert_level == "Routine":
            alert_level = "Minor Anomaly"
        alert_reason.append("Communication Hesitation/Anomaly")
    
    if row['speaker_role'] == "ATC" and row['stress_score'] >= ELEVATED_STRESS_THRESHOLD:
        if alert_level == "Routine":
            alert_level = "Elevated Risk"
        alert_reason.append("ATC High Stress Detected")

    return alert_level, "; ".join(alert_reason)

# --- Main Test Runner ---
def run_end_to_end_test(df_test):
    results = []
    for index, row in df_test.iterrows():
        # Fake audio loading (no Whisper decoding)
        try:
            audio_bytes = row['bytes'][0] if isinstance(row['bytes'], list) else row['bytes']
            audio_array, sr = librosa.load(io.BytesIO(audio_bytes), sr=TARGET_SR)
        except Exception:
            audio_array = np.random.randn(TARGET_SR)  # fallback synthetic audio
            sr = TARGET_SR

        # Mock "transcription"
        fake_texts = [
            "mayday mayday engine out",
            "climb level one two zero",
            "hold short runway three one",
            "fire in the cabin",
            "roger copy that"
        ]
        transcribed_text = np.random.choice(fake_texts)

        # Stress and speaker simulation
        stress_score = calculate_stress_score(audio_array, sr)
        speaker_role = perform_mock_diarization(row['id'])
        
        temp_row = pd.Series({
            'id': row['id'],
            'transcribed_text': transcribed_text,
            'speaker_role': speaker_role,
            'stress_score': stress_score,
        })
        alert_level, alert_reason = analyze_transcript_and_alert(temp_row)

        results.append({
            'ID': row['id'],
            'Transcribed_Text': transcribed_text,
            'Speaker_Role': speaker_role,
            'Stress_Score': int(stress_score),
            'Alert_Level': alert_level,
            'Alert_Reason': alert_reason
        })

    return pd.DataFrame(results)

# --- Execution ---
if __name__ == "__main__":
    print(f"Loading test data from {TEST_FILE}...")
    try:
        df_test = pd.read_parquet(TEST_FILE)
        df_audio = pd.json_normalize(df_test['audio'])
        df_test = pd.concat([df_test.drop('audio', axis=1).reset_index(drop=True), df_audio], axis=1)
    except Exception as e:
        print(f"Error loading Parquet file: {e}")
        exit()

    print(f"Running fast mock evaluation for {len(df_test)} test segments...")
    df_results = run_end_to_end_test(df_test.head(20))  # Process first 20 for instant results

    if not df_results.empty:
        df_results.to_csv(TEST_REPORT_FILE, index=False)
        print("\n✅ FAST TEST RUN COMPLETE")
        print(f"Results saved to: {TEST_REPORT_FILE}")
        print("\nSUMMARY OF ALERTS:")
        print(df_results['Alert_Level'].value_counts().to_string())
        print("-" * 30)
    else:
        print("❌ No results generated. Check input data structure.")
