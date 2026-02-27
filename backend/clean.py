from datasets import load_from_disk, Dataset
import shutil, os

cache_dir = os.path.expanduser("~/.cache/huggingface/datasets")
if os.path.exists(cache_dir):
    shutil.rmtree(cache_dir)
    print(f"🗑️ Removed all dataset cache files at {cache_dir}")
else:
    print("✅ No dataset cache found.")
