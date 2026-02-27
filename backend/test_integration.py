#!/usr/bin/env python
"""
Test script for IntelliFolio - Tests Database, Gemini Parser, and GitHub Parser
Run: python test_integration.py
"""

import os
import sys
from pathlib import Path
from uuid import uuid4
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import text

# Import database
from app.db.database import SessionLocal, engine
from app.db import models

# Import services
from app.services.llm_services import call_llm
from app.services.github_service import fetch_user_profile, fetch_user_repos
from app.services.db_service import (
    create_user, get_user_by_email, create_portfolio, 
    create_profile_data, create_skill, create_social_link
)

# Import schemas
from app.schemas.database_schemas import (
    UserCreate, PortfolioCreate, ProfileDataCreate, 
    SkillCreate, SocialLinkCreate
)

load_dotenv()


def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


def test_database():
    """Test 1: Database Connection"""
    print_header("TEST 1: DATABASE CONNECTION")
    
    try:
        db = SessionLocal()
        
        # Test connection
        result = db.execute(text("SELECT 1"))
        print("✓ Database connection successful")
        
        # Check tables
        tables = [table for table in models.Base.metadata.tables.keys()]
        print(f"✓ Found {len(tables)} tables:")
        for table in sorted(tables):
            print(f"  - {table}")
        
        db.close()
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False


def test_gemini_api():
    """Test 2: Gemini API"""
    print_header("TEST 2: GEMINI API")
    
    try:
        if not os.getenv("GEMINI_API_KEY"):
            print("✗ GEMINI_API_KEY not set in .env")
            return False
        
        # Simple test prompt
        test_prompt = "What is 2+2? Reply with just the number."
        print(f"Prompt: {test_prompt}")
        
        response = call_llm(test_prompt)
        print(f"Response: {response}")
        
        if "4" in response:
            print("✓ Gemini API working correctly")
            return True
        else:
            print("⚠ Unexpected response from Gemini")
            return False
            
    except Exception as e:
        print(f"✗ Gemini API failed: {e}")
        return False


def test_github_api():
    """Test 3: GitHub API"""
    print_header("TEST 3: GITHUB API")
    
    try:
        # Test with a real GitHub user
        username = "torvalds"  # Linus Torvalds
        print(f"Testing with GitHub user: {username}")
        
        # Fetch profile
        profile = fetch_user_profile(username)
        print(f"✓ Fetched profile: {profile.get('name')}")
        print(f"  - Bio: {profile.get('bio')}")
        print(f"  - Public repos: {profile.get('public_repos')}")
        
        # Fetch repos
        repos = fetch_user_repos(username)
        print(f"✓ Fetched {len(repos)} repositories")
        if repos:
            print(f"  - Top repo: {repos[0]['name']}")
        
        return True
        
    except Exception as e:
        print(f"✗ GitHub API failed: {e}")
        return False


def test_full_integration():
    """Test 4: Full Integration - Create portfolio with parsed data"""
    print_header("TEST 4: FULL INTEGRATION")
    
    try:
        db = SessionLocal()
        
        # Generate unique test data
        unique_id = str(uuid4())[:8]
        
        # 1. Create a test user
        print("Creating test user...")
        user_data = UserCreate(
            email=f"test-{unique_id}@intellifolio.com",
            display_name="Test User",
            firebase_uid=f"test-firebase-{unique_id}"
        )
        user = create_user(db, user_data)
        print(f"✓ User created: {user.id}")
        
        # 2. Create a portfolio
        print("Creating portfolio...")
        portfolio_data = PortfolioCreate(
            title="Test Portfolio",
            slug=f"test-portfolio-{unique_id}",
            template_type="professional"
        )
        portfolio = create_portfolio(db, user.id, portfolio_data)
        print(f"✓ Portfolio created: {portfolio.id}")
        
        # 3. Test Gemini by parsing sample resume
        print("Testing Gemini with sample resume...")
        resume_text = """
        John Doe
        john@example.com | linkedin.com/in/johndoe | github.com/johndoe
        
        Skills: Python, JavaScript, React, PostgreSQL, FastAPI
        """
        
        extract_prompt = f"""
Extract skills from this resume as a JSON list.
Resume:
{resume_text}

Return only valid JSON: {{"skills": ["skill1", "skill2"]}}
"""
        gemini_response = call_llm(extract_prompt)
        print(f"✓ Gemini response: {gemini_response[:100]}...")
        
        # 4. Test GitHub API
        print("Testing GitHub API with real user...")
        github_profile = fetch_user_profile("torvalds")
        print(f"✓ GitHub profile fetched: {github_profile.get('name')}")
        
        # 5. Create profile data with combined information
        print("Saving combined data to database...")
        profile_data = ProfileDataCreate(
            name="Test User",
            email="test@example.com",
            github_username="torvalds",
            summary="Test portfolio with combined data",
            github_data=github_profile,
            resume_data={"skills": ["Python", "JavaScript", "React"]}
        )
        profile = create_profile_data(db, portfolio.id, profile_data)
        print(f"✓ Profile data saved: {profile.id}")
        
        # 6. Add skills to portfolio
        print("Adding skills...")
        skills = [
            SkillCreate(skill_name="Python", category="technical", proficiency_level="expert"),
            SkillCreate(skill_name="FastAPI", category="technical", proficiency_level="advanced"),
            SkillCreate(skill_name="Communication", category="soft", proficiency_level="advanced"),
        ]
        for skill_data in skills:
            skill = create_skill(db, portfolio.id, skill_data)
        print(f"✓ Added {len(skills)} skills")
        
        # 7. Add social links
        print("Adding social links...")
        social_links = [
            SocialLinkCreate(platform="github", url="https://github.com/johndoe", username="johndoe"),
            SocialLinkCreate(platform="linkedin", url="https://linkedin.com/in/johndoe", username="johndoe"),
        ]
        for link_data in social_links:
            link = create_social_link(db, portfolio.id, link_data)
        print(f"✓ Added {len(social_links)} social links")
        
        # 8. Verify data was saved
        print("\nVerifying saved data...")
        saved_portfolio = db.query(models.Portfolio).filter(models.Portfolio.id == portfolio.id).first()
        saved_skills = db.query(models.Skill).filter(models.Skill.portfolio_id == portfolio.id).all()
        saved_links = db.query(models.SocialLink).filter(models.SocialLink.portfolio_id == portfolio.id).all()
        
        print(f"✓ Portfolio: {saved_portfolio.title}")
        print(f"✓ Skills: {len(saved_skills)} saved")
        print(f"✓ Social Links: {len(saved_links)} saved")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"✗ Integration test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n")
    print("╔" + "═" * 58 + "╗")
    print("║" + " " * 10 + "IntelliFolio Integration Tests" + " " * 18 + "║")
    print("╚" + "═" * 58 + "╝")
    
    results = {}
    
    # Run tests
    results["Database"] = test_database()
    results["Gemini API"] = test_gemini_api()
    results["GitHub API"] = test_github_api()
    results["Full Integration"] = test_full_integration()
    
    # Summary
    print_header("TEST SUMMARY")
    
    for test_name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status:8} - {test_name}")
    
    passed_count = sum(1 for v in results.values() if v)
    total_count = len(results)
    
    print("\n" + "=" * 60)
    print(f"Result: {passed_count}/{total_count} tests passed")
    print("=" * 60 + "\n")
    
    # Return exit code
    return 0 if passed_count == total_count else 1


if __name__ == "__main__":
    sys.exit(main())
