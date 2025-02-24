from v2.models import storage
from v2.models.User import User
from v2.models.Profile import Profile
from datetime import datetime
from jose import jwt
from os import environ

SECRET_KEY = environ.get('SECRET_KEY')
ALGORITHM = environ.get('ALGORITHM')


def get_user_by_email(email):
    """ Get a user by email """
    user = storage.session.query(User).filter(User.email == email).first()
    if user:
        profile = storage.session.query(Profile).filter(Profile.user_id == user.id).first()
        print("==============Profile===============", profile)

    return {
        **user.to_dict(),
        **profile.to_dict()
    } if user and profile else {}


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