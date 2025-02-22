#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint

# Create the blueprint
router = Blueprint('actions', __name__, url_prefix='')

# Import all the views(actions)
from v2.auth.index import *