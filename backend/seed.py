import datetime
import random
import hashlib
from app import create_app
from app.extensions import db
from app.models.admin import AdminUser
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.achievement import Achievement
from app.models.contact import ContactMessage
from app.models.analytics import VisitorAnalytics

app = create_app("development")

def seed():
    with app.app_context():
        # Check if already seeded
        if AdminUser.query.first():
            print("Database already contains data. Skipping seeding.")
            return
            
        print("Seeding database...")
        
        # 1. Admin User
        admin = AdminUser(
            username="admin",
            email="admin@yourdomain.com",
            is_active=True
        )
        admin.set_password("password123")
        db.session.add(admin)
        
        # 2. Profile
        profile = Profile(
            full_name="Alex Mercer",
            title="Senior Full-Stack Engineer & AI Architect",
            bio="Passionate full-stack developer with 5+ years of experience building scalable web applications, microservices, and AI integrations. Experienced with React, Node, Python, and cloud services (AWS/GCP). Dedicated to writing clean, maintainable code.",
            photo_url=None,
            video_url=None,
            resume_url=None,
            social_links={
                "github": "https://github.com",
                "linkedin": "https://linkedin.com",
                "twitter": "https://twitter.com",
                "email": "alex.mercer@example.com",
                "youtube": "https://youtube.com"
            }
        )
        db.session.add(profile)
        
        # 3. Skills
        skills = [
            # Frontend
            Skill(name="React & Redux", category="Frontend", proficiency=95, display_order=1),
            Skill(name="TypeScript", category="Frontend", proficiency=90, display_order=2),
            Skill(name="Tailwind CSS", category="Frontend", proficiency=95, display_order=3),
            Skill(name="Next.js", category="Frontend", proficiency=85, display_order=4),
            # Backend
            Skill(name="Python & Flask", category="Backend", proficiency=90, display_order=1),
            Skill(name="Node.js & Express", category="Backend", proficiency=88, display_order=2),
            Skill(name="PostgreSQL / MySQL", category="Backend", proficiency=85, display_order=3),
            Skill(name="RESTful & GraphQL APIs", category="Backend", proficiency=92, display_order=4),
            # DevOps
            Skill(name="Docker", category="DevOps", proficiency=85, display_order=1),
            Skill(name="AWS (S3/EC2/RDS)", category="DevOps", proficiency=80, display_order=2),
            Skill(name="CI/CD Pipelines", category="DevOps", proficiency=82, display_order=3),
            # Tools
            Skill(name="Git & GitHub", category="Tools", proficiency=95, display_order=1),
            Skill(name="Linux / Shell Scripting", category="Tools", proficiency=80, display_order=2),
            Skill(name="Postman / Insomnia", category="Tools", proficiency=90, display_order=3)
        ]
        db.session.add_all(skills)
        
        # 4. Projects
        projects = [
            Project(
                title="E-Commerce Microservices Platform",
                description="A highly scalable, production-ready microservices e-commerce system featuring auto-scaling, distributed caching, and real-time inventory updates using RabbitMQ and Redis.",
                screenshot_url=None,
                github_url="https://github.com",
                demo_url="https://google.com",
                tech_stack=["React", "Node.js", "Docker", "RabbitMQ", "Redis"],
                status="Completed",
                start_date="2023-01",
                end_date="2023-06",
                display_order=1
            ),
            Project(
                title="AI-Powered Document Classifier",
                description="An intelligent application integrating Anthropic Claude and Flask to extract and categorize contract metadata with 98% accuracy. Supports PDF and scanned image files.",
                screenshot_url=None,
                github_url="https://github.com",
                demo_url="https://google.com",
                tech_stack=["Flask", "Python", "Anthropic API", "React"],
                status="Completed",
                start_date="2023-08",
                end_date="2023-11",
                display_order=2
            ),
            Project(
                title="Real-time Collaborative Dashboard",
                description="A collaborative workspace platform allowing teams to edit documentation and sketch architectures simultaneously, powered by WebSockets and CRDTs.",
                screenshot_url=None,
                github_url="https://github.com",
                demo_url="https://google.com",
                tech_stack=["TypeScript", "React", "Express", "Socket.io", "MongoDB"],
                status="In Progress",
                start_date="2024-01",
                end_date="Present",
                display_order=3
            )
        ]
        db.session.add_all(projects)
        
        # 5. Certificates
        certs = [
            Certificate(
                title="AWS Certified Solutions Architect – Associate",
                issuer="Amazon Web Services",
                image_url=None,
                credential_url="https://aws.amazon.com",
                issued_date="2023-04-15",
                expiry_date="2026-04-15",
                display_order=1
            ),
            Certificate(
                title="Certified Kubernetes Administrator (CKA)",
                issuer="The Linux Foundation",
                image_url=None,
                credential_url="https://linuxfoundation.org",
                issued_date="2023-09-10",
                expiry_date="2026-09-10",
                display_order=2
            )
        ]
        db.session.add_all(certs)
        
        # 6. Achievements
        achievements = [
            Achievement(
                title="1st Place - National AI Hackathon 2023",
                description="Led a team of 4 to design and pitch an AI assistant that optimizes power consumption in smart warehouses.",
                icon="Trophy",
                achieved_date="2023-06-12",
                display_order=1
            ),
            Achievement(
                title="Open Source Contributor - React Core",
                description="Successfully merged performance optimizations to the concurrent renderer module, reducing state transition latency by 5%.",
                icon="Cpu",
                achieved_date="2023-11-01",
                display_order=2
            )
        ]
        db.session.add_all(achievements)
        
        # 7. Contact Messages
        messages = [
            ContactMessage(
                name="John Doe",
                email="john.doe@example.com",
                subject="Inquiry regarding contract opportunities",
                message="Hi Alex, I saw your portfolio and was highly impressed by your AI classifier project. We have a contract position opening up next month. Let me know if you are interested!",
                is_read=False,
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            ),
            ContactMessage(
                name="Sarah Connor",
                email="sarah@resistance.org",
                subject="Collaboration on automation system",
                message="Greetings. We need a secure, distributed telemetry dashboard for tracking resources. Let's arrange a call to discuss options.",
                is_read=True,
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            )
        ]
        db.session.add_all(messages)
        
        # 8. Analytics (Last 40 days)
        countries = ["United States", "United Kingdom", "Canada", "Germany", "India", "Australia", "Japan"]
        devices = ["Desktop", "Mobile", "Tablet"]
        pages = ["/home", "/home#projects", "/home#about", "/home#skills"]
        
        for i in range(40, -1, -1):
            date = datetime.datetime.utcnow() - datetime.timedelta(days=i)
            # Create a random number of unique visitors per day
            num_visitors = random.randint(10, 30)
            for v in range(num_visitors):
                ip_hash = hashlib.sha256(f"visitor_{i}_{v}".encode('utf-8')).hexdigest()
                db.session.add(VisitorAnalytics(
                    ip_hash=ip_hash,
                    page=random.choice(pages),
                    country=random.choice(countries),
                    device_type=random.choices(devices, weights=[70, 25, 5])[0],
                    referrer="https://github.com" if random.random() > 0.5 else None,
                    visited_at=date - datetime.timedelta(hours=random.randint(0, 23))
                ))
                
        db.session.commit()
        print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed()
