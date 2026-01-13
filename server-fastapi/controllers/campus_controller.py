from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import Campus
from schemas.campus import CampusCreate, CampusUpdate
from typing import Optional


def get_all_campuses(pageNo: int, pageSize: int, keyword: str, db: Session):
    """Get all campuses with pagination"""
    try:
        offset = (pageNo - 1) * pageSize
        
        query = db.query(Campus)
        if keyword:
            query = query.filter(Campus.campus_name.ilike(f"%{keyword}%"))
        
        total = query.count()
        campuses = query.offset(offset).limit(pageSize).all()
        
        campus_list = []
        for campus in campuses:
            campus_list.append({
                "campus_id": campus.campus_id,
                "campus_name": campus.campus_name,
                "is_extension": campus.is_extension,
                "parent_campus_id": campus.parent_campus_id,
                "parent_campus_name": campus.parent_campus.campus_name if campus.parent_campus else None,
                "status": campus.status.value if hasattr(campus.status, 'value') else campus.status,
                "created_at": campus.created_at.isoformat() if campus.created_at else None,
                "updated_at": campus.updated_at.isoformat() if campus.updated_at else None
            })
        
        return {
            "success": True,
            "data": {
                "campuses": campus_list,
                "pagination": {
                    "currentPage": pageNo,
                    "pageSize": pageSize,
                    "totalRecords": total,
                    "hasMore": len(campuses) == pageSize
                }
            },
            "message": "Campuses retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving campuses: {str(e)}"
        )


def add_campus(campus: CampusCreate, db: Session):
    """Add new campus"""
    try:
        if campus.is_extension and campus.parent_campus_id:
            parent = db.query(Campus).filter(Campus.campus_id == campus.parent_campus_id).first()
            if not parent:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent campus not found"
                )
        
        new_campus = Campus(
            campus_name=campus.campus_name,
            is_extension=campus.is_extension,
            parent_campus_id=campus.parent_campus_id if campus.is_extension else None,
            status=campus.status
        )
        
        db.add(new_campus)
        db.commit()
        db.refresh(new_campus)
        
        return {
            "success": True,
            "data": {
                "campus_id": new_campus.campus_id,
                "campus_name": new_campus.campus_name
            },
            "message": "Campus created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating campus: {str(e)}"
        )


def get_campus_by_id(campus_id: int, db: Session):
    """Get campus by ID"""
    campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
    
    if not campus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campus not found"
        )
    
    return {
        "success": True,
        "data": {
            "campus_id": campus.campus_id,
            "campus_name": campus.campus_name,
            "is_extension": campus.is_extension,
            "parent_campus_id": campus.parent_campus_id,
            "status": campus.status.value if hasattr(campus.status, 'value') else campus.status
        },
        "message": "Campus retrieved successfully"
    }


def update_campus(campus_id: int, campus_data: CampusUpdate, db: Session):
    """Update campus"""
    campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
    
    if not campus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campus not found"
        )
    
    try:
        campus.campus_name = campus_data.campus_name
        campus.is_extension = campus_data.is_extension
        campus.parent_campus_id = campus_data.parent_campus_id if campus_data.is_extension else None
        campus.status = campus_data.status
        
        db.commit()
        
        return {
            "success": True,
            "data": {"campus_id": campus_id},
            "message": "Campus updated successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating campus: {str(e)}"
        )


def toggle_campus_status(campus_id: int, db: Session):
    """Toggle campus status"""
    campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
    
    if not campus:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campus not found"
        )
    
    try:
        campus.status = "inactive" if campus.status == "active" else "active"
        db.commit()
        
        return {
            "success": True,
            "data": {"campus_id": campus_id, "new_status": campus.status},
            "message": "Campus status updated successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating campus status: {str(e)}"
        )


def get_main_campuses(db: Session):
    """Get all main campuses (non-extensions)"""
    try:
        campuses = db.query(Campus).filter(
            Campus.is_extension == False,
            Campus.status == "active"
        ).all()
        
        campus_list = [{
            "campus_id": c.campus_id,
            "campus_name": c.campus_name
        } for c in campuses]
        
        return {
            "success": True,
            "data": campus_list,
            "message": "Main campuses retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving main campuses: {str(e)}"
        )
