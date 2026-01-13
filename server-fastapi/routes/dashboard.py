from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from controllers import dashboard_controller
from middleware.auth import verify_token
from typing import Optional

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/statistics")
async def get_dashboard_statistics(
    campus_id: Optional[int] = Query(None),
    program_id: Optional[int] = Query(None),
    industry_id: Optional[int] = Query(None),
    semester: Optional[str] = Query(None),
    school_year: Optional[str] = Query(None),
    company_id: Optional[int] = Query(None),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get dashboard statistics with optional filters"""
    return dashboard_controller.get_dashboard_statistics(
        db=db,
        campus_id=campus_id,
        program_id=program_id,
        industry_id=industry_id,
        semester=semester,
        school_year=school_year,
        company_id=company_id,
        location=location
    )


@router.get("/filter-options")
async def get_filter_options(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all available filter options for dashboard"""
    return dashboard_controller.get_filter_options(db)
