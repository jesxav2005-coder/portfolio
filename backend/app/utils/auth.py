import datetime
from functools import wraps
import jwt
from flask import request, current_app, g
from app.utils.response import error_response
from app.models.admin import AdminUser

def generate_access_token(user_id, username):
    payload = {
        "sub": user_id,
        "username": username,
        "type": "access",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        "iat": datetime.datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

def generate_refresh_token(user_id):
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")

def decode_token(token):
    try:
        payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return error_response("Missing authorization header", 401)
            
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return error_response("Authorization header must be Bearer <token>", 401)
            
        token = parts[1]
        payload = decode_token(token)
        if "error" in payload:
            return error_response(payload["error"], 401)
            
        if payload.get("type") != "access":
            return error_response("Invalid token type", 401)
            
        user_id = payload.get("sub")
        # Check active session/user
        user = AdminUser.query.get(user_id)
        if not user or not user.is_active:
            return error_response("User not found or inactive", 401)
            
        g.current_user = user
        return f(*args, **kwargs)
    return decorated
