#!/usr/bin/env python3
''' This module contains the class definition of Task '''

from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship


class Task(BaseModel, Base):
    ''' This is the class that will represent Task objects '''

    __tablename__ = "tasks"
    task_name = Column(String(128), nullable=False, unique=True)
    total_time_on_task = Column(Float, default=0)
    daily_goal = Column(Float, nullable=False)
    weekly_goal = Column(Float, nullable=False)
    user_id = Column(String(60), ForeignKey("users.unique_id"), nullable=False)
    user = relationship("User", back_populates="tasks")
    logs = relationship("DailyLog", back_populates="task", cascade="all, delete-orphan")

