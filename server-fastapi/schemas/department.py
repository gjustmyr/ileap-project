from pydantic import BaseModel
from typing import Optional
from models import StatusEnum


class DepartmentCreate(BaseModel):
    campus_id: int
    department_name: str
    abbrev: Optional[str] = None
    dean_name: Optional[str] = None
    dean_email: Optional[str] = None
    dean_contact: Optional[str] = None
    status: StatusEnum


class DepartmentUpdate(BaseModel):
    department_name: str
    abbrev: Optional[str] = None
    dean_name: Optional[str] = None
    dean_email: Optional[str] = None
    dean_contact: Optional[str] = None
    status: StatusEnum
