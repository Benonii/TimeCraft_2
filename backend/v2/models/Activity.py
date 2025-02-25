''' This module contains the class Activity '''

from v2.models.Basemodel import BaseModel
from v2.models.base import Base
from v2.models.Profile import Profile
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Activity(BaseModel, Base):
    ''' This class is the represantation for the Task object '''
    __tablename__ = "activity"
    name = Column(String(128), nullable=False, unique=True)
    description = Column(String(1024), nullable=True)
    total_time_on_task = Column(Float, nullable=False, default=0)
    daily_goal = Column(Float, nullable=False)
    weekly_goal = Column(Float, nullable=False)
    user_id = Column(String(60), ForeignKey("profile.id"), nullable=False)
    user = relationship("Profile", back_populates="activities")
    reports = relationship("Report", back_populates="activity", cascade="all, delete-orphan")
    deleted = Column(DateTime, nullable=True)