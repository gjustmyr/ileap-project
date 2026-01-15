from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Table, Date, Numeric, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum

from database import Base

# Junction table for many-to-many relationship between Internship and Skill
internship_skills = Table(
	'internship_skills',
	Base.metadata,
	Column('internship_id', Integer, ForeignKey('internships.internship_id'), primary_key=True),
	Column('skill_id', Integer, ForeignKey('skills.skill_id'), primary_key=True)
)

# Junction table for many-to-many relationship between Student and Skill
student_skills = Table(
	'student_skills',
	Base.metadata,
	Column('student_id', Integer, ForeignKey('students.student_id'), primary_key=True),
	Column('skill_id', Integer, ForeignKey('skills.skill_id'), primary_key=True)
)


class ClassEnrollment(Base):
	"""Junction table for many-to-many relationship between Student and Class"""
	__tablename__ = "class_enrollments"

	enrollment_id = Column(Integer, primary_key=True, index=True)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	class_id = Column(Integer, ForeignKey("classes.class_id", ondelete="CASCADE"), nullable=False)
	enrollment_date = Column(DateTime, default=datetime.utcnow, nullable=False)
	status = Column(String(20), default="active", nullable=False)  # active, completed, dropped
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	# Relationships
	student = relationship("Student", back_populates="class_enrollments")
	class_enrolled = relationship("Class", back_populates="enrollments")


class StatusEnum(str, Enum):
	active = "active"
	inactive = "inactive"
	pending = "pending"


class User(Base):
	__tablename__ = "users"

	user_id = Column(Integer, primary_key=True, index=True)
	email_address = Column(String(255), unique=True, nullable=False, index=True)
	password = Column(String(255), nullable=False)
	role = Column(String(50), nullable=False)


class Campus(Base):
	__tablename__ = "campuses"

	campus_id = Column(Integer, primary_key=True, index=True)
	campus_name = Column(String(150), nullable=False)
	is_extension = Column(Boolean, default=False)
	parent_campus_id = Column(Integer, ForeignKey("campuses.campus_id"), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	parent_campus = relationship("Campus", remote_side=[campus_id], backref="extension_campuses")
	departments = relationship("Department", back_populates="campus")
	ojt_heads = relationship("OJTHead", back_populates="campus")


class Industry(Base):
	__tablename__ = "industries"

	industry_id = Column(Integer, primary_key=True, index=True)
	industry_name = Column(String(100), nullable=False)
	status = Column(String(20), default="active")


class Employer(Base):
	__tablename__ = "employers"

	employer_id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)

	company_name = Column(String(100), nullable=False)
	company_overview = Column(Text, nullable=True)
	representative_name = Column(String(100), nullable=True)
	company_size = Column(Integer, nullable=True)

	industry_id = Column(Integer, ForeignKey("industries.industry_id"), nullable=True)

	email = Column(String(150), nullable=False)
	phone_number = Column(String(20), nullable=True)
	address = Column(Text, nullable=True)
	website = Column(String(150), nullable=True)
	facebook = Column(String(150), nullable=True)
	linkedin = Column(String(150), nullable=True)
	twitter = Column(String(150), nullable=True)
	logo = Column(String(255), nullable=True)

	eligibility = Column(String(13), nullable=False, default="internship")
	internship_validity = Column(DateTime, nullable=True)
	job_placement_validity = Column(DateTime, nullable=True)
	moa_file = Column(String(255), nullable=True)

	# Working hours configuration - JSON format per day
	# Example: {"Monday": {"start": "08:00", "end": "17:00", "breaks": [{"start": "12:00", "end": "13:00"}]}, ...}
	work_schedule = Column(Text, nullable=True)  # JSON string

	status = Column(String(8), nullable=False, default="pending")

	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	user = relationship("User", backref="employer", uselist=False)
	industry = relationship("Industry")
	internships = relationship("Internship", back_populates="employer")


class Skill(Base):
	__tablename__ = "skills"

	skill_id = Column(Integer, primary_key=True, index=True)
	skill_name = Column(String(100), nullable=False, unique=True)
	status = Column(String(20), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)

	internships = relationship("Internship", secondary=internship_skills, back_populates="skills")
	students = relationship("Student", secondary="student_skills", back_populates="skills")


class Internship(Base):
	__tablename__ = "internships"

	internship_id = Column(Integer, primary_key=True, index=True)
	employer_id = Column(Integer, ForeignKey("employers.employer_id"), nullable=False)
	
	title = Column(String(255), nullable=False)
	full_description = Column(Text, nullable=False)
	posting_type = Column(String(20), nullable=False, default="internship")  # 'internship' or 'job_placement'
	status = Column(String(20), nullable=False, default="draft")  # 'draft', 'pending', 'approved', 'open', 'closed', 'archived'
	
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	employer = relationship("Employer", back_populates="internships")
	skills = relationship("Skill", secondary=internship_skills, back_populates="internships")
	applications = relationship("InternshipApplication", back_populates="internship", cascade="all, delete-orphan")


class InternshipApplication(Base):
	"""Model for student applications to internships"""
	__tablename__ = "internship_applications"

	application_id = Column(Integer, primary_key=True, index=True)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	internship_id = Column(Integer, ForeignKey("internships.internship_id", ondelete="CASCADE"), nullable=False)
	application_letter = Column(Text, nullable=False)
	resume_path = Column(String(500), nullable=True)
	status = Column(String(20), default="pending")  # 'pending', 'reviewed', 'accepted', 'rejected', 'withdrawn'
	remarks = Column(Text, nullable=True)
	applied_at = Column(DateTime, default=datetime.utcnow)
	reviewed_at = Column(DateTime, nullable=True)
	ojt_start_date = Column(DateTime, nullable=True)  # Date when student starts OJT (set by employer upon acceptance)
	semester = Column(String(20), nullable=True)  # '1st Semester', '2nd Semester', 'Summer'
	school_year = Column(String(20), nullable=True)  # '2024-2025', '2025-2026', etc.
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationships
	student = relationship("Student", backref="internship_applications")
	internship = relationship("Internship", back_populates="applications")


class Department(Base):
	__tablename__ = "departments"

	department_id = Column(Integer, primary_key=True, index=True)
	campus_id = Column(Integer, ForeignKey("campuses.campus_id"), nullable=False)
	department_name = Column(String(150), nullable=False)
	abbrev = Column(String(20), nullable=True)
	dean_name = Column(String(200), nullable=True)
	dean_email = Column(String(255), nullable=True)
	dean_contact = Column(String(20), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	campus = relationship("Campus", back_populates="departments")
	programs = relationship("Program", back_populates="department")
	ojt_coordinators = relationship("OJTCoordinator", back_populates="department")


class Program(Base):
	__tablename__ = "programs"

	program_id = Column(Integer, primary_key=True, index=True)
	department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
	program_name = Column(String(150), nullable=False)
	abbrev = Column(String(20), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	department = relationship("Department", back_populates="programs")
	majors = relationship("Major", back_populates="program")
	sections = relationship("Section", back_populates="program")


class Major(Base):
	__tablename__ = "majors"

	major_id = Column(Integer, primary_key=True, index=True)
	program_id = Column(Integer, ForeignKey("programs.program_id"), nullable=False)
	major_name = Column(String(150), nullable=False)
	abbrev = Column(String(20), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	program = relationship("Program", back_populates="majors")
	sections = relationship("Section", back_populates="major")


class Section(Base):
	__tablename__ = "sections"

	section_id = Column(Integer, primary_key=True, index=True)
	program_id = Column(Integer, ForeignKey("programs.program_id"), nullable=False)
	major_id = Column(Integer, ForeignKey("majors.major_id"), nullable=True)
	year_level = Column(Integer, nullable=False)
	section_name = Column(String(50), nullable=False)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	program = relationship("Program", back_populates="sections")
	major = relationship("Major", back_populates="sections")


class OJTHead(Base):
	__tablename__ = "ojt_heads"

	ojt_head_id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
	campus_id = Column(Integer, ForeignKey("campuses.campus_id"), nullable=False)
	first_name = Column(String(100), nullable=False)
	last_name = Column(String(100), nullable=False)
	contact_number = Column(String(20), nullable=True)
	position_title = Column(String(100), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	user = relationship("User", backref="ojt_head")
	campus = relationship("Campus", back_populates="ojt_heads")


class OJTCoordinator(Base):
	__tablename__ = "ojt_coordinators"

	ojt_coordinator_id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, unique=True)
	campus_id = Column(Integer, ForeignKey("campuses.campus_id"), nullable=False)
	department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
	first_name = Column(String(100), nullable=False)
	last_name = Column(String(100), nullable=False)
	contact_number = Column(String(20), nullable=True)
	position_title = Column(String(100), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	user = relationship("User", backref="ojt_coordinator")
	campus = relationship("Campus", backref="ojt_coordinators")
	department = relationship("Department", back_populates="ojt_coordinators")


class Class(Base):
	__tablename__ = "classes"

	class_id = Column(Integer, primary_key=True, index=True)
	ojt_coordinator_id = Column(Integer, ForeignKey("ojt_coordinators.ojt_coordinator_id"), nullable=False)
	program_id = Column(Integer, ForeignKey("programs.program_id"), nullable=False)
	school_year = Column(String(20), nullable=False)
	semester = Column(String(20), nullable=False)
	section = Column(String(10), nullable=False)
	class_section = Column(String(50), nullable=False)  # e.g., BCPET-1201
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	coordinator = relationship("OJTCoordinator", backref="classes")
	program = relationship("Program", backref="classes")
	enrollments = relationship("ClassEnrollment", back_populates="class_enrolled", cascade="all, delete-orphan")


class Student(Base):
	__tablename__ = "students"

	student_id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, unique=True)
	sr_code = Column(String(20), unique=True, nullable=False, index=True)
	
	# Personal Information
	first_name = Column(String(100), nullable=False)
	middle_name = Column(String(100), nullable=True)
	last_name = Column(String(100), nullable=False)
	email = Column(String(255), nullable=False)
	age = Column(Integer, nullable=True)
	sex = Column(String(10), nullable=True)
	height = Column(String(20), nullable=True)
	weight = Column(String(20), nullable=True)
	complexion = Column(String(50), nullable=True)
	disability = Column(String(255), nullable=True)
	birthdate = Column(String(20), nullable=True)
	birthplace = Column(String(255), nullable=True)
	citizenship = Column(String(100), nullable=True)
	civil_status = Column(String(20), nullable=True)
	
	# Contact Information
	present_address = Column(Text, nullable=True)
	provincial_address = Column(Text, nullable=True)
	contact_number = Column(String(20), nullable=True)
	tel_no_present = Column(String(20), nullable=True)
	tel_no_provincial = Column(String(20), nullable=True)
	
	# Family Background
	father_name = Column(String(255), nullable=True)
	father_occupation = Column(String(255), nullable=True)
	mother_name = Column(String(255), nullable=True)
	mother_occupation = Column(String(255), nullable=True)
	parents_address = Column(Text, nullable=True)
	parents_tel_no = Column(String(20), nullable=True)
	guardian_name = Column(String(255), nullable=True)
	guardian_tel_no = Column(String(20), nullable=True)
	
	# School Information
	program = Column(String(255), nullable=True)
	major = Column(String(255), nullable=True)
	department = Column(String(255), nullable=True)
	year_level = Column(String(20), nullable=True)
	length_of_program = Column(String(50), nullable=True)
	school_address = Column(Text, nullable=True)
	ojt_coordinator = Column(String(255), nullable=True)
	ojt_coordinator_tel = Column(String(20), nullable=True)
	ojt_head = Column(String(255), nullable=True)
	ojt_head_tel = Column(String(20), nullable=True)
	dean = Column(String(255), nullable=True)
	dean_tel = Column(String(20), nullable=True)
	
	# Emergency Contact
	emergency_contact_name = Column(String(255), nullable=True)
	emergency_contact_relationship = Column(String(100), nullable=True)
	emergency_contact_address = Column(Text, nullable=True)
	emergency_contact_tel = Column(String(20), nullable=True)
	
	# Profile Picture
	profile_picture = Column(String(255), nullable=True)
	
	# About/Bio
	about = Column(Text, nullable=True)
	
	# OJT Grade
	final_grade = Column(String(10), nullable=True)
	
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	user = relationship("User", backref="student")
	class_enrollments = relationship("ClassEnrollment", back_populates="student", cascade="all, delete-orphan")
	skills = relationship("Skill", secondary="student_skills", back_populates="students")



class TraineeSupervisor(Base):
	__tablename__ = "trainee_supervisors"

	supervisor_id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, unique=True)
	employer_id = Column(Integer, ForeignKey("employers.employer_id"), nullable=False)
	first_name = Column(String(100), nullable=False)
	last_name = Column(String(100), nullable=False)
	email = Column(String(255), nullable=False, unique=True, index=True)
	phone_number = Column(String(20), nullable=True)
	position = Column(String(100), nullable=True)
	department = Column(String(100), nullable=True)
	status = Column(String(8), default="active")
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow)

	user = relationship("User", backref="trainee_supervisor")
	employer = relationship("Employer", backref="trainee_supervisors")


class StudentSupervisorAssignment(Base):
	"""Model for assigning supervisors to students during their OJT"""
	__tablename__ = "student_supervisor_assignments"

	assignment_id = Column(Integer, primary_key=True, index=True)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	supervisor_id = Column(Integer, ForeignKey("trainee_supervisors.supervisor_id", ondelete="CASCADE"), nullable=False)
	internship_application_id = Column(Integer, ForeignKey("internship_applications.application_id", ondelete="CASCADE"), nullable=False)
	assigned_at = Column(DateTime, default=datetime.utcnow)
	status = Column(String(20), default="active")  # 'active', 'completed', 'terminated'
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationships
	student = relationship("Student", backref="supervisor_assignments")
	supervisor = relationship("TraineeSupervisor", backref="student_assignments")
	application = relationship("InternshipApplication", backref="supervisor_assignment")


class DailyOJTRecord(Base):
	"""Model for daily OJT time tracking and accomplishments"""
	__tablename__ = "daily_ojt_records"

	record_id = Column(Integer, primary_key=True, index=True)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	internship_application_id = Column(Integer, ForeignKey("internship_applications.application_id", ondelete="CASCADE"), nullable=False)
	record_date = Column(DateTime, nullable=False)  # Date of the OJT day
	time_in = Column(DateTime, nullable=True)  # When student clocked in
	time_out = Column(DateTime, nullable=True)  # When student clocked out
	task_for_the_day = Column(Text, nullable=True)  # Tasks assigned/planned
	accomplishment_for_the_day = Column(Text, nullable=True)  # What was accomplished
	remarks = Column(Text, nullable=True)  # Additional notes or supervisor remarks
	status = Column(String(20), default="draft")  # 'draft', 'submitted', 'validated'
	submitted_at = Column(DateTime, nullable=True)
	validated_at = Column(DateTime, nullable=True)
	validated_by = Column(Integer, ForeignKey("trainee_supervisors.supervisor_id"), nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationships
	student = relationship("Student", backref="ojt_records")
	application = relationship("InternshipApplication", backref="ojt_records")
	validator = relationship("TraineeSupervisor", backref="validated_records")


class RequirementSubmission(Base):
	"""Model for student requirement submissions"""
	__tablename__ = "requirement_submissions"

	id = Column(Integer, primary_key=True, index=True)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	requirement_id = Column(Integer, nullable=False)
	file_url = Column(String(500), nullable=False)
	status = Column(String(50), default="submitted")
	validated = Column(Boolean, default=False)
	returned = Column(Boolean, default=False)
	remarks = Column(Text, nullable=True)
	submitted_at = Column(DateTime, default=datetime.utcnow)
	validated_at = Column(DateTime, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationship
	student = relationship("Student", backref="requirement_submissions")


class RequirementTemplate(Base):
	"""Model for OJT requirement templates (managed by OJT Head)"""
	__tablename__ = "requirement_templates"

	template_id = Column(Integer, primary_key=True, index=True)
	requirement_id = Column(Integer, unique=True, nullable=False, index=True)
	title = Column(String(200), nullable=False)
	description = Column(Text, nullable=True)
	type = Column(String(20), nullable=False)  # 'pre' or 'post'
	template_url = Column(String(500), nullable=True)  # URL to downloadable template
	is_required = Column(Boolean, default=True)
	order_index = Column(Integer, nullable=False)  # For sorting
	accessible_to = Column(String(100), default="student,coordinator")  # Who can access this requirement
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DailyTimeLog(Base):
	"""Model for daily time in/out logs for OJT students"""
	__tablename__ = "daily_time_logs"

	log_id = Column(Integer, primary_key=True, index=True)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	application_id = Column(Integer, ForeignKey("internship_applications.application_id", ondelete="CASCADE"), nullable=False)
	log_date = Column(Date, nullable=False, default=datetime.utcnow)
	time_in = Column(DateTime, nullable=True)
	time_out = Column(DateTime, nullable=True)
	total_hours = Column(Numeric(5, 2), nullable=True)
	status = Column(String(20), default="incomplete")  # 'incomplete', 'complete'
	modified_after_date = Column(Boolean, default=False)  # True if edited after log_date has passed
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationships
	student = relationship("Student", backref="daily_time_logs")
	application = relationship("InternshipApplication", backref="daily_time_logs")
	accomplishments = relationship("DailyAccomplishment", back_populates="time_log", cascade="all, delete-orphan")


class Alumni(Base):
	"""Model for alumni who have graduated"""
	__tablename__ = "alumni"

	alumni_id = Column(Integer, primary_key=True, index=True)
	first_name = Column(String(50), nullable=False)
	middle_name = Column(String(50), nullable=True)
	last_name = Column(String(50), nullable=False)
	email = Column(String(100), nullable=False, unique=True)
	sr_code = Column(String(50), nullable=True)
	program_id = Column(Integer, ForeignKey("programs.program_id"), nullable=True)
	graduation_year = Column(Integer, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationships
	program = relationship("Program", backref="alumni")


class DailyAccomplishment(Base):
	"""Model for daily tasks and accomplishments for OJT students"""
	__tablename__ = "daily_accomplishments"

	accomplishment_id = Column(Integer, primary_key=True, index=True)
	log_id = Column(Integer, ForeignKey("daily_time_logs.log_id", ondelete="CASCADE"), nullable=False)
	student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
	log_date = Column(Date, nullable=False, default=datetime.utcnow)
	tasks = Column(Text, nullable=True)
	accomplishments = Column(Text, nullable=True)
	created_at = Column(DateTime, default=datetime.utcnow)
	updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	# Relationships
	student = relationship("Student", backref="daily_accomplishments")
	time_log = relationship("DailyTimeLog", back_populates="accomplishments")
