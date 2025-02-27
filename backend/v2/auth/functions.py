from v2.models import storage
from v2.models.User import User
from v2.models.Profile import Profile
from datetime import datetime
from jose import jwt
from os import environ

SECRET_KEY = environ.get('SECRET_KEY')
ALGORITHM = environ.get('ALGORITHM')


def get_user_by_email(email: str) -> dict:
    """ Get a user by email """
    user = storage.session.query(User).filter(User.email == email).first()
    if user:
        profile = storage.session.query(Profile).filter(Profile.user_id == user.id).first()

    if user and profile:
        user_dict = user.to_dict()
        profile_dict = profile.to_dict()
        # Ensure we keep the user's ID, not the profile's
        profile_dict['id'] = user_dict['id']
        return {**user_dict, **profile_dict}
    return {}


def get_user_by_username(username: str) -> dict:
    """ Get a user by username """
    user = storage.session.query(Profile).filter(Profile.username == username).first()
    if user:
        profile = storage.session.query(Profile).filter(Profile.user_id == user.id).first()
    return {
        **user.to_dict(),
        **profile.to_dict()
    } if user and profile else {}

def get_user_by_id(user_id: str) -> User:
    """ Get a user by id """
    return storage.session.query(User).filter(User.id == user_id).first()


def create_access_token(email: str, id: str, expires_delta: datetime):
    """ Create an access token """
    expire = datetime.now() + expires_delta
    encode = {
        'email': email,
        'id': id,
        'exp': expire.timestamp() 
    }

    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)