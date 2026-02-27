import pandas as pd
import numpy as np

# --- Configuration ---
FINAL_REPORT_FILE = "real_time_alert_report.csv"
SAMPLE_SIZE = 100 # Adjust this based on how much time you have for manual review

# --- Main Sampling Logic ---
if __name__ == '__main__':
    try:
        df = pd.read_csv(FINAL_REPORT_FILE)
    except FileNotFoundError:
        print(f"Error: {FINAL_REPORT_FILE} not found.")
        exit()

    # 1. Sample Alerted Data (EMERGENCY and Elevated Risk)
    alerted_df = df[df['alert_level'].isin(['EMERGENCY', 'Elevated Risk'])]
    num_alerts_to_sample = min(SAMPLE_SIZE // 2, len(alerted_df))
    alerted_sample = alerted_df.sample(n=num_alerts_to_sample, random_state=42)

    # 2. Sample Routine Data
    routine_df = df[df['alert_level'] == 'Routine']
    num_routine_to_sample = min(SAMPLE_SIZE - num_alerts_to_sample, len(routine_df))
    routine_sample = routine_df.sample(n=num_routine_to_sample, random_state=42)

    # 3. Combine and Prepare for Manual Review
    review_sample = pd.concat([alerted_sample, routine_sample])
    
    # Add the column you need to fill out manually
    review_sample['Manual_Risk_Label'] = np.nan 
    review_sample['Reviewer_Notes'] = ''
    
    # Select only the relevant columns for easy review and save
    review_cols = ['file_path', 'transcript', 'speaker_role', 'stress_score', 'alert_level', 'alert_reason', 'Manual_Risk_Label', 'Reviewer_Notes']
    
    review_sample[review_cols].to_csv("manual_review_ground_truth.csv", index=False)
    print(f"Created 'manual_review_ground_truth.csv' with {len(review_sample)} segments for manual labeling.")
    print("ACTION REQUIRED: Open this CSV, listen to the audio segments, and manually fill the 'Manual_Risk_Label' (1 for True Risk, 0 for Routine).")