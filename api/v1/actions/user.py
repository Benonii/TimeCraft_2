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
import json


SECRET_KEY = '027aaad3-d8d2-4067-8689-af1a461c4c0e'
AlGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@app_actions.route('/new_user', methods=['POST'], strict_slashes=False)
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
    user_dict['name'] = name
    user_dict['weekly_work_hours_goal'] = float(wwg)
    user_dict['number_of_work_days'] = int(work_days)

    # Create an object based on the data and save it
    new_user = User(**user_dict)
    storage.new(new_user)
    storage.save()

    return jsonify({'user_id': new_user.id})


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
    new_user = User(**user_model)
    new_user.save()

    return jsonify({ 'message': 'User signed up successfully'}), 201


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
        'user': {
            'email': user.email,
            'username': user.username,
            'id': user.id,
            'tpt': user.total_productive_time,
            'twt': user.total_wasted_time,
        }
    }

    token = create_access_token(user.email, user.id ,timedelta(minutes=20))
    return { 'message': 'Login successful', 'data': {'token': token, 'user': returning_user} }, 201


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
    user_id = request.json.get("userID")
    user = storage.get_user(user_id)

    if user is None:
        return jsonify({})

    storage.user_id = user_id
    storage.save()

    return jsonify({'name': user.name})
