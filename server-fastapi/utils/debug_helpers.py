"""
Debug helper functions for logging and diagnostics
"""

def log_matching_data_warnings(student, student_skills, internship, internship_skills):
    """
    Log warnings for missing or empty data in student and internship records
    
    Args:
        student: Student model instance
        student_skills: List of student skill names
        internship: Internship model instance
        internship_skills: List of internship skill names
    """
    print(f"\n🔍 DEBUG - Matching Data Check:")
    print(f"Student ID: {student.student_id}")
    
    # Check student data
    if not student_skills:
        print(f"  ⚠️  WARNING: Student has NO skills")
    if not student.program:
        print(f"  ⚠️  WARNING: Student program is None/empty")
    if not student.major:
        print(f"  ⚠️  WARNING: Student major is None/empty")
    if not student.department:
        print(f"  ⚠️  WARNING: Student department is None/empty")
    if not student.about:
        print(f"  ⚠️  WARNING: Student about is None/empty")
    
    # Check internship data
    print(f"Internship ID: {internship.internship_id}")
    if not internship_skills:
        print(f"  ⚠️  WARNING: Internship has NO required skills")
    if not internship.title:
        print(f"  ⚠️  WARNING: Internship title is None/empty")
    if not internship.full_description:
        print(f"  ⚠️  WARNING: Internship description is None/empty")
    if not internship.employer:
        print(f"  ⚠️  WARNING: Internship has NO employer")
    else:
        if not internship.employer.company_name:
            print(f"  ⚠️  WARNING: Employer company_name is None/empty")
        if not internship.employer.industry:
            print(f"  ⚠️  WARNING: Employer has NO industry")
        if not internship.employer.address:
            print(f"  ⚠️  WARNING: Employer address is None/empty")
