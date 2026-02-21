import json
import re
from fastapi import HTTPException
from app.services.llm_services import call_llm
from app.schemas.resume_schema import ResumeProfile


def extract_json(text: str) -> str:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise HTTPException(status_code=500, detail="No JSON found in AI response")
    return match.group(0)


def parse_resume(text: str) -> dict:
    prompt = f"""
Extract structured resume data from the text below.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Fields:
name, email, phone, location, summary,
social, technicalSkills, softSkills, languages,
experience, education, projects, certifications,
publications, awards.

Resume Text:
{text}
"""

    raw_output = call_llm(prompt)

    try:
        cleaned_json = extract_json(raw_output)
        data = json.loads(cleaned_json)

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

        # ---- Normalize social field ----
        if data.get("social") is None:
            data["social"] = {}

        if isinstance(data.get("social"), list):
            social_dict = {}
            for item in data["social"]:
                network = item.get("network", "").lower()
                url = item.get("url")
                if network and url:
                    social_dict[network] = url
            data["social"] = social_dict

        validated = ResumeProfile(**data)
        return validated.model_dump()
    except Exception as e:
        print("\n======= RAW AI OUTPUT =======")
        print(raw_output)
        print("======= ERROR =======")
        print(e)
        raise HTTPException(status_code=500, detail="Invalid AI response")