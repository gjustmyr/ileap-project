from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class StudentCSVRow(BaseModel):
    sr_code: str
    first_name: str
    last_name: str
    email: EmailStr


class ClassCreate(BaseModel):
    school_year: str
    semester: str
    program: str
    section: str
    class_section: str


class ClassResponse(BaseModel):
    class_id: int
    ojt_coordinator_id: int
    program_id: int
    school_year: str
    semester: str
    section: str
    class_section: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class StudentResponse(BaseModel):
    student_id: int
    sr_code: str
    first_name: str
    last_name: str
    email: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ClassWithStudents(BaseModel):
    class_info: ClassResponse
    students: List[StudentResponse]
    total_students: int
