from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class OJTCoordinatorCreate(BaseModel):
    email_address: EmailStr
    first_name: str
    last_name: str
    contact_number: Optional[str] = None
    position_title: Optional[str] = None
    campus_id: int
    department_id: int


class OJTCoordinatorUpdate(BaseModel):
    email_address: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    contact_number: Optional[str] = None
    position_title: Optional[str] = None
    campus_id: Optional[int] = None
    department_id: Optional[int] = None
    status: Optional[str] = None


class OJTCoordinatorResponse(BaseModel):
    user_id: int
    email_address: str
    first_name: str
    last_name: str
    contact_number: Optional[str]
    position_title: Optional[str]
    campus_id: int
    campus_name: str
    department_id: int
    department_name: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
