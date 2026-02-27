"""
OJT Head Portal Routes
All endpoints for OJT Head portal with /api/ojt-head prefix
Only accessible by users with 'ojt_head' role
"""
from fastapi import APIRouter, Depends, status, Query, Form, File, UploadFile
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from middleware.auth import verify_token
from config import get_upload_path, get_upload_url
from controllers import (
    dashboard_controller,
    employer_controller,
    internship_controller,
    ojt_coordinator_controller,
    ojt_head_controller
)

router = APIRouter(prefix="/api/ojt-head", tags=["OJT Head Portal"])


def verify_ojt_head_role(token_data: dict = Depends(verify_token)):
    """Verify that the user has ojt_head role"""
    if token_data.get("role") != "ojt_head":
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only OJT Heads can access this endpoint."
        )
    return token_data


# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@router.get("/dashboard/statistics")
async def get_dashboard_statistics(
    campus_id: Optional[int] = None,
    program_id: Optional[int] = None,
    industry_id: Optional[int] = None,
    semester: Optional[str] = None,
    school_year: Optional[str] = None,
    company_id: Optional[int] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get dashboard statistics for OJT Head"""
    return dashboard_controller.get_dashboard_statistics(
        db=db,
        campus_id=campus_id,
        program_id=program_id,
        industry_id=industry_id,
        semester=semester,
        school_year=school_year,
        company_id=company_id,
        location=location
    )


@router.get("/dashboard/filter-options")
async def get_dashboard_filter_options(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get filter options for dashboard"""
    return dashboard_controller.get_filter_options(db)


# ============================================================================
# EMPLOYER ENDPOINTS
# ============================================================================

@router.get("/employers")
async def get_all_employers(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    keyword: Optional[str] = None,
    industry_id: Optional[int] = None,
    eligibility: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get all employers with pagination and filters - OJT Head sees only internship and both"""
    # Force eligibility filter for OJT Head to only see internship or both
    # If user provides eligibility filter, respect it, otherwise default to internship,both
    if not eligibility:
        eligibility = "internship,both"
    
    return employer_controller.get_all_employers(
        db=db,
        page=page,
        per_page=per_page,
        keyword=keyword,
        industry_id=industry_id,
        eligibility=eligibility,
        status_filter=status_filter
    )


@router.get("/employers/{employer_id}")
async def get_employer_by_id(
    employer_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get employer by ID"""
    return employer_controller.get_employer_by_id(employer_id, db)


@router.post("/employers/register")
async def register_employer(
    employer_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Register new employer (JSON)"""
    from schemas.employer import EmployerCreate
    employer = EmployerCreate(**employer_data)
    return employer_controller.register_employer(employer, db)


@router.post("/employers")
async def create_employer_simple(
    email_address: str = Form(...),
    company_name: str = Form(...),
    representative_name: str = Form(...),
    phone_number: str = Form(...),
    industry_id: int = Form(...),
    validity_start: str = Form(...),
    validity_end: str = Form(...),
    moa_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Create employer with FormData (for file uploads)"""
    from fastapi import UploadFile, File, Form
    from schemas.employer import EmployerSimpleCreate
    from datetime import datetime
    from uuid import uuid4
    import os
    
    # Save PDF if provided
    saved_path: Optional[str] = None
    if moa_pdf is not None:
        if moa_pdf.content_type != "application/pdf":
            return {"detail": "Only PDF is accepted for MOA."}, 400
        uploads_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "uploads", "moa"))
        os.makedirs(uploads_dir, exist_ok=True)
        filename = f"{uuid4()}.pdf"
        saved_path = os.path.join(uploads_dir, filename)
        content = await moa_pdf.read()
        with open(saved_path, "wb") as f:
            f.write(content)
    
    payload = EmployerSimpleCreate(
        email_address=email_address,
        company_name=company_name,
        representative_name=representative_name,
        phone_number=phone_number,
        industry_id=industry_id,
        validity_start=datetime.fromisoformat(validity_start.replace('Z', '+00:00')),
        validity_end=datetime.fromisoformat(validity_end.replace('Z', '+00:00'))
    )
    
    return employer_controller.register_employer_simple(payload, db, moa_file_path=saved_path)


@router.put("/employers/{employer_id}")
async def update_employer(
    employer_id: int,
    employer_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Update employer"""
    return employer_controller.update_employer(employer_id, employer_data, db)


@router.post("/employers/{employer_id}/send-new-password")
async def send_employer_new_password(
    employer_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Send new password to employer"""
    return employer_controller.send_new_password(employer_id, db)


# ============================================================================
# INTERNSHIP ENDPOINTS
# ============================================================================

@router.get("/internships")
async def get_all_internships(
    page: int = Query(1, ge=1, alias="pageNo"),
    per_page: int = Query(10, ge=1, le=100, alias="pageSize"),
    keyword: Optional[str] = None,
    status_filter: Optional[str] = None,
    employer_id: Optional[int] = None,
    industry_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get all internships with pagination and filters"""
    from models import Internship, Employer, Industry
    
    query = db.query(Internship)
    
    if keyword:
        query = query.filter(Internship.title.ilike(f"%{keyword}%"))
    
    if status_filter:
        query = query.filter(Internship.status == status_filter)
    
    if employer_id:
        query = query.filter(Internship.employer_id == employer_id)
    
    if industry_id:
        query = query.join(Employer).filter(Employer.industry_id == industry_id)
    
    total_records = query.count()
    offset = (page - 1) * per_page
    
    internships = query.order_by(Internship.created_at.desc()).offset(offset).limit(per_page).all()
    
    # Format response with employer info
    result_data = []
    for internship in internships:
        industry_name = None
        if internship.employer and internship.employer.industry:
            industry_name = internship.employer.industry.industry_name
        
        internship_dict = {
            "internship_id": internship.internship_id,
            "employer_id": internship.employer_id,
            "title": internship.title,
            "description": internship.full_description,
            "full_description": internship.full_description,
            "posting_type": internship.posting_type,
            "status": internship.status,
            "created_at": internship.created_at.isoformat() if internship.created_at else None,
            "updated_at": internship.updated_at.isoformat() if internship.updated_at else None,
            "company_name": internship.employer.company_name if internship.employer else None,
            "industry_id": internship.employer.industry_id if internship.employer else None,
            "industry_name": industry_name,
            "address": internship.employer.address if internship.employer else None,
            "duration_months": 6,
            "skills": [skill.skill_name for skill in internship.skills] if internship.skills else []
        }
        result_data.append(internship_dict)
    
    return {
        "status": "success",
        "data": result_data,
        "pagination": {
            "pageNo": page,
            "pageSize": per_page,
            "totalRecords": total_records,
            "totalPages": (total_records + per_page - 1) // per_page
        }
    }


@router.get("/internships/{internship_id}")
async def get_internship_by_id(
    internship_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get internship by ID"""
    from models import Internship
    from fastapi import HTTPException
    
    internship = db.query(Internship).filter(Internship.internship_id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    return {
        "status": "success",
        "data": internship
    }


@router.put("/internships/{internship_id}/status")
async def update_internship_status(
    internship_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Update internship status (approve/reject by OJT Head)"""
    from models import Internship
    from fastapi import HTTPException
    from datetime import datetime
    
    internship = db.query(Internship).filter(Internship.internship_id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    new_status = status_data.get("status")
    remarks = status_data.get("remarks")
    
    # Validate status
    valid_statuses = ['draft', 'pending', 'approved', 'open', 'closed', 'rejected', 'archived']
    if new_status and new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    # Map 'approved' to 'open' to make it visible to students
    if new_status == 'approved':
        internship.status = 'open'
        action_message = "approved and opened for applications"
    elif new_status == 'rejected':
        internship.status = 'rejected'
        action_message = "rejected"
    elif new_status:
        internship.status = new_status
        action_message = f"updated to {new_status}"
    else:
        raise HTTPException(status_code=400, detail="Status is required")
    
    # Store remarks if provided (for rejection reasons)
    if remarks:
        # Note: You may want to add a remarks column to the internships table
        # For now, we'll just log it or you can add it to a separate table
        pass
    
    internship.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(internship)
    
    return {
        "status": "success",
        "message": f"Internship {action_message} successfully",
        "data": {
            "internship_id": internship.internship_id,
            "title": internship.title,
            "status": internship.status,
            "updated_at": internship.updated_at.isoformat() if internship.updated_at else None
        }
    }


# ============================================================================
# OJT COORDINATOR ENDPOINTS
# ============================================================================

@router.get("/ojt-coordinators")
async def get_all_ojt_coordinators(
    pageNo: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    keyword: str = "",
    campus_id: Optional[int] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get all OJT coordinators"""
    user_id = token_data.get("user_id")
    return ojt_coordinator_controller.get_all_ojt_coordinators(
        db=db,
        user_id=user_id,
        page_no=pageNo,
        page_size=pageSize,
        keyword=keyword,
        campus_id=campus_id,
        department_id=department_id
    )


@router.get("/ojt-coordinators/{user_id}")
async def get_ojt_coordinator_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get OJT coordinator by ID"""
    ojt_head_user_id = token_data.get("user_id")
    return ojt_coordinator_controller.get_ojt_coordinator_by_id(
        user_id=user_id,
        ojt_head_user_id=ojt_head_user_id,
        db=db
    )


@router.post("/ojt-coordinators/register")
async def register_ojt_coordinator(
    coordinator_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Register new OJT coordinator"""
    from schemas.ojt_coordinator import OJTCoordinatorCreate
    ojt_head_user_id = token_data.get("user_id")
    coordinator = OJTCoordinatorCreate(**coordinator_data)
    return ojt_coordinator_controller.register_ojt_coordinator(
        ojt_coordinator=coordinator,
        ojt_head_user_id=ojt_head_user_id,
        db=db
    )


@router.patch("/ojt-coordinators/{user_id}")
async def update_ojt_coordinator(
    user_id: int,
    coordinator_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Update OJT coordinator"""
    from schemas.ojt_coordinator import OJTCoordinatorUpdate
    ojt_head_user_id = token_data.get("user_id")
    coordinator_update = OJTCoordinatorUpdate(**coordinator_data)
    return ojt_coordinator_controller.update_ojt_coordinator(
        user_id=user_id,
        coordinator_update=coordinator_update,
        ojt_head_user_id=ojt_head_user_id,
        db=db
    )


@router.post("/ojt-coordinators/{user_id}/send-new-password")
async def send_coordinator_new_password(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Send new password to OJT coordinator"""
    ojt_head_user_id = token_data.get("user_id")
    return ojt_coordinator_controller.send_new_password(
        user_id=user_id,
        ojt_head_user_id=ojt_head_user_id,
        db=db
    )


# ============================================================================
# REQUIREMENT TEMPLATES ENDPOINTS
# ============================================================================

@router.get("/requirement-templates")
async def get_requirement_templates(
    type: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get all requirement templates"""
    from models import RequirementTemplate
    
    query = db.query(RequirementTemplate)
    
    if type:
        query = query.filter(RequirementTemplate.type == type)
    
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


@router.post("/requirement-templates")
async def create_requirement_template(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    type: str = Form("pre"),
    is_required: str = Form("true"),
    accessible_to: str = Form("student,coordinator"),
    template_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Create new requirement template"""
    from fastapi import HTTPException
    from models import RequirementTemplate
    import uuid
    import os
    
    # Convert is_required string to boolean
    is_required_bool = is_required.lower() in ('true', '1', 'yes')
    
    # Auto-generate requirement_id (get max + 1)
    max_req = db.query(RequirementTemplate).order_by(RequirementTemplate.requirement_id.desc()).first()
    requirement_id = (max_req.requirement_id + 1) if max_req else 1
    
    # Auto-generate order_index (get max + 1)
    max_order = db.query(RequirementTemplate).order_by(RequirementTemplate.order_index.desc()).first()
    order_index = (max_order.order_index + 1) if max_order else 1
    
    # Handle file upload if provided
    template_url = None
    if template_file:
        # Create upload directory if it doesn't exist
        upload_dir = get_upload_path("requirement_templates")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(template_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await template_file.read()
            buffer.write(content)
        
        # Generate URL
        template_url = get_upload_url("requirement_templates", unique_filename)
    
    # Create template
    new_template = RequirementTemplate(
        requirement_id=requirement_id,
        title=title,
        description=description,
        type=type,
        template_url=template_url,
        is_required=is_required_bool,
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
            "title": new_template.title,
            "template_url": new_template.template_url
        }
    }


@router.put("/requirement-templates/{template_id}")
async def update_requirement_template(
    template_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    type: Optional[str] = Form(None),
    is_required: Optional[str] = Form(None),
    order_index: Optional[str] = Form(None),
    accessible_to: Optional[str] = Form(None),
    template_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Update requirement template"""
    from fastapi import HTTPException
    from models import RequirementTemplate
    from datetime import datetime
    import uuid
    import os
    
    template = db.query(RequirementTemplate).filter(
        RequirementTemplate.template_id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Handle file upload if provided
    if template_file:
        # Delete old file if exists
        if template.template_url:
            # Extract filename from URL
            old_filename = template.template_url.split('/')[-1]
            old_file_path = get_upload_path("requirement_templates") / old_filename
            if os.path.exists(old_file_path):
                os.remove(old_file_path)
        
        # Create upload directory if it doesn't exist
        upload_dir = get_upload_path("requirement_templates")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(template_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await template_file.read()
            buffer.write(content)
        
        # Update URL
        template.template_url = get_upload_url("requirement_templates", unique_filename)
    
    # Update fields
    if title is not None:
        template.title = title
    if description is not None:
        template.description = description
    if type is not None:
        template.type = type
    if is_required is not None:
        # Convert string to boolean
        template.is_required = is_required.lower() in ('true', '1', 'yes')
    if order_index is not None:
        # Convert string to int
        template.order_index = int(order_index)
    if accessible_to is not None:
        template.accessible_to = accessible_to
    
    template.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(template)
    
    return {
        "status": "success",
        "message": "Requirement template updated successfully",
        "data": {
            "template_id": template.template_id,
            "title": template.title,
            "template_url": template.template_url
        }
    }


@router.delete("/requirement-templates/{template_id}")
async def delete_requirement_template(
    template_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Delete requirement template"""
    from fastapi import HTTPException
    from models import RequirementTemplate
    
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


# ============================================================================
# PROFILE / MY CAMPUSES
# ============================================================================

@router.get("/me/campuses")
async def get_my_campuses(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_ojt_head_role)
):
    """Get all campuses assigned to the logged-in OJT Head"""
    user_id = token_data.get("user_id")
    return ojt_head_controller.get_my_campuses(user_id, db)
