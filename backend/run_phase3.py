import subprocess
import os

# --- PHASE 3 SCRIPT SEQUENCE ---
SCRIPTS = [
    "speaker_diarization.py",     # Phase 3.1: Speaker Tagging
    "emotion_detection.py"        # Phase 3.2: Emotion/Stress Detection
]

def run_script(script_name):
    print(f"\n--- Running {script_name} ---")
    
    # Check if the script exists in the working directory
    if not os.path.exists(script_name):
        print(f"Error: {script_name} not found.")
        return False
        
    # Execute using system Python interpreter
    try:
        result = subprocess.run(
            ["python", script_name],
            check=True,              # Raise error if non-zero exit code
            capture_output=True,
            text=True
        )
        print(result.stdout)
        print(f"--- {script_name} finished successfully. ---")
        return True

    except subprocess.CalledProcessError as e:
        print(f"--- ERROR: {script_name} failed. ---")
        print(f"Stdout:\n{e.stdout}")
        print(f"Stderr:\n{e.stderr}")
        return False

    except FileNotFoundError:
        print("Error: Python command not found. Ensure Python is in your PATH and environment is active.")
        return False


if __name__ == "__main__":
    print("Starting Phase 3: Speaker Tagging and Stress/Emotion Detection.")
    
    success = True
    for script in SCRIPTS:
        if not run_script(script):
            success = False
            break
            
    if success:
        print("\n✅ PHASE 3 COMPLETE. Proceed to Phase 4: NLP and Real-Time Alert Generation.")
    else:
        print("\n❌ PHASE 3 FAILED. Check logs for errors.")
