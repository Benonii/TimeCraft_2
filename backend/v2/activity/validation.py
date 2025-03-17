"""Task validation schemas"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional

class CreateActivityRequest(BaseModel):
    """Validation schema for activity creation"""
    unique_id: str | None = Field(None)
    name: str = Field(..., min_length=1, max_length=128)
    description: str | None = Field(None, max_length=1024)
    daily_goal: float = Field(..., gt=0)
   

class UpdateActivityRequest(BaseModel):
    """Validation schema for activity updates"""
    name: str | None = Field(None, min_length=1, max_length=128)
    description: str | None = Field(None, min_length=1, max_length=1024)
    daily_goal: float | None = Field(None, gt=0)
    weekly_goal: float | None = Field(None, gt=0)
    total_time_on_task: float | None = Field(None)
    
    @field_validator('weekly_goal')
    @classmethod
    def weekly_goal_must_be_greater_than_daily(cls, v: float | None, info) -> float | None:
        if v is None:
            return v
        daily_goal = info.data.get('daily_goal')
        if daily_goal is not None and v < daily_goal:
            raise ValueError('Weekly goal must be at least equal to daily goal')
        return v