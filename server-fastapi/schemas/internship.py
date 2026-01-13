from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SkillBase(BaseModel):
	skill_name: str


class SkillResponse(BaseModel):
	skill_id: int
	skill_name: str

	class Config:
		from_attributes = True


class InternshipCreate(BaseModel):
	title: str
	full_description: str
	posting_type: str = "internship"  # 'internship' or 'job_placement'
	is_draft: bool = True
	skills: List[str] = []  # List of skill names


class InternshipUpdate(BaseModel):
	title: Optional[str] = None
	full_description: Optional[str] = None
	status: Optional[str] = None
	skills: Optional[List[str]] = None


class InternshipResponse(BaseModel):
	internship_id: int
	employer_id: int
	title: str
	full_description: str
	posting_type: str
	status: str
	skills: List[SkillResponse] = []
	created_at: datetime
	updated_at: datetime

	class Config:
		from_attributes = True


class ApplicationCreate(BaseModel):
	application_letter: str


class ApplicationResponse(BaseModel):
	application_id: int
	student_id: int
	internship_id: int
	application_letter: str
	resume_path: Optional[str] = None
	status: str
	remarks: Optional[str] = None
	applied_at: datetime
	reviewed_at: Optional[datetime] = None

	class Config:
		from_attributes = True
