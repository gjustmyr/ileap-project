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


class LoginResponse(BaseModel):
    status: str
    data: dict
    message: str


class ForgotPasswordRequest(BaseModel):
    email_address: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
