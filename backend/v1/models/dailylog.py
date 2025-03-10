#!/usr/bin/env python3

from models.basemodel import BaseModel, Base
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime


class DailyLog(BaseModel, Base):
    ''' This is the class representation of the Object DailyLog '''
    __tablename__ = "daily_log"
    month = Column(String(60), nullable=False)
    day = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    task_id = Column(String(128), ForeignKey("tasks.unique_id"), nullable=False)
    time_on_task = Column(Float, nullable=False, default=0)
    time_wasted = Column(Float, nullable=False, default=0)
    day_of_week = Column(String(55), nullable=False)
    date = Column(String(60), nullable=True)
    task = relationship("Task", back_populates="logs")