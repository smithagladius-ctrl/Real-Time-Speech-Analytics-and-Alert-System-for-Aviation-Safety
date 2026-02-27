import os
import torch
import torchaudio
import pandas as pd
from datasets import Dataset, concatenate_datasets
from transformers import WhisperProcessor
from dataclasses import dataclass

# -------------------------------
# Configuration
# -------------------------------
CSV_FILE = r"C:\Users\tssmi\OneDrive\Desktop\nlp\asr_data.csv"
MODEL_NAME = "openai/whisper-small"
AUDIO_COLUMN = "file_path"
TRANSCRIPT_COLUMN = "transcript"
SAVE_DIR = r"C:\Users\tssmi\OneDrive\Desktop\nlp\whisper_cached"
BATCH_SIZE = 250  # process 250 files at a time


@dataclass
class DatasetPrepper:
    processor: WhisperProcessor

    def __call__(self, batch):
        input_features, labels = [], []
        for path, text in zip(batch[AUDIO_COLUMN], batch[TRANSCRIPT_COLUMN]):
            try:
                waveform, sr = torchaudio.load(path)
                waveform = waveform.squeeze().numpy()
                if sr != 16000:
                    waveform = torchaudio.functional.resample(torch.tensor(waveform), sr, 16000).numpy()

                features = self.processor(
                    waveform, sampling_rate=16000, return_tensors="pt"
                ).input_features
                label_ids = self.processor.tokenizer(text).input_ids

                input_features.append(features.squeeze(0))
                labels.append(torch.tensor(label_ids))
            except Exception as e:
                print(f"⚠️ Skipping {path}: {e}")
        return {"input_features": input_features, "labels": labels}


if __name__ == "__main__":
    os.makedirs(SAVE_DIR, exist_ok=True)
    print("✅ Loading CSV...")
    df = pd.read_csv(CSV_FILE)
    processor = WhisperProcessor.from_pretrained(MODEL_NAME)
    prep = DatasetPrepper(processor)

    datasets = []
    step = 0
    for i in range(0, len(df), BATCH_SIZE):
        sub_df = df.iloc[i:i + BATCH_SIZE]
        sub_dataset = Dataset.from_pandas(sub_df)
        print(f"Processing batch {step + 1} ({i}-{i + BATCH_SIZE}) ...")
        processed = sub_dataset.map(prep, batched=True, batch_size=1, num_proc=1)
        batch_save = os.path.join(SAVE_DIR, f"chunk_{step}")
        processed.save_to_disk(batch_save)
        datasets.append(processed)
        print(f"✅ Saved batch {step + 1} to {batch_save}")
        step += 1

    full_dataset = concatenate_datasets(datasets)
    full_save_path = os.path.join(SAVE_DIR, "final_dataset")
    full_dataset.save_to_disk(full_save_path)
    print(f"🎯 Preprocessing complete! Saved dataset to {full_save_path}")
