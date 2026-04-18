# 🚀 GitHub → LinkedIn Post Generator

Transform any GitHub repository into an engaging LinkedIn post with AI. Generate professional, ready-to-share content in seconds and post directly to your LinkedIn profile.

**Live Demo:** [https://github-linkedin-poster.vercel.app](https://github-linkedin-poster.vercel.app) | **Backend API:** [https://linkedin-backend-28tv.onrender.com](https://linkedin-backend-28tv.onrender.com) | **Health Check:** [https://linkedin-backend-28tv.onrender.com/api/health](https://linkedin-backend-28tv.onrender.com/api/health)

---
<img width="1804" height="753" alt="image" src="https://github.com/user-attachments/assets/7d32c966-708e-4546-8330-b908236f73c5" />


## ✨ Features

- 🤖 **AI-Powered Generation** - Uses Groq's Llama 3.3 to create engaging LinkedIn posts
- 🔐 **LinkedIn OAuth** - Secure authentication with LinkedIn
- 📝 **Editable Content** - Review and edit posts before publishing
- 🔗 **Smart Link Handling** - Automatically includes repository links with rich previews
- 🎨 **Modern UI** - Beautiful dark theme with blue accents
- ⚡ **Fast & Responsive** - Built with React for smooth user experience
- 🔒 **Session Management** - Secure token storage with auto-expiry

---

## 🎯 How It Works

1. **Connect LinkedIn** - One-time OAuth authentication
2. **Paste GitHub URL** - Any public repository URL
3. **Generate Post** - AI creates engaging content
4. **Review & Edit** - Make any changes you want
5. **Post to LinkedIn** - Share directly to your profile

---

## 🛠️ Tech Stack

**Frontend:** React 18, Axios, Lucide React, CSS-in-JS
**Backend:** Node.js, Express, Groq AI (Llama 3.3), LinkedIn API v2, GitHub API
**Deployment:** Vercel (Frontend), Render (Backend)

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- GitHub account
- LinkedIn account
- Groq API key (free from console.groq.com)

---

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/ayoub1108/github-linkedin-poster.git
cd github-linkedin-poster

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your backend URL

# Run locally
# Terminal 1 - Backend (port 3001)
cd backend && npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend && npm start
PORT=3001
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token (optional)
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/api/linkedin/callback
CORS_ORIGINS=http://localhost:3000


🔑 Getting API Keys
Groq API (Free): https://console.groq.com → Sign up → API Keys → Create New Key

LinkedIn OAuth: https://linkedin.com/developers → Create App → Add Products (Sign In with LinkedIn + Share on LinkedIn) → Copy Client ID & Secret → Add redirect URI: http://localhost:3001/api/linkedin/callback

GitHub Token (Optional): https://github.com/settings/tokens → Generate classic token → No scopes needed
🚀 Deployment
Backend (Render):

Push code to GitHub

Create Web Service on render.com

Root Directory: backend

Build Command: npm install

Start Command: npm start

Add all environment variables

Deploy

Frontend (Vercel):

Push code to GitHub

Import project on vercel.com

Framework: Create React App

Root Directory: frontend

Environment Variable: REACT_APP_API_URL = your Render backend URL + /api

Deploy



#Structure


github-linkedin-poster/
├── backend/
│   ├── src/
│   │   ├── config/env.js
│   │   ├── controllers/
│   │   │   ├── generate.controller.js
│   │   │   └── linkedin.controller.js
│   │   ├── routes/
│   │   │   ├── generate.routes.js
│   │   │   └── linkedin.routes.js
│   │   ├── services/
│   │   │   ├── github.service.js
│   │   │   ├── llm.service.js
│   │   │   └── linkedin.service.js
│   │   ├── storage/sessionStore.js
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── .env.example
│   └── package.json
├── render.yaml
└── README.md

