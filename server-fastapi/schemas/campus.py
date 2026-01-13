from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models import StatusEnum


class CampusCreate(BaseModel):
    campus_name: str
    is_extension: bool
    parent_campus_id: Optional[int] = None
    status: StatusEnum


class CampusUpdate(BaseModel):
    campus_name: str
    is_extension: bool
    parent_campus_id: Optional[int] = None
    status: StatusEnum


class CampusResponse(BaseModel):
    campus_id: int
    campus_name: str
    is_extension: bool
    parent_campus_id: Optional[int] = None
    parent_campus_name: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
