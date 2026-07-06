from flask import Blueprint, request, redirect, current_app
from app.extensions import db, limiter
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.achievement import Achievement
from app.models.contact import ContactMessage
from app.models.experience import Experience
from app.utils.response import success_response, error_response
from app.utils.security import ContactSchema, sanitize_input
from app.services.mail_service import send_contact_notification
from marshmallow import ValidationError

portfolio_bp = Blueprint("portfolio", __name__)

@portfolio_bp.route("/profile", methods=["GET"])
def get_profile():
    profile = Profile.query.first()
    if not profile:
        # Return empty template structure
        return success_response({
            "full_name": "Your Name",
            "title": "Software Developer",
            "bio": "Write your biography here.",
            "photo_url": None,
            "video_url": None,
            "resume_url": None,
            "social_links": {}
        })
    return success_response(profile.to_dict())

@portfolio_bp.route("/skills", methods=["GET"])
def get_skills():
    skills = Skill.query.filter_by(is_active=True).order_by(Skill.display_order.asc(), Skill.id.asc()).all()
    return success_response([s.to_dict() for s in skills])

@portfolio_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.order_by(Project.display_order.asc(), Project.id.asc()).all()
    return success_response([p.to_dict() for p in projects])

@portfolio_bp.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return success_response(project.to_dict())

@portfolio_bp.route("/certificates", methods=["GET"])
def get_certificates():
    certs = Certificate.query.order_by(Certificate.display_order.asc(), Certificate.id.asc()).all()
    return success_response([c.to_dict() for c in certs])

@portfolio_bp.route("/achievements", methods=["GET"])
def get_achievements():
    achievements = Achievement.query.order_by(Achievement.display_order.asc(), Achievement.id.asc()).all()
    return success_response([a.to_dict() for a in achievements])

@portfolio_bp.route("/experiences", methods=["GET"])
def get_experiences():
    experiences = Experience.query.order_by(Experience.display_order.asc(), Experience.id.asc()).all()
    return success_response([e.to_dict() for e in experiences])

@portfolio_bp.route("/resume", methods=["GET"])
def download_resume():
    profile = Profile.query.first()
    if not profile or not profile.resume_url:
        return error_response("Resume not uploaded yet", 404)
    return redirect(profile.resume_url)

@portfolio_bp.route("/contact", methods=["POST"])
@limiter.limit("5 per hour", error_message="Too many submissions. Please try again later.")
def contact():
    try:
        data = request.get_json() or {}
        schema = ContactSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    # Sanitize inputs with bleach
    name = sanitize_input(valid_data["name"])
    email = sanitize_input(valid_data["email"])
    subject = sanitize_input(valid_data["subject"])
    message = sanitize_input(valid_data["message"])

    contact_msg = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message
    )

    db.session.add(contact_msg)
    db.session.commit()

    # Trigger email to admin (runs synchronously/defensively)
    send_contact_notification(contact_msg)

    return success_response({"message": "Message sent successfully!"}, 200)
