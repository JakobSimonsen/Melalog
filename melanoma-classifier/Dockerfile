# Use CUDA base image
FROM nvidia/cuda:12.4.0-runtime-ubuntu22.04

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the application code and model weights
COPY src/infer_server.py .
COPY model/lora_weights /app/model/lora_weights

# Set environment variables
ENV PYTHONPATH=/app
ENV HUGGINGFACE_TOKEN="your_token_here"

# Expose the port
EXPOSE 8000

# Run the FastAPI server
CMD ["python3", "infer_server.py"]