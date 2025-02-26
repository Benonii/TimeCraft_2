"""Report validation schemas"""

from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import pytz
from typing import Dict, List

class CreateReportRequest(BaseModel):
    """Validation schema for report creation"""
    activity_id: str = Field(..., min_length=1)
    date: datetime
    time_on_task: float = Field(..., ge=0)
    time_wasted: float = Field(..., ge=0)
    comment: str | None = Field(None, max_length=255)

    @field_validator('date')
    @classmethod
    def validate_date(cls, v: datetime) -> datetime:
        # Convert naive datetime to UTC if no timezone is provided
        if v.tzinfo is None:
            v = v.replace(tzinfo=pytz.UTC)
        
        # Compare with current UTC time
        now = datetime.now(pytz.UTC)
        if v > now:
            raise ValueError("Report date cannot be in the future")
        return v

class ReportResponse(BaseModel):
    """Schema for individual report in response"""
    id: str
    unique_id: str
    date: datetime
    time_on_task: float
    time_wasted: float
    comment: str | None

class ActivityDailyStats(BaseModel):
    """Schema for daily activity statistics"""
    activity_name: str
    total_time_on_task: float
    total_time_wasted: float
    reports: List[ReportResponse]

class DailyReportResponse(BaseModel):
    """Schema for complete daily report response"""
    date: datetime
    total_productive_time: float
    total_wasted_time: float
    activities: Dict[str, ActivityDailyStats] 