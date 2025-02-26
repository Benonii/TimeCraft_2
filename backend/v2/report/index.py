"""Report routes"""

from v2 import router
from flask import jsonify, request
from v2.utils.middleware import auth_middleware
from v2.report.validation import CreateReportRequest
from v2.report.functions import (
    get_activity_by_id,
    create_new_report,
    get_reports_in_range
)
from datetime import datetime, timedelta
import pytz


@router.route('/report', methods=['POST'])
@auth_middleware
def create_report():
    """Create a new report for an activity"""
    try:
        # Validate request data
        data = request.get_json() if request.is_json else request.form
        report_data = CreateReportRequest.model_validate(data)
        
        # Verify the activity exists and belongs to the user
        activity = get_activity_by_id(report_data.activity_id, request.user['id'])
        if not activity:
            return jsonify({
                'message': 'Activity not found'
            }), 404
            
        # Create new report
        new_report = create_new_report(
            activity=activity,
            date=report_data.date,
            time_on_task=report_data.time_on_task,
            time_wasted=report_data.time_wasted,
            comment=report_data.comment
        )
            
        # Convert report to dictionary for response
        report_dict = {
            'id': new_report.id,
            'unique_id': new_report.unique_id,
            'activity_id': activity.unique_id,
            'date': new_report.date.isoformat(),
            'time_on_task': new_report.time_on_task,
            'time_wasted': new_report.time_wasted,
            'comment': new_report.comment,
            'created_at': new_report.created_at.isoformat(),
            'updated_at': new_report.updated_at.isoformat()
        }
        
        return jsonify({
            'message': 'Report created successfully',
            'data': report_dict
        }), 201
        
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@router.route('/report', methods=['GET'])
@auth_middleware
def get_report():
    """Get all reports within a date range grouped by activity"""
    try:
        # Get date range from query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # If no dates provided, use today as default
        if not start_date and not end_date:
            end_date_dt = datetime.now(pytz.UTC).replace(
                hour=23, minute=59, second=59, microsecond=999999
            )
            start_date_dt = end_date_dt.replace(
                hour=0, minute=0, second=0, microsecond=0
            )
        else:
            try:
                # Parse date strings (expecting YYYY-MM-DD format)
                if start_date:
                    start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
                    start_date_dt = start_date_dt.replace(
                        hour=0, minute=0, second=0, microsecond=0, tzinfo=pytz.UTC
                    )
                else:
                    return jsonify({
                        'message': 'start_date is required if end_date is provided'
                    }), 400

                if end_date:
                    end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
                    end_date_dt = end_date_dt.replace(
                        hour=23, minute=59, second=59, microsecond=999999, tzinfo=pytz.UTC
                    )
                else:
                    return jsonify({
                        'message': 'end_date is required if start_date is provided'
                    }), 400
                
                # Validate date range
                if end_date_dt < start_date_dt:
                    return jsonify({
                        'message': 'end_date cannot be before start_date'
                    }), 400
                
                # Limit the date range to prevent excessive queries
                max_days = 366  # Maximum one year of data
                if (end_date_dt - start_date_dt).days > max_days:
                    return jsonify({
                        'message': f'Date range cannot exceed a year'
                    }), 400
                
            except ValueError:
                return jsonify({
                    'message': 'Invalid date format. Use YYYY-MM-DD'
                }), 400
            
        # Get reports within date range
        response = get_reports_in_range(
            user_id=request.user['id'],
            start_date=start_date_dt,
            end_date=end_date_dt
        )
        
        return jsonify({
            'message': 'Reports retrieved successfully',
            'data': response
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500
