from fastapi import APIRouter, Depends, Query, status, UploadFile, File, Form
from config import get_upload_path, get_upload_url
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import get_current_user
from schemas.internship import InternshipCreate, InternshipUpdate, InternshipResponse, SkillResponse, ApplicationCreate, ApplicationResponse
from controllers.internship_controller import (
	create_internship,
	get_internships_by_employer,
	get_internship_by_id,
	update_internship,
	delete_internship
)
from models import Employer, Skill, Internship, Student, ClassEnrollment, Class, Program, Department, InternshipApplication
from datetime import datetime
from utils.datetime_helper import now as philippine_now, utcnow as philippine_utcnow
import os
import uuid
import sys
from pathlib import Path

# Import enhanced matcher
sys.path.append(os.path.join(os.path.dirname(__file__), '../ml_models'))
from ml_models.enhanced_matcher import get_matcher

router = APIRouter(prefix="/api/internships", tags=["Internships"])


# Public endpoint for students to view available internships
@router.get("/available")
def get_available_internships(
	pageNo: int = Query(1, ge=1),
	pageSize: int = Query(10, ge=1, le=100),
	search: str = Query(""),
	industry: str = Query(None, description="Comma-separated industry IDs"),
	company: str = Query(None, description="Comma-separated employer IDs"),
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Get all available internships for students with job matching"""
	# Get student info if authenticated
	student = None
	student_skills = set()
	student_program = ""
	
	print(f"\n{'='*50}")
	print(f"INTERNSHIP MATCHING REQUEST")
	print(f"{'='*50}")
	print(f"Current User: {current_user}")
	
	if current_user:
		try:
			user_id = current_user.get("user_id")
			print(f"Looking for student with user_id: {user_id}")
			student = db.query(Student).filter(Student.user_id == user_id).first()
			
			if student:
				print(f"✓ Student found: {student.first_name} {student.last_name}")
				
				# Get program and department from enrolled class (not from student profile)
				active_enrollment = db.query(ClassEnrollment).filter(
					ClassEnrollment.student_id == student.student_id,
					ClassEnrollment.status == "active"
				).first()
				
				program_name = ""
				department_name = ""
				
				if active_enrollment:
					class_info = db.query(Class).filter(Class.class_id == active_enrollment.class_id).first()
					if class_info and class_info.program:
						program_name = class_info.program.program_name or ""
						if class_info.program.department:
							department_name = class_info.program.department.department_name or ""
						print(f"✓ Enrolled Class: {class_info.class_section}")
						print(f"✓ Program from Class: {program_name}")
						print(f"✓ Department from Class: {department_name}")
				else:
					# Fallback to student profile if no active enrollment
					program_name = student.program or ""
					department_name = student.department or ""
					print(f"⚠ No active enrollment - using profile data")
					print(f"  Program from Profile: {program_name}")
					print(f"  Department from Profile: {department_name}")
				
				student_skills = {skill.skill_name.lower() for skill in student.skills} if student.skills else set()
				student_program = program_name.lower()
				
				print(f"Student Skills in DB: {[skill.skill_name for skill in student.skills] if student.skills else []}")
				print(f"Student Major: {student.major}")
			else:
				print(f"✗ No student record found for user_id: {user_id}")
		except Exception as e:
			print(f"✗ Error retrieving student: {str(e)}")
			import traceback
			traceback.print_exc()
	else:
		print(f"✗ No authenticated user (current_user is None)")
	
	# Query for open internships with employer info
	query = db.query(Internship).filter(Internship.status == "open")

	if search:
		query = query.filter(
			(Internship.title.ilike(f"%{search}%"))
		)

	# Industry filter (comma-separated IDs)
	if industry:
		try:
			industry_ids = [int(i) for i in industry.split(",") if i.strip().isdigit()]
			if industry_ids:
				query = query.join(Internship.employer).filter(Employer.industry_id.in_(industry_ids))
		except Exception:
			pass

	# Company filter (comma-separated employer IDs)
	if company:
		try:
			company_ids = [int(i) for i in company.split(",") if i.strip().isdigit()]
			if company_ids:
				query = query.filter(Internship.employer_id.in_(company_ids))
		except Exception:
			pass

	total_records = query.count()
	offset = (pageNo - 1) * pageSize

	internships = query.order_by(Internship.created_at.desc()).offset(offset).limit(pageSize).all()

	# Format response with employer and skills
	result_data = []
	
	print(f"\n{'='*60}")
	print(f"JOB MATCHING ALGORITHM")
	print(f"{'='*60}")
	
	# Prepare for cosine similarity if student is authenticated
	student_profile_text = ""
	if student:
		# Get program and department from enrolled class
		active_enrollment = db.query(ClassEnrollment).filter(
			ClassEnrollment.student_id == student.student_id,
			ClassEnrollment.status == "active"
		).first()
		
		program_text = ""
		department_text = ""
		
		if active_enrollment:
			class_info = db.query(Class).filter(Class.class_id == active_enrollment.class_id).first()
			if class_info and class_info.program:
				program_text = class_info.program.program_name or ""
				if class_info.program.department:
					department_text = class_info.program.department.department_name or ""
		else:
			# Fallback to student profile
			program_text = student.program or ""
			department_text = student.department or ""
		
		# Build student profile text from skills, program, major, department
		skills_text = " ".join([skill.skill_name for skill in student.skills]) if student.skills else ""
		major_text = student.major or ""
		about_text = student.about or ""
		student_profile_text = f"{skills_text} {program_text} {major_text} {department_text} {about_text}".strip()
		print(f"Student Profile Text: {student_profile_text}")
		print(f"Student Skills: {[skill.skill_name for skill in student.skills] if student.skills else []}")
		print(f"Student Program: {program_text}")
		print(f"Student Major: {major_text}")
		print(f"Student Department: {department_text}")
		print(f"Student About: {about_text[:100]}..." if about_text and len(about_text) > 100 else f"Student About: {about_text}")
	else:
		print(f"No student found - recommendations disabled")
	
	# Calculate match scores using Enhanced Matching System v2.0
	match_scores = {}
	if student:
		try:
			# Get enhanced matcher
			matcher = get_matcher()
			
			print(f"\n🎯 Using Enhanced Matching System v2.0")
			print(f"Calculating match scores for {len(internships)} internships...")
			
			# Prepare student data
			student_data = {
				'student_id': student.student_id,
				'skills': [skill.skill_name for skill in student.skills] if student.skills else [],
				'program': program_text,
				'major': student.major or "",
				'department': department_text,
				'about': student.about or ""
			}
			
			# Calculate match scores for each internship
			for internship in internships:
				internship_data = {
					'internship_id': internship.internship_id,
					'employer_id': internship.employer_id,
					'industry_id': internship.employer.industry_id if internship.employer else None,
					'skills': [skill.skill_name for skill in internship.skills] if internship.skills else [],
					'title': internship.title or "",
					'description': internship.full_description or "",
					'posting_type': internship.posting_type or "internship",
					'industry': internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else "",
					'company_name': internship.employer.company_name if internship.employer else ""
				}
				
				# Calculate match score
				result = matcher.calculate_match_score(db, student_data, internship_data)
				match_scores[internship.internship_id] = result
				
				print(f"\n--- Internship: {internship.title} ---")
				print(f"Company: {internship_data['company_name']}")
				print(f"Match Score: {result['match_score']:.4f} ({result['match_score'] * 100:.2f}%)")
				print(f"Match Label: {result['match_label']}")
				print(f"Recommended: {'YES' if result['is_recommended'] else 'NO'}")
				print(f"Components: Skills={result['components']['skill_score']:.2f}, Program={result['components']['program_score']:.2f}, Semantic={result['components']['semantic_score']:.2f}, Historical={result['components']['historical_score']:.2f}")
			
			# Store matches in database for historical tracking
			matches_to_store = [
				{
					'internship_id': internship.internship_id,
					'match_score': match_scores[internship.internship_id]['match_score'],
					'match_label': match_scores[internship.internship_id]['match_label'],
					'is_recommended': match_scores[internship.internship_id]['is_recommended'],
					'components': match_scores[internship.internship_id]['components'],
					'skill_metrics': match_scores[internship.internship_id]['skill_metrics']
				}
				for internship in internships if internship.internship_id in match_scores
			]
			matcher._store_matches(db, student.student_id, matches_to_store)
			
			print(f"\n✓ Enhanced Matching Complete - {len(match_scores)} matches calculated and stored")
			
		except Exception as e:
			print(f"\n✗ Error in enhanced matching: {str(e)}")
			import traceback
			traceback.print_exc()
	else:
		print(f"\nNo student found - recommendations disabled")
	
	for idx, internship in enumerate(internships):
		# Get match score for this internship
		match_result = match_scores.get(internship.internship_id)
		match_score = match_result['match_score'] if match_result else 0.0
		is_recommended = match_result['is_recommended'] if match_result else False
		match_label = match_result['match_label'] if match_result else "No Match"
		match_components = match_result['components'] if match_result else {}
		
		internship_dict = {
			"internship_id": internship.internship_id,
			"employer_id": internship.employer_id,
			"title": internship.title,
			"description": internship.full_description,  # Map to description for frontend
			"full_description": internship.full_description,
			"posting_type": internship.posting_type,
			"status": internship.status,
			"created_at": internship.created_at.isoformat() if internship.created_at else None,
			"updated_at": internship.updated_at.isoformat() if internship.updated_at else None,
			"company_name": internship.employer.company_name if internship.employer else None,
			"industry_id": internship.employer.industry_id if internship.employer else None,
			"industry_name": internship.employer.industry.industry_name if (internship.employer and internship.employer.industry) else None,
			"address": internship.employer.address if internship.employer else None,
			"moa_file": internship.employer.moa_file.replace("\\", "/") if (internship.employer and internship.employer.moa_file) else None,  # Include MOA file
			"duration_months": 6,  # Default value
			"skills": [skill.skill_name for skill in internship.skills] if internship.skills else [],
			"isRecommended": is_recommended,  # Use enhanced matching recommendation
			"matchScore": match_score,  # Include match score (0.0-1.0)
			"matchLabel": match_label,  # Include match label (Excellent/Strong/Good/Fair/Weak Match)
			"matchComponents": match_components  # Include component scores for detailed view
		}
		result_data.append(internship_dict)

	return {
		"status": "success",
		"data": result_data,
		"pagination": {
			"pageNo": pageNo,
			"pageSize": pageSize,
			"totalRecords": total_records,
			"totalPages": (total_records + pageSize - 1) // pageSize
		}
	}


# Define specific routes BEFORE parameterized routes
@router.get("/skills", response_model=list[SkillResponse])
def get_all_skills(
	db: Session = Depends(get_db),
	keyword: str = Query("", description="Filter skills by keyword")
):
	"""Get all available skills for autocomplete"""
	query = db.query(Skill).filter(Skill.status == "active")
	
	if keyword:
		query = query.filter(Skill.skill_name.ilike(f"%{keyword}%"))
	
	skills = query.order_by(Skill.skill_name).all()
	return skills


@router.post("", status_code=status.HTTP_201_CREATED)
def create_internship_route(
	data: InternshipCreate,
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Create a new internship posting"""
	# Get employer_id from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404
	
	internship = create_internship(employer.employer_id, data, db)
	return {
		"status": "success",
		"message": "Internship created successfully",
		"data": internship
	}


@router.get("")
def get_internships_route(
	pageNo: int = Query(1, ge=1),
	pageSize: int = Query(10, ge=1, le=100),
	keyword: str = Query(""),
	posting_type: str = Query(None, description="Filter by posting type: 'internship' or 'job_placement'"),
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Get all internships - for employers (their own), OJT coordinators (all), or OJT heads (all)"""
	user_role = current_user.get("role")
	
	# If user is OJT head or OJT coordinator, return all internships
	if user_role in ["ojt_head", "ojt_coordinator"]:
		query = db.query(Internship)
		
		if keyword:
			query = query.filter(Internship.title.ilike(f"%{keyword}%"))
		
		# Filter by posting_type if provided
		if posting_type:
			query = query.filter(Internship.posting_type == posting_type)
		
		total_records = query.count()
		offset = (pageNo - 1) * pageSize
		
		internships = query.order_by(Internship.created_at.desc()).offset(offset).limit(pageSize).all()
		
		# Format response with employer info
		result_data = []
		for internship in internships:
			# Get industry name
			industry_name = None
			if internship.employer and internship.employer.industry:
				industry_name = internship.employer.industry.industry_name
			
			internship_dict = {
				"internship_id": internship.internship_id,
				"employer_id": internship.employer_id,
				"title": internship.title,
				"description": internship.full_description,  # Map to description for frontend
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
				"pageNo": pageNo,
				"pageSize": pageSize,
				"totalRecords": total_records,
				"totalPages": (total_records + pageSize - 1) // pageSize
			}
		}
	
	# For employers, get only their internships
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404
	
	result = get_internships_by_employer(employer.employer_id, pageNo, pageSize, keyword, posting_type, db)
	return {
		"status": "success",
		"data": result["data"],
		"pagination": result["pagination"]
	}


# Student application endpoints - MUST come before /{internship_id} routes
@router.get("/my-applications")
def get_my_applications(
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Get student's own internship applications"""
	try:
		student = db.query(Student).filter(Student.user_id == current_user.get("user_id")).first()
		if not student:
			return {
				"status": "error",
				"message": "Student profile not found",
				"data": [],
				"pagination": {
					"pageNo": 1,
					"pageSize": 10,
					"totalRecords": 0,
					"totalPages": 0
				}
			}
		
		applications = db.query(InternshipApplication).filter(
			InternshipApplication.student_id == student.student_id
		).order_by(InternshipApplication.applied_at.desc()).all()
		
		result_data = []
		for app in applications:
			internship = app.internship
			employer = internship.employer if internship else None
			
			result_data.append({
				"application_id": app.application_id,
				"internship_id": app.internship_id,
				"application_letter": app.application_letter,
				"resume_path": app.resume_path,
				"status": app.status,
				"remarks": app.remarks,
				"created_at": app.created_at.isoformat() if app.created_at else None,
				"applied_at": app.applied_at.isoformat() if app.applied_at else None,
				"reviewed_at": app.reviewed_at.isoformat() if app.reviewed_at else None,
				"internship": {
					"internship_id": internship.internship_id if internship else None,
					"title": internship.title if internship else None,
					"company_name": employer.company_name if employer else None,
					"status": internship.status if internship else None
				} if internship else None
			})
		
		return {
			"status": "success",
			"data": result_data,
			"pagination": {
				"pageNo": 1,
				"pageSize": len(result_data),
				"totalRecords": len(result_data),
				"totalPages": 1
			}
		}
	except Exception as e:
		print(f"Error in get_my_applications: {str(e)}")
		import traceback
		traceback.print_exc()
		return {
			"status": "error",
			"message": str(e),
			"data": [],
			"pagination": {
				"pageNo": 1,
				"pageSize": 10,
				"totalRecords": 0,
				"totalPages": 0
			}
		}


@router.delete("/applications/{application_id}")
def withdraw_application(
	application_id: int,
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Withdraw a student's internship application"""
	try:
		# Get student from current user
		student = db.query(Student).filter(Student.user_id == current_user.get("user_id")).first()
		if not student:
			return {"status": "error", "detail": "Student profile not found"}
		
		# Find the application
		application = db.query(InternshipApplication).filter(
			InternshipApplication.application_id == application_id,
			InternshipApplication.student_id == student.student_id
		).first()
		
		if not application:
			return {"status": "error", "detail": "Application not found"}
		
		# Check if application can be withdrawn (only pending applications)
		if application.status != "pending":
			return {"status": "error", "detail": f"Cannot withdraw application with status '{application.status}'"}
		
		# Delete the application
		db.delete(application)
		db.commit()
		
		return {
			"status": "success",
			"message": "Application withdrawn successfully"
		}
	except Exception as e:
		db.rollback()
		print(f"Error withdrawing application: {str(e)}")
		import traceback
		traceback.print_exc()
		return {"status": "error", "detail": str(e)}


@router.get("/applications")
def get_internship_applications(
	internship_id: int = Query(None),
	pageNo: int = Query(1, ge=1),
	pageSize: int = Query(10, ge=1, le=100),
	status_filter: str = Query(None),
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Get applications for employer's internships"""
	try:
		print(f"\n=== Get Applications Request ===")
		print(f"Current User: {current_user}")
		
		employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
		if not employer:
			print(f"❌ No employer found for user_id: {current_user.get('user_id')}")
			return {
				"status": "error",
				"detail": "Employer profile not found",
				"data": [],
				"pagination": {
					"pageNo": 1,
					"pageSize": 10,
					"totalRecords": 0,
					"totalPages": 0
				}
			}
		
		print(f"✓ Employer found: {employer.company_name} (ID: {employer.employer_id})")
		
		# Base query - join applications with internships that belong to this employer
		query = db.query(InternshipApplication).join(
			Internship, InternshipApplication.internship_id == Internship.internship_id
		).filter(Internship.employer_id == employer.employer_id)
		
		# Filter by specific internship if provided
		if internship_id:
			query = query.filter(InternshipApplication.internship_id == internship_id)
		
		# Filter by status if provided
		if status_filter:
			query = query.filter(InternshipApplication.status == status_filter)
		
		total_records = query.count()
		print(f"✓ Found {total_records} applications")
		
		offset = (pageNo - 1) * pageSize
		
		applications = query.order_by(InternshipApplication.applied_at.desc()).offset(offset).limit(pageSize).all()
		
		result_data = []
		for app in applications:
			student = app.student
			internship = app.internship
			
			# Get student's class information
			student_class = db.query(Class).filter(Class.class_id == student.class_id).first() if student and student.class_id else None
			
			result_data.append({
				"application_id": app.application_id,
				"student_id": app.student_id,
				"student_name": f"{student.first_name} {student.last_name}" if student else None,
				"student_email": student.email if student else None,
				"student_contact": student.contact_number if student else None,
				"student_gender": student.gender if student else None,
				"student_birthdate": student.birthdate.isoformat() if student and student.birthdate else None,
				"student_program": student.program if student else None,
				"student_major": student.major if student else None,
				"student_school_year": student_class.schoolyear if student_class else None,
				"student_semester": student_class.semester if student_class else None,
				"student_section": student_class.section if student_class else None,
				"student_required_hours": student.required_hours if student else None,
				"student_skills": [skill.skill_name for skill in student.skills] if student and student.skills else [],
				"internship_id": app.internship_id,
				"internship_title": internship.title if internship else None,
				"application_letter": app.application_letter,
				"resume_path": app.resume_path,
				"status": app.status,
				"remarks": app.remarks,
				"applied_at": app.applied_at.isoformat() if app.applied_at else None,
				"reviewed_at": app.reviewed_at.isoformat() if app.reviewed_at else None
			})
		
		return {
			"status": "success",
			"data": result_data,
			"pagination": {
				"pageNo": pageNo,
				"pageSize": pageSize,
				"totalRecords": total_records,
				"totalPages": (total_records + pageSize - 1) // pageSize
			}
		}
	except Exception as e:
		print(f"❌ Error in get_internship_applications: {str(e)}")
		import traceback
		traceback.print_exc()
		return {
			"status": "error",
			"detail": str(e),
			"data": [],
			"pagination": {
				"pageNo": 1,
				"pageSize": 10,
				"totalRecords": 0,
				"totalPages": 0
			}
		}


# Generic internship CRUD endpoints - MUST come after specific routes
@router.get("/{internship_id}")
def get_internship_route(
	internship_id: int,
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Get a single internship by ID"""
	internship = get_internship_by_id(internship_id, db)
	return {
		"status": "success",
		"data": internship
	}


@router.put("/{internship_id}")
def update_internship_route(
	internship_id: int,
	data: InternshipUpdate,
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Update an internship posting"""
	# Get employer_id from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404
	
	internship = update_internship(internship_id, employer.employer_id, data, db)
	return {
		"status": "success",
		"message": "Internship updated successfully",
		"data": internship
	}


@router.delete("/{internship_id}")
def delete_internship_route(
	internship_id: int,
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Delete an internship posting"""
	# Get employer_id from current user
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404
	
	result = delete_internship(internship_id, employer.employer_id, db)
	return {
		"status": "success",
		"message": result["message"]
	}


@router.put("/applications/{application_id}/status")
def update_application_status(
	application_id: int,
	status: str = Form(...),
	remarks: str = Form(None),
	ojt_start_date: str = Form(None),  # Optional start date when accepting
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Update application status (accept/reject)"""
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404
	
	# Get application and verify it belongs to employer's internship
	application = db.query(InternshipApplication).join(
		Internship, InternshipApplication.internship_id == Internship.internship_id
	).filter(
		InternshipApplication.application_id == application_id,
		Internship.employer_id == employer.employer_id
	).first()
	
	if not application:
		return {"status": "error", "detail": "Application not found"}, 404
	
	# Validate status
	valid_statuses = ['reviewed', 'accepted', 'rejected']
	if status not in valid_statuses:
		return {"status": "error", "detail": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}, 400
	
	# VALIDATION: If accepting and setting start date, check if student's requirements are validated
	if status == 'accepted' and ojt_start_date:
		from models import RequirementSubmission
		
		# Check if student has uploaded requirements
		submissions = db.query(RequirementSubmission).filter(
			RequirementSubmission.student_id == application.student_id
		).all()
		
		if not submissions:
			return {
				"status": "error",
				"detail": "Cannot set OJT start date. Student has not uploaded any pre-OJT requirements yet."
			}, 400
		
		# Check if all submitted requirements are validated by OJT coordinator
		unvalidated_requirements = [
			sub for sub in submissions 
			if not sub.validated or sub.status != 'approved'
		]
		
		if unvalidated_requirements:
			return {
				"status": "error",
				"detail": f"Cannot set OJT start date. Student has {len(unvalidated_requirements)} requirement(s) not yet validated by OJT Coordinator. All pre-OJT requirements must be approved before starting OJT."
			}, 400
	
	application.status = status
	application.remarks = remarks
	application.reviewed_at = philippine_utcnow()
	
	# If accepting and start date provided, save it
	if status == 'accepted' and ojt_start_date:
		try:
			from datetime import datetime as dt
			application.ojt_start_date = dt.fromisoformat(ojt_start_date.replace('Z', '+00:00'))
		except Exception as e:
			print(f"⚠️ Error parsing start date: {e}")
	
	db.commit()
	db.refresh(application)
	
	return {
		"status": "success",
		"message": f"Application {status} successfully",
		"data": {
			"application_id": application.application_id,
			"status": application.status,
			"remarks": application.remarks,
			"reviewed_at": application.reviewed_at
		}
	}


@router.put("/applications/{application_id}/start-date")
def set_ojt_start_date(
	application_id: int,
	ojt_start_date: str = Form(...),
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Set or update OJT start date for accepted application (Employer only)"""
	employer = db.query(Employer).filter(Employer.user_id == current_user.get("user_id")).first()
	if not employer:
		raise HTTPException(status_code=404, detail="Employer profile not found")
	
	# Get application and verify it belongs to employer's internship
	application = db.query(InternshipApplication).join(
		Internship, InternshipApplication.internship_id == Internship.internship_id
	).filter(
		InternshipApplication.application_id == application_id,
		Internship.employer_id == employer.employer_id
	).first()
	
	if not application:
		raise HTTPException(status_code=404, detail="Application not found")
	
	# Only allow setting start date for accepted applications
	if application.status != 'accepted':
		raise HTTPException(
			status_code=400, 
			detail="Can only set start date for accepted applications"
		)
	
	# VALIDATION: Check if student's requirements are validated
	from models import RequirementSubmission
	
	submissions = db.query(RequirementSubmission).filter(
		RequirementSubmission.student_id == application.student_id
	).all()
	
	if not submissions:
		raise HTTPException(
			status_code=400,
			detail="Cannot set OJT start date. Student has not uploaded any pre-OJT requirements yet."
		)
	
	# Check if all submitted requirements are validated
	unvalidated_requirements = [
		sub for sub in submissions 
		if not sub.validated or sub.status != 'approved'
	]
	
	if unvalidated_requirements:
		raise HTTPException(
			status_code=400,
			detail=f"Cannot set OJT start date. Student has {len(unvalidated_requirements)} requirement(s) not yet validated by OJT Coordinator. All pre-OJT requirements must be approved before starting OJT."
		)
	
	# Parse and set start date
	try:
		from datetime import datetime as dt
		application.ojt_start_date = dt.fromisoformat(ojt_start_date.replace('Z', '+00:00'))
	except Exception as e:
		raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
	
	db.commit()
	db.refresh(application)
	
	return {
		"status": "success",
		"message": "OJT start date set successfully",
		"data": {
			"application_id": application.application_id,
			"student_id": application.student_id,
			"ojt_start_date": application.ojt_start_date.isoformat() if application.ojt_start_date else None
		}
	}


@router.post("/{internship_id}/apply", status_code=status.HTTP_201_CREATED)
async def apply_to_internship(
	internship_id: int,
	application_letter: str = Form(...),
	resume: UploadFile = File(None),
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Apply to an internship with cover letter and optional resume"""
	# Get student from current user
	student = db.query(Student).filter(Student.user_id == current_user.get("user_id")).first()
	if not student:
		return {"status": "error", "detail": "Student profile not found"}, 404
	
	# Check if internship exists
	internship = db.query(Internship).filter(Internship.internship_id == internship_id).first()
	if not internship:
		return {"status": "error", "detail": "Internship not found"}, 404
	
	# Check if internship is open
	if internship.status != "open":
		return {"status": "error", "detail": "This internship is not accepting applications"}, 400
	
	# Check if student has already applied
	existing_application = db.query(InternshipApplication).filter(
		InternshipApplication.student_id == student.student_id,
		InternshipApplication.internship_id == internship_id
	).first()
	
	if existing_application:
		return {"status": "error", "detail": "You have already applied to this internship"}, 400
	
	# Handle resume upload if provided
	resume_path = None
	if resume and resume.filename:
		# Validate file type
		allowed_extensions = {'.pdf', '.doc', '.docx'}
		file_ext = Path(resume.filename).suffix.lower()
		
		if file_ext not in allowed_extensions:
			return {
				"status": "error",
				"detail": "Invalid file type. Only PDF, DOC, and DOCX files are allowed"
			}, 400
		
		# Get upload directory from config
		upload_dir = get_upload_path("resumes")
		
		# Create directory if it doesn't exist
		upload_dir.mkdir(parents=True, exist_ok=True)
		
		# Generate unique filename
		unique_filename = f"{uuid.uuid4()}{file_ext}"
		file_path = upload_dir / unique_filename
		
		# Save file
		try:
			with open(file_path, "wb") as buffer:
				content = await resume.read()
				buffer.write(content)
			
			resume_path = get_upload_url("resumes", unique_filename)
		except Exception as e:
			return {"status": "error", "detail": f"Failed to upload resume: {str(e)}"}, 500
	
	# Create application
	application = InternshipApplication(
		student_id=student.student_id,
		internship_id=internship_id,
		application_letter=application_letter,
		resume_path=resume_path,
		status="pending"
	)
	
	db.add(application)
	db.commit()
	db.refresh(application)
	
	return {
		"status": "success",
		"message": "Application submitted successfully",
		"data": {
			"application_id": application.application_id,
			"student_id": application.student_id,
			"internship_id": application.internship_id,
			"application_letter": application.application_letter,
			"resume_path": application.resume_path,
			"status": application.status,
			"applied_at": application.applied_at
		}
	}


@router.get("/employer/ongoing-ojts")
async def get_employer_ongoing_ojts(
	db: Session = Depends(get_db),
	current_user: dict = Depends(get_current_user)
):
	"""Get all ongoing OJTs for the current employer"""
	from models import RequirementSubmission, StudentSupervisorAssignment, TraineeSupervisor, DailyTimeLog
	from datetime import time as dt_time
	import json
	
	# Verify user is an employer
	employer = db.query(Employer).filter(Employer.user_id == current_user['user_id']).first()
	if not employer:
		return {"status": "error", "detail": "Employer profile not found"}, 404
	
	# Query all accepted applications for this employer's internships
	ongoing_ojts = db.query(
		InternshipApplication,
		Student,
		Internship
	).join(
		Student, InternshipApplication.student_id == Student.student_id
	).join(
		Internship, InternshipApplication.internship_id == Internship.internship_id
	).filter(
		Internship.employer_id == employer.employer_id,
		InternshipApplication.status == 'accepted'
	).all()
	
	result = []
	for application, student, internship in ongoing_ojts:
		# Check if requirements are validated
		submissions = db.query(RequirementSubmission).filter(
			RequirementSubmission.student_id == student.student_id
		).all()
		
		all_validated = False
		validated_count = 0
		total_submissions = len(submissions)
		
		if submissions:
			validated_count = sum(1 for sub in submissions if sub.validated)
			all_validated = all(sub.validated for sub in submissions if sub.status == 'submitted' or sub.validated)
			has_validated = any(sub.validated for sub in submissions)
			all_validated = all_validated and has_validated
		
		# Determine OJT status
		ojt_status = "Not Started"
		if application.ojt_start_date:
			if philippine_utcnow().date() >= application.ojt_start_date.date():
				ojt_status = "Ongoing" if all_validated else "Pending Requirements"
			else:
				ojt_status = "Scheduled"
		else:
			ojt_status = "Accepted - No Start Date Set"
		
		# Get assigned supervisor
		assignment = db.query(StudentSupervisorAssignment).filter(
			StudentSupervisorAssignment.student_id == student.student_id,
			StudentSupervisorAssignment.internship_application_id == application.application_id,
			StudentSupervisorAssignment.status == "active"
		).first()
		
		supervisor_name = None
		supervisor_id = None
		if assignment:
			supervisor = db.query(TraineeSupervisor).filter(
				TraineeSupervisor.supervisor_id == assignment.supervisor_id
			).first()
			if supervisor:
				supervisor_name = f"{supervisor.first_name} {supervisor.last_name}"
				supervisor_id = supervisor.supervisor_id
		
		# Calculate OJT hours (only valid logs)
		time_logs = db.query(DailyTimeLog).filter(
			DailyTimeLog.student_id == student.student_id,
			DailyTimeLog.status == "complete"
		).all()
		
		total_ojt_hours = 0
		invalid_logs_count = 0
		work_schedule = None
		
		if employer and employer.work_schedule:
			try:
				work_schedule = json.loads(employer.work_schedule)
			except json.JSONDecodeError:
				work_schedule = None
		
		for log in time_logs:
			is_invalid = False
			
			if work_schedule and log.time_in:
				log_day = log.time_in.strftime('%A')
				day_schedule = work_schedule.get(log_day)
				
				if day_schedule is None:
					is_invalid = True
				elif day_schedule.get('start') and day_schedule.get('end') and log.time_out:
					try:
						start_parts = day_schedule['start'].split(':')
						end_parts = day_schedule['end'].split(':')
						work_start = dt_time(int(start_parts[0]), int(start_parts[1]))
						work_end = dt_time(int(end_parts[0]), int(end_parts[1]))
						
						time_in_time = log.time_in.time()
						time_out_time = log.time_out.time()
						
						if time_out_time < work_start or time_in_time > work_end or time_in_time == time_out_time:
							is_invalid = True
					except (KeyError, ValueError, IndexError):
						pass
			
			if not is_invalid:
				total_ojt_hours += float(log.total_hours) if log.total_hours else 0
			else:
				invalid_logs_count += 1
		
		result.append({
			"student_id": student.student_id,
			"student_name": f"{student.first_name} {student.last_name}",
			"sr_code": student.sr_code,
			"email": student.email,
			"contact_number": student.contact_number,
			"position": internship.title,
			"internship_id": internship.internship_id,
			"ojt_start_date": application.ojt_start_date.isoformat() if application.ojt_start_date else None,
			"accepted_date": application.reviewed_at.isoformat() if application.reviewed_at else None,
			"requirements_validated": all_validated,
			"requirements_validated_count": validated_count,
			"requirements_total": total_submissions,
			"ojt_status": ojt_status,
			"application_id": application.application_id,
			"assigned_supervisor_id": supervisor_id,
			"supervisor_name": supervisor_name,
			"hours_completed": total_ojt_hours,
			"hours_required": student.required_hours or 486,
			"invalid_logs_count": invalid_logs_count
		})
	
	return {
		"total": len(result),
		"ongoing_ojts": result
	}
