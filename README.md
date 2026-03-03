# IntelliFolio
## AI-Based Dynamic Portfolio Website Generator

IntelliFolio is an AI-driven full-stack system that generates deployment-ready portfolio websites from resume and GitHub data using multi-agent AI orchestration, structured data processing, and dynamic template rendering.

Our website is now live
[Intellifolio](https://intellifolio-subdomain.vercel.app/)

---

# 📌 Problem Statement

Building a professional portfolio requires web development and design skills that many users lack.

Users also struggle to:
- Present projects strategically for specific career roles
- Structure skills for recruiter relevance
- Optimize portfolio strength for job markets

Existing tools lack AI-driven content optimization and scoring mechanisms.

---

# 💡 Project Overview

IntelliFolio is designed to:

- Generate complete portfolio websites from resume and GitHub data
- Use AI to structure and enhance professional content
- Provide real-time responsive portfolio output
- Implement AI-based portfolio strength scoring
- Deliver personalized improvement recommendations
- Enable deployment-ready publishing with subdomain routing

---

# 🏗 System Architecture

## High-Level Architecture

```
User → Upload Service → AI Service → Dashboard → Hosting Service
```

### Detailed Flow (as per system workflow diagram)

1. User uploads resume or GitHub link
2. Upload Service extracts structured data
3. AI Service enhances and restructures content
4. Dashboard displays editable sections
5. User selects template and domain
6. Hosting service publishes portfolio
7. Portfolio becomes live via URL

---

# 🧠 AI Architecture

## Multi-Agent AI Orchestration

The backend integrates multiple AI components:

- Resume Parsing Agent
- GitHub Data Extraction Agent
- Content Enhancement Agent
- Portfolio Strength Scoring Agent
- Improvement Suggestion Agent

### AI Responsibilities

- Convert unstructured resume into structured JSON
- Extract repositories, skills, metadata from GitHub
- Improve clarity, tone, and impact
- Score portfolio strength based on:
  - Skill relevance
  - Content completeness
  - Impact phrasing
  - Market readiness
- Generate actionable improvement recommendations

---

# ⚙️ Tech Stack

## Frontend
- React / Next.js (App Router)
- Tailwind CSS
- Dynamic theme switching
- API integration layer

## Backend
- FastAPI
- Schema validation
- RESTful API architecture
- AI orchestration pipeline

## Database
- PostgreSQL (Supabase)
- Firebase (Authentication & optional storage)

## AI Integration
- LLM API (Gemini-based integration)

## Deployment
- Docker (Full system containerization)
- Vercel (Frontend hosting & subdomain routing)


---

# 📁 Project Structure

## Frontend

```
src/
 ├── app/
 │    ├── [slug]/               # Public portfolio dynamic route
 │    ├── dashboard/
 │    ├── auth/
 │    ├── landing/
 ├── components/
 ├── contexts/
 ├── lib/
 └── proxy.ts                   # Wildcard subdomain routing
```

## Backend

```
app/
 ├── routers/
 ├── services/
 │    ├── ai_service.py
 │    ├── scoring_engine.py
 │    ├── github_parser.py
 ├── models/
 ├── schemas/
 ├── database/
 └── main.py
```

---


## Getting started (local)

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows PowerShell
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
# Copy .env.example to .env and set GEMINI_API_KEY for AI features
python init_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend: http://localhost:8000 — Health: http://localhost:8000/health

### Frontend

```bash
cd frontend
npm install
# Add your Firebase config to .env.local for sign-in/sign-up
npm run dev
```

Frontend: http://localhost:3000

### Environment

- **Backend** (`backend/.env`): See `backend/.env.example`. Use SQLite (omit `DATABASE_URL`) for quick start. Set `GEMINI_API_KEY` for resume parsing and build-profile.
- **Frontend** (`frontend/.env.local`): Set `NEXT_PUBLIC_API_URL=http://localhost:8000` and your Firebase web app config for auth.
