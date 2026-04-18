
```markdown
# 🚀 GitHub → LinkedIn Post Generator

Transform any GitHub repository into an engaging LinkedIn post with AI. Generate professional, ready-to-share content in seconds and post directly to your LinkedIn profile.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://github-linkedin-poster.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge&logo=render)](https://linkedin-backend-28tv.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

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

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Paste     │────▶│    AI       │────▶│   Review    │────▶│   Post to   │
│  GitHub URL │     │  Generates  │     │    & Edit   │     │  LinkedIn   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. **Connect LinkedIn** - One-time OAuth authentication
2. **Paste GitHub URL** - Any public repository URL
3. **Generate Post** - AI creates engaging content
4. **Review & Edit** - Make any changes you want
5. **Post to LinkedIn** - Share directly to your profile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Axios** | HTTP Client |
| **Lucide React** | Icons |
| **CSS-in-JS** | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | Web Framework |
| **Groq AI (Llama 3.3)** | Post Generation |
| **LinkedIn API v2** | Social Publishing |
| **GitHub API** | Repository Data |

### Deployment
| Platform | Service |
|----------|---------|
| **Vercel** | Frontend Hosting |
| **Render** | Backend Hosting |

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- GitHub account
- LinkedIn account
- Groq API key (free)

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ayoub1108/github-linkedin-poster.git
cd github-linkedin-poster
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3001
NODE_ENV=development

# Groq API (get from console.groq.com)
GROQ_API_KEY=your_groq_api_key

# GitHub Token (optional, for higher rate limits)
GITHUB_TOKEN=your_github_token

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3001/api/linkedin/callback

# CORS
CORS_ORIGINS=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Run Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Open `http://localhost:3000`

---

## 🔑 API Keys Setup

### Groq API (Free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with GitHub/Google
3. Navigate to API Keys
4. Create new key → Copy it

### LinkedIn OAuth
1. Go to [linkedin.com/developers](https://linkedin.com/developers)
2. Create new app
3. Add products:
   - Sign In with LinkedIn using OpenID Connect
   - Share on LinkedIn
4. Copy Client ID and Client Secret
5. Add redirect URI: `http://localhost:3001/api/linkedin/callback`

### GitHub Token (Optional)
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. No scopes needed for public repos
4. Copy token

---

## 🚀 Deployment

### Backend (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Frontend (Vercel)

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/ayoub1108/github-linkedin-poster)

1. Push code to GitHub
2. Import project on Vercel
3. Set:
   - Framework: Create React App
   - Root Directory: `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL + `/api`
5. Deploy

---

## 📁 Project Structure

```
github-linkedin-poster/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
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
│   │   ├── storage/
│   │   │   └── sessionStore.js
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── .github/workflows/
├── docker-compose.yml
├── render.yaml
└── README.md
```

---

## 🔄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/api/health` | Health check |
| POST | `/api/generate` | Generate post from GitHub URL |
| GET | `/api/linkedin/auth-url` | Get LinkedIn OAuth URL |
| GET | `/api/linkedin/callback` | OAuth callback handler |
| POST | `/api/linkedin/share` | Post to LinkedIn |

---

## 🧪 Example Request

```bash
# Generate a post
curl -X POST https://your-backend.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{"githubUrl":"https://github.com/facebook/react"}'

# Response
{
  "success": true,
  "data": {
    "post": "Excited to share React... #ReactJS #WebDev",
    "repoName": "react",
    "repoUrl": "https://github.com/facebook/react"
  }
}
```

---

## 🐳 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📝 Environment Variables Reference

### Backend
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Server port (default: 3001) |
| `NODE_ENV` | Yes | Environment (development/production) |
| `GROQ_API_KEY` | Yes | Groq AI API key |
| `LINKEDIN_CLIENT_ID` | Yes | LinkedIn OAuth client ID |
| `LINKEDIN_CLIENT_SECRET` | Yes | LinkedIn OAuth secret |
| `LINKEDIN_REDIRECT_URI` | Yes | OAuth callback URL |
| `GITHUB_TOKEN` | No | GitHub API token (higher rate limits) |
| `CORS_ORIGINS` | Yes | Allowed frontend origins |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | Backend API URL |

---

## 🎯 Live Demo

- **Frontend:** [https://github-linkedin-poster.vercel.app](https://github-linkedin-poster.vercel.app)
- **Backend:** [https://linkedin-backend-28tv.onrender.com](https://linkedin-backend-28tv.onrender.com)
- **Health Check:** [https://linkedin-backend-28tv.onrender.com/api/health](https://linkedin-backend-28tv.onrender.com/api/health)

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) for free AI API
- [LinkedIn](https://linkedin.com) for developer platform
- [Render](https://render.com) for backend hosting
- [Vercel](https://vercel.com) for frontend hosting

---

## 📧 Contact

- **Author:** Ayoub Rebhi
- **GitHub:** [@ayoub1108](https://github.com/ayoub1108)
- **LinkedIn:** [Ayoub Rebhi](https://linkedin.com/in/ayoub-rebhi)

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Built with ❤️ for developers who want to share their work on LinkedIn**
```

---

## 📝 **How to Add This README**

### **Step 1: Create the README file**

```bash
cd C:\Users\Ayoub\Documents\Gitin

# Create or replace README.md
notepad README.md
```

### **Step 2: Copy and paste the content above**

### **Step 3: Save and push to GitHub**

```bash
git add README.md
git commit -m "Add comprehensive README with project documentation"
git push origin main
```

---

## 🎯 **What's Included in the README**

| Section | Content |
|---------|---------|
| **Header** | Project title, badges, live demo links |
| **Features** | All key capabilities |
| **How It Works** | Visual flow diagram |
| **Tech Stack** | All technologies used |
| **Prerequisites** | What you need before installing |
| **Installation** | Step-by-step setup guide |
| **API Keys Setup** | How to get each API key |
| **Deployment** | Render and Vercel instructions |
| **Project Structure** | Complete folder tree |
| **API Endpoints** | All available endpoints |
| **Example Request** | Sample curl command |
| **Docker Support** | Container commands |
| **Contributing** | How to contribute |
| **Environment Variables** | Complete reference |
| **Live Demo** | Production URLs |
| **License** | MIT license |
| **Contact** | Your information |



