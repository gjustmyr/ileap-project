"""
Cleanup script to remove all internships for employer_id = 1
Run this before generating new internships
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from database import SessionLocal

def cleanup_internships(employer_id: int = 1):
    """Remove all internships and related data for specified employer"""
    db = SessionLocal()
    
    try:
        print(f"🗑️  Cleaning up internships for employer_id = {employer_id}")
        print("="*70)
        
        # Delete in correct order (foreign key constraints)
        
        # 1. Delete internship-skill relationships
        result = db.execute(text("""
            DELETE FROM internship_skills 
            WHERE internship_id IN (
                SELECT internship_id FROM internships WHERE employer_id = :employer_id
            )
        """), {"employer_id": employer_id})
        print(f"✓ Deleted {result.rowcount} internship-skill relationships")
        
        # 2. Delete student-internship matches
        result = db.execute(text("""
            DELETE FROM student_internship_matches 
            WHERE internship_id IN (
                SELECT internship_id FROM internships WHERE employer_id = :employer_id
            )
        """), {"employer_id": employer_id})
        print(f"✓ Deleted {result.rowcount} student-internship matches")
        
        # 3. Delete internship applications
        result = db.execute(text("""
            DELETE FROM internship_applications 
            WHERE internship_id IN (
                SELECT internship_id FROM internships WHERE employer_id = :employer_id
            )
        """), {"employer_id": employer_id})
        print(f"✓ Deleted {result.rowcount} internship applications")
        
        # 4. Delete internships
        result = db.execute(text("""
            DELETE FROM internships WHERE employer_id = :employer_id
        """), {"employer_id": employer_id})
        print(f"✓ Deleted {result.rowcount} internships")
        
        db.commit()
        
        # Verify cleanup
        remaining = db.execute(text("""
            SELECT COUNT(*) FROM internships WHERE employer_id = :employer_id
        """), {"employer_id": employer_id}).scalar()
        
        print("="*70)
        print(f"✅ Cleanup complete! Remaining internships: {remaining}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    cleanup_internships(employer_id=1)
