from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import TraineeSupervisor, User, Employer
from schemas.supervisor import SupervisorCreate, SupervisorUpdate
from datetime import datetime
import secrets
import string
from controllers.employer_controller import hash_password, send_email


def generate_password(length=12):
	characters = string.ascii_letters + string.digits + string.punctuation
	return ''.join(secrets.choice(characters) for _ in range(length))


def get_all_supervisors(
	db: Session,
	employer_id: int,
	page: int = 1,
	page_size: int = 10,
	keyword: str = None
):
	query = db.query(TraineeSupervisor).filter(TraineeSupervisor.employer_id == employer_id)

	if keyword:
		search = f"%{keyword}%"
		query = query.filter(
			or_(
				TraineeSupervisor.first_name.ilike(search),
				TraineeSupervisor.last_name.ilike(search),
				TraineeSupervisor.email.ilike(search),
				TraineeSupervisor.position.ilike(search),
				TraineeSupervisor.department.ilike(search)
			)
		)

	total = query.count()
	supervisors = query.offset((page - 1) * page_size).limit(page_size).all()

	# Convert to dictionaries
	supervisor_list = [
		{
			"supervisor_id": s.supervisor_id,
			"user_id": s.user_id,
			"employer_id": s.employer_id,
			"first_name": s.first_name,
			"last_name": s.last_name,
			"email": s.email,
			"phone_number": s.phone_number,
			"position": s.position,
			"department": s.department,
			"status": s.status,
			"created_at": s.created_at,
			"updated_at": s.updated_at
		}
		for s in supervisors
	]

	return {
		"data": supervisor_list,
		"pagination": {
			"total": total,
			"page": page,
			"page_size": page_size,
			"total_pages": (total + page_size - 1) // page_size
		}
	}


def create_supervisor(db: Session, employer_id: int, payload: SupervisorCreate):
	# Check if email already exists
	existing_user = db.query(User).filter(User.email_address == payload.email).first()
	if existing_user:
		raise ValueError("Email already exists")

	# Generate temporary password
	temp_password = generate_password()
	hashed_password = hash_password(temp_password)

	# Create user account
	new_user = User(
		email_address=payload.email,
		password=hashed_password,
		role="trainee_supervisor"
	)
	db.add(new_user)
	db.flush()

	# Create supervisor record
	new_supervisor = TraineeSupervisor(
		user_id=new_user.user_id,
		employer_id=employer_id,
		first_name=payload.first_name,
		last_name=payload.last_name,
		email=payload.email,
		phone_number=payload.phone_number,
		position=payload.position,
		department=payload.department,
		status="active"
	)
	db.add(new_supervisor)
	db.commit()
	db.refresh(new_supervisor)

	# Send email with credentials
	try:
		send_email(
			to_email=payload.email,
			subject="Welcome - Trainee Supervisor Account Created",
			body=f"""
			<h2>Welcome to ILEAP!</h2>
			<p>Your trainee supervisor account has been created.</p>
			<p><strong>Email:</strong> {payload.email}</p>
			<p><strong>Temporary Password:</strong> {temp_password}</p>
			<p>Please log in and change your password immediately.</p>
			"""
		)
	except Exception as e:
		print(f"Failed to send email: {e}")

	return new_supervisor


def update_supervisor(db: Session, supervisor_id: int, employer_id: int, payload: SupervisorUpdate):
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.supervisor_id == supervisor_id,
		TraineeSupervisor.employer_id == employer_id
	).first()

	if not supervisor:
		raise ValueError("Supervisor not found")

	# Check if email is being changed and if it already exists
	if payload.email != supervisor.email:
		existing_user = db.query(User).filter(User.email_address == payload.email).first()
		if existing_user:
			raise ValueError("Email already exists")

		# Update user email
		user = db.query(User).filter(User.user_id == supervisor.user_id).first()
		if user:
			user.email_address = payload.email

	# Update supervisor fields
	supervisor.first_name = payload.first_name
	supervisor.last_name = payload.last_name
	supervisor.email = payload.email
	supervisor.phone_number = payload.phone_number
	supervisor.position = payload.position
	supervisor.department = payload.department
	supervisor.status = payload.status
	supervisor.updated_at = datetime.utcnow()

	db.commit()
	db.refresh(supervisor)

	return supervisor


def delete_supervisor(db: Session, supervisor_id: int, employer_id: int):
	supervisor = db.query(TraineeSupervisor).filter(
		TraineeSupervisor.supervisor_id == supervisor_id,
		TraineeSupervisor.employer_id == employer_id
	).first()

	if not supervisor:
		raise ValueError("Supervisor not found")

	# Delete user account
	user = db.query(User).filter(User.user_id == supervisor.user_id).first()
	if user:
		db.delete(user)

	db.delete(supervisor)
	db.commit()

	return {"message": "Supervisor deleted successfully"}
