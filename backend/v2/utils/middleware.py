"""Authentication middleware for Flask endpoints"""

from functools import wraps
from flask import request, abort, jsonify
from jose import JWTError, jwt
from os import environ
from v2.models import storage
from v2.auth.functions import get_user_by_email

def auth_middleware(f):
    """Decorator to protect routes that require authentication
    
    Usage:
        @router.route('/protected-route')
        @token_required
        def protected_endpoint():
            # Your code here
            pass
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Get token from header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            abort(401, description="Authorization header is missing")
            
        if not auth_header.startswith('Bearer '):
            abort(401, description="Invalid token format. Must be 'Bearer <token>'")
            
        token = auth_header.split(' ')[1]
        
        try:
            # Decode the token
            payload = jwt.decode(
                token,
                environ.get('SECRET_KEY'),
                algorithms=[environ.get('ALGORITHM')]
            )
            
            # Get user from database
            current_user = get_user_by_email(payload.get('email'))
            
            if not current_user:
                abort(401, description="Invalid token: User not found")
                
            # Add user to request context
            request.user = current_user
            
        except JWTError:
            abort(401, description="Invalid or expired token")
        except Exception as e:
            abort(500, description=str(e))
            
        return f(*args, **kwargs)
    
    return decorated