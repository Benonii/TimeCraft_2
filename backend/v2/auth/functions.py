from v2.engine import storage
from models.user import User
from datetime import datetime
from jose import jwt
from os import environ

SECRET_KEY = environ.get('SECRET_KEY')
ALGORITHM = environ.get('ALGORITHM')


def get_user_by_email(email):
    """ Get a user by email """
    return storage.session.query(User).filter(User.email == email).first()


def get_user_by_id(user_id):
    """ Get a user by id """
    return storage.session.query(User).filter(User.id == user_id).first()


def create_access_token(email, id, expires_delta):
    """ Create an access token """
    expire = datetime.now() + expires_delta
    encode = {
        'email': email,
        'id': id,
        'exp': expire.timestamp() 
    }

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)