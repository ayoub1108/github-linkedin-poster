const axios = require('axios');
const config = require('../config/env');

class GitHubService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      timeout: 10000,
      headers: config.GITHUB_TOKEN 
        ? { Authorization: `token ${config.GITHUB_TOKEN}` }
        : {}
    });
  }

  async getRepo(owner, repo) {
  try {
    const response = await this.client.get(`/repos/${owner}/${repo}`);
    return {
      name: response.data.name,
      description: response.data.description || 'No description provided',
      stars: response.data.stargazers_count,
      language: response.data.language,
      url: response.data.html_url  // Make sure this line exists
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
}

  async getReadme(owner, repo) {
    try {
      const response = await this.client.get(`/repos/${owner}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.v3.raw' }
      });
      // Truncate to first 1000 chars
      const readme = typeof response.data === 'string' ? response.data : '';
      return readme.substring(0, 1000);
    } catch (error) {
      return ''; // No README is fine
    }
  }
}

module.exports = new GitHubService();