#!/usr/bin/python3
"""This module defines a base class for all models in our hbnb clone"""

import uuid
import string
import secrets
import models
from datetime import datetime
from sqlalchemy.orm import declarative_base
from sqlalchemy import String, Column, Integer, DateTime

Base = declarative_base()


class BaseModel:
    """A base class for all timecraft modeles"""
    id = Column(String(60), primary_key=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now())
    updated_at = Column(DateTime, nullable=False, default=datetime.now())
    unique_id = Column(String(8), unique=True)

    def __generate_id__(self, length=8):
        """ Creates an 8 digit secure ID """
        chars = string.ascii_lowercase + string.digits
        return ''.join(secrets.choice(chars) for _ in range(length))

    def __init__(self, **kwargs):
        """Instantiates a new model"""
        if not kwargs.get('id'):
            self.id = str(uuid.uuid4())
        if not kwargs.get('created_at'):
            self.created_at = datetime.now()
        if not kwargs.get('updated_at'):
            self.updated_at = datetime.now()
        
        self.unique_id = self.__generate_id__()

        self.__dict__.update(kwargs)

    def __str__(self):
        ''' Returns a string representation of an instance '''
        filtered_dict = {k: v for k, v in self.__dict__.items() if v}
        return f'[{type(self).__name__}] ({self.id}) {filtered_dict}'

    def save(self):
        """ Updates updated_at with current time when instance is changed.
            Also saves an instance to the database. """
        self.updated_at = datetime.now()
        models.storage.new(self)
        models.storage.save()

    def to_dict(self):
        """ Converts an instance to a dictionary """

        dictionary = {}
        for key, value in self.__dict__.items():
            if value is not None:
                dictionary[key] = value

        # Makes sure the private attribute "class" is the class name
        dictionary["__class__"] = self.__class__.__name__
        return dictionary

    def delete(self):
        """ Deletes the current instance from storage """
        models.storage.delete(self)
