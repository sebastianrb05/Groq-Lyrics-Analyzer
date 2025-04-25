# GroqTranscribe Backend

This is the backend service for GroqTranscribe, an application that uses Groq AI to transcribe and analyze audio content.

## Features

- Audio file upload and management
- Audio transcription via Groq AI
- Text analysis for meaning, sentiment, and themes
- API key verification for Groq services

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Groq API key

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy the environment example file:
   ```
   cp .env.example .env
   ```
5. Start the server:
   ```
   uvicorn main:app --reload
   ```

The API will be available at http://localhost:8000.

### API Documentation

Once the server is running, you can access the automatic API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /`: Welcome message
- `POST /verify-api-key`: Verify if a Groq API key is valid
- `POST /transcribe`: Transcribe an audio file
- `POST /analyze`: Analyze transcribed text

## Notes

- This service requires users to provide their own Groq API key
- Audio files are temporarily stored during processing and then removed 