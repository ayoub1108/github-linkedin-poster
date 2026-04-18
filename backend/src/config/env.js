require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI,
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000']
};