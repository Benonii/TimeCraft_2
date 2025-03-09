"""Task routes"""

from datetime import datetime
from v2.report.functions import get_profile_by_id
from v2.activity.functions import get_activity_by_id
from v2.activity.validation import CreateActivityRequest, UpdateActivityRequest
from v2.activity.functions import get_activity_by_name, get_all_activities
from v2 import router
from flask import jsonify, request, abort
from v2.models.Activity import Activity
from v2.models import storage
from v2.utils.middleware import auth_middleware
from flasgger.utils import swag_from
from sqlalchemy.exc import IntegrityError


@router.route('/activity', methods=['POST'], strict_slashes=False)
@auth_middleware
def create_activity():
    """Create a new activity for the authenticated user"""
    try:
        data = request.get_json() if request.is_json else request.form
        user_profile = get_profile_by_id(request.user['id'])
        validated_data = CreateActivityRequest.model_validate(data)
        # Check if user already has an activity with this name
        existing_activity = get_activity_by_name(request.user['id'], validated_data.name)
        
        if existing_activity:
            return jsonify({
                'message': 'You already have an activity with this name'
            }), 400
        
        # Create new task
        new_activity = Activity(
            name=validated_data.name,
            description=validated_data.description,
            daily_goal=validated_data.daily_goal,
            weekly_goal=int(validated_data.daily_goal) * int(user_profile.number_of_work_days),
            user_id=request.user['id'],  # Link task to current user's profile
            total_time_on_task=0
        )
        
        try:
            new_activity.save()
        except Exception as e:
            storage.rollback()
            return jsonify({
                'message': str(e)
            }), 500
            
        # Convert task to dictionary for response
        activity_dict = {
            'id': new_activity.id,
            'unique_id': new_activity.unique_id,
            'name': new_activity.name,
            'description': new_activity.description,
            'daily_goal': new_activity.daily_goal,
            'weekly_goal': new_activity.weekly_goal,
            'total_time_on_task': new_activity.total_time_on_task,
            'created_at': new_activity.created_at.isoformat(),
            'updated_at': new_activity.updated_at.isoformat()
        }
        
        return jsonify({
            'message': 'Activity created successfully',
            'data': activity_dict
        }), 201
        
    except ValueError as e:
        return jsonify({
            'message': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500


@router.route('/activity', methods=['GET'], strict_slashes=False)
@auth_middleware
def get_activities():
    """Get all activities for the authenticated user"""
    try:
        # Query activities for the current user that aren't deleted
        activities = get_all_activities(request.user['id'])
        
        # Convert activities to list of dictionaries
        activities_list = []
        for activity in activities:
            activities_list.append({
                'id': activity.id,
                'unique_id': activity.unique_id,
                'name': activity.name,
                'description': activity.description,
                'daily_goal': activity.daily_goal,
                'weekly_goal': activity.weekly_goal,
                'total_time_on_task': activity.total_time_on_task,
                'created_at': activity.created_at.isoformat(),
                'updated_at': activity.updated_at.isoformat()
            })
            
        return jsonify({
            'message': 'Activities retrieved successfully',
            'data': activities_list
        }), 200
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500


@router.route('/activity/<activity_id>', methods=['GET'], strict_slashes=False)
@auth_middleware
def get_activity(activity_id):
    """Get a specific activity by ID"""
    try:
        # Query the activity
        activity = get_activity_by_id(activity_id)
        
        if not activity:
            return jsonify({
                'message': 'Activity not found'
            }), 404
            
        # Convert activity to dictionary
        activity_dict = {
            'id': activity.id,
            'unique_id': activity.unique_id,
            'name': activity.name,
            'description': activity.description,
            'daily_goal': activity.daily_goal,
            'weekly_goal': activity.weekly_goal,
            'total_time_on_task': activity.total_time_on_task,
            'created_at': activity.created_at.isoformat(),
            'updated_at': activity.updated_at.isoformat()
        }
        
        return jsonify({
            'message': 'Activity retrieved successfully',
            'data': activity_dict
        }), 200
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500


@router.route('/activity/<activity_id>', methods=['PATCH'], strict_slashes=False)
@auth_middleware
def update_activity(activity_id):
    """Update a specific activity"""
    try:
        # Get and validate request data
        data = request.get_json() if request.is_json else request.form
        update_data = UpdateActivityRequest.model_validate(data)
        
        # Query the activity
        updated_activity = get_activity_by_id(activity_id)
        
        if not updated_activity:
            abort(404, description="Activity not found")
            
        # Check if name is being updated and conflicts with existing activity
        if hasattr(update_data, 'name') and update_data.name != updated_activity.name:
            # Check if any other activity exists with this name for the user
            existing_activity = get_activity_by_name(updated_activity.user_id, update_data.name)
            if existing_activity:
                return jsonify({
                    'message': "You already have an activity with this name"
                }), 400

        # Update only provided fields
        if update_data.name:
            updated_activity.name = update_data.name
        if update_data.description:
            updated_activity.description = update_data.description
        if update_data.daily_goal:
            updated_activity.daily_goal = update_data.daily_goal
        if update_data.weekly_goal:
            updated_activity.weekly_goal = update_data.weekly_goal
        if update_data.total_time_on_task:
            updated_activity.total_time_on_task = update_data.total_time_on_task
        updated_activity.updated_at = datetime.now()
        
        try:
            updated_activity.save()
        except Exception as e:
            storage.rollback()
            return jsonify({
                'message': str(e)
            }), 500
            
        # Convert updated activity to dictionary
        activity_dict = {
            'id': updated_activity.id,
            'unique_id': updated_activity.unique_id,
            'name': updated_activity.name,
            'description': updated_activity.description,
            'daily_goal': updated_activity.daily_goal,
            'weekly_goal': updated_activity.weekly_goal,
            'total_time_on_task': updated_activity.total_time_on_task,
            'created_at': updated_activity.created_at.isoformat(),
            'updated_at': updated_activity.updated_at.isoformat()
        }
        
        return jsonify({
            'message': 'Activity updated successfully',
            'data': activity_dict
        }), 200
        
    except ValueError as e:
        return jsonify({
            'message': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500


@router.route('/activity/<activity_id>', methods=['DELETE'], strict_slashes=False)
@auth_middleware
def delete_activity(activity_id):
    """Soft delete a specific activity"""
    try:
        # Query the activity
        activity = get_activity_by_id(activity_id)
        
        if not activity:
            return jsonify({
                'message': "Activity not found"
            }), 404
            
        # Soft delete the activity
        activity.deleted = datetime.now()
        activity.save()
        
        return jsonify({
            'message': 'Activity deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500


