from flask import Blueprint, request, make_response, current_app, g
from app.extensions import db
from app.models.admin import AdminUser
from app.utils.auth import (
    generate_access_token, 
    generate_refresh_token, 
    decode_token, 
    jwt_required
)
from app.utils.response import success_response, error_response
from app.utils.security import LoginSchema, PasswordChangeSchema, sanitize_input
from marshmallow import ValidationError
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        # Validate input schema
        schema = LoginSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    username = sanitize_input(valid_data["username"])
    password = valid_data["password"]

    user = AdminUser.query.filter_by(username=username).first()
    if not user or not user.check_password(password) or not user.is_active:
        return error_response("Invalid username or password", 401)

    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()

    # Generate tokens
    access_token = generate_access_token(user.id, user.username)
    refresh_token = generate_refresh_token(user.id)

    # Build response
    resp_body = {
        "success": True,
        "data": {
            "access_token": access_token,
            "user": user.to_dict()
        }
    }
    
    response = make_response(resp_body, 200)
    
    # Configure HttpOnly cookie for refresh token
    # samesite='Lax' ensures security. In local development without HTTPS, secure=False, 
    # but in production, we can make it secure=True.
    is_prod = current_app.config.get("ENV") == "production" or current_app.config.get("FLASK_ENV") == "production"
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=is_prod,
        samesite="Lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    return response

@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        return error_response("Refresh token missing", 401)

    payload = decode_token(refresh_token)
    if "error" in payload:
        return error_response(payload["error"], 401)

    if payload.get("type") != "refresh":
        return error_response("Invalid token type", 401)

    user_id = payload.get("sub")
    user = AdminUser.query.get(user_id)
    if not user or not user.is_active:
        return error_response("User not found or inactive", 401)

    # Rotate tokens
    new_access_token = generate_access_token(user.id, user.username)
    new_refresh_token = generate_refresh_token(user.id)

    resp_body = {
        "success": True,
        "data": {
            "access_token": new_access_token,
            "user": user.to_dict()
        }
    }
    response = make_response(resp_body, 200)
    is_prod = current_app.config.get("ENV") == "production" or current_app.config.get("FLASK_ENV") == "production"
    response.set_cookie(
        "refresh_token",
        new_refresh_token,
        httponly=True,
        secure=is_prod,
        samesite="Lax",
        max_age=7 * 24 * 60 * 60 # 7 days
    )
    return response

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = make_response({"success": True, "data": {"message": "Logged out successfully"}}, 200)
    # Clear the refresh token cookie
    response.delete_cookie("refresh_token", path="/")
    return response

@auth_bp.route("/change-password", methods=["POST"])
@jwt_required
def change_password():
    try:
        data = request.get_json() or {}
        schema = PasswordChangeSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    current_password = valid_data["current_password"]
    new_password = valid_data["new_password"]
    confirm_password = valid_data["confirm_password"]

    if new_password != confirm_password:
        return error_response("New password and confirmation do not match", 400)

    user = g.current_user
    if not user.check_password(current_password):
        return error_response("Incorrect current password", 400)

    user.set_password(new_password)
    db.session.commit()

    return success_response({"message": "Password updated successfully"})
