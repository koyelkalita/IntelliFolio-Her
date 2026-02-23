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

Fields:
name, email, phone, location, summary,
social, technicalSkills, softSkills, languages

Resume Text:
{text}
"""

    raw = call_llm(prompt)
    cleaned = extract_json(raw)

    try:
        return json.loads(cleaned)
    except Exception:
        print("BASIC INFO RAW OUTPUT:\n", raw)
        raise HTTPException(status_code=500, detail="Basic info JSON parsing failed")



def extract_structured_sections(text: str):
    prompt = f"""
You are a JSON API.

Extract structured resume sections.

Return ONLY valid JSON.
No markdown.
No explanations.
No trailing commas.

Limit:
- Max 3 experience entries
- Max 3 projects
- Max 3 awards

Fields:
experience, education, projects,
certifications, publications, awards

Resume Text:
{text}
"""

    raw = call_llm(prompt)
    cleaned = extract_json(raw)

    try:
        return json.loads(cleaned)
    except Exception:
        print("STRUCTURED SECTIONS RAW OUTPUT:\n", raw)
        raise HTTPException(status_code=500, detail="Structured sections JSON parsing failed")



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

    try:
        validated = ResumeProfile(**data)
        return validated.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Resume validation failed")