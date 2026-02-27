import json
import re
from fastapi import HTTPException
from app.services.llm_services import call_llm
from app.schemas.resume_schema import ResumeProfile
from app.utils.extract_json import extract_json




def extract_social_links(text: str):
    social = {
        "github": None,
        "linkedin": None,
        "website": None,
        "twitter": None,
        "leetcode": None,
    }

    urls = re.findall(
        r"(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9./-]+\.(com|in|org)[^\s]*)",
        text,
    )

    flat_urls = [u[0] if isinstance(u, tuple) else u for u in urls]

    for url in flat_urls:
        lower = url.lower()

        if "github.com" in lower:
            social["github"] = url
        elif "linkedin.com" in lower:
            social["linkedin"] = url
        elif "twitter.com" in lower:
            social["twitter"] = url
        elif "leetcode.com" in lower:
            social["leetcode"] = url
        else:
            if social["website"] is None:
                social["website"] = url

    return social


def extract_basic_info(text: str):
    prompt = f"""
You are a JSON API.

Extract personal and skill information from this resume.

Return ONLY valid JSON.
No markdown.
No explanations.
No trailing commas.

IMPORTANT: Skills must be returned as FLAT ARRAYS of strings, NOT objects with categories.
Example - CORRECT:
  "technicalSkills": ["Python", "JavaScript", "React", "SQL"]
Example - WRONG:
  "technicalSkills": [{{"category": "Languages", "skills": ["Python"]}}]

Fields:
- name: string
- email: string
- phone: string
- location: string
- summary: string
- social: object with github, linkedin, website, twitter, leetcode (strings)
- technicalSkills: array of skill names (strings only)
- softSkills: array of soft skill names (strings only)
- languages: array of language names (strings only)

Resume Text:
{text}
"""

    raw = call_llm(prompt)
    cleaned = extract_json(raw)

    try:
        return json.loads(cleaned)
    except Exception as e:
        print("BASIC INFO RAW OUTPUT:\n", raw)
        print("Basic info parsing failed, returning empty fallback")
        # Return minimal valid structure
        return {
            "name": None,
            "email": None,
            "phone": None,
            "location": None,
            "summary": None,
            "social": {},
            "technicalSkills": [],
            "softSkills": [],
            "languages": []
        }



def extract_structured_sections(text: str):
    prompt = f"""
You are a JSON API for resume extraction.

Extract structured resume sections from the provided resume text.

Return ONLY valid JSON with NO markdown, NO explanations, NO trailing commas.

Constraints:
- Max 3 experience entries
- Max 3 projects
- Max 3 awards
- Projects MUST include: name, description, technologies (as array), url (if available)

JSON Schema:
{{
  "experience": [
    {{
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "description": "What you did"
    }}
  ],
  "education": [
    {{
      "school": "University Name",
      "degree": "Degree",
      "field": "Field of Study"
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "description": "What the project is about",
      "technologies": ["Python", "React"],
      "url": "https://example.com"
    }}
  ],
  "certifications": ["Certification name"],
  "publications": ["Publication title"],
  "awards": ["Award name"]
}}

Resume Text:
{text}
"""

    raw = call_llm(prompt)
    cleaned = extract_json(raw)

    try:
        return json.loads(cleaned)
    except Exception as e:
        print("STRUCTURED SECTIONS RAW OUTPUT:\n", raw)
        print("Structured sections parsing failed, returning empty fallback")
        # Return empty structure instead of failing
        return {
            "experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
            "publications": [],
            "awards": []
        }



def parse_resume(text: str) -> dict:

    basic = extract_basic_info(text)
    sections = extract_structured_sections(text)

    data = {**basic, **sections}

    regex_socials = extract_social_links(text)

    if not data.get("social") or not isinstance(data.get("social"), dict):
        data["social"] = {}

    for key, value in regex_socials.items():
        if value:
            data["social"][key] = value

    list_fields = [
        "technicalSkills",
        "softSkills",
        "languages",
        "experience",
        "education",
        "projects",
        "certifications",
        "publications",
        "awards",
    ]

    for field in list_fields:
        if data.get(field) is None:
            data[field] = []
        elif isinstance(data.get(field), str):
            data[field] = []

    # Fix technicalSkills: if it's a dict or list of dicts with sub-categories, flatten it to a list
    if isinstance(data.get("technicalSkills"), dict):
        skills_dict = data["technicalSkills"]
        flattened_skills = []
        for category, skills in skills_dict.items():
            if isinstance(skills, list):
                flattened_skills.extend(skills)
            elif isinstance(skills, str):
                flattened_skills.append(skills)
        data["technicalSkills"] = flattened_skills
    elif isinstance(data.get("technicalSkills"), list):
        # Handle case where technicalSkills is a list of dicts with 'category' key
        flattened_skills = []
        for item in data.get("technicalSkills", []):
            if isinstance(item, dict):
                # Extract skills from the dict (could be 'skills' key or other keys with lists)
                for key, value in item.items():
                    if key != 'category' and isinstance(value, list):
                        flattened_skills.extend(value)
            elif isinstance(item, str):
                flattened_skills.append(item)
        if flattened_skills:
            data["technicalSkills"] = flattened_skills

    # Fix certifications: convert strings to dict objects
    if isinstance(data.get("certifications"), list):
        fixed_certs = []
        for cert in data["certifications"]:
            if isinstance(cert, str):
                fixed_certs.append({"name": cert, "issuer": None, "year": None})
            elif isinstance(cert, dict):
                fixed_certs.append(cert)
        data["certifications"] = fixed_certs

    # Fix publications: convert strings to dict objects
    if isinstance(data.get("publications"), list):
        fixed_pubs = []
        for pub in data["publications"]:
            if isinstance(pub, str):
                fixed_pubs.append({"title": pub, "url": None, "date": None})
            elif isinstance(pub, dict):
                fixed_pubs.append(pub)
        data["publications"] = fixed_pubs

    # Fix awards: convert strings to dict objects if needed
    if isinstance(data.get("awards"), list):
        fixed_awards = []
        for award in data["awards"]:
            if isinstance(award, str):
                fixed_awards.append({"title": award, "issuer": None, "date": None})
            elif isinstance(award, dict):
                fixed_awards.append(award)
        data["awards"] = fixed_awards

    # Fix softSkills if it's a dict or list of dicts
    if isinstance(data.get("softSkills"), dict):
        skills_dict = data["softSkills"]
        flattened_skills = []
        for category, skills in skills_dict.items():
            if isinstance(skills, list):
                flattened_skills.extend(skills)
            elif isinstance(skills, str):
                flattened_skills.append(skills)
        data["softSkills"] = flattened_skills
    elif isinstance(data.get("softSkills"), list):
        # Handle case where softSkills is a list of dicts with 'category' key
        flattened_skills = []
        for item in data.get("softSkills", []):
            if isinstance(item, dict):
                # Extract skills from the dict
                for key, value in item.items():
                    if key != 'category' and isinstance(value, list):
                        flattened_skills.extend(value)
            elif isinstance(item, str):
                flattened_skills.append(item)
        if flattened_skills:
            data["softSkills"] = flattened_skills

    # Fix languages if it's a dict or list of dicts
    if isinstance(data.get("languages"), dict):
        lang_dict = data["languages"]
        flattened_langs = []
        for category, langs in lang_dict.items():
            if isinstance(langs, list):
                flattened_langs.extend(langs)
            elif isinstance(langs, str):
                flattened_langs.append(langs)
        data["languages"] = flattened_langs
    elif isinstance(data.get("languages"), list):
        # Handle case where languages is a list of dicts
        flattened_langs = []
        for item in data.get("languages", []):
            if isinstance(item, dict):
                # Extract languages from the dict
                for key, value in item.items():
                    if key != 'category' and isinstance(value, list):
                        flattened_langs.extend(value)
            elif isinstance(item, str):
                flattened_langs.append(item)
        if flattened_langs:
            data["languages"] = flattened_langs

    try:
        validated = ResumeProfile(**data)
        return validated.model_dump()
    except Exception as e:
        print(f"Resume validation error: {e}")
        print(f"Resume data keys: {list(data.keys())}")
        if isinstance(data.get("social"), dict):
            print(f"Social data: {data.get('social')}")
        raise HTTPException(status_code=500, detail=f"Resume validation failed: {str(e)}")