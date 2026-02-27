import pandas as pd

# --- Configuration ---
FINAL_REPORT_FILE = "real_time_alert_report.csv"

# --- Metrics Calculation ---
def calculate_metrics(df):
    """
    Analyzes the alert report for key quantitative metrics.
    """
    total_segments = len(df)
    
    # 1. Alert Breakdown
    alert_counts = df['alert_level'].value_counts()
    
    # 2. Key Triggers
    # Simple counting of segments where each feature was a primary trigger
    triggers = {
        'Critical Keyword': df['alert_reason'].str.contains('Critical Keyword').sum(),
        'Severe Stress': df['alert_reason'].str.contains('Severe Stress Spike').sum(),
        'Elevated Stress (General)': df['alert_reason'].str.contains('High Stress').sum(),
        'Comms Anomaly': df['alert_reason'].str.contains('Communication Hesitation').sum(),
        'ATC Stress': df['alert_reason'].str.contains('ATC Stress').sum()
    }

    # 3. Precision/Recall Placeholder (Requires Manual Ground Truth Labeling)
    # NOTE: To calculate true Precision and Recall, you MUST manually review 
    # a subset of the audio and label it as 'Actual Risk' (1) or 'Actual Routine' (0).
    # Since we don't have that, we skip the final calculation, but define the need.
    
    print("\n--- Project Performance Metrics ---")
    print(f"Total Segments Analyzed: {total_segments}")
    print("\n1. Alert Level Distribution:")
    print(alert_counts.to_string())
    
    print("\n2. Primary Trigger Counts:")
    for trigger, count in triggers.items():
        print(f"- {trigger}: {count} ({(count / total_segments) * 100:.2f}%)")
        
    print("\n3. **Validation Required for True Performance**")
    print("   -> Manually review a subset of the 'EMERGENCY' and 'Elevated Risk' alerts.")
    print("   -> Create a new column 'Manual_Risk_Label' (1=True Risk, 0=False Risk).")
    print("   -> Calculate True Positives (TP), False Positives (FP), and False Negatives (FN).")
    # Precision = TP / (TP + FP)
    # Recall = TP / (TP + FN)


# --- Script Execution ---
if __name__ == '__main__':
    try:
        df_report = pd.read_csv(FINAL_REPORT_FILE)
        calculate_metrics(df_report)
    except FileNotFoundError:
        print(f"ERROR: {FINAL_REPORT_FILE} not found. Ensure alert_system.py ran successfully.")
    except Exception as e:
        print(f"An error occurred during analysis: {e}")