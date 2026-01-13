from pydantic import BaseModel
from typing import Optional


class ProgramCreate(BaseModel):
    department_id: int
    program_name: str
    abbrev: Optional[str] = None
    status: str = "active"


class ProgramUpdate(BaseModel):
    program_name: Optional[str] = None
    department_id: Optional[int] = None
    abbrev: Optional[str] = None
    status: Optional[str] = None
