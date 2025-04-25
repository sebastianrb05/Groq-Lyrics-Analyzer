# Groq-Lyrics-Analyzer

GroqTranscribe is a web application that utilizes Groq AI services to transcribe audio files and analyze the transcribed content for meaning, sentiment, and key themes.

![GroqTranscribe](https://raw.githubusercontent.com/RMNCLDYO/groq-ai-toolkit/main/.github/groq-logo.png)

## Features

- **Audio Transcription**: Upload audio files and get them transcribed using Groq AI.
- **Content Analysis**: Analyze the transcribed text to extract meaning, sentiment, and key themes.
- **Audio Playback**: Listen to uploaded audio files within the web interface.
- **User Authentication**: Users provide their own Groq API key for secure access.

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Groq API**: For AI-powered transcription and text analysis

### Frontend
- **Next.js**: React framework for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Audio Player**: For audio playback functionality

## Getting Started

### Prerequisites

- Python 3.8+ (Backend)
- Node.js 16.14.0+ (Frontend)
- Groq API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/sebastianrb05/Groq-Lyrics-Analyzer
   cd Groq-Lyrics-Analyzer
   ```

2. Set up the backend
   ```
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. Set up the frontend
   ```
   cd ../frontend
   npm install
   # Create .env.local file with API_URL=http://localhost:8000
   ```

### Running the Application

1. Start the backend server
   ```
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend development server
   ```
   cd frontend
   npm run dev
   ```

3. Access the application at http://localhost:3000

## Usage

1. Enter your Groq API key on the homepage
2. Upload an audio file
3. Click "Transcribe Audio" to process the file
4. View the transcription and click "Analyze Content" for deeper insights
5. Explore the meaning, sentiment, and themes extracted from the content


## Notes

- This application requires users to provide their own Groq API key
- Audio files are temporarily stored during processing
- The transcription functionality is currently implemented as a placeholder using Groq's LLM capabilities
- When Groq releases an official Whisper API or similar audio transcription service, the code should be updated

## License

MIT

## Acknowledgements

- [Groq](https://groq.com/) for providing the AI capabilities
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Next.js](https://nextjs.org/) for the frontend framework 