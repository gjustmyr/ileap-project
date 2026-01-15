from fastapi import APIRouter, Depends, Query, status, UploadFile, File, Form, Response, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import EmailStr
from datetime import datetime
import os
from uuid import uuid4

from database import get_db
from controllers.employer_controller import (
	get_all_employers,
	register_employer,
	register_employer_internship_minimal,
	register_employer_simple,
	update_employer,
	generate_password,
	hash_password,
	send_email,
)
from models import Employer, User
from schemas.employer import EmployerCreate, EmployerUpdate, EmployerInternshipMinimalCreate, EmployerSimpleCreate
from middleware.auth import get_current_user


router = APIRouter(prefix="/api/employers", tags=["Employers"])


@router.get("")
def list_employers(
	page: int = Query(1, ge=1),
	per_page: int = Query(10, ge=1, le=100),
	keyword: Optional[str] = None,
	industry_id: Optional[int] = None,
	eligibility: Optional[str] = None,
	status: Optional[str] = None,
	db: Session = Depends(get_db)
):
	return get_all_employers(
		db=db,
		page=page,
		per_page=per_page,
		keyword=keyword,
		industry_id=industry_id,
		eligibility=eligibility,
		status_filter=status,
	)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_employer_route(payload: EmployerCreate, db: Session = Depends(get_db)):
	return register_employer(payload, db)


@router.post("/register-internship", status_code=status.HTTP_201_CREATED)
def register_internship_minimal_route(payload: EmployerInternshipMinimalCreate, db: Session = Depends(get_db)):
	return register_employer_internship_minimal(payload, db)


@router.post("/register-simple", status_code=status.HTTP_201_CREATED)
async def register_simple_route(
	email_address: EmailStr = Form(...),
	company_name: str = Form(...),
	representative_name: str = Form(...),
	phone_number: str = Form(...),
	industry_id: int = Form(...),
	validity_start: datetime = Form(...),
	validity_end: datetime = Form(...),
	moa_pdf: UploadFile | None = File(None),
	db: Session = Depends(get_db),
):
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
		company_name=company_name,		representative_name=representative_name,		industry_id=industry_id,
		validity_start=validity_start,
		validity_end=validity_end,
	)

	return register_employer_simple(payload, db, moa_file_path=saved_path)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_employer_multipart(
	email_address: EmailStr = Form(...),
	company_name: str = Form(...),
	representative_name: str = Form(...),
	phone_number: str = Form(...),
	industry_id: int = Form(...),
	validity_start: datetime = Form(...),
	validity_end: datetime = Form(...),
	moa_pdf: Optional[UploadFile] = File(None),
	db: Session = Depends(get_db),
):
	"""Multipart friendly endpoint used by frontend to create employer with minimal fields.
	Mirrors /register-simple for compatibility.
	"""
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
		validity_start=validity_start,
		validity_end=validity_end,
	)

	return register_employer_simple(payload, db, moa_file_path=saved_path)


# Explicit CORS preflight handler to avoid 405 on OPTIONS when Authorization header is sent
@router.options("/register-simple")
def options_register_simple():
    return Response(status_code=200)


@router.get("/me")
def get_my_employer_profile(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
	"""Get the current logged-in employer's profile"""
	user_id = current_user.get("user_id")
	
	employer = db.query(Employer).filter(Employer.user_id == user_id).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404

	# Get industry name if industry_id exists
	industry_name = None
	if employer.industry_id and employer.industry:
		industry_name = employer.industry.industry_name

	return {
		"status": "success",
		"data": {
			"employer_id": employer.employer_id,
			"user_id": employer.user_id,
			"company_name": employer.company_name,
			"company_overview": employer.company_overview,
			"representative_name": employer.representative_name,
			"company_size": employer.company_size,
			"industry_id": employer.industry_id,
			"industry_name": industry_name,
			"email": employer.email,
			"phone_number": employer.phone_number,
			"address": employer.address,
			"website": employer.website,
			"facebook": employer.facebook,
			"linkedin": employer.linkedin,
			"twitter": employer.twitter,
			"logo": employer.logo,
			"eligibility": employer.eligibility,
			"internship_validity": employer.internship_validity,
			"job_placement_validity": employer.job_placement_validity,
			"moa_file": employer.moa_file,
			"status": employer.status,
			"work_schedule": employer.work_schedule,
		}
	}


@router.put("/me")
async def update_my_employer_profile(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db),
	company_name: str = Form(None),
	industry_id: int = Form(None),
	company_overview: str = Form(None),
	representative_name: str = Form(None),
	company_size: int = Form(None),
	email: str = Form(None),
	phone_number: str = Form(None),
	address: str = Form(None),
	website: str = Form(None),
	facebook: str = Form(None),
	linkedin: str = Form(None),
	twitter: str = Form(None),
	work_schedule: str = Form(None),
	logo: UploadFile = File(None),
):
	"""Update the current logged-in employer's profile with optional logo upload"""
	user_id = current_user.get("user_id")
	
	employer = db.query(Employer).filter(Employer.user_id == user_id).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404

	# Update fields if provided
	if company_name is not None:
		employer.company_name = company_name
	if industry_id is not None:
		employer.industry_id = industry_id
	if company_overview is not None:
		employer.company_overview = company_overview
	if representative_name is not None:
		employer.representative_name = representative_name
	if company_size is not None:
		employer.company_size = company_size
	if email is not None:
		employer.email = email
	if phone_number is not None:
		employer.phone_number = phone_number
	if address is not None:
		employer.address = address
	if website is not None:
		employer.website = website
	if facebook is not None:
		employer.facebook = facebook
	if linkedin is not None:
		employer.linkedin = linkedin
	if twitter is not None:
		employer.twitter = twitter
	if work_schedule is not None:
		employer.work_schedule = work_schedule

	# Handle logo upload
	if logo is not None:
		if not logo.content_type.startswith('image/'):
			return {"status": "error", "detail": "Only image files are allowed for logo"}, 400
		
		uploads_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "uploads", "logos"))
		os.makedirs(uploads_dir, exist_ok=True)
		
		file_ext = os.path.splitext(logo.filename)[1]
		filename = f"{uuid4()}{file_ext}"
		saved_path = os.path.join(uploads_dir, filename)
		
		content = await logo.read()
		with open(saved_path, "wb") as f:
			f.write(content)
		
		employer.logo = f"/uploads/logos/{filename}"

	employer.updated_at = datetime.utcnow()
	db.commit()
	db.refresh(employer)

	return {
		"status": "success",
		"message": "Profile updated successfully",
		"data": {
			"employer_id": employer.employer_id,
			"company_name": employer.company_name,
			"company_overview": employer.company_overview,
			"representative_name": employer.representative_name,
			"company_size": employer.company_size,
			"email": employer.email,
			"phone_number": employer.phone_number,
			"address": employer.address,
			"website": employer.website,
			"facebook": employer.facebook,
			"linkedin": employer.linkedin,
			"twitter": employer.twitter,
			"logo": employer.logo,
			"work_schedule": employer.work_schedule,
		}
	}


@router.post("/assign-supervisor")
def assign_supervisor_to_student(
	student_id: int = Form(...),
	supervisor_id: int = Form(...),
	application_id: int = Form(...),
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Assign a supervisor to a student for their OJT"""
	from models import StudentSupervisorAssignment, InternshipApplication, TraineeSupervisor, Student
	
	# Verify employer
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer profile not found")
	
	# Verify the application belongs to this employer
	application = db.query(InternshipApplication).filter(
		InternshipApplication.application_id == application_id,
		InternshipApplication.student_id == student_id
	).first()
	
	if not application:
		raise HTTPException(status_code=404, detail="Application not found")
	
	# Verify the application is for this employer's internship
	from models import Internship
	internship = db.query(Internship).filter(
		Internship.internship_id == application.internship_id,
		Internship.employer_id == employer.employer_id
	).first()
	
	if not internship:
		raise HTTPException(status_code=403, detail="This application does not belong to your company")
	
	# Verify supervisor exists and belongs to this employer
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.supervisor_id == supervisor_id,
		TraineeSupervisor.employer_id == employer.employer_id
	).first()
	
	if not supervisor:
		raise HTTPException(status_code=404, detail="Supervisor not found or does not belong to your company")
	
	# Check if assignment already exists
	existing_assignment = db.query(StudentSupervisorAssignment).filter(
		StudentSupervisorAssignment.student_id == student_id,
		StudentSupervisorAssignment.internship_application_id == application_id,
		StudentSupervisorAssignment.status == "active"
	).first()
	
	if existing_assignment:
		# Update existing assignment
		existing_assignment.supervisor_id = supervisor_id
		existing_assignment.updated_at = datetime.utcnow()
		db.commit()
		db.refresh(existing_assignment)
		
		return {
			"status": "success",
			"message": "Supervisor assignment updated successfully",
			"data": {
				"assignment_id": existing_assignment.assignment_id,
				"student_id": existing_assignment.student_id,
				"supervisor_id": existing_assignment.supervisor_id,
				"assigned_at": existing_assignment.assigned_at.isoformat()
			}
		}
	
	# Create new assignment
	new_assignment = StudentSupervisorAssignment(
		student_id=student_id,
		supervisor_id=supervisor_id,
		internship_application_id=application_id,
		status="active"
	)
	
	db.add(new_assignment)
	db.commit()
	db.refresh(new_assignment)
	
	return {
		"status": "success",
		"message": "Supervisor assigned successfully",
		"data": {
			"assignment_id": new_assignment.assignment_id,
			"student_id": new_assignment.student_id,
			"supervisor_id": new_assignment.supervisor_id,
			"assigned_at": new_assignment.assigned_at.isoformat()
		}
	}


@router.get("/supervisors")
def get_employer_supervisors(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get all supervisors for the current employer"""
	from models import TraineeSupervisor
	
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer profile not found")
	
	supervisors = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.employer_id == employer.employer_id,
		TraineeSupervisor.status == "active"
	).all()
	
	return {
		"status": "success",
		"data": [
			{
				"supervisor_id": sup.supervisor_id,
				"first_name": sup.first_name,
				"last_name": sup.last_name,
				"full_name": f"{sup.first_name} {sup.last_name}",
				"email": sup.email,
				"phone_number": sup.phone_number,
				"position": sup.position,
				"department": sup.department
			}
			for sup in supervisors
		]
	}


@router.get("/assigned-students")
def get_assigned_students(
	current_user: dict = Depends(get_current_user),
	db: Session = Depends(get_db)
):
	"""Get all students assigned to supervisors in this company"""
	from models import StudentSupervisorAssignment, Student, TraineeSupervisor, InternshipApplication, Internship
	
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer profile not found")
	
	# Get all assignments for this employer's students
	assignments = db.query(StudentSupervisorAssignment).join(
		TraineeSupervisor, StudentSupervisorAssignment.supervisor_id == TraineeSupervisor.supervisor_id
	).join(
		Student, StudentSupervisorAssignment.student_id == Student.student_id
	).join(
		InternshipApplication, StudentSupervisorAssignment.internship_application_id == InternshipApplication.application_id
	).join(
		Internship, InternshipApplication.internship_id == Internship.internship_id
	).filter(
		TraineeSupervisor.employer_id == employer.employer_id,
		StudentSupervisorAssignment.status == "active"
	).all()
	
	result = []
	for assignment in assignments:
		student = assignment.student
		supervisor = assignment.supervisor
		application = assignment.application
		
		result.append({
			"assignment_id": assignment.assignment_id,
			"student_id": student.student_id,
			"student_name": f"{student.first_name} {student.last_name}",
			"student_email": student.email,
			"sr_code": student.sr_code,
			"supervisor_id": supervisor.supervisor_id,
			"supervisor_name": f"{supervisor.first_name} {supervisor.last_name}",
			"supervisor_position": supervisor.position,
			"assigned_at": assignment.assigned_at.isoformat(),
			"application_id": application.application_id,
			"status": assignment.status
		})
	
	return {
		"status": "success",
		"data": result
	}


@router.get("/{employer_id}")
def get_employer_by_id(employer_id: int, db: Session = Depends(get_db)):
	employer = db.query(Employer).filter(Employer.employer_id == employer_id).first()
	if not employer:
		return {"detail": "Employer not found"}, 404

	user = db.query(User).filter(User.user_id == employer.user_id).first()
	return {
		"employer_id": employer.employer_id,
		"user_id": employer.user_id,
		"email_address": user.email_address if user else None,
		"company_name": employer.company_name,
		"company_overview": employer.company_overview,
		"representative_name": employer.representative_name,
		"company_size": employer.company_size,
		"industry_id": employer.industry_id,
		"email": employer.email,
		"phone_number": employer.phone_number,
		"address": employer.address,
		"website": employer.website,
		"facebook": employer.facebook,
		"linkedin": employer.linkedin,
		"twitter": employer.twitter,
		"eligibility": employer.eligibility,
		"internship_validity": employer.internship_validity,
		"job_placement_validity": employer.job_placement_validity,
		"moa_file": employer.moa_file,
		"status": employer.status,
	}


@router.put("/{employer_id}")
def update_employer_route(employer_id: int, payload: EmployerUpdate, db: Session = Depends(get_db)):
	return update_employer(employer_id, payload, db)


@router.post("/{employer_id}/send-new-password")
def send_new_password_route(employer_id: int, db: Session = Depends(get_db)):
	employer = db.query(Employer).filter(Employer.employer_id == employer_id).first()
	if not employer:
		return {"detail": "Employer not found"}, 404

	user = db.query(User).filter(User.user_id == employer.user_id).first()
	if not user:
		return {"detail": "User not found"}, 404

	new_password = generate_password()
	user.password = hash_password(new_password)
	db.commit()

	if user.email_address:
		send_email(
			user.email_address,
			"Your New Password - ILEAP",
			f"<p>Your new password is: <strong>{new_password}</strong></p><p>Please change it after login.</p>",
		)

	return {"message": "New password sent successfully"}
