import React from 'react'
import { Github, Linkedin } from 'lucide-react'

export default function Navbar({ isAuthenticated, onLogin, onLogout }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <Github size={24} />
          <span style={styles.logoText}>GitHub → LinkedIn</span>
        </div>
        
        <div>
          {isAuthenticated ? (
            <button onClick={onLogout} style={styles.logoutButton}>
              Logout
            </button>
          ) : (
            <button onClick={onLogin} style={styles.loginButton}>
              <Linkedin size={18} />
              Sign in with LinkedIn
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '16px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
}