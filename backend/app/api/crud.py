"""
CRUD API endpoints for all database models
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from typing import List, Optional

from app.db.database import get_db
from app.db import models
from app.schemas.database_schemas import (
    # User
    UserCreate, UserUpdate, UserResponse,
    # Portfolio
    PortfolioCreate, PortfolioUpdate, PortfolioResponse, PortfolioDetailResponse,
    # Resume Data
    ResumeDataCreate, ResumeDataResponse,
    # Profile Data
    ProfileDataCreate, ProfileDataUpdate, ProfileDataResponse,
    # Project
    ProjectCreate, ProjectUpdate, ProjectResponse,
    # Skill
    SkillCreate, SkillUpdate, SkillResponse,
    # Social Link
    SocialLinkCreate, SocialLinkUpdate, SocialLinkResponse,
    # Portfolio Section
    PortfolioSectionCreate, PortfolioSectionUpdate, PortfolioSectionResponse,
    # API Credential
    APICredentialCreate, APICredentialResponse,
    # Portfolio Version
    PortfolioVersionResponse,
)

router = APIRouter(prefix="/api", tags=["CRUD"])


# ── Helper schema for version creation ──
class VersionCreateRequest(BaseModel):
    data: dict
    changed_by: Optional[str] = None
    change_description: Optional[str] = None


# ═══════════════════════════════════════════
#  USER ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/users", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="User with this email already exists")
    db_user = models.User(
        email=user.email,
        display_name=user.display_name,
        firebase_uid=user.firebase_uid,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/users", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all users"""
    return db.query(models.User).offset(skip).limit(limit).all()


@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Get a user by ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/users/email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    """Get a user by email"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: str, updates: UserUpdate, db: Session = Depends(get_db)):
    """Update a user"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    """Delete a user and all associated data"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  PORTFOLIO ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/users/{user_id}/portfolios", response_model=PortfolioResponse, status_code=201)
def create_portfolio(user_id: str, portfolio: PortfolioCreate, db: Session = Depends(get_db)):
    """Create a portfolio for a user"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_portfolio = models.Portfolio(
        user_id=user_id,
        title=portfolio.title,
        slug=portfolio.slug,
        template_type=portfolio.template_type,
    )
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio


@router.get("/users/{user_id}/portfolios", response_model=List[PortfolioResponse])
def list_user_portfolios(user_id: str, db: Session = Depends(get_db)):
    """List all portfolios for a user"""
    return db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id).all()


@router.get("/portfolios/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio(portfolio_id: str, db: Session = Depends(get_db)):
    """Get a portfolio by ID"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio


@router.get("/portfolios/{portfolio_id}/detail", response_model=PortfolioDetailResponse)
def get_portfolio_detail(portfolio_id: str, db: Session = Depends(get_db)):
    """Get a portfolio with all related data"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return PortfolioDetailResponse(
        portfolio=portfolio,
        profile_data=portfolio.profile_data,
        projects=portfolio.projects,
        skills=portfolio.skills,
        social_links=portfolio.social_links,
        sections=portfolio.portfolio_sections,
    )


@router.put("/portfolios/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(portfolio_id: str, updates: PortfolioUpdate, db: Session = Depends(get_db)):
    """Update a portfolio"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(portfolio, key, value)
    db.commit()
    db.refresh(portfolio)
    return portfolio


@router.delete("/portfolios/{portfolio_id}", status_code=204)
def delete_portfolio(portfolio_id: str, db: Session = Depends(get_db)):
    """Delete a portfolio and all associated data"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db.delete(portfolio)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  RESUME DATA ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/resume-data", response_model=ResumeDataResponse, status_code=201)
def create_resume_data(portfolio_id: str, resume: ResumeDataCreate, db: Session = Depends(get_db)):
    """Upload/create resume data for a portfolio"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_resume = models.ResumeData(
        portfolio_id=portfolio_id,
        file_name=resume.file_name,
        file_url=resume.file_url,
        parsed_json=resume.parsed_json,
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume


@router.get("/portfolios/{portfolio_id}/resume-data", response_model=List[ResumeDataResponse])
def list_resume_data(portfolio_id: str, db: Session = Depends(get_db)):
    """List all resume data for a portfolio"""
    return db.query(models.ResumeData).filter(models.ResumeData.portfolio_id == portfolio_id).all()


@router.get("/resume-data/{resume_id}", response_model=ResumeDataResponse)
def get_resume_data(resume_id: str, db: Session = Depends(get_db)):
    """Get resume data by ID"""
    resume = db.query(models.ResumeData).filter(models.ResumeData.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume data not found")
    return resume


@router.delete("/resume-data/{resume_id}", status_code=204)
def delete_resume_data(resume_id: str, db: Session = Depends(get_db)):
    """Delete resume data"""
    resume = db.query(models.ResumeData).filter(models.ResumeData.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume data not found")
    db.delete(resume)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  PROFILE DATA ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/profile", response_model=ProfileDataResponse, status_code=201)
def create_profile_data(portfolio_id: str, profile: ProfileDataCreate, db: Session = Depends(get_db)):
    """Create or update profile data for a portfolio (upsert)"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    existing = db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()
    if existing:
        for key, value in profile.model_dump(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing

    db_profile = models.ProfileData(portfolio_id=portfolio_id, **profile.model_dump(exclude_unset=True))
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.get("/portfolios/{portfolio_id}/profile", response_model=ProfileDataResponse)
def get_profile_data(portfolio_id: str, db: Session = Depends(get_db)):
    """Get profile data for a portfolio"""
    profile = db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile data not found")
    return profile


@router.put("/portfolios/{portfolio_id}/profile", response_model=ProfileDataResponse)
def update_profile_data(portfolio_id: str, updates: ProfileDataUpdate, db: Session = Depends(get_db)):
    """Update profile data for a portfolio"""
    profile = db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile data not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile


@router.delete("/portfolios/{portfolio_id}/profile", status_code=204)
def delete_profile_data(portfolio_id: str, db: Session = Depends(get_db)):
    """Delete profile data for a portfolio"""
    profile = db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile data not found")
    db.delete(profile)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  PROJECT ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/projects", response_model=ProjectResponse, status_code=201)
def create_project(portfolio_id: str, project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a project for a portfolio"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_project = models.Project(portfolio_id=portfolio_id, **project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/portfolios/{portfolio_id}/projects", response_model=List[ProjectResponse])
def list_projects(portfolio_id: str, db: Session = Depends(get_db)):
    """List all projects for a portfolio"""
    return db.query(models.Project).filter(models.Project.portfolio_id == portfolio_id).all()


@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    """Get a project by ID"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: str, updates: ProjectUpdate, db: Session = Depends(get_db)):
    """Update a project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(project, key, value)
    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(project_id: str, db: Session = Depends(get_db)):
    """Delete a project"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  SKILL ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/skills", response_model=SkillResponse, status_code=201)
def create_skill(portfolio_id: str, skill: SkillCreate, db: Session = Depends(get_db)):
    """Create a skill for a portfolio"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_skill = models.Skill(portfolio_id=portfolio_id, **skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@router.post("/portfolios/{portfolio_id}/skills/bulk", response_model=List[SkillResponse], status_code=201)
def bulk_create_skills(portfolio_id: str, skills: List[SkillCreate], db: Session = Depends(get_db)):
    """Create multiple skills at once"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_skills = [models.Skill(portfolio_id=portfolio_id, **s.model_dump()) for s in skills]
    db.add_all(db_skills)
    db.commit()
    for s in db_skills:
        db.refresh(s)
    return db_skills


@router.get("/portfolios/{portfolio_id}/skills", response_model=List[SkillResponse])
def list_skills(portfolio_id: str, db: Session = Depends(get_db)):
    """List all skills for a portfolio"""
    return db.query(models.Skill).filter(models.Skill.portfolio_id == portfolio_id).all()


@router.get("/users/{user_id}/skills", response_model=List[SkillResponse])
def get_skills_by_user(user_id: str, db: Session = Depends(get_db)):
    """Get all skills for a user across all their portfolios"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return (
        db.query(models.Skill)
        .join(models.Portfolio, models.Skill.portfolio_id == models.Portfolio.id)
        .filter(models.Portfolio.user_id == user_id)
        .all()
    )


@router.get("/skills/{skill_id}", response_model=SkillResponse)
def get_skill(skill_id: str, db: Session = Depends(get_db)):
    """Get a skill by ID"""
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.put("/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: str, updates: SkillUpdate, db: Session = Depends(get_db)):
    """Update a skill"""
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(skill, key, value)
    db.commit()
    db.refresh(skill)
    return skill


@router.delete("/skills/{skill_id}", status_code=204)
def delete_skill(skill_id: str, db: Session = Depends(get_db)):
    """Delete a skill"""
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  SOCIAL LINK ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/social-links", response_model=SocialLinkResponse, status_code=201)
def create_social_link(portfolio_id: str, link: SocialLinkCreate, db: Session = Depends(get_db)):
    """Create a social link for a portfolio"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_link = models.SocialLink(portfolio_id=portfolio_id, **link.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


@router.post("/portfolios/{portfolio_id}/social-links/bulk", response_model=List[SocialLinkResponse], status_code=201)
def bulk_create_social_links(portfolio_id: str, links: List[SocialLinkCreate], db: Session = Depends(get_db)):
    """Create multiple social links at once"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_links = [models.SocialLink(portfolio_id=portfolio_id, **l.model_dump()) for l in links]
    db.add_all(db_links)
    db.commit()
    for l in db_links:
        db.refresh(l)
    return db_links


@router.get("/portfolios/{portfolio_id}/social-links", response_model=List[SocialLinkResponse])
def list_social_links(portfolio_id: str, db: Session = Depends(get_db)):
    """List all social links for a portfolio"""
    return db.query(models.SocialLink).filter(models.SocialLink.portfolio_id == portfolio_id).all()


@router.get("/social-links/{link_id}", response_model=SocialLinkResponse)
def get_social_link(link_id: str, db: Session = Depends(get_db)):
    """Get a social link by ID"""
    link = db.query(models.SocialLink).filter(models.SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    return link


@router.put("/social-links/{link_id}", response_model=SocialLinkResponse)
def update_social_link(link_id: str, updates: SocialLinkUpdate, db: Session = Depends(get_db)):
    """Update a social link"""
    link = db.query(models.SocialLink).filter(models.SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(link, key, value)
    db.commit()
    db.refresh(link)
    return link


@router.delete("/social-links/{link_id}", status_code=204)
def delete_social_link(link_id: str, db: Session = Depends(get_db)):
    """Delete a social link"""
    link = db.query(models.SocialLink).filter(models.SocialLink.id == link_id).first()
    if not link:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(link)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  PORTFOLIO SECTION ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/sections", response_model=PortfolioSectionResponse, status_code=201)
def create_section(portfolio_id: str, section: PortfolioSectionCreate, db: Session = Depends(get_db)):
    """Create a portfolio section"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db_section = models.PortfolioSection(portfolio_id=portfolio_id, **section.model_dump())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section


@router.get("/portfolios/{portfolio_id}/sections", response_model=List[PortfolioSectionResponse])
def list_sections(portfolio_id: str, db: Session = Depends(get_db)):
    """List all sections for a portfolio, ordered by order_index"""
    return (
        db.query(models.PortfolioSection)
        .filter(models.PortfolioSection.portfolio_id == portfolio_id)
        .order_by(models.PortfolioSection.order_index)
        .all()
    )


@router.get("/sections/{section_id}", response_model=PortfolioSectionResponse)
def get_section(section_id: str, db: Session = Depends(get_db)):
    """Get a section by ID"""
    section = db.query(models.PortfolioSection).filter(models.PortfolioSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.put("/sections/{section_id}", response_model=PortfolioSectionResponse)
def update_section(section_id: str, updates: PortfolioSectionUpdate, db: Session = Depends(get_db)):
    """Update a portfolio section"""
    section = db.query(models.PortfolioSection).filter(models.PortfolioSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    for key, value in updates.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(section, key, value)
    db.commit()
    db.refresh(section)
    return section


@router.delete("/sections/{section_id}", status_code=204)
def delete_section(section_id: str, db: Session = Depends(get_db)):
    """Delete a portfolio section"""
    section = db.query(models.PortfolioSection).filter(models.PortfolioSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  API CREDENTIAL ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/users/{user_id}/credentials", response_model=APICredentialResponse, status_code=201)
def create_credential(user_id: str, cred: APICredentialCreate, db: Session = Depends(get_db)):
    """Store an API credential for a user"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db_cred = models.APICredential(
        user_id=user_id,
        service=cred.service,
        token=cred.token,
        username=cred.username,
    )
    db.add(db_cred)
    db.commit()
    db.refresh(db_cred)
    return db_cred


@router.get("/users/{user_id}/credentials", response_model=List[APICredentialResponse])
def list_credentials(user_id: str, db: Session = Depends(get_db)):
    """List all API credentials for a user (tokens hidden)"""
    return db.query(models.APICredential).filter(models.APICredential.user_id == user_id).all()


@router.delete("/credentials/{cred_id}", status_code=204)
def delete_credential(cred_id: str, db: Session = Depends(get_db)):
    """Delete an API credential"""
    cred = db.query(models.APICredential).filter(models.APICredential.id == cred_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    db.delete(cred)
    db.commit()
    return None


# ═══════════════════════════════════════════
#  PORTFOLIO VERSION ENDPOINTS
# ═══════════════════════════════════════════

@router.post("/portfolios/{portfolio_id}/versions", response_model=PortfolioVersionResponse, status_code=201)
def create_version(
    portfolio_id: str,
    body: VersionCreateRequest,
    db: Session = Depends(get_db),
):
    """Create a snapshot/version of a portfolio"""
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    # Get next version number
    latest = (
        db.query(models.PortfolioVersion)
        .filter(models.PortfolioVersion.portfolio_id == portfolio_id)
        .order_by(models.PortfolioVersion.version_number.desc())
        .first()
    )
    next_version = (latest.version_number + 1) if latest else 1

    db_version = models.PortfolioVersion(
        portfolio_id=portfolio_id,
        version_number=next_version,
        data=body.data,
        changed_by=body.changed_by,
        change_description=body.change_description,
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version


@router.get("/portfolios/{portfolio_id}/versions", response_model=List[PortfolioVersionResponse])
def list_versions(portfolio_id: str, db: Session = Depends(get_db)):
    """List all versions for a portfolio"""
    return (
        db.query(models.PortfolioVersion)
        .filter(models.PortfolioVersion.portfolio_id == portfolio_id)
        .order_by(models.PortfolioVersion.version_number.desc())
        .all()
    )


@router.get("/versions/{version_id}", response_model=PortfolioVersionResponse)
def get_version(version_id: str, db: Session = Depends(get_db)):
    """Get a specific version by ID"""
    version = db.query(models.PortfolioVersion).filter(models.PortfolioVersion.id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    return version
