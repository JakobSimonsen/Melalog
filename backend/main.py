import os
import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

# Import the OpenAI client from your library.
from openai import OpenAI

app = FastAPI()

load_dotenv()

# DTO for the local prediction service's response.
class LocalServiceResponse(BaseModel):
    generated_text: str
    confidence: float


# DTO for the final response.
class CheckResponse(BaseModel):
    sensitive_response: str
    prediction: str


def call_llm(prompt: str) -> str:
    """
    Synchronously calls the LLM (Nebius API via OpenAI client) using your provided client code.
    """
    api_key = os.getenv("NEBIUS_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="NEBIUS_KEY environment variable is not set"
        )

    client = OpenAI(
        base_url="https://api.studio.nebius.ai/v1/",
        api_key=api_key,
    )

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    completion = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
        messages=messages,
        temperature=0.2
    )

    # Access the response content directly from the completion object
    return completion.choices[0].message.content


async def get_llm_response(prompt: str) -> str:
    """
    Runs the blocking call_llm() function in an executor so as not to block the event loop.
    """
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, call_llm, prompt)
    return result


@app.post("/check", response_model=CheckResponse)
async def check(
    file: UploadFile = File(...),
    q1: str = Form(...),
    q2: str = Form(...),
    q3: str = Form(...),
    q4: str = Form(...),
    q5: str = Form(...),
    q6: str = Form(...),
    q7: str = Form(...),
    q8: str = Form(...)
):
    # Step 1: Read the uploaded file's bytes
    try:
        image_bytes = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read the uploaded file")

    # Step 2: Send only the image file to the local prediction service
    async with httpx.AsyncClient() as client:
        files = {"file": (file.filename, image_bytes, file.content_type)}
        try:
            local_resp = await client.post("http://195.242.13.74:8000/predict", files=files)
            print("response: ",local_resp.json())
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error contacting local prediction service") from e
        
        if local_resp.status_code != 200:
            raise HTTPException(
                status_code=local_resp.status_code,
                detail="Local prediction service returned an error"
            )

        local_json = local_resp.json()
        if "generated_text" not in local_json or "confidence" not in local_json:
            raise HTTPException(status_code=500, detail="Invalid response from local prediction service")
        local_data = LocalServiceResponse(**local_json)
        print("local_data: ",local_data)

        # Determine prediction based on generated text
        generated_text_lower = local_data.generated_text.lower()
        if "yes" in generated_text_lower:
            prediction = "positive"
        elif "no" in generated_text_lower:
            prediction = "negative"
        else:
            prediction = "unsure"

    # Step 3: Build a structured prompt combining image analysis and form data
    prompt = f"""
Image Analysis Result: {local_data.generated_text} (confidence: {local_data.confidence})

Patient Questionnaire Responses:
1. Previous melanoma: {q1}
2. Previous basal/squamous cell carcinoma: {q2}
3. Many moles: {q3}
4. Family history of skin cancer: {q4}
5. Fair-skinned: {q5}
6. History of sunburns: {q6}
7. Parkinson's disease: {q7}
8. Compromised immune system: {q8}

Provide a brief (2-3 sentences) medical assessment focusing on key findings and clear next steps. If urgent attention is needed, state this first.
"""

    # Step 4: Call the LLM with the structured prompt
    try:
        sensitive_response = await get_llm_response(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling LLM: {e}")

    # Step 5: Return the final sensitive response
    return CheckResponse(
        sensitive_response=sensitive_response,
        prediction=prediction
    )

