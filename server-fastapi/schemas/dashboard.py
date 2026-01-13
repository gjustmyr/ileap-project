from pydantic import BaseModel
from typing import Optional


class DashboardFilters(BaseModel):
    campus_id: Optional[int] = None
    program_id: Optional[int] = None
    industry_id: Optional[int] = None
    semester: Optional[str] = None  # "1st Semester", "2nd Semester", "Summer"
    school_year: Optional[str] = None  # "2024-2025", "2025-2026", etc.
    company_id: Optional[int] = None
    location: Optional[str] = None
