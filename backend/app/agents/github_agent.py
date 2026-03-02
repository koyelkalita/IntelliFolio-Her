import json 
import re
from fastapi import HTTPException
from app.services.llm_services import call_llm
from app.utils.extract_json import extract_json
from app.services.github_service import (
    fetch_user_repos,
    fetch_user_profile,
    fetch_profile_readme
)



def summarize_github_profile(username: str) -> dict:
    profile_data = fetch_user_profile(username)
    profile_readme = fetch_profile_readme(username)
    repos = fetch_user_repos(username)

    if not repos:
        # No repos — return profile data without projects instead of crashing
        return {
            "name": profile_data.get("name", username),
            "summary": profile_readme[:200] if profile_readme else "",
            "social": {"github": f"https://github.com/{username}"},
            "technicalSkills": [],
            "projects": [],
        }

    # Prepare detailed repo information for better project extraction
    repo_details = []
    for repo in repos[:10]:
        repo_details.append({
            "name": repo.get("name"),
            "description": repo.get("description"),
            "url": repo.get("html_url"),
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count"),
        })

    prompt = f"""
You are given GitHub user metadata, profile README, and repository information.

Extract structured personal profile information including ALL noteworthy projects.

Return ONLY valid JSON with NO markdown, NO explanations, NO trailing commas.

CRITICAL: Extract projects from the repositories list. Each project must have:
- name (string)
- description (string, 1-2 sentences)
- url (string, GitHub repository URL)
- technologies (array of strings, extracted from 'language' field or common tech for that repo type)

Fields to extract:
{{
  "name": "Full Name",
  "summary": "Professional summary",
  "social": {{
    "github": "github_url",
    "linkedin": "linkedin_url",
    "website": "personal_website",
    "twitter": "twitter_handle"
  }},
  "education": ["School/University name if mentioned"],
  "technicalSkills": ["Python", "JavaScript", "React", ...],
  "projects": [
    {{
      "name": "Project Name",
      "description": "What the project does",
      "url": "https://github.com/user/repo",
      "technologies": ["Python", "FastAPI"]
    }}
  ]
}}

User Metadata:
{json.dumps(profile_data)}

Profile README:
{profile_readme}

Top Repositories (extract as projects):
{json.dumps(repo_details)}
"""
    raw_output = call_llm(prompt)

    try:
        cleaned = extract_json(raw_output)
        data = json.loads(cleaned)
        
        # Fallback: if no projects returned from AI, create them from repos
        if not data.get("projects") or len(data.get("projects", [])) == 0:
            data["projects"] = [
                {
                    "name": repo.get("name", ""),
                    "description": repo.get("description", ""),
                    "url": repo.get("html_url", ""),
                    "technologies": [repo.get("language")] if repo.get("language") else []
                }
                for repo in repos[:5]
                if repo.get("name")
            ]
        
        return data
    
    except json.JSONDecodeError as e:
        print(f"GitHub profile parsing error: {e}")
        # Return fallback with repos as projects
        return {
            "name": profile_data.get("name", username),
            "summary": profile_readme[:200] if profile_readme else "",
            "social": {
                "github": f"https://github.com/{username}"
            },
            "technicalSkills": [],
            "projects": [
                {
                    "name": repo.get("name", ""),
                    "description": repo.get("description", ""),
                    "url": repo.get("html_url", ""),
                    "technologies": [repo.get("language")] if repo.get("language") else []
                }
                for repo in repos[:5]
                if repo.get("name")
            ]
        }
