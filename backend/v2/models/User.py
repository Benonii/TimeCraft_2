#!/usr/bin/env python3
''' This module contains the class User '''

from v2.models.Basemodel import BaseModel
from v2.models.base import Base
from sqlalchemy import Column, String, Float, Integer, Table
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    ''' This class is the represantation for the User object '''
    __table_args__ = {'extend_existing': True}
    
    email = Column(String(128), nullable=True, unique=True)
    password = Column(String(255), nullable=True)
    profile = relationship("Profile", back_populates="user", uselist=False)