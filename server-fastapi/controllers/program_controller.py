from sqlalchemy.orm import Session
from models import Program, Department
from schemas.program import ProgramCreate, ProgramUpdate
from sqlalchemy import or_
import math


def get_all_programs(pageNo: int, pageSize: int, keyword: str, department_id: str, db: Session):
    """Get all programs with pagination and filters"""
    try:
        offset = (pageNo - 1) * pageSize
        
        # Base query
        query = db.query(Program)
        
        # Filter by department_id if provided
        if department_id:
            query = query.filter(Program.department_id == int(department_id))
        
        # Filter by keyword if provided
        if keyword:
            query = query.filter(
                or_(
                    Program.program_name.ilike(f"%{keyword}%"),
                    Program.abbrev.ilike(f"%{keyword}%")
                )
            )
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        programs = query.offset(offset).limit(pageSize).all()
        
        # Format response with department info
        program_list = []
        for program in programs:
            department = db.query(Department).filter(Department.department_id == program.department_id).first()
            program_list.append({
                "program_id": program.program_id,
                "department_id": program.department_id,
                "department_name": department.department_name if department else None,
                "program_name": program.program_name,
                "abbrev": program.abbrev,
                "status": program.status,
                "created_at": program.created_at,
                "updated_at": program.updated_at
            })
        
        return {
            "success": True,
            "data": {
                "programs": program_list,
                "pagination": {
                    "currentPage": pageNo,
                    "pageSize": pageSize,
                    "totalRecords": total,
                    "totalPages": math.ceil(total / pageSize)
                }
            },
            "message": "Programs retrieved successfully"
        }
    except Exception as e:
        print(f"Error in get_all_programs: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving programs: {str(e)}"
        }


def add_program(program_data: ProgramCreate, db: Session):
    """Add new program"""
    try:
        # Check if department exists
        department = db.query(Department).filter(Department.department_id == program_data.department_id).first()
        if not department:
            return {
                "success": False,
                "data": None,
                "message": "Department not found"
            }
        
        # Create new program
        new_program = Program(
            department_id=program_data.department_id,
            program_name=program_data.program_name,
            abbrev=program_data.abbrev,
            status=program_data.status
        )
        
        db.add(new_program)
        db.commit()
        db.refresh(new_program)
        
        return {
            "success": True,
            "data": {
                "program_id": new_program.program_id,
                "department_id": new_program.department_id,
                "program_name": new_program.program_name,
                "abbrev": new_program.abbrev,
                "status": new_program.status
            },
            "message": "Program added successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in add_program: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error adding program: {str(e)}"
        }


def get_program_by_id(program_id: int, db: Session):
    """Get program by ID"""
    try:
        program = db.query(Program).filter(Program.program_id == program_id).first()
        
        if not program:
            return {
                "success": False,
                "data": None,
                "message": "Program not found"
            }
        
        department = db.query(Department).filter(Department.department_id == program.department_id).first()
        
        return {
            "success": True,
            "data": {
                "program_id": program.program_id,
                "department_id": program.department_id,
                "department_name": department.department_name if department else None,
                "program_name": program.program_name,
                "abbrev": program.abbrev,
                "status": program.status
            },
            "message": "Program retrieved successfully"
        }
    except Exception as e:
        print(f"Error in get_program_by_id: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving program: {str(e)}"
        }


def update_program(program_id: int, program_data: ProgramUpdate, db: Session):
    """Update program"""
    try:
        program = db.query(Program).filter(Program.program_id == program_id).first()
        
        if not program:
            return {
                "success": False,
                "data": None,
                "message": "Program not found"
            }
        
        # Update fields
        if program_data.program_name is not None:
            program.program_name = program_data.program_name
        if program_data.department_id is not None:
            program.department_id = program_data.department_id
        if program_data.abbrev is not None:
            program.abbrev = program_data.abbrev
        if program_data.status is not None:
            program.status = program_data.status
        
        db.commit()
        db.refresh(program)
        
        return {
            "success": True,
            "data": {
                "program_id": program.program_id,
                "department_id": program.department_id,
                "program_name": program.program_name,
                "abbrev": program.abbrev,
                "status": program.status
            },
            "message": "Program updated successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in update_program: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error updating program: {str(e)}"
        }


def toggle_program_status(program_id: int, db: Session):
    """Toggle program status"""
    try:
        program = db.query(Program).filter(Program.program_id == program_id).first()
        
        if not program:
            return {
                "success": False,
                "data": None,
                "message": "Program not found"
            }
        
        # Toggle status
        program.status = "inactive" if program.status == "active" else "active"
        
        db.commit()
        db.refresh(program)
        
        return {
            "success": True,
            "data": {
                "program_id": program.program_id,
                "status": program.status
            },
            "message": f"Program status changed to {program.status}"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in toggle_program_status: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error toggling program status: {str(e)}"
        }
