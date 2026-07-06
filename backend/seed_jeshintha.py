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
from app.models.experience import Experience

app = create_app("development")

def seed():
    with app.app_context():
        print("Clearing existing data...")
        # Delete jeshintha admin user if exists
        AdminUser.query.filter_by(username="jeshintha").delete()

        # Keep or recreate admin user
        admin = AdminUser.query.filter_by(username="admin").first()
        if not admin:
            admin = AdminUser(username="admin", email="jesxav2005@gmail.com", is_active=True)
            admin.set_password("password123")
            db.session.add(admin)
        else:
            admin.email = "jesxav2005@gmail.com"
            admin.set_password("password123")

        # Delete other entries
        Profile.query.delete()
        Skill.query.delete()
        Project.query.delete()
        Certificate.query.delete()
        Achievement.query.delete()
        Experience.query.delete()
        
        print("Seeding Jeshintha's data...")
        
        # 1. Profile
        profile = Profile(
            full_name="Jeshintha X",
            title="Computer Science Engineering Student",
            bio="I am a Computer Science Engineering student passionate about web development and technology. Skilled in HTML, CSS, JavaScript, Python, and IoT, I enjoy creating responsive and innovative projects. As a national-level boxer, NCC cadet, Web Development Club Coordinator, and Rotaract Project Chairman ('Back to School' initiative), I bring leadership, discipline, and teamwork to everything I do.",
            photo_url="/uploads/jessykerala.jpeg",
            video_url=None,
            resume_url=None,
            social_links={
                "github": "https://github.com/jesxav2005-coder",
                "linkedin": "https://www.linkedin.com/in/jeshintha-x-8b3b60294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
                "email": "jesxav2005@gmail.com",
                "leetcode": "https://leetcode.com/u/jessy_2005"
            }
        )
        db.session.add(profile)
        
        # 2. Skills
        skills = [
            # Frontend
            Skill(name="HTML & CSS", category="Frontend", proficiency=90, display_order=1),
            Skill(name="JavaScript", category="Frontend", proficiency=80, display_order=2),
            # Backend
            Skill(name="Python", category="Backend", proficiency=85, display_order=1),
            Skill(name="FastAPI", category="Backend", proficiency=85, display_order=2),
            Skill(name="Streamlit", category="Backend", proficiency=80, display_order=3),
            Skill(name="MySQL", category="Backend", proficiency=75, display_order=4),
            Skill(name="Java (basic)", category="Backend", proficiency=60, display_order=5),
            # Tools
            Skill(name="Git & GitHub", category="Tools", proficiency=85, display_order=1),
            Skill(name="Google Colab", category="Tools", proficiency=80, display_order=2),
            Skill(name="Jenkins", category="Tools", proficiency=70, display_order=3),
            # Soft Skills
            Skill(name="Leadership", category="Soft Skills", proficiency=95, display_order=1),
            Skill(name="Teamwork", category="Soft Skills", proficiency=95, display_order=2),
            Skill(name="Time Management", category="Soft Skills", proficiency=90, display_order=3),
            Skill(name="Quick learning", category="Soft Skills", proficiency=90, display_order=4),
            Skill(name="Communication Skills", category="Soft Skills", proficiency=90, display_order=5),
            Skill(name="Creativity", category="Soft Skills", proficiency=85, display_order=6)
        ]
        db.session.add_all(skills)
        
        # 3. Projects
        projects = [
            Project(
                title="Punch Detector – AutoScore",
                description="AI-Powered Scoring & Performance Analytics for Combat Sports. Developed an IoT-based system to detect and analyze punch impact using sensors and ESP32, providing real-time scoring and performance analytics for athletes.",
                screenshot_url=None,
                github_url="https://github.com/jesxav2005-coder",
                demo_url=None,
                tech_stack=["Python", "FastAPI", "IoT", "ESP32", "Sensors"],
                status="Completed",
                start_date="2024-09",
                end_date="2024-12",
                display_order=1
            ),
            Project(
                title="Retail SOP AI Assistant",
                description="An AI-powered role-based assistant that uses natural language processing and document-based knowledge retrieval to provide instant Standard Operating Procedure (SOP) guidance for retail operations with integrated feedback and admin analytics.",
                screenshot_url=None,
                github_url="https://github.com/jesxav2005-coder",
                demo_url=None,
                tech_stack=["Python", "NLP", "FastAPI", "AI Assistant", "MySQL"],
                status="Completed",
                start_date="2024-05",
                end_date="2024-08",
                display_order=2
            ),
            Project(
                title="Smart College Canteen Pre-Booking & Demand Forecasting Platform",
                description="Developed a full-stack campus dining pre-booking platform featuring secure Razorpay checkout, real-time WebSocket order tracking, and HMAC-signed QR code verification that successfully reduced counter collection wait times to under 3 minutes while cutting kitchen food waste by 50%.",
                screenshot_url=None,
                github_url="https://github.com/jesxav2005-coder",
                demo_url=None,
                tech_stack=["React.js", "FastAPI", "scikit-learn", "WebSocket", "Razorpay", "QR Code"],
                status="Completed",
                start_date="2024-01",
                end_date="2024-04",
                display_order=3
            ),
            Project(
                title="AI-Assisted Portfolio Website",
                description="Built and deployed a responsive portfolio website leveraging AI assistance to enhance design, content quality, and development efficiency.",
                screenshot_url=None,
                github_url="https://github.com/jesxav2005-coder",
                demo_url=None,
                tech_stack=["React.js", "Vite", "Tailwind CSS", "Framer Motion", "Flask", "SQLite"],
                status="Completed",
                start_date="2025-01",
                end_date="2025-02",
                display_order=4
            )
        ]
        db.session.add_all(projects)

        experiences = [
            Experience(
                role="Machine Learning Intern",
                company="BM FuturoMind AI",
                location="Chennai",
                description="Completed an intensive 3-month internship program in AI and Machine Learning. Gained hands-on experience in Python Programming Fundamentals, Data Handling & Visualization, Introduction to Machine Learning, and AI Model Basics.",
                start_date="2025-12",
                end_date="2026-02",
                display_order=1
            ),
            Experience(
                role="Frontend Developer Intern",
                company="Switch Automobiles (a subsidiary of Ashok Leyland)",
                location="no.1, sardar patel road, guindy, chennai-600032",
                description="Completed an IT internship assisting with IT support, systems configurations, and network settings.",
                start_date="2025-06",
                end_date="2025-06",
                display_order=2
            ),
            Experience(
                role="Community & Growth Intern",
                company="Fondi Inc.",
                location=None,
                description="Completed a Community & Growth internship contributing to the Community Onboarding Project and supporting user engagement activities while developing teamwork and communication skills.",
                start_date="2026-05",
                end_date="2026-05",
                display_order=3
            ),
            Experience(
                role="Content Writing Intern",
                company="InAmigos Foundation",
                location="Remote",
                description="Completed a content writing internship, focusing on researching topics, writing and editing high-quality content, and collaborating with team members.",
                start_date="2026-01",
                end_date="2026-01",
                display_order=4
            )
        ]
        db.session.add_all(experiences)
        
        # 4. Certificates
        certs = [
            Certificate(
                title="Certificate in Python",
                issuer="Python Institute / Coursera",
                image_url="/uploads/pdfs/certificattes/python.png",
                credential_url="/uploads/pdfs/certificattes/python.png",
                issued_date="2024-02-15",
                expiry_date=None,
                display_order=1
            ),
            Certificate(
                title="Claude with the Anthropic API",
                issuer="Anthropic",
                image_url="/uploads/pdfs/certificattes/fullstack.png",
                credential_url="/uploads/pdfs/certificattes/claude with antropic api.pdf",
                issued_date="2025-01-20",
                expiry_date=None,
                display_order=2
            ),
            Certificate(
                title="Introduction to Claude CoWork",
                issuer="Anthropic",
                image_url="/uploads/pdfs/certificattes/fullstack.png",
                credential_url="/uploads/pdfs/certificattes/introduction to claude codeworker.pdf",
                issued_date="2025-02-10",
                expiry_date=None,
                display_order=3
            ),
            Certificate(
                title="Web Designing (HTML, CSS, JS)",
                issuer="Coursera / FreeCodeCamp",
                image_url="/uploads/pdfs/certificattes/fullstack.png",
                credential_url="/uploads/pdfs/certificattes/web.pdf",
                issued_date="2024-06-15",
                expiry_date=None,
                display_order=4
            ),
            Certificate(
                title="Claude AI Fluency Certification",
                issuer="Anthropic",
                image_url="/uploads/pdfs/certificattes/fullstack.png",
                credential_url="/uploads/pdfs/certificattes/claud-ai fluency.pdf",
                issued_date="2025-03-05",
                expiry_date=None,
                display_order=5
            ),
            Certificate(
                title="Final Certificate (Jeshintha)",
                issuer="Prince Dr K.Vasudevan College",
                image_url="/uploads/pdfs/certificattes/fullstack.png",
                credential_url="/uploads/pdfs/certificattes/final_certificate_jeshintha.pdf",
                issued_date="2026-06-20",
                expiry_date=None,
                display_order=6
            ),
            Certificate(
                title="Claude with 101",
                issuer="Anthropic Community",
                image_url="/uploads/pdfs/certificattes/fullstack.png",
                credential_url="/uploads/pdfs/certificattes/claude with 101.pdf",
                issued_date="2025-04-10",
                expiry_date=None,
                display_order=7
            ),
            Certificate(
                title="Content Writing Internship Certificate",
                issuer="InAmigos Foundation",
                image_url="/uploads/pdfs/certificattes/inamigoes.jpg",
                credential_url="/uploads/pdfs/certificattes/inamigoes.jpg",
                issued_date="2026-02-14",
                expiry_date=None,
                display_order=8
            ),
            Certificate(
                title="IT Intern Switch Automobiles Certificate",
                issuer="Switch Automobiles (Ashok Leyland)",
                image_url="/uploads/pdfs/certificattes/switch.jpeg",
                credential_url="/uploads/pdfs/certificattes/switch.jpeg",
                issued_date="2025-06-30",
                expiry_date=None,
                display_order=9
            ),
            Certificate(
                title="Fondi Inc. Internship Certificate",
                issuer="Fondi Inc.",
                image_url="/uploads/pdfs/certificattes/fondi intenship certificate.jpg",
                credential_url="/uploads/pdfs/certificattes/fondi intenship certificate.jpg",
                issued_date="2026-05-30",
                expiry_date=None,
                display_order=10
            ),
            Certificate(
                title="Python with Artificial Intelligence Internship Certificate",
                issuer="BM FuturoMind AI",
                image_url="/uploads/pdfs/certificattes/futuroMindAI.jpg",
                credential_url="/uploads/pdfs/certificattes/futuroMindAI.jpg",
                issued_date="2026-02-28",
                expiry_date=None,
                display_order=11
            ),
            Certificate(
                title="Build a Data Mesh with Dataplex Skill Badge",
                issuer="Google Cloud Skill Boost",
                image_url="/uploads/pdfs/certificattes/gemini5.jpg",
                credential_url="/uploads/pdfs/certificattes/gemini5.jpg",
                issued_date="2026-05-22",
                expiry_date=None,
                display_order=12
            ),
            Certificate(
                title="Implement Cloud Security Fundamentals on Google Cloud Skill Badge",
                issuer="Google Cloud Skill Boost",
                image_url="/uploads/pdfs/certificattes/gemini6.jpg",
                credential_url="/uploads/pdfs/certificattes/gemini6.jpg",
                issued_date="2026-05-23",
                expiry_date=None,
                display_order=13
            ),
            Certificate(
                title="Gemini for Data Scientists and Analysts Completion Badge",
                issuer="Google Cloud Skill Boost",
                image_url="/uploads/pdfs/certificattes/gemini7.jpg",
                credential_url="/uploads/pdfs/certificattes/gemini7.jpg",
                issued_date="2026-05-24",
                expiry_date=None,
                display_order=14
            ),
            Certificate(
                title="Vishwakarma Awards 2025 Prototype Stage",
                issuer="Maker Bhavan Foundation",
                image_url="/uploads/pdfs/certificattes/vishwakarma_proto_certificate.jpg",
                credential_url="/uploads/pdfs/certificattes/vishwakarma_proto_certificate.jpg",
                issued_date="2025-02-01",
                expiry_date=None,
                display_order=15
            ),
            Certificate(
                title="LEAP Certificate of Completion (LP202 - Practicum for Innovative Engineering)",
                issuer="IITM Incubation Cell",
                image_url="/uploads/pdfs/certificattes/leap_certificate.jpg",
                credential_url="/uploads/pdfs/certificattes/leap_certificate.jpg",
                issued_date="2026-02-28",
                expiry_date=None,
                display_order=16
            ),
            Certificate(
                title="Introduction to AI concepts",
                issuer="Microsoft",
                image_url="/uploads/pdfs/certificattes/ms_ai_concepts.jpg",
                credential_url="/uploads/pdfs/certificattes/ms_ai_concepts.jpg",
                issued_date="2026-07-05",
                expiry_date=None,
                display_order=17
            ),
            Certificate(
                title="Introduction to natural language processing concepts",
                issuer="Microsoft",
                image_url="/uploads/pdfs/certificattes/ms_nlp_concepts.jpg",
                credential_url="/uploads/pdfs/certificattes/ms_nlp_concepts.jpg",
                issued_date="2026-07-05",
                expiry_date=None,
                display_order=18
            ),
            Certificate(
                title="Introduction to AI speech concepts",
                issuer="Microsoft",
                image_url="/uploads/pdfs/certificattes/ms_speech_concepts.jpg",
                credential_url="/uploads/pdfs/certificattes/ms_speech_concepts.jpg",
                issued_date="2026-07-05",
                expiry_date=None,
                display_order=19
            )
        ]
        db.session.add_all(certs)
        
        # 5. Achievements
        achievements = [
            Achievement(
                title="Vishwakarma Award (3rd Round Shortlisted)",
                description="Shortlisted for the 3rd round of the prestigious national Vishwakarma Award (2025) for the innovative 'Punch Detector – AutoScore' boxing glove project.",
                icon="Award",
                achieved_date="2025-02-01",
                display_order=1
            ),
            Achievement(
                title="Anna University Boxing Silver Medalist (2nd Place)",
                description="Won the silver medal (2nd Place) in the Anna University boxing competition during the 3rd year.",
                icon="Trophy",
                achieved_date="2025-11-20",
                display_order=2
            ),
            Achievement(
                title="Anna University Gold Medalist",
                description="Won the gold medal in boxing at the Anna University competition, demonstrating elite discipline and athletic excellence.",
                icon="Trophy",
                achieved_date="2024-11-15",
                display_order=3
            ),
            Achievement(
                title="Best Sports Woman Award (2023)",
                description="Recognized as the top female athlete in college for outstanding sports performances.",
                icon="Star",
                achieved_date="2023-05-10",
                display_order=4
            )
        ]
        db.session.add_all(achievements)
        
        # 6. Contact Messages
        messages = [
            ContactMessage(
                name="Switch Automobiles Recruiter",
                email="recruitment@switchautomobiles.com",
                subject="Follow-up on Switch Automobiles IT Internship",
                message="Hi Jeshintha, we were pleased with your performance during your internship. Let us know if you are open to discussing full-time opportunities after your graduation in 2027.",
                is_read=False,
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            ),
            ContactMessage(
                name="Fondi Inc. Team",
                email="team@fondi.io",
                subject="Outstanding Community Contribution",
                message="Thank you for contributing to the Community Onboarding Project. Your engagement activities were highly impactful!",
                is_read=True,
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            )
        ]
        db.session.add_all(messages)
        
        # 7. Analytics
        countries = ["India", "United States", "United Kingdom", "Singapore", "Germany"]
        devices = ["Desktop", "Mobile", "Tablet"]
        pages = ["/home", "/home#projects", "/home#about", "/home#skills", "/home#certificates"]
        
        for i in range(30, -1, -1):
            date = datetime.datetime.utcnow() - datetime.timedelta(days=i)
            num_visitors = random.randint(5, 20)
            for v in range(num_visitors):
                ip_hash = hashlib.sha256(f"jes_visitor_{i}_{v}".encode('utf-8')).hexdigest()
                db.session.add(VisitorAnalytics(
                    ip_hash=ip_hash,
                    page=random.choice(pages),
                    country=random.choices(countries, weights=[75, 15, 5, 3, 2])[0],
                    device_type=random.choices(devices, weights=[60, 35, 5])[0],
                    referrer="https://github.com" if random.random() > 0.4 else None,
                    visited_at=date - datetime.timedelta(hours=random.randint(0, 23))
                ))
                
        db.session.commit()
        print("Jeshintha's database seeding completed successfully!")

if __name__ == "__main__":
    seed()
