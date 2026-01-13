from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import RequirementTemplate
from middleware.auth import get_current_user
from datetime import datetime
import os
from uuid import uuid4
from config import get_upload_path, get_upload_url

router = APIRouter(prefix="/api/requirement-templates", tags=["Requirement Templates"])


@router.get("")
def get_all_requirement_templates(
    type: Optional[str] = None,  # Filter by 'pre' or 'post'
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all requirement templates (filtered by role and accessible_to)"""
    # Filter based on role
    role = current_user.get('role')
    
    query = db.query(RequirementTemplate)
    
    if type:
        query = query.filter(RequirementTemplate.type == type)
    
    # Filter based on accessible_to field
    if role == 'employer':
        # Employers can only see templates with 'employer' in accessible_to
        query = query.filter(RequirementTemplate.accessible_to.like('%employer%'))
    elif role == 'ojt_coordinator':
        # OJT Coordinators see templates with 'coordinator' in accessible_to
        query = query.filter(RequirementTemplate.accessible_to.like('%coordinator%'))
    elif role == 'student':
        # Students see templates with 'student' in accessible_to
        query = query.filter(RequirementTemplate.accessible_to.like('%student%'))
    # OJT Head sees all templates (no filter)
    
    templates = query.order_by(RequirementTemplate.order_index).all()
    
    return {
        "status": "success",
        "data": [
            {
                "template_id": t.template_id,
                "requirement_id": t.requirement_id,
                "title": t.title,
                "description": t.description,
                "type": t.type,
                "template_url": t.template_url,
                "is_required": t.is_required,
                "order_index": t.order_index,
                "accessible_to": t.accessible_to,
                "created_at": t.created_at.isoformat() if t.created_at else None,
                "updated_at": t.updated_at.isoformat() if t.updated_at else None
            }
            for t in templates
        ]
    }


@router.get("/{template_id}")
def get_requirement_template(
    template_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific requirement template"""
    template = db.query(RequirementTemplate).filter(
        RequirementTemplate.template_id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return {
        "status": "success",
        "data": {
            "template_id": template.template_id,
            "requirement_id": template.requirement_id,
            "title": template.title,
            "description": template.description,
            "type": template.type,
            "template_url": template.template_url,
            "is_required": template.is_required,
            "order_index": template.order_index,
            "accessible_to": template.accessible_to
        }
    }


@router.post("")
async def create_requirement_template(
    requirement_id: int = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    type: str = Form(...),
    is_required: bool = Form(True),
    order_index: int = Form(...),
    accessible_to: str = Form("student,coordinator"),
    template_file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new requirement template (OJT Head only)"""
    if current_user.get('role') != 'ojt_head':
        raise HTTPException(status_code=403, detail="Only OJT Head can create templates")
    
    # Check if requirement_id already exists
    existing = db.query(RequirementTemplate).filter(
        RequirementTemplate.requirement_id == requirement_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Requirement ID already exists")
    
    # Handle file upload
    template_url = None
    if template_file:
        file_ext = os.path.splitext(template_file.filename)[1]
        filename = f"{uuid4()}{file_ext}"
        file_path = get_upload_path("requirement_templates", filename)
        
        content = await template_file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        template_url = get_upload_url("requirement_templates", filename)
    
    # Create template
    new_template = RequirementTemplate(
        requirement_id=requirement_id,
        title=title,
        description=description,
        type=type,
        template_url=template_url,
        is_required=is_required,
        order_index=order_index,
        accessible_to=accessible_to
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    return {
        "status": "success",
        "message": "Requirement template created successfully",
        "data": {
            "template_id": new_template.template_id,
            "requirement_id": new_template.requirement_id,
            "title": new_template.title
        }
    }


@router.put("/{template_id}")
async def update_requirement_template(
    template_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    is_required: Optional[bool] = Form(None),
    order_index: Optional[int] = Form(None),
    accessible_to: Optional[str] = Form(None),
    template_file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a requirement template (OJT Head only)"""
    if current_user.get('role') != 'ojt_head':
        raise HTTPException(status_code=403, detail="Only OJT Head can update templates")
    
    template = db.query(RequirementTemplate).filter(
        RequirementTemplate.template_id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Update fields
    if title is not None:
        template.title = title
    if description is not None:
        template.description = description
    if type is not None:
        template.type = type
    if is_required is not None:
        template.is_required = is_required
    if order_index is not None:
        template.order_index = order_index
    if accessible_to is not None:
        template.accessible_to = accessible_to
    
    # Handle file upload
    if template_file:
        file_ext = os.path.splitext(template_file.filename)[1]
        filename = f"{uuid4()}{file_ext}"
        file_path = get_upload_path("requirement_templates", filename)
        
        content = await template_file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        template.template_url = get_upload_url("requirement_templates", filename)
    
    template.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(template)
    
    return {
        "status": "success",
        "message": "Requirement template updated successfully",
        "data": {
            "template_id": template.template_id,
            "title": template.title
        }
    }


@router.delete("/{template_id}")
def delete_requirement_template(
    template_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a requirement template (OJT Head only)"""
    if current_user.get('role') != 'ojt_head':
        raise HTTPException(status_code=403, detail="Only OJT Head can delete templates")
    
    template = db.query(RequirementTemplate).filter(
        RequirementTemplate.template_id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    db.delete(template)
    db.commit()
    
    return {
        "status": "success",
        "message": "Requirement template deleted successfully"
    }
