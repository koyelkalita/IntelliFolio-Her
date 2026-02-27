#!/usr/bin/env python3
"""Update all portfolios to be public using direct SQL"""
import sys
sys.path.insert(0, '/c/Work/IntelliFolio-Her/backend')

from app.db.database import engine, SessionLocal
from app.db import models
import sqlalchemy as sa

# Use raw SQL to update - more reliable
try:
    with engine.connect() as connection:
        stmt = sa.text("""
            UPDATE portfolios 
            SET is_public = true, status = 'published'
            WHERE is_public = false
        """)
        result = connection.execute(stmt)
        connection.commit()
        print(f"✓ Updated {result.rowcount} portfolios using SQL")

    # Verify with SQLAlchemy
    db = SessionLocal()
    public_count = db.query(models.Portfolio).filter(models.Portfolio.is_public == True).count()
    draft_count = db.query(models.Portfolio).filter(models.Portfolio.is_public == False).count()
    print(f"✓ Verified: {public_count} public, {draft_count} draft")
    
    # Show example
    example = db.query(models.Portfolio).filter(models.Portfolio.slug == "avantika1036-20260222084821").first()
    if example:
        print(f"✓ Example: {example.slug} - is_public={example.is_public}, status={example.status}")
    
    db.close()
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
