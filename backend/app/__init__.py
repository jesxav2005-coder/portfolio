import os
from flask import Flask
from app.config import config_by_name
from app.extensions import db, migrate, cors, mail, limiter

def create_app(config_name=None):
    if not config_name:
        config_name = os.getenv("FLASK_ENV", "development")
        
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS - supports credentials for refresh token cookies
    frontend_url = app.config.get("FRONTEND_URL", "http://localhost:5173")
    cors.init_app(app, resources={r"/api/*": {
        "origins": [frontend_url],
        "supports_credentials": True,
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }})
    
    mail.init_app(app)
    limiter.init_app(app)
    
    # Import and register blueprints (will be implemented next)
    from app.routes.auth import auth_bp
    from app.routes.portfolio import portfolio_bp
    from app.routes.admin import admin_bp
    from app.routes.chatbot import chatbot_bp
    from app.routes.analytics import analytics_bp
    
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(chatbot_bp, url_prefix="/api/chatbot")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    
    # Create upload directories
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    for sub in ["photos", "videos", "pdfs", "screenshots"]:
        os.makedirs(os.path.join(app.config["UPLOAD_FOLDER"], sub), exist_ok=True)
        
    # Standard health check / base endpoint
    @app.route("/health")
    def health():
        return {"status": "healthy"}, 200

    # Serve uploaded files from uploads folder (PDFs, images, videos)
    from flask import send_from_directory
    @app.route("/uploads/<path:filename>")
    def serve_uploads(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # Handle rate limit errors with consistent JSON
    from flask_limiter import RateLimitExceeded
    from app.utils.response import error_response

    @app.errorhandler(RateLimitExceeded)
    def handle_rate_limit_exceeded(e):
        return error_response(e.description or "Too many requests. Please try again later.", 429)
        
    return app
