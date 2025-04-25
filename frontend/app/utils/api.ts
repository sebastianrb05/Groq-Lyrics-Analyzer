import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8000';

// Get the API key from localStorage (client-side only)
const getApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('groqApiKey');
  }
  return null;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add API key to requests
api.interceptors.request.use(
  (config) => {
    const apiKey = getApiKey();
    if (apiKey) {
      config.headers['X-Groq-API-Key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const transcribeAudio = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const analyzeText = async (
  transcription: string, 
  model: string = 'llama-3.1-8b-instant', 
  customPrompt: string = ''
) => {
  const formData = new FormData();
  formData.append('transcription', transcription);
  formData.append('model', model);
  formData.append('custom_prompt', customPrompt);
  
  const response = await api.post('/analyze', formData);
  
  return response.data;
};

export const getAvailableModels = async () => {
  const response = await api.get('/models');
  return response.data.models as string[];
};

export const verifyApiKey = async (apiKey: string) => {
  const response = await axios.post(`${API_URL}/verify-api-key`, {
    api_key: apiKey,
  });
  
  return response.data;
};

export default api; 