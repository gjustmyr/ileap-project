from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from middleware.auth import verify_token
from schemas.industry import IndustryCreate, IndustryUpdate, IndustryResponse
from controllers import industry_controller

router = APIRouter(prefix="/api/industries", tags=["Industries"])


@router.get("")
async def get_all_industries(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    keyword: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get all industries with pagination"""
    return industry_controller.get_all_industries(
        db=db,
        page=page,
        per_page=per_page,
        keyword=keyword
    )


@router.post("")
async def create_industry(
    industry: IndustryCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Create a new industry"""
    return industry_controller.create_industry(industry_data=industry, db=db)


@router.get("/{industry_id}")
async def get_industry_by_id(
    industry_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get industry by ID"""
    return industry_controller.get_industry_by_id(industry_id=industry_id, db=db)


@router.put("/{industry_id}")
async def update_industry(
    industry_id: int,
    industry: IndustryUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Update industry"""
    return industry_controller.update_industry(
        industry_id=industry_id,
        industry_data=industry,
        db=db
    )


@router.delete("/{industry_id}")
async def delete_industry(
    industry_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Delete industry"""
    return industry_controller.delete_industry(industry_id=industry_id, db=db)
