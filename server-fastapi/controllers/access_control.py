"""
Access Control Helper Functions
Centralized access control for role-based data filtering
"""

from sqlalchemy.orm import Session
from models import OJTHead, Campus, Department, Program
from typing import List


def get_ojt_head_campus_ids(db: Session, user_id: int) -> List[int]:
    """
    Get all campus IDs accessible to an OJT Head.
    Returns list of campus IDs (main campus + its extension campuses).
    
    Args:
        db: Database session
        user_id: The user_id of the OJT Head
        
    Returns:
        List of campus IDs the OJT Head has access to
    """
    ojt_head_records = db.query(OJTHead).filter(OJTHead.user_id == user_id).all()
    return [record.campus_id for record in ojt_head_records]


def get_ojt_head_department_ids(db: Session, user_id: int) -> List[int]:
    """
    Get all department IDs accessible to an OJT Head.
    Returns departments in the OJT Head's assigned campuses.
    
    Args:
        db: Database session
        user_id: The user_id of the OJT Head
        
    Returns:
        List of department IDs the OJT Head has access to
    """
    campus_ids = get_ojt_head_campus_ids(db, user_id)
    if not campus_ids:
        return []
    
    departments = db.query(Department.department_id).filter(
        Department.campus_id.in_(campus_ids),
        Department.status == "active"
    ).all()
    
    return [dept.department_id for dept in departments]


def get_ojt_head_program_ids(db: Session, user_id: int) -> List[int]:
    """
    Get all program IDs accessible to an OJT Head.
    Returns programs in the OJT Head's accessible departments.
    
    Args:
        db: Database session
        user_id: The user_id of the OJT Head
        
    Returns:
        List of program IDs the OJT Head has access to
    """
    department_ids = get_ojt_head_department_ids(db, user_id)
    if not department_ids:
        return []
    
    programs = db.query(Program.program_id).filter(
        Program.department_id.in_(department_ids),
        Program.status == "active"
    ).all()
    
    return [prog.program_id for prog in programs]


def validate_ojt_head_campus_access(db: Session, user_id: int, campus_id: int) -> bool:
    """
    Validate if an OJT Head has access to a specific campus.
    
    Args:
        db: Database session
        user_id: The user_id of the OJT Head
        campus_id: The campus_id to check access for
        
    Returns:
        True if OJT Head has access, False otherwise
    """
    accessible_campuses = get_ojt_head_campus_ids(db, user_id)
    return campus_id in accessible_campuses


def validate_ojt_head_department_access(db: Session, user_id: int, department_id: int) -> bool:
    """
    Validate if an OJT Head has access to a specific department.
    
    Args:
        db: Database session
        user_id: The user_id of the OJT Head
        department_id: The department_id to check access for
        
    Returns:
        True if OJT Head has access, False otherwise
    """
    accessible_departments = get_ojt_head_department_ids(db, user_id)
    return department_id in accessible_departments


def validate_ojt_head_program_access(db: Session, user_id: int, program_id: int) -> bool:
    """
    Validate if an OJT Head has access to a specific program.
    
    Args:
        db: Database session
        user_id: The user_id of the OJT Head
        program_id: The program_id to check access for
        
    Returns:
        True if OJT Head has access, False otherwise
    """
    accessible_programs = get_ojt_head_program_ids(db, user_id)
    return program_id in accessible_programs


def get_campus_with_extensions(db: Session, main_campus_id: int) -> List[int]:
    """
    Get a main campus and all its extension campuses.
    
    Args:
        db: Database session
        main_campus_id: The campus_id of the main campus
        
    Returns:
        List of campus IDs (main + extensions)
    """
    # Get the main campus
    main_campus = db.query(Campus).filter(Campus.campus_id == main_campus_id).first()
    
    if not main_campus:
        return []
    
    # If it's an extension campus, get its parent and siblings
    if main_campus.is_extension and main_campus.parent_campus_id:
        parent_id = main_campus.parent_campus_id
        extensions = db.query(Campus.campus_id).filter(
            Campus.parent_campus_id == parent_id,
            Campus.status == "active"
        ).all()
        return [parent_id] + [ext.campus_id for ext in extensions]
    
    # If it's a main campus, get it and its extensions
    extensions = db.query(Campus.campus_id).filter(
        Campus.parent_campus_id == main_campus_id,
        Campus.status == "active"
    ).all()
    
    return [main_campus_id] + [ext.campus_id for ext in extensions]
