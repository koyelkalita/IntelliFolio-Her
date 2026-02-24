import re
from fastapi import HTTPException
import json

def extract_json(text: str) -> str:
    """Extract JSON from LLM response, handling various edge cases"""
    # Clean up markdown code blocks
    text = text.replace("```json", "").replace("```", "")
    
    # Find the main JSON block - look for opening { and match to closing }
    start_idx = text.find('{')
    if start_idx == -1:
        raise HTTPException(status_code=500, detail="No JSON found in AI response")
    
    # Simple approach: find matching closing brace
    brace_count = 0
    end_idx = start_idx
    for i in range(start_idx, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i + 1
                break
    
    json_str = text[start_idx:end_idx]
    
    # Try to validate the JSON
    try:
        json.loads(json_str)
        return json_str
    except json.JSONDecodeError as e:
        # Try to fix common issues
        
        # 1. Remove trailing commas before closing braces/brackets
        json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)
        
        # 2. Try again
        try:
            json.loads(json_str)
            return json_str
        except json.JSONDecodeError:
            print(f"JSON parsing failed: {e}")
            raise HTTPException(status_code=500, detail=f"Invalid JSON in AI response: {str(e)}")