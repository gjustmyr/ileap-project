from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import get_current_user
from models import RequirementSubmission, Student
from typing import List
import os
from datetime import datetime
from config import get_upload_path, get_upload_url

router = APIRouter(prefix="/api/requirements", tags=["Requirements"])


@router.get("/submissions")
def get_requirements_submissions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get student requirements submissions"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can access this endpoint")
    
    # TODO: Implement actual requirements submission logic
    # For now, return empty data
    return {
        "status": "success",
        "students": []
    }


@router.get("/student/{student_id}")
def get_student_requirements(
    student_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all requirements for a specific student"""
    
    # Verify access permissions
    if current_user['role'] == 'student':
        # Students can only view their own requirements
        # First check if this student_id belongs to them
        student = db.query(Student).filter(
            Student.student_id == student_id,
            Student.user_id == current_user['user_id']
        ).first()
        if not student:
            raise HTTPException(status_code=403, detail="You can only view your own requirements")
    elif current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Unauthorized to view requirements")
    
    try:
        # Query using ORM
        submissions = db.query(RequirementSubmission).filter(
            RequirementSubmission.student_id == student_id
        ).order_by(RequirementSubmission.requirement_id).all()
        
        # Convert to list of dicts
        requirements = []
        for submission in submissions:
            requirements.append({
                "requirement_id": submission.requirement_id,
                "file_url": submission.file_url,
                "status": submission.status,
                "validated": submission.validated,
                "returned": submission.returned,
                "remarks": submission.remarks,
                "submitted_at": submission.submitted_at.isoformat() if submission.submitted_at else None,
                "validated_at": submission.validated_at.isoformat() if submission.validated_at else None
            })
        
        return {
            "status": "success",
            "requirements": requirements
        }
    except Exception as e:
        print(f"Error fetching requirements: {e}")
        return {
            "status": "success",
            "requirements": []
        }


@router.post("/upload")
async def upload_requirement(
    file: UploadFile = File(...),
    requirement_id: int = Form(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a requirement file for a student"""
    
    if current_user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can upload requirements")
    
    # Get the student record from user_id
    student = db.query(Student).filter(Student.user_id == current_user['user_id']).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    
    # Validate file type
    allowed_extensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (5MB limit)
    max_size = 5 * 1024 * 1024  # 5MB in bytes
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
    
    # Reset file position
    await file.seek(0)
    
    # Generate unique filename using student_id
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"student_{student.student_id}_req_{requirement_id}_{timestamp}{file_extension}"
    file_path = get_upload_path("requirements", safe_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Save to database
    file_url = get_upload_url("requirements", safe_filename)
    
    try:
        print(f"📝 Attempting to save requirement {requirement_id} for student {student.student_id}")
        
        # Check if submission already exists
        existing = db.query(RequirementSubmission).filter(
            RequirementSubmission.student_id == student.student_id,
            RequirementSubmission.requirement_id == requirement_id
        ).first()
        
        if existing:
            # Update existing submission
            print(f"🔄 Updating existing submission ID: {existing.id}")
            existing.file_url = file_url
            existing.status = 'submitted'
            existing.validated = False  # Reset validation when resubmitting
            existing.returned = False
            existing.remarks = None
            existing.submitted_at = datetime.now()
            existing.updated_at = datetime.now()
        else:
            # Insert new submission
            print(f"➕ Creating new submission")
            new_submission = RequirementSubmission(
                student_id=student.student_id,
                requirement_id=requirement_id,
                file_url=file_url,
                status='submitted',
                validated=False,
                returned=False,
                submitted_at=datetime.now()
            )
            db.add(new_submission)
        
        db.commit()
        db.refresh(existing if existing else new_submission)
        print(f"✅ Successfully saved requirement {requirement_id} for student {student.student_id}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Database error: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to save requirement to database: {str(e)}"
        )
    
    return {
        "status": "success",
        "message": "File uploaded successfully",
        "file_url": file_url,
        "requirement_id": requirement_id
    }


@router.put("/{requirement_id}/approve")
def approve_requirement(
    requirement_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Approve a student's requirement submission"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can approve requirements")
    
    # Find the requirement submission
    submission = db.query(RequirementSubmission).filter(
        RequirementSubmission.requirement_id == requirement_id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Requirement submission not found")
    
    # Update submission status
    submission.status = 'approved'
    submission.validated = True
    submission.returned = False
    submission.validated_at = datetime.now()
    submission.updated_at = datetime.now()
    
    try:
        db.commit()
        db.refresh(submission)
        return {
            "status": "success",
            "message": "Requirement approved successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to approve requirement: {str(e)}")


@router.put("/{requirement_id}/reject")
def reject_requirement(
    requirement_id: int,
    remarks: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reject a student's requirement submission"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can reject requirements")
    
    # Find the requirement submission
    submission = db.query(RequirementSubmission).filter(
        RequirementSubmission.requirement_id == requirement_id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Requirement submission not found")
    
    # Update submission status
    submission.status = 'rejected'
    submission.validated = False
    submission.returned = True
    submission.remarks = remarks.get('remarks', '')
    submission.updated_at = datetime.now()
    
    try:
        db.commit()
        db.refresh(submission)
        return {
            "status": "success",
            "message": "Requirement rejected successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reject requirement: {str(e)}")


@router.put("/student/{student_id}/approve-all")
def approve_all_requirements(
    student_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Approve all submitted requirements for a student"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can approve requirements")
    
    # Find all submitted requirements for the student
    submissions = db.query(RequirementSubmission).filter(
        RequirementSubmission.student_id == student_id,
        RequirementSubmission.status == 'submitted'
    ).all()
    
    if not submissions:
        raise HTTPException(status_code=404, detail="No submitted requirements found for this student")
    
    # Update all submissions
    for submission in submissions:
        submission.status = 'approved'
        submission.validated = True
        submission.returned = False
        submission.validated_at = datetime.now()
        submission.updated_at = datetime.now()
    
    try:
        db.commit()
        return {
            "status": "success",
            "message": f"Approved {len(submissions)} requirements successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to approve requirements: {str(e)}")
