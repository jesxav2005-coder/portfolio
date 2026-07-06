import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-flask-secret-key-12903")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default-jwt-secret-key-12903")
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload limits
    # Max size: 100MB for videos
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024
    
    # Upload folder configuration
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    
    # Mail Config
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() in ("true", "1", "yes")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@yourdomain.com")
    
    # AI Integration
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///portfolio.db")

class ProductionConfig(Config):
    DEBUG = False
    # Use MySQL or any other database URL in production
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}
