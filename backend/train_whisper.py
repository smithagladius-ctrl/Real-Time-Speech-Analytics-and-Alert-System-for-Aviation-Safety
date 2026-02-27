import torch
from datasets import load_from_disk
from transformers import (
    WhisperProcessor,
    WhisperForConditionalGeneration,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments
)
from torch.nn.utils.rnn import pad_sequence

MODEL_NAME = "openai/whisper-small"
DATASET_DIR = r"C:\Users\tssmi\OneDrive\Desktop\nlp\whisper_cached\final_dataset"
OUTPUT_DIR = r"C:\Users\tssmi\OneDrive\Desktop\nlp\whisper_finetuned_subset"

def data_collator(batch):
    def to_tensor(item):
        if isinstance(item, torch.Tensor):
            return item
        return torch.tensor(item)
    input_features = torch.stack([to_tensor(item["input_features"]) for item in batch])
    labels = pad_sequence([to_tensor(item["labels"]) for item in batch], batch_first=True, padding_value=-100)
    return {"input_features": input_features, "labels": labels}

if __name__ == "__main__":
    print("✅ Loading preprocessed dataset...")
    dataset = load_from_disk(DATASET_DIR)
    # Select only first 100 samples for fast training
    subset = dataset.select(range(100))
    print(f"Using {len(subset)} samples for this training.")

    processor = WhisperProcessor.from_pretrained(MODEL_NAME)
    model = WhisperForConditionalGeneration.from_pretrained(MODEL_NAME)

    training_args = Seq2SeqTrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=2,
        learning_rate=1e-5,
        num_train_epochs=3,
        save_steps=50,
        save_total_limit=2,
        fp16=torch.cuda.is_available(),
        logging_dir="./logs",
        logging_steps=10,
        predict_with_generate=True,
        remove_unused_columns=False,
        report_to="none",
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=subset,
        tokenizer=processor.feature_extractor,
        data_collator=data_collator,
    )

    print("🚀 Starting training on 100 samples...")
    trainer.train()
    print("🎉 Training on 100 samples completed!")

    trainer.save_model(OUTPUT_DIR)
    processor.save_pretrained(OUTPUT_DIR)
    print(f"✅ Saved fine-tuned model at {OUTPUT_DIR}")
