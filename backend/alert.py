import os
import pandas as pd
import re
from transformers import pipeline

# --- Configuration ---
FINAL_METADATA_FILE = "final_analytics_data.csv"
FINAL_REPORT_FILE = "real_time_alert_report.csv"

# **IMPORTANT: Set this to the path of your best fine-tuned Whisper model**
FINE_TUNED_MODEL_PATH = "whisper_finetuned_subset/final" 

# --- Alert Thresholds & Keyword Lists ---
CRITICAL_KEYWORDS = r"\b(mayday|emergency|abort|fire|failure|engine out|bird strike)\b"
SEVERE_STRESS_THRESHOLD = 85  # Stress score > 85
ELEVATED_STRESS_THRESHOLD = 70  # Stress score > 70
OFF_SCRIPT_PHRASES = ["say again", "what was that", "uhm", "err"] # Simple anomaly proxy

# --- 1. Load ASR Model for Real-Time Use ---
def load_asr_pipeline(model_path):
    """Loads the fine-tuned Whisper model into a Hugging Face ASR pipeline."""
    try:
        print(f"Loading ASR pipeline from: {model_path}...")
        asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model=model_path,
            device=0 if torch.cuda.is_available() else -1
        )
        return asr_pipeline
    except Exception as e:
        print(f"ERROR: Could not load ASR model. Ensure the path is correct and dependencies are installed. {e}")
        return None

# --- 2. NLP and Anomaly Detection Logic (Phase 4.1 & 4.2) ---
def analyze_transcript_and_alert(row):
    """
    Analyzes a single transcript segment for critical content and generates an alert level.
    """
    transcript = str(row['transcript']).lower()
    alert_level = "Routine"
    alert_reason = []

    # A. Keyword Detection (Critical Safety Event)
    if re.search(CRITICAL_KEYWORDS, transcript):
        alert_level = "EMERGENCY"
        alert_reason.append("Critical Keyword Detected")

    # B. Stress-Word Correlation (NLP + SER Fusion)
    if row['stress_score'] >= SEVERE_STRESS_THRESHOLD:
        alert_level = "EMERGENCY" if alert_level != "EMERGENCY" else alert_level
        alert_reason.append(f"Severe Stress Spike (Score: {int(row['stress_score'])})")
        
    elif row['stress_score'] >= ELEVATED_STRESS_THRESHOLD:
        alert_level = "Elevated Risk"
        alert_reason.append(f"High Stress (Score: {int(row['stress_score'])})")

    # C. Communication Anomaly/Hesitation (Simple Intent/Anomaly)
    if any(phrase in transcript for phrase in OFF_SCRIPT_PHRASES) and row['speaker_role'] != "ATC":
        if alert_level == "Routine":
            alert_level = "Minor Anomaly"
        alert_reason.append("Potential Communication Hesitation/Anomaly")
        
    # D. Role-Specific Check (e.g., ATC has high stress)
    if row['speaker_role'] == "ATC" and row['stress_score'] >= ELEVATED_STRESS_THRESHOLD:
        alert_level = "Elevated Risk" if alert_level == "Routine" else alert_level
        alert_reason.append("ATC Stress (May indicate external issue or high workload)")


    return alert_level, "; ".join(alert_reason)

# --- Main Execution ---
if __name__ == '__main__':
    
    # 1. Load Pre-Analyzed Data (from Phase 3)
    try:
        df = pd.read_csv(FINAL_METADATA_FILE)
    except FileNotFoundError:
        print(f"Error: {FINAL_METADATA_FILE} not found. Run Phase 3 scripts first.")
        exit()

    # NOTE: In a *true* real-time system, the ASR step would happen here 
    # using load_asr_pipeline() and transcribing the raw audio,
    # then running Phase 3 on the fly. 
    # For this report, we use the pre-transcribed/analyzed data for Phase 4.

    print(f"Applying NLP rules and generating alerts for {len(df)} records...")
    
    # 2. Apply Analysis and Alerting
    df[['alert_level', 'alert_reason']] = df.apply(
        lambda row: analyze_transcript_and_alert(row), 
        axis=1, 
        result_type='expand'
    )
    
    # 3. Generate Final Report (Keep only relevant columns)
    final_cols = [
        'segment_index', 
        'duration',
        'file_path',
        'speaker_role', 
        'stress_score', 
        'transcript', 
        'alert_level', 
        'alert_reason'
    ]
    df_report = df[final_cols]
    
    # 4. Save and Report Metrics
    df_report.to_csv(FINAL_REPORT_FILE, index=False)

    print("\n--- PHASE 4: Alert Generation Complete ---")
    print(f"Analysis saved to: {FINAL_REPORT_FILE}")
    print("\nSUMMARY OF CRITICAL ALERTS:")
    
    critical_alerts = df_report[df_report['alert_level'].isin(["EMERGENCY", "Elevated Risk"])]
    if not critical_alerts.empty:
        print(critical_alerts[['segment_index', 'speaker_role', 'stress_score', 'alert_level', 'alert_reason', 'transcript']].head(10))
    else:
        print("No critical or elevated risk alerts were triggered in this sample.")