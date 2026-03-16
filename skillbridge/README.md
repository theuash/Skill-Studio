# SkillBridge 🌉

> **Bridge the Gap Between Learning and Earning** — An AI-powered career guidance platform that gives developers company-specific skill roadmaps, real projects, and instant AI code evaluation.

---

## ✨ Features

- 🗺️ **AI-Powered Roadmaps** — Personalized learning paths for 500+ top companies across 10+ tech sectors
- 🏢 **Company-Specific Skills** — Know exactly what Google, Meta, OpenAI, etc. actually require
- 🃏 **Interactive Company Cards** — Flip-card animations revealing required skills with difficulty badges
- 🤖 **AI Code Analysis** — Submit your GitHub repo and get structured feedback with scores
- 📊 **Progress Tracking** — Visual roadmap completion with per-difficulty breakdowns
- 🌙 **Dark / Light Mode** — Smooth theme toggle persisted in localStorage
- 🔐 **Auth with OTP** — Register → verify email OTP → dashboard
- 📱 **Fully Responsive** — Mobile, tablet, and desktop optimized

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| HTTP Client | Axios |
| State | React Context API |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Fonts | Syne (headings) + DM Sans (body) |

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & install

```bash
git clone https://github.com/yourname/skillbridge.git
cd skillbridge
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## 🗂 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with auth interceptors
├── components/
│   ├── layout/
│   │   ├── AuthLayout.jsx    # Split-screen auth wrapper
│   │   ├── DashboardLayout.jsx # Sidebar + main layout
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx        # Sticky public navbar
│   ├── sections/
│   │   ├── ParallaxHero.jsx  # Multi-layer parallax hero
│   │   ├── FeaturesSection.jsx
│   │   ├── HowItWorksSection.jsx
│   │   └── StatsSection.jsx  # Animated counters
│   └── ui/
│       ├── Button.jsx
│       ├── CompanyCard.jsx   # 3D flip card
│       ├── Input.jsx
│       ├── Logo.jsx
│       ├── ProtectedRoute.jsx
│       ├── Skeleton.jsx
│       └── ThemeToggle.jsx
├── context/
│   ├── AuthContext.jsx       # User auth state
│   └── ThemeContext.jsx      # Dark/light mode
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── VerifyOtpPage.jsx
│   ├── DashboardPage.jsx
│   ├── SectorPage.jsx        # Company grid per sector
│   ├── RoadmapPage.jsx       # Interactive roadmap nodes
│   ├── ProjectPage.jsx       # AI project brief + submission
│   ├── AnalysisPage.jsx      # Score report card
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx      # Creative 404
└── utils/
    └── data.js               # Static data: sectors, companies, roadmap nodes
```

---

## 🔗 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with hero, features, how-it-works, stats |
| `/login` | Public | Email + password login |
| `/register` | Public | Registration form |
| `/verify-otp` | Public | 6-digit OTP verification |
| `/dashboard` | 🔒 Auth | Overview, sector picker, recent progress |
| `/sector/:sectorName` | 🔒 Auth | Company grid for a sector |
| `/roadmap/:companyId/:jobRole` | 🔒 Auth | Interactive skill roadmap |
| `/project/:roadmapId` | 🔒 Auth | AI project brief + GitHub submission |
| `/analysis/:projectId` | 🔒 Auth | Detailed AI code review report |
| `/profile` | 🔒 Auth | User profile, skills, projects, history |

---

## 🔌 API Integration

All protected requests include `Authorization: Bearer {token}` header automatically via Axios interceptor.

### Auth
```
POST /auth/register     → { name, email, password }
POST /auth/verify-otp   → { email, otp }
POST /auth/login        → { email, password }
```

### Data
```
GET  /sectors
GET  /companies/:sector
POST /roadmap/generate  → { companyId, jobRole, userSkills }
POST /project/generate  → { roadmapId }
POST /project/submit    → { repoUrl, projectId }
GET  /analysis/:projectId
GET  /user/profile
PUT  /user/profile
```

---

## 🎨 Design System

### Color Palette

| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| Background | `#0A0A0F` | `#F5F5FF` |
| Surface | `#12121A` | `#FFFFFF` |
| Accent | `#6C63FF` | `#6C63FF` |
| Secondary | `#00D4FF` | `#0099CC` |
| Text | `#E8E8F0` | `#1A1A2E` |

### Typography
- **Headings** — [Syne](https://fonts.google.com/specimen/Syne) (extrabold 800)
- **Body** — [DM Sans](https://fonts.google.com/specimen/DM+Sans) (regular 400, medium 500)

---

## 🧪 Demo Mode

The app works fully **without a backend**. Click **"Try Demo Account"** on the login page to explore all features with pre-populated demo data.

---

## 📝 License

MIT © SkillBridge Team
