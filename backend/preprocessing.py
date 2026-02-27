import os
import glob
import pandas as pd
from io import BytesIO
from pydub import AudioSegment
import numpy as np
import soundfile as sf
import librosa
import noisereduce as nr

# --- Configuration ---
DATA_PATH = r"C:\Users\tssmi\Downloads\drive-download-20251022T075508Z-1-001\train-00000-of-00002.parquet"
PROCESSED_PATH = r".\processed_audio"
NR_PATH = r".\nr_audio"
AUGMENTED_PATH = r".\augmented_audio"

TARGET_SR = 16000
SEGMENT_LENGTH_SEC = 10  # seconds

# --- Setup Directories ---
def setup_directories():
    for path in [PROCESSED_PATH, NR_PATH, AUGMENTED_PATH]:
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created directory: {path}")

# --- Convert dict to AudioSegment ---
def dict_to_audioment(audio_dict):
    """
    Convert a dict containing either:
    {'array': [...], 'sample_rate': ...} or {'bytes': b'...', 'sample_rate': ...}
    to a pydub AudioSegment.
    """
    if 'array' in audio_dict:
        arr = np.array(audio_dict['array'], dtype=np.float32)
        sr = audio_dict.get('sample_rate', TARGET_SR)
        buf = BytesIO()
        sf.write(buf, arr, sr, format='WAV')
        buf.seek(0)
        return AudioSegment.from_file(buf, format="wav")

    elif 'bytes' in audio_dict:
        buf = BytesIO(audio_dict['bytes'])
        return AudioSegment.from_file(buf, format="wav")

    else:
        raise ValueError(f"Unknown audio dict keys: {audio_dict.keys()}")

# --- Load audio from Parquet ---
def read_audio_from_parquet(parquet_path):
    df = pd.read_parquet(parquet_path)
    audio_cols = [c for c in df.columns if "audio" in c.lower()]
    if not audio_cols:
        print("No audio column found in Parquet!")
        return []

    audio_list = []
    for idx, row in df.iterrows():
        audio_data = row[audio_cols[0]]
        if isinstance(audio_data, dict):
            try:
                audio_segment = dict_to_audioment(audio_data)
                audio_list.append((f"audio_{idx}", audio_segment))
            except Exception as e:
                print(f"Failed to convert row {idx}: {e}")
        else:
            print(f"Unsupported audio type at row {idx}: {type(audio_data)}")

    print(f"Loaded {len(audio_list)} audio clips from Parquet.")
    return audio_list

# --- Segmentation & Normalization ---
def segment_and_normalize_from_parquet():
    setup_directories()
    all_segments = []

    audio_list = read_audio_from_parquet(DATA_PATH)
    if not audio_list:
        return []

    for base_name, audio in audio_list:
        normalized_audio = audio.normalize()
        segment_length_ms = SEGMENT_LENGTH_SEC * 1000

        for i, start_ms in enumerate(range(0, len(normalized_audio), segment_length_ms)):
            end_ms = start_ms + segment_length_ms
            segment = normalized_audio[start_ms:end_ms]

            output_filename = f"{base_name}_seg_{i}.wav"
            output_path = os.path.join(PROCESSED_PATH, output_filename)
            try:
                segment.export(output_path, format="wav")
                all_segments.append(output_path)
            except Exception as e:
                print(f"Failed to export segment {output_filename}: {e}")

    print(f"Segmentation complete: {len(all_segments)} segments created.")
    return all_segments

# --- Noise Reduction (noisereduce 3.x compatible) ---
def apply_classical_noise_reduction(input_folder, output_folder):
    processed_files = glob.glob(os.path.join(input_folder, '*.wav'))
    nr_files = []

    if not processed_files:
        print(f"No WAV files found in {input_folder} to apply NR.")
        return []

    print(f"Applying Noise Reduction to {len(processed_files)} segments...")
    for file_path in processed_files:
        output_filename = os.path.basename(file_path)
        output_path = os.path.join(output_folder, output_filename)
        try:
            y, sr = sf.read(file_path, dtype='float32')
            # Convert stereo to mono if needed
            if y.ndim > 1:
                y = np.mean(y, axis=1)
            # Resample if not TARGET_SR
            if sr != TARGET_SR:
                y = librosa.resample(y, orig_sr=sr, target_sr=TARGET_SR)
                sr = TARGET_SR
            reduced_noise_y = nr.reduce_noise(y=y, sr=sr)  # NO verbose or noise_clip
            sf.write(output_path, reduced_noise_y, sr)
            nr_files.append(output_path)
        except Exception as e:
            print(f"NR failed for {file_path}: {e}")

    print(f"Noise reduction complete: {len(nr_files)} files saved.")
    return nr_files

# --- Noise Augmentation ---
def add_noise_augmentation(clean_audio_path, noise_audio_path, output_path, snr_db=5):
    try:
        clean = AudioSegment.from_wav(clean_audio_path)
        noise = AudioSegment.from_wav(noise_audio_path)
    except Exception as e:
        print(f"Could not load audio for augmentation: {e}")
        return

    if len(noise) < len(clean):
        repeats = (len(clean) // len(noise)) + 1
        noise = noise * repeats
    noise = noise[:len(clean)]

    clean_dbfs = clean.dBFS
    target_noise_dbfs = clean_dbfs - snr_db
    noise = noise.normalize()
    gain_needed = target_noise_dbfs - noise.dBFS
    noise = noise.apply_gain(gain_needed)

    noisy_audio = clean.overlay(noise)
    try:
        noisy_audio.export(output_path, format="wav")
        print(f"Saved noisy file: {os.path.basename(output_path)} (SNR: {snr_db}dB)")
    except Exception as e:
        print(f"Failed to save noisy audio {output_path}: {e}")

def run_augmentation_pipeline(noise_source_path):
    all_processed = glob.glob(os.path.join(PROCESSED_PATH, '*.wav'))
    subset_size = min(50, len(all_processed))
    if subset_size == 0:
        print("No processed audio for augmentation.")
        return

    validation_subset = np.random.choice(all_processed, subset_size, replace=False)
    snr_levels = [10, 5, 0]
    for clean_file in validation_subset:
        base_name = os.path.splitext(os.path.basename(clean_file))[0]
        for snr in snr_levels:
            output_name = f"{base_name}_snr{snr}.wav"
            output_path = os.path.join(AUGMENTED_PATH, output_name)
            add_noise_augmentation(clean_file, noise_source_path, output_path, snr_db=snr)

# --- Main Execution ---
if __name__ == "__main__":
    segmented_files = segment_and_normalize_from_parquet()
    if not segmented_files:
        print("No audio segments created. Stopping.")
    else:
        noise_reduced_files = apply_classical_noise_reduction(PROCESSED_PATH, NR_PATH)
        NOISE_FILE = "cockpit_noise.wav"  # Place your noise file in the same directory
        if os.path.exists(NOISE_FILE):
            run_augmentation_pipeline(NOISE_FILE)
        else:
            print(f"Noise file '{NOISE_FILE}' not found. Skipping augmentation.")

    print("Preprocessing Complete.")
