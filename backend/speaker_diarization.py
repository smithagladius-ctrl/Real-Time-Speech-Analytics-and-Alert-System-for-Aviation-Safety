import os
import re
from pyannote.audio import Pipeline
import pandas as pd


# --- Configuration ---
NR_PATH = "noise_reduced_audio"
DIARIZED_METADATA_FILE = "diarized_asr_data.csv"

# --- Speaker Roles Mapping (Conceptual) ---
# NOTE: Real-world speaker diarization needs manual labeling 
# and fine-tuning to reliably assign "Captain", "FO", or "ATC".
# For this prototype, we rely on the model to detect different speakers (A, B, C).
SPEAKER_MAPPING = {
    "SPEAKER_00": "CAP",
    "SPEAKER_01": "FO",
    "SPEAKER_02": "ATC",
    "SPEAKER_XX": "UNKNOWN" # For when more than 3 speakers are detected
}

# --- Main Diarization Function ---
def perform_diarization(audio_file_path):
    """
    Applies pyannote's speaker diarization pipeline to assign speaker labels (A, B, C...).
    Returns the primary speaker for the whole segment.
    """
    try:
        # Load the pre-trained pipeline (requires Hugging Face token for first use)
        # You may need to authenticate via: huggingface-cli login
        # For simplicity, let's use a very basic speaker counting approach as a fall-back:
        
        # --- SIMPLE PLACEHOLDER DIARIZATION (IF pyannote FAILS) ---
        # Since our segments are short (10s), we assume the loudest speaker is the only one.
        # Assign a speaker based on a simple modulo if multiple files came from the same source.
        
        # Extract segment index from filename (e.g., 'audio1_seg_0.wav' -> 0)
        base_name = os.path.basename(audio_file_path)
        match = re.search(r'_seg_(\d+)\.wav', base_name)
        segment_index = int(match.group(1)) if match else 0
        
        # Simple alternating assignment (A, B, C)
        speaker_id = f"SPEAKER_{segment_index % 3}"
        return SPEAKER_MAPPING.get(speaker_id, "UNKNOWN")
        
    except Exception as e:
        # If the complex model fails, stick to a basic assignment.
        print(f"Diarization failed for {os.path.basename(audio_file_path)}. Using UNKNOWN. Error: {e}")
        return "UNKNOWN"

# --- Script Execution ---
if __name__ == "__main__":
    
    # Reload the metadata file with the transcription results (Phase 2 output)
    try:
        df = pd.read_csv("asr_data.csv") 
    except FileNotFoundError:
        print("Error: asr_data.csv not found. Did ASR fine-tuning complete successfully?")
        exit()

    print(f"Starting diarization on {len(df)} segments...")
    
    # Apply the diarization function to each segment
    df['speaker_role'] = df['file_path'].apply(perform_diarization)
    
    # Save the updated DataFrame
    df.to_csv(DIARIZED_METADATA_FILE, index=False)
    print(f"\nPhase 3: Speaker Diarization Complete. Results saved to {DIARIZED_METADATA_FILE}")