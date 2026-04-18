const axios = require('axios');
const config = require('../config/env');

class LinkedInService {
  getAuthUrl() {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.LINKEDIN_CLIENT_ID,
      redirect_uri: config.LINKEDIN_REDIRECT_URI,
      scope: 'openid profile email w_member_social'
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  async exchangeCode(code) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.LINKEDIN_REDIRECT_URI,
      client_id: config.LINKEDIN_CLIENT_ID,
      client_secret: config.LINKEDIN_CLIENT_SECRET
    });

    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        params.toString(),
        { 
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded' 
          } 
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('LinkedIn token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange LinkedIn authorization code');
    }
  }

  async getUserIdFromToken(accessToken) {
    // Method 1: Try /userinfo endpoint (OpenID Connect)
    try {
      const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.sub) {
        console.log('✅ Got user ID from /userinfo:', response.data.sub);
        return response.data.sub;
      }
    } catch (error) {
      console.log('Method 1 (/userinfo) failed:', error.response?.status, error.response?.data?.message);
    }

    // Method 2: Try /me endpoint (v2 API)
    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (response.data.id) {
        console.log('✅ Got user ID from /me:', response.data.id);
        return response.data.id;
      }
    } catch (error) {
      console.log('Method 2 (/me) failed:', error.response?.status, error.response?.data?.message);
    }

    // Method 3: Try email endpoint to get user info
    try {
      const response = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // This doesn't give us the user ID directly, but if it works, we can try another approach
      console.log('Email endpoint accessible, but still need user ID');
    } catch (error) {
      console.log('Method 3 (email) failed:', error.response?.status);
    }

    throw new Error('Unable to get LinkedIn user profile. Please reconnect your account.');
  }

  async sharePost(accessToken, text) {
    try {
      // Get the user ID using our robust method
      const userId = await this.getUserIdFromToken(accessToken);
      
      const postBody = {
        author: `urn:li:person:${userId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        postBody,
        { 
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
          } 
        }
      );
      
      console.log('✅ Post shared successfully!');
      return response.data.id;
    } catch (error) {
      console.error('LinkedIn share error details:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('LinkedIn token expired. Please reconnect your account.');
      }
      if (error.response?.status === 403) {
        throw new Error('Insufficient permissions. Make sure "Sign In with LinkedIn" and "Share on LinkedIn" products are added to your app.');
      }
      throw new Error(`Failed to share to LinkedIn: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new LinkedInService();