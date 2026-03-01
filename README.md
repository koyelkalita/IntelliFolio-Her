# IntelliFolio-Her

Build and manage portfolio websites from your resume and GitHub using AI.

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
