#!/bin/bash

echo "Creating SkillPath project structure..."

# ── Root
mkdir -p skillpath
cd skillpath

# ────────────────────────────────────────────
# FRONTEND — Next.js (M1 + M2)
# ────────────────────────────────────────────
mkdir -p frontend/src/styles
mkdir -p frontend/src/components/shared
mkdir -p frontend/src/components/cards
mkdir -p frontend/src/components/dashboard
mkdir -p frontend/src/pages/sector
mkdir -p frontend/src/pages/roadmap
mkdir -p frontend/src/lib
mkdir -p frontend/src/types
mkdir -p frontend/public

# styles — M1 owns
touch frontend/src/styles/globals.css
touch frontend/src/styles/tokens.css

# shared components — M1 owns
touch frontend/src/components/shared/Navbar.tsx
touch frontend/src/components/shared/Footer.tsx
touch frontend/src/components/shared/Modal.tsx

# card components — M1 owns
touch frontend/src/components/cards/CompanyCard.tsx
touch frontend/src/components/cards/SectorCard.tsx

# dashboard components — M2 owns
touch frontend/src/components/dashboard/RoadmapGraph.tsx
touch frontend/src/components/dashboard/SkillCard.tsx
touch frontend/src/components/dashboard/RepoInput.tsx
touch frontend/src/components/dashboard/SkillMatchScore.tsx
touch frontend/src/components/dashboard/ProgressBar.tsx

# pages — M1 owns
touch frontend/src/pages/index.tsx
touch frontend/src/pages/login.tsx
touch frontend/src/pages/register.tsx
touch "frontend/src/pages/sector/[id].tsx"

# pages — M2 owns
touch frontend/src/pages/dashboard.tsx
touch frontend/src/pages/analysis.tsx
touch "frontend/src/pages/roadmap/[id].tsx"

# lib — shared
touch frontend/src/lib/api.ts
touch frontend/src/lib/auth.ts

# types — shared
touch frontend/src/types/index.ts

# config files
touch frontend/.env.local
touch frontend/.env.example
touch frontend/.gitignore
touch frontend/next.config.js
touch frontend/tailwind.config.js
touch frontend/tsconfig.json
touch frontend/package.json

# ────────────────────────────────────────────
# BACKEND — Node.js + Express (M3 + M4)
# ────────────────────────────────────────────
mkdir -p backend/src/routes
mkdir -p backend/src/controllers
mkdir -p backend/src/models
mkdir -p backend/src/services
mkdir -p backend/src/middleware
mkdir -p backend/src/config
mkdir -p backend/src/seed

# routes — M3
touch backend/src/routes/auth.routes.ts
touch backend/src/routes/user.routes.ts
touch backend/src/routes/sector.routes.ts

# routes — M4
touch backend/src/routes/roadmap.routes.ts
touch backend/src/routes/analysis.routes.ts

# controllers — M3
touch backend/src/controllers/auth.controller.ts
touch backend/src/controllers/user.controller.ts
touch backend/src/controllers/sector.controller.ts

# controllers — M4
touch backend/src/controllers/roadmap.controller.ts
touch backend/src/controllers/analysis.controller.ts

# models — M3
touch backend/src/models/User.model.ts
touch backend/src/models/Company.model.ts
touch backend/src/models/Sector.model.ts

# models — M4
touch backend/src/models/Roadmap.model.ts

# services — M3
touch backend/src/services/jwt.service.ts

# services — M4
touch backend/src/services/ai.service.ts
touch backend/src/services/github.service.ts

# middleware — M3
touch backend/src/middleware/auth.middleware.ts
touch backend/src/middleware/error.middleware.ts

# config — shared
touch backend/src/config/db.ts
touch backend/src/config/env.ts

# seed — M3
touch backend/src/seed/companies.seed.ts
touch backend/src/seed/sectors.seed.ts

# entry point
touch backend/src/index.ts

# config files
touch backend/.env
touch backend/.env.example
touch backend/.gitignore
touch backend/tsconfig.json
touch backend/package.json

# ────────────────────────────────────────────
# SHARED — API contract (written first)
# ────────────────────────────────────────────
touch API.md
touch README.md
touch .gitignore

# ────────────────────────────────────────────
# Done
# ────────────────────────────────────────────
echo ""
echo "Done! Structure created inside ./skillpath"
echo ""
echo "Next steps:"
echo "  1. cd skillpath/frontend  →  npx create-next-app@latest . --typescript --tailwind"
echo "  2. cd skillpath/backend   →  npm init -y && npm install express typescript ts-node @types/node @types/express"
echo "  3. Fill in API.md before writing any code"
echo ""