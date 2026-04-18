class SessionStore {
  constructor() {
    this.sessions = new Map();
    console.log('📦 Session store initialized (in-memory)');
  }

  set(sessionId, data, ttlSeconds = 86400) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.sessions.set(sessionId, {
      data,
      expiresAt,
      createdAt: Date.now()
    });
    console.log(`✅ Session created: ${sessionId.substring(0, 8)}...`);
    console.log(`   Active sessions: ${this.sessions.size}`);
    return true;
  }

  get(sessionId) {
    if (!sessionId) {
      console.log('❌ No session ID provided');
      return null;
    }
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.log(`❌ Session not found: ${sessionId.substring(0, 8)}...`);
      console.log(`   Available sessions: ${Array.from(this.sessions.keys()).map(k => k.substring(0, 8)).join(', ')}`);
      return null;
    }
    
    if (Date.now() > session.expiresAt) {
      console.log(`⏰ Session expired: ${sessionId.substring(0, 8)}...`);
      this.sessions.delete(sessionId);
      return null;
    }
    
    console.log(`✅ Session found: ${sessionId.substring(0, 8)}...`);
    return session.data;
  }

  delete(sessionId) {
    this.sessions.delete(sessionId);
    console.log(`🗑️ Session deleted: ${sessionId.substring(0, 8)}...`);
  }
}

module.exports = new SessionStore();