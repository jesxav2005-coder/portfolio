from anthropic import Anthropic
from flask import current_app
from app.models.profile import Profile
from app.models.skill import Skill
from app.models.project import Project
from app.models.certificate import Certificate
from app.models.experience import Experience
from app.models.achievement import Achievement

def build_system_prompt():
    profile = Profile.query.first()
    if not profile:
        return "You are an AI assistant for a developer portfolio. The developer has not initialized their profile details yet."
        
    skills = Skill.query.filter_by(is_active=True).all()
    projects = Project.query.all()
    certs = Certificate.query.all()
    experiences = Experience.query.order_by(Experience.display_order.asc()).all()
    achievements = Achievement.query.order_by(Achievement.display_order.asc()).all()
    
    return f"""You are an AI assistant for {profile.full_name}'s 
developer portfolio. Answer questions about their background, 
skills, projects, work experiences (internships), education, achievements, and how to contact them. Be concise, friendly, 
and professional. Never make up information not in this data.

NAME: {profile.full_name}
TITLE: {profile.title}
BIO: {profile.bio}
EDUCATION:
- Bachelor of Engineering (B.E) in Computer Science & Engineering at Prince Dr. K. Vasudevan College of Engineering and Technology (2023 - 2027, current CGPA: 84.5%)
- Higher Secondary School (XII) at Revoor Padmanaba Chettiar Mat High Sec School (2022 - 2023, Mark: 490/600)
- Secondary School (X) at V.O.C Mat High Sec School (2020 - 2021, All Pass)
SKILLS: {[s.name for s in skills]}
PROJECTS: {[{'title': p.title, 'tech': p.tech_stack, 
             'demo': p.demo_url} for p in projects]}
INTERNSHIPS & EXPERIENCES: {[{'role': exp.role, 'company': exp.company, 'description': exp.description, 'duration': f"{exp.start_date} to {exp.end_date}"} for exp in experiences]}
ACHIEVEMENTS: {[{'title': a.title, 'description': a.description, 'date': a.achieved_date} for a in achievements]}
CERTIFICATES: {[c.title + ' by ' + c.issuer for c in certs]}
CONTACT: {profile.social_links}
"""

def fallback_ai_response(user_message):
    user_message = user_message.lower()
    
    from app.models.profile import Profile
    from app.models.skill import Skill
    from app.models.project import Project
    from app.models.experience import Experience
    
    profile = Profile.query.first()
    skills = Skill.query.filter_by(is_active=True).all()
    projects = Project.query.all()
    experiences = Experience.query.order_by(Experience.display_order.asc()).all()
    
    # 1. Contact Info
    if any(k in user_message for k in ["contact", "email", "phone", "linkedin", "github", "social"]):
        if profile and profile.social_links:
            links = profile.social_links
            email = links.get("email", "jesxav2005@gmail.com")
            phone = links.get("phone", "")
            linkedin = links.get("linkedin", "")
            github = links.get("github", "")
            ans = f"You can contact Jeshintha X via:\n- 📧 Email: {email}"
            if phone: ans += f"\n- 📞 Phone: {phone}"
            if linkedin: ans += f"\n- 💼 LinkedIn: {linkedin}"
            if github: ans += f"\n- 💻 GitHub: {github}"
            return ans
        return "You can contact Jeshintha X at jesxav2005@gmail.com."

    # 2. Rotaract (must be evaluated before generic 'school' checks)
    if any(k in user_message for k in ["rotaract", "rotarach", "chairman", "back to school", "school project"]):
        return "Jeshintha serves as the Project Chairman for the 'Back to School' initiative in the Rotaract Club. In this leadership role, she coordinated school supply drives, gathered community donations, and organized academic support for underprivileged children."

    # 3. Achievements / Awards
    if any(k in user_message for k in ["vishwakarma", "award", "accomplishment", "honor", "trophy", "star"]):
        return "Jeshintha X's honors and awards include:\n1. 🏆 **Vishwakarma Award (3rd Round Shortlisted)** in 2025 for her 'Punch Detector – AutoScore' boxing glove project.\n2. 🥇 **Anna University Boxing Gold Medalist**.\n3. 🥈 **Anna University Boxing Silver Medalist (2nd Place)** during her 3rd year.\n4. 🌟 **Best Sports Woman Award (2023)** for outstanding sports performance in college."

    # 4. Boxing
    if any(k in user_message for k in ["boxing", "boxer", "national", "gold", "medal", "sports", "athlete", "silver", "second place"]):
        return "Jeshintha is a highly accomplished National Boxer! She is an Anna University Boxing Gold Medalist, a Silver Medalist (2nd Place in her 3rd year), and she actively coordinates events in sports clubs."

    # 5. NCC
    if any(k in user_message for k in ["ncc", "cadet", "corps", "drill"]):
        return "Jeshintha served as an active NCC Cadet (National Cadet Corps), demonstrating strong leadership, teamwork, and discipline."

    # 6. Resume
    if any(k in user_message for k in ["resume", "cv", "pdf", "print"]):
        return "You can view, print, or download Jeshintha's full professional resume as an A4 PDF by clicking the 'View Resume' button in the Hero or Achievements section of the homepage!"

    # 7. Projects
    if any(k in user_message for k in ["project", "canteen", "punch detector", "esp32", "auto score"]):
        if projects:
            proj_details = []
            for p in projects:
                tech = ", ".join(p.tech_stack) if p.tech_stack else ""
                proj_details.append(f"- **{p.title}** ({tech}): {p.description}")
            return "Jeshintha X's featured projects:\n" + "\n".join(proj_details)
        return "Jeshintha's key projects include the Punch Detector - AutoScore boxing glove, Smart Canteen ordering system, and AI-based forecasting widgets."

    # 8. Internships / Experience
    if any(k in user_message for k in ["internship", "experience", "work", "job", "switch", "fondi"]):
        if experiences:
            exp_details = []
            for exp in experiences:
                desc = exp.description or ""
                if len(desc) > 150: desc = desc[:150] + "..."
                exp_details.append(f"- **{exp.role}** at **{exp.company}** ({exp.start_date} to {exp.end_date}): {desc}")
            return "Jeshintha X's internship experiences:\n" + "\n".join(exp_details)
        return "Jeshintha has completed two internships:\n1. IT Intern at Fondi Inc. (remote)\n2. Web Development Intern at Switch Automobiles."

    # 9. Education
    if any(k in user_message for k in ["education", "college", "school", "degree", "study", "cgpa", "mark", "prince"]):
        return "Jeshintha X's academic background includes:\n1. 🎓 **Bachelor of Engineering (B.E) in Computer Science & Engineering** at **Prince Dr. K. Vasudevan College of Engineering and Technology** (2023 - 2027, current CGPA: 84.5%).\n2. 🏫 **Higher Secondary (Class XII)** at **Revoor Padmanaba Chettiar Mat High Sec School** (2022 - 2023, Mark: 490/600).\n3. 🏫 **Secondary School (Class X)** at **V.O.C Mat High Sec School** (2020 - 2021, All Pass)."

    # 10. Skills
    if any(k in user_message for k in ["skill", "tech", "languages", "programming", "databases", "python", "fastapi", "react", "js", "javascript", "streamlit", "mysql", "html", "css"]):
        if skills:
            skill_list = [s.name for s in skills]
            return f"Jeshintha's technical skills include: {', '.join(skill_list)}."
        return "Jeshintha is skilled in Python, FastAPI, React, JavaScript, Streamlit, HTML/CSS, and MySQL."

    # 11. Who is she / About / Hello
    if any(k in user_message for k in ["who are you", "who is", "about", "bio", "tell me", "jeshintha", "hello", "hi", "hey"]):
        bio = profile.bio if profile else "A Computer Science Engineering student passionate about full stack development and hardware integration."
        return f"Hi! I'm Jeshintha's AI assistant. {bio}\n\nAsk me about her:\n- 🥊 Boxing & Achievements\n- 🎖️ NCC Cadet background\n- 🎒 Rotaract Project Chairman ('Back to School' initiative)\n- 💻 Technical Skills\n- 📁 Projects (like Punch Detector)\n- 🏢 Internships (Switch Automobiles & Fondi Inc.)"

    # Default fallback
    return "I'm Jeshintha's portfolio assistant! You can ask me about her Technical Skills, Projects, Internship Experiences, Boxing Gold Medals, or NCC Cadet service. What would you like to know?"

def generate_ai_response(user_message, conversation_history=None):
    # 1. Try Anthropic Claude API if key is present
    anthropic_key = current_app.config.get("ANTHROPIC_API_KEY")
    if anthropic_key and anthropic_key != "dummy-anthropic-key-for-now":
        try:
            client = Anthropic(api_key=anthropic_key)
            system_prompt = build_system_prompt()
            
            messages = []
            if conversation_history:
                for h in conversation_history:
                    if h.get("role") in ["user", "assistant"] and h.get("content"):
                        messages.append({
                            "role": h["role"],
                            "content": h["content"]
                        })
            messages.append({"role": "user", "content": user_message})
            
            response = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=500,
                temperature=0.3,
                system=system_prompt,
                messages=messages
            )
            return response.content[0].text
        except Exception as e:
            print(f"Error calling Anthropic API: {e}")

    # 2. Try Hugging Face Inference API if key is present
    hf_key = current_app.config.get("HUGGINGFACE_API_KEY")
    if hf_key and hf_key != "dummy-huggingface-key-for-now":
        try:
            import requests
            model_name = current_app.config.get("HUGGINGFACE_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")
            system_prompt = build_system_prompt()
            
            url = f"https://api-inference.huggingface.co/models/{model_name}/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {hf_key}",
                "Content-Type": "application/json"
            }
            
            messages = [{"role": "system", "content": system_prompt}]
            if conversation_history:
                for h in conversation_history:
                    if h.get("role") in ["user", "assistant"] and h.get("content"):
                        messages.append({
                            "role": h["role"],
                            "content": h["content"]
                        })
            messages.append({"role": "user", "content": user_message})
            
            payload = {
                "model": model_name,
                "messages": messages,
                "max_tokens": 500,
                "temperature": 0.3
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=15)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Error calling Hugging Face API: {e}")

    # 3. Default to local rule-based response if no API keys succeed
    return fallback_ai_response(user_message)
