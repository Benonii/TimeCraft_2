''' This module contains the class Report '''

from v2.models.Basemodel import BaseModel
from v2.models.base import Base
from sqlalchemy import Column, DateTime, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship


class Report(BaseModel, Base):
    ''' This class is the represantation for the User object '''
    __tablename__ = "report"
    date = Column(DateTime, nullable=False)
    activity_id = Column(String(128), ForeignKey("activity.id"), nullable=False)
    time_on_task = Column(Float, nullable=False, default=0)
    time_wasted = Column(Float, nullable=False, default=0)
    comment = Column(String(255), nullable=True)
    activity = relationship("Activity", back_populates="reports")
    deleted = Column(DateTime, nullable=True)