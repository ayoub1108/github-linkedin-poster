const linkedinService = require('../services/linkedin.service');
const sessionStore = require('../storage/sessionStore');
const { v4: uuidv4 } = require('uuid');

async function getAuthUrl(req, res) {
  try {
    const url = linkedinService.getAuthUrl();
    res.json({ authUrl: url });
  } catch (error) {
    console.error('Auth URL error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
}

async function validateSession(req, res) {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ valid: false, error: 'No session ID' });
    }
    
    const session = sessionStore.get(sessionId);
    
    if (!session || !session.accessToken) {
      return res.status(401).json({ valid: false, error: 'Invalid session' });
    }
    
    // Test the token with LinkedIn
    try {
      const testResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      return res.json({ valid: true, userId: testResponse.data.sub });
    } catch (error) {
      return res.json({ valid: false, error: 'Token invalid with LinkedIn' });
    }
  } catch (error) {
    res.status(500).json({ valid: false, error: error.message });
  }
}

module.exports = { getAuthUrl, callback, sharePost, validateSession };

async function callback(req, res) {
  try {
    const { code, error, error_description } = req.query;
    
    if (error) {
      console.error('LinkedIn OAuth error:', error, error_description);
      return res.status(400).send(`Authorization failed: ${error_description || error}`);
    }
    
    if (!code) {
      return res.status(400).send('No authorization code provided');
    }
    
    console.log('📝 Exchanging code for token...');
    console.log(`📝 Code preview: ${code.substring(0, 30)}...`);
    
    const tokenData = await linkedinService.exchangeCode(code);
    const accessToken = tokenData.access_token;
    
    console.log('✅ Access token received');
    console.log(`📝 Token preview: ${accessToken.substring(0, 30)}...`);
    console.log(`📝 Token expires in: ${tokenData.expires_in} seconds`);
    
    // Create session
    const sessionId = require('uuid').v4();
    sessionStore.set(sessionId, { accessToken });
    
    // Verify token was stored
    const verifySession = sessionStore.get(sessionId);
    if (verifySession && verifySession.accessToken) {
      console.log(`✅ Session verified. Token stored successfully.`);
      console.log(`✅ Session ID: ${sessionId}`);
    } else {
      console.log(`❌ Session verification failed!`);
    }
    
    // Redirect back to frontend with session ID
    res.redirect(`http://localhost:3000?linkedin_session=${sessionId}`);
    
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.status(500).send('Authentication failed: ' + error.message);
  }
}

async function sharePost(req, res) {
  try {
    const { sessionId, postText } = req.body;
    
    console.log(`📤 Share request received. Session ID: ${sessionId}`);
    console.log(`📝 Post text length: ${postText?.length || 0} characters`);
    
    if (!sessionId || !postText) {
      return res.status(400).json({ error: 'sessionId and postText required' });
    }
    
    const session = sessionStore.get(sessionId);
    
    if (!session) {
      console.log(`❌ Session not found: ${sessionId}`);
      return res.status(401).json({ error: 'Session not found. Please reconnect LinkedIn.' });
    }
    
    if (!session.accessToken) {
      console.log(`❌ No access token in session: ${sessionId}`);
      return res.status(401).json({ error: 'No access token found. Please reconnect LinkedIn.' });
    }
    
    // Log first few chars of token for debugging (don't log full token)
    const tokenPreview = session.accessToken.substring(0, 20) + '...';
    console.log(`✅ Session valid. Token preview: ${tokenPreview}`);
    console.log(`🔄 Attempting to share post to LinkedIn...`);
    
    const postId = await linkedinService.sharePost(session.accessToken, postText);
    
    console.log(`✅ Post shared successfully! Post ID: ${postId}`);
    res.json({ success: true, postId });
    
  } catch (error) {
    console.error('Share error:', error.message);
    res.status(500).json({ error: error.message });
  }
}



module.exports = { getAuthUrl, callback, sharePost };