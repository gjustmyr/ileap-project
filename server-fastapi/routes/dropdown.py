from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from middleware.auth import verify_token
from models import Campus, Department, Industry, Skill

router = APIRouter(prefix="/api/dropdown", tags=["Dropdowns"])


@router.get("/campuses")
async def get_active_campuses(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get all active campuses for dropdown"""
    campuses = db.query(Campus).filter(Campus.status == "active").order_by(Campus.campus_name.asc()).all()
    
    data = [
        {
            "campus_id": c.campus_id,
            "campus_name": c.campus_name
        }
        for c in campuses
    ]
    
    return {"data": data}


@router.get("/departments")
async def get_active_departments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get all active departments for dropdown"""
    departments = db.query(Department).filter(Department.status == "active").order_by(Department.department_name.asc()).all()
    
    data = [
        {
            "department_id": d.department_id,
            "department_name": d.department_name
        }
        for d in departments
    ]
    
    return {"data": data}


@router.get("/industries")
async def get_active_industries(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get all active industries for dropdown"""
    industries = db.query(Industry).filter(Industry.status == "active").order_by(Industry.industry_name.asc()).all()
    
    data = [
        {
            "industry_id": i.industry_id,
            "industry_name": i.industry_name
        }
        for i in industries
    ]
    
    return {"data": data}


@router.get("/skills")
async def get_active_skills(
    db: Session = Depends(get_db),
    current_user: dict = Depends(verify_token)
):
    """Get all active skills for dropdown"""
    skills = db.query(Skill).filter(Skill.status == "active").order_by(Skill.skill_name.asc()).all()
    
    data = [
        {
            "skill_id": s.skill_id,
            "skill_name": s.skill_name
        }
        for s in skills
    ]
    
    return {"data": data}
