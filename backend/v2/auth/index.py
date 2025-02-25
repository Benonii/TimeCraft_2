""" Handles authentication """

from v2 import router
from flask import jsonify, request, abort
from v2.models.User import User
from v2.models.Profile import Profile
from flasgger.utils import swag_from
from passlib.context import CryptContext
from datetime import timedelta, datetime
from sqlalchemy.exc import IntegrityError
from os import environ
from v2.auth.functions import get_user_by_email, get_user_by_id, create_access_token
from v2.auth.validation import LoginRequest, SignupRequest
from v2.models import storage
from v2.utils.middleware import auth_middleware

secret_key = environ.get('SECRET_KEY')
algorithm = environ.get('ALGORITHM')

bcrypt_context = CryptContext(
    schemes=['bcrypt'],
    deprecated='auto',
    bcrypt__default_rounds=12 
)


@router.route('/login', methods=['POST'], strict_slashes=False)
@swag_from('auth/login.yml', methods=['POST'])
def login():
    """ Login a user """
    try:
        data = request.get_json() if request.is_json else request.form
        login_data = LoginRequest.model_validate(data)
    except ValueError as e:
        abort(400, description=str(e))

    user_from_db = get_user_by_email(login_data.email)

    if not user_from_db:
        abort(404, description="User not found!")


    if not bcrypt_context.verify(login_data.password, user_from_db['password']):
        abort(401, description="Invalid password!")
    
    token = create_access_token(user_from_db['email'], user_from_db['id'], timedelta(minutes=20))

    return jsonify({
        'message': 'Login successful!',
        'data': {
            'token': token,
            'user': {
                'email': user_from_db['email'],
                'full_name': user_from_db['full_name'],
                'id': user_from_db['id'],
                'total_productive_time': user_from_db['total_productive_time'],
                'total_wasted_time': user_from_db['total_wasted_time'],
                'weekly_work_hours_goal': user_from_db['weekly_work_hours_goal'],
                'number_of_work_days': user_from_db['number_of_work_days'],
                'username': user_from_db['username'],
                'profile_picture_url': user_from_db['profile_picture_url'],
                'bio': user_from_db['bio'],
                'location': user_from_db['location']
            }
        }
    }), 200


@router.route('/signup', methods=['POST'], strict_slashes=False)
@swag_from('auth/signup.yml', methods=['POST'])
def signup():
    """ Signup a user """
    try:
        data = request.get_json() if request.is_json else request.form
        signup_data = SignupRequest.model_validate(data)
    except ValueError as e:
        abort(400, description=str(e))

    # First check if user already exists
    existing_user = get_user_by_email(signup_data.email)
    if existing_user:
        abort(400, description="User with this email already exists!")

    try:
        hashed_password = bcrypt_context.hash(signup_data.password)
        # Create and save the user first
        new_user = User(
            email=signup_data.email,
            password=hashed_password
        )
        new_user.save()

        # Now create and save the profile
        new_profile = Profile(
            user_id=new_user.id,
            full_name=signup_data.full_name,
            username=signup_data.username,
            weekly_work_hours_goal=signup_data.weekly_work_hours_goal,
            number_of_work_days=signup_data.number_of_work_days,
            total_productive_time=0,
            total_wasted_time=0,
            profile_picture_url="",
            bio="",
            location=""
        )
        new_profile.save()
        
    except IntegrityError as e:
        storage.rollback()
        abort(400, description="Username already exists!")
    except Exception as e:
        storage.rollback()
        abort(500, description=str(e))

    return jsonify({ 'message': 'User signed up successfully!'}), 200


@router.route('/me', methods=['GET'], strict_slashes=False)
@auth_middleware
def get_current_user():
    """Get the current authenticated user's profile"""
    user = request.user
    
    # Create a serializable dictionary with user data
    user_data = {
        'email': user['email'],
        'full_name': user['full_name'],
        'id': user['id'],
        'username': user['username'],
    }
    
    return jsonify({
        'message': 'User retrieved successfully',
        'data': user_data
    }), 200


# @router.route('/logout', methods=['GET'], strict_slashes=False)
# @auth_middleware
# @swag_from('auth/logout.yml', methods=['POST'])
# def logout():
#     """ Logout a user """
#     return jsonify({ 'message': 'Logout successful!'}), 200
