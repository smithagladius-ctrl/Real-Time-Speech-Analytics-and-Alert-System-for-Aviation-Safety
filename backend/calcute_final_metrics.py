import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    confusion_matrix, 
    precision_score, 
    recall_score, 
    f1_score, 
    classification_report
)

# --- Configuration ---
GROUND_TRUTH_FILE = r"C:\Users\tssmi\OneDrive\Desktop\nlp\manual_review_ground_truth_labeled.csv"

# Map text labels to numeric
label_mapping = {
    "Low": 0,
    "Moderate": 1,
    "Elevated": 2,
    "Critical": 3
}

# --- Metric Calculation ---
def calculate_validation_metrics(df_review):
    """
    Calculates Precision, Recall, F1, and displays confusion matrix for the alerting system.
    """

    # --- 1. Normalize the Manual_Risk_Label column ---
    if "Manual_Risk_Label" not in df_review.columns:
        raise KeyError("Manual_Risk_Label column not found in the CSV.")

    # Clean up possible extra spaces or lowercase issues
    df_review["Manual_Risk_Label"] = df_review["Manual_Risk_Label"].astype(str).str.strip().str.capitalize()

    # Map text labels (Low, Moderate, Elevated, Critical) to numbers
    df_review["Manual_Risk_Label"] = df_review["Manual_Risk_Label"].map(label_mapping)

    if df_review["Manual_Risk_Label"].isna().all():
        raise ValueError("All Manual_Risk_Label values are invalid — check your CSV values.")

    y_true = df_review["Manual_Risk_Label"]

    # --- 2. Create binary alert variable ---
    if "alert_level" not in df_review.columns:
        raise KeyError("alert_level column not found in the CSV.")

    df_review["is_alerted"] = df_review["alert_level"].apply(
        lambda x: 1 if str(x).strip() in ['EMERGENCY', 'Elevated Risk'] else 0
    )

    y_pred = df_review["is_alerted"]

    # --- 3. Filter valid samples ---
    valid_indices = y_true.notna() & y_pred.notna()
    y_true = y_true[valid_indices].astype(int)
    y_pred = y_pred[valid_indices].astype(int)

    if len(y_true) < 10:
        print("Not enough labeled samples (min 10) to calculate reliable metrics. Please label more data.")
        return

    # --- 4. Calculate metrics ---
    precision = precision_score(y_true, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_true, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    cm = confusion_matrix(y_true, y_pred)

    # --- 5. Print results ---
    print("\n--- FINAL ALERT SYSTEM PERFORMANCE ---")
    print(f"Total Labeled Samples Used: {len(y_true)}")
    print("-" * 40)
    print(f"**Precision (Weighted)**: {precision:.3f}")
    print(f"**Recall (Weighted)**: {recall:.3f}")
    print(f"**F1 Score (Weighted)**: {f1:.3f}")
    print("-" * 40)
    print("\nDetailed Classification Report:\n")
    print(classification_report(y_true, y_pred, zero_division=0))

    # --- 6. Plot confusion matrix ---
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title("Confusion Matrix — Alert System Validation")
    plt.xlabel("Predicted Label")
    plt.ylabel("True Label")
    plt.tight_layout()
    plt.show()

    print("\n✅ These validated metrics are the final technical conclusion of your project.")


# --- Main Execution ---
if __name__ == '__main__':
    try:
        df_review = pd.read_csv(GROUND_TRUTH_FILE)
        calculate_validation_metrics(df_review)
    except FileNotFoundError:
        print(f"Error: {GROUND_TRUTH_FILE} not found. Please ensure the CSV is in the root directory.")
    except KeyError as e:
        print(f"Error: Missing expected column - {e}. Ensure 'Manual_Risk_Label' and 'alert_level' exist.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
