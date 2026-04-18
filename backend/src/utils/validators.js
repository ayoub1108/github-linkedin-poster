function parseGitHubUrl(url) {
  // Match github.com/owner/repo
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid GitHub URL');
  }
  
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '') // Remove .git if present
  };
}

module.exports = { parseGitHubUrl };