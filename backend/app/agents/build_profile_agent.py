from fastapi import HTTPException
from app.agents.resume_agent import parse_resume
from app.agents.github_agent import summarize_github_profile
from app.agents.content_enhance_agent import enhance_profile_content


def merge_profiles(resume_data: dict, github_data: dict) -> dict:
    """
    Intelligently merge resume + github data.
    Resume has priority for personal info.
    GitHub enriches with missing data and projects.
    """

    if not resume_data:
        return github_data or {}

    if not github_data:
        return resume_data or {}

    merged = resume_data.copy()

    if not merged.get("summary") or merged.get("summary") == "":
        if github_data.get("summary"):
            merged["summary"] = github_data["summary"]

    resume_skills = set(merged.get("technicalSkills", []))
    github_skills = set(github_data.get("technicalSkills", []))
    merged["technicalSkills"] = list(resume_skills.union(github_skills))

    resume_projects = merged.get("projects", [])
    github_projects = github_data.get("projects", [])

    project_map = {}

    for p in resume_projects:
        if isinstance(p, dict) and p.get("name"):
            project_map[p["name"].lower()] = p

    for p in github_projects:
        if isinstance(p, dict) and p.get("name"):
            key = p["name"].lower()
            if key not in project_map:
                project_map[key] = p

    merged["projects"] = list(project_map.values())

    resume_social = merged.get("social", {}) or {}
    github_social = github_data.get("social", {}) or {}

    merged["social"] = {**github_social, **resume_social}

    return merged


def build_profile(
    resume_text: str = None,
    github_username: str = None,
    resume_data: dict = None,
    github_data: dict = None
) -> dict:
    """
    Orchestrates full pipeline:
    1. Extract resume (if text provided) or use resume_data
    2. Extract github (if username provided) or use github_data
    3. Merge both
    4. Enhance content
    5. Return enhanced profile
    """

    has_resume_input = resume_text or resume_data
    has_github_input = github_username or github_data

    if not has_resume_input and not has_github_input:
        raise HTTPException(
            status_code=400,
            detail="Provide either resume_text/resume_data or github_username/github_data"
        )

    resume_final = None
    if resume_data:
        resume_final = resume_data
    elif resume_text:
        resume_final = parse_resume(resume_text)

    github_final = None
    if github_data:
        github_final = github_data
    elif github_username:
        github_final = summarize_github_profile(github_username)

    merged_profile = merge_profiles(resume_final, github_final)


    enhanced_profile = enhance_profile_content(merged_profile)


    return {
        "raw_profile": merged_profile,
        "enhanced_profile": enhanced_profile
    }