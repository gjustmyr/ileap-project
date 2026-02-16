from sqlalchemy.orm import Session
from models import Section, Program
from schemas.section import SectionCreate, SectionUpdate
from sqlalchemy import or_
import math


def get_all_sections(pageNo: int, pageSize: int, keyword: str, program_id: int = None, db: Session = None):
    """Get all sections with pagination and filters"""
    try:
        offset = (pageNo - 1) * pageSize
        
        # Base query
        query = db.query(Section)
        
        # Filter by program_id if provided
        if program_id:
            query = query.filter(Section.program_id == program_id)
        
        # Filter by keyword if provided
        if keyword:
            query = query.filter(
                or_(
                    Section.section_name.ilike(f"%{keyword}%")
                )
            )
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        sections = query.offset(offset).limit(pageSize).all()
        
        # Format response with program info
        section_list = []
        for section in sections:
            program = db.query(Program).filter(Program.program_id == section.program_id).first()
            
            section_list.append({
                "section_id": section.section_id,
                "program_id": section.program_id,
                "program_name": program.program_name if program else None,
                "year_level": section.year_level,
                "section_name": section.section_name,
                "status": section.status,
                "created_at": section.created_at,
                "updated_at": section.updated_at
            })
        
        return {
            "success": True,
            "data": {
                "sections": section_list,
                "pagination": {
                    "currentPage": pageNo,
                    "pageSize": pageSize,
                    "totalRecords": total,
                    "totalPages": math.ceil(total / pageSize)
                }
            },
            "message": "Sections retrieved successfully"
        }
    except Exception as e:
        print(f"Error in get_all_sections: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving sections: {str(e)}"
        }


def add_section(section_data: SectionCreate, db: Session):
    """Add new section"""
    try:
        # Check if program exists
        program = db.query(Program).filter(Program.program_id == section_data.program_id).first()
        if not program:
            return {
                "success": False,
                "data": None,
                "message": "Program not found"
            }
        
        # Create new section
        new_section = Section(
            program_id=section_data.program_id,
            year_level=section_data.year_level,
            section_name=section_data.section_name,
            status=section_data.status
        )
        
        db.add(new_section)
        db.commit()
        db.refresh(new_section)
        
        return {
            "success": True,
            "data": {
                "section_id": new_section.section_id,
                "program_id": new_section.program_id,
                "year_level": new_section.year_level,
                "section_name": new_section.section_name,
                "status": new_section.status
            },
            "message": "Section added successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in add_section: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error adding section: {str(e)}"
        }


def get_section_by_id(section_id: int, db: Session):
    """Get section by ID"""
    try:
        section = db.query(Section).filter(Section.section_id == section_id).first()
        
        if not section:
            return {
                "success": False,
                "data": None,
                "message": "Section not found"
            }
        
        program = db.query(Program).filter(Program.program_id == section.program_id).first()
        
        return {
            "success": True,
            "data": {
                "section_id": section.section_id,
                "program_id": section.program_id,
                "program_name": program.program_name if program else None,
                "year_level": section.year_level,
                "section_name": section.section_name,
                "status": section.status
            },
            "message": "Section retrieved successfully"
        }
    except Exception as e:
        print(f"Error in get_section_by_id: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error retrieving section: {str(e)}"
        }


def update_section(section_id: int, section_data: SectionUpdate, db: Session):
    """Update section"""
    try:
        section = db.query(Section).filter(Section.section_id == section_id).first()
        
        if not section:
            return {
                "success": False,
                "data": None,
                "message": "Section not found"
            }
        
        # Check if program exists (if provided)
        if section_data.program_id:
            program = db.query(Program).filter(Program.program_id == section_data.program_id).first()
            if not program:
                return {
                    "success": False,
                    "data": None,
                    "message": "Program not found"
                }
        
        # Update fields
        if section_data.program_id is not None:
            section.program_id = section_data.program_id
        if section_data.year_level is not None:
            section.year_level = section_data.year_level
        if section_data.section_name is not None:
            section.section_name = section_data.section_name
        if section_data.status is not None:
            section.status = section_data.status
        
        db.commit()
        db.refresh(section)
        
        return {
            "success": True,
            "data": {
                "section_id": section.section_id,
                "program_id": section.program_id,
                "year_level": section.year_level,
                "section_name": section.section_name,
                "status": section.status
            },
            "message": "Section updated successfully"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in update_section: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error updating section: {str(e)}"
        }


def toggle_section_status(section_id: int, db: Session):
    """Toggle section status"""
    try:
        section = db.query(Section).filter(Section.section_id == section_id).first()
        
        if not section:
            return {
                "success": False,
                "data": None,
                "message": "Section not found"
            }
        
        # Toggle status
        section.status = "inactive" if section.status == "active" else "active"
        
        db.commit()
        db.refresh(section)
        
        return {
            "success": True,
            "data": {
                "section_id": section.section_id,
                "status": section.status
            },
            "message": f"Section status changed to {section.status}"
        }
    except Exception as e:
        db.rollback()
        print(f"Error in toggle_section_status: {str(e)}")
        return {
            "success": False,
            "data": None,
            "message": f"Error toggling section status: {str(e)}"
        }