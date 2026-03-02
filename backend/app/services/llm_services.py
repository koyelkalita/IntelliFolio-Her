import os
import time
import requests
from dotenv import load_dotenv

load_dotenv(override=True)

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _call_openrouter(prompt: str, max_tokens: int = 4096) -> str:
    """Call OpenRouter API with auto-retry on rate limits."""
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not set")
    model = os.getenv("OPENROUTER_MODEL", "google/gemma-3-4b-it:free")
    
    for attempt in range(3):
        resp = requests.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": os.getenv("OPENROUTER_REFERER", "http://localhost:3000"),
            },
            json={
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": max_tokens,
            },
            timeout=30,
        )
        
        if resp.status_code == 429:
            wait = 3 * (attempt + 1)
            print(f"OpenRouter rate limit (attempt {attempt+1}/3), waiting {wait}s...")
            time.sleep(wait)
            continue
        
        resp.raise_for_status()
        data = resp.json()
        choice = (data.get("choices") or [None])[0]
        if not choice:
            raise ValueError("OpenRouter returned no choices")
        msg = choice.get("message") or {}
        text = msg.get("content") or ""
        if not text:
            raise ValueError("OpenRouter returned empty content")
        return text
    
    raise ValueError("Rate limit exceeded after 3 retries. Wait a minute and try again.")


def call_llm(prompt: str) -> str:
    """Main LLM call for resume parsing, build profile, content enhance.
    Uses OpenRouter directly when available (fastest path)."""
    if os.getenv("OPENROUTER_API_KEY", "").strip():
        return _call_openrouter(prompt)

    # Fallback to Gemini only if no OpenRouter key
    from google import genai
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise ValueError("No LLM API key configured. Set OPENROUTER_API_KEY or GEMINI_API_KEY in backend/.env")
    client = genai.Client(api_key=key, http_options={"api_version": "v1"})
    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
    return response.text


def call_llm_for_suggestions(prompt: str) -> str:
    """For portfolio/resume analysis and AI suggestions."""
    return call_llm(prompt)
