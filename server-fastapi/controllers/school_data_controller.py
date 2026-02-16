from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import (
    Campus, Department, Program, Major, Section,
    Class, ClassEnrollment, Student, RequirementSubmission,
    ClassRequirementTemplate, Internship, InternshipApplication
)
from sqlalchemy import text
from datetime import datetime


def delete_school_information_data(db: Session) -> dict:
    """
    Delete all school information data (Campus → Department → Program → Major → Section)
    while preserving Industries and Users
    """
    try:
        print("🗑️ Starting school information data deletion...")
        
        # Disable foreign key checks temporarily
        db.execute(text("SET session_replication_role = replica"))
        
        # Count existing data before deletion
        counts_before = {}
        tables_to_count = [
            ('sections', 'Sections'),
            ('majors', 'Majors'),
            ('programs', 'Programs'),
            ('departments', 'Departments'),
            ('campuses', 'Campuses'),
            ('classes', 'Classes'),
            ('class_enrollments', 'Class Enrollments'),
            ('students', 'Students'),
            ('requirement_submissions', 'Requirement Submissions'),
            ('class_requirement_templates', 'Class Requirement Templates'),
            ('internships', 'Internships'),
            ('internship_applications', 'Internship Applications')
        ]
        
        for table, name in tables_to_count:
            try:
                count = db.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
                counts_before[name] = count
                print(f"  📊 {name}: {count} records")
            except Exception as e:
                print(f"  ⚠️ Error counting {name}: {str(e)}")
                counts_before[name] = 0
        
        # Dele