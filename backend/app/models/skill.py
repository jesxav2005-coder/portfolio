from app.extensions import db

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    category = db.Column(db.String(64), nullable=False) # e.g. Frontend, Backend, DevOps, Tools
    proficiency = db.Column(db.Integer, default=0) # 0-100
    icon_url = db.Column(db.String(255), nullable=True)
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "proficiency": self.proficiency,
            "icon_url": self.icon_url,
            "display_order": self.display_order,
            "is_active": self.is_active
        }
