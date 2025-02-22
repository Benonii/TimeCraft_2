#!/usr/bin/env python3
''' This module contains the class User '''

from models.Basemodel import BaseModel, Base
from sqlalchemy import Column, ForeignKey, String, Float, Integer
from sqlalchemy.orm import relationship


class Profile(BaseModel, Base):
    ''' This class is the represantation for the User object '''
    __tablename__ = "profile"
    user_id = Column(String(60), ForeignKey('user.id'), nullable=False)
    full_name = Column(String(128), nullable=False)
    username = Column(String(128), nullable=False, unique=True)
    weekly_work_hours_goal = Column(Float, nullable=False)
    number_of_work_days = Column(Integer, nullable=False)
    total_productive_time = Column(Float, nullable=False, default=0)
    total_wasted_time = Column(Float, nullable=False, default=0)
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    user = relationship("User", back_populates="profile", uselist=False)
