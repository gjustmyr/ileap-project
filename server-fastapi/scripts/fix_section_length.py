"""
Fix section column length from VARCHAR(10) to VARCHAR(50)
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine
from sqlalchemy import text

def fix_section_length():
    """Alter section column to VARCHAR(50)"""
    
    print("🔧 Fixing section column length...")
    print("="*60)
    
    try:
        with engine.connect() as conn:
            # Check current column type
            result = conn.execute(text("""
                SELECT column_name, data_type, character_maximum_length
                FROM information_schema.columns
                WHERE table_name = 'classes' AND column_name = 'section'
            """))
            
            current = result.fetchone()
            if current:
                print(f"Current: {current[0]} - {current[1]}({current[2]})")
            
            # Alter column to VARCHAR(50)
            conn.execute(text("""
                ALTER TABLE classes 
                ALTER COLUMN section TYPE VARCHAR(50)
            """))
            
            conn.commit()
            
            # Verify change
            result = conn.execute(text("""
                SELECT column_name, data_type, character_maximum_length
                FROM information_schema.columns
                WHERE table_name = 'classes' AND column_name = 'section'
            """))
            
            updated = result.fetchone()
            if updated:
                print(f"Updated: {updated[0]} - {updated[1]}({updated[2]})")
            
            print("="*60)
            print("✅ Successfully updated section column to VARCHAR(50)")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    fix_section_length()
