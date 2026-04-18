const Groq = require('groq-sdk');
const config = require('../config/env');

class LLMService {
  constructor() {
    if (!config.GROQ_API_KEY) {
      console.warn('⚠️  GROQ_API_KEY not set. LLM features will fail.');
    }
    this.client = new Groq({ apiKey: config.GROQ_API_KEY });
    // Using the latest confirmed working model
    this.model = 'llama-3.3-70b-versatile';
  }
async generatePost(repoInfo) {
  const prompt = `
    You are a tech LinkedIn expert. Write an engaging LinkedIn post about this GitHub project:
    
    Project Name: ${repoInfo.name}
    Description: ${repoInfo.description}
    Stars: ${repoInfo.stars} ⭐
    Language: ${repoInfo.language || 'Various'}
    
    Write a post that:
    1. Starts with an engaging hook with emojis
    2. Explains what the project does
    3. Highlights why it's useful
    4. Ends with 3-4 relevant hashtags
    
    IMPORTANT RULES:
    - Do NOT include any URL in the post body
    - Do NOT add "Check it out" or similar text
    - Do NOT add emoji before the URL
    - The URL will be added automatically at the end
    
    Write naturally with emojis throughout the post.
  `;

  try {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { 
          role: 'system', 
          content: 'You write engaging LinkedIn posts with emojis. Never include URLs in your posts. Write naturally and enthusiastically.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 350
    });

    let post = completion.choices[0].message.content;
    const repoLink = repoInfo.url;
    
    // Clean any accidental URLs
    post = post.replace(/https?:\/\/[^\s]+/g, '');
    
    // Add the URL at the very end, no emoji, no extra text
    post = `${post.trim()}\n\n${repoLink}`;
    
    return post;
  } catch (error) {
    console.error('LLM Error:', error);
    throw new Error(`Failed to generate post: ${error.message}`);
  }
}
}

module.exports = new LLMService();