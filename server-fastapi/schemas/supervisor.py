from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class SupervisorCreate(BaseModel):
	email: EmailStr
	first_name: str
	last_name: str
	phone_number: Optional[str] = None
	position: Optional[str] = None
	department: Optional[str] = None


class SupervisorUpdate(BaseModel):
	first_name: str
	last_name: str
	email: EmailStr
	phone_number: Optional[str] = None
	position: Optional[str] = None
	department: Optional[str] = None
	status: str


class SupervisorResponse(BaseModel):
	supervisor_id: int
	user_id: int
	employer_id: int
	first_name: str
	last_name: str
	email: str
	phone_number: Optional[str]
	position: Optional[str]
	department: Optional[str]
	status: str
	created_at: datetime
	updated_at: datetime

	class Config:
		from_attributes = True
