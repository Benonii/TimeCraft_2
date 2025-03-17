""" Handles authentication """

from v2 import router
from flask import jsonify, request, abort, Blueprint
from v2.models.User import User
from v2.models.Profile import Profile
from flasgger.utils import swag_from
from passlib.context import CryptContext
from datetime import timedelta, datetime
from sqlalchemy.exc import IntegrityError
from os import environ
from v2.auth.functions import get_user_by_email, get_user_by_id, create_access_token, get_user_by_username
from v2.auth.validation import LoginRequest, SignupRequest
from v2.models import storage
from v2.utils.middleware import auth_middleware
from v2.profile.functions import update_profile, delete_profile
from v2.profile.validation import ProfileUpdateRequest


@router.route('/profile', methods=['PATCH'], strict_slashes=False)
@auth_middleware
def update_user_profile():
    """Update the current user's profile"""
    user = request.user
    data = request.get_json() if request.is_json else request.form

    try:
        # Validate the payload data
        validated_payload = ProfileUpdateRequest.model_validate(data)
        
        # Update the profile with validated data
        updated_profile = update_profile(user['id'], validated_payload)
        
        if not updated_profile:
            return jsonify({
                'message': 'Profile not found'
            }), 404
            
        return jsonify({
            'message': 'Profile Updated Successfully!',
            'data': {
                'id': updated_profile.id,
                'user_id': updated_profile.user_id,
                'username': updated_profile.username,
                'full_name': updated_profile.full_name,
                'bio': updated_profile.bio,
                'profile_picture_url': updated_profile.profile_picture_url,
                'location': updated_profile.location,
                'weekly_work_hours_goal': updated_profile.weekly_work_hours_goal,
                'number_of_work_days': updated_profile.number_of_work_days,
                'total_productive_time': updated_profile.total_productive_time,
                'total_wasted_time': updated_profile.total_wasted_time,
                'created_at': updated_profile.created_at,
                'updated_at': updated_profile.updated_at
            }
        }), 200
        
    except ValueError as e:
        # Validation error
        return jsonify({
            'message': f'Invalid data: {str(e)}'
        }), 400
    except IntegrityError as e:
        # Constraint violation (e.g., duplicate username)
        storage.rollback()
        return jsonify({
            'message': str(e)
        }), 409
    except Exception as e:
        # Other errors
        storage.rollback()
        return jsonify({
            'message': f'Error updating profile: {str(e)}'
        }), 500


@router.route('/profile', methods=['DELETE'], strict_slashes=False)
@auth_middleware
def delete_user_profile():
    """Delete the current user's profile"""
    user = request.user
    try:
        deleted_profile = delete_profile(user['id'])
        
        if not deleted_profile:
            return jsonify({
                'message': 'Profile not found'
            }), 404
            
        return jsonify({
            'message': 'Profile deleted successfully',
            'data': {
                'id': deleted_profile.id,
                'user_id': deleted_profile.user_id,
                'username': deleted_profile.username,
                'full_name': deleted_profile.full_name,
                'bio': deleted_profile.bio,
                'profile_picture_url': deleted_profile.profile_picture_url,
                'location': deleted_profile.location,
                'weekly_work_hours_goal': deleted_profile.weekly_work_hours_goal,
                'number_of_work_days': deleted_profile.number_of_work_days,
                'total_productive_time': deleted_profile.total_productive_time,
                'total_wasted_time': deleted_profile.total_wasted_time,
                'created_at': deleted_profile.created_at,
                'updated_at': deleted_profile.updated_at
            }
        }), 200
        
    except Exception as e:
        storage.rollback()
        return jsonify({
            'message': f'Error deleting profile: {str(e)}'
        }), 500