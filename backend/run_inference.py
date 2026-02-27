import os
import glob
from transformers import pipeline
import librosa
import jiwer # Library for Word Error Rate calculation

# --- Configuration ---
MODEL_PATH = "whisper-aviation-tuned/final" # Path where your fine-tuned model was saved
AUGMENTED_PATH = "augmented_validation"
TARGET_SR = 16000

# --- Main Inference Logic ---
if __name__ == '__main__':
    
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Fine-tuned model not found at {MODEL_PATH}. Run asr_finetuning.py first.")
        exit()

    # 1. Load the fine-tuned model using the convenient Hugging Face pipeline
    print("Loading fine-tuned ASR pipeline...")
    # Use the model and processor saved by the trainer
    asr_pipeline = pipeline(
        "automatic-speech-recognition",
        model=MODEL_PATH,
        chunk_length_s=30, # Max audio chunk size for the pipeline
        device=0 if torch.cuda.is_available() else -1 # Use GPU if available
    )

    # 2. Get list of noisy audio files
    noisy_files = glob.glob(os.path.join(AUGMENTED_PATH, '*.wav'))
    
    if not noisy_files:
        print(f"No files found in {AUGMENTED_PATH}. Run preprocessing.py step 1.4 first.")
        exit()
        
    print(f"Starting inference on {len(noisy_files)} noisy files...")

    references = [] # Ground truth texts
    hypotheses = [] # Model predictions

    # 3. Perform Inference
    for file_path in noisy_files:
        
        # NOTE: This validation script is a simplification. 
        # You'd typically need a separate CSV linking AUGMENTED_PATH files to transcripts.
        # For simplicity, we are assuming the noisy files match the transcript in the metadata.
        # --- Placeholder for getting Ground Truth (REPLACE THIS) ---
        # Find the transcript in the original metadata file based on filename
        # ... logic to find ground truth ...
        # Simplified: We will just run the model and print the result for now.

        try:
            # Transcribe the audio
            result = asr_pipeline(file_path, generate_kwargs={"language": "en"})
            prediction = result["text"].strip()
            
            print(f"File: {os.path.basename(file_path)}")
            print(f"Prediction: {prediction}\n")
            
            # (TO BE COMPLETED LATER: If you get the ground truth)
            # references.append(ground_truth)
            # hypotheses.append(prediction)

        except Exception as e:
            print(f"Error during transcription of {file_path}: {e}")

    # 4. Calculate WER (Once you have the ground truth)
    # if references and hypotheses:
    #     wer = jiwer.wer(references, hypotheses)
    #     print(f"\n--- Final Word Error Rate (WER) on Noisy Data: {wer:.4f} ---")