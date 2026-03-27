"""
Add user_feedback and user_feedback_at columns to student_internship_matches table

This allows students to provide feedback on whether a match is good or not,
which will be used for training the ML model.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from database import engine

def add_user_feedback_columns():
    """Add user feedback columns to the student_internship_matches table"""
    
    with engine.connect() as conn:
        try:
            # Check if columns already exist
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'student_internship_matches' 
                AND column_name IN ('user_feedback', 'user_feedback_at')
            """))
            
            existing_columns = [row[0] for row in result]
            
            # Add user_feedback column if it doesn't exist
            if 'user_feedback' not in existing_columns:
                print("Adding user_feedback column...")
                conn.execute(text("""
                    ALTER TABLE student_internship_matches 
                    ADD COLUMN user_feedback BOOLEAN NULL
                """))
                conn.commit()
                print("✓ user_feedback column added")
            else:
                print("✓ user_feedback column already exists")
            
            # Add user_feedback_at column if it doesn't exist
            if 'user_feedback_at' not in existing_columns:
                print("Adding user_feedback_at column...")
                conn.execute(text("""
                    ALTER TABLE student_internship_matches 
                    ADD COLUMN user_feedback_at TIMESTAMP NULL
                """))
                conn.commit()
                print("✓ user_feedback_at column added")
            else:
                print("✓ user_feedback_at column already exists")
            
            print("\n✅ Migration completed successfully!")
            print("\nNew columns:")
            print("  - user_feedback: BOOLEAN (NULL = no feedback, TRUE = good match, FALSE = not a match)")
            print("  - user_feedback_at: TIMESTAMP (when user provided feedback)")
            
        except Exception as e:
            print(f"\n❌ Error during migration: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    print("="*60)
    print("Adding User Feedback Columns to student_internship_matches")
    print("="*60)
    add_user_feedback_columns()
