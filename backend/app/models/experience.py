from app.extensions import db

class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120), nullable=True)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.String(64), nullable=True)
    end_date = db.Column(db.String(64), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "company": self.company,
            "location": self.location,
            "description": self.description,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "display_order": self.display_order
        }
