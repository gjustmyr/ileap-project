from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import get_current_user
from models import DailyTimeLog, DailyAccomplishment, Student, InternshipApplication, Internship, Employer
from datetime import datetime, date, time as dt_time
from typing import Optional
from pydantic import BaseModel
import json

router = APIRouter(prefix="/api/oeams", tags=["OEAMS - OJT Evaluation and Management System"])


# ===== HELPER FUNCTIONS =====

def calculate_valid_hours(time_in: datetime, time_out: datetime) -> float:
	"""
	Calculate hours within valid working hours only.
	Valid hours: 7:00 AM - 12:00 PM and 1:00 PM - 5:00 PM
	Excludes lunch break: 12:00 PM - 1:00 PM
	"""
	if not time_in or not time_out:
		return 0.0
	
	# Define valid working hours
	morning_start = dt_time(7, 0)   # 7:00 AM
	morning_end = dt_time(12, 0)    # 12:00 PM
	afternoon_start = dt_time(13, 0) # 1:00 PM
	afternoon_end = dt_time(17, 0)   # 5:00 PM
	
	total_seconds = 0
	
	# Get time portions
	time_in_time = time_in.time()
	time_out_time = time_out.time()
	
	# Clamp time_in to valid range
	if time_in_time < morning_start:
		time_in_time = morning_start
	
	# Clamp time_out to valid range
	if time_out_time > afternoon_end:
		time_out_time = afternoon_end
	
	# Calculate morning session (7 AM - 12 PM)
	if time_in_time < morning_end:
		morning_end_actual = min(time_out_time, morning_end)
		if morning_end_actual > time_in_time:
			morning_in = datetime.combine(time_in.date(), time_in_time)
			morning_out = datetime.combine(time_in.date(), morning_end_actual)
			total_seconds += (morning_out - morning_in).total_seconds()
	
	# Calculate afternoon session (1 PM - 5 PM)
	if time_out_time > afternoon_start:
		afternoon_start_actual = max(time_in_time, afternoon_start)
		if time_out_time > afternoon_start_actual:
			afternoon_in = datetime.combine(time_in.date(), afternoon_start_actual)
			afternoon_out = datetime.combine(time_in.date(), time_out_time)
			total_seconds += (afternoon_out - afternoon_in).total_seconds()
	
	return round(total_seconds / 3600, 2)


# ===== PYDANTIC MODELS =====

class TimeInRequest(BaseModel):
    """Request body for time in"""
    pass  # No body needed, will use current timestamp


class TimeOutRequest(BaseModel):
    """Request body for time out"""
    pass  # No body needed, will use current timestamp


class TaskAccomplishmentRequest(BaseModel):
    """Request body for saving tasks and accomplishments"""
    tasks: Optional[str] = None
    accomplishments: Optional[str] = None


@router.post("/time-in")
def time_in(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record time in for the current day"""
    if current_user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can time in")
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user['user_id']).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get accepted application
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted'
    ).first()
    
    if not application:
        raise HTTPException(status_code=400, detail="No accepted internship application found")
    
    # Check if OJT has started
    if not application.ojt_start_date:
        raise HTTPException(status_code=400, detail="OJT start date not set")
    
    start_date = application.ojt_start_date.date() if hasattr(application.ojt_start_date, 'date') else application.ojt_start_date
    today = date.today()
    
    if today < start_date:
        raise HTTPException(status_code=400, detail="OJT has not started yet")
    
    # Get employer to check working hours
    internship = db.query(Internship).filter(
        Internship.internship_id == application.internship_id
    ).first()
    
    employer = None
    if internship:
        employer = db.query(Employer).filter(
            Employer.employer_id == internship.employer_id
        ).first()
    
    # Validate against working days if configured (allow time in anytime, hours will be adjusted during time out)
    now = datetime.now()
    current_day = now.strftime('%A')  # Monday, Tuesday, etc.
    
    if employer and employer.work_schedule:
        try:
            work_schedule = json.loads(employer.work_schedule)
            day_schedule = work_schedule.get(current_day)
            
            if day_schedule is None:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Today ({current_day}) is not a working day for this company."
                )
        except HTTPException:
            raise  # Re-raise HTTP exceptions
        except json.JSONDecodeError as e:
            print(f"Warning: Failed to parse work_schedule JSON: {e}")
            pass  # If JSON parsing fails, skip validation
        except (KeyError, ValueError, IndexError) as e:
            print(f"Warning: Failed to parse work hours: {e}")
            pass  # If time parsing fails, skip validation
    
    # Check if already timed in today
    existing_log = db.query(DailyTimeLog).filter(
        DailyTimeLog.student_id == student.student_id,
        DailyTimeLog.log_date == today
    ).first()
    
    if existing_log and existing_log.time_in:
        raise HTTPException(status_code=400, detail="Already timed in today")
    
    # Create or update time log
    if existing_log:
        existing_log.time_in = datetime.now()
        existing_log.updated_at = datetime.now()
        db.commit()
        db.refresh(existing_log)
        time_log = existing_log
    else:
        time_log = DailyTimeLog(
            student_id=student.student_id,
            application_id=application.application_id,
            log_date=today,
            time_in=datetime.now(),
            status='incomplete'
        )
        db.add(time_log)
        db.commit()
        db.refresh(time_log)
    
    return {
        "status": "success",
        "message": "Time in recorded successfully",
        "data": {
            "log_id": time_log.log_id,
            "time_in": time_log.time_in.isoformat() if time_log.time_in else None,
            "log_date": time_log.log_date.isoformat()
        }
    }


@router.post("/time-out")
def time_out(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record time out for the current day"""
    if current_user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can time out")
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user['user_id']).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    today = date.today()
    
    # Get today's time log
    time_log = db.query(DailyTimeLog).filter(
        DailyTimeLog.student_id == student.student_id,
        DailyTimeLog.log_date == today
    ).first()
    
    if not time_log:
        raise HTTPException(status_code=400, detail="No time in record found for today")
    
    if not time_log.time_in:
        raise HTTPException(status_code=400, detail="Please time in first")
    
    if time_log.time_out:
        raise HTTPException(status_code=400, detail="Already timed out today")
    
    # Get employer to validate working hours
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted'
    ).first()
    
    employer = None
    if application:
        internship = db.query(Internship).filter(
            Internship.internship_id == application.internship_id
        ).first()
        if internship:
            employer = db.query(Employer).filter(
                Employer.employer_id == internship.employer_id
            ).first()
    
    # Record time out
    time_out_timestamp = datetime.now()
    time_log.time_out = time_out_timestamp
    time_log.status = 'complete'
    
    # Calculate total hours using standard working hours (7AM-12PM, 1PM-5PM)
    time_log.total_hours = calculate_valid_hours(time_log.time_in, time_log.time_out)
    
    time_log.updated_at = datetime.now()
    db.commit()
    db.refresh(time_log)
    
    return {
        "status": "success",
        "message": "Time out recorded successfully",
        "data": {
            "log_id": time_log.log_id,
            "time_in": time_log.time_in.isoformat() if time_log.time_in else None,
            "time_out": time_log.time_out.isoformat() if time_log.time_out else None,
            "total_hours": float(time_log.total_hours) if time_log.total_hours else 0,
            "log_date": time_log.log_date.isoformat()
        }
    }


@router.post("/save-accomplishments")
def save_accomplishments(
    data: TaskAccomplishmentRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save or update tasks and accomplishments for the current day"""
    if current_user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can save accomplishments")
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user['user_id']).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    today = date.today()
    
    # Get today's time log
    time_log = db.query(DailyTimeLog).filter(
        DailyTimeLog.student_id == student.student_id,
        DailyTimeLog.log_date == today
    ).first()
    
    if not time_log:
        raise HTTPException(status_code=400, detail="Please time in first before saving accomplishments")
    
    if not time_log.time_in:
        raise HTTPException(status_code=400, detail="Please time in first before saving accomplishments")
    
    # Check if accomplishment record exists
    accomplishment = db.query(DailyAccomplishment).filter(
        DailyAccomplishment.log_id == time_log.log_id
    ).first()
    
    if accomplishment:
        # Update existing
        accomplishment.tasks = data.tasks
        accomplishment.accomplishments = data.accomplishments
        accomplishment.updated_at = datetime.now()
    else:
        # Create new
        accomplishment = DailyAccomplishment(
            log_id=time_log.log_id,
            student_id=student.student_id,
            log_date=today,
            tasks=data.tasks,
            accomplishments=data.accomplishments
        )
        db.add(accomplishment)
    
    db.commit()
    db.refresh(accomplishment)
    
    return {
        "status": "success",
        "message": "Tasks and accomplishments saved successfully",
        "data": {
            "accomplishment_id": accomplishment.accomplishment_id,
            "tasks": accomplishment.tasks,
            "accomplishments": accomplishment.accomplishments,
            "log_date": accomplishment.log_date.isoformat()
        }
    }


@router.get("/today")
def get_today_log(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get today's time log and accomplishments"""
    if current_user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can view logs")
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user['user_id']).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    today = date.today()
    
    # Get today's time log
    time_log = db.query(DailyTimeLog).filter(
        DailyTimeLog.student_id == student.student_id,
        DailyTimeLog.log_date == today
    ).first()
    
    if not time_log:
        return {
            "status": "success",
            "data": {
                "has_timed_in": False,
                "time_in": None,
                "time_out": None,
                "total_hours": 0,
                "tasks": None,
                "accomplishments": None
            }
        }
    
    # Get accomplishments if exists
    accomplishment = db.query(DailyAccomplishment).filter(
        DailyAccomplishment.log_id == time_log.log_id
    ).first()
    
    return {
        "status": "success",
        "data": {
            "log_id": time_log.log_id,
            "has_timed_in": time_log.time_in is not None,
            "has_timed_out": time_log.time_out is not None,
            "time_in": time_log.time_in.isoformat() if time_log.time_in else None,
            "time_out": time_log.time_out.isoformat() if time_log.time_out else None,
            "total_hours": float(time_log.total_hours) if time_log.total_hours else 0,
            "status": time_log.status,
            "tasks": accomplishment.tasks if accomplishment else None,
            "accomplishments": accomplishment.accomplishments if accomplishment else None
        }
    }


@router.get("/logs")
def get_all_logs(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all time logs and accomplishments for the student"""
    if current_user['role'] != 'student':
        raise HTTPException(status_code=403, detail="Only students can view logs")
    
    # Get student
    student = db.query(Student).filter(Student.user_id == current_user['user_id']).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get employer info for work schedule validation
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted'
    ).first()
    
    employer = None
    work_schedule = None
    if application:
        internship = db.query(Internship).filter(
            Internship.internship_id == application.internship_id
        ).first()
        if internship:
            employer = db.query(Employer).filter(
                Employer.employer_id == internship.employer_id
            ).first()
            if employer and employer.work_schedule:
                try:
                    work_schedule = json.loads(employer.work_schedule)
                except json.JSONDecodeError:
                    work_schedule = None
    
    # Get all time logs
    time_logs = db.query(DailyTimeLog).filter(
        DailyTimeLog.student_id == student.student_id
    ).order_by(DailyTimeLog.log_date.desc()).all()
    
    logs_data = []
    total_hours_sum = 0
    
    for time_log in time_logs:
        accomplishment = db.query(DailyAccomplishment).filter(
            DailyAccomplishment.log_id == time_log.log_id
        ).first()
        
        log_hours = float(time_log.total_hours) if time_log.total_hours else 0
        
        # Validate log against work schedule
        validation_warning = None
        if work_schedule and time_log.time_in:
            log_day = time_log.time_in.strftime('%A')
            day_schedule = work_schedule.get(log_day)
            
            if day_schedule is None:
                validation_warning = f"{log_day} is not a working day"
            elif day_schedule.get('start') and day_schedule.get('end') and time_log.time_out:
                try:
                    start_parts = day_schedule['start'].split(':')
                    end_parts = day_schedule['end'].split(':')
                    work_start = dt_time(int(start_parts[0]), int(start_parts[1]))
                    work_end = dt_time(int(end_parts[0]), int(end_parts[1]))
                    
                    time_in_time = time_log.time_in.time()
                    time_out_time = time_log.time_out.time()
                    
                    # Only flag if BOTH time-in and time-out are outside working hours
                    if time_out_time < work_start:
                        validation_warning = f"Time-out before work hours (starts at {day_schedule['start']})"
                    elif time_in_time > work_end:
                        validation_warning = f"Time-in after work hours (ends at {day_schedule['end']})"
                    elif time_in_time == time_out_time:
                        validation_warning = f"Time-in and time-out are the same"
                except (KeyError, ValueError, IndexError):
                    pass
        
        # Only count valid hours
        if validation_warning is None or log_hours > 0:
            total_hours_sum += log_hours
        
        logs_data.append({
            "log_id": time_log.log_id,
            "log_date": time_log.log_date.isoformat(),
            "time_in": time_log.time_in.isoformat() if time_log.time_in else None,
            "time_out": time_log.time_out.isoformat() if time_log.time_out else None,
            "total_hours": log_hours,
            "status": time_log.status,
            "tasks": accomplishment.tasks if accomplishment else None,
            "accomplishments": accomplishment.accomplishments if accomplishment else None,
            "validation_warning": validation_warning
        })
    
    return {
        "status": "success",
        "data": {
            "logs": logs_data,
            "total_hours": round(total_hours_sum, 2),
            "total_days": len([log for log in logs_data if log.get("validation_warning") is None])
        }
    }
