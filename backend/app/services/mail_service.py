import os
import resend
from flask import current_app

def send_contact_notification(contact_message):
    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        print("Failed to send email: RESEND_API_KEY is not configured in .env file.")
        return False
        
    resend.api_key = resend_api_key
    admin_email = current_app.config.get("ADMIN_EMAIL", "jesxav2005@gmail.com")
    
    subject = f"Portfolio Contact: {contact_message.subject}"
    body = f"""
You have received a new contact submission from your portfolio website.

Name: {contact_message.name}
Email: {contact_message.email}
Subject: {contact_message.subject}

Message:
---------------------------------------------
{contact_message.message}
---------------------------------------------

Submitted at: {contact_message.created_at}
"""
    
    try:
        # Resend onboarding emails are sent from onboarding@resend.dev to the registered account owner
        r = resend.Emails.send({
            "from": "Portfolio Assistant <onboarding@resend.dev>",
            "to": [admin_email],
            "subject": subject,
            "text": body
        })
        print(f"Resend notification email sent successfully: {r}")
        return True
    except Exception as e:
        # Log to stderr/stdout
        print(f"Failed to send contact notification email via Resend: {e}")
        return False
