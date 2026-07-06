from app.extensions import db

class Certificate(db.Model):
    __tablename__ = 'certificates'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    issuer = db.Column(db.String(120), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    credential_url = db.Column(db.String(255), nullable=True)
    issued_date = db.Column(db.String(64), nullable=True)
    expiry_date = db.Column(db.String(64), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "issuer": self.issuer,
            "image_url": self.image_url,
            "credential_url": self.credential_url,
            "issued_date": self.issued_date,
            "expiry_date": self.expiry_date,
            "display_order": self.display_order
        }
