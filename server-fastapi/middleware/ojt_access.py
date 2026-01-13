"""
Middleware for validating OJT period access
Ensures students can only access OEAMS during their active OJT period
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from models import Student, InternshipApplication
from typing import Optional


def check_ojt_period_access(student_id: int, db: Session) -> dict:
    """
    Check if a student is currently in their OJT period
    Returns OJT status information
    """
    
    # Get student's accepted application with start date
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student_id,
        InternshipApplication.status == 'accepted',
        InternshipApplication.ojt_start_date.isnot(None)
    ).first()
    
    if not application:
        return {
            "has_ojt": False,
            "is_active": False,
            "message": "No active OJT found. Student must have an accepted internship with a start date."
        }
    
    today = date.today()
    ojt_start_date = application.ojt_start_date.date() if application.ojt_start_date else None
    
    if not ojt_start_date:
        return {
            "has_ojt": True,
            "is_active": False,
            "message": "OJT start date not set yet"
        }
    
    # Calculate expected OJT end date (assuming 6 months = 180 days)
    # You can adjust this based on your requirements
    ojt_end_date = ojt_start_date + timedelta(days=180)
    
    # Check if today is within OJT period
    is_active = ojt_start_date <= today <= ojt_end_date
    has_started = today >= ojt_start_date
    has_ended = today > ojt_end_date
    
    status_message = "OJT is active"
    if not has_started:
        status_message = f"OJT has not started yet. Start date: {ojt_start_date}"
    elif has_ended:
        status_message = f"OJT has ended. End date: {ojt_end_date}"
    
    return {
        "has_ojt": True,
        "is_active": is_active,
        "has_started": has_started,
        "has_ended": has_ended,
        "ojt_start_date": ojt_start_date.isoformat(),
        "ojt_end_date": ojt_end_date.isoformat(),
        "days_elapsed": (today - ojt_start_date).days if has_started else 0,
        "days_remaining": (ojt_end_date - today).days if not has_ended else 0,
        "message": status_message,
        "application_id": application.application_id
    }


def require_active_ojt_period(student_id: int, db: Session) -> dict:
    """
    Validate that student is in active OJT period
    Raises HTTPException if not
    Returns OJT info if valid
    """
    ojt_status = check_ojt_period_access(student_id, db)
    
    if not ojt_status["has_ojt"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active OJT found. You must have an accepted internship with a start date."
        )
    
    if not ojt_status["is_active"]:
        if not ojt_status.get("has_started", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"OJT has not started yet. Start date: {ojt_status.get('ojt_start_date', 'Not set')}"
            )
        elif ojt_status.get("has_ended", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"OJT period has ended. End date: {ojt_status.get('ojt_end_date', 'Unknown')}"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="OEAMS access is not available outside OJT period"
            )
    
    return ojt_status


def can_submit_daily_record(student_id: int, db: Session, target_date: Optional[date] = None) -> bool:
    """
    Check if student can submit/edit a daily record for a specific date
    Students can only submit records for dates during their OJT period
    Can only edit records from the same day after time-in
    """
    ojt_status = check_ojt_period_access(student_id, db)
    
    if not ojt_status["is_active"]:
        return False
    
    if target_date is None:
        target_date = date.today()
    
    ojt_start = datetime.fromisoformat(ojt_status["ojt_start_date"]).date()
    ojt_end = datetime.fromisoformat(ojt_status["ojt_end_date"]).date()
    
    # Can only submit for dates within OJT period
    return ojt_start <= target_date <= ojt_end
