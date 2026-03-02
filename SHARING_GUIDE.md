# 🤝 Guide for Sharing & Setup

If you've received this project and are running it for the first time, follow these steps to get everything working (AI suggestions, Portfolios, etc.)

## 1. Environment Variables (.env)
Critical configuration files (`.env` for backend and `.env.local` for frontend) are NOT shared by default because they contain secret API keys. Without these, the AI and database won't function.

### Backend Setup
1. Go to the `backend/` folder.
2. Copy `.env.example` and rename the copy to `.env`.
3. Open `.env` and fill in your own keys:
   - **GEMINI_API_KEY**: Get one for free at [Google AI Studio](https://aistudio.google.com/apikey).
   - **GITHUB_API_TOKEN**: Get one at [GitHub Settings](https://github.com/settings/tokens).
   - (Optional) **OPENROUTER_API_KEY**: If you want to use OpenRouter.

### Frontend Setup
1. Go to the `frontend/` folder.
2. Copy `.env.example` and rename the copy to `.env.local`.
3. Fill in your **Firebase** configuration if you want authentication to work.

---

## 2. Dependencies
You must install the necessary libraries for both parts of the app.

### Backend
1. Open a terminal in `backend/`.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
4. Install requirements: `pip install -r requirements.txt`.

### Frontend
1. Open a terminal in `frontend/`.
2. Install packages: `npm install`.

---

## 3. Database & Portfolios
The database file (`intellifolio.db`) is also usually not shared. 

- **If you start the app with no database**: It will create a fresh, empty one. You won't see any portfolios. You need to go to the **Create** page to build your first one.
- **If you want to see existing portfolios**: You must manually copy the `intellifolio.db` file from the original project into your `backend/` folder.

---

## 4. Running the App
1. **Start Backend**: `uvicorn app.main:app --reload` (from `backend/` folder).
2. **Start Frontend**: `npm run dev` (from `frontend/` folder).
3. Open `http://localhost:3000`.
