import argparse
import os
import sys
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from io import BytesIO

import torch
from accelerate import Accelerator
from huggingface_hub import HfFolder
from peft import PeftModel
from PIL import Image as PIL_Image
from transformers import MllamaForConditionalGeneration, MllamaProcessor

# Initialize accelerator
accelerator = Accelerator()
device = accelerator.device

# Constants
MODEL_NAME = "meta-llama/Llama-3.2-11B-Vision-Instruct"
LORA_PATH = "../PATH/to/save/PEFT/model"  # Hardcoded LoRA path
MAX_OUTPUT_TOKENS = 2048
MELANOMA_PROMPT = "Does this skin lesion image show signs of melanoma?"

def get_hf_token():
    """Retrieve Hugging Face token from the cache or environment."""
    token = os.getenv("HUGGINGFACE_TOKEN") or HfFolder.get_token()
    if not token:
        print("Hugging Face token not found. Please login using `huggingface-cli login`.")
        sys.exit(1)
    return token

def load_model_and_processor():
    """Load model and processor with LoRA adapter"""
    print(f"Loading model: {MODEL_NAME}")
    hf_token = get_hf_token()
    
    model = MllamaForConditionalGeneration.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.bfloat16,
        use_safetensors=True,
        device_map=device,
        token=hf_token,
    )
    
    processor = MllamaProcessor.from_pretrained(
        MODEL_NAME, token=hf_token, use_safetensors=True
    )

    print(f"Loading LoRA adapter from '{LORA_PATH}'...")
    model = PeftModel.from_pretrained(
        model, LORA_PATH, is_adapter=True, torch_dtype=torch.bfloat16
    )
    print("LoRA adapter merged successfully")

    model.eval()
    return model, processor

async def generate_text_from_image(model, processor, image):
    """Generate text from image using model"""
    conversation = [
        {
            "role": "user",
            "content": [{"type": "image"}, {"type": "text", "text": MELANOMA_PROMPT}],
        }
    ]
    prompt = processor.apply_chat_template(
        conversation, add_generation_prompt=True, tokenize=False
    )
    inputs = processor(
        image, prompt, text_kwargs={"add_special_tokens": False}, return_tensors="pt"
    ).to(device)
    
    output = model.generate(
        **inputs, 
        temperature=0.1,
        top_p=0.9,
        max_new_tokens=MAX_OUTPUT_TOKENS,
        return_dict_in_generate=True,
        output_scores=True
    )
    
    generated_text = processor.decode(output.sequences[0])[len(prompt):]
    probs = torch.nn.functional.softmax(output.scores[0], dim=-1)
    confidence = probs.max().item()
    
    return generated_text.replace("<|eot_id|>", "").strip(), confidence

app = FastAPI()
model_state = {"model": None, "processor": None}

@app.on_event("startup")
async def startup_event():
    print("Loading model and processor...")
    model_state["model"], model_state["processor"] = load_model_and_processor()
    print("Model and processor loaded successfully")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        image = PIL_Image.open(BytesIO(image_data)).convert("RGB")
        
        generated_text, confidence = await generate_text_from_image(
            model_state["model"],
            model_state["processor"],
            image,
        )
        
        return JSONResponse({
            "generated_text": generated_text,
            "confidence": confidence
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)