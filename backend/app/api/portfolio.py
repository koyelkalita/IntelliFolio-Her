from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.services.db_service import get_user_by_firebase_uid
from app.utils.firebase_auth import get_firebase_user
from datetime import datetime

router = APIRouter(prefix="/portfolios", tags=["portfolios"])


@router.get("")
async def get_user_portfolios(
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Get all portfolios for the current user"""
    try:
        user = get_user_by_firebase_uid(db, firebase_user["firebase_uid"])
        if not user:
            return {"status": "success", "portfolios": []}
        
        portfolios = db.query(models.Portfolio).filter(
            models.Portfolio.user_id == user.id
        ).all()
        
        result = []
        for portfolio in portfolios:
            result.append({
                "id": str(portfolio.id),
                "title": portfolio.title,
                "slug": portfolio.slug,
                "template_type": portfolio.template_type,
                "status": portfolio.status,
                "is_public": portfolio.is_public,
                "created_at": portfolio.created_at.isoformat() if portfolio.created_at else None,
                "updated_at": portfolio.updated_at.isoformat() if portfolio.updated_at else None,
            })
        
        return {"status": "success", "portfolios": result}
    except Exception as e:
        print(f"Get portfolios error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


@router.get("/public/{slug}")
async def get_public_portfolio(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get a published portfolio by slug (public endpoint)"""
    try:
        portfolio = db.query(models.Portfolio).filter(
            models.Portfolio.slug == slug,
            models.Portfolio.is_public == True
        ).first()
        
        if not portfolio:
            return {"status": "error", "message": "Portfolio not found"}
        
        profile_data = db.query(models.ProfileData).filter(
            models.ProfileData.portfolio_id == portfolio.id
        ).first()
        
        # Fetch all skills by category
        all_skills = db.query(models.Skill).filter(
            models.Skill.portfolio_id == portfolio.id
        ).all()
        
        # Fetch projects
        projects = db.query(models.Project).filter(
            models.Project.portfolio_id == portfolio.id
        ).all()
        
        # Fetch social links
        social_links = db.query(models.SocialLink).filter(
            models.SocialLink.portfolio_id == portfolio.id
        ).all()
        
        # Fetch portfolio sections (education, experience, etc.)
        sections = db.query(models.PortfolioSection).filter(
            models.PortfolioSection.portfolio_id == portfolio.id,
            models.PortfolioSection.is_visible == True
        ).order_by(models.PortfolioSection.order_index).all()
        
        result = {
            "id": str(portfolio.id),
            "title": portfolio.title,
            "slug": portfolio.slug,
            "template_type": portfolio.template_type,
            "status": portfolio.status,
            "is_public": portfolio.is_public,
            "created_at": portfolio.created_at.isoformat() if portfolio.created_at else None,
        }
        
        if profile_data:
            merged = profile_data.merged_data or {}
            
            # Build skills by category from DB
            skills_by_category = {}
            for skill in all_skills:
                category = skill.category or "technical"
                if category not in skills_by_category:
                    skills_by_category[category] = []
                skills_by_category[category].append(skill.skill_name)
            
            # Fallback: if no skills in DB, use merged_data
            if not all_skills:
                skills_by_category = {
                    "technical": merged.get("technicalSkills", []),
                    "soft": merged.get("softSkills", []),
                    "language": merged.get("languages", []),
                }
            
            # Build projects from DB
            projects_list = [
                {
                    "name": project.name,
                    "description": project.description,
                    "url": project.url,
                    "github_url": project.github_url,
                    "technologies": project.technologies or [],
                    "start_date": project.start_date.isoformat() if project.start_date else None,
                    "end_date": project.end_date.isoformat() if project.end_date else None,
                    "is_featured": project.is_featured
                }
                for project in projects
            ]
            
            # Fallback: if no projects in DB, use merged_data
            if not projects_list:
                projects_list = [
                    {
                        "name": p.get("name", ""),
                        "description": p.get("description", ""),
                        "url": p.get("url", ""),
                        "github_url": p.get("github_url", ""),
                        "technologies": p.get("technologies", []),
                        "start_date": None,
                        "end_date": None,
                        "is_featured": False
                    }
                    for p in merged.get("projects", [])
                    if isinstance(p, dict) and p.get("name")
                ]
            
            # Build social links dict from DB
            social_dict = {}
            for link in social_links:
                social_dict[link.platform] = {
                    "url": link.url,
                    "username": link.username
                }
            
            # Fallback: if no social links in DB, use merged_data
            if not social_dict and merged.get("social"):
                for platform, url in merged.get("social", {}).items():
                    if isinstance(url, str):
                        social_dict[platform] = {"url": url, "username": None}
            
            # Build sections dict from DB
            sections_dict = {}
            for section in sections:
                sections_dict[section.section_type] = section.content
            
            # Fallback: if no sections in DB, use merged_data
            if not sections_dict:
                for key in ["experience", "education", "certifications", "awards", "publications"]:
                    if merged.get(key):
                        sections_dict[key] = merged[key]
            
            # Summary fallback
            summary = profile_data.summary
            if not summary or summary == "Portfolio created from GitHub profile":
                summary = merged.get("summary") or merged.get("bio") or profile_data.summary
            
            result["profile"] = {
                "name": profile_data.name or merged.get("name"),
                "email": profile_data.email or merged.get("email"),
                "phone": profile_data.phone or merged.get("phone"),
                "location": profile_data.location or merged.get("location"),
                "summary": summary,
                "github_username": profile_data.github_username,
                "technicalSkills": skills_by_category.get("technical", []),
                "softSkills": skills_by_category.get("soft", []),
                "languages": skills_by_category.get("language", []),
                "allSkills": skills_by_category,
                "projects": projects_list,
                "social": social_dict,
                "sections": sections_dict,
                "github_data": profile_data.github_data,
                "resume_data": profile_data.resume_data,
                "merged_data": profile_data.merged_data
            }
        
        return {"status": "success", "portfolio": result}
    except Exception as e:
        print(f"Get public portfolio error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


@router.get("/{portfolio_id}")
async def get_portfolio_detail(
    portfolio_id: str,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Get details for a specific portfolio"""
    try:
        portfolio = db.query(models.Portfolio).filter(
            models.Portfolio.id == portfolio_id
        ).first()
        
        if not portfolio:
            return {"status": "error", "message": "Portfolio not found"}
        
        # Check if user owns this portfolio
        user = get_user_by_firebase_uid(db, firebase_user["firebase_uid"])
        if portfolio.user_id != user.id:
            return {"status": "error", "message": "Unauthorized"}
        
        profile_data = db.query(models.ProfileData).filter(
            models.ProfileData.portfolio_id == portfolio_id
        ).first()
        
        result = {
            "id": str(portfolio.id),
            "title": portfolio.title,
            "slug": portfolio.slug,
            "template_type": portfolio.template_type,
            "status": portfolio.status,
            "is_public": portfolio.is_public,
            "created_at": portfolio.created_at.isoformat() if portfolio.created_at else None,
        }
        
        if profile_data:
            result["profile"] = {
                "name": profile_data.name,
                "email": profile_data.email,
                "location": profile_data.location,
                "summary": profile_data.summary,
                "github_username": profile_data.github_username,
            }
        
        return {"status": "success", "portfolio": result}
    except Exception as e:
        print(f"Get portfolio detail error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


@router.put("/{portfolio_id}")
async def update_portfolio_route(
    portfolio_id: str,
    updates: dict,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Update a portfolio"""
    try:
        portfolio = db.query(models.Portfolio).filter(
            models.Portfolio.id == portfolio_id
        ).first()
        
        if not portfolio:
            return {"status": "error", "message": "Portfolio not found"}
        
        # Check if user owns this portfolio
        user = get_user_by_firebase_uid(db, firebase_user["firebase_uid"])
        if portfolio.user_id != user.id:
            return {"status": "error", "message": "Unauthorized"}
        
        # Update portfolio fields
        if "title" in updates:
            portfolio.title = updates["title"]
        if "template_type" in updates:
            portfolio.template_type = updates["template_type"]
        if "status" in updates:
            portfolio.status = updates["status"]
        if "is_public" in updates:
            portfolio.is_public = updates["is_public"]
        
        portfolio.updated_at = datetime.utcnow()
        db.commit()
        
        return {"status": "success", "portfolio_id": str(portfolio.id)}
    except Exception as e:
        print(f"Update portfolio error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


@router.post("/{portfolio_id}/publish")
async def publish_portfolio_route(
    portfolio_id: str,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Publish a portfolio"""
    try:
        portfolio = db.query(models.Portfolio).filter(
            models.Portfolio.id == portfolio_id
        ).first()
        
        if not portfolio:
            return {"status": "error", "message": "Portfolio not found"}
        
        # Check if user owns this portfolio
        user = get_user_by_firebase_uid(db, firebase_user["firebase_uid"])
        if portfolio.user_id != user.id:
            return {"status": "error", "message": "Unauthorized"}
        
        portfolio.status = "published"
        portfolio.is_public = True
        portfolio.published_at = datetime.utcnow()
        portfolio.updated_at = datetime.utcnow()
        db.commit()
        
        return {"status": "success", "portfolio_id": str(portfolio.id), "is_public": True}
    except Exception as e:
        print(f"Publish portfolio error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }


@router.delete("/{portfolio_id}")
async def delete_portfolio_route(
    portfolio_id: str,
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Delete a portfolio"""
    try:
        portfolio = db.query(models.Portfolio).filter(
            models.Portfolio.id == portfolio_id
        ).first()

        if not portfolio:
            return {"status": "error", "message": "Portfolio not found"}

        user = get_user_by_firebase_uid(db, firebase_user["firebase_uid"])
        if portfolio.user_id != user.id:
            return {"status": "error", "message": "Unauthorized"}

        db.delete(portfolio)
        db.commit()

        return {"status": "success", "message": "Portfolio deleted"}
    except Exception as e:
        print(f"Delete portfolio error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }
