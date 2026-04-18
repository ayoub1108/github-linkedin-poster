import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

function App() {
  const [githubUrl, setGithubUrl] = useState('')
  const [generatedPost, setGeneratedPost] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  // Check for LinkedIn OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const linkedinSession = urlParams.get('linkedin_session')
    
    if (linkedinSession) {
      localStorage.setItem('linkedin_session', linkedinSession)
      setSessionId(linkedinSession)
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      const saved = localStorage.getItem('linkedin_session')
      if (saved) setSessionId(saved)
    }
  }, [])

  const handleGenerate = async () => {
    // Restrict: Only allow generation if authenticated with LinkedIn
    if (!sessionId) {
      setError('Please connect your LinkedIn account first to generate posts')
      return
    }

    if (!githubUrl) {
      setError('Please enter a GitHub URL')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${API_URL}/generate`, { githubUrl })
      let post = response.data.data.post
      const repoUrl = response.data.data.repoUrl
      
      // Clean up the post
      post = post.replace(/https?:\/\/[^\s]+/g, '')
      post = post.replace(/lnkd\.in\/[^\s]+/g, '')
      post = post.replace(/🔗\s*/g, '')
      post = post.replace(/\n{3,}/g, '\n\n')
      post = post.trim()
      
      setGeneratedPost(`${post}\n\n${repoUrl}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate post')
    } finally {
      setLoading(false)
    }
  }

  const handleConnectLinkedIn = async () => {
    try {
      const response = await axios.get(`${API_URL}/linkedin/auth-url`)
      window.location.href = response.data.authUrl
    } catch (err) {
      setError('Failed to connect LinkedIn')
    }
  }

  const handlePostToLinkedIn = async () => {
    if (!sessionId) {
      setError('Please connect your LinkedIn account first')
      handleConnectLinkedIn()
      return
    }

    setLoading(true)
    setError(null)

    try {
      await axios.post(`${API_URL}/linkedin/share`, {
        postText: generatedPost,
        sessionId: sessionId
      })
      alert('✅ Successfully posted to LinkedIn!')
      setGeneratedPost('')
      setGithubUrl('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post to LinkedIn')
      if (err.response?.status === 401) {
        localStorage.removeItem('linkedin_session')
        setSessionId(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('linkedin_session')
    setSessionId(null)
    setGeneratedPost('')
    setGithubUrl('')
    setError(null)
  }

  return (
    <div style={styles.app}>
      <div style={styles.bgGradient}></div>
      
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0a66c2"/>
              <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="2"/>
            </svg>
            <span style={styles.logoText}>GitHub → LinkedIn</span>
          </div>
          <div style={styles.navRight}>
            {sessionId ? (
              <div style={styles.userInfo}>
                <div style={styles.connectedBadge}>
                  <span style={styles.greenDot}></span>
                  LinkedIn Connected
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={handleConnectLinkedIn} style={styles.connectBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{marginRight: '8px'}}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                </svg>
                Connect LinkedIn
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          {/* Hero Section */}
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>
              Generate LinkedIn Posts from 
              <span style={styles.githubText}> GitHub</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Connect your LinkedIn account, paste any GitHub repository URL, and get an AI-powered post ready to share
            </p>
          </div>

          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          {/* Auth Required Banner */}
          {!sessionId && (
            <div style={styles.authBanner}>
              <div style={styles.authBannerContent}>
                <span style={styles.lockIcon}>🔒</span>
                <div>
                  <h3 style={styles.authBannerTitle}>Authentication Required</h3>
                  <p style={styles.authBannerText}>Connect your LinkedIn account to generate and share posts</p>
                </div>
                <button onClick={handleConnectLinkedIn} style={styles.authBannerBtn}>
                  Connect LinkedIn
                </button>
              </div>
            </div>
          )}

          {/* Input Card - Disabled if not authenticated */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.stepBadge}>1</div>
              <h2 style={styles.cardTitle}>Enter GitHub Repository URL</h2>
            </div>
            <div style={styles.inputWrapper}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#6b7280" style={styles.inputIcon}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/facebook/react"
                disabled={!sessionId}
                style={{
                  ...styles.input,
                  ...(!sessionId && styles.inputDisabled),
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onKeyPress={(e) => e.key === 'Enter' && sessionId && handleGenerate()}
              />
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={loading || !sessionId} 
              style={(!sessionId || loading) ? styles.generateBtnDisabled : styles.generateBtn}
            >
              {loading ? (
                <>
                  <div style={styles.spinner}></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                    <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/>
                  </svg>
                  Generate Post
                </>
              )}
            </button>
            {!sessionId && (
              <p style={styles.disabledHint}>
                🔒 Connect your LinkedIn account to unlock
              </p>
            )}
          </div>

          {/* Generated Post Card */}
          {generatedPost && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.stepBadge}>2</div>
                <h2 style={styles.cardTitle}>Review & Post to LinkedIn</h2>
              </div>
              <textarea
                value={generatedPost}
                onChange={(e) => setGeneratedPost(e.target.value)}
                rows={10}
                style={styles.textarea}
              />
              <button 
                onClick={handlePostToLinkedIn} 
                disabled={loading}
                style={loading ? styles.postBtnDisabled : styles.postBtn}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{marginRight: '8px'}}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
                    </svg>
                    Post to LinkedIn
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  bgGradient: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(10,102,194,0.15) 0%, rgba(0,0,0,0) 50%)',
    pointerEvents: 'none',
  },
  navbar: {
    backgroundColor: '#0f0f0f',
    borderBottom: '1px solid #1a1a1a',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #ffffff 0%, #0a66c2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  connectedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16,185,129,0.1)',
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#10b981',
    fontSize: '12px',
    fontWeight: '500',
  },
  greenDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
  },
  connectBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.3)',
    padding: '6px 14px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  main: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '50px 20px',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  githubText: {
    background: 'linear-gradient(135deg, #0a66c2 0%, #1e3a8a 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '15px',
    color: '#9ca3af',
    lineHeight: '1.5',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  errorIcon: {
    fontSize: '16px',
  },
  authBanner: {
    backgroundColor: 'rgba(10,102,194,0.1)',
    border: '1px solid rgba(10,102,194,0.3)',
    borderRadius: '12px',
    padding: '16px 20px',
  },
  authBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  lockIcon: {
    fontSize: '24px',
  },
  authBannerTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  },
  authBannerText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: '4px 0 0 0',
  },
  authBannerBtn: {
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #1f1f1f',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  stepBadge: {
    width: '28px',
    height: '28px',
    backgroundColor: '#0a66c2',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '16px',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 38px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  generateBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  generateBtnDisabled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#2a2a2a',
    color: '#6b7280',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  disabledHint: {
    textAlign: 'center',
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '12px',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#e5e7eb',
    marginBottom: '16px',
    boxSizing: 'border-box',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.5',
  },
  postBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  postBtnDisabled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#2a2a2a',
    color: '#6b7280',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
  },
}

// Add animations
const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  input:focus, textarea:focus {
    border-color: #0a66c2 !important;
    box-shadow: 0 0 0 2px rgba(10,102,194,0.2);
  }
  
  button:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }
`
document.head.appendChild(styleSheet)

export default App