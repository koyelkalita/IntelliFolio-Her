from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from app.services.pdf_parser import extract_text_from_file
from app.agents.resume_agent import parse_resume
from app.agents.github_agent import summarize_github_profile
from app.agents.content_enhance_agent import enhance_profile_content
from app.agents.build_profile_agent import build_profile
from app.schemas.build_profile_schema import BuildProfileRequest
from app.db.database import get_db
from app.db import models
from app.services.db_service import (
    create_portfolio, create_profile_data, create_skill, 
    create_social_link, create_project
)
from app.schemas.database_schemas import (
    PortfolioCreate, ProfileDataCreate, SkillCreate, 
    SocialLinkCreate, ProjectCreate
)
from uuid import uuid4
from datetime import datetime

router = APIRouter(prefix="/ai")


@router.post("/build-profile")
async def build_profile_route(payload: BuildProfileRequest, db: Session = Depends(get_db)):
    """Build and save a complete portfolio"""
    try:
        # Generate portfolio info
        user_id = uuid4()  # In real app, get from auth
        portfolio_slug = f"portfolio-{user_id.hex[:8]}"
        
        # Create portfolio
        portfolio = create_portfolio(
            db, 
            user_id, 
            PortfolioCreate(
                title=f"Portfolio - {payload.github_username}",
                slug=portfolio_slug,
                template_type="professional"
            )
        )
        
        # Parse resume
        resume_data = parse_resume(payload.resume_text) if payload.resume_text else {}
        
        # Parse GitHub
        github_data = summarize_github_profile(payload.github_username)
        
        # Merge profiles
        merged = build_profile(
            resume_text=payload.resume_text,
            github_username=payload.github_username,
            resume_data=resume_data,
            github_data=github_data
        )
        
        # Save profile data
        profile = create_profile_data(
            db,
            portfolio.id,
            ProfileDataCreate(
                name=merged.get("name"),
                email=merged.get("email"),
                location=merged.get("location"),
                summary=merged.get("summary"),
                github_username=payload.github_username,
                github_data=github_data,
                resume_data=resume_data,
                merged_data=merged
            )
        )
        
        # Save skills
        for skill in merged.get("technicalSkills", []):
            if isinstance(skill, str):
                create_skill(
                    db,
                    portfolio.id,
                    SkillCreate(skill_name=skill, category="technical")
                )
        
        # Save projects
        for project in merged.get("projects", []):
            if isinstance(project, dict):
                create_project(
                    db,
                    portfolio.id,
                    ProjectCreate(
                        name=project.get("name"),
                        description=project.get("description"),
                        url=project.get("url"),
                        technologies=project.get("technologies", [])
                    )
                )
        
        # Save social links
        social = merged.get("social", {})
        if social.get("github"):
            create_social_link(
                db,
                portfolio.id,
                SocialLinkCreate(
                    platform="github",
                    url=social["github"],
                    username=payload.github_username
                )
            )
        if social.get("linkedin"):
            create_social_link(
                db,
                portfolio.id,
                SocialLinkCreate(
                    platform="linkedin",
                    url=social["linkedin"]
                )
            )
        
        return {
            "status": "success",
            "portfolio_id": str(portfolio.id),
            "portfolio_slug": portfolio_slug,
            "data": merged
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@router.post("/enhance-profile")
async def enhance_profile(profile_data: dict):
    """Enhance profile content using AI"""
    enhanced_content = enhance_profile_content(profile_data)
    return enhanced_content


@router.get("/github-profile/{username}")
async def get_github_profile(username: str):
    """Get GitHub profile summary"""
    return summarize_github_profile(username)


@router.post("/parse-resume")
async def parse_resume_route(file: UploadFile):
    """Parse resume PDF"""
    text = await extract_text_from_file(file)
    structured_data = parse_resume(text)
    return structured_data