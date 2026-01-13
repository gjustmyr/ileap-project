from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.section import SectionCreate, SectionUpdate
from controllers import section_controller
from middleware.auth import verify_token
from typing import Optional

router = APIRouter(prefix="/api/sections", tags=["Sections"])


@router.get("")
async def get_all_sections(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    program_id: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all sections with pagination and filters"""
    return section_controller.get_all_sections(pageNo, pageSize, keyword, program_id, db)


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_section(
    section: SectionCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Add new section"""
    return section_controller.add_section(section, db)


@router.get("/{section_id}")
async def get_section_by_id(
    section_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get section by ID"""
    return section_controller.get_section_by_id(section_id, db)


@router.put("/{section_id}")
async def update_section(
    section_id: int,
    section_data: SectionUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update section"""
    return section_controller.update_section(section_id, section_data, db)


@router.put("/{section_id}/toggle-status")
async def toggle_section_status(
    section_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Toggle section status"""
    return section_controller.toggle_section_status(section_id, db)
