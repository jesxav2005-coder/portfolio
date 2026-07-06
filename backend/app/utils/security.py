import bleach
from marshmallow import Schema, fields, validate, ValidationError, validates

def sanitize_input(text):
    if not isinstance(text, str):
        return text
    # Strip all HTML tags
    return bleach.clean(text, tags=[], attributes={}, strip=True)

class LoginSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=64))
    password = fields.Str(required=True, validate=validate.Length(min=6))

class ProfileSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    title = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    bio = fields.Str(required=True)
    social_links = fields.Dict(keys=fields.Str(), values=fields.Str(), required=False)

class SkillSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=64))
    category = fields.Str(required=True, validate=validate.OneOf(["Frontend", "Backend", "DevOps", "Tools", "Soft Skills"]))
    proficiency = fields.Int(required=True, validate=validate.Range(min=0, max=100))
    display_order = fields.Int(required=False, default=0)
    is_active = fields.Bool(required=False, default=True)

class ExperienceSchema(Schema):
    role = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    company = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    location = fields.Str(required=False, allow_none=True, validate=validate.Length(max=120))
    description = fields.Str(required=False, allow_none=True)
    start_date = fields.Str(required=False, allow_none=True)
    end_date = fields.Str(required=False, allow_none=True)
    display_order = fields.Int(required=False, default=0)


class ProjectSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    description = fields.Str(required=True)
    github_url = fields.Str(required=False, allow_none=True, validate=validate.URL())
    demo_url = fields.Str(required=False, allow_none=True, validate=validate.URL())
    tech_stack = fields.List(fields.Str(), required=True)
    status = fields.Str(required=False, validate=validate.OneOf(["Completed", "In Progress", "Planning"]))
    start_date = fields.Str(required=False, allow_none=True)
    end_date = fields.Str(required=False, allow_none=True)
    display_order = fields.Int(required=False, default=0)

class CertificateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    issuer = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    credential_url = fields.Str(required=False, allow_none=True, validate=validate.URL())
    issued_date = fields.Str(required=False, allow_none=True)
    expiry_date = fields.Str(required=False, allow_none=True)
    display_order = fields.Int(required=False, default=0)

class AchievementSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    description = fields.Str(required=True)
    icon = fields.Str(required=False, allow_none=True)
    achieved_date = fields.Str(required=False, allow_none=True)
    display_order = fields.Int(required=False, default=0)

class ContactSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    subject = fields.Str(required=True, validate=validate.Length(min=3, max=150))
    message = fields.Str(required=True, validate=validate.Length(min=10))

class PasswordChangeSchema(Schema):
    current_password = fields.Str(required=True)
    new_password = fields.Str(required=True, validate=validate.Length(min=6))
    confirm_password = fields.Str(required=True)

    @validates("confirm_password")
    def validate_passwords(self, value):
        # We will compare this inside the endpoint directly to have context of new_password,
        # but standard validation checks length.
        pass
