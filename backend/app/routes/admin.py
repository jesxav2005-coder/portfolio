import json
from datetime import datetime, timedelta
import collections
from flask import Blueprint, request, g, current_app
from app.extensions import db
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.achievement import Achievement
from app.models.contact import ContactMessage
from app.models.analytics import VisitorAnalytics
from app.models.experience import Experience
from app.utils.auth import jwt_required
from app.utils.response import success_response, error_response
from app.utils.security import (
    ProfileSchema, 
    SkillSchema, 
    ProjectSchema, 
    CertificateSchema, 
    AchievementSchema,
    ExperienceSchema,
    sanitize_input
)
from app.services.file_service import save_uploaded_file, delete_file
from marshmallow import ValidationError

admin_bp = Blueprint("admin", __name__)

# =========================================================================
# PROFILE CRUD & MEDIA
# =========================================================================

@admin_bp.route("/profile", methods=["GET"])
@jwt_required
def get_profile():
    profile = Profile.query.first()
    if not profile:
        return success_response({})
    return success_response(profile.to_dict())

@admin_bp.route("/profile", methods=["PUT"])
@jwt_required
def update_profile():
    try:
        data = request.get_json() or {}
        schema = ProfileSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    profile = Profile.query.first()
    if not profile:
        profile = Profile(
            full_name=sanitize_input(valid_data["full_name"]),
            title=sanitize_input(valid_data["title"]),
            bio=sanitize_input(valid_data["bio"]),
            social_links=valid_data.get("social_links", {})
        )
        db.session.add(profile)
    else:
        profile.full_name = sanitize_input(valid_data["full_name"])
        profile.title = sanitize_input(valid_data["title"])
        profile.bio = sanitize_input(valid_data["bio"])
        profile.social_links = valid_data.get("social_links", {})
        
    db.session.commit()
    return success_response(profile.to_dict())

@admin_bp.route("/profile/photo", methods=["POST"])
@jwt_required
def upload_profile_photo():
    if "photo" not in request.files:
        return error_response("No photo file provided", 400)
    
    file = request.files["photo"]
    try:
        profile = Profile.query.first()
        if not profile:
            return error_response("Create profile details first", 400)
            
        old_photo = profile.photo_url
        new_url = save_uploaded_file(file, "photos")
        
        profile.photo_url = new_url
        db.session.commit()
        
        # Clean up old photo file
        if old_photo:
            delete_file(old_photo)
            
        return success_response(profile.to_dict())
    except Exception as e:
        return error_response(str(e), 400)

@admin_bp.route("/profile/video", methods=["POST"])
@jwt_required
def upload_profile_video():
    if "video" not in request.files:
        return error_response("No video file provided", 400)
        
    file = request.files["video"]
    try:
        profile = Profile.query.first()
        if not profile:
            return error_response("Create profile details first", 400)
            
        old_video = profile.video_url
        new_url = save_uploaded_file(file, "videos")
        
        profile.video_url = new_url
        db.session.commit()
        
        if old_video:
            delete_file(old_video)
            
        return success_response(profile.to_dict())
    except Exception as e:
        return error_response(str(e), 400)

@admin_bp.route("/profile/resume", methods=["POST"])
@jwt_required
def upload_profile_resume():
    if "resume" not in request.files:
        return error_response("No resume file provided", 400)
        
    file = request.files["resume"]
    try:
        profile = Profile.query.first()
        if not profile:
            return error_response("Create profile details first", 400)
            
        old_resume = profile.resume_url
        new_url = save_uploaded_file(file, "pdfs")
        
        profile.resume_url = new_url
        db.session.commit()
        
        if old_resume:
            delete_file(old_resume)
            
        return success_response(profile.to_dict())
    except Exception as e:
        return error_response(str(e), 400)

# =========================================================================
# SKILLS CRUD
# =========================================================================

@admin_bp.route("/skills", methods=["GET"])
@jwt_required
def get_all_skills():
    skills = Skill.query.order_by(Skill.display_order.asc(), Skill.id.asc()).all()
    return success_response([s.to_dict() for s in skills])

@admin_bp.route("/skills", methods=["POST"])
@jwt_required
def create_skill():
    try:
        data = request.get_json() or {}
        schema = SkillSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    skill = Skill(
        name=sanitize_input(valid_data["name"]),
        category=sanitize_input(valid_data["category"]),
        proficiency=valid_data["proficiency"],
        display_order=valid_data.get("display_order", 0),
        is_active=valid_data.get("is_active", True)
    )
    db.session.add(skill)
    db.session.commit()
    return success_response(skill.to_dict(), 201)

@admin_bp.route("/skills/<int:skill_id>", methods=["PUT"])
@jwt_required
def update_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    try:
        data = request.get_json() or {}
        schema = SkillSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    skill.name = sanitize_input(valid_data["name"])
    skill.category = sanitize_input(valid_data["category"])
    skill.proficiency = valid_data["proficiency"]
    skill.display_order = valid_data.get("display_order", skill.display_order)
    skill.is_active = valid_data.get("is_active", skill.is_active)

    db.session.commit()
    return success_response(skill.to_dict())

@admin_bp.route("/skills/<int:skill_id>", methods=["DELETE"])
@jwt_required
def delete_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    db.session.delete(skill)
    db.session.commit()
    return success_response({"message": "Skill deleted successfully"})

# =========================================================================
# PROJECTS CRUD
# =========================================================================

@admin_bp.route("/projects", methods=["GET"])
@jwt_required
def get_all_projects():
    projects = Project.query.order_by(Project.display_order.asc(), Project.id.asc()).all()
    return success_response([p.to_dict() for p in projects])

@admin_bp.route("/projects", methods=["POST"])
@jwt_required
def create_project():
    # Supports JSON and multipart form data
    if request.content_type and "multipart/form-data" in request.content_type:
        form_data = request.form.to_dict()
        if "tech_stack" in form_data:
            try:
                form_data["tech_stack"] = json.loads(form_data["tech_stack"])
            except json.JSONDecodeError:
                form_data["tech_stack"] = [t.strip() for t in form_data["tech_stack"].split(",") if t.strip()]
        data = form_data
    else:
        data = request.get_json() or {}

    try:
        schema = ProjectSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    screenshot_url = None
    if "screenshot" in request.files:
        try:
            screenshot_url = save_uploaded_file(request.files["screenshot"], "screenshots")
        except Exception as e:
            return error_response(f"Screenshot upload failed: {str(e)}", 400)

    project = Project(
        title=sanitize_input(valid_data["title"]),
        description=sanitize_input(valid_data["description"]),
        github_url=sanitize_input(valid_data.get("github_url")),
        demo_url=sanitize_input(valid_data.get("demo_url")),
        tech_stack=valid_data["tech_stack"],
        status=sanitize_input(valid_data.get("status", "Completed")),
        start_date=sanitize_input(valid_data.get("start_date")),
        end_date=sanitize_input(valid_data.get("end_date")),
        display_order=valid_data.get("display_order", 0),
        screenshot_url=screenshot_url
    )
    db.session.add(project)
    db.session.commit()
    return success_response(project.to_dict(), 201)

@admin_bp.route("/projects/<int:project_id>", methods=["PUT"])
@jwt_required
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    if request.content_type and "multipart/form-data" in request.content_type:
        form_data = request.form.to_dict()
        if "tech_stack" in form_data:
            try:
                form_data["tech_stack"] = json.loads(form_data["tech_stack"])
            except json.JSONDecodeError:
                form_data["tech_stack"] = [t.strip() for t in form_data["tech_stack"].split(",") if t.strip()]
        data = form_data
    else:
        data = request.get_json() or {}

    try:
        schema = ProjectSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    if "screenshot" in request.files:
        try:
            old_screenshot = project.screenshot_url
            new_url = save_uploaded_file(request.files["screenshot"], "screenshots")
            project.screenshot_url = new_url
            if old_screenshot:
                delete_file(old_screenshot)
        except Exception as e:
            return error_response(f"Screenshot upload failed: {str(e)}", 400)

    project.title = sanitize_input(valid_data["title"])
    project.description = sanitize_input(valid_data["description"])
    project.github_url = sanitize_input(valid_data.get("github_url"))
    project.demo_url = sanitize_input(valid_data.get("demo_url"))
    project.tech_stack = valid_data["tech_stack"]
    project.status = sanitize_input(valid_data.get("status", project.status))
    project.start_date = sanitize_input(valid_data.get("start_date"))
    project.end_date = sanitize_input(valid_data.get("end_date"))
    project.display_order = valid_data.get("display_order", project.display_order)

    db.session.commit()
    return success_response(project.to_dict())

@admin_bp.route("/projects/<int:project_id>", methods=["DELETE"])
@jwt_required
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    screenshot = project.screenshot_url
    db.session.delete(project)
    db.session.commit()
    if screenshot:
        delete_file(screenshot)
    return success_response({"message": "Project deleted successfully"})

# =========================================================================
# CERTIFICATES CRUD
# =========================================================================

@admin_bp.route("/certificates", methods=["GET"])
@jwt_required
def get_all_certificates():
    certs = Certificate.query.order_by(Certificate.display_order.asc(), Certificate.id.asc()).all()
    return success_response([c.to_dict() for c in certs])

@admin_bp.route("/certificates", methods=["POST"])
@jwt_required
def create_certificate():
    if request.content_type and "multipart/form-data" in request.content_type:
        data = request.form.to_dict()
    else:
        data = request.get_json() or {}

    try:
        schema = CertificateSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    image_url = None
    if "image" in request.files:
        try:
            image_url = save_uploaded_file(request.files["image"], "screenshots") # Cert images share screenshots subfolder
        except Exception as e:
            return error_response(f"Image upload failed: {str(e)}", 400)

    cert = Certificate(
        title=sanitize_input(valid_data["title"]),
        issuer=sanitize_input(valid_data["issuer"]),
        credential_url=sanitize_input(valid_data.get("credential_url")),
        issued_date=sanitize_input(valid_data.get("issued_date")),
        expiry_date=sanitize_input(valid_data.get("expiry_date")),
        display_order=valid_data.get("display_order", 0),
        image_url=image_url
    )
    db.session.add(cert)
    db.session.commit()
    return success_response(cert.to_dict(), 201)

@admin_bp.route("/certificates/<int:cert_id>", methods=["PUT"])
@jwt_required
def update_certificate(cert_id):
    cert = Certificate.query.get_or_404(cert_id)
    if request.content_type and "multipart/form-data" in request.content_type:
        data = request.form.to_dict()
    else:
        data = request.get_json() or {}

    try:
        schema = CertificateSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    if "image" in request.files:
        try:
            old_image = cert.image_url
            new_url = save_uploaded_file(request.files["image"], "screenshots")
            cert.image_url = new_url
            if old_image:
                delete_file(old_image)
        except Exception as e:
            return error_response(f"Image upload failed: {str(e)}", 400)

    cert.title = sanitize_input(valid_data["title"])
    cert.issuer = sanitize_input(valid_data["issuer"])
    cert.credential_url = sanitize_input(valid_data.get("credential_url"))
    cert.issued_date = sanitize_input(valid_data.get("issued_date"))
    cert.expiry_date = sanitize_input(valid_data.get("expiry_date"))
    cert.display_order = valid_data.get("display_order", cert.display_order)

    db.session.commit()
    return success_response(cert.to_dict())

@admin_bp.route("/certificates/<int:cert_id>", methods=["DELETE"])
@jwt_required
def delete_certificate(cert_id):
    cert = Certificate.query.get_or_404(cert_id)
    image = cert.image_url
    db.session.delete(cert)
    db.session.commit()
    if image:
        delete_file(image)
    return success_response({"message": "Certificate deleted successfully"})

# =========================================================================
# ACHIEVEMENTS CRUD
# =========================================================================

@admin_bp.route("/achievements", methods=["GET"])
@jwt_required
def get_all_achievements():
    achievements = Achievement.query.order_by(Achievement.display_order.asc(), Achievement.id.asc()).all()
    return success_response([a.to_dict() for a in achievements])

@admin_bp.route("/achievements", methods=["POST"])
@jwt_required
def create_achievement():
    try:
        data = request.get_json() or {}
        schema = AchievementSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    achievement = Achievement(
        title=sanitize_input(valid_data["title"]),
        description=sanitize_input(valid_data["description"]),
        icon=sanitize_input(valid_data.get("icon")),
        achieved_date=sanitize_input(valid_data.get("achieved_date")),
        display_order=valid_data.get("display_order", 0)
    )
    db.session.add(achievement)
    db.session.commit()
    return success_response(achievement.to_dict(), 201)

@admin_bp.route("/achievements/<int:ach_id>", methods=["PUT"])
@jwt_required
def update_achievement(ach_id):
    achievement = Achievement.query.get_or_404(ach_id)
    try:
        data = request.get_json() or {}
        schema = AchievementSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    achievement.title = sanitize_input(valid_data["title"])
    achievement.description = sanitize_input(valid_data["description"])
    achievement.icon = sanitize_input(valid_data.get("icon"))
    achievement.achieved_date = sanitize_input(valid_data.get("achieved_date"))
    achievement.display_order = valid_data.get("display_order", achievement.display_order)

    db.session.commit()
    return success_response(achievement.to_dict())

@admin_bp.route("/achievements/<int:ach_id>", methods=["DELETE"])
@jwt_required
def delete_achievement(ach_id):
    achievement = Achievement.query.get_or_404(ach_id)
    db.session.delete(achievement)
    db.session.commit()
    return success_response({"message": "Achievement deleted successfully"})

# =========================================================================
# EXPERIENCES CRUD
# =========================================================================

@admin_bp.route("/experiences", methods=["GET"])
@jwt_required
def get_all_experiences():
    experiences = Experience.query.order_by(Experience.display_order.asc(), Experience.id.asc()).all()
    return success_response([e.to_dict() for e in experiences])

@admin_bp.route("/experiences", methods=["POST"])
@jwt_required
def create_experience():
    try:
        data = request.get_json() or {}
        schema = ExperienceSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    experience = Experience(
        role=sanitize_input(valid_data["role"]),
        company=sanitize_input(valid_data["company"]),
        location=sanitize_input(valid_data.get("location")),
        description=sanitize_input(valid_data.get("description")),
        start_date=sanitize_input(valid_data.get("start_date")),
        end_date=sanitize_input(valid_data.get("end_date")),
        display_order=valid_data.get("display_order", 0)
    )
    db.session.add(experience)
    db.session.commit()
    return success_response(experience.to_dict(), 201)

@admin_bp.route("/experiences/<int:exp_id>", methods=["PUT"])
@jwt_required
def update_experience(exp_id):
    experience = Experience.query.get_or_404(exp_id)
    try:
        data = request.get_json() or {}
        schema = ExperienceSchema()
        valid_data = schema.load(data)
    except ValidationError as err:
        return error_response(err.messages, 400)

    experience.role = sanitize_input(valid_data["role"])
    experience.company = sanitize_input(valid_data["company"])
    experience.location = sanitize_input(valid_data.get("location"))
    experience.description = sanitize_input(valid_data.get("description"))
    experience.start_date = sanitize_input(valid_data.get("start_date"))
    experience.end_date = sanitize_input(valid_data.get("end_date"))
    experience.display_order = valid_data.get("display_order", experience.display_order)

    db.session.commit()
    return success_response(experience.to_dict())

@admin_bp.route("/experiences/<int:exp_id>", methods=["DELETE"])
@jwt_required
def delete_experience(exp_id):
    experience = Experience.query.get_or_404(exp_id)
    db.session.delete(experience)
    db.session.commit()
    return success_response({"message": "Experience deleted successfully"})

# =========================================================================
# CONTACT MESSAGES CRUD
# =========================================================================

@admin_bp.route("/messages", methods=["GET"])
@jwt_required
def get_messages():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    
    pagination = ContactMessage.query.order_by(ContactMessage.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return success_response({
        "messages": [m.to_dict() for m in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "page": pagination.page
    })

@admin_bp.route("/messages/<int:msg_id>/read", methods=["PUT"])
@jwt_required
def mark_message_read(msg_id):
    msg = ContactMessage.query.get_or_404(msg_id)
    msg.is_read = True
    db.session.commit()
    return success_response(msg.to_dict())

@admin_bp.route("/messages/<int:msg_id>", methods=["DELETE"])
@jwt_required
def delete_message(msg_id):
    msg = ContactMessage.query.get_or_404(msg_id)
    db.session.delete(msg)
    db.session.commit()
    return success_response({"message": "Message deleted successfully"})

@admin_bp.route("/messages", methods=["DELETE"])
@jwt_required
def bulk_delete_messages():
    data = request.get_json() or {}
    ids = data.get("ids", [])
    if not ids:
        return error_response("No message IDs provided", 400)
        
    ContactMessage.query.filter(ContactMessage.id.in_(ids)).delete(synchronize_session=False)
    db.session.commit()
    return success_response({"message": f"Successfully deleted {len(ids)} messages"})

# =========================================================================
# DASHBOARD & ANALYTICS
# =========================================================================

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required
def get_dashboard_metrics():
    # Counts
    total_visitors = db.session.query(db.func.count(db.func.distinct(VisitorAnalytics.ip_hash))).scalar() or 0
    unread_messages_count = ContactMessage.query.filter_by(is_read=False).count()
    active_projects_count = Project.query.count()
    certificates_count = Certificate.query.count()
    experiences_count = Experience.query.count()
    
    # Recent messages (last 5)
    recent_messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(5).all()
    
    # Visitor line chart (last 30 days) - processed in python for DB portability
    limit_date = datetime.utcnow() - timedelta(days=30)
    visitor_logs = VisitorAnalytics.query.filter(VisitorAnalytics.visited_at >= limit_date).all()
    
    daily_map = collections.defaultdict(set)
    for log in visitor_logs:
        d_str = log.visited_at.strftime("%Y-%m-%d")
        daily_map[d_str].add(log.ip_hash)
        
    # Build complete 30 days array to ensure no gaps
    visitor_chart = []
    for i in range(29, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        visitor_chart.append({
            "date": day,
            "visitors": len(daily_map.get(day, set()))
        })

    # Device type doughnut chart split
    device_logs = VisitorAnalytics.query.all()
    device_counts = collections.Counter([log.device_type for log in device_logs])
    device_chart = [
        {"name": "Desktop", "value": device_counts.get("Desktop", 0)},
        {"name": "Mobile", "value": device_counts.get("Mobile", 0)},
        {"name": "Tablet", "value": device_counts.get("Tablet", 0)}
    ]
    
    return success_response({
        "total_visitors": total_visitors,
        "unread_messages_count": unread_messages_count,
        "active_projects_count": active_projects_count,
        "certificates_count": certificates_count,
        "experiences_count": experiences_count,
        "recent_messages": [m.to_dict() for m in recent_messages],
        "visitor_chart": visitor_chart,
        "device_chart": device_chart
    })

@admin_bp.route("/analytics", methods=["GET"])
@jwt_required
def get_analytics():
    range_days = request.args.get("days", 30, type=int)
    limit_date = datetime.utcnow() - timedelta(days=range_days)
    
    logs = VisitorAnalytics.query.filter(VisitorAnalytics.visited_at >= limit_date).all()
    
    # 1. Daily visitors
    daily_map = collections.defaultdict(set)
    for log in logs:
        d_str = log.visited_at.strftime("%Y-%m-%d")
        daily_map[d_str].add(log.ip_hash)
        
    daily_visitors = []
    for i in range(range_days - 1, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        daily_visitors.append({
            "date": day,
            "visitors": len(daily_map.get(day, set()))
        })
        
    # 2. Top pages
    page_counts = collections.Counter([log.page for log in logs])
    top_pages = [{"page": page, "visits": count} for page, count in page_counts.most_common(5)]
    
    # 3. Device types
    device_counts = collections.Counter([log.device_type for log in logs])
    device_chart = [
        {"name": "Desktop", "value": device_counts.get("Desktop", 0)},
        {"name": "Mobile", "value": device_counts.get("Mobile", 0)},
        {"name": "Tablet", "value": device_counts.get("Tablet", 0)}
    ]
    
    # 4. Top Countries
    country_counts = collections.Counter([log.country for log in logs])
    countries = [{"country": country, "visits": count} for country, count in country_counts.most_common(10)]
    
    return success_response({
        "daily_visitors": daily_visitors,
        "top_pages": top_pages,
        "device_chart": device_chart,
        "countries": countries
    })
