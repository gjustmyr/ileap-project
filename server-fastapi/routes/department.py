from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.department import DepartmentCreate, DepartmentUpdate
from controllers import department_controller
from middleware.auth import verify_token
from typing import Optional

router = APIRouter(prefix="/api/departments", tags=["Departments"])


@router.get("")
async def get_all_departments(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all departments with pagination and filters"""
    return department_controller.get_all_departments(pageNo, pageSize, keyword, campus_id, db)


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Add new department"""
    return department_controller.add_department(department, db)


@router.get("/{department_id}")
async def get_department_by_id(
    department_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get department by ID"""
    return department_controller.get_department_by_id(department_id, db)


@router.put("/{department_id}")
async def update_department(
    department_id: int,
    dept_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update department"""
    return department_controller.update_department(department_id, dept_data, db)


@router.put("/{department_id}/toggle-status")
async def toggle_department_status(
    department_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Toggle department status"""
    return department_controller.toggle_department_status(department_id, db)
