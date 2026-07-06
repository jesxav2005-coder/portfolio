from datetime import datetime
from app.extensions import db

class Profile(db.Model):
    __tablename__ = 'profile'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    photo_url = db.Column(db.String(255), nullable=True)
    video_url = db.Column(db.String(255), nullable=True)
    resume_url = db.Column(db.String(255), nullable=True)
    social_links = db.Column(db.JSON, nullable=True) # JSON containing github, linkedin, twitter, email, youtube
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "title": self.title,
            "bio": self.bio,
            "photo_url": self.photo_url,
            "video_url": self.video_url,
            "resume_url": self.resume_url,
            "social_links": self.social_links or {},
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
