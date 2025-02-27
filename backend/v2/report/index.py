"""Report routes"""

from v2 import router
from flask import jsonify, request
from v2.utils.middleware import auth_middleware
from v2.report.validation import CreateReportRequest
from v2.report.functions import (
    format_dates,
    get_activity_by_id,
    create_new_report,
    get_profile_by_id,
    get_reports_in_range
)


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

        profile = get_profile_by_id(request.user['id'])
        profile.total_productive_time = profile.total_productive_time + report_data.time_on_task
        profile.total_wasted_time = profile.total_wasted_time + report_data.time_wasted

        profile.save()
        # Use ReportResponse for serialization
        # report_response = ReportResponse.model_dump(new_report)
        
        return jsonify({
            'message': 'Report created successfully',
            'data': {
                'id': new_report.id,
                'unique_id': new_report.unique_id,
                'activity_id': new_report.activity_id,
                'date': new_report.date,
                'time_on_task': new_report.time_on_task,
                'time_wasted': new_report.time_wasted,
                'comment': new_report.comment
            }
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
        try:
            start_date, end_date = format_dates(
                request.args.get('start_date'),
                request.args.get('end_date')
            )

            # Validate date range
            if end_date < start_date:
                return jsonify({
                    'message': 'end_date cannot be before start_date'
                }), 400

            # Limit the date range to prevent excessive queries
            max_days = 366  # Maximum one year of data
            if (end_date - start_date).days > max_days:
                return jsonify({
                    'message': 'Date range cannot exceed a year'
                }), 400
        except ValueError:
            return jsonify({
                'message': 'Invalid date format. Use YYYY-MM-DD'
        }), 400

        # Get reports within date range
        reports = get_reports_in_range(
            user_id=request.user['id'],
            start_date=start_date,
            end_date=end_date
        )

        return jsonify({
            'message': 'Reports retrieved successfully',
            'data': reports
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
