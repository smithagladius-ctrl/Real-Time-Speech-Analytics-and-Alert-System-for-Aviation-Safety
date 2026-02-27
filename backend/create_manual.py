import pandas as pd

# Load the final analytics data (your system output)
df = pd.read_csv("final_analytics_data.csv")

# --- Step 1: Add alert_level column based on stress_score ---
# Define thresholds (adjust these if needed)
def classify_alert(score):
    if score >= 0.8:
        return "EMERGENCY"
    elif score >= 0.5:
        return "Elevated Risk"
    else:
        return "Routine"

df["alert_level"] = df["stress_score"].apply(classify_alert)

# --- Step 2: Add empty Manual_Risk_Label column for human labeling ---
# (You or your team will manually fill these with 1 = risky, 0 = safe)
df["Manual_Risk_Label"] = ""

# --- Step 3: Save this as the new ground truth template ---
df.to_csv("manual_review_ground_truth.csv", index=False)

print("✅ Created manual_review_ground_truth.csv")
print("Please open it and manually fill the 'Manual_Risk_Label' column (at least 10 samples).")
