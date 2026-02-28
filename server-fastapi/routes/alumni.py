from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File, status, Query
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from models import Alumni, User, JobApplication, Internship, Employer, Program
from sqlalchemy import or_, func, and_
from typing import Optional
from pydantic import EmailStr
import bcrypt
import secrets
import string
import os
from utils.datetime_helper import utcnow
from datetime import datetime, date

router = APIRouter(prefix="/api/alumni", tags=["Alumni"])


def verify_alumni(token_data: dict = Depends(verify_token)):
    """Verify that the user is an alumni"""
    if token_data.get("role") != "alumni":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only alumni can access this resource"
        )
    return token_data


@router.get("/me")
async def get_my_profile(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_alumni)
):
    """Get current alumni profile"""
    try:
        user_id = token_data.get("user_id")
        
        alumni = db.query(Alumni).filter(Alumni.user_id == user_id).first()
        
        if not alumni:
            raise HTTPException(status_code=404, detail="Alumni profile not found")
        
        # Get program details
        program_name = None
        if alumni.program_id:
            program = db.query(Program).filter(Program.program_id == alumni.program_id).first()
            if program:
                program_name = program.program_name
        
        return {
            "status": "success",
            "data": {
                "alumni_id": alumni.alumni_id,
                "first_name": alumni.first_name,
                "middle_name": alumni.middle_name,
                "last_name": alumni.last_name,
                "email": alumni.email,
                "phone_number": alumni.phone_number,
                "sr_code": alumni.sr_code,
                "program_id": alumni.program_id,
                "program_name": program_name,
                "graduation_year": alumni.graduation_year,
                "current_employment_status": alumni.current_employment_status,
                "current_company": alumni.current_company,
                "current_position": alumni.current_position,
                "resume_file": alumni.resume_file,
                "linkedin_url": alumni.linkedin_url
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch profile: {str(e)}"
        )


@router.patch("/me")
async def update_my_profile(
    first_name: Optional[str] = Form(None),
    middle_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    current_employment_status: Optional[str] = Form(None),
    current_company: Optional[str] = Form(None),
    current_position: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None),
    resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_alumni)
):
    """Update alumn