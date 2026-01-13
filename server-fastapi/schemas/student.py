from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class StudentProfileUpdate(BaseModel):
    # Personal Information
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    complexion: Optional[str] = None
    disability: Optional[str] = None
    birthdate: Optional[str] = None
    birthplace: Optional[str] = None
    citizenship: Optional[str] = None
    civil_status: Optional[str] = None
    about: Optional[str] = None
    
    # Contact Information
    present_address: Optional[str] = None
    provincial_address: Optional[str] = None
    contact_number: Optional[str] = None
    tel_no_present: Optional[str] = None
    tel_no_provincial: Optional[str] = None
    
    # Family Background
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    parents_address: Optional[str] = None
    parents_tel_no: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_tel_no: Optional[str] = None
    
    # School Information
    program: Optional[str] = None
    major: Optional[str] = None
    department: Optional[str] = None
    year_level: Optional[str] = None
    length_of_program: Optional[str] = None
    school_address: Optional[str] = None
    ojt_coordinator: Optional[str] = None
    ojt_coordinator_tel: Optional[str] = None
    ojt_head: Optional[str] = None
    ojt_head_tel: Optional[str] = None
    dean: Optional[str] = None
    dean_tel: Optional[str] = None
    
    # Emergency Contact
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_address: Optional[str] = None
    emergency_contact_tel: Optional[str] = None


class StudentProfileResponse(BaseModel):
    status: str
    message: str
    data: dict

    class Config:
        from_attributes = True
