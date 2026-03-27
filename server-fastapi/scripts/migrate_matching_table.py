"""
Database Migration Script for student_internship_matches Table

This script creates the student_internship_matches table and necessary indexes.

Usage:
    python scripts/migrate_matching_table.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from database import engine, SessionLocal


def create_matching_table():
    """Create student_internship_matches table with indexes"""
    
    print("="*70)
    print("DATABASE MIGRATION - student_internship_matches")
    print("="*70)
    
    db = SessionLocal()
    
    try:
        # Check if table already exists
        print("\n1. Checking if table exists...")
        result = db.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'student_internship_matches'
            );
        """))
        table_exists = result.scalar()
        
        if table_exists:
            print("   ✓ Table already exists")
            print("   Skipping table creation")
        else:
            print("   Table does not exist, creating...")
            
            # Create table
            db.execute(text("""
                CREATE TABLE student_internship_matches (
                    match_id SERIAL PRIMARY KEY,
                    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
                    internship_id INTEGER NOT NULL REFERENCES internships(internship_id) ON DELETE CASCADE,
                    match_score NUMERIC(5,4) NOT NULL,
                    match_label VARCHAR(50),
                    is_recommended BOOLEAN DEFAULT FALSE,
                    recommended_at TIMESTAMP DEFAULT NOW(),
                    applied BOOLEAN DEFAULT FALSE,
                    applied_at TIMESTAMP,
                    accepted BOOLEAN DEFAULT FALSE,
                    accepted_at TIMESTAMP,
                    feature_values TEXT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    CONSTRAINT unique_student_internship_match UNIQUE (student_id, internship_id)
                );
            """))
            db.commit()
            print("   ✓ Table created successfully")
        
        # Create indexes
        print("\n2. Creating indexes...")
        
        indexes = [
            ("idx_match_student", "student_id"),
            ("idx_match_internship", "internship_id"),
            ("idx_match_score", "match_score DESC"),
            ("idx_match_recommended", "is_recommended, match_score DESC"),
            ("idx_match_applied", "applied, applied_at DESC"),
            ("idx_match_accepted", "accepted, accepted_at DESC")
        ]
        
        for index_name, columns in indexes:
            try:
                # Check if index exists
                result = db.execute(text(f"""
                    SELECT EXISTS (
                        SELECT FROM pg_indexes 
                        WHERE indexname = '{index_name}'
                    );
                """))
                index_exists = result.scalar()
                
                if index_exists:
                    print(f"   ✓ Index {index_name} already exists")
                else:
                    db.execute(text(f"""
                        CREATE INDEX {index_name} 
                        ON student_internship_matches({columns});
                    """))
                    db.commit()
                    print(f"   ✓ Created index: {index_name}")
            
            except Exception as e:
                print(f"   ⚠ Warning: Could not create index {index_name}: {e}")
        
        # Verify table structure
        print("\n3. Verifying table structure...")
        result = db.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'student_internship_matches'
            ORDER BY ordinal_position;
        """))
        
        columns = result.fetchall()
        print(f"   ✓ Table has {len(columns)} columns:")
        for col in columns:
            nullable = "NULL" if col[2] == 'YES' else "NOT NULL"
            print(f"     - {col[0]}: {col[1]} ({nullable})")
        
        print("\n" + "="*70)
        print("MIGRATION COMPLETED SUCCESSFULLY ✓")
        print("="*70)
        print("\nNext Steps:")
        print("  1. Restart FastAPI server: python main.py")
        print("  2. Test matching system: python scripts/test_matching_system.py")
        print("  3. Access API docs: http://localhost:8000/docs")
        
    except Exception as e:
        db.rollback()
        print(f"\n✗ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        db.close()
    
    return True


if __name__ == "__main__":
    success = create_matching_table()
    sys.exit(0 if success else 1)
