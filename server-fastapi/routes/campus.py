from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.campus import CampusCreate, CampusUpdate
from controllers import campus_controller
from middleware.auth import verify_token

router = APIRouter(prefix="/api/campuses", tags=["Campuses"])


@router.get("")
async def get_all_campuses(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all campuses with pagination"""
    return campus_controller.get_all_campuses(pageNo, pageSize, keyword, db)


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_campus(
    campus: CampusCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Add new campus"""
    return campus_controller.add_campus(campus, db)


@router.get("/{campus_id}")
async def get_campus_by_id(
    campus_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get campus by ID"""
    return campus_controller.get_campus_by_id(campus_id, db)


@router.put("/{campus_id}")
async def update_campus(
    campus_id: int,
    campus_data: CampusUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update campus"""
    return campus_controller.update_campus(campus_id, campus_data, db)


@router.put("/{campus_id}/toggle-status")
async def toggle_campus_status(
    campus_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Toggle campus status"""
    return campus_controller.toggle_campus_status(campus_id, db)


@router.get("/main/list")
async def get_main_campuses(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all main campuses"""
    return campus_controller.get_main_campuses(db)
