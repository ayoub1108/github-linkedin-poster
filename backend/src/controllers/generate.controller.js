const githubService = require('../services/github.service');
const llmService = require('../services/llm.service');
const { parseGitHubUrl } = require('../utils/validators');

async function generatePost(req, res, next) {
  try {
    const { githubUrl } = req.body;
    
    if (!githubUrl) {
      return res.status(400).json({ error: 'githubUrl is required' });
    }
    
    // Parse URL
    const { owner, repo } = parseGitHubUrl(githubUrl);
    
    console.log(`📦 Fetching repo: ${owner}/${repo}`);
    
    // Fetch repo data
    const repoData = await githubService.getRepo(owner, repo);
    const readme = await githubService.getReadme(owner, repo);
    
    console.log('📦 Repo Data:', {
      name: repoData.name,
      url: repoData.url,
      stars: repoData.stars
    });
    
    // Generate post with complete repo info
    const post = await llmService.generatePost({
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stars,
      language: repoData.language,
      url: repoData.url,  // Make sure url is passed
      owner: owner,       // Pass owner as backup
      repo: repo          // Pass repo as backup
    });
    
    res.json({
      success: true,
      data: {
        post: post,
        repoName: repoData.name,
        repoUrl: repoData.url
      }
    });
    
  } catch (error) {
    console.error('Generate error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { generatePost };