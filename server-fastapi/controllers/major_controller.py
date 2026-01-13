from sqlalchemy.orm import Session
from models import Major, Program
from schemas.major import MajorCreate, MajorUpdate
from sqlalchemy import or_
import math


def get_all_majors(pageNo: int, pageSize: int, keyword: str, program_id: str, db: Session):
    """Get all majors with pagination and filters"""
    try:
        offset = (pageNo - 1) * pageSize
        
        # Base query
        query = db.query(Major)
        
        # Filter by program_id if provided
        if program_id:
            query = query.filter(Major.program_id == int(program_id))
        
        # Filter by keyword if provided
        if keyword:
            query = query.filter(
                or_(
                    Major.major_name.ilike(f"%{keyword}%"),
                    Major.abbrev.ilike(f"%{keyword}%")
                )
            )
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        majors = query.offset(offset).limit(pageSize).all()
        
        # Format response with program info
        major_list = []
        for major in majors:
            program = db.query(Program).filter(Program.program_id == major.program_id).first()
            major_list.append({
                "major_id": major.major_id,
                "program_id": major.program_id,
                "program_name": program.program_name if program else None,
                "major_name": major.major_name,
                "abbrev": major.abbrev,
                "status": major.status,
                "created_at": major.created_at,
                "updated_at": major.updated_at
            })
        
        return {
            "success": True,
            "data": {
                "majors": major_list,
                "pagination": {
                    "currentPage": pageNo,
                    "pageSize": pageSize,
                    "totalRecords": total,
                    "totalPages": math.ceil(total / pageSize)
                }
            },
            "message": "Majors retrieved successfully"
        }
    except Exception as e:
        print(f"Error in get_all_majors: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving majors: {str(e)}"
        }


def add_major(major_data: MajorCreate, db: Session):
    """Add new major"""
    try:
        # Check if program exists
        program = db.query(Program).filter(Program.program_id == major_data.program_id).first()
        if not program:
            return {
                "success": False,
                "data": None,
                "message": "Program not found"
            }
        
        # Create new major
        new_major = Major(
            program_id=major_data.program_id,
            major_name=major_data.major_name,
            abbrev=major_data.abbrev,
            status=major_data.status
        )
        
        db.add(new_major)
        db.commit()
        db.refresh(new_major)
        
        return {
            "success": True,
            "data": {
                "major_id": new_major.major_id,
                "program_id": new_major.program_id,
                "major_name": new_major.major_name,
                "abbrev": new_major.abbrev,
                "status": new_major.status
            },
            "message": "Major added successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in add_major: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error adding major: {str(e)}"
        }


def get_major_by_id(major_id: int, db: Session):
    """Get major by ID"""
    try:
        major = db.query(Major).filter(Major.major_id == major_id).first()
        
        if not major:
            return {
                "success": False,
                "data": None,
                "message": "Major not found"
            }
        
        program = db.query(Program).filter(Program.program_id == major.program_id).first()
        
        return {
            "success": True,
            "data": {
                "major_id": major.major_id,
                "program_id": major.program_id,
                "program_name": program.program_name if program else None,
                "major_name": major.major_name,
                "abbrev": major.abbrev,
                "status": major.status
            },
            "message": "Major retrieved successfully"
        }
    except Exception as e:
        print(f"Error in get_major_by_id: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving major: {str(e)}"
        }


def update_major(major_id: int, major_data: MajorUpdate, db: Session):
    """Update major"""
    try:
        major = db.query(Major).filter(Major.major_id == major_id).first()
        
        if not major:
            return {
                "success": False,
                "data": None,
                "message": "Major not found"
            }
        
        # Update fields
        if major_data.major_name is not None:
            major.major_name = major_data.major_name
        if major_data.program_id is not None:
            major.program_id = major_data.program_id
        if major_data.abbrev is not None:
            major.abbrev = major_data.abbrev
        if major_data.status is not None:
            major.status = major_data.status
        
        db.commit()
        db.refresh(major)
        
        return {
            "success": True,
            "data": {
                "major_id": major.major_id,
                "program_id": major.program_id,
                "major_name": major.major_name,
                "abbrev": major.abbrev,
                "status": major.status
            },
            "message": "Major updated successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in update_major: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error updating major: {str(e)}"
        }


def toggle_major_status(major_id: int, db: Session):
    """Toggle major status"""
    try:
        major = db.query(Major).filter(Major.major_id == major_id).first()
        
        if not major:
            return {
                "success": False,
                "data": None,
                "message": "Major not found"
            }
        
        # Toggle status
        major.status = "inactive" if major.status == "active" else "active"
        
        db.commit()
        db.refresh(major)
        
        return {
            "success": True,
            "data": {
                "major_id": major.major_id,
                "status": major.status
            },
            "message": f"Major status changed to {major.status}"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in toggle_major_status: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error toggling major status: {str(e)}"
        }
