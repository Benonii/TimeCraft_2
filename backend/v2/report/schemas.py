from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


class ReportResponse(BaseModel):
    """Pydantic model for serializing Report responses"""
    id: str
    unique_id: str
    date: datetime
    activity_id: str
    time_on_task: float = Field(ge=0)
    time_wasted: float = Field(ge=0)
    comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,  # Allows conversion from SQLAlchemy model
        json_encoders={datetime: lambda dt: dt.isoformat()}  # ISO format for datetime serialization
    ) 