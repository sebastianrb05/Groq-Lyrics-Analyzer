# GroqTranscribe Frontend

This is the frontend for GroqTranscribe, a web application that utilizes Groq AI for audio transcription and analysis.

## Features

- Clean, modern UI built with Next.js and Tailwind CSS
- Audio file upload and playback
- Display of transcription results
- Analysis of transcription content, including meaning, sentiment, and themes
- Secure handling of Groq API keys

## Getting Started

### Prerequisites

- Node.js 16.14.0 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```
4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

The application will be available at http://localhost:3000.

### Environment Variables

Create a `.env.local` file in the root of the frontend directory with the following variables:

```
API_URL=http://localhost:8000
```

## Project Structure

- `app/`: Main Next.js 13+ App Router directory
  - `components/`: Reusable UI components
  - `utils/`: Utility functions and API handlers
  - `page.tsx`: Home page (API key input)
  - `transcribe/`: Audio transcription and analysis page
  - `globals.css`: Global styles and Tailwind directives
  - `layout.tsx`: Root layout component

## Build for Production

```
npm run build
# or
yarn build
```

## Notes

- This frontend requires a running backend service (see backend README)
- Users must provide their own Groq API key to use the service 