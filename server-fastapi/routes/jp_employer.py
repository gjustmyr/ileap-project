from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File, status
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from models import User, Employer, Industry
from sqlalchemy import or_, func
from typing import Optional
from pydantic import EmailStr
import bcrypt
import secrets
import string
import os
from utils.datetime_helper import utcnow
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/api/jp-officers/employers", tags=["Job Placement - Employers"])


def verify_jp_officer(token_data: dict = Depends(verify_token)):
    """Verify that the user is a job placement officer"""
    if token_data.get("role") != "job_placement_officer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job placement officers can access this resource"
        )
    return token_data


# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@router.get("/dashboard/statistics", tags=["Job Placement - Dashboard"])
async def get_dashboard_statistics(
    industry_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Get dashboard statistics for Job Placement Portal"""
    try:
        from models import Internship, Employer, Industry, Alumni
        from sqlalchemy import func, extract
        
        print("📊 Fetching Job Placement Dashboard statistics")
        
        # Base queries
        employer_query = db.query(Employer).filter(
            Employer.eligibility.in_(['job_placement', 'both'])
        )
        job_posting_query = db.query(Internship).filter(
            Internship.posting_type == 'job_placement'
        )
        
        # Apply industry filter if provided
        if industry_id:
            employer_query = employer_query.filter(Employer.industry_id == industry_id)
            job_posting_query = job_posting_query.join(Employer).filter(
                Employer.industry_id == industry_id
            )
        
        # Summary statistics
        total_employers = employer_query.count()
        total_job_postings = job_posting_query.count()
        active_job_postings = job_posting_query.filter(Internship.status == 'open').count()
        pending_job_postings = job_posting_query.filter(Internship.status == 'pending').count()
        
        # Total alumni (if Alumni table exists)
        total_alumni = db.query(Alumni).count() if Alumni else 0
        
        # Total applications (if applications exist)
        total_applications = 0  # Placeholder - implement when application tracking is added
        
        # Employers by industry
        employers_by_industry = db.query(
            Industry.industry_name,
            func.count(Employer.employer_id).label('count')
        ).join(Employer, Employer.industry_id == Industry.industry_id)\
         .filter(Employer.eligibility.in_(['job_placement', 'both']))\
         .group_by(Industry.industry_name)\
         .all()
        
        # Job postings by status
        job_postings_by_status = db.query(
            Internship.status,
            func.count(Internship.internship_id).label('count')
        ).filter(Internship.posting_type == 'job_placement')\
         .group_by(Internship.status)\
         .all()
        
        # Job postings by industry
        job_postings_by_industry = db.query(
            Industry.industry_name,
            func.count(Internship.internship_id).label('count')
        ).join(Employer, Internship.employer_id == Employer.employer_id)\
         .join(Industry, Employer.industry_id == Industry.industry_id)\
         .filter(Internship.posting_type == 'job_placement')\
         .group_by(Industry.industry_name)\
         .all()
        
        # Monthly job postings (last 12 months)
        monthly_job_postings = db.query(
            extract('month', Internship.created_at).label('month'),
            func.count(Internship.internship_id).label('count')
        ).filter(Internship.posting_type == 'job_placement')\
         .group_by(extract('month', Internship.created_at))\
         .all()
        
        # Top employers by job postings
        top_employers = db.query(
            Employer.company_name,
            func.count(Internship.internship_id).label('count')
        ).join(Internship, Internship.employer_id == Employer.employer_id)\
         .filter(Internship.posting_type == 'job_placement')\
         .group_by(Employer.company_name)\
         .order_by(func.count(Internship.internship_id).desc())\
         .limit(5)\
         .all()
        
        return {
            "status": "success",
            "data": {
                "summary": {
                    "total_alumni": total_alumni,
                    "total_employers": total_employers,
                    "total_job_postings": total_job_postings,
                    "active_job_postings": active_job_postings,
                    "pending_job_postings": pending_job_postings,
                    "total_applications": total_applications
                },
                "employers_by_industry": [
                    {"industry_name": row.industry_name, "count": row.count}
                    for row in employers_by_industry
                ],
                "job_postings_by_status": [
                    {"status": row.status, "count": row.count}
                    for row in job_postings_by_status
                ],
                "job_postings_by_industry": [
                    {"industry_name": row.industry_name, "count": row.count}
                    for row in job_postings_by_industry
                ],
                "monthly_job_postings": [
                    {"month": int(row.month), "count": row.count}
                    for row in monthly_job_postings
                ],
                "top_employers": [
                    {"company_name": row.company_name, "count": row.count}
                    for row in top_employers
                ]
            }
        }
    except Exception as e:
        print(f"❌ Error fetching dashboard statistics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch dashboard statistics: {str(e)}"
        )


# ============================================================================
# JOB POSTINGS ENDPOINTS
# ============================================================================

@router.get("/job-postings", tags=["Job Placement - Job Postings"])
async def get_all_job_postings(
    page_no: int = 1,
    page_size: int = 10,
    keyword: str = "",
    employer_id: Optional[int] = None,
    industry_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Get all job postings for alumni - only shows posting_type = job_placement"""
    try:
        from models import Internship, Employer, Industry
        
        print("🔍 Job Placement Portal - Fetching job postings")
        
        # Base query
        query = db.query(Internship).filter(Internship.posting_type == "job_placement")
        
        # Apply filters
        if keyword:
            query = query.filter(Internship.title.ilike(f"%{keyword}%"))
        
        if employer_id:
            query = query.filter(Internship.employer_id == employer_id)
        
        if industry_id:
            query = query.join(Employer).filter(Employer.industry_id == industry_id)
        
        if status_filter:
            query = query.filter(Internship.status == status_filter)
        
        # Get total count
        total_records = query.count()
        
        # Apply pagination
        offset = (page_no - 1) * page_size
        job_postings = query.order_by(Internship.created_at.desc()).offset(offset).limit(page_size).all()
        
        # Format response
        result_data = []
        for posting in job_postings:
            industry_name = None
            if posting.employer and posting.employer.industry:
                industry_name = posting.employer.industry.industry_name
            
            result_data.append({
                "internship_id": posting.internship_id,
                "employer_id": posting.employer_id,
                "title": posting.title,
                "description": posting.full_description,
                "full_description": posting.full_description,
                "posting_type": posting.posting_type,
                "status": posting.status,
                "created_at": posting.created_at.isoformat() if posting.created_at else None,
                "updated_at": posting.updated_at.isoformat() if posting.updated_at else None,
                "company_name": posting.employer.company_name if posting.employer else None,
                "industry_id": posting.employer.industry_id if posting.employer else None,
                "industry_name": industry_name,
                "address": posting.employer.address if posting.employer else None,
                "skills": [skill.skill_name for skill in posting.skills] if posting.skills else []
            })
        
        print(f"✅ Returning {len(result_data)} job postings")
        
        return {
            "status": "success",
            "data": result_data,
            "pagination": {
                "page_no": page_no,
                "page_size": page_size,
                "total_records": total_records,
                "total_pages": (total_records + page_size - 1) // page_size
            }
        }
    except Exception as e:
        print(f"❌ Error fetching job postings: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job postings: {str(e)}"
        )


@router.get("/job-postings/{posting_id}", tags=["Job Placement - Job Postings"])
async def get_job_posting_by_id(
    posting_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Get job posting details by ID"""
    try:
        from models import Internship
        
        posting = db.query(Internship).filter(
            Internship.internship_id == posting_id,
            Internship.posting_type == "job_placement"
        ).first()
        
        if not posting:
            raise HTTPException(status_code=404, detail="Job posting not found")
        
        industry_name = None
        if posting.employer and posting.employer.industry:
            industry_name = posting.employer.industry.industry_name
        
        return {
            "status": "success",
            "data": {
                "internship_id": posting.internship_id,
                "employer_id": posting.employer_id,
                "title": posting.title,
                "description": posting.full_description,
                "full_description": posting.full_description,
                "posting_type": posting.posting_type,
                "status": posting.status,
                "created_at": posting.created_at.isoformat() if posting.created_at else None,
                "updated_at": posting.updated_at.isoformat() if posting.updated_at else None,
                "company_name": posting.employer.company_name if posting.employer else None,
                "industry_id": posting.employer.industry_id if posting.employer else None,
                "industry_name": industry_name,
                "address": posting.employer.address if posting.employer else None,
                "skills": [skill.skill_name for skill in posting.skills] if posting.skills else []
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job posting: {str(e)}"
        )


@router.put("/job-postings/{posting_id}/status", tags=["Job Placement - Job Postings"])
async def update_job_posting_status(
    posting_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Update job posting status (approve/reject by Job Placement Officer)"""
    try:
        from models import Internship
        from datetime import datetime
        
        posting = db.query(Internship).filter(
            Internship.internship_id == posting_id,
            Internship.posting_type == "job_placement"
        ).first()
        
        if not posting:
            raise HTTPException(status_code=404, detail="Job posting not found")
        
        new_status = status_data.get("status")
        remarks = status_data.get("remarks")
        
        # Validate status
        valid_statuses = ['draft', 'pending', 'approved', 'open', 'closed', 'rejected', 'archived']
        if new_status and new_status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        # Map 'approved' to 'open' to make it visible to alumni
        if new_status == 'approved':
            posting.status = 'open'
            action_message = "approved and opened for applications"
        elif new_status == 'rejected':
            posting.status = 'rejected'
            action_message = "rejected"
        elif new_status:
            posting.status = new_status
            action_message = f"updated to {new_status}"
        else:
            raise HTTPException(status_code=400, detail="Status is required")
        
        posting.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(posting)
        
        return {
            "status": "success",
            "message": f"Job posting {action_message} successfully",
            "data": {
                "internship_id": posting.internship_id,
                "title": posting.title,
                "status": posting.status,
                "updated_at": posting.updated_at.isoformat() if posting.updated_at else None
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update job posting status: {str(e)}"
        )


# ============================================================================
# EMPLOYERS ENDPOINTS
# ============================================================================

@router.get("/search", tags=["Job Placement - Employers"])
async def search_all_employers(
    page_no: int = 1,
    page_size: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Search ALL employers (no eligibility filter) - for checking existing accounts"""
    try:
        print(f"🔍 Searching all employers with keyword: {keyword}")
        
        # Base query with industry join - NO eligibility filter
        query = db.query(
            Employer.employer_id,
            Employer.email,
            Employer.company_name,
            Employer.representative_name,
            Employer.phone_number,
            Employer.address,
            Employer.company_size,
            Employer.eligibility,
            Employer.job_placement_validity,
            Employer.internship_validity,
            Employer.moa_file,
            Employer.status,
            Industry.industry_name,
            Industry.industry_id
        ).outerjoin(Industry, Employer.industry_id == Industry.industry_id)
        
        # Apply keyword search
        if keyword:
            search_filter = or_(
                Employer.company_name.ilike(f"%{keyword}%"),
                Employer.email.ilike(f"%{keyword}%"),
                Employer.representative_name.ilike(f"%{keyword}%")
            )
            query = query.filter(search_filter)
        
        # Get total count
        total_records = query.count()
        
        # Apply pagination
        offset = (page_no - 1) * page_size
        results = query.offset(offset).limit(page_size).all()
        
        # Transform results
        employers = []
        for result in results:
            employers.append({
                "employer_id": result.employer_id,
                "email_address": result.email,
                "company_name": result.company_name,
                "representative_name": result.representative_name,
                "phone_number": result.phone_number,
                "address": result.address,
                "company_size": result.company_size,
                "eligibility": result.eligibility,
                "job_placement_validity": result.job_placement_validity,
                "internship_validity": result.internship_validity,
                "moa_file": result.moa_file,
                "status": result.status,
                "industry_name": result.industry_name,
                "industry_id": result.industry_id
            })
        
        print(f"✅ Found {len(employers)} employers")
        
        return {
            "status": "success",
            "data": employers,
            "pagination": {
                "page_no": page_no,
                "page_size": page_size,
                "total_records": total_records,
                "total_pages": (total_records + page_size - 1) // page_size
            }
        }
    except Exception as e:
        print(f"❌ Error searching employers: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search employers: {str(e)}"
        )


@router.get("")
async def get_all_employers(
    page_no: int = 1,
    page_size: int = 10,
    keyword: str = "",
    industry_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Get all employers for job placement - only shows job_placement and both eligibility"""
    try:
        print("🔍 Job Placement Portal - Fetching employers with eligibility filter")
        
        # Base query with industry join
        query = db.query(
            Employer.employer_id,
            Employer.email,
            Employer.company_name,
            Employer.representative_name,
            Employer.phone_number,
            Employer.address,
            Employer.company_size,
            Employer.eligibility,
            Employer.job_placement_validity,
            Employer.internship_validity,
            Employer.moa_file,
            Employer.status,
            Industry.industry_name,
            Industry.industry_id
        ).outerjoin(Industry, Employer.industry_id == Industry.industry_id)
        
        # Filter for job placement eligibility only - CRITICAL FILTER
        query = query.filter(Employer.eligibility.in_(['job_placement', 'both']))
        print("✅ Applied eligibility filter: job_placement OR both")
        
        # Apply filters
        if keyword:
            search_filter = or_(
                Employer.company_name.ilike(f"%{keyword}%"),
                Employer.email.ilike(f"%{keyword}%"),
                Employer.representative_name.ilike(f"%{keyword}%")
            )
            query = query.filter(search_filter)
        
        if industry_id:
            query = query.filter(Employer.industry_id == industry_id)
        
        # Get total count
        total_records = query.count()
        
        # Apply pagination
        offset = (page_no - 1) * page_size
        results = query.offset(offset).limit(page_size).all()
        
        # Transform results
        employers = []
        for result in results:
            print(f"📋 Employer: {result.company_name}, Eligibility: {result.eligibility}")
            employers.append({
                "employer_id": result.employer_id,
                "email_address": result.email,
                "company_name": result.company_name,
                "representative_name": result.representative_name,
                "phone_number": result.phone_number,
                "address": result.address,
                "company_size": result.company_size,
                "eligibility": result.eligibility,
                "job_placement_validity": result.job_placement_validity,
                "internship_validity": result.internship_validity,
                "moa_file": result.moa_file,
                "status": result.status,
                "industry_name": result.industry_name,
                "industry_id": result.industry_id
            })
        
        print(f"✅ Returning {len(employers)} employers for Job Placement Portal")
        
        return {
            "status": "success",
            "data": employers,
            "pagination": {
                "page_no": page_no,
                "page_size": page_size,
                "total_records": total_records,
                "total_pages": (total_records + page_size - 1) // page_size
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch employers: {str(e)}"
        )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_employer(
    email_address: EmailStr = Form(...),
    company_name: str = Form(...),
    representative_name: str = Form(...),
    phone_number: str = Form(...),
    industry_id: int = Form(...),
    validity_start: str = Form(...),
    validity_end: str = Form(...),
    moa_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Create a new employer for job placement"""
    try:
        # Check if employer already exists
        existing_employer = db.query(Employer).filter(
            Employer.email == email_address
        ).first()
        
        if existing_employer:
            # Update eligibility if employer exists
            if existing_employer.eligibility == "internship":
                existing_employer.eligibility = "both"
            elif existing_employer.eligibility not in ["job_placement", "both"]:
                existing_employer.eligibility = "job_placement"
            
            # Update job placement validity
            existing_employer.job_placement_validity = datetime.fromisoformat(validity_end)
            existing_employer.updated_at = utcnow()
            db.commit()
            
            return {
                "status": "success",
                "message": "Employer already exists. Updated eligibility for job placement.",
                "data": {
                    "employer_id": existing_employer.employer_id,
                    "email_address": existing_employer.email
                }
            }
        
        # Generate random password
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        temp_password = ''.join(secrets.choice(characters) for _ in range(12))
        temp_password = temp_password[:72]
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            temp_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Handle MOA file upload
        moa_file_path = None
        if moa_pdf:
            upload_dir = "uploads/moa"
            os.makedirs(upload_dir, exist_ok=True)
            file_extension = os.path.splitext(moa_pdf.filename)[1]
            filename = f"moa_{email_address.replace('@', '_')}_{int(datetime.now().timestamp())}{file_extension}"
            file_path = os.path.join(upload_dir, filename)
            
            with open(file_path, "wb") as f:
                content = await moa_pdf.read()
                f.write(content)
            
            moa_file_path = file_path
        
        # Create new employer
        new_employer = Employer(
            email=email_address,
            company_name=company_name,
            representative_name=representative_name,
            phone_number=phone_number,
            industry_id=industry_id,
            eligibility="job_placement",
            job_placement_validity=datetime.fromisoformat(validity_end),
            moa_file=moa_file_path,
            status="approved",
            created_at=utcnow(),
            updated_at=utcnow()
        )
        
        db.add(new_employer)
        db.commit()
        db.refresh(new_employer)
        
        # Send email with credentials
        try:
            email_body = f"""Hello {representative_name},

Your company {company_name} has been registered in the ILEAP Job Placement System.

Login Credentials:
Email: {email_address}
Temporary Password: {temp_password}

Please login and change your password immediately for security.

Job Placement Validity: Until {validity_end}

Best regards,
ILEAP Job Placement Team"""
            
            msg = MIMEMultipart()
            msg['From'] = os.getenv("EMAIL_USER")
            msg['To'] = email_address
            msg['Subject'] = "Job Placement Employer Account - ILEAP System"
            msg.attach(MIMEText(email_body, 'plain'))
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
            server.quit()
        except Exception as email_error:
            print(f"Failed to send email: {email_error}")
        
        return {
            "status": "success",
            "message": "Employer registered successfully for job placement",
            "data": {
                "employer_id": new_employer.employer_id,
                "email_address": new_employer.email
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create employer: {str(e)}"
        )


@router.get("/{employer_id}")
async def get_employer_by_id(
    employer_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_jp_officer)
):
    """Get employer details by ID"""
    try:
        result = db.query(
            Employer.employer_id,
            Employer.email,
            Employer.company_name,
            Employer.representative_name,
            Employer.phone_number,
            Employer.address,
            Employer.company_size,
            Employer.eligibility,
            Employer.job_placement_validity,
            Employer.internship_validity,
            Employer.moa_file,
            Employer.status,
            Industry.industry_name,
            Industry.industry_id
        ).outerjoin(Industry, Employer.industry_id == Industry.industry_id).filter(
            Employer.employer_id == employer_id
        ).first()
        
        if not result:
            raise HTTPException(status_code=404, detail="Employer not found")
        
        return {
            "status": "success",
            "data": {
                "employer_id": result.employer_id,
                "email_address": result.email,
                "company_name": result.company_name,
                "representative_name": result.representative_name,
                "phone_number": result.phone_number,
                "address": result.address,
                "company_size": result.company_size,
                "eligibility": result.eligibility,
                "job_placement_validity": result.job_placement_validity,
                "internship_validity": result.internship_validity,
                "moa_file": result.moa_file,
                "status": result.status,
                "industry_name": result.industry_name,
                "industry_id": result.industry_id
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch employer: {str(e)}"
        )
