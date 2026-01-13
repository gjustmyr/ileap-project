from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from models import Internship, Employer, Skill
from schemas.internship import InternshipCreate, InternshipUpdate
from datetime import datetime


def create_internship(employer_id: int, data: InternshipCreate, db: Session):
	"""Create a new internship posting"""
	# Verify employer exists
	employer = db.query(Employer).filter(Employer.employer_id == employer_id).first()
	if not employer:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employer not found")
	
	# Set status based on is_draft
	initial_status = "draft" if data.is_draft else "pending"
	
	new_internship = Internship(
		employer_id=employer_id,
		title=data.title,
		full_description=data.full_description,
		posting_type=data.posting_type,
		status=initial_status,
	)
	
	# Handle skills
	if data.skills:
		for skill_name in data.skills:
			# Check if skill already exists
			skill = db.query(Skill).filter(Skill.skill_name.ilike(skill_name)).first()
			if not skill:
				# Create new skill if it doesn't exist
				skill = Skill(skill_name=skill_name.strip())
				db.add(skill)
				db.flush()  # Flush to get the skill_id
			new_internship.skills.append(skill)
	
	db.add(new_internship)
	db.commit()
	db.refresh(new_internship)
	
	return new_internship


def get_internships_by_employer(employer_id: int, page_no: int, page_size: int, keyword: str, db: Session):
	"""Get all internships for a specific employer with pagination"""
	query = db.query(Internship).options(joinedload(Internship.skills)).filter(Internship.employer_id == employer_id)
	
	# Apply keyword search
	if keyword:
		query = query.filter(Internship.title.ilike(f"%{keyword}%"))
	
	# Get total count
	total_records = query.count()
	
	# Apply pagination
	offset = (page_no - 1) * page_size
	internships = query.order_by(Internship.created_at.desc()).offset(offset).limit(page_size).all()
	
	return {
		"data": internships,
		"pagination": {
			"totalRecords": total_records,
			"pageNo": page_no,
			"pageSize": page_size
		}
	}


def get_internship_by_id(internship_id: int, db: Session):
	"""Get a single internship by ID"""
	internship = db.query(Internship).options(joinedload(Internship.skills)).filter(Internship.internship_id == internship_id).first()
	if not internship:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
	return internship


def update_internship(internship_id: int, employer_id: int, data: InternshipUpdate, db: Session):
	"""Update an internship posting"""
	internship = db.query(Internship).filter(
		Internship.internship_id == internship_id,
		Internship.employer_id == employer_id
	).first()
	
	if not internship:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
	
	# Update fields
	if data.title is not None:
		internship.title = data.title
	if data.full_description is not None:
		internship.full_description = data.full_description
	if data.status is not None:
		internship.status = data.status
	
	# Update skills
	if data.skills is not None:
		internship.skills.clear()  # Remove all existing skills
		for skill_name in data.skills:
			# Check if skill already exists
			skill = db.query(Skill).filter(Skill.skill_name.ilike(skill_name)).first()
			if not skill:
				# Create new skill if it doesn't exist
				skill = Skill(skill_name=skill_name.strip())
				db.add(skill)
				db.flush()
			internship.skills.append(skill)
	
	internship.updated_at = datetime.utcnow()
	db.commit()
	db.refresh(internship)
	
	return internship


def delete_internship(internship_id: int, employer_id: int, db: Session):
	"""Delete an internship posting"""
	internship = db.query(Internship).filter(
		Internship.internship_id == internship_id,
		Internship.employer_id == employer_id
	).first()
	
	if not internship:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found")
	
	db.delete(internship)
	db.commit()
	
	return {"message": "Internship deleted successfully"}
