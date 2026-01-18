"""
Migration: Add campus_address field to Campus model
Date: 2026-01-18
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from sqlalchemy import text
from database import engine

def upgrade():
    """Add campus_address column to campuses table"""
    with engine.connect() as conn:
        # Add campus_address column
        conn.execute(text("""
            ALTER TABLE campuses 
            ADD COLUMN IF NOT EXISTS campus_address TEXT
        """))
        conn.commit()
        print("✅ Added campus_address column to campuses table")

def downgrade():
    """Remove campus_address column from campuses table"""
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE campuses 
            DROP COLUMN IF EXISTS campus_address
        """))
        conn.commit()
        print("✅ Removed campus_address column from campuses table")

if __name__ == "__main__":
    print("Running migration: Add campus_address to campuses table")
    upgrade()
    print("Migration completed successfully!")
