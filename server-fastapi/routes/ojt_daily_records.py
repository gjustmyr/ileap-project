from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date, time
from typing import List, Optional
from database import get_db
from middleware.auth import get_current_user
from models import (
    DailyOJTRecord,
    Student,
    InternshipApplication,
    StudentSupervisorAssignment,
    TraineeSupervisor
)
from pydantic import BaseModel, Field


router = APIRouter(prefix="/api/ojt/daily-records", tags=["OJT Daily Records"])


class TimeInRequest(BaseModel):
    """Request model for time-in"""
    pass  # No additional fields needed, uses current timestamp


class TimeOutRequest(BaseModel):
    """Request model for time-out"""
    pass  # No additional fields needed, uses current timestamp


class DailyTaskAccomplishmentRequest(BaseModel):
    """Request model for saving/updating daily task and accomplishment"""
    task_for_the_day: Optional[str] = None
    accomplishment_for_the_day: Optional[str] = None


class DailyRecordResponse(BaseModel):
    record_id: int
    student_id: int
    record_date: datetime
    time_in: Optional[datetime]
    time_out: Optional[datetime]
    task_for_the_day: Optional[str]
    accomplishment_for_the_day: Optional[str]
    remarks: Optional[str]
    status: str

    class Config:
        from_attributes = True


@router.post("/time-in")
def clock_in(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Student clocks in for the day"""
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get active accepted application
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted',
        InternshipApplication.ojt_start_date.isnot(None)
    ).first()
    
    if not application:
        raise HTTPException(status_code=400, detail="No active OJT found. You must have an accepted internship with a start date.")
    
    # Check if OJT has started
    today = date.today()
    ojt_start_date = application.ojt_start_date.date() if application.ojt_start_date else None
    
    if not ojt_start_date or today < ojt_start_date:
        raise HTTPException(status_code=400, detail="Your OJT has not started yet")
    
    # Check if already clocked in today
    today_start = datetime.combine(today, time.min)
    today_end = datetime.combine(today, time.max)
    
    existing_record = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student.student_id,
        DailyOJTRecord.record_date >= today_start,
        DailyOJTRecord.record_date <= today_end
    ).first()
    
    now = datetime.now()
    
    if existing_record:
        if existing_record.time_in:
            raise HTTPException(status_code=400, detail="You have already clocked in today")
        # Update existing record
        existing_record.time_in = now
        existing_record.updated_at = now
        db.commit()
        db.refresh(existing_record)
        record = existing_record
    else:
        # Create new record
        record = DailyOJTRecord(
            student_id=student.student_id,
            internship_application_id=application.application_id,
            record_date=now,
            time_in=now,
            status='draft'
        )
        db.add(record)
        db.commit()
        db.refresh(record)
    
    return {
        "status": "success",
        "message": "Clocked in successfully",
        "data": {
            "record_id": record.record_id,
            "time_in": record.time_in.isoformat(),
            "record_date": record.record_date.date().isoformat()
        }
    }


@router.post("/time-out")
def clock_out(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Student clocks out for the day"""
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get today's record
    today = date.today()
    today_start = datetime.combine(today, time.min)
    today_end = datetime.combine(today, time.max)
    
    record = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student.student_id,
        DailyOJTRecord.record_date >= today_start,
        DailyOJTRecord.record_date <= today_end
    ).first()
    
    if not record:
        raise HTTPException(status_code=400, detail="No time-in record found for today. Please clock in first.")
    
    if not record.time_in:
        raise HTTPException(status_code=400, detail="You haven't clocked in yet")
    
    if record.time_out:
        raise HTTPException(status_code=400, detail="You have already clocked out today")
    
    now = datetime.now()
    record.time_out = now
    record.updated_at = now
    
    db.commit()
    db.refresh(record)
    
    # Calculate hours worked
    hours_worked = (record.time_out - record.time_in).total_seconds() / 3600
    
    return {
        "status": "success",
        "message": "Clocked out successfully",
        "data": {
            "record_id": record.record_id,
            "time_in": record.time_in.isoformat(),
            "time_out": record.time_out.isoformat(),
            "hours_worked": round(hours_worked, 2)
        }
    }


@router.post("/save-task-accomplishment")
def save_daily_task_accomplishment(
    payload: DailyTaskAccomplishmentRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save or update task and accomplishment for the day"""
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get active application
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted',
        InternshipApplication.ojt_start_date.isnot(None)
    ).first()
    
    if not application:
        raise HTTPException(status_code=400, detail="No active OJT found")
    
    # Get or create today's record
    today = date.today()
    today_start = datetime.combine(today, time.min)
    today_end = datetime.combine(today, time.max)
    
    record = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student.student_id,
        DailyOJTRecord.record_date >= today_start,
        DailyOJTRecord.record_date <= today_end
    ).first()
    
    now = datetime.now()
    
    if record:
        # Update existing record
        if payload.task_for_the_day is not None:
            record.task_for_the_day = payload.task_for_the_day
        if payload.accomplishment_for_the_day is not None:
            record.accomplishment_for_the_day = payload.accomplishment_for_the_day
        record.updated_at = now
    else:
        # Create new record
        record = DailyOJTRecord(
            student_id=student.student_id,
            internship_application_id=application.application_id,
            record_date=now,
            task_for_the_day=payload.task_for_the_day,
            accomplishment_for_the_day=payload.accomplishment_for_the_day,
            status='draft'
        )
        db.add(record)
    
    db.commit()
    db.refresh(record)
    
    return {
        "status": "success",
        "message": "Task and accomplishment saved successfully",
        "data": {
            "record_id": record.record_id,
            "task_for_the_day": record.task_for_the_day,
            "accomplishment_for_the_day": record.accomplishment_for_the_day,
            "record_date": record.record_date.date().isoformat()
        }
    }


@router.post("/submit-today")
def submit_todays_record(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit today's OJT record (finalizes it)"""
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get today's record
    today = date.today()
    today_start = datetime.combine(today, time.min)
    today_end = datetime.combine(today, time.max)
    
    record = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student.student_id,
        DailyOJTRecord.record_date >= today_start,
        DailyOJTRecord.record_date <= today_end
    ).first()
    
    if not record:
        raise HTTPException(status_code=400, detail="No record found for today")
    
    if not record.time_in or not record.time_out:
        raise HTTPException(status_code=400, detail="Please complete time-in and time-out before submitting")
    
    if not record.task_for_the_day or not record.accomplishment_for_the_day:
        raise HTTPException(status_code=400, detail="Please fill in both task and accomplishment before submitting")
    
    now = datetime.now()
    record.status = 'submitted'
    record.submitted_at = now
    record.updated_at = now
    
    db.commit()
    db.refresh(record)
    
    return {
        "status": "success",
        "message": "Today's OJT record submitted successfully",
        "data": {
            "record_id": record.record_id,
            "submitted_at": record.submitted_at.isoformat()
        }
    }


@router.get("/today")
def get_todays_record(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get today's OJT record for the current student"""
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get today's record
    today = date.today()
    today_start = datetime.combine(today, time.min)
    today_end = datetime.combine(today, time.max)
    
    record = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student.student_id,
        DailyOJTRecord.record_date >= today_start,
        DailyOJTRecord.record_date <= today_end
    ).first()
    
    if not record:
        return {
            "status": "success",
            "data": None,
            "message": "No record for today yet"
        }
    
    return {
        "status": "success",
        "data": {
            "record_id": record.record_id,
            "record_date": record.record_date.date().isoformat(),
            "time_in": record.time_in.isoformat() if record.time_in else None,
            "time_out": record.time_out.isoformat() if record.time_out else None,
            "task_for_the_day": record.task_for_the_day,
            "accomplishment_for_the_day": record.accomplishment_for_the_day,
            "status": record.status,
            "submitted_at": record.submitted_at.isoformat() if record.submitted_at else None
        }
    }


@router.get("/history")
def get_ojt_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get OJT history for the current student"""
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Query records with pagination
    query = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student.student_id
    ).order_by(DailyOJTRecord.record_date.desc())
    
    total_records = query.count()
    offset = (page - 1) * page_size
    records = query.offset(offset).limit(page_size).all()
    
    result = []
    for record in records:
        hours_worked = None
        if record.time_in and record.time_out:
            hours_worked = round((record.time_out - record.time_in).total_seconds() / 3600, 2)
        
        result.append({
            "record_id": record.record_id,
            "record_date": record.record_date.date().isoformat(),
            "time_in": record.time_in.isoformat() if record.time_in else None,
            "time_out": record.time_out.isoformat() if record.time_out else None,
            "hours_worked": hours_worked,
            "task_for_the_day": record.task_for_the_day,
            "accomplishment_for_the_day": record.accomplishment_for_the_day,
            "status": record.status,
            "submitted_at": record.submitted_at.isoformat() if record.submitted_at else None
        })
    
    return {
        "status": "success",
        "data": result,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_records": total_records,
            "total_pages": (total_records + page_size - 1) // page_size
        }
    }


@router.get("/student/{student_id}/records")
def get_student_ojt_records(
    student_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get OJT records for a specific student (for supervisors/coordinators)"""
    
    # Verify student exists
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get all records for this student
    records = db.query(DailyOJTRecord).filter(
        DailyOJTRecord.student_id == student_id
    ).order_by(DailyOJTRecord.record_date.desc()).all()
    
    result = []
    for record in records:
        hours_worked = None
        if record.time_in and record.time_out:
            hours_worked = round((record.time_out - record.time_in).total_seconds() / 3600, 2)
        
        result.append({
            "record_id": record.record_id,
            "record_date": record.record_date.date().isoformat(),
            "time_in": record.time_in.isoformat() if record.time_in else None,
            "time_out": record.time_out.isoformat() if record.time_out else None,
            "hours_worked": hours_worked,
            "task_for_the_day": record.task_for_the_day,
            "accomplishment_for_the_day": record.accomplishment_for_the_day,
            "remarks": record.remarks,
            "status": record.status,
            "submitted_at": record.submitted_at.isoformat() if record.submitted_at else None,
            "validated_at": record.validated_at.isoformat() if record.validated_at else None
        })
    
    return {
        "status": "success",
        "data": result,
        "student": {
            "student_id": student.student_id,
            "name": f"{student.first_name} {student.last_name}"
        }
    }
