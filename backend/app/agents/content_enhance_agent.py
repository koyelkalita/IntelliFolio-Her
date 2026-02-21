import json
import re
from fastapi import HTTPException
from app.services.llm_services import call_llm
from app.utils.extract_json import extract_json





def enhance_profile_content(profile_data: dict) -> dict:
    """
    Enhances structured profile data to produce:
    - headline
    - enhanced_summary
    - enhanced experience bullets
    - enhanced project descriptions
    """

    minimal_input = {
        "name": profile_data.get("name"),
        "summary": profile_data.get("summary"),
        "technicalSkills": profile_data.get("technicalSkills", []),
        "experience": profile_data.get("experience", []),
        "projects": profile_data.get("projects", [])
    }

    prompt = f"""
You are a professional resume and portfolio optimization expert.

Enhance the following structured profile data.

Goals:
- Make content impact-driven
- Add measurable achievements where possible
- Improve clarity and professionalism
- Optimize for software engineering roles
- Avoid exaggeration
- Keep content realistic

Return ONLY valid JSON.
No markdown.
No explanation.
No trailing commas.

Return structure:

{{
  "headline": string,
  "enhanced_summary": string,
  "experience": [
      {{
        "title": string,
        "company": string,
        "enhanced_description": []
      }}
  ],
  "projects": [
      {{
        "name": string,
        "enhanced_description": []
      }}
  ]
}}

Profile Data:
{json.dumps(minimal_input)}
"""

    raw_output = call_llm(prompt)

    try:
        cleaned = extract_json(raw_output)
        data = json.loads(cleaned)
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail="Content enhancement failed")