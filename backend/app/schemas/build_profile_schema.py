from pydantic import BaseModel
from typing import Optional, Dict


class BuildProfileRequest(BaseModel):
    resume_text: Optional[str] = None
    github_username: Optional[str] = None
    resume_data: Optional[Dict] = None
    github_data: Optional[Dict] = None