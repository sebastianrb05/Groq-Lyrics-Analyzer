'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsVerifying(true)

    try {
      const response = await axios.post(
        `${process.env.API_URL}/verify-api-key`, 
        { api_key: apiKey }
      )
      
      // Save API key to localStorage (only for client-side access)
      localStorage.setItem('groqApiKey', apiKey)
      
      // Navigate to the transcribe page
      router.push('/transcribe')
    } catch (err: any) {
      console.error('Error verifying API key:', err)
      setError(err.response?.data?.detail || 'Failed to verify API key. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-500 mb-2">GroqTranscribe</h1>
          <p className="text-gray-300">Transcribe and analyze audio using Groq AI</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-white">Enter your Groq API Key</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="apiKey" 
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                API Key
              </label>
              <input
                id="apiKey"
                type="password"
                className="input"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Groq API key"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Don&apos;t have an API key? Get one from{' '}
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  Groq Console
                </a>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-900/50 text-red-200 rounded-md text-sm border border-red-700">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isVerifying || !apiKey}
            >
              {isVerifying ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Your API key is stored locally in your browser and is only used to make requests to Groq.
            We never store your API key on our servers.
          </p>
        </div>
      </div>
    </div>
  )
} 