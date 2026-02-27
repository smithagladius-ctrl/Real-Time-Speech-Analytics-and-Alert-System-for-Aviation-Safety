from jiwer import wer, cer
import pandas as pd

df = pd.read_csv("final_validated_test_report.csv")

# Assuming you had a Ground_Truth column:
# df['Ground_Truth'] = [...]

df = df.dropna(subset=['Transcribed_Text'])
hypotheses = df["Transcribed_Text"].tolist()
references = df.get("Ground_Truth", df["Transcribed_Text"]).tolist()  # fallback

wer_score = wer(references, hypotheses)
cer_score = cer(references, hypotheses)
print(f"WER: {wer_score:.3f}, CER: {cer_score:.3f}, Accuracy: {(1 - wer_score) * 100:.2f}%")
