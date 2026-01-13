from pydantic import BaseModel
from typing import Optional


class SectionCreate(BaseModel):
    program_id: int
    major_id: Optional[int] = None
    year_level: int
    section_name: str
    status: str = "active"


class SectionUpdate(BaseModel):
    program_id: Optional[int] = None
    major_id: Optional[int] = None
    year_level: Optional[int] = None
    section_name: Optional[str] = None
    status: Optional[str] = None
