from v2.models import storage
from v2.models.User import User
from v2.models.Profile import Profile
from datetime import datetime
from jose import jwt
from os import environ
from v2.profile.validation import ProfileUpdateRequest
from typing import Optional
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_

def get_profile_by_user_id(user_id: str) -> Optional[Profile]:
    print("INCOMING user_id", user_id)
    """Get a profile by user ID"""
    return storage.session.query(Profile).filter(
        Profile.user_id == user_id,
        Profile.deleted.is_(None)
    ).first()

def update_profile(user_id: str, payload: ProfileUpdateRequest) -> Optional[Profile]:
    """Update a user profile with validated data
    
    Args:
        user_id: The ID of the user whose profile to update
        payload: Validated profile update data
        
    Returns:
        Updated profile object or None if profile not found
        
    Raises:
        IntegrityError: If there's a constraint violation (e.g., duplicate username)
        Exception: For other database errors
    """
    # Find profile by user_id
    profile = get_profile_by_user_id(user_id)
    
    if not profile:
        return None
    
    try:
        # Update profile fields if they are provided in the payload
        update_data = payload.model_dump(exclude_unset=True, exclude_none=True)
        
        # Update profile fields
        for key, value in update_data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        # Save changes
        profile.save()
        
        return profile
    
    except IntegrityError as e:
        storage.rollback()
        # Check if it's a username uniqueness violation
        if 'username' in str(e).lower() or 'unique' in str(e).lower():
            raise IntegrityError("Username already exists", None, None)
        raise
    except Exception as e:
        storage.rollback()
        raise

def delete_profile(user_id) -> Optional[Profile]:
    """Delete a user profile (soft delete)
    
    Args:
        user_id: The ID of the user whose profile to delete
        
    Returns:
        Deleted profile object or None if not found
    """
    user = storage.session.query(User).filter(User.id == user_id).first()
    profile = storage.session.query(Profile).filter(Profile.user_id == user_id).first()
    
    if not user or not profile:
        return None
        
    try:
        current_time = datetime.now()
        user.deleted = current_time
        profile.deleted = current_time
        
        user.save()
        profile.save()
        
        return profile
    except Exception as e:
        storage.rollback()
        raise

