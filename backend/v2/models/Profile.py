#!/usr/bin/env python3
''' This module contains the class User '''

from v2.models.Basemodel import BaseModel
from v2.models.base import Base
from v2.models.User import User
from sqlalchemy import Column, ForeignKey, String, Float, Integer, DateTime
from sqlalchemy.orm import relationship


class Profile(BaseModel, Base):
    ''' This class is the representation for the Profile object '''
    __tablename__ = "profile"
    user_id = Column(String(60), ForeignKey('user.id'), nullable=False, unique=True)
    full_name = Column(String(128), nullable=False)
    username = Column(String(128), nullable=False, unique=True)
    profile_picture_url = Column(String(256), nullable=False)
    bio = Column(String(256), nullable=False)
    location = Column(String(128), nullable=False)
    weekly_work_hours_goal = Column(Float, nullable=False)
    number_of_work_days = Column(Integer, nullable=False)
    total_productive_time = Column(Float, nullable=False, default=0)
    total_wasted_time = Column(Float, nullable=False, default=0)
    activities = relationship("Activity", back_populates="user", primaryjoin="and_(Profile.user_id==Activity.user_id, Activity.deleted==None)")
    user = relationship("User", back_populates="profile", uselist=False)
    deleted = Column(DateTime, nullable=True)
