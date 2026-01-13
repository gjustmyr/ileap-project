from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.ojt_coordinator import OJTCoordinatorCreate, OJTCoordinatorUpdate
from schemas.common import Response
from controllers import ojt_coordinator_controller
from middleware.auth import verify_token

router = APIRouter(prefix="/api/ojt-coordinators", tags=["OJT Coordinators"])


@router.get("/superadmin/all")
async def get_all_coordinators_superadmin(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: int = None,
    department_id: int = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all OJT Coordinators for Superadmin (no filtering)"""
    print(f"[ROUTE DEBUG] GET /api/ojt-coordinators/superadmin/all called")
    print(f"[ROUTE DEBUG] Token data: {token_data}")
    user_role = token_data.get("role")
    print(f"[ROUTE DEBUG] User Role: {user_role}")
    
    if user_role != "superadmin":
        print(f"[ROUTE DEBUG] Access denied - not superadmin")
        return {"status": "ERROR", "message": "Access denied", "data": []}
    
    print(f"[ROUTE DEBUG] Calling get_all_ojt_coordinators_for_superadmin")
    result = ojt_coordinator_controller.get_all_ojt_coordinators_for_superadmin(db, pageNo, pageSize, keyword, campus_id, department_id)
    print(f"[ROUTE DEBUG] Result from controller: {result}")
    return result


@router.get("")
async def get_all_ojt_coordinators(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: int = None,
    department_id: int = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all OJT Coordinators for logged-in OJT Head"""
    print(f"[ROUTE DEBUG] GET /api/ojt-coordinators called")
    user_id = token_data.get("user_id")
    user_role = token_data.get("role")
    print(f"[ROUTE DEBUG] User ID: {user_id}, User Role: {user_role}")
    
    return ojt_coordinator_controller.get_all_ojt_coordinators(db, user_id, pageNo, pageSize, keyword, campus_id, department_id)


@router.post("/register", response_model=Response, status_code=status.HTTP_201_CREATED)
async def register_ojt_coordinator(
    coordinator: OJTCoordinatorCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Register new OJT Coordinator"""
    ojt_head_user_id = token_data.get("user_id")
    return ojt_coordinator_controller.register_ojt_coordinator(coordinator, ojt_head_user_id, db)


@router.get("/{user_id}")
async def get_ojt_coordinator_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get OJT Coordinator by user ID"""
    return ojt_coordinator_controller.get_ojt_coordinator_by_id(user_id, db)


@router.patch("/{user_id}", response_model=Response)
async def update_ojt_coordinator(
    user_id: int,
    coordinator_update: OJTCoordinatorUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update OJT Coordinator"""
    ojt_head_user_id = token_data.get("user_id")
    return ojt_coordinator_controller.update_ojt_coordinator(user_id, coordinator_update, ojt_head_user_id, db)


@router.post("/{user_id}/send-new-password", response_model=Response)
async def send_new_password(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Generate and send new password to OJT Coordinator"""
    ojt_head_user_id = token_data.get("user_id")
    return ojt_coordinator_controller.send_new_password(user_id, ojt_head_user_id, db)


@router.post("/send-account", response_model=Response, status_code=status.HTTP_201_CREATED)
async def send_account_to_coordinator(
    coordinator: OJTCoordinatorCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Send new account to OJT Coordinator (for superadmin)"""
    print(f"[ROUTE DEBUG] POST /api/ojt-coordinators/send-account called")
    user_role = token_data.get("role")
    print(f"[ROUTE DEBUG] User Role: {user_role}")
    
    if user_role != "superadmin":
        print(f"[ROUTE DEBUG] Access denied - not superadmin")
        return Response(
            message="Only superadmin can send new accounts",
            success=False,
            data=None
        )
    
    print(f"[ROUTE DEBUG] Calling send_account_to_coordinator")
    result = ojt_coordinator_controller.send_account_to_coordinator(coordinator, db)
    print(f"[ROUTE DEBUG] Result: {result}")
    return result


@router.put("/{user_id}", response_model=Response)
async def update_ojt_coordinator_superadmin(
    user_id: int,
    coordinator_update: OJTCoordinatorUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update OJT Coordinator (for superadmin using PUT)"""
    print(f"[ROUTE DEBUG] PUT /api/ojt-coordinators/{user_id} called")
    user_role = token_data.get("role")
    print(f"[ROUTE DEBUG] User Role: {user_role}")
    
    if user_role != "superadmin":
        print(f"[ROUTE DEBUG] Access denied - not superadmin")
        return Response(
            message="Only superadmin can update coordinators",
            success=False,
            data=None
        )
    
    print(f"[ROUTE DEBUG] Calling update_ojt_coordinator_superadmin")
    result = ojt_coordinator_controller.update_ojt_coordinator_superadmin(user_id, coordinator_update, db)
    print(f"[ROUTE DEBUG] Result: {result}")
    return result
    
    return ojt_coordinator_controller.update_ojt_coordinator_superadmin(user_id, coordinator_update, db)


@router.put("/{user_id}/status", response_model=Response)
async def update_coordinator_status(
    user_id: int,
    status_update: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Update OJT Coordinator status (for superadmin)"""
    user_role = token_data.get("user_role")
    
    if user_role != "superadmin":
        return Response(
            message="Only superadmin can update coordinator status",
            success=False,
            data=None
        )
    
    new_status = status_update.get("status")
    return ojt_coordinator_controller.update_coordinator_status(user_id, new_status, db)
