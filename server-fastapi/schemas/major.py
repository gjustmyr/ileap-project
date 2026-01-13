from pydantic import BaseModel
from typing import Optional


class MajorCreate(BaseModel):
    program_id: int
    major_name: str
    abbrev: Optional[str] = None
    status: str = "active"


class MajorUpdate(BaseModel):
    major_name: Optional[str] = None
    program_id: Optional[int] = None
    abbrev: Optional[str] = None
    status: Optional[str] = None
