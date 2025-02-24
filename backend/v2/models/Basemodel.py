""" This module contains the SQLAlchemy BaseModel """

import uuid
import string
import secrets
from v2 import models
from datetime import datetime
from sqlalchemy import String, Column, DateTime
from v2.models.base import Base
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.declarative import AbstractConcreteBase


class BaseModel(AbstractConcreteBase):
    """ This class is the base model for all models in the project """
    
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
    
    @declared_attr
    def id(cls):
        return Column(String(60), primary_key=True)
    
    @declared_attr
    def created_at(cls):
        return Column(DateTime, nullable=False, default=datetime.now())
    
    @declared_attr
    def updated_at(cls):
        return Column(DateTime, nullable=False, default=datetime.now())
    
    @declared_attr
    def unique_id(cls):
        return Column(String(8), unique=True)

    def __generate_id__(self, length=8):
        """ Creates an 8 digit secure ID """
        chars = string.ascii_lowercase + string.digits
        return ''.join(secrets.choice(chars) for _ in range(length))
    
    def __init__(self, **kwargs):
        """ Instantiates a new model """
        # Set core fields with defaults
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.unique_id = self.__generate_id__()

        # Filter out protected attributes from kwargs
        protected = {'id', 'created_at', 'updated_at', 'unique_id'}
        filtered_kwargs = {k: v for k, v in kwargs.items() if k not in protected}
        
        super().__init__(**filtered_kwargs)

    def __str__(self):
        """ Returns a string representation of the model """
        filtered_dict = {k: v for k, v in self.__dict__.items() if v}
        return f'[{type(self).__name__}] ({self.id}) {filtered_dict}'
    
    def save(self):
        """ Saves the model to the database """
        self.updated_at = datetime.now()
        models.storage.new(self)
        models.storage.save()

    def to_dict(self):
        """ Converts the model to a dictionary """
        dictionary = {}
        for key, value in self.__dict__.items():
            if value is not None:
                dictionary[key] = value

        dictionary['__class__'] = self.__class__.__name__
        return dictionary
    
    def delete(self):
        """ Deletes the model from the database """
        models.storage.delete(self)
