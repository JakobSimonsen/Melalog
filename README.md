# "Melalog" Melanoma Detection Tool

## Overview

This project aims to develop a tool for detecting melanoma, a type of skin cancer, using a deep learning model. The tool will be designed to analyze skin lesion images and provide accurate diagnoses.

## Demo

https://www.youtube.com/shorts/30f5NNIY4yY

## Project Structure

### `frontend-app/`

This directory contains the source code for the front-end application. It is built with React Native and Expo.

### `melanoma-classifier/`

This directory contains the Python source code for the melanoma classifier server.

It is a fine-tuned version of the Llama 3.2 11B Vision Instruct model, using the PEFT LoRA adapter.

The model has been fine-tuned on this dataset from Kaggle:

- [Melanoma Skin Cancer Dataset of 10000 Images](https://www.kaggle.com/datasets/hasnainjaved/melanoma-skin-cancer-dataset-of-10000-images) by [Muhammad Hasnain Javed](https://www.kaggle.com/hasnainjaved)

### `backend/`

This directory contains the backend for frontend. This module:

- Ingests the picture and the questionnaire from the frontend;
- Sends the picture to the melanoma classifier over HTTP, and receives a result as Yes/No/<other text>, and a confidence score.
- Builds a prompt chain with these informations, along with the questionnaire, and feeds it to Nebius' API, to Llama 3.3;
- Returns a structured object to the frontend, which then either show the positive or negative screen.

## System Structure
The main back-end app ingests a picture from the front-end, as well as the result of a health questionnaire. It then sends the image to the Llama 3.2 melanoma classifier. The classifier returns "Yes", "No", and a token confidence score to help assess certainty. It will then build a prompt for Llama 3.3 hosted by Nebius, to weigh all the answers of the questionnaire + the classification of the picture by Llama 3.2.

## Steps taken to create the model

1. Llama 3.2 11B Vision Instruct model was downloaded from HuggingFace.
2. The model was fine-tuned on the graciously provided machines from Nebius, with 8 H100 GPUs.
3. The command used to fine-tune the model was:

```bash
FSDP_CPU_RAM_EFFICIENT_LOADING=1 ACCELERATE_USE_FSDP=1 torchrun --nnodes 1 --nproc_per_node 8 finetuning/finetuning.py --enable_fsdp --lr 1e-5  --num_epochs 5 --batch_size_training 1 --model_name meta-llama/Llama-3.2-11B-Vision-Instruct --dist_checkpoint_root_folder ./finetuned_model --dist_checkpoint_folder fine-tuned  --use_fast_kernels --dataset "custom_dataset" --custom_dataset.test_split "test" --custom_dataset.file "finetuning/datasets/ocrvqa_dataset.py"  --run_validation True --batching_strategy padding
```
 This command is derived from the [Llama Cookbook](https://github.com/meta-llama/llama-cookbook/blob/main/getting-started/finetuning/finetune_vision_model.md)'s finetuning scripts.

 4. Based on another script present in the Llama Cookbook, a server was created to serve the model from the provided machine.


### Limitations
While the classifier model responds well to the test pictures from the dataset it was trained on, further training should be planned in a medical setting in order to validate/invalidate results, and make the app more reliable.

The frontend is fairly basic but functional; there is little validation going here, and a production version should check that everything going to the backend is actually the data we need.

Using LoRA adapters with fine-tuning data is pretty efficient, since we can just swap the adapter model when new training is done.

### Future developments

1. Introduce a larger dataset curated by health professionals
2. Verify the results against human predictions for better tuning
3. Logging images to be able to build a model for skin lesions evolution over time
4. Weighting the questionnaire for better end prediction to able to see a more nuanced picture
5. Enable Chat functionality with the Llama 3.3 model for eventual question from the patient
    
