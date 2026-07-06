import hashlib
import requests
from flask import Blueprint, request
from app.extensions import db
from app.models.analytics import VisitorAnalytics
from app.utils.response import success_response, error_response
from app.utils.security import sanitize_input

analytics_bp = Blueprint("analytics", __name__)

def get_country_from_ip(ip):
    # Skip lookup for local IP addresses
    if ip in ("127.0.0.1", "localhost", "::1") or ip.startswith("192.168.") or ip.startswith("10.") or ip.startswith("172."):
        return "Localhost"
    try:
        # Fetch country using ip-api (free, no registration) with a short timeout
        r = requests.get(f"http://ip-api.com/json/{ip}", timeout=1.0)
        if r.status_code == 200:
            data = r.json()
            if data.get("status") == "success":
                return data.get("country", "Unknown")
    except Exception:
        pass
    return "Unknown"

def get_device_type(user_agent_str):
    if not user_agent_str:
        return "Desktop"
    ua = user_agent_str.lower()
    if "ipad" in ua or "android" in ua and "mobile" not in ua:
        return "Tablet"
    elif "mobile" in ua or "iphone" in ua or "android" in ua:
        return "Mobile"
    return "Desktop"

@analytics_bp.route("/track", methods=["POST"])
def track():
    data = request.get_json() or {}
    page = data.get("page", "/home")
    referrer = data.get("referrer")
    
    # Extract IP address from request, considering proxy headers
    ip = request.headers.get("X-Forwarded-For")
    if ip:
        ip = ip.split(",")[0].strip()
    else:
        ip = request.remote_addr or "127.0.0.1"

    # SHA-256 hash the IP for visitor privacy compliance
    ip_hash = hashlib.sha256(ip.encode("utf-8")).hexdigest()
    
    # Extract device type and country
    user_agent = request.headers.get("User-Agent", "")
    device_type = get_device_type(user_agent)
    country = get_country_from_ip(ip)

    analytics_log = VisitorAnalytics(
        ip_hash=ip_hash,
        page=sanitize_input(page),
        country=country,
        device_type=device_type,
        referrer=sanitize_input(referrer)
    )

    db.session.add(analytics_log)
    db.session.commit()

    return success_response({"status": "tracked"})
