"""
Data Migration: Fix existing OJT Head campus assignments
Description: Assigns OJT Heads to their extension campuses based on their main campus
Date: 2026-01-15
"""

from sqlalchemy.orm import Session
from database import get_db, engine
from models import OJTHead, Campus
from sqlalchemy import text


def migrate_ojt_head_assignments():
    """
    Migrate existing OJT Head assignments to include extension campuses.
    This should be run after removing the unique constraint on ojt_heads.user_id
    """
    db = next(get_db())
    
    try:
        # First, drop the unique constraint if it exists
        with engine.connect() as conn:
            # For PostgreSQL
            conn.execute(text("ALTER TABLE ojt_heads DROP CONSTRAINT IF EXISTS ojt_heads_user_id_key;"))
            conn.commit()
            print("✓ Removed unique constraint on ojt_heads.user_id")
        
        # Get all OJT Heads
        ojt_heads = db.query(OJTHead).all()
        
        # Group by user_id to avoid duplicates
        user_campus_map = {}
        for ojt_head in ojt_heads:
            if ojt_head.user_id not in user_campus_map:
                user_campus_map[ojt_head.user_id] = []
            user_campus_map[ojt_head.user_id].append(ojt_head.campus_id)
        
        added_count = 0
        
        # For each OJT Head user
        for user_id, campus_ids in user_campus_map.items():
            # Get the first OJT Head record to use as template
            template = db.query(OJTHead).filter(OJTHead.user_id == user_id).first()
            
            # Check each assigned campus
            for campus_id in campus_ids:
                campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
                
                # If it's a main campus (not an extension)
                if campus and not campus.is_extension:
                    # Get all extension campuses that belong to this main campus
                    extension_campuses = db.query(Campus).filter(
                        Campus.is_extension == True,
                        Campus.parent_campus_id == campus_id,
                        Campus.status == "active"
                    ).all()
                    
                    # Add OJT Head to each extension campus if not already assigned
                    for ext_campus in extension_campuses:
                        # Check if already assigned
                        existing = db.query(OJTHead).filter(
                            OJTHead.user_id == user_id,
                            OJTHead.campus_id == ext_campus.campus_id
                        ).first()
                        
                        if not existing:
                            # Create new assignment
                            new_assignment = OJTHead(
                                user_id=template.user_id,
                                first_name=template.first_name,
                                last_name=template.last_name,
                                contact_number=template.contact_number,
                                position_title=template.position_title,
                                campus_id=ext_campus.campus_id,
                                status=template.status
                            )
                            db.add(new_assignment)
                            added_count += 1
                            print(f"  Added {template.first_name} {template.last_name} to extension campus: {ext_campus.campus_name}")
        
        db.commit()
        print(f"\n✓ Migration completed successfully!")
        print(f"  Total extension campus assignments added: {added_count}")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Migration failed: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Starting OJT Head campus assignment migration...\n")
    migrate_ojt_head_assignments()
