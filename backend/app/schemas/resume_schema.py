from pydantic import BaseModel, Field
from typing import Optional, List


class SocialLinks(BaseModel):
    github: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    twitter: Optional[str] = None


class Certification(BaseModel):
    name: str
    issuer: Optional[str] = None
    year: Optional[str] = None


class ResumeProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None

    social: SocialLinks = Field(default_factory=SocialLinks)

    technicalSkills: List[str] = Field(default_factory=list)
    softSkills: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)

    experience: List[dict] = Field(default_factory=list)
    education: List[dict] = Field(default_factory=list)
    projects: List[dict] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    publications: List[dict] = Field(default_factory=list)
    awards: List[dict] = Field(default_factory=list)