# AI Agent: Resume/Portfolio Analysis & Suggestions — Step-by-Step Guide

This guide explains how the **AI agent** analyzes resumes/portfolios against hiring trends, how the **API** connects to the frontend, and **where each piece of code lives**.

---

## Goal

1. **AI agent**: Analyze resume/portfolio according to hiring trends.
2. **API**: Endpoints for the frontend to request analysis and get suggestions.
3. **Suggestions**: The agent returns a score, strengths, weaknesses, and actionable suggestions.

---

## Flow: resume → portfolio → strength + suggestions

1. **Build Your Portfolio** (create page): User enters GitHub username, uploads PDF or pastes resume text → **Build Portfolio**.
2. **Backend** parses resume (if provided), fetches GitHub, merges data, saves portfolio (profile, skills, projects) to DB.
3. **Dashboard**: User selects a portfolio → app calls **analyze-portfolio** with that portfolio’s data (summary, skills, projects from the resume + GitHub).
4. **AI suggestions** use that resume-derived data to compute **Portfolio Strength** (score) and **AI Suggestions** (what to add/fix to build a better portfolio). So suggestions are always based on the user’s resume.

---

## Step 1: LLM service (backend)

Resume parsing and build-profile use **GEMINI_API_KEY**. AI suggestions (portfolio strength + suggestions) use **GEMINI_API_KEY_SUGGESTIONS** if set, otherwise **GEMINI_API_KEY**. That way you can use a different API key only for the suggestion feature.

**File:** `backend/app/services/llm_services.py`

- `call_llm(prompt)` — uses `GEMINI_API_KEY` (resume parse, build profile, etc.).
- `call_llm_for_suggestions(prompt)` — uses `GEMINI_API_KEY_SUGGESTIONS` or `GEMINI_API_KEY`. Used only for portfolio/resume analysis and suggestions.

Set in `backend/.env`:
- `GEMINI_API_KEY` — required for build and optional for suggestions.
- `GEMINI_API_KEY_SUGGESTIONS` — optional; if set, only AI suggestions use this key (get a key at https://aistudio.google.com/apikey).

---

## Step 2: Analysis agent (backend)

The agent builds a prompt for hiring-trends analysis and parses the JSON response.

**File:** `backend/app/agents/analysis_agent.py`

**What it does:**

- `analyze_portfolio_trends(portfolio_data)`  
  - Input: `{ "summary", "skills", "projects" }` from the DB.  
  - Output: `{ score, hiring_trends_analysis, strengths, weaknesses, suggestions, missing_keywords }`.

- `analyze_resume_text(resume_text)`  
  - Input: raw resume text (e.g. pasted or extracted from PDF).  
  - Output: same structure as above.

**Key logic:**

1. Build a prompt that says the data is from the user’s resume and the goal is to help them build a stronger portfolio; evaluate against 2024–2025 hiring trends (metrics, tech stack, readability, impact language, project depth, skills).
2. Call `call_llm_for_suggestions(prompt)` so a separate API key can be used for suggestions only.
3. Use `extract_json()` from `backend/app/utils/extract_json.py` to get a clean JSON string from the response.
4. Parse JSON and normalize the result so the frontend always gets the same shape (with fallbacks if the LLM returns partial data).

---

## Step 3: API endpoints (backend)

**File:** `backend/app/api/ai.py`

### 3a. Analyze portfolio (by portfolio ID)

- **Route:** `POST /ai/analyze-portfolio/{portfolio_id}`
- **Auth:** Firebase user (Bearer token).
- **Logic:**
  1. Load profile, projects, skills for `portfolio_id` from DB.
  2. Build `portfolio_data = { summary, skills, projects }`.
  3. Call `analyze_portfolio_trends(portfolio_data)`.
  4. Return `{ "status": "success", "analysis": analysis }` or `{ "status": "error", "message": "..." }`.
- **Used by:** Dashboard when you select a portfolio and click “Re-analyze” or when the dashboard loads analysis for the active portfolio.

### 3b. Analyze resume (raw text)

- **Route:** `POST /ai/analyze-resume`
- **Body:** `{ "resume_text": "..." }`
- **Auth:** Firebase user (Bearer token).
- **Logic:**
  1. Read `resume_text` from body.
  2. Call `analyze_resume_text(resume_text)`.
  3. Return `{ "status": "success", "analysis": analysis }` or `{ "status": "error", "message": "..." }`.
- **Used by:** Any frontend screen where you want to analyze pasted/extracted resume text before creating a portfolio (e.g. “Analyze my resume” button).

Both endpoints catch Gemini “API key not valid” errors and return a clear message telling the user to set `GEMINI_API_KEY` in `backend/.env`.

---

## Step 4: Frontend API client

**File:** `frontend/src/lib/api.js`

- **Portfolio analysis:**  
  `getPortfolioAnalysis(portfolioId, firebaseToken)`  
  - Calls `POST /ai/analyze-portfolio/{portfolioId}` with `Authorization: Bearer <token>`.

- **Resume analysis:**  
  `getResumeAnalysis(resumeText, firebaseToken)`  
  - Calls `POST /ai/analyze-resume` with body `{ resume_text: resumeText }` and Bearer token.

Use these wherever you need to run analysis (dashboard, create flow, or a dedicated “Analyze resume” page).

---

## Step 5: Dashboard (frontend) — show analysis and suggestions

**File:** `frontend/src/app/dashboard/page.jsx`

**What it does:**

1. When the user selects a portfolio, it calls `runAnalysis(activePortfolio.id)`.
2. `runAnalysis` uses `getPortfolioAnalysis(portfolioId, token)` and stores the result in `analysisData`.
3. **Score:** `portfolioScore` comes from `analysisData.score` (0–100).
4. **Suggestions:** `aiSuggestions` is built from `analysisData.suggestions` (each item has `section`, `suggestion`/`text`, `reason`).
5. **Hiring trends / strengths / missing keywords:** Rendered from `analysisData.hiring_trends_analysis`, `analysisData.strengths`, `analysisData.missing_keywords`.
6. Error state: if the backend returns an error (e.g. invalid Gemini key), the dashboard shows a friendly message and a “Retry” button.

So: **portfolio analysis + suggestions are wired end-to-end** from `analyze_portfolio_trends` → `POST /ai/analyze-portfolio/:id` → `getPortfolioAnalysis` → dashboard state and UI.

---

## Step 6: Optional — “Analyze resume” in the UI

To let users analyze **raw resume text** (e.g. on the create flow or a dedicated page):

1. Add a textarea (or use text from PDF parse).
2. On “Analyze” click, call `getResumeAnalysis(resumeText, token)`.
3. When `result.status === "success"`, use `result.analysis` the same way as portfolio analysis: show `score`, `suggestions`, `strengths`, `weaknesses`, `missing_keywords`, `hiring_trends_analysis`.

No backend changes needed; the endpoint and agent are already in place.

---

## File summary

| Step | File | Purpose |
|------|------|--------|
| 1 | `backend/app/services/llm_services.py` | Gemini client and `call_llm(prompt)` |
| 2 | `backend/app/agents/analysis_agent.py` | `analyze_portfolio_trends`, `analyze_resume_text`; prompt + JSON parse + fallbacks |
| 2 | `backend/app/utils/extract_json.py` | Extract valid JSON from LLM response text |
| 3 | `backend/app/api/ai.py` | `POST /ai/analyze-portfolio/{id}`, `POST /ai/analyze-resume` |
| 4 | `frontend/src/lib/api.js` | `getPortfolioAnalysis`, `getResumeAnalysis` |
| 5 | `frontend/src/app/dashboard/page.jsx` | Call analysis, show score + suggestions + hiring trends |

---

## Env and run

- **Backend:** `backend/.env` must have `GEMINI_API_KEY=...`. Then run:  
  `uvicorn app.main:app --reload --port 8000`
- **Frontend:** Uses `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8000`) and Firebase for auth when calling the AI endpoints.

---

## Response shape (same for portfolio and resume analysis)

```json
{
  "status": "success",
  "analysis": {
    "score": 72,
    "hiring_trends_analysis": "Brief text on how the profile fits current trends.",
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1"],
    "suggestions": [
      {
        "section": "Projects",
        "current": "What they wrote",
        "suggestion": "Concrete improvement",
        "reason": "Why this helps with hiring"
      }
    ],
    "missing_keywords": ["keyword1", "keyword2"]
  }
}
```

The frontend should always check `result.status` and then use `result.analysis` when `status === "success"`.
