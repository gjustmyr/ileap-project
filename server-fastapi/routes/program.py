from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.program import ProgramCreate, ProgramUpdate
from controllers import program_controller
from middleware.auth import verify_token
from typing import Optional

router = APIRouter(prefix="/api/programs", tags=["Programs"])


@router.get("")
async def get_all_programs(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    department_id: Optional[str] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all programs with pagination and filters"""
    return program_controller.get_all_programs(pageNo, pageSize, keyword, department_id, db)


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_program(
    program: ProgramCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Add new program"""
    return program_controller.add_program(program, db)


@router.get("/{program_id}")
async def get_program_by_id(
    program_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get program by ID"""
    return program_controller.get_program_by_id(program_id, db)


@router.put("/{program_id}")
async def update_program(
    program_id: int,
    program_data: ProgramUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update program"""
    return program_controller.update_program(program_id, program_data, db)


@router.put("/{program_id}/toggle-status")
async def toggle_program_status(
    program_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Toggle program status"""
    return program_controller.toggle_program_status(program_id, db)
