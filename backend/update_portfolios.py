#!/usr/bin/env python3
"""Update all portfolios to be public"""
import sys
sys.path.insert(0, '/c/Work/IntelliFolio-Her/backend')

from app.db.database import SessionLocal
from app.db import models

db = SessionLocal()
try:
    # Update all portfolios to public
    portfolios = db.query(models.Portfolio).all()
    for p in portfolios:
        p.is_public = True
        p.status = "published"
    
    db.commit()
    print(f"✓ Updated {len(portfolios)} portfolios to public")
    
    # Verify
    public_count = db.query(models.Portfolio).filter(models.Portfolio.is_public == True).count()
    print(f"✓ Public portfolios: {public_count}")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
