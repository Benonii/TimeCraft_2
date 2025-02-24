from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, Field, field_validator

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    def password_validator(cls, v):
        if not v.strip():
            raise ValueError('Password cannot be empty')
        return v



class SignupRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    username: str
    weekly_work_hours_goal: Annotated[int, Field(gt=0)]  # positive integer
    number_of_work_days: Annotated[int, Field(ge=1, le=7)]  # integer between 1 and 7

    @field_validator('password', 'username')
    def fields_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Field cannot be empty')
        return v