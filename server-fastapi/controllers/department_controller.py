from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Department
from schemas.department import DepartmentCreate, DepartmentUpdate
from typing import Optional


def get_all_departments(pageNo: int, pageSize: int, keyword: str, campus_id: Optional[int], db: Session):
    """Get all departments with pagination and filters"""
    try:
        print(f"DEBUG: campus_id received: {campus_id}, type: {type(campus_id)}")
        offset = (pageNo - 1) * pageSize
        
        query = db.query(Department)
        
        if keyword:
            query = query.filter(Department.department_name.ilike(f"%{keyword}%"))
        
        if campus_id:
            print(f"DEBUG: Filtering by campus_id: {campus_id}")
            query = query.filter(Department.campus_id == campus_id)
        else:
            print("DEBUG: No campus_id filter applied")
        
        total = query.count()
        print(f"DEBUG: Total departments found: {total}")
        departments = query.offset(offset).limit(pageSize).all()
        
        dept_list = []
        for dept in departments:
            dept_list.append({
                "department_id": dept.department_id,
                "campus_id": dept.campus_id,
                "campus_name": dept.campus.campus_name if dept.campus else None,
                "department_name": dept.department_name,
                "abbrev": dept.abbrev,
                "dean_name": dept.dean_name,
                "dean_email": dept.dean_email,
                "dean_contact": dept.dean_contact,
                "status": dept.status.value if hasattr(dept.status, 'value') else dept.status,
                "created_at": dept.created_at.isoformat() if dept.created_at else None,
                "updated_at": dept.updated_at.isoformat() if dept.updated_at else None
            })
        
        return {
            "success": True,
            "data": {
                "departments": dept_list,
                "pagination": {
                    "currentPage": pageNo,
                    "pageSize": pageSize,
                    "totalRecords": total,
                    "hasMore": len(departments) == pageSize
                }
            },
            "message": "Departments retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving departments: {str(e)}"
        )


def add_department(department: DepartmentCreate, db: Session):
    """Add new department"""
    try:
        new_dept = Department(
            campus_id=department.campus_id,
            department_name=department.department_name,
            abbrev=department.abbrev,
            dean_name=department.dean_name,
            dean_email=department.dean_email,
            dean_contact=department.dean_contact,
            status=department.status
        )
        
        db.add(new_dept)
        db.commit()
        db.refresh(new_dept)
        
        return {
            "success": True,
            "data": {
                "department_id": new_dept.department_id,
                "department_name": new_dept.department_name
            },
            "message": "Department created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating department: {str(e)}"
        )


def get_department_by_id(department_id: int, db: Session):
    """Get department by ID"""
    dept = db.query(Department).filter(Department.department_id == department_id).first()
    
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    return {
        "success": True,
        "data": {
            "department_id": dept.department_id,
            "campus_id": dept.campus_id,
            "campus_name": dept.campus.campus_name if dept.campus else None,
            "department_name": dept.department_name,
            "abbrev": dept.abbrev,
            "dean_name": dept.dean_name,
            "dean_email": dept.dean_email,
            "dean_contact": dept.dean_contact,
            "status": dept.status.value if hasattr(dept.status, 'value') else dept.status
        },
        "message": "Department retrieved successfully"
    }


def update_department(department_id: int, dept_data: DepartmentUpdate, db: Session):
    """Update department"""
    dept = db.query(Department).filter(Department.department_id == department_id).first()
    
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    try:
        dept.department_name = dept_data.department_name
        dept.abbrev = dept_data.abbrev
        dept.dean_name = dept_data.dean_name
        dept.dean_email = dept_data.dean_email
        dept.dean_contact = dept_data.dean_contact
        dept.status = dept_data.status
        
        db.commit()
        
        return {
            "success": True,
            "data": {"department_id": department_id},
            "message": "Department updated successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating department: {str(e)}"
        )


def toggle_department_status(department_id: int, db: Session):
    """Toggle department status"""
    dept = db.query(Department).filter(Department.department_id == department_id).first()
    
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    try:
        dept.status = "inactive" if dept.status == "active" else "active"
        db.commit()
        
        return {
            "success": True,
            "data": {"department_id": department_id, "new_status": dept.status},
            "message": "Department status updated successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating department status: {str(e)}"
        )
