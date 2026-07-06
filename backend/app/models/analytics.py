from datetime import datetime
from app.extensions import db

class VisitorAnalytics(db.Model):
    __tablename__ = 'visitor_analytics'

    id = db.Column(db.Integer, primary_key=True)
    ip_hash = db.Column(db.String(64), nullable=False) # SHA-256 hashed IP address
    page = db.Column(db.String(255), nullable=False) # e.g. /home, /projects
    country = db.Column(db.String(100), default="Unknown")
    device_type = db.Column(db.String(50), default="Desktop") # Mobile, Tablet, Desktop
    referrer = db.Column(db.String(255), nullable=True)
    visited_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "ip_hash": self.ip_hash,
            "page": self.page,
            "country": self.country,
            "device_type": self.device_type,
            "referrer": self.referrer,
            "visited_at": self.visited_at.isoformat() if self.visited_at else None
        }
