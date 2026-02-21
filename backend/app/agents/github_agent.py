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
        raise HTTPException(status_code=404, detail="No repositories found for this user")

    repo_descriptions = "\n".join([f"{repo['name']}: {repo['description']}" for repo in repos if repo['description']])

    prompt = f"""
You are given GitHub user metadata and profile README content.

Extract structured personal profile information.

Return ONLY valid JSON.

Fields:
name,
summary,
social (github, linkedin, website, twitter),
education (if mentioned),
technicalSkills (if mentioned),
projects (summarize top repositories professionally)

User Metadata:
{json.dumps(profile_data)}

Profile README:
{profile_readme}

Repositories:
{json.dumps(repos[:5])}
"""
    raw_output = call_llm(prompt)

    try:
        cleaned = extract_json(raw_output)
        data = json.loads(cleaned)
        return data
    
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response")  
