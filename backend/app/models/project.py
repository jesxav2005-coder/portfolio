from app.extensions import db

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    screenshot_url = db.Column(db.String(255), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    demo_url = db.Column(db.String(255), nullable=True)
    tech_stack = db.Column(db.JSON, nullable=True) # JSON array of strings: ["React", "Flask"]
    status = db.Column(db.String(64), default="Completed") # e.g. Completed, In Progress, Planning
    start_date = db.Column(db.String(64), nullable=True)
    end_date = db.Column(db.String(64), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "screenshot_url": self.screenshot_url,
            "github_url": self.github_url,
            "demo_url": self.demo_url,
            "tech_stack": self.tech_stack or [],
            "status": self.status,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "display_order": self.display_order
        }
