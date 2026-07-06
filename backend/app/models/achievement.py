from app.extensions import db

class Achievement(db.Model):
    __tablename__ = 'achievements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(64), nullable=True) # e.g. "Trophy", "Award", "Cpu", or emoji
    achieved_date = db.Column(db.String(64), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
            "achieved_date": self.achieved_date,
            "display_order": self.display_order
        }
