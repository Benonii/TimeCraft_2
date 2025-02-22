''' This module contains the class Task '''

from models.Basemodel import BaseModel, Base
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship


class Task(BaseModel, Base):
    ''' This class is the represantation for the Task object '''
    __tablename__ = "task"
    task_name = Column(String(128), nullable=False, unique=True)
    total_time_on_task = Column(Float, nullable=False, default=0)
    daily_goal = Column(Float, nullable=False)
    weekly_goal = Column(Float, nullable=False)
    user_id = Column(String(60), ForeignKey("user.id"), nullable=False)
    user = relationship("User", back_populates="task", useList=False)
    reports = relationship("Report", back_populates="task", cascade="all, delete-orphan")