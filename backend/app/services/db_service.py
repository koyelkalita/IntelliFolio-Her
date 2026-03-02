"""
Database service functions for common operations
Import these in your API routes
"""

from sqlalchemy.orm import Session
from app.db import models
from app.schemas.database_schemas import (
    UserCreate, UserResponse,
    PortfolioCreate, PortfolioResponse,
    ProfileDataCreate, ProfileDataResponse,
    ProjectCreate, ProjectResponse,
    SkillCreate, SkillResponse,
    SocialLinkCreate, SocialLinkResponse
)
from typing import List, Optional
from fastapi import HTTPException


# ─────── USER OPERATIONS ───────

def create_user(db: Session, user: UserCreate) -> models.User:
    """Create a new user"""
    db_user = models.User(
        email=user.email,
        display_name=user.display_name,
        firebase_uid=user.firebase_uid
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """Get user by email"""
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[models.User]:
    """Get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> Optional[models.User]:
    """Get user by Firebase UID"""
    return db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()


# ─────── PORTFOLIO OPERATIONS ───────

def create_portfolio(db: Session, user_id: str, portfolio: PortfolioCreate) -> models.Portfolio:
    """Create a new portfolio"""
    db_portfolio = models.Portfolio(
        user_id=user_id,
        title=portfolio.title,
        slug=portfolio.slug,
        template_type=portfolio.template_type
    )
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio


def get_portfolio(db: Session, portfolio_id: str) -> Optional[models.Portfolio]:
    """Get portfolio by ID"""
    return db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()


def get_user_portfolios(db: Session, user_id: str) -> List[models.Portfolio]:
    """Get all portfolios for a user"""
    return db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id).all()


def update_portfolio(db: Session, portfolio_id: str, updates: dict) -> models.Portfolio:
    """Update portfolio"""
    db_portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not db_portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    for key, value in updates.items():
        if value is not None:
            setattr(db_portfolio, key, value)
    
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio


# ─────── PROFILE DATA OPERATIONS ───────

def create_or_update_profile(db: Session, portfolio_id: str, profile: ProfileDataCreate) -> models.ProfileData:
    """Create or update profile data"""
    db_profile = db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()
    
    if db_profile:
        for key, value in profile.model_dump(exclude_unset=True).items():
            setattr(db_profile, key, value)
    else:
        db_profile = models.ProfileData(portfolio_id=portfolio_id, **profile.model_dump(exclude_unset=True))
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile


def create_profile_data(db: Session, portfolio_id: str, profile: ProfileDataCreate) -> models.ProfileData:
    """Alias for create_or_update_profile - Create or update profile data"""
    return create_or_update_profile(db, portfolio_id, profile)


def get_profile(db: Session, portfolio_id: str) -> Optional[models.ProfileData]:
    """Get profile data"""
    return db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()


# ─────── PROJECT OPERATIONS ───────

def create_project(db: Session, portfolio_id: str, project: ProjectCreate) -> models.Project:
    """Create a new project"""
    db_project = models.Project(
        portfolio_id=portfolio_id,
        **project.model_dump()
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def get_projects(db: Session, portfolio_id: str) -> List[models.Project]:
    """Get all projects for a portfolio"""
    return db.query(models.Project).filter(models.Project.portfolio_id == portfolio_id).all()


def delete_project(db: Session, project_id: str) -> bool:
    """Delete a project"""
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False


# ─────── SKILL OPERATIONS ───────

def create_skill(db: Session, portfolio_id: str, skill: SkillCreate) -> models.Skill:
    """Create a new skill"""
    db_skill = models.Skill(
        portfolio_id=portfolio_id,
        **skill.model_dump()
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


def get_skills(db: Session, portfolio_id: str) -> List[models.Skill]:
    """Get all skills for a portfolio"""
    return db.query(models.Skill).filter(models.Skill.portfolio_id == portfolio_id).all()


def bulk_create_skills(db: Session, portfolio_id: str, skills: List[SkillCreate]) -> List[models.Skill]:
    """Create multiple skills at once"""
    db_skills = [
        models.Skill(portfolio_id=portfolio_id, **skill.model_dump())
        for skill in skills
    ]
    db.add_all(db_skills)
    db.commit()
    for skill in db_skills:
        db.refresh(skill)
    return db_skills


# ─────── SOCIAL LINK OPERATIONS ───────

def create_social_link(db: Session, portfolio_id: str, link: SocialLinkCreate) -> models.SocialLink:
    """Create a new social link"""
    db_link = models.SocialLink(
        portfolio_id=portfolio_id,
        **link.model_dump()
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link


def get_social_links(db: Session, portfolio_id: str) -> List[models.SocialLink]:
    """Get all social links for a portfolio"""
    return db.query(models.SocialLink).filter(models.SocialLink.portfolio_id == portfolio_id).all()


def bulk_create_social_links(db: Session, portfolio_id: str, links: List[SocialLinkCreate]) -> List[models.SocialLink]:
    """Create multiple social links at once"""
    db_links = [
        models.SocialLink(portfolio_id=portfolio_id, **link.model_dump())
        for link in links
    ]
    db.add_all(db_links)
    db.commit()
    for link in db_links:
        db.refresh(link)
    return db_links
