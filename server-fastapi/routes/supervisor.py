from fastapi import APIRouter, Depends, Query, HTTPException, status, UploadFile, File, Body
from config import get_upload_path, get_upload_url
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
from datetime import datetime, date, time as datetime_time

from database import get_db
from controllers.supervisor_controller import (
	get_all_supervisors,
	create_supervisor,
	update_supervisor,
	delete_supervisor
)
from models import Employer, TraineeSupervisor, StudentSupervisorAssignment, Student, DailyTimeLog, DailyAccomplishment, InternshipApplication
from schemas.supervisor import SupervisorCreate, SupervisorUpdate, SupervisorResponse
from middleware.auth import get_current_user
from sqlalchemy.orm import joinedload


router = APIRouter(prefix="/api/supervisors", tags=["Trainee Supervisors"])


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
	morning_start = datetime_time(7, 0)   # 7:00 AM
	morning_end = datetime_time(12, 0)    # 12:00 PM
	afternoon_start = datetime_time(13, 0) # 1:00 PM
	afternoon_end = datetime_time(17, 0)   # 5:00 PM
	
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


# ===== SUPERVISOR AUTHENTICATION & PROFILE ROUTES =====

@router.get("/me")
def get_supervisor_profile(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get current supervisor's profile"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Get employer info
	employer = db.query(Employer).filter(Employer.employer_id == supervisor.employer_id).first()
	
	return {
		"status": "success",
		"data": {
			"supervisor_id": supervisor.supervisor_id,
			"user_id": supervisor.user_id,
			"employer_id": supervisor.employer_id,
			"first_name": supervisor.first_name,
			"last_name": supervisor.last_name,
			"email": supervisor.email,
			"phone_number": supervisor.phone_number,
			"position": supervisor.position,
			"department": supervisor.department,
			"status": supervisor.status,
			"company_name": employer.company_name if employer else None,
			"company_address": employer.address if employer else None
		}
	}


@router.put("/me")
def update_supervisor_profile(
	payload: SupervisorUpdate,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Update current supervisor's profile"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Update fields
	if payload.first_name:
		supervisor.first_name = payload.first_name
	if payload.last_name:
		supervisor.last_name = payload.last_name
	if payload.phone_number:
		supervisor.phone_number = payload.phone_number
	if payload.position:
		supervisor.position = payload.position
	if payload.department:
		supervisor.department = payload.department
	
	from datetime import datetime
	supervisor.updated_at = datetime.utcnow()
	db.commit()
	db.refresh(supervisor)
	
	return {
		"status": "success",
		"message": "Profile updated successfully",
		"data": {
			"supervisor_id": supervisor.supervisor_id,
			"first_name": supervisor.first_name,
			"last_name": supervisor.last_name,
			"email": supervisor.email,
			"phone_number": supervisor.phone_number,
			"position": supervisor.position,
			"department": supervisor.department
		}
	}


# ===== EMPLOYER ROUTES (for managing supervisors) =====

@router.get("", response_model=dict)
def list_supervisors(
	page: int = Query(1, ge=1),
	page_size: int = Query(10, ge=1, le=100),
	keyword: Optional[str] = None,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	# Get employer from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user["user_id"]).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer not found")

	return get_all_supervisors(
		db=db,
		employer_id=employer.employer_id,
		page=page,
		page_size=page_size,
		keyword=keyword
	)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=SupervisorResponse)
def register_supervisor(
	payload: SupervisorCreate,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	# Get employer from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user["user_id"]).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer not found")

	try:
		return create_supervisor(db=db, employer_id=employer.employer_id, payload=payload)
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))


@router.put("/{supervisor_id}", response_model=SupervisorResponse)
def update_supervisor_route(
	supervisor_id: int,
	payload: SupervisorUpdate,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	# Get employer from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user["user_id"]).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer not found")

	try:
		return update_supervisor(
			db=db,
			supervisor_id=supervisor_id,
			employer_id=employer.employer_id,
			payload=payload
		)
	except ValueError as e:
		raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{supervisor_id}")
def delete_supervisor_route(
	supervisor_id: int,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	# Get employer from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user["user_id"]).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer not found")

	try:
		return delete_supervisor(
			db=db,
			supervisor_id=supervisor_id,
			employer_id=employer.employer_id
		)
	except ValueError as e:
		raise HTTPException(status_code=404, detail=str(e))


# ===== SUPERVISOR STUDENT MANAGEMENT ROUTES =====

@router.get("/my-students")
def get_assigned_students(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get all students assigned to current supervisor"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Get all active assignments
	assignments = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).all()
	
	students_data = []
	for assignment in assignments:
		# Get student details
		student = db.query(Student).filter(
			Student.student_id == assignment.student_id
		).first()
		
		if not student:
			continue
		
		# Get application and internship details if available
		internship_title = None
		ojt_status = "Not Started"
		
		if assignment.internship_application_id:
			application = db.query(InternshipApplication).filter(
				InternshipApplication.application_id == assignment.internship_application_id
			).first()
			
			if application:
				# Determine OJT status based on application status and start date
				if application.status == "accepted" and application.ojt_start_date:
					from datetime import datetime
					if application.ojt_start_date <= datetime.utcnow():
						ojt_status = "In Progress"
					else:
						ojt_status = "Starting Soon"
				elif application.status == "accepted":
					ojt_status = "Accepted"
				
				# Get internship title
				if application.internship_id:
					from models import Internship
					internship = db.query(Internship).filter(
						Internship.internship_id == application.internship_id
					).first()
					if internship:
						internship_title = internship.title
		
		students_data.append({
			"assignment_id": assignment.assignment_id,
			"student_id": student.student_id,
			"student_number": student.sr_code,
			"first_name": student.first_name,
			"last_name": student.last_name,
			"email": student.email,
			"program": student.program,
			"major": student.major,
			"internship_title": internship_title,
			"ojt_status": ojt_status,
			"assigned_at": assignment.assigned_at.isoformat() if assignment.assigned_at else None,
			"status": assignment.status
		})
	
	return {
		"status": "success",
		"data": students_data
	}


# ===== OJT RECORDS MANAGEMENT ROUTES =====

@router.get("/students/{student_id}/records")
def get_student_ojt_records(
	student_id: int,
	start_date: Optional[str] = Query(None),
	end_date: Optional[str] = Query(None),
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get OJT records for a specific student"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Verify supervisor is assigned to this student
	assignment = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.student_id == student_id,
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).first()
	
	if not assignment:
		raise HTTPException(status_code=403, detail="You are not assigned to this student")
	
	# Query time logs with accomplishments
	time_logs = db.query(DailyTimeLog).filter(
		DailyTimeLog.student_id == student_id
	).order_by(DailyTimeLog.log_date.desc()).all()
	
	# Apply date filters if provided
	if start_date:
		from datetime import datetime
		time_logs = [log for log in time_logs if log.log_date >= datetime.fromisoformat(start_date).date()]
	if end_date:
		from datetime import datetime
		time_logs = [log for log in time_logs if log.log_date <= datetime.fromisoformat(end_date).date()]
	
	records_data = []
	for log in time_logs:
		# Get accomplishment for this log
		accomplishment = db.query(DailyAccomplishment).filter(
			DailyAccomplishment.log_id == log.log_id
		).first()
		
		records_data.append({
			"id": log.log_id,
			"record_id": log.log_id,
			"log_id": log.log_id,
			"student_id": log.student_id,
			"date": log.log_date.isoformat() if log.log_date else None,
			"time_in": log.time_in.isoformat() if log.time_in else None,
			"time_out": log.time_out.isoformat() if log.time_out else None,
			"total_hours": float(log.total_hours) if log.total_hours else 0,
			"tasks": accomplishment.tasks if accomplishment else None,
			"accomplishments": accomplishment.accomplishments if accomplishment else None,
			"supervisor_remarks": None,  # Can add this field later if needed
			"validation_status": log.status,
			"status": log.status,
			"submitted_at": log.created_at.isoformat() if log.created_at else None,
			"validated_at": log.updated_at.isoformat() if log.updated_at else None,
			"modified_after_date": log.modified_after_date if hasattr(log, 'modified_after_date') else False
		})
	
	return {
		"status": "success",
		"data": records_data
	}


@router.put("/records/{record_id}/validate")
def validate_ojt_record(
	record_id: int,
	validation_status: str = Query(..., regex="^(approved|rejected|complete)$"),
	remarks: Optional[str] = None,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Validate/approve or reject an OJT record"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Get the time log (using log_id)
	time_log = db.query(DailyTimeLog).filter(DailyTimeLog.log_id == record_id).first()
	
	if not time_log:
		raise HTTPException(status_code=404, detail="Record not found")
	
	# Verify supervisor is assigned to this student
	assignment = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.student_id == time_log.student_id,
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).first()
	
	if not assignment:
		raise HTTPException(status_code=403, detail="You are not assigned to this student")
	
	# Update validation status
	from datetime import datetime
	time_log.status = "complete" if validation_status == "approved" else validation_status
	time_log.updated_at = datetime.utcnow()
	
	# Note: DailyTimeLog doesn't have validated_by or remarks fields
	# If you need these, add them to the model or use a separate table
	
	db.commit()
	db.refresh(time_log)
	
	return {
		"status": "success",
		"message": f"Record {validation_status} successfully",
		"data": {
			"record_id": time_log.log_id,
			"log_id": time_log.log_id,
			"validation_status": time_log.status,
			"validated_at": time_log.updated_at.isoformat() if time_log.updated_at else None
		}
	}


@router.put("/records/{record_id}/update")
def update_ojt_record(
	record_id: int,
	time_in: Optional[str] = Body(None),
	time_out: Optional[str] = Body(None),
	tasks: Optional[str] = Body(None),
	accomplishments: Optional[str] = Body(None),
	supervisor_remarks: Optional[str] = Body(None),
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Update time-in, time-out, tasks, accomplishments, or add remarks"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Get the time log
	time_log = db.query(DailyTimeLog).filter(DailyTimeLog.log_id == record_id).first()
	
	if not time_log:
		raise HTTPException(status_code=404, detail="Record not found")
	
	# Verify supervisor is assigned to this student
	assignment = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.student_id == time_log.student_id,
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).first()
	
	if not assignment:
		raise HTTPException(status_code=403, detail="You are not assigned to this student")
	
	# Update time fields
	from datetime import datetime, date
	print(f"DEBUG: Received time_in: {time_in}, time_out: {time_out}")
	print(f"DEBUG: Received tasks: {tasks}, accomplishments: {accomplishments}")
	
	if time_in:
		# Handle both ISO format with Z and without
		time_in_clean = time_in.replace('Z', '+00:00') if 'Z' in time_in else time_in
		time_log.time_in = datetime.fromisoformat(time_in_clean)
		print(f"DEBUG: Updated time_in to: {time_log.time_in}")
	if time_out:
		time_out_clean = time_out.replace('Z', '+00:00') if 'Z' in time_out else time_out
		time_log.time_out = datetime.fromisoformat(time_out_clean)
		print(f"DEBUG: Updated time_out to: {time_log.time_out}")
	
	# Recalculate total hours if times changed (only count valid working hours)
	if time_log.time_in and time_log.time_out:
		time_log.total_hours = calculate_valid_hours(time_log.time_in, time_log.time_out)
		print(f"DEBUG: Calculated valid working hours: {time_log.total_hours}")
	
	# Check if editing after the log date has passed
	today = date.today()
	if time_log.log_date < today:
		time_log.modified_after_date = True
	
	# Update or create accomplishment fields
	accomplishment = db.query(DailyAccomplishment).filter(
		DailyAccomplishment.log_id == record_id
	).first()
	
	print(f"DEBUG: Found accomplishment: {accomplishment}")
	
	if accomplishment:
		# Update existing accomplishment
		print(f"DEBUG: Updating existing accomplishment {accomplishment.accomplishment_id}")
		if tasks is not None:
			accomplishment.tasks = tasks
			print(f"DEBUG: Set tasks to: {tasks}")
		if accomplishments is not None:
			accomplishment.accomplishments = accomplishments
			print(f"DEBUG: Set accomplishments to: {accomplishments}")
		accomplishment.updated_at = datetime.utcnow()
	elif tasks is not None or accomplishments is not None:
		# Create new accomplishment if it doesn't exist and data is provided
		print(f"DEBUG: Creating new accomplishment")
		accomplishment = DailyAccomplishment(
			log_id=record_id,
			student_id=time_log.student_id,
			log_date=time_log.log_date,
			tasks=tasks,
			accomplishments=accomplishments,
			created_at=datetime.utcnow(),
			updated_at=datetime.utcnow()
		)
		db.add(accomplishment)
		print(f"DEBUG: Added new accomplishment to session")
	
	time_log.updated_at = datetime.utcnow()
	print(f"DEBUG: About to commit changes")
	print(f"DEBUG: Before commit - time_in: {time_log.time_in}, time_out: {time_log.time_out}, total_hours: {time_log.total_hours}")
	db.commit()
	print(f"DEBUG: Commit successful")
	
	# Query the database directly to verify the update
	db.expire_all()  # Clear SQLAlchemy cache
	time_log_fresh = db.query(DailyTimeLog).filter(DailyTimeLog.log_id == record_id).first()
	print(f"DEBUG: Fresh query from DB - time_in: {time_log_fresh.time_in}, time_out: {time_log_fresh.time_out}, total_hours: {time_log_fresh.total_hours}")
	
	db.refresh(time_log)
	print(f"DEBUG: After refresh - time_in: {time_log.time_in}, time_out: {time_log.time_out}")
	
	# Query accomplishment AFTER commit to get fresh data
	accomplishment = db.query(DailyAccomplishment).filter(
		DailyAccomplishment.log_id == record_id
	).first()
	
	if accomplishment:
		print(f"DEBUG: Accomplishment after commit - tasks: {accomplishment.tasks}, accomplishments: {accomplishment.accomplishments}")
	else:
		print(f"DEBUG: No accomplishment found after commit for log_id {record_id}")
	
	print(f"DEBUG: Returning response with tasks={accomplishment.tasks if accomplishment else None}, accomplishments={accomplishment.accomplishments if accomplishment else None}")
	
	return {
		"status": "success",
		"message": "Record updated successfully",
		"data": {
			"record_id": time_log.log_id,
			"log_id": time_log.log_id,
			"time_in": time_log.time_in.isoformat() if time_log.time_in else None,
			"time_out": time_log.time_out.isoformat() if time_log.time_out else None,
			"total_hours": float(time_log.total_hours) if time_log.total_hours else 0,
			"tasks": accomplishment.tasks if accomplishment else None,
			"accomplishments": accomplishment.accomplishments if accomplishment else None,
			"modified_after_date": time_log.modified_after_date
		}
	}


# ===== SUPERVISOR REQUIREMENTS SUBMISSION ROUTES =====

@router.get("/students/{student_id}/requirements")
def get_student_requirements(
	student_id: int,
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get requirements for a student that supervisor can submit (e.g., Performance Appraisal)"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Verify supervisor is assigned to this student
	assignment = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.student_id == student_id,
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).first()
	
	if not assignment:
		raise HTTPException(status_code=403, detail="You are not assigned to this student")
	
	# Get requirements accessible to supervisor (requirement_id = 17 for Performance Appraisal)
	from models import RequirementTemplate, RequirementSubmission
	
	templates = db.query(RequirementTemplate).filter(
		RequirementTemplate.accessible_to.contains("supervisor")
	).order_by(RequirementTemplate.order_index).all()
	
	requirements_data = []
	for template in templates:
		# Check if requirement has been submitted
		submission = db.query(RequirementSubmission).filter(
			RequirementSubmission.student_id == student_id,
			RequirementSubmission.requirement_id == template.requirement_id
		).first()
		
		requirements_data.append({
			"requirement_id": template.requirement_id,
			"title": template.title,
			"description": template.description,
			"type": template.type,
			"is_required": template.is_required,
			"template_url": template.template_url,
			"submission": {
				"submission_id": submission.submission_id if submission else None,
				"file_path": submission.file_path if submission else None,
				"submitted_at": submission.submitted_at.isoformat() if submission and submission.submitted_at else None,
				"status": submission.status if submission else "pending"
			} if submission else None
		})
	
	return {
		"status": "success",
		"data": requirements_data
	}


@router.post("/students/{student_id}/requirements/{requirement_id}/submit")
async def submit_requirement_for_student(
	student_id: int,
	requirement_id: int,
	file: UploadFile = File(...),
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Submit a requirement on behalf of a student (e.g., Performance Appraisal Report)"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Verify supervisor is assigned to this student
	assignment = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.student_id == student_id,
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).first()
	
	if not assignment:
		raise HTTPException(status_code=403, detail="You are not assigned to this student")
	
	# Verify this requirement is accessible to supervisor
	from models import RequirementTemplate, RequirementSubmission
	
	template = db.query(RequirementTemplate).filter(
		RequirementTemplate.requirement_id == requirement_id
	).first()
	
	if not template or "supervisor" not in template.accessible_to:
		raise HTTPException(status_code=403, detail="You cannot submit this requirement")
	
	# Save the file
	import os
	from datetime import datetime
	
	# Get upload directory from config
	upload_dir = get_upload_path("requirements", f"student_{student_id}")
	
	# Generate unique filename
	timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
	file_extension = os.path.splitext(file.filename)[1]
	filename = f"req_{requirement_id}_{timestamp}{file_extension}"
	file_path = upload_dir / filename
	
	# Save file
	with open(file_path, "wb") as buffer:
		content = await file.read()
		buffer.write(content)
	
	# Create or update submission
	submission = db.query(RequirementSubmission).filter(
		RequirementSubmission.student_id == student_id,
		RequirementSubmission.requirement_id == requirement_id
	).first()
	
	if submission:
		# Update existing submission
		submission.file_path = f"/{file_path}"
		submission.submitted_at = datetime.utcnow()
		submission.status = "submitted"
		submission.updated_at = datetime.utcnow()
	else:
		# Create new submission
		submission = RequirementSubmission(
			student_id=student_id,
			requirement_id=requirement_id,
			file_path=f"/{file_path}",
			submitted_at=datetime.utcnow(),
			status="submitted"
		)
		db.add(submission)
	
	db.commit()
	db.refresh(submission)
	
	return {
		"status": "success",
		"message": "Requirement submitted successfully",
		"data": {
			"submission_id": submission.submission_id,
			"requirement_id": requirement_id,
			"file_path": submission.file_path,
			"submitted_at": submission.submitted_at.isoformat() if submission.submitted_at else None
		}
	}


# ===== SUPERVISOR DASHBOARD ROUTES =====

@router.get("/dashboard/stats")
def get_supervisor_dashboard_stats(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get dashboard statistics for supervisor"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.user_id == current_user["user_id"]
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor profile not found")
	
	# Count assigned students
	total_students = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active"
	).count()
	
	# Count pending validations (records with status = 'incomplete' - not yet completed)
	pending_validations = db.query(DailyTimeLog).join(
		StudentSupervisorAssignment,
		DailyTimeLog.student_id == StudentSupervisorAssignment.student_id
	).filter(
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active",
		DailyTimeLog.status == "incomplete"
	).count()
	
	# Count recent records (last 7 days)
	from datetime import datetime, timedelta
	seven_days_ago = datetime.utcnow().date() - timedelta(days=7)
	
	recent_records_count = db.query(DailyTimeLog).join(
		StudentSupervisorAssignment,
		DailyTimeLog.student_id == StudentSupervisorAssignment.student_id
	).filter(
		StudentSupervisorAssignment.supervisor_id == supervisor.supervisor_id,
		StudentSupervisorAssignment.status == "active",
		DailyTimeLog.log_date >= seven_days_ago
	).count()
	
	return {
		"status": "success",
		"data": {
			"total_students": total_students,
			"pending_validations": pending_validations,
			"records_with_warnings": records_with_warnings,
			"recent_records_count": recent_records_count
		}
	}


# ===== PERFORMANCE APPRAISAL TEMPLATE DOWNLOAD =====

@router.get("/appraisal-template")
def download_appraisal_template(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Download performance appraisal form template"""
	if current_user.get("role") != "trainee_supervisor":
		raise HTTPException(status_code=403, detail="Access denied. Supervisor role required.")
	
	# Path to the template file
	template_path = os.path.join("templates", "Performance_Appraisal_Form_Template.pdf")
	
	# Check if template exists
	if not os.path.exists(template_path):
		raise HTTPException(status_code=404, detail="Appraisal form template not found")
	
	return FileResponse(
		path=template_path,
		filename="Performance_Appraisal_Form_Template.pdf",
		media_type="application/pdf"
	)
