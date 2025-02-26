"""Database query functions for report operations"""

from v2.models import storage
from v2.models.Report import Report
from v2.models.Activity import Activity
from sqlalchemy import and_
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from v2.report.validation import ReportResponse, ActivityDailyStats


def get_activity_by_id(activity_id: str, user_id: str) -> Optional[Activity]:
    """Get an activity by ID and verify it belongs to the user"""
    return storage.session.query(Activity).filter(
        Activity.unique_id == activity_id,
        Activity.user_id == user_id,
        Activity.deleted.is_(None)
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
    return storage.session.query(Report).filter(
        Report.activity_id == activity.id,
        Report.deleted.is_(None),
        and_(
            Report.date >= start_date,
            Report.date <= end_date
        )
    ).all()


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


def process_activity_reports(
    reports: List[Report]
) -> Tuple[float, float, List[ReportResponse], ActivityDailyStats]:
    """Process reports for an activity and return stats"""
    if not reports:
        return 0.0, 0.0, [], None
    
    # Calculate totals
    activity_productive_time = sum(r.time_on_task for r in reports)
    activity_wasted_time = sum(r.time_wasted for r in reports)
    
    # Convert reports to response format
    report_list = [
        ReportResponse(
            id=r.id,
            unique_id=r.unique_id,
            date=r.date,
            time_on_task=r.time_on_task,
            time_wasted=r.time_wasted,
            comment=r.comment
        ) for r in reports
    ]
    
    # Create activity stats
    activity_stats = ActivityDailyStats(
        activity_name=reports[0].activity.name,
        total_time_on_task=activity_productive_time,
        total_time_wasted=activity_wasted_time,
        reports=report_list
    )
    
    return (
        activity_productive_time,
        activity_wasted_time,
        report_list,
        activity_stats
    )


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
            # Process the reports
            productive_time, wasted_time, _, activity_stats = process_activity_reports(reports)
            
            # Update totals
            total_productive_time += productive_time
            total_wasted_time += wasted_time
            
            # Add to activities data
            activities_data[activity.unique_id] = activity_stats
    
    # Create final response
    return {
        'start_date': start_date,
        'end_date': end_date,
        'total_productive_time': total_productive_time,
        'total_wasted_time': total_wasted_time,
        'activities': activities_data
    } 