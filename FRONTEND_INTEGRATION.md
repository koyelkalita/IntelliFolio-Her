# Frontend-Backend Integration Guide

## ✅ Integration Complete

The frontend is now connected to the backend API. Here's what was set up:

---

## Created Files

### 1. **API Client** (`frontend/src/lib/api.js`)
- Centralized API communication with the backend
- Handles:
  - `buildPortfolio()` - Build from resume + GitHub
  - `enhanceProfile()` - AI enhancement
  - `getGitHubProfile()` - Fetch GitHub data
  - `parseResume()` - Parse resume file
  - `getPortfolios()` / `updatePortfolio()` - Portfolio management

### 2. **Portfolio Context** (`frontend/src/contexts/PortfolioContext.jsx`)
- Global state management for portfolios
- Hooks: `usePortfolio()`
- Functions:
  - `createPortfolio()` - Create new portfolio
  - `fetchPortfolios()` - Get all user portfolios
  - `updateCurrentPortfolio()` - Update portfolio

### 3. **useAPI Hook** (`frontend/src/hooks/useApi.js`)
- Simplifies API calls with automatic Firebase token injection
- Methods: `build()`, `enhance()`, `github()`, `resume()`
- Example:
  ```javascript
  const { build } = useApi();
  const result = await build(resumeText, githubUsername);
  ```

### 4. **Example Component** (`frontend/src/components/BuildPortfolioForm.jsx`)
- Ready-to-use form for building portfolios
- Handles form validation and error display
- Can be imported and used in any page

### 5. **Updated Layout** (`frontend/src/app/layout.js`)
- Added `PortfolioProvider` wrapper
- Enables `usePortfolio()` throughout the app

---

## How to Use

### In Your Components

```javascript
"use client";

import { useApi } from "@/hooks/useApi";
import { usePortfolio } from "@/contexts/PortfolioContext";

export default function MyComponent() {
  const { build } = useApi();
  const { createPortfolio, loading, error } = usePortfolio();

  const handleBuild = async () => {
    try {
      const result = await build(resumeText, githubUsername);
      console.log("Portfolio created:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <button onClick={handleBuild} disabled={loading}>
      {loading ? "Building..." : "Build Portfolio"}
    </button>
  );
}
```

### Using BuildPortfolioForm Component

```javascript
import { BuildPortfolioForm } from "@/components/BuildPortfolioForm";

export default function DashboardPage() {
  return (
    <div>
      <h1>Create New Portfolio</h1>
      <BuildPortfolioForm />
    </div>
  );
}
```

---

## Configuration

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase configs
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## Testing the Integration

### **1. Start Backend**
```powershell
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **2. Start Frontend**
```powershell
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

### **3. Test in Dashboard**

1. Sign in with Firebase
2. Go to dashboard page
3. Open DevTools (F12) → Console
4. Test API call:
   ```javascript
   // Get API hook
   const api = useApi();
   
   // Check backend health
   api.health().then(console.log);
   
   // Fetch GitHub profile
   api.github("torvalds").then(console.log);
   ```

### **4. Use BuildPortfolioForm**

Add to any page:
```javascript
import { BuildPortfolioForm } from "@/components/BuildPortfolioForm";

export default function TestPage() {
  return <BuildPortfolioForm />;
}
```

---

## API Flow Diagram

```
Frontend (Next.js)
    ↓
useApi Hook (Firebase Auth + Token)
    ↓
API Client (fetch wrapper)
    ↓
Backend FastAPI (8000)
    ↓
Services (Gemini, GitHub, DB)
    ↓
PostgreSQL Database
```

---

## Next Steps

1. **Integrate into Dashboard:**
   - Update `frontend/src/app/dashboard/page.jsx`
   - Add upload resume feature
   - Display portfolio status

2. **Add More Endpoints to Backend:**
   - `GET /portfolios` - List user portfolios
   - `PUT /portfolios/:id` - Update portfolio
   - `POST /portfolios/:id/publish` - Publish portfolio

3. **Error Handling:**
   - Add toast notifications for errors
   - Show loading states
   - Handle network timeouts

4. **CORS Setup (if needed):**
   - Backend already has CORS enabled (`allow_origins=["*"]`)
   - For production, restrict to your frontend domain

---

## Common Issues

### ❌ "API fetch failed"
- Ensure backend is running on `localhost:8000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### ❌ "401 Unauthorized"
- Firebase token not being sent
- Check `useAuth()` returns `currentUser`

### ❌ "CORS error"
- Backend CORS is already configured
- Frontend is requesting from `http://localhost:3000`
- Backend is serving from `http://localhost:8000`

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│           FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────┤
│  Pages ← Components ← Contexts ← Hooks         │
│           (useApi, usePortfolio)                │
├─────────────────────────────────────────────────┤
│  lib/api.js (HTTP Client)                      │
└──────────────────┬──────────────────────────────┘
                   │ HTTP
                   ↓
┌─────────────────────────────────────────────────┐
│          BACKEND (FastAPI)                      │
├─────────────────────────────────────────────────┤
│  Routes (/ai/build-profile, /ai/github-profile)│
│  Services (Resume, GitHub, Gemini)             │
│  Database (PostgreSQL)                         │
└─────────────────────────────────────────────────┘
```

---

**Your full-stack portfolio generator is now integrated!** 🎉

Ready to test? Let me know if you need help with the next steps!
