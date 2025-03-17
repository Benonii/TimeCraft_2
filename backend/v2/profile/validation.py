"""Validation schemas for profile operations"""

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional


class ProfileUpdateRequest(BaseModel):
    """Validation schema for updating a user profile"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=128)
    username: Optional[str] = Field(None, min_length=3, max_length=128, pattern=r'^[a-zA-Z0-9_]+$')
    profile_picture_url: Optional[str] = Field(None, max_length=256)
    bio: Optional[str] = Field(None, max_length=256)
    location: Optional[str] = Field(None, max_length=128)
    weekly_work_hours_goal: Optional[float] = Field(None, ge=0)
    number_of_work_days: Optional[int] = Field(None, ge=1, le=7)
    
    @field_validator('username')
    def username_must_be_valid(cls, v):
        """Validate username format"""
        if v is None:
            return v
        if not v.isalnum() and '_' not in v:
            raise ValueError('Username must contain only alphanumeric characters and underscores')
        return v
    
    class Config:
        """Pydantic config"""
        json_schema_extra = {
            "example": {
                "full_name": "John Doe",
                "username": "johndoe",
                "email": "john.doe@example.com",
                "profile_picture_url": "https://example.com/profile.jpg",
                "bio": "Software developer with a passion for time management",
                "location": "New York, USA",
                "weekly_work_hours_goal": 40.0,
                "number_of_work_days": 5
            }
        }


class ProfileResponse(BaseModel):
    """Response schema for profile data"""
    id: str
    unique_id: str
    user_id: str
    full_name: str
    username: str
    profile_picture_url: str
    bio: str
    location: str
    weekly_work_hours_goal: float
    number_of_work_days: int
    total_productive_time: float
    total_wasted_time: float
    
    class Config:
        """Pydantic config"""
        from_attributes = True
