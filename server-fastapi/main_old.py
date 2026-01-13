from fastapi import FastAPI, HTTPException, status, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import bcrypt
import jwt
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import string
import os
from dotenv import load_dotenv

# Import database and models
from database import get_db, engine
from models import Base, User, SuperAdminProfile, Campus, OJTHead, Department, StatusEnum

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ILEAP API")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# CORS configuration
origins = [
    "http://localhost:4200",  # Superadmin
    "http://localhost:4201",  # Employer
    "http://localhost:4202",  # OJT Coordinator
    "http://localhost:4203",  # OJT Head
    "http://localhost:4204",  # Student Trainee
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class SuperAdminCreate(BaseModel):
    email_address: EmailStr
    first_name: str
    last_name: str
    contact_number: str
    position_title: str
    admin_key: str


class LoginRequest(BaseModel):
    email_address: EmailStr
    password: str


class LoginResponse(BaseModel):
    status: str
    data: dict
    message: str


class Response(BaseModel):
    status: str
    data: list
    message: str


class CampusCreate(BaseModel):
    campus_name: str
    is_extension: bool
    parent_campus_id: Optional[int] = None
    status: StatusEnum


class CampusUpdate(BaseModel):
    campus_name: str
    is_extension: bool
    parent_campus_id: Optional[int] = None
    status: StatusEnum


class CampusResponse(BaseModel):
    campus_id: int
    campus_name: str
    is_extension: bool
    parent_campus_id: Optional[int] = None
    parent_campus_name: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DepartmentCreate(BaseModel):
    campus_id: int
    department_name: str
    abbrev: Optional[str] = None
    dean_name: Optional[str] = None
    dean_email: Optional[str] = None
    dean_contact: Optional[str] = None
    status: StatusEnum


class DepartmentUpdate(BaseModel):
    department_name: str
    abbrev: Optional[str] = None
    dean_name: Optional[str] = None
    dean_email: Optional[str] = None
    dean_contact: Optional[str] = None
    status: StatusEnum


# Generate random password
def generate_password(length: int = 12) -> str:
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(characters) for _ in range(length))
    # BCrypt has a 72 byte limit
    return password[:72]


# Create JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


# Send email
def send_email(to: str, subject: str, body: str):
    try:
        msg = MIMEMultipart()
        msg['From'] = os.getenv("EMAIL_USER")
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
        
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


@app.post("/api/auth/login", response_model=LoginResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email
    user = db.query(User).filter(User.email_address == credentials.email_address).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": user.email_address, "role": user.role, "user_id": user.user_id}
    )
    
    return LoginResponse(
        status="SUCCESS",
        data={
            "token": access_token
        },
        message="Login successful"
    )


@app.get("/")
def read_root():
    return {"message": "ILEAP FastAPI Server", "version": "1.0.0"}


@app.post("/api/superadmin", response_model=Response, status_code=status.HTTP_201_CREATED)
async def create_superadmin(admin: SuperAdminCreate, db: Session = Depends(get_db)):
    # Validate admin key
    if admin.admin_key != os.getenv("SUPER_ADMIN_KEY"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Invalid admin key"
        )
    
    # Check if superadmin already exists
    existing_user = db.query(User).filter(
        User.email_address == admin.email_address,
        User.role == "superadmin"
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Superadmin already exists."
        )
    
    # Generate password
    generated_password = generate_password()
    # Hash password with bcrypt
    hashed_password = bcrypt.hashpw(
        generated_password.encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    # Create user
    try:
        new_user = User(
            email_address=admin.email_address,
            password=hashed_password,
            role="superadmin"
        )
        db.add(new_user)
        db.flush()  # Get the user_id
        
        # Create superadmin profile
        new_profile = SuperAdminProfile(
            user_id=new_user.user_id,
            first_name=admin.first_name,
            last_name=admin.last_name,
            contact_number=admin.contact_number,
            position_title=admin.position_title
        )
        db.add(new_profile)
        db.commit()
        
        # Send email
        email_body = f"""Hello {admin.first_name} {admin.last_name},

Your Super Admin account has been created successfully.

Email: {admin.email_address}
Temporary Password: {generated_password}

Please login and change your password immediately.

Best regards,
ILEAP System"""
        
        email_sent = send_email(
            admin.email_address,
            "ILEAP - Super Admin Account Created",
            email_body
        )
        
        if not email_sent:
            return Response(
                status="SUCCESS",
                data=[],
                message="Super admin created but email delivery failed. Please contact system administrator."
            )
        
        return Response(
            status="SUCCESS",
            data=[],
            message="Super admin created successfully. Password sent to email."
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )


# JWT Token Verification Middleware
def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


# Campus CRUD Endpoints
@app.get("/api/campuses")
async def get_all_campuses(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        offset = (pageNo - 1) * pageSize
        
        # Build query with keyword filter
        query = db.query(Campus)
        if keyword:
            query = query.filter(Campus.campus_name.ilike(f"%{keyword}%"))
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        campuses = query.offset(offset).limit(pageSize).all()
        
        # Convert to dict
        campus_list = []
        for campus in campuses:
            campus_list.append({
                "campus_id": campus.campus_id,
                "campus_name": campus.campus_name,
                "is_extension": campus.is_extension,
                "parent_campus_id": campus.parent_campus_id,
                "parent_campus_name": campus.parent_campus.campus_name if campus.parent_campus else None,
                "status": campus.status.value if hasattr(campus.status, 'value') else campus.status,
                "created_at": campus.created_at.isoformat() if campus.created_at else None,
                "updated_at": campus.updated_at.isoformat() if campus.updated_at else None
            })
        
        return {
            "status": "SUCCESS",
            "data": campus_list,
            "message": "Campuses fetched successfully.",
            "pagination": {
                "currentPage": pageNo,
                "pageSize": pageSize,
                "hasMore": len(campuses) == pageSize,
                "totalRecords": total
            }
        }
    except Exception as e:
        print(f"Error in get_all_campuses: {str(e)}")  # Add logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error while retrieving campuses: {str(e)}"
        )


@app.post("/api/campuses", status_code=status.HTTP_201_CREATED)
async def add_campus(
    campus: CampusCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        # Validate parent campus if extension
        if campus.is_extension and campus.parent_campus_id:
            parent = db.query(Campus).filter(Campus.campus_id == campus.parent_campus_id).first()
            if not parent:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent campus not found."
                )
        
        new_campus = Campus(
            campus_name=campus.campus_name,
            is_extension=campus.is_extension,
            parent_campus_id=campus.parent_campus_id if campus.is_extension else None,
            status=campus.status
        )
        db.add(new_campus)
        db.commit()
        db.refresh(new_campus)
        
        return {
            "status": "SUCCESS",
            "message": "Campus added successfully."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while adding campus."
        )


@app.get("/api/campuses/{campus_id}")
async def get_campus_by_id(
    campus_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
        
        if not campus:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campus not found."
            )
        
        return {
            "status": "SUCCESS",
            "data": {
                "campus_id": campus.campus_id,
                "campus_name": campus.campus_name,
                "is_extension": campus.is_extension,
                "parent_campus_id": campus.parent_campus_id,
                "parent_campus_name": campus.parent_campus.campus_name if campus.parent_campus else None,
                "extensions": [{
                    "campus_id": ext.campus_id,
                    "campus_name": ext.campus_name
                } for ext in campus.extensions] if hasattr(campus, 'extensions') else [],
                "status": campus.status.value if hasattr(campus.status, 'value') else campus.status,
                "created_at": campus.created_at.isoformat() if campus.created_at else None,
                "updated_at": campus.updated_at.isoformat() if campus.updated_at else None
            },
            "message": "Campus fetched successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_campus_by_id: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error while retrieving campus: {str(e)}"
        )


@app.put("/api/campuses/{campus_id}")
async def update_campus(
    campus_id: int,
    campus_data: CampusUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
        
        if not campus:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campus not found."
            )
        
        # Validate parent campus if extension
        if campus_data.is_extension and campus_data.parent_campus_id:
            parent = db.query(Campus).filter(Campus.campus_id == campus_data.parent_campus_id).first()
            if not parent:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Parent campus not found."
                )
        
        campus.campus_name = campus_data.campus_name
        campus.is_extension = campus_data.is_extension
        campus.parent_campus_id = campus_data.parent_campus_id if campus_data.is_extension else None
        campus.status = campus_data.status
        campus.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "SUCCESS",
            "message": "Campus updated successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while updating campus."
        )


@app.put("/api/campuses/{campus_id}/toggle-status")
async def toggle_campus_status(
    campus_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        campus = db.query(Campus).filter(Campus.campus_id == campus_id).first()
        
        if not campus:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campus not found."
            )
        
        # Toggle status
        campus.status = StatusEnum.inactive if campus.status == StatusEnum.active else StatusEnum.active
        campus.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "SUCCESS",
            "message": "Campus status toggled successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while toggling campus status."
        )


@app.get("/api/campuses/main/list")
async def get_main_campuses(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    """Get all main campuses (non-extensions) for dropdown"""
    try:
        main_campuses = db.query(Campus).filter(
            Campus.is_extension == False,
            Campus.status == StatusEnum.active
        ).all()
        
        campus_list = [{
            "campus_id": campus.campus_id,
            "campus_name": campus.campus_name
        } for campus in main_campuses]
        
        return {
            "status": "SUCCESS",
            "data": campus_list,
            "message": "Main campuses fetched successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while retrieving main campuses."
        )


# Department CRUD Endpoints
@app.get("/api/departments")
async def get_all_departments(
    campus_id: Optional[int] = None,
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        offset = (pageNo - 1) * pageSize
        
        # Build query
        query = db.query(Department)
        
        # Filter by campus if provided
        if campus_id:
            query = query.filter(Department.campus_id == campus_id)
        
        # Filter by keyword
        if keyword:
            query = query.filter(Department.department_name.ilike(f"%{keyword}%"))
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        departments = query.offset(offset).limit(pageSize).all()
        
        # Convert to dict
        dept_list = []
        for dept in departments:
            dept_list.append({
                "department_id": dept.department_id,
                "campus_id": dept.campus_id,
                "campus_name": dept.campus.campus_name if dept.campus else None,
                "department_name": dept.department_name,
                "department_code": dept.department_code,
                "dean_name": dept.dean_name,
                "dean_email": dept.dean_email,
                "dean_contact": dept.dean_contact,
                "status": dept.status.value if hasattr(dept.status, 'value') else dept.status,
                "created_at": dept.created_at.isoformat() if dept.created_at else None,
                "updated_at": dept.updated_at.isoformat() if dept.updated_at else None
            })
        
        return {
            "status": "SUCCESS",
            "data": dept_list,
            "message": "Departments fetched successfully.",
            "pagination": {
                "currentPage": pageNo,
                "pageSize": pageSize,
                "hasMore": len(departments) == pageSize,
                "totalRecords": total
            }
        }
    except Exception as e:
        print(f"Error in get_all_departments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error while retrieving departments: {str(e)}"
        )


@app.post("/api/departments", status_code=status.HTTP_201_CREATED)
async def add_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        # Validate campus exists
        campus = db.query(Campus).filter(Campus.campus_id == department.campus_id).first()
        if not campus:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campus not found."
            )
        
        new_dept = Department(
            campus_id=department.campus_id,
            department_name=department.department_name,
            abbrev=department.abbrev,
            dean_name=department.dean_name,
            dean_email=department.dean_email,
            dean_contact=department.dean_contact,
            status=department.status
        )
        db.add(new_dept)
        db.commit()
        db.refresh(new_dept)
        
        return {
            "status": "SUCCESS",
            "message": "Department added successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error in add_department: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while adding department."
        )


@app.get("/api/departments/{department_id}")
async def get_department_by_id(
    department_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        dept = db.query(Department).filter(Department.department_id == department_id).first()
        
        if not dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found."
            )
        
        return {
            "status": "SUCCESS",
            "data": {
                "department_id": dept.department_id,
                "campus_id": dept.campus_id,
                "campus_name": dept.campus.campus_name if dept.campus else None,
                "department_name": dept.department_name,
                "department_code": dept.department_code,
                "dean_name": dept.dean_name,
                "dean_email": dept.dean_email,
                "dean_contact": dept.dean_contact,
                "status": dept.status.value if hasattr(dept.status, 'value') else dept.status,
                "created_at": dept.created_at.isoformat() if dept.created_at else None,
                "updated_at": dept.updated_at.isoformat() if dept.updated_at else None
            },
            "message": "Department fetched successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_department_by_id: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error while retrieving department: {str(e)}"
        )


@app.put("/api/departments/{department_id}")
async def update_department(
    department_id: int,
    dept_data: DepartmentUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        dept = db.query(Department).filter(Department.department_id == department_id).first()
        
        if not dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found."
            )
        
        dept.department_name = dept_data.department_name
        dept.abbrev = dept_data.abbrev
        dept.dean_name = dept_data.dean_name
        dept.dean_email = dept_data.dean_email
        dept.dean_contact = dept_data.dean_contact
        dept.status = dept_data.status
        dept.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "SUCCESS",
            "message": "Department updated successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error in update_department: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while updating department."
        )


@app.put("/api/departments/{department_id}/toggle-status")
async def toggle_department_status(
    department_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)
):
    try:
        dept = db.query(Department).filter(Department.department_id == department_id).first()
        
        if not dept:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found."
            )
        
        # Toggle status
        dept.status = StatusEnum.inactive if dept.status == StatusEnum.active else StatusEnum.active
        dept.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "SUCCESS",
            "message": "Department status toggled successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error while toggling department status."
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3000)))
