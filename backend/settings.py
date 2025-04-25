from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

# Production Models (stable and suitable for production use)
PRODUCTION_MODELS = [
    "gemma2-9b-it",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama-guard-3-8b",
    "llama3-70b-8192",
    "llama3-8b-8192"
]

# Preview Models (for evaluation purposes)
PREVIEW_MODELS = [
    "allam-2-7b",
    "deepseek-r1-distill-llama-70b",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "mistral-saba-24b",
    "qwen-qwq-32b"
]

# All available models for text generation
AVAILABLE_MODELS = PRODUCTION_MODELS + PREVIEW_MODELS

# Models suitable for evaluation (typically larger models)
EVALUATION_MODELS = [
    "llama-3.3-70b-versatile",
    "llama3-70b-8192",
    "deepseek-r1-distill-llama-70b"
]

# Default model to use
DEFAULT_MODEL = "llama-3.1-8b-instant"

class Settings(BaseSettings):
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", None)
    AVAILABLE_MODELS: List[str] = AVAILABLE_MODELS
    EVALUATION_MODELS: List[str] = EVALUATION_MODELS
    DEFAULT_MODEL: str = DEFAULT_MODEL
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings() 