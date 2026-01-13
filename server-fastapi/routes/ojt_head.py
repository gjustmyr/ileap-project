from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.ojt_head import OJTHeadCreate, OJTHeadUpdate
from schemas.common import Response
from controllers import ojt_head_controller
from middleware.auth import verify_token

router = APIRouter(prefix="/api/ojt-heads", tags=["OJT Heads"])


@router.get("")
async def get_all_ojt_heads(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: int = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all OJT Heads with pagination and search"""
    return ojt_head_controller.get_all_ojt_heads(db, pageNo, pageSize, keyword, campus_id)


@router.post("/register", response_model=Response, status_code=status.HTTP_201_CREATED)
async def register_ojt_head(
    ojt_head: OJTHeadCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Register new OJT Head"""
    return ojt_head_controller.register_ojt_head(ojt_head, db)


@router.get("/{user_id}")
async def get_ojt_head_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get OJT Head by user ID"""
    return ojt_head_controller.get_ojt_head_by_id(user_id, db)


@router.patch("/{user_id}", response_model=Response)
async def update_ojt_head(
    user_id: int,
    ojt_head_update: OJTHeadUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update OJT Head"""
    return ojt_head_controller.update_ojt_head(user_id, ojt_head_update, db)


@router.post("/{user_id}/send-new-password", response_model=Response)
async def send_new_password(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Generate and send new password to OJT Head"""
    return ojt_head_controller.send_new_password(user_id, db)


@router.get("/me/campuses")
async def get_my_campuses(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all campuses assigned to the logged-in OJT Head"""
    user_id = token_data.get("user_id")
    return ojt_head_controller.get_my_campuses(user_id, db)
