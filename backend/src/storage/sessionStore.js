class SessionStore {
  constructor() {
    this.sessions = new Map();
    console.log('📦 Session store initialized');
  }

  set(sessionId, data, ttlSeconds = 86400) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.sessions.set(sessionId, {
      data,
      expiresAt,
      createdAt: Date.now()
    });
    console.log(`✅ Session created: ${sessionId}`);
    console.log(`   Expires at: ${new Date(expiresAt).toLocaleString()}`);
    console.log(`   Active sessions: ${this.sessions.size}`);
    
    // Log what was stored (without full token)
    if (data.accessToken) {
      console.log(`   Token stored: ${data.accessToken.substring(0, 20)}...`);
    }
  }

  get(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.log(`❌ Session not found: ${sessionId}`);
      console.log(`   Available sessions: ${Array.from(this.sessions.keys()).join(', ')}`);
      return null;
    }
    
    if (Date.now() > session.expiresAt) {
      console.log(`⏰ Session expired: ${sessionId}`);
      console.log(`   Expired at: ${new Date(session.expiresAt).toLocaleString()}`);
      this.sessions.delete(sessionId);
      return null;
    }
    
    console.log(`✅ Session retrieved: ${sessionId}`);
    if (session.data.accessToken) {
      console.log(`   Token: ${session.data.accessToken.substring(0, 20)}...`);
    }
    return session.data;
  }

  delete(sessionId) {
    this.sessions.delete(sessionId);
    console.log(`🗑️ Session deleted: ${sessionId}`);
  }
}

module.exports = new SessionStore();