from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import os
import uuid
from typing import Optional, List
import groq
import tempfile
import shutil
from openai import OpenAI
from settings import get_settings, AVAILABLE_MODELS, DEFAULT_MODEL

app = FastAPI(title="GroqTranscribe API")
settings = get_settings()

# CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded audio files temporarily
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic models
class GroqAPIKey(BaseModel):
    api_key: str

class TranscriptionResponse(BaseModel):
    transcription: str
    
class AnalysisResponse(BaseModel):
    transcription: str
    meaning: str
    sentiment: str
    themes: list[str]
    additional_insights: Optional[str] = None

class ModelsResponse(BaseModel):
    models: List[str]

# Security
api_key_header = APIKeyHeader(name="X-Groq-API-Key")

# Helper function to verify Groq API key
async def verify_api_key(api_key: str = Depends(api_key_header)):
    try:
        # Create a temporary Groq client to verify the API key
        client = groq.Groq(api_key=api_key)
        # Make a minimal API call to verify the key works
        client.chat.completions.create(
            messages=[{"role": "user", "content": "test"}],
            model=settings.DEFAULT_MODEL,
            max_tokens=1
        )
        return api_key
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Groq API key",
        )

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to GroqTranscribe API"}

@app.get("/models", response_model=ModelsResponse)
def get_models():
    return {"models": settings.AVAILABLE_MODELS}

@app.post("/verify-api-key")
async def verify_key(key_data: GroqAPIKey):
    try:
        # Create a temporary Groq client to verify the API key
        client = groq.Groq(api_key=key_data.api_key)
        # Make a minimal API call to verify the key works
        client.chat.completions.create(
            messages=[{"role": "user", "content": "test"}],
            model=settings.DEFAULT_MODEL,
            max_tokens=1
        )
        return {"valid": True}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Groq API key",
        )

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    api_key: str = Depends(api_key_header)
):
    # Generate a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Initialize OpenAI client with Groq base URL and API key
        client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
        
        print(f"[INFO] Transcribing with Groq Whisper: {file_path}")
        
        # Use Groq Whisper implementation for real transcription
        with open(file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="text"
            )
        
        return {"transcription": transcript}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during transcription: {str(e)}",
        )
    finally:
        # Clean up the file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(
    transcription: str = Form(...),
    model: str = Form(DEFAULT_MODEL),
    custom_prompt: str = Form(""),
    api_key: str = Depends(verify_api_key)
):
    # Validate the model
    if model not in settings.AVAILABLE_MODELS:
        model = settings.DEFAULT_MODEL  # Default to a safe model if invalid
    
    try:
        # Initialize Groq client
        client = groq.Groq(api_key=api_key)
        
        # Set up system prompt
        system_prompt = """
        You are an analysis assistant that processes transcribed lyrics, where you area an expert in music and lyrics. 
        Especially in finding the meaning of the lyrics and the sentimental value of the texts, really finding the deeper meaning.
        Provide the following analysis:
        1. Meaning/interpretation of the content
        2. Overall sentiment (positive, negative, neutral, or mixed)
        3. Key themes or topics (as a list)
        4. Any additional insights
        Format your response as valid JSON with the following structure:
        {
            "meaning": "detailed interpretation",
            "sentiment": "sentiment assessment",
            "themes": ["theme1", "theme2", ...],
            "additional_insights": "any other relevant observations"
        }
        """
        
        # Add custom prompt if provided
        if custom_prompt:
            system_prompt += f"\n\nAdditional instructions: {custom_prompt}"
        
        # Use Groq for text analysis
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this transcribed text: {transcription}"}
            ],
            model=model,
            response_format={"type": "json_object"}
        )
        
        analysis = response.choices[0].message.content
        
        # Convert string to json if needed
        import json
        if isinstance(analysis, str):
            analysis = json.loads(analysis)
        
        return {
            "transcription": transcription,
            "meaning": analysis.get("meaning", "No meaning analysis available"),
            "sentiment": analysis.get("sentiment", "No sentiment analysis available"),
            "themes": analysis.get("themes", []),
            "additional_insights": analysis.get("additional_insights", None)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during analysis: {str(e)}",
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 