#!/usr/bin/python
""" Handles creation of a new User """

from models import storage
from models.user import User
from api.v1.actions import app_actions
from flasgger.utils import swag_from
from flask import jsonify, request, abort
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import timedelta, datetime
from sqlalchemy.exc import IntegrityError
import json


SECRET_KEY = '027aaad3-d8d2-4067-8689-af1a461c4c0e'
AlGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@app_actions.route('/user/create', methods=['POST'], strict_slashes=False)
def new_user():
    """ Creates a new user """
    # Empty Dictionary
    user_dict = dict()

    # Get all necessary info about User from the form
    name = request.form.get('username')
    # weekly work hours goal
    wwg = request.form.get('weekly_hours')
    work_days = request.form.get('work_days')

    # Save the data ina dictionary
    user_dict['username'] = name
    user_dict['weekly_work_hours_goal'] = float(wwg)
    user_dict['number_of_work_days'] = int(work_days)

    # Create an object based on the data and save it
    try:
        new_user = User(**user_dict)
        storage.new(new_user)
        storage.save()
        
        return jsonify({'message': 'User created successfully!', 'data': {'user_id': new_user.unique_id} }), 201

    except IntegrityError as e:
        storage.rollback()
        return jsonify({'message': 'The username already exists. Please use a different one'}), 400

    except Exception as e:
        storage.rollback()
        return jsonify({'message': 'Unkown error occured. Please try again'}), 500



@app_actions.route('/signup', methods=['POST'], strict_slashes=False)
def signup():
    """ Signs up a new User """

    # Get all necessary info about User from the form

    user_model = dict(
        username=request.form.get('username'),
        email=request.form.get('email'),
        weekly_work_hours_goal=request.form.get('weekly_hours'),
        number_of_work_days=request.form.get('work_days'),
        password=bcrypt_context.hash(request.form.get('password')),
    )

    try:
        new_user = User(**user_model)
        new_user.save()

        return jsonify({ 'message': 'User signed up successfully!'}), 201

    except IntegrityError:
        storage.rollback()
        return jsonify({'message': 'The username/email already exists. Please use a different one'}), 400
    except Exception as e:
        print(e)
        storage.rollback()
        return jsonify({'message': 'Unkown error occured. Please try again'}), 500



@app_actions.route('/login', methods=['POST'], strict_slashes=False)
def login():
    """ Login user """
    # Get all necessary info about User from the form
    login_model = dict(
        email=request.form.get('email'),
        password=request.form.get('password')
    )

    user = storage.get_user_by_email(login_model['email'])

    if not user:
         return jsonify({ 'message': "Couldn't find a user with that email"}), 404

    if not bcrypt_context.verify(login_model['password'], user.password):
        return jsonify({ 'message': "Incorrect email or password" }), 405

    returning_user = {
        'email': user.email,
        'username': user.username,
        'id': user.unique_id,
        'tpt': user.total_productive_time,
        'twt': user.total_wasted_time,
    }

    token = create_access_token(user.email, user.id ,timedelta(minutes=20))
    return jsonify({ 'message': 'Login successful!', 'data': {'token': token, 'user': returning_user} }), 200


def create_access_token(email, id, expires_delta):
    expire = datetime.now() + expires_delta
    encode = { 'email': email, 'id': id, 'exp': expire.timestamp() }
    return jwt.encode(encode, SECRET_KEY, algorithm=AlGORITHM)


@app_actions.route('/get_session_user', methods=['GET'], strict_slashes=False)
def get_session_user():
    """ Gets a user for the session """
    return jsonify({"user_id": storage.user_id})

@app_actions.route('/switch_user', methods=['POST'], strict_slashes=False)
def switch_user():
    """ Changes the user for the session """
    user_id = request.json.get("userId")
    user = storage.get_user(user_id)

    if user is None:
        return jsonify({})

    storage.user_id = user_id
    storage.save()

    return jsonify({'name': user.name})


@app_actions.route('/user/update', methods=['POST'], strict_slashes=False)
def update_user() :
    """ Changes the user data """
    user_id = request.form.get('userId')
    username = request.form.get('username')

    if not username:
        return ({'message': 'username is required'}), 400
    user = storage.get_user(user_id)
    
    if user is None:
        return jsonify({'message': "Couldn't find a user with that ID. Please try again." }), 404
    
    if user.username == username:
        return jsonify({'message': "No change detected"}), 400

    try:
        storage.change_username(username, user_id)
        return jsonify({ 'message': 'User updated successfully!'}), 200
    except IntegrityError as e:
        storage.rollback()
        return jsonify({'message': 'The username is taken. Please change it and try again'} ), 400
    except Exception as e:
        storage.rollback()
        # print(e)
        return jsonify({'message': 'Unkown error occured. Please try again'}), 500


@app_actions.route('/user/delete', methods=['DELETE'], strict_slashes=False)
def delete_user():
    ''' Delete the user '''
    user_id = request.form.get('userId')
    print("User Id:", user_id)

    if not user_id:
        return jsonify({'message': "User Id is required"}), 400
    
    user = storage.get_user(user_id)

    if not user:
        return jsonify({ 'message': "Couldn't find that user. Please try again"}), 404

    try:
        storage.delete(user)
        storage.save()
        return jsonify({'message': 'User deleted successfully!'}), 200
    except Exception as e:
        storage.rollback()
        print(e)
        return jsonify({'message': 'Unkown error occured. Please try again'}), 500