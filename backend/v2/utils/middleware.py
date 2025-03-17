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
                return jsonify({
                'message': 'Authorization header is missing'
            }), 401
            
        if not auth_header.startswith('Bearer '):
            return jsonify({
                'message': 'Invalid token format. Must be "Bearer <token>"'
            }), 401
            
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
                return jsonify({
                    'message': 'Invalid token: User not found'
                }), 401
                
            # Add user to request context
            request.user = current_user
            
        except JWTError:
            return jsonify({
                'message': 'Invalid or expired token'
            }), 401
        except Exception as e:
            return jsonify({
                'message': str(e)
            }), 500
            
        return f(*args, **kwargs)
    
    return decorated