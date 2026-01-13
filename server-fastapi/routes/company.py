from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from controllers import employer_controller

router = APIRouter(
    prefix="/api/companies",
    tags=["companies"]
)

@router.get("", summary="Get all companies", response_model=list[dict])
def get_companies(db: Session = Depends(get_db)):
    """Return all companies (employer_id and company_name)"""
    return employer_controller.get_companies(db)
