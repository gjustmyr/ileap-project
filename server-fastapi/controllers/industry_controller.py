from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from models import Industry
from schemas.industry import IndustryCreate, IndustryUpdate


def get_all_industries(db: Session, page: int = 1, per_page: int = 10, keyword: Optional[str] = None):
	query = db.query(Industry)
	if keyword:
		query = query.filter(Industry.industry_name.ilike(f"%{keyword}%"))
	total = query.count()
	items = (
		query.order_by(Industry.industry_name.asc())
		.offset((page - 1) * per_page)
		.limit(per_page)
		.all()
	)
	industries = [
		{
			"industry_id": i.industry_id,
			"industry_name": i.industry_name,
			"status": i.status,
		}
		for i in items
	]
	return {"industries": industries, "pagination": {"page": page, "per_page": per_page, "total_records": total}}


def create_industry(industry_data: IndustryCreate, db: Session):
	exists = db.query(Industry).filter(Industry.industry_name == industry_data.industry_name).first()
	if exists:
		raise HTTPException(status_code=400, detail="Industry already exists")
	ind = Industry(industry_name=industry_data.industry_name, status=industry_data.status or "active")
	db.add(ind)
	db.commit()
	db.refresh(ind)
	return {"message": "Industry created", "industry_id": ind.industry_id}


def get_industry_by_id(industry_id: int, db: Session):
	ind = db.query(Industry).filter(Industry.industry_id == industry_id).first()
	if not ind:
		raise HTTPException(status_code=404, detail="Industry not found")
	return {"industry_id": ind.industry_id, "industry_name": ind.industry_name, "status": ind.status}


def update_industry(industry_id: int, industry_data: IndustryUpdate, db: Session):
	ind = db.query(Industry).filter(Industry.industry_id == industry_id).first()
	if not ind:
		raise HTTPException(status_code=404, detail="Industry not found")
	data = industry_data.dict(exclude_unset=True)
	for k, v in data.items():
		setattr(ind, k, v)
	db.commit()
	return {"message": "Industry updated"}


def delete_industry(industry_id: int, db: Session):
	ind = db.query(Industry).filter(Industry.industry_id == industry_id).first()
	if not ind:
		raise HTTPException(status_code=404, detail="Industry not found")
	db.delete(ind)
	db.commit()
	return {"message": "Industry deleted"}
