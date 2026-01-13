"""
Run database migration to add working hours columns to employers table
"""
from database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        # Add flexible work schedule column
        print("Adding work_schedule column...")
        conn.execute(text("ALTER TABLE employers ADD COLUMN IF NOT EXISTS work_schedule TEXT;"))
        conn.commit()
        print("✅ Added work_schedule column")
        
        # Remove old columns if they exist
        print("Removing old columns if they exist...")
        try:
            conn.execute(text("ALTER TABLE employers DROP COLUMN IF EXISTS work_start_time;"))
            conn.commit()
            print("  - Dropped work_start_time")
        except Exception as e:
            print(f"  - work_start_time already removed or doesn't exist")
        
        try:
            conn.execute(text("ALTER TABLE employers DROP COLUMN IF EXISTS work_end_time;"))
            conn.commit()
            print("  - Dropped work_end_time")
        except Exception as e:
            print(f"  - work_end_time already removed or doesn't exist")
        
        try:
            conn.execute(text("ALTER TABLE employers DROP COLUMN IF EXISTS work_days;"))
            conn.commit()
            print("  - Dropped work_days")
        except Exception as e:
            print(f"  - work_days already removed or doesn't exist")
        
        print("\n✅ Migration completed successfully!")
        print("The work_schedule column has been added to the employers table.")
        
except Exception as e:
    print(f"❌ Migration failed: {e}")
    import traceback
    traceback.print_exc()
