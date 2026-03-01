# backend/app/agents/analysis_agent.py
"""
AI agent that analyses resume/portfolio against current hiring trends
and returns a score, strengths, weaknesses, and actionable suggestions.
"""
import json
from app.services.llm_services import call_llm_for_suggestions
from app.utils.extract_json import extract_json

# Expected keys in the analysis response (for validation and fallbacks)
DEFAULT_ANALYSIS = {
    "score": 0,
    "hiring_trends_analysis": "",
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "missing_keywords": [],
}


def _build_prompt(portfolio_data: dict, context: str = "portfolio") -> str:
    """Build the hiring-trends analysis prompt. Data is from the user's resume; goal is to help build a better portfolio."""
    return f"""
You are an expert Technical Recruiter and Career Coach. The following data comes from the user's resume (and merged profile). Your job is to analyze it against 2024-2025 hiring trends and give suggestions so the user can build a stronger portfolio.

Evaluate against these trends:
1. Quantifiable achievements: Use of metrics (%, $, time saved, users) in project/experience descriptions.
2. Tech stack relevance: In-demand keywords (e.g. cloud, APIs, CI/CD, security, scalability).
3. Readability: How quickly a recruiter finds skills, impact, and key projects.
4. Impact language: "Achieved X by doing Y" instead of "Responsible for X".
5. Project depth: Clear problem, solution, tech stack, and outcome per project.
6. Skills breadth and alignment with role types (frontend, backend, fullstack, DevOps).

Data from resume/profile to analyze:
{json.dumps(portfolio_data, indent=2)}

Suggestions must be actionable: what to add, rephrase, or fix so the portfolio stands out to recruiters. Return ONLY a single valid JSON object (no markdown, no code fence). Use this exact structure:
{{
  "score": <number 0-100>,
  "hiring_trends_analysis": "<2-4 sentences on how this profile fits current hiring trends>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "suggestions": [
    {{
      "section": "Projects",
      "current": "<what they wrote>",
      "suggestion": "<concrete improvement>",
      "reason": "<why this helps with hiring>"
    }}
  ],
  "missing_keywords": ["<keyword1>", "<keyword2>"]
}}

Give 2-4 suggestions. Section must be one of: Experience, Projects, Skills, Summary, Contact.
"""


def analyze_portfolio_trends(portfolio_data: dict) -> dict:
    """
    Analyzes portfolio data against current hiring trends and returns
    score, hiring_trends_analysis, strengths, weaknesses, suggestions, missing_keywords.
    """
    if not portfolio_data:
        return {**DEFAULT_ANALYSIS, "hiring_trends_analysis": "No portfolio data to analyze."}

    prompt = _build_prompt(portfolio_data, context="portfolio")
    raw_response = call_llm_for_suggestions(prompt)
    cleaned_json = extract_json(raw_response)

    try:
        data = json.loads(cleaned_json)
        # Ensure all expected keys exist with safe types
        result = {**DEFAULT_ANALYSIS}
        result["score"] = int(data.get("score", 0)) if isinstance(data.get("score"), (int, float)) else 0
        result["score"] = max(0, min(100, result["score"]))
        result["hiring_trends_analysis"] = str(data.get("hiring_trends_analysis", "") or "")
        result["strengths"] = list(data.get("strengths", [])) if isinstance(data.get("strengths"), list) else []
        result["weaknesses"] = list(data.get("weaknesses", [])) if isinstance(data.get("weaknesses"), list) else []
        result["missing_keywords"] = list(data.get("missing_keywords", [])) if isinstance(data.get("missing_keywords"), list) else []
        suggestions = data.get("suggestions")
        if isinstance(suggestions, list):
            result["suggestions"] = []
            for s in suggestions:
                if isinstance(s, dict):
                    result["suggestions"].append({
                        "section": str(s.get("section", "General")),
                        "current": str(s.get("current", "")),
                        "suggestion": str(s.get("suggestion", s.get("text", ""))),
                        "reason": str(s.get("reason", "")),
                    })
                elif isinstance(s, str):
                    result["suggestions"].append({"section": "General", "current": "", "suggestion": s, "reason": ""})
        return result
    except (json.JSONDecodeError, TypeError) as e:
        return {
            **DEFAULT_ANALYSIS,
            "hiring_trends_analysis": "Analysis could not be parsed.",
            "error": str(e),
        }


def analyze_resume_text(resume_text: str) -> dict:
    """
    Analyzes raw resume text against hiring trends (no portfolio in DB yet).
    Returns same structure as analyze_portfolio_trends.
    """
    if not (resume_text or resume_text.strip()):
        return {**DEFAULT_ANALYSIS, "hiring_trends_analysis": "No resume text to analyze."}

    # Normalize to a simple structure the same prompt can use
    portfolio_data = {"raw_summary_or_resume": resume_text.strip()[:8000]}
    prompt = _build_prompt(portfolio_data, context="resume")
    raw_response = call_llm_for_suggestions(prompt)
    cleaned_json = extract_json(raw_response)

    try:
        data = json.loads(cleaned_json)
        result = {**DEFAULT_ANALYSIS}
        result["score"] = int(data.get("score", 0)) if isinstance(data.get("score"), (int, float)) else 0
        result["score"] = max(0, min(100, result["score"]))
        result["hiring_trends_analysis"] = str(data.get("hiring_trends_analysis", "") or "")
        result["strengths"] = list(data.get("strengths", [])) if isinstance(data.get("strengths"), list) else []
        result["weaknesses"] = list(data.get("weaknesses", [])) if isinstance(data.get("weaknesses"), list) else []
        result["missing_keywords"] = list(data.get("missing_keywords", [])) if isinstance(data.get("missing_keywords"), list) else []
        suggestions = data.get("suggestions")
        if isinstance(suggestions, list):
            result["suggestions"] = []
            for s in suggestions:
                if isinstance(s, dict):
                    result["suggestions"].append({
                        "section": str(s.get("section", "General")),
                        "current": str(s.get("current", "")),
                        "suggestion": str(s.get("suggestion", s.get("text", ""))),
                        "reason": str(s.get("reason", "")),
                    })
                elif isinstance(s, str):
                    result["suggestions"].append({"section": "General", "current": "", "suggestion": s, "reason": ""})
        return result
    except (json.JSONDecodeError, TypeError) as e:
        return {
            **DEFAULT_ANALYSIS,
            "hiring_trends_analysis": "Analysis could not be parsed.",
            "error": str(e),
        }
