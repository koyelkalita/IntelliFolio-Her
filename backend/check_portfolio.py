#!/usr/bin/env python3
"""Check portfolio data"""
import sys
sys.path.insert(0, '/c/Work/IntelliFolio-Her/backend')

from app.db.database import SessionLocal
from app.db import models

db = SessionLocal()
portfolio = db.query(models.Portfolio).filter(
    models.Portfolio.slug == "avantika1036-20260222084821"
).first()

if portfolio:
    print(f"Portfolio: {portfolio.title}")
    print(f"Template: {portfolio.template_type}")
    
    profile = db.query(models.ProfileData).filter(
        models.ProfileData.portfolio_id == portfolio.id
    ).first()
    
    if profile:
        print(f"\nProfile Data:")
        print(f"  Name: {profile.name}")
        print(f"  Email: {profile.email}")
        print(f"  Location: {profile.location}")
        print(f"  Summary: {profile.summary[:100] if profile.summary else 'None'}...")
        print(f"  GitHub: {profile.github_username}")
        
        if profile.resume_data:
            print(f"\nResume Data keys: {list(profile.resume_data.keys())}")
        else:
            print("\nResume Data: None")
            
        if profile.github_data:
            print(f"GitHub Data keys: {list(profile.github_data.keys())}")
        else:
            print("GitHub Data: None")
    else:
        print("No profile data found!")
else:
    print("Portfolio not found!")

db.close()
