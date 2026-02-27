import os
import glob
import pandas as pd
import librosa
import re
from typing import List

# --- Configuration ---
# --- Configuration ---
# --- Configuration ---
NR_PATH = "./processed_audio"
TRANSCRIPT_PATH = r"C:\Users\tssmi\Downloads\extracted_texts\train-00000-of-00002_text.txt"
RAW_ENTRIES_FILE = TRANSCRIPT_PATH  # ✅ directly use the file, not as a folder
TARGET_METADATA_FILE = "asr_data.csv"
TARGET_SR = 16000



# --- Function to Parse the Provided Transcript Format ---
def parse_raw_entries(file_path: str) -> List[str]:
    """
    Parses the provided transcript file into a list of text entries.
    Looks for lines like: [Entry X]: TEXT
    """
    entries = []
    entry_pattern = re.compile(r'\[Entry \d+\]: (.*)')

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                match = entry_pattern.match(line.strip())
                if match:
                    text = match.group(1).strip()
                    if text:
                        entries.append(text)
    except Exception as e:
        print(f"Error reading or parsing transcript file {file_path}: {e}")

    return entries


# --- Main Metadata Generation ---
def create_asr_metadata():
    """Generates the metadata CSV by mapping audio segments to transcripts."""
    
    # 1. Load all transcript entries
    all_transcripts = parse_raw_entries(RAW_ENTRIES_FILE)
    if not all_transcripts:
        print(f"FATAL: Failed to load transcripts from {RAW_ENTRIES_FILE}. Check file path and format.")
        return

    print(f"Loaded {len(all_transcripts)} transcript entries.")

    # 2. Get all segmented audio files
    audio_files = sorted(glob.glob(os.path.join(NR_PATH, '*_seg_*.wav')))

    if not audio_files:
        print(f"WARNING: No segmented files found in {NR_PATH}. Run preprocessing.py first!")
        return

    print(f"Found {len(audio_files)} segmented audio files.")

    # 3. Match counts
    num_audio = len(audio_files)
    num_transcripts = len(all_transcripts)

    if num_audio > num_transcripts:
        print(f"WARNING: More audio segments ({num_audio}) than transcripts ({num_transcripts}). Truncating audio list.")
        audio_files = audio_files[:num_transcripts]
    elif num_transcripts > num_audio:
        print(f"WARNING: More transcripts ({num_transcripts}) than audio segments ({num_audio}). Truncating transcript list.")
        all_transcripts = all_transcripts[:num_audio]

    print(f"Mapping {len(audio_files)} segments to {len(all_transcripts)} transcripts.")

    # 4. Create metadata list
    data_list = []
    for i, file_path in enumerate(audio_files):
        transcript = all_transcripts[i]
        try:
            y, sr = librosa.load(file_path, sr=None)
            duration = librosa.get_duration(y=y, sr=sr)
            data_list.append({
                'file_path': os.path.abspath(file_path),
                'transcript': transcript,
                'duration': duration,
                'segment_index': i
            })
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    # 5. Save metadata
    df = pd.DataFrame(data_list)
    df.to_csv(TARGET_METADATA_FILE, index=False)
    print(f"\n✅ Metadata created successfully: {TARGET_METADATA_FILE} with {len(df)} entries.")


if __name__ == '__main__':
    create_asr_metadata()
