"""Database query functions for report operations"""

from sqlalchemy import DateTime
from v2.models import storage
from v2.models.Profile import Profile
from v2.models.Report import Report
from v2.models.Activity import Activity
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pytz


def get_activity_by_id(activity_id: str, user_id: str) -> Optional[Activity]:
    """Get an activity by ID and verify it belongs to the user"""
    return storage.session.query(Activity).filter(
        Activity.unique_id == activity_id,
        Activity.user_id == user_id,
        Activity.deleted.is_(None)
    ).first()

def get_profile_by_id(user_id: str) -> Optional[Profile]:
    """Get a profile by ID"""
    return storage.session.query(Profile).filter(
        Profile.user_id == user_id,
        Profile.deleted.is_(None)
    ).first()

def get_user_activities(user_id: str) -> List[Activity]:
    """Get all activities for a user"""
    return storage.session.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.deleted.is_(None)
    ).all()


def get_activity_reports(
    activity: Activity,
    start_date: datetime,
    end_date: datetime
) -> List[Report]:
    """Get all reports for an activity within a date range"""
    reports = storage.session.query(Report).filter(
        Report.activity_id == activity.id,
        Report.deleted == None,
        Report.date.between(start_date, end_date)
    ).all()

    return reports


def create_new_report(
    activity: Activity,
    date: datetime,
    time_on_task: float,
    time_wasted: float,
    comment: Optional[str] = None
) -> Report:
    """Create a new report and update activity stats"""
    new_report = Report(
        activity_id=activity.id,
        date=date,
        time_on_task=time_on_task,
        time_wasted=time_wasted,
        comment=comment
    )
    
    try:
        # Update activity's total time
        activity.total_time_on_task += time_on_task
        
        # Save both report and updated activity
        new_report.save()
        activity.save()
        
        return new_report
    except Exception as e:
        storage.rollback()
        raise e


def get_reports_in_range(
    user_id: str,
    start_date: datetime,
    end_date: datetime
) -> Dict:
    """Get all reports within a date range grouped by activity"""
    # Get all activities for the user
    activities = get_user_activities(user_id)
    
    # Initialize response data
    total_productive_time = 0
    total_wasted_time = 0
    activities_data = {}
    
    # For each activity, get and process its reports
    for activity in activities:
        reports = get_activity_reports(activity, start_date, end_date)

        if reports:
            productive_time = sum(report.time_on_task for report in reports)
            wasted_time = sum(report.time_wasted for report in reports)
            
            # Update totals
            total_productive_time += productive_time
            total_wasted_time += wasted_time
            
            # Add to activities data
            activities_data[activity.name] = {
                'total_time_on_task': productive_time,
                'total_time_wasted': wasted_time,
            }
    
    # Create final response
    return {
        'start_date': start_date,
        'end_date': end_date,
        'total_productive_time': total_productive_time,
        'total_wasted_time': total_wasted_time,
        'activities': activities_data
    }


def format_dates(start_date: str | None, end_date: str | None) -> tuple[datetime, datetime]:
    """Format start and end dates for report queries
    
    If no dates provided, defaults to today.
    If only start_date, end_date will be start_date + 1 day.
    Dates should be in YYYY-MM-DD format.
    
    Returns:
        Tuple of (start_date, end_date) as UTC datetimes
    """
    # If no dates provided, use today as default
    if not start_date and not end_date:
        end_date = datetime.now(pytz.UTC).replace(
            hour=23, minute=59, second=59, microsecond=999999
        )
        start_date = end_date.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        return start_date, end_date

    # Parse date strings (expecting YYYY-MM-DD format)
    if not start_date:
        raise ValueError('start_date is required if end_date is provided')
    start = datetime.strptime(start_date, '%Y-%m-%d').replace(
        hour=0, minute=0, second=0, microsecond=0, tzinfo=pytz.UTC
    )

    if end_date:
        end = datetime.strptime(end_date, '%Y-%m-%d').replace(
            hour=23, minute=59, second=59, microsecond=999999, tzinfo=pytz.UTC
        )
    else:
        # If no end_date provided, set it to one day after start_date
        end = start + timedelta(days=1)

    return start, end