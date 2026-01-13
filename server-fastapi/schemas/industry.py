from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class IndustryCreate(BaseModel):
    industry_name: str = Field(..., min_length=1, max_length=100)
    status: Optional[str] = Field(default="active", max_length=20)


class IndustryUpdate(BaseModel):
    industry_name: str = Field(..., min_length=1, max_length=100)
    status: Optional[str] = Field(default=None, max_length=20)


class IndustryResponse(BaseModel):
    industry_id: int
    industry_name: str
    status: str
    
    class Config:
        from_attributes = True
