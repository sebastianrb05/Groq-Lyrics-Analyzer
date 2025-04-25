'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { transcribeAudio, analyzeText, getAvailableModels } from '../utils/api'
import { FiUpload, FiFileText, FiLoader, FiCheckCircle, FiAlertCircle, FiSettings, FiChevronDown, FiChevronUp } from 'react-icons/fi'

type AnalysisResult = {
  transcription: string;
  meaning: string;
  sentiment: string;
  themes: string[];
  additional_insights?: string;
}

type AnalysisSettings = {
  model: string;
  customPrompt: string;
  showSettings: boolean;
}

export default function TranscribePage() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string>('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const [analysisSettings, setAnalysisSettings] = useState<AnalysisSettings>({
    model: "llama-3.1-8b-instant",
    customPrompt: "Analyze the lyrics in depth, focusing on meaning and emotional content.",
    showSettings: false
  })
  
  // Check if API key exists on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('groqApiKey')
    if (!storedApiKey) {
      router.push('/')
    } else {
      setApiKey(storedApiKey)
      // Fetch available models
      fetchModels()
    }
  }, [router])

  const fetchModels = async () => {
    try {
      setIsLoadingModels(true)
      const models = await getAvailableModels()
      setAvailableModels(models)
      
      // Set default model if available
      if (models.length > 0) {
        setAnalysisSettings(prev => ({
          ...prev,
          model: models[0]
        }))
      }
    } catch (err) {
      console.error('Error fetching models:', err)
    } finally {
      setIsLoadingModels(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file is an audio file
      if (!selectedFile.type.startsWith('audio/')) {
        setError('Please upload an audio file.')
        return
      }
      
      // Create URL for audio playback
      const url = URL.createObjectURL(selectedFile)
      setFile(selectedFile)
      setAudioUrl(url)
      setError('')
      setTranscription('')
      setAnalysis(null)
    }
  }

  const handleTranscribe = async () => {
    if (!file) return
    
    setIsProcessing(true)
    setError('')
    
    try {
      const result = await transcribeAudio(file)
      setTranscription(result.transcription)
    } catch (err: any) {
      console.error('Transcription error:', err)
      setError(err.response?.data?.detail || 'Failed to transcribe audio. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleSettings = () => {
    setAnalysisSettings({
      ...analysisSettings,
      showSettings: !analysisSettings.showSettings
    })
  }

  const handleAnalyze = async () => {
    if (!transcription) return
    
    setIsAnalyzing(true)
    setError('')
    
    try {
      const result = await analyzeText(transcription, analysisSettings.model, analysisSettings.customPrompt)
      setAnalysis(result)
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError(err.response?.data?.detail || 'Failed to analyze transcription. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('groqApiKey')
    router.push('/')
  }

  if (!apiKey) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-space-blue">GroqLyricAnalyzer</h1>
        <button 
          onClick={handleLogout}
          className="btn btn-secondary text-sm"
        >
          Change API Key
        </button>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Upload Audio File</h2>
        
        <div 
          className="border-2 border-dashed border-dark-100 rounded-lg p-8 text-center cursor-pointer hover:border-space-teal transition-colors bg-dark-300/50 backdrop-blur-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
          <FiUpload className="mx-auto h-12 w-12 text-space-teal mb-4" />
          <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-400">Audio files only (MP3, WAV, etc.)</p>
        </div>

        {audioUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-white">Selected File: {file?.name}</h3>
            <audio 
              controls 
              src={audioUrl} 
              className="w-full mt-2"
              onError={() => setError('Error loading audio file.')}
            />
            
            <div className="mt-4">
              <button 
                onClick={handleTranscribe} 
                className="btn btn-primary w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="inline-block mr-2 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <FiFileText className="inline-block mr-2" />
                    Transcribe Audio
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/30 text-red-200 rounded-md flex items-start border border-red-700/50 backdrop-blur-sm">
            <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {transcription && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Transcription</h2>
            <div className="flex gap-2">
              <button 
                onClick={toggleSettings}
                className="btn btn-secondary text-sm flex items-center"
                title="Analysis Settings"
              >
                <FiSettings className="mr-1" />
                {analysisSettings.showSettings ? 'Hide Settings' : 'Settings'}
              </button>
              <button 
                onClick={handleAnalyze} 
                className="btn btn-primary text-sm"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
              </button>
            </div>
          </div>
          
          {analysisSettings.showSettings && (
            <div className="mb-4 p-4 bg-dark-300/50 rounded-md border border-dark-100/70 animate-fadeIn backdrop-blur-sm">
              <h3 className="text-md font-medium text-white mb-3">Analysis Settings</h3>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  AI Model
                </label>
                {isLoadingModels ? (
                  <div className="flex items-center text-gray-400 text-sm">
                    <FiLoader className="animate-spin mr-2" />
                    Loading models...
                  </div>
                ) : (
                  <>
                    <select 
                      value={analysisSettings.model}
                      onChange={(e) => setAnalysisSettings({...analysisSettings, model: e.target.value})}
                      className="input"
                    >
                      {availableModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-400">Select the model to analyze the transcription</p>
                  </>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Custom Analysis Prompt
                </label>
                <textarea 
                  value={analysisSettings.customPrompt}
                  onChange={(e) => setAnalysisSettings({...analysisSettings, customPrompt: e.target.value})}
                  className="input min-h-[80px]"
                  placeholder="Enter specific instructions for analysis..."
                />
                <p className="mt-1 text-xs text-gray-400">Customize how the AI should analyze the transcription (e.g., focus on political themes, philosophical aspects, etc.)</p>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-dark-300/50 rounded-md whitespace-pre-wrap text-gray-200 border border-dark-100/70 backdrop-blur-sm">
            {transcription}
          </div>
        </div>
      )}

      {analysis && (
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Analysis</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-200 mb-2">Meaning/Interpretation:</h3>
              <p className="p-3 bg-dark-300/50 rounded-md text-gray-200 border border-dark-100/70 backdrop-blur-sm">{analysis.meaning}</p>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-200 mb-2">Sentiment:</h3>
              <p className="p-3 bg-dark-300/50 rounded-md text-gray-200 border border-dark-100/70 backdrop-blur-sm">{analysis.sentiment}</p>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-200 mb-2">Key Themes:</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-space-indigo/50 text-space-teal rounded-full text-sm border border-space-indigo/70 backdrop-blur-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
            
            {analysis.additional_insights && (
              <div>
                <h3 className="text-md font-medium text-gray-200 mb-2">Additional Insights:</h3>
                <p className="p-3 bg-dark-300/50 rounded-md text-gray-200 border border-dark-100/70 backdrop-blur-sm">{analysis.additional_insights}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 