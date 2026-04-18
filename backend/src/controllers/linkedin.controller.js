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
    const tokenData = await linkedinService.exchangeCode(code);
    const accessToken = tokenData.access_token;
    
    console.log('✅ Access token received');
    
    // Create session
    const sessionId = uuidv4();
    sessionStore.set(sessionId, { accessToken });
    
    console.log(`✅ Session created: ${sessionId}`);
    
    // Redirect back to frontend with session ID
    const redirectUrl = `https://github-linkedin-poster.vercel.app?linkedin_session=${sessionId}`;
    console.log(`🔀 Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.status(500).send('Authentication failed: ' + error.message);
  }
}

async function sharePost(req, res) {
  try {
    const { sessionId, postText } = req.body;
    
    console.log(`📤 Share request. Session ID: ${sessionId?.substring(0, 8)}...`);
    
    if (!sessionId || !postText) {
      return res.status(400).json({ error: 'sessionId and postText required' });
    }
    
    const session = sessionStore.get(sessionId);
    if (!session || !session.accessToken) {
      console.log(`❌ Invalid session`);
      return res.status(401).json({ error: 'Session not found. Please reconnect LinkedIn.' });
    }
    
    console.log('✅ Session valid, posting to LinkedIn...');
    const postId = await linkedinService.sharePost(session.accessToken, postText);
    
    console.log(`✅ Post shared! ID: ${postId}`);
    res.json({ success: true, postId });
    
  } catch (error) {
    console.error('Share error:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAuthUrl, callback, sharePost };