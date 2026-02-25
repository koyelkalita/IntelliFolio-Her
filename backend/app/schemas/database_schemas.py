"""
Pydantic schemas for database models - used for API validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Any, Optional, List
from datetime import datetime
from uuid import UUID


# ─────── USER SCHEMAS ───────

class UserCreate(BaseModel):
    email: EmailStr
    display_name: Optional[str] = None
    firebase_uid: Optional[str] = None


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    display_name: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────── PORTFOLIO SCHEMAS ───────

class PortfolioCreate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    template_type: Optional[str] = "professional"


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    template_type: Optional[str] = None
    is_public: Optional[bool] = None


class PortfolioResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: Optional[str]
    slug: Optional[str]
    status: str
    template_type: Optional[str]
    is_public: bool
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────── RESUME DATA SCHEMAS ───────

class ResumeDataCreate(BaseModel):
    file_name: str
    file_url: str
    parsed_json: dict


class ResumeDataResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    file_name: str
    file_url: str
    parsed_json: dict
    upload_date: datetime

    class Config:
        from_attributes = True


# ─────── PROFILE DATA SCHEMAS ───────

class ProfileDataCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    github_username: Optional[str] = None
    github_data: Optional[dict] = None
    resume_data: Optional[dict] = None
    merged_data: Optional[dict] = None


class ProfileDataUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    github_data: Optional[dict] = None
    resume_data: Optional[dict] = None
    merged_data: Optional[dict] = None


class ProfileDataResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    summary: Optional[str]
    github_username: Optional[str]
    github_data: Optional[dict]
    resume_data: Optional[dict]
    merged_data: Optional[dict]
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────── PROJECT SCHEMAS ───────

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[List[str]] = Field(default_factory=list)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_featured: bool = False


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    github_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_featured: Optional[bool] = None


class ProjectResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    name: str
    description: Optional[str]
    url: Optional[str]
    github_url: Optional[str]
    technologies: List[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    is_featured: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─────── SKILL SCHEMAS ───────

class SkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = "technical"
    proficiency_level: Optional[str] = "intermediate"


class SkillUpdate(BaseModel):
    skill_name: Optional[str] = None
    category: Optional[str] = None
    proficiency_level: Optional[str] = None
    endorsement_count: Optional[int] = None


class SkillResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    skill_name: str
    category: Optional[str]
    proficiency_level: Optional[str]
    endorsement_count: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─────── SOCIAL LINK SCHEMAS ───────

class SocialLinkCreate(BaseModel):
    platform: str
    url: str
    username: Optional[str] = None


class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    username: Optional[str] = None


class SocialLinkResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    platform: str
    url: str
    username: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─────── PORTFOLIO SECTION SCHEMAS ───────

class PortfolioSectionCreate(BaseModel):
    section_type: str
    content: Any
    order_index: int = 0
    is_visible: bool = True


class PortfolioSectionUpdate(BaseModel):
    section_type: Optional[str] = None
    content: Optional[Any] = None
    order_index: Optional[int] = None
    is_visible: Optional[bool] = None


class PortfolioSectionResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    section_type: str
    content: Any
    order_index: int
    is_visible: bool
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────── API CREDENTIAL SCHEMAS ───────

class APICredentialCreate(BaseModel):
    service: str
    token: str
    username: Optional[str] = None


class APICredentialResponse(BaseModel):
    id: UUID
    user_id: UUID
    service: str
    username: Optional[str]
    created_at: datetime
    last_used: Optional[datetime]
    # Note: token is NOT returned in response for security

    class Config:
        from_attributes = True


# ─────── PORTFOLIO VERSION SCHEMAS ───────

class PortfolioVersionResponse(BaseModel):
    id: UUID
    portfolio_id: UUID
    version_number: int
    data: dict
    changed_by: Optional[UUID] = None
    change_description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─────── COMBINED RESPONSE SCHEMAS ───────

class PortfolioDetailResponse(BaseModel):
    """Complete portfolio with all related data"""
    portfolio: PortfolioResponse
    profile_data: Optional[ProfileDataResponse] = None
    projects: List[ProjectResponse] = Field(default_factory=list)
    skills: List[SkillResponse] = Field(default_factory=list)
    social_links: List[SocialLinkResponse] = Field(default_factory=list)
    sections: List[PortfolioSectionResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True
