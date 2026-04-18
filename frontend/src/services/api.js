import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Generate post from GitHub URL
export const generatePost = async (githubUrl) => {
  const response = await api.post('/generate', { githubUrl })
  return response.data
}

// Get LinkedIn auth URL
export const getLinkedInAuthUrl = async () => {
  const response = await api.get('/linkedin/auth-url')
  return response.data
}

// Share post to LinkedIn
export const shareToLinkedIn = async (postText, sessionId) => {
  const response = await api.post('/linkedin/share', { 
    postText, 
    sessionId 
  })
  return response.data
}

export default api