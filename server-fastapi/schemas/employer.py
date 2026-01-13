from typing import Optional
from datetime import datetime, time
from pydantic import BaseModel, EmailStr, Field


class EmployerCreate(BaseModel):
	email_address: EmailStr
	first_name: Optional[str] = None
	last_name: Optional[str] = None
	company_name: str
	company_overview: Optional[str] = None
	representative_name: Optional[str] = None
	company_size: Optional[int] = Field(default=None, ge=1)
	industry_id: int
	email: EmailStr
	phone_number: Optional[str] = None
	address: Optional[str] = None
	website: Optional[str] = None
	facebook: Optional[str] = None
	linkedin: Optional[str] = None
	twitter: Optional[str] = None
	eligibility: str = "both"
	internship_validity: Optional[datetime] = None
	job_placement_validity: Optional[datetime] = None
	moa_file: Optional[str] = None


class EmployerUpdate(BaseModel):
	email_address: Optional[EmailStr] = None
	first_name: Optional[str] = None
	last_name: Optional[str] = None
	company_name: Optional[str] = None
	company_overview: Optional[str] = None
	representative_name: Optional[str] = None
	company_size: Optional[int] = Field(default=None, ge=1)
	industry_id: Optional[int] = None
	email: Optional[EmailStr] = None
	phone_number: Optional[str] = None
	address: Optional[str] = None
	website: Optional[str] = None
	facebook: Optional[str] = None
	linkedin: Optional[str] = None
	twitter: Optional[str] = None
	eligibility: Optional[str] = None
	internship_validity: Optional[datetime] = None
	job_placement_validity: Optional[datetime] = None
	moa_file: Optional[str] = None
	status: Optional[str] = None
	work_schedule: Optional[str] = None  # JSON string


class EmployerInternshipMinimalCreate(BaseModel):
	email_address: EmailStr
	company_name: str
	internship_start: datetime
	internship_end: datetime
	moa_file: Optional[str] = None


class EmployerResponse(BaseModel):
	employer_id: int
	user_id: int
	email_address: EmailStr
	company_name: str
	company_overview: Optional[str]
	representative_name: Optional[str]
	company_size: Optional[int]
	industry_id: Optional[int]
	email: EmailStr
	phone_number: Optional[str]
	address: Optional[str]
	website: Optional[str]
	facebook: Optional[str]
	linkedin: Optional[str]
	twitter: Optional[str]
	logo: Optional[str]
	eligibility: str
	internship_validity: Optional[datetime]
	job_placement_validity: Optional[datetime]
	moa_file: Optional[str]
	status: str
	work_schedule: Optional[str]

	class Config:
		from_attributes = True


class EmployerSimpleCreate(BaseModel):
	email_address: EmailStr
	company_name: str
	representative_name: str
	phone_number: str
	industry_id: int
	validity_start: datetime
	validity_end: datetime

