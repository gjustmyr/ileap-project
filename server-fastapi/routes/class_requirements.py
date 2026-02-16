from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from controllers import class_requirements_controller
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/class-requirements", tags=["Class Requirements"])


class AssignRequirementsRequest(BaseModel):
    requirement_template_ids: List[int]


class CopyRequirementsRequest(BaseModel):
    source_class_id: int
    target_class_id: int


@router.get("/class/{class_id}")
async def get_class_requirements(
    class_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all requirements assigned to a specific class"""
    return class_requirements_controller.get_class_requirements(class_id, db)


@router.get("/student/{student_id}/class/{class_id}")
async def get_student_class_requirements(
    student_id: int,
    class_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get requirements for a specific student in a specific class with submission status"""
    # Additional authorization check for students
    if token_data.get('role') == 'student':
        # Students can only view their own requirements
        if token_data.get('user_id') != student_id:
            # Need to check if the user_id matches the student's user_id
            from models import Student
            student = db.query(Student).filter(Student.student_id == student_id).first()
            if not student or student.user_id != token_data.get('user_id'):
                raise HTTPException(
                    status_code=403, 
                    detail="You can only view your own requirements"
                )
    
    return class_requirements_controller.get_student_class_requirements(student_id, class_id, db)


@router.post("/class/{class_id}/assign")
async def assign_requirements_to_class(
    class_id: int,
    request: AssignRequirementsRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Assign multiple requirement templates to a class (OJT Head/Coordinator only)"""
    # Check authorization - only OJT Head and Coordinators can assign requirements
    if token_data.get('role') not in ['ojt_head', 'ojt_coordinator']:
        raise HTTPException(
            status_code=403, 
            detail="Only OJT Head and Coordinators can assign requirements to classes"
        )
    
    return class_requirements_controller.assign_requirements_to_class(
        class_id, 
        request.requirement_template_ids, 
        db
    )


@router.delete("/class/{class_id}/remove")
async def remove_requirements_from_class(
    class_id: int,
    request: AssignRequirementsRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Remove requirement templates from a class (OJT Head/Coordinator only)"""
    # Check authorization
    if token_data.get('role') not in ['ojt_head', 'ojt_coordinator']:
        raise HTTPException(
            status_code=403, 
            detail="Only OJT Head and Coordinators can remove requirements from classes"
        )
    
    return class_requirements_controller.remove_requirements_from_class(
        class_id, 
        request.requirement_template_ids, 
        db
    )


@router.post("/copy-requirements")
async def copy_requirements_between_classes(
    request: CopyRequirementsRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Copy requirement assignments from one class to another (OJT Head/Coordinator only)"""
    # Check authorization
    if token_data.get('role') not in ['ojt_head', 'ojt_coordinator']:
        raise HTTPException(
            status_code=403, 
            detail="Only OJT Head and Coordinators can copy requirements between classes"
        )
    
    return class_requirements_controller.copy_requirements_between_classes(
        request.source_class_id, 
        request.target_class_id, 
        db
    )


# Superadmin routes for class requirements management
@router.get("/superadmin/class/{class_id}")
async def superadmin_get_class_requirements(
    class_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get class requirements (Superadmin only)"""
    if token_data.get('role') != 'superadmin':
        raise HTTPException(status_code=403, detail="Superadmin access required")
    
    return class_requirements_controller.get_class_requirements(class_id, db)


@router.post("/superadmin/class/{class_id}/assign")
async def superadmin_assign_requirements_to_class(
    class_id: int,
    request: AssignRequirementsRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Assign requirements to class (Superadmin only)"""
    if token_data.get('role') != 'superadmin':
        raise HTTPException(status_code=403, detail="Superadmin access required")
    
    return class_requirements_controller.assign_requirements_to_class(
        class_id, 
        request.requirement_template_ids, 
        db
    )


@router.delete("/superadmin/class/{class_id}/remove")
async def superadmin_remove_requirements_from_class(
    class_id: int,
    request: AssignRequirementsRequest,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Remove requirements from class (Superadmin only)"""
    if token_data.get('role') != 'superadmin':
        raise HTTPException(status_code=403, detail="Superadmin access required")
    
    return class_requirements_controller.remove_requirements_from_class(
        class_id, 
        request.requirement_template_ids, 
        db
    )