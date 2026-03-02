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
from app.agents.analysis_agent import analyze_portfolio_trends, analyze_resume_text
from app.services.db_service import (
    create_portfolio, create_profile_data, create_skill, 
    create_social_link, create_project, create_user, get_user_by_firebase_uid
)
from app.schemas.database_schemas import (
    PortfolioCreate, ProfileDataCreate, SkillCreate, 
    SocialLinkCreate, ProjectCreate, UserCreate
)
from app.utils.firebase_auth import get_firebase_user
from uuid import uuid4
from datetime import datetime

router = APIRouter(prefix="/ai")


@router.post("/build-profile")
async def build_profile_route(
    payload: BuildProfileRequest, 
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Build and save a complete portfolio"""
    try:
        # Get or create user in database
        user = get_user_by_firebase_uid(db, firebase_user["firebase_uid"])
        
        if not user:
            # Create user if doesn't exist
            user = create_user(
                db,
                UserCreate(
                    email=firebase_user.get("email", f"user-{firebase_user['firebase_uid'][:8]}@intellifolio.com"),
                    display_name=firebase_user.get("display_name", "User"),
                    firebase_uid=firebase_user["firebase_uid"]
                )
            )
        
        user_id = user.id
        # Create unique slug using GitHub username + timestamp
        # Format: github-username-timestamp
        # This ensures multiple portfolios for same user have unique slugs
        clean_github = payload.github_username.lower().replace(" ", "-")[:20]
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        portfolio_slug = f"{clean_github}-{timestamp}"
        
        # Create portfolio
        portfolio = create_portfolio(
            db, 
            user_id, 
            PortfolioCreate(
                title=f"Portfolio - {payload.github_username}",
                slug=portfolio_slug,
                template_type=payload.template_type or "professional"
            )
        )
        
        # Parse resume AND GitHub in parallel (they're independent)
        import asyncio
        resume_data = {}
        github_data = {}

        async def _parse_resume():
            nonlocal resume_data
            if payload.resume_text:
                try:
                    resume_data = await asyncio.to_thread(parse_resume, payload.resume_text)
                except Exception as e:
                    print(f"Resume parsing error: {e}")

        async def _parse_github():
            nonlocal github_data
            try:
                github_data = await asyncio.to_thread(summarize_github_profile, payload.github_username)
            except Exception as e:
                print(f"GitHub parsing error: {e}")

        await asyncio.gather(_parse_resume(), _parse_github())
        
        # Merge profiles
        try:
            profile_result = build_profile(
                resume_text=payload.resume_text,
                github_username=payload.github_username,
                resume_data=resume_data,
                github_data=github_data
            )
            # Merge raw profile (has basic info) with enhanced profile (has enhanced content)
            raw_profile = profile_result.get("raw_profile") or {}
            enhanced_profile = profile_result.get("enhanced_profile") or {}
            
            # Start with raw profile to keep name, email, phone, location, etc.
            merged = dict(raw_profile)
            
            # Merge in enhanced content (headline, enhanced_summary, enhanced descriptions)
            merged.update(enhanced_profile)
            
            # For projects, merge enhanced descriptions with raw project data
            if enhanced_profile.get("projects") and raw_profile.get("projects"):
                merged_projects = []
                enhanced_projects_map = {p.get("name"): p for p in enhanced_profile.get("projects", [])}
                
                for raw_proj in raw_profile.get("projects", []):
                    proj_copy = dict(raw_proj)
                    enhanced_proj = enhanced_projects_map.get(raw_proj.get("name"))
                    if enhanced_proj:
                        proj_copy["enhanced_description"] = enhanced_proj.get("enhanced_description", [])
                    merged_projects.append(proj_copy)
                
                merged["projects"] = merged_projects
            
            # Similarly for experience
            if enhanced_profile.get("experience") and raw_profile.get("experience"):
                merged_exp = []
                enhanced_exp_map = {e.get("title"): e for e in enhanced_profile.get("experience", [])}
                
                for raw_exp in raw_profile.get("experience", []):
                    exp_copy = dict(raw_exp)
                    enhanced_exp = enhanced_exp_map.get(raw_exp.get("title"))
                    if enhanced_exp:
                        exp_copy["enhanced_description"] = enhanced_exp.get("enhanced_description", [])
                    merged_exp.append(exp_copy)
                
                merged["experience"] = merged_exp
        except Exception as e:
            print(f"Profile merge error: {e}")
            merged = {
                "name": payload.github_username,
                "summary": "Portfolio created from GitHub profile",
                "technicalSkills": [],
                "projects": [],
                "social": {"github": f"https://github.com/{payload.github_username}"}
            }
        
        # Save profile data
        profile = create_profile_data(
            db,
            portfolio.id,
            ProfileDataCreate(
                name=merged.get("name"),
                email=merged.get("email"),
                phone=merged.get("phone"),
                location=merged.get("location"),
                summary=merged.get("summary"),
                github_username=payload.github_username,
                github_data=github_data,
                resume_data=resume_data,
                merged_data=merged
            )
        )
        
        # Save resume text data if provided
        if payload.resume_text:
            resume_record = models.ResumeData(
                portfolio_id=portfolio.id,
                file_name="uploaded_resume.txt",
                parsed_json=resume_data,
                upload_date=datetime.utcnow()
            )
            db.add(resume_record)
        
        # Save skills
        for skill in merged.get("technicalSkills", []):
            if isinstance(skill, str):
                create_skill(
                    db,
                    portfolio.id,
                    SkillCreate(skill_name=skill, category="technical")
                )
        
        # Save soft skills
        for skill in merged.get("softSkills", []):
            if isinstance(skill, str):
                create_skill(
                    db,
                    portfolio.id,
                    SkillCreate(skill_name=skill, category="soft")
                )
        
        # Save languages
        for skill in merged.get("languages", []):
            if isinstance(skill, str):
                create_skill(
                    db,
                    portfolio.id,
                    SkillCreate(skill_name=skill, category="language")
                )
        
        # Save projects with proper description handling
        for project in merged.get("projects", []):
            if isinstance(project, dict):
                # Handle both regular description and enhanced_description (array)
                description = project.get("description")
                if not description and project.get("enhanced_description"):
                    # If enhanced_description is an array, join it into a single string
                    enhanced_desc = project.get("enhanced_description", [])
                    if isinstance(enhanced_desc, list):
                        description = " ".join(enhanced_desc) if enhanced_desc else None
                    else:
                        description = enhanced_desc
                
                # Get technologies - look in multiple places
                technologies = project.get("technologies", [])
                if not technologies or (isinstance(technologies, list) and len(technologies) == 0):
                    # Try to get from resume_data or github_data if available
                    if resume_data and "projects" in resume_data:
                        for res_proj in resume_data.get("projects", []):
                            if res_proj.get("name") == project.get("name"):
                                technologies = res_proj.get("technologies", [])
                                break
                
                create_project(
                    db,
                    portfolio.id,
                    ProjectCreate(
                        name=project.get("name"),
                        description=description,
                        url=project.get("url"),
                        technologies=technologies
                    )
                )
        
        # Save portfolio sections (experience, education, etc)
        section_order = 0
        
        # Experience section - use enhanced descriptions if available
        if merged.get("experience"):
            experience_data = []
            for exp in merged.get("experience", []):
                exp_copy = dict(exp)
                # If it has enhanced_description, also store as description
                if "enhanced_description" in exp_copy and "description" not in exp_copy:
                    desc_list = exp_copy.get("enhanced_description", [])
                    exp_copy["description"] = " ".join(desc_list) if isinstance(desc_list, list) else desc_list
                experience_data.append(exp_copy)
            
            section_order += 1
            section = models.PortfolioSection(
                portfolio_id=portfolio.id,
                section_type="experience",
                content=experience_data,
                order_index=section_order,
                is_visible=True
            )
            db.add(section)
        
        # Education section
        if merged.get("education"):
            section_order += 1
            section = models.PortfolioSection(
                portfolio_id=portfolio.id,
                section_type="education",
                content=merged.get("education"),
                order_index=section_order,
                is_visible=True
            )
            db.add(section)
        
        # Certifications section
        if merged.get("certifications"):
            section_order += 1
            section = models.PortfolioSection(
                portfolio_id=portfolio.id,
                section_type="certifications",
                content=merged.get("certifications"),
                order_index=section_order,
                is_visible=True
            )
            db.add(section)
        
        # Awards section
        if merged.get("awards"):
            section_order += 1
            section = models.PortfolioSection(
                portfolio_id=portfolio.id,
                section_type="awards",
                content=merged.get("awards"),
                order_index=section_order,
                is_visible=True
            )
            db.add(section)
        
        # Publications section
        if merged.get("publications"):
            section_order += 1
            section = models.PortfolioSection(
                portfolio_id=portfolio.id,
                section_type="publications",
                content=merged.get("publications"),
                order_index=section_order,
                is_visible=True
            )
            db.add(section)
        
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
        
        # Auto-publish portfolio after creation
        portfolio.status = "published"
        portfolio.is_public = True
        portfolio.published_at = datetime.utcnow()
        db.commit()
        
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


@router.post("/analyze-portfolio/{portfolio_id}")
async def analyze_portfolio_route(
    portfolio_id: str, 
    db: Session = Depends(get_db),
    firebase_user: dict = Depends(get_firebase_user)
):
    """Analyze a portfolio and provide hiring trend suggestions"""

    # Check the portfolio itself exists first
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio_id).first()
    if not portfolio:
        return {"status": "error", "message": "Portfolio not found"}

    profile = db.query(models.ProfileData).filter(models.ProfileData.portfolio_id == portfolio_id).first()
    projects = db.query(models.Project).filter(models.Project.portfolio_id == portfolio_id).all()
    skills = db.query(models.Skill).filter(models.Skill.portfolio_id == portfolio_id).all()

    # If there's no profile data yet, return a graceful empty analysis
    if not profile:
        return {
            "status": "success",
            "analysis": {
                "score": 0,
                "suggestions": [
                    "This portfolio was created but no profile data was saved. Try rebuilding the portfolio.",
                    "Upload your resume and GitHub username on the Create Portfolio page to generate full data."
                ],
                "strengths": [],
                "weaknesses": ["No profile data found for this portfolio"],
                "missing_keywords": [],
                "hiring_trends_analysis": "Unable to analyze — no profile data available."
            }
        }

    portfolio_data = {
        "summary": profile.summary or "",
        "skills": [s.skill_name for s in skills],
        "projects": [{"name": p.name, "description": p.description} for p in projects]
    }

    try:
        analysis = analyze_portfolio_trends(portfolio_data)
        return {
            "status": "success",
            "analysis": analysis
        }
    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "Rate limit" in err_msg:
            return {"status": "error", "message": "AI rate limit hit — free model allows ~20 req/min. Wait a moment and try again."}
        if "401" in err_msg or "API key not valid" in err_msg or "API_KEY_INVALID" in err_msg:
            return {"status": "error", "message": "OpenRouter key invalid. Check OPENROUTER_API_KEY in backend/.env and restart the backend."}
        return {"status": "error", "message": err_msg}


@router.post("/analyze-resume")
async def analyze_resume_route(
    body: dict,
    firebase_user: dict = Depends(get_firebase_user)
):
    """
    Analyze raw resume text against hiring trends and return suggestions.
    Body: { "resume_text": "<pastied or extracted text>" }
    """
    resume_text = (body or {}).get("resume_text") or ""
    try:
        analysis = analyze_resume_text(resume_text)
        return {"status": "success", "analysis": analysis}
    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "Rate limit" in err_msg:
            return {"status": "error", "message": "AI rate limit hit — free model allows ~20 req/min. Wait a moment and try again."}
        if "401" in err_msg or "API key not valid" in err_msg or "API_KEY_INVALID" in err_msg:
            return {"status": "error", "message": "OpenRouter key invalid. Check OPENROUTER_API_KEY in backend/.env and restart the backend."}
        return {"status": "error", "message": err_msg}


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
async def parse_resume_route(
    file: UploadFile, 
    firebase_user: dict = Depends(get_firebase_user)
):
    """Parse resume PDF"""
    try:
        if not file:
            raise ValueError("No file provided")
        
        if not file.filename.lower().endswith('.pdf'):
            raise ValueError("Only PDF files are supported")
        
        text = await extract_text_from_file(file)
        if not text:
            raise ValueError("Could not extract text from PDF")
        
        structured_data = parse_resume(text)
        
        return {
            "status": "success",
            "text": text,
            "structured_data": structured_data
        }
    except Exception as e:
        print(f"Resume parse error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }