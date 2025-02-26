#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint, jsonify

# Create the blueprint
router = Blueprint('actions', __name__)

# Import all the views(actions)
from v2.auth.index import *
from v2.activity.index import *
from v2.report.index import *

# Add a test route to verify blueprint is working
@router.route('/', methods=['GET'])
def test():
    return jsonify({"TimeCraft API": "API is working!"})