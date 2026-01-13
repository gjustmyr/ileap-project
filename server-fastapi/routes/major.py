from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.major import MajorCreate, MajorUpdate
from controllers import major_controller
from middleware.auth import verify_token
from typing import Optional

router = APIRouter(prefix="/api/majors", tags=["Majors"])


@router.get("")
async def get_all_majors(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    program_id: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all majors with pagination and filters"""
    return major_controller.get_all_majors(pageNo, pageSize, keyword, program_id, db)


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_major(
    major: MajorCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Add new major"""
    return major_controller.add_major(major, db)


@router.get("/{major_id}")
async def get_major_by_id(
    major_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get major by ID"""
    return major_controller.get_major_by_id(major_id, db)


@router.put("/{major_id}")
async def update_major(
    major_id: int,
    major_data: MajorUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update major"""
    return major_controller.update_major(major_id, major_data, db)


@router.put("/{major_id}/toggle-status")
async def toggle_major_status(
    major_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Toggle major status"""
    return major_controller.toggle_major_status(major_id, db)
