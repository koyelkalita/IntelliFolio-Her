#!/usr/bin/env python
"""
Database initialization script
Run: python init_db.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.db.database import init_db, drop_db, engine
from app.db import models  # Import all models to register them


def main():
    """Initialize database"""
    print("=" * 60)
    print("IntelliFolio Database Initialization")
    print("=" * 60)

    # Check database connection
    try:
        with engine.connect() as conn:
            print("✓ Database connection successful")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        print("\nMake sure:")
        print("1. PostgreSQL is running")
        print("2. DATABASE_URL is correct in .env")
        print("3. Database exists or PostgreSQL user can create it")
        sys.exit(1)

    # Initialize tables
    try:
        init_db()
        print("\n✓ All tables created successfully!")
        print("\nTables created:")
        print("  - users")
        print("  - portfolios")
        print("  - resume_data")
        print("  - profile_data")
        print("  - portfolio_sections")
        print("  - projects")
        print("  - skills")
        print("  - social_links")
        print("  - api_credentials")
        print("  - portfolio_versions")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("Database setup complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
