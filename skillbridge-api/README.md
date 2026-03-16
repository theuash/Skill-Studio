# SkillBridge API 🌉

> Production-ready Express.js backend for the SkillBridge AI-powered career guidance platform.

---

## 🚀 Quick Start

```bash
# 1. Clone & install
git clone https://github.com/yourname/skillbridge-api.git
cd skillbridge-api
npm install

# 2. Configure environment
cp .env.example .env
# → Fill in all values (see Environment Variables section below)

# 3. Seed the database
npm run seed

# 4. Start development server
npm run dev
# → API running at http://localhost:5000
```

---

## 🔑 Environment Variables

| Variable | Description | How to Get |
|---|---|---|
| `PORT` | Server port (default: 5000) | Set to any available port |
| `NODE_ENV` | `development` or `production` | Set manually |
| `MONGO_URI` | MongoDB Atlas connection string | [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Free M0 cluster |
| `JWT_SECRET` | Secret for signing JWTs (min 32 chars) | Run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Token expiry (e.g., `7d`, `30d`) | Set to preference |
| `EMAIL_USER` | Gmail address for sending OTPs | Your Gmail account |
| `EMAIL_PASS` | Gmail App Password (NOT your login password) | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| `GROQ_API_KEY` | Groq API key for AI generation (free) | [console.groq.com](https://console.groq.com) → API Keys |
| `HUGGINGFACE_API_KEY` | HF token for code analysis (free) | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) → New token (read) |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` for local dev |
| `GITHUB_TOKEN` | GitHub PAT for higher API rate limits (optional) | [github.com/settings/tokens](https://github.com/settings/tokens) → New classic token (no scopes) |

### How to get Gmail App Password
1. Enable **2-Step Verification** on your Google Account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select app: **Mail**, device: **Other** → type "SkillBridge"
4. Copy the 16-character password (no spaces) → paste as `EMAIL_PASS`

---

## 📦 Project Structure

```
skillbridge-api/
├── config/
│   ├── db.js              # MongoDB connection with reconnect logic
│   ├── groq.js            # Groq client with exponential backoff retry
│   └── huggingface.js     # HF Inference client with model fallback
├── controllers/
│   ├── authController.js  # Register, OTP verify, login, password reset
│   ├── sectorController.js # Sectors list, companies by sector, search
│   ├── roadmapController.js # AI roadmap generation, node toggling
│   ├── projectController.js # Project generation, submission, analysis
│   └── userController.js  # Profile, dashboard stats
├── middleware/
│   ├── authMiddleware.js  # JWT verification, token generation
│   ├── errorHandler.js    # Global error handler + asyncHandler wrapper
│   ├── rateLimiter.js     # Global, auth, OTP, AI rate limiters
│   └── validate.js        # express-validator result handler
├── models/
│   ├── User.js            # Users with bcrypt password hashing
│   ├── OTP.js             # OTPs with 10min TTL auto-expiry
│   ├── Sector.js          # Tech sectors
│   ├── Company.js         # Companies with skills data
│   ├── Roadmap.js         # AI-generated learning roadmaps
│   ├── Project.js         # Project briefs with submission tracking
│   └── Analysis.js        # AI code review results with grade
├── routes/
│   ├── auth.js
│   ├── sectors.js
│   ├── roadmap.js
│   ├── project.js
│   └── user.js
├── utils/
│   ├── emailService.js    # Nodemailer with branded HTML templates
│   ├── aiService.js       # Groq roadmap + project generation prompts
│   └── repoAnalyzer.js    # GitHub API fetching + HF/Groq analysis
├── data/
│   ├── sectors.json       # 6 tech sectors seed data
│   └── companies.json     # 35+ companies (6+ per sector) with skills
├── scripts/
│   └── seed.js            # Database seeder script
├── server.js              # App entry point
└── .env.example
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication
Protected routes require:
```
Authorization: Bearer <token>
```

---

### 🔐 Auth  `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register with name, email, password |
| POST | `/verify-otp` | No | Verify 6-digit OTP from email |
| POST | `/login` | No | Login, returns JWT token |
| POST | `/resend-otp` | No | Resend OTP (rate limited: 3/hr) |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password` | No | Reset password with token |

**Register Request:**
```json
{
  "fullName": "Alex Johnson",
  "email": "alex@example.com",
  "password": "SecurePass1",
  "confirmPassword": "SecurePass1"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Welcome back, Alex!",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "fullName": "Alex Johnson", "email": "..." }
  }
}
```

---

### 🗂 Sectors  `/api/sectors`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | All sectors with company counts |
| GET | `/:sectorId/companies` | Yes | Companies in a sector |
| GET | `/companies/:companyId` | Yes | Full company details |
| GET | `/search?q=react` | Yes | Search companies/skills |

---

### 🗺 Roadmaps  `/api/roadmap`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/generate` | Yes | Generate AI roadmap for company+role |
| GET | `/` | Yes | List user's roadmaps |
| GET | `/:roadmapId` | Yes | Get roadmap with all nodes |
| PUT | `/:roadmapId/node/:nodeId` | Yes | Toggle node completed |
| DELETE | `/:roadmapId` | Yes | Remove roadmap |

**Generate Request:**
```json
{
  "companyId": "google-webdev",
  "jobRole": "Senior Software Engineer",
  "knownSkills": ["HTML", "CSS", "JavaScript basics"]
}
```

---

### 📁 Projects  `/api/project`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/generate` | Yes | Generate project brief (≥50% roadmap done) |
| POST | `/submit` | Yes | Submit GitHub repo URL for analysis |
| GET | `/` | Yes | List user's projects |
| GET | `/:projectId` | Yes | Get project details |
| GET | `/:projectId/analysis` | Yes | Get AI analysis (or `{status: "processing"}`) |

**Submit Request:**
```json
{
  "projectId": "64f...",
  "repoUrl": "https://github.com/username/my-project"
}
```

---

### 👤 User  `/api/user`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/profile` | Yes | Full profile with roadmaps + projects |
| PUT | `/profile` | Yes | Update name, sector, avatar |
| GET | `/dashboard-stats` | Yes | Stats for dashboard widgets |
| GET | `/skills` | Yes | User's learned skills array |

---

### 💚 Health Check

```
GET /api/health
```

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600,
  "services": {
    "database": { "status": "connected", "connected": true },
    "groq": { "configured": true },
    "huggingface": { "configured": true },
    "email": { "configured": true }
  }
}
```

---

## 🤖 AI Features

### Roadmap Generation (Groq — llama-3.3-70b-versatile)
- Generates 15–20 ordered learning nodes
- Each node includes real free resource URLs (MDN, YouTube, freeCodeCamp)
- Auto-marks known skills as completed
- 3-retry exponential backoff on rate limits

### Project Generation (Groq)
- Creates portfolio-worthy project briefs
- Tailored to company tech stack and job role
- Includes acceptance criteria and bonus features

### Code Analysis (HuggingFace → Groq fallback)
- Fetches repo README and file tree from GitHub API
- Scores: Code Quality, Architecture, Best Practices, Testing, Performance, Security
- Letter grade A+–D
- Runs asynchronously — poll `/project/:id/analysis` until `status: "analyzed"`

---

## ⚡ Rate Limits

| Route Group | Limit |
|---|---|
| Global | 100 requests / 15 minutes |
| Auth routes | 10 requests / 15 minutes |
| OTP resend | 3 requests / 1 hour |
| AI generation | 20 requests / 1 hour |

---

## 🐛 Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    { "field": "email", "message": "Provide a valid email" }
  ]
}
```

---

## 🛡 Security Features

- **bcryptjs** with salt factor 12 for password hashing
- **JWT** with configurable expiry and secret rotation support
- **Helmet.js** security headers
- **CORS** locked to `CLIENT_URL` origin only
- **Rate limiting** on all sensitive endpoints
- OTP **max attempts** (5) with auto-deletion on breach
- Password reset tokens **hashed with SHA-256** before storage
- Email **enumeration prevention** on forgot-password endpoint
- GitHub repo **private repo detection** with clear error messaging

---

## 📜 npm Scripts

```bash
npm start       # Production server (node server.js)
npm run dev     # Development with nodemon + auto-restart
npm run seed    # Seed MongoDB with sectors and companies data
```

---

## 🌱 Seeded Data

After `npm run seed`:
- **6 sectors**: Web Development, Data Science, AI/ML, Mobile Development, Cloud & DevOps, Cybersecurity
- **35+ companies** with realistic required skills (8-12 skills each with difficulty levels)
- Company logos via Clearbit CDN (`https://logo.clearbit.com/{domain}`)

---

## 📝 License

MIT © SkillBridge Team
