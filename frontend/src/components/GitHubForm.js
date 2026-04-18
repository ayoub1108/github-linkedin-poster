import React, { useState } from 'react'
import { Search, Loader } from 'lucide-react'

export default function GitHubForm({ onGenerate, isLoading }) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) {
      onGenerate(url)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Generate LinkedIn Post</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/facebook/react"
          style={styles.input}
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          style={isLoading ? styles.buttonDisabled : styles.button}
        >
          {isLoading ? (
            <>
              <Loader size={18} style={styles.spin} />
              Generating...
            </>
          ) : (
            <>
              <Search size={18} />
              Generate Post
            </>
          )}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f2937',
  },
  form: {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
  },
  input: {
    flex: 1,
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#1f2937',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  buttonDisabled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'not-allowed',
  },
  spin: {
    animation: 'spin 1s linear infinite',
  },
}