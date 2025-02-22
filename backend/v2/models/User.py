#!/usr/bin/env python3
''' This module contains the class User '''

from models.Basemodel import BaseModel, Base
from sqlalchemy import Column, String, Float, Integer
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    ''' This class is the represantation for the User object '''
    __tablename__ = "user"
    email = Column(String(128), nullable=True, unique=True)
    password = Column(String(255), nullable=True)
    profile = relationship("Profile", back_populates="user", uselist=False)
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")