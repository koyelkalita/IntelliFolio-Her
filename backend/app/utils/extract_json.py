import re
from fastapi import HTTPException
import json

def extract_json(text: str) -> str:
    text = text.replace("```json", "").replace("```", "")
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise HTTPException(status_code=500, detail="No JSON found in AI response")
    return match.group(0)