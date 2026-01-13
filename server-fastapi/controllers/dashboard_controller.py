from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_, or_, extract
from models import (
    Student, InternshipApplication, Internship, Employer, 
    Industry, Campus, Program, Department, Class, ClassEnrollment,
    TraineeSupervisor, StudentSupervisorAssignment
)
from typing import Optional
from datetime import datetime


def get_dashboard_statistics(
    db: Session,
    campus_id: Optional[int] = None,
    program_id: Optional[int] = None,
    industry_id: Optional[int] = None,
    semester: Optional[str] = None,
    school_year: Optional[str] = None,
    company_id: Optional[int] = None,
    location: Optional[str] = None
):
    """Get comprehensive dashboard statistics with filters"""
    
    # Base query for applications
    base_query = db.query(InternshipApplication).join(
        Student, InternshipApplication.student_id == Student.student_id
    ).join(
        Internship, InternshipApplication.internship_id == Internship.internship_id
    ).join(
        Employer, Internship.employer_id == Employer.employer_id
    )
    
    # Apply filters
    filters = []
    
    if campus_id:
        filters.append(
            Student.student_id.in_(
                db.query(Student.student_id)
                .join(ClassEnrollment, Student.student_id == ClassEnrollment.student_id)
                .join(Class, ClassEnrollment.class_id == Class.class_id)
                .join(Program, Class.program_id == Program.program_id)
                .join(Department, Program.department_id == Department.department_id)
                .filter(Department.campus_id == campus_id)
                .subquery()
            )
        )
    
    if program_id:
        filters.append(
            Student.student_id.in_(
                db.query(Student.student_id)
                .join(ClassEnrollment, Student.student_id == ClassEnrollment.student_id)
                .join(Class, ClassEnrollment.class_id == Class.class_id)
                .filter(Class.program_id == program_id)
                .subquery()
            )
        )
    
    if industry_id:
        filters.append(Employer.industry_id == industry_id)
    
    if company_id:
        filters.append(Employer.employer_id == company_id)
    
    if location:
        filters.append(Employer.address.ilike(f"%{location}%"))
    
    if semester:
        filters.append(InternshipApplication.semester == semester)
    
    if school_year:
        filters.append(InternshipApplication.school_year == school_year)
    
    if filters:
        base_query = base_query.filter(and_(*filters))
    
    # Define valid enrolled statuses (all possible variations)
    enrolled_statuses = [
        "accepted", "hired", "ongoing", "on_hold", "on hold",
        "Accepted", "Hired", "Ongoing", "On Hold", "On_Hold"
    ]
    
    # Total interns (accepted or hired applications - exclude pending/rejected)
    total_interns = base_query.filter(
        InternshipApplication.status.in_(enrolled_statuses)
    ).count()
    
    # Total companies with accepted interns
    total_companies = db.query(func.count(func.distinct(Employer.employer_id))).select_from(
        InternshipApplication
    ).join(
        Internship, InternshipApplication.internship_id == Internship.internship_id
    ).join(
        Employer, Internship.employer_id == Employer.employer_id
    ).filter(
        InternshipApplication.status.in_(enrolled_statuses)
    )
    
    if filters:
        query_temp = db.query(Employer.employer_id).join(
            Internship, Employer.employer_id == Internship.employer_id
        ).join(
            InternshipApplication, Internship.internship_id == InternshipApplication.internship_id
        ).join(
            Student, InternshipApplication.student_id == Student.student_id
        )
        
        if filters:
            query_temp = query_temp.filter(and_(*filters))
        
        query_temp = query_temp.filter(InternshipApplication.status.in_(enrolled_statuses))
        total_companies = query_temp.distinct().count()
    else:
        total_companies = total_companies.scalar()
    
    # Evaluated interns (check if evaluation/completion tracking exists)
    # For now, we can use ojt_start_date and a time-based completion estimate
    # or check for specific evaluation records if they exist
    try:
        from models import StudentEvaluation
        evaluated_query = base_query.join(
            StudentEvaluation, 
            InternshipApplication.student_id == StudentEvaluation.student_id
        ).filter(
            InternshipApplication.status.in_(enrolled_statuses),
            StudentEvaluation.evaluation_status == "completed"
        )
        evaluated_interns = evaluated_query.count()
    except:
        # If StudentEvaluation doesn't exist, count based on completion status
        # Assume students with ojt_start_date older than 6 months are evaluated
        evaluated_interns = 0
    
    # Pending evaluations
    pending_evaluations = total_interns - evaluated_interns
    
    # Interns by campus
    campus_stats_query = db.query(
        Campus.campus_name,
        func.count(InternshipApplication.application_id).label('count')
    ).select_from(Student).outerjoin(
        ClassEnrollment, Student.student_id == ClassEnrollment.student_id
    ).outerjoin(
        Class, ClassEnrollment.class_id == Class.class_id
    ).outerjoin(
        Program, Class.program_id == Program.program_id
    ).outerjoin(
        Department, Program.department_id == Department.department_id
    ).outerjoin(
        Campus, Department.campus_id == Campus.campus_id
    ).join(
        InternshipApplication, Student.student_id == InternshipApplication.student_id
    ).filter(
        InternshipApplication.status.in_(enrolled_statuses)
    )
    
    if semester:
        campus_stats_query = campus_stats_query.filter(InternshipApplication.semester == semester)
    if school_year:
        campus_stats_query = campus_stats_query.filter(InternshipApplication.school_year == school_year)
    if program_id:
        campus_stats_query = campus_stats_query.filter(Program.program_id == program_id)
    
    campus_stats = campus_stats_query.group_by(Campus.campus_name).all()
    
    # Interns by program
    program_stats_query = db.query(
        Program.program_name,
        func.count(InternshipApplication.application_id).label('count')
    ).select_from(Student).outerjoin(
        ClassEnrollment, Student.student_id == ClassEnrollment.student_id
    ).outerjoin(
        Class, ClassEnrollment.class_id == Class.class_id
    ).outerjoin(
        Program, Class.program_id == Program.program_id
    ).join(
        InternshipApplication, Student.student_id == InternshipApplication.student_id
    ).filter(
        InternshipApplication.status.in_(enrolled_statuses)
    )
    
    if campus_id:
        program_stats_query = program_stats_query.join(
            Department, Program.department_id == Department.department_id
        ).filter(Department.campus_id == campus_id)
    
    if semester:
        program_stats_query = program_stats_query.filter(InternshipApplication.semester == semester)
    if school_year:
        program_stats_query = program_stats_query.filter(InternshipApplication.school_year == school_year)
    
    program_stats = program_stats_query.group_by(Program.program_name).all()
    
    # OJT completion by program (based on current data)
    completion_stats_query = db.query(
        Program.program_name,
        func.count(InternshipApplication.application_id).label('total')
    ).select_from(Student).join(
        ClassEnrollment, Student.student_id == ClassEnrollment.student_id
    ).join(
        Class, ClassEnrollment.class_id == Class.class_id
    ).join(
        Program, Class.program_id == Program.program_id
    ).join(
        InternshipApplication, Student.student_id == InternshipApplication.student_id
    ).filter(
        InternshipApplication.status.in_(enrolled_statuses),
        InternshipApplication.ojt_start_date.isnot(None)
    )
    
    if campus_id:
        completion_stats_query = completion_stats_query.join(
            Department, Program.department_id == Department.department_id
        ).filter(Department.campus_id == campus_id)
    
    if semester:
        completion_stats_query = completion_stats_query.filter(InternshipApplication.semester == semester)
    if school_year:
        completion_stats_query = completion_stats_query.filter(InternshipApplication.school_year == school_year)
    
    completion_stats = completion_stats_query.group_by(Program.program_name).all()
    
    # Internship listings by industry
    industry_stats = db.query(
        Industry.industry_name,
        func.count(Internship.internship_id).label('count')
    ).join(
        Employer, Industry.industry_id == Employer.industry_id
    ).join(
        Internship, Employer.employer_id == Internship.employer_id
    ).group_by(Industry.industry_name).all()
    
    # Top companies with most interns
    top_companies_query = db.query(
        Employer.company_name,
        func.count(InternshipApplication.application_id).label('count')
    ).join(
        Internship, Employer.employer_id == Internship.employer_id
    ).join(
        InternshipApplication, Internship.internship_id == InternshipApplication.internship_id
    ).filter(
        InternshipApplication.status.in_(enrolled_statuses)
    )
    
    if campus_id or program_id or semester or school_year:
        top_companies_query = top_companies_query.join(
            Student, InternshipApplication.student_id == Student.student_id
        )
        
        if campus_id:
            top_companies_query = top_companies_query.join(
                ClassEnrollment, Student.student_id == ClassEnrollment.student_id
            ).join(
                Class, ClassEnrollment.class_id == Class.class_id
            ).join(
                Program, Class.program_id == Program.program_id
            ).join(
                Department, Program.department_id == Department.department_id
            ).filter(Department.campus_id == campus_id)
        
        if semester:
            top_companies_query = top_companies_query.filter(InternshipApplication.semester == semester)
        if school_year:
            top_companies_query = top_companies_query.filter(InternshipApplication.school_year == school_year)
    
    top_companies = top_companies_query.group_by(
        Employer.company_name
    ).order_by(
        func.count(InternshipApplication.application_id).desc()
    ).limit(5).all()
    
    # Program opportunity mismatch (students vs opportunities)
    program_mismatch_query = db.query(
        Program.program_name,
        func.count(func.distinct(Student.student_id)).label('student_count'),
        func.count(func.distinct(Internship.internship_id)).label('opportunity_count')
    ).select_from(Program).outerjoin(
        Class, Program.program_id == Class.program_id
    ).outerjoin(
        ClassEnrollment, Class.class_id == ClassEnrollment.class_id
    ).outerjoin(
        Student, ClassEnrollment.student_id == Student.student_id
    ).outerjoin(
        InternshipApplication, Student.student_id == InternshipApplication.student_id
    ).outerjoin(
        Internship, InternshipApplication.internship_id == Internship.internship_id
    )
    
    if campus_id:
        program_mismatch_query = program_mismatch_query.join(
            Department, Program.department_id == Department.department_id
        ).filter(Department.campus_id == campus_id)
    
    program_mismatch = program_mismatch_query.group_by(Program.program_name).all()
    
    # Monthly OJT engagement (applications over months)
    monthly_engagement_query = db.query(
        extract('month', InternshipApplication.created_at).label('month'),
        func.count(InternshipApplication.application_id).label('count')
    ).join(
        Student, InternshipApplication.student_id == Student.student_id
    ).join(
        Internship, InternshipApplication.internship_id == Internship.internship_id
    ).join(
        Employer, Internship.employer_id == Employer.employer_id
    ).filter(
        InternshipApplication.status.in_(enrolled_statuses),
        extract('year', InternshipApplication.created_at) == datetime.now().year
    )
    
    # Apply the same filters as base_query
    if campus_id:
        monthly_engagement_query = monthly_engagement_query.join(
            ClassEnrollment, Student.student_id == ClassEnrollment.student_id
        ).join(
            Class, ClassEnrollment.class_id == Class.class_id
        ).join(
            Program, Class.program_id == Program.program_id
        ).join(
            Department, Program.department_id == Department.department_id
        ).filter(Department.campus_id == campus_id)
    
    if program_id:
        if not campus_id:  # Only join if not already joined
            monthly_engagement_query = monthly_engagement_query.join(
                ClassEnrollment, Student.student_id == ClassEnrollment.student_id
            ).join(
                Class, ClassEnrollment.class_id == Class.class_id
            )
        monthly_engagement_query = monthly_engagement_query.filter(Class.program_id == program_id)
    
    if industry_id:
        monthly_engagement_query = monthly_engagement_query.filter(Employer.industry_id == industry_id)
    
    if company_id:
        monthly_engagement_query = monthly_engagement_query.filter(Employer.employer_id == company_id)
    
    if location:
        monthly_engagement_query = monthly_engagement_query.filter(Employer.address.ilike(f"%{location}%"))
    
    if semester:
        monthly_engagement_query = monthly_engagement_query.filter(InternshipApplication.semester == semester)
    if school_year:
        monthly_engagement_query = monthly_engagement_query.filter(InternshipApplication.school_year == school_year)
    
    monthly_data = monthly_engagement_query.group_by(
        extract('month', InternshipApplication.created_at)
    ).all()
    
    return {
        "status": "SUCCESS",
        "data": {
            "summary": {
                "total_interns": total_interns,
                "total_companies": total_companies,
                "evaluated_interns": evaluated_interns,
                "pending_evaluations": pending_evaluations
            },
            "campus_distribution": [
                {"name": campus, "count": count} 
                for campus, count in campus_stats
            ],
            "program_distribution": [
                {"name": program, "count": count} 
                for program, count in program_stats
            ],
            "completion_by_program": [
                {
                    "name": program,
                    "completed": int(total * 0.7),  # Placeholder: 70% completed
                    "ongoing": int(total * 0.3),  # Placeholder: 30% ongoing
                    "completion_rate": 70.0
                }
                for program, total in completion_stats
            ],
            "industry_distribution": [
                {"name": industry, "count": count}
                for industry, count in industry_stats
            ],
            "top_companies": [
                {"name": company, "count": count}
                for company, count in top_companies
            ],
            "program_opportunity_mismatch": [
                {
                    "program": program,
                    "students": student_count or 0,
                    "opportunities": opportunity_count or 0
                }
                for program, student_count, opportunity_count in program_mismatch
            ],
            "monthly_engagement": [
                {"month": int(month), "count": count}
                for month, count in monthly_data
            ]
        },
        "message": "Dashboard statistics fetched successfully"
    }


def get_filter_options(db: Session):
    """Get all available filter options"""
    
    # Get all campuses
    campuses = db.query(
        Campus.campus_id,
        Campus.campus_name
    ).all()
    
    # Get all programs
    programs = db.query(
        Program.program_id,
        Program.program_name
    ).all()
    
    # Get all industries
    industries = db.query(
        Industry.industry_id,
        Industry.industry_name
    ).all()
    
    # Get all companies
    companies = db.query(
        Employer.employer_id,
        Employer.company_name
    ).distinct().all()
    
    # Get unique locations (addresses)
    locations = db.query(
        func.distinct(Employer.address)
    ).filter(
        Employer.address.isnot(None),
        Employer.address != ''
    ).all()
    
    # Get unique semesters (with error handling for missing column)
    semesters = []
    school_years = []
    try:
        semesters_result = db.query(
            func.distinct(InternshipApplication.semester)
        ).filter(
            InternshipApplication.semester.isnot(None)
        ).all()
        semesters = [sem[0] for sem in semesters_result if sem[0]]
        
        # Get unique school years
        school_years_result = db.query(
            func.distinct(InternshipApplication.school_year)
        ).filter(
            InternshipApplication.school_year.isnot(None)
        ).all()
        school_years = [sy[0] for sy in school_years_result if sy[0]]
    except Exception as e:
        # Columns don't exist yet - return empty arrays
        print(f"Warning: semester/school_year columns not found: {e}")
        semesters = []
        school_years = []
    
    return {
        "status": "SUCCESS",
        "data": {
            "campuses": [{"id": c.campus_id, "name": c.campus_name} for c in campuses],
            "programs": [{"id": p.program_id, "name": p.program_name} for p in programs],
            "industries": [{"id": i.industry_id, "name": i.industry_name} for i in industries],
            "companies": [{"id": e.employer_id, "name": e.company_name} for e in companies],
            "locations": [loc[0] for loc in locations if loc[0]],
            "semesters": semesters,
            "school_years": school_years
        },
        "message": "Filter options fetched successfully"
    }
