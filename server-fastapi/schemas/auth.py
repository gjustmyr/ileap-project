from pydantic import BaseModel, EmailStr


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
    expected_role: str | None = None  # Optional: Role expected for this portal


class LoginResponse(BaseModel):
    status: str
    data: dict
    message: str
