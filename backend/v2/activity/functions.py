from v2.models.Activity import Activity
from v2.models import storage

def get_activity_by_name(user_id, name):
    """Get an activity by name for a specific user"""
    return storage.session.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.name == name,
        Activity.deleted == None
    ).first()


def get_all_activities(user_id):
    """Get all activities for a specific user"""
    return storage.session.query(Activity).filter(
        Activity.user_id == user_id,
        Activity.deleted == None
    ).all()


def get_activity_by_id(activity_id):
    """Get an activity by ID"""
    return storage.session.query(Activity).filter(
        Activity.unique_id == activity_id,
        Activity.deleted == None
    ).first()