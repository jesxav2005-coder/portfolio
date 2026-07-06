from flask import Blueprint, request
from app.extensions import db
from app.models.chatbot import ChatbotLog
from app.services.ai_service import generate_ai_response
from app.utils.response import success_response, error_response
from app.utils.security import sanitize_input

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/message", methods=["POST"])
def send_message():
    data = request.get_json() or {}
    user_message = data.get("message")
    session_id = data.get("session_id", "default_session")
    history = data.get("history", []) # Array of {"role": "user"/"assistant", "content": "..."}

    if not user_message:
        return error_response("Message is required", 400)

    # Sanitize message
    user_message = sanitize_input(user_message)

    # Get AI response
    bot_response = generate_ai_response(user_message, conversation_history=history)

    # Save to Chatbot Logs
    log = ChatbotLog(
        session_id=session_id,
        user_message=user_message,
        bot_response=bot_response
    )
    db.session.add(log)
    db.session.commit()

    return success_response({
        "response": bot_response
    })
