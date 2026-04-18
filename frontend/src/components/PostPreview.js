import React, { useState } from 'react'
import { Copy, Check, Edit2, Send, Loader } from 'lucide-react'

export default function PostPreview({ post, onPostToLinkedIn, isPosting }) {
  const [editedPost, setEditedPost] = useState(post)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedPost)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!post) return null

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Generated Post</h2>
        <div style={styles.buttonGroup}>
          <button onClick={() => setIsEditing(!isEditing)} style={styles.editButton}>
            <Edit2 size={14} />
            {isEditing ? 'Preview' : 'Edit'}
          </button>
          <button onClick={handleCopy} style={styles.copyButton}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editedPost}
          onChange={(e) => setEditedPost(e.target.value)}
          style={styles.textarea}
        />
      ) : (
        <div style={styles.preview}>
          {editedPost.split('\n').map((line, i) => (
            <p key={i} style={styles.line}>{line}</p>
          ))}
        </div>
      )}

      <button
        onClick={() => onPostToLinkedIn(editedPost)}
        disabled={isPosting}
        style={isPosting ? styles.postButtonDisabled : styles.postButton}
      >
        {isPosting ? (
          <>
            <Loader size={18} style={styles.spin} />
            Posting to LinkedIn...
          </>
        ) : (
          <>
            <Send size={18} />
            Post to LinkedIn
          </>
        )}
      </button>
    </div>
  )
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  copyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    minHeight: '300px',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    marginBottom: '16px',
  },
  preview: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  line: {
    margin: '0 0 12px 0',
    lineHeight: '1.6',
    color: '#374151',
  },
  postButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  postButtonDisabled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
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