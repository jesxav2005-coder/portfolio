import unittest
import json
from app import create_app
from app.extensions import db
from app.models.admin import AdminUser
from app.models.skill import Skill
from app.models.contact import ContactMessage

class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("development")
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        
        # Get an auth token for admin tests
        login_data = {"username": "admin", "password": "password123"}
        response = self.client.post("/api/auth/login", data=json.dumps(login_data), content_type="application/json")
        res_json = json.loads(response.data.decode("utf-8"))
        self.token = res_json["data"]["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def tearDown(self):
        self.ctx.pop()

    def test_public_portfolio_endpoints(self):
        # 1. Profile
        response = self.client.get("/api/portfolio/profile")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["full_name"], "Jeshintha X")

        # 2. Skills
        response = self.client.get("/api/portfolio/skills")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertTrue(data["success"])
        self.assertTrue(len(data["data"]) > 0)

        # 3. Projects
        response = self.client.get("/api/portfolio/projects")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertTrue(data["success"])
        self.assertTrue(len(data["data"]) > 0)

        # 3.5. Experiences
        response = self.client.get("/api/portfolio/experiences")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertTrue(data["success"])
        self.assertTrue(len(data["data"]) > 0)

        # 4. Certificates
        response = self.client.get("/api/portfolio/certificates")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertTrue(data["success"])

        # 5. Achievements
        response = self.client.get("/api/portfolio/achievements")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode("utf-8"))
        self.assertTrue(data["success"])

    def test_contact_form_and_rate_limiting(self):
        # Trigger rate limit (5 per hour)
        contact_data = {
            "name": "Jane Test",
            "email": "jane@example.com",
            "subject": "Testing subject",
            "message": "This is a test message of adequate length."
        }

        # Clear existing contact messages first to prevent clutter
        ContactMessage.query.delete()
        db.session.commit()

        # Send 5 valid contact form submissions (which should succeed)
        for i in range(5):
            response = self.client.post(
                "/api/portfolio/contact",
                data=json.dumps(contact_data),
                content_type="application/json"
            )
            self.assertEqual(response.status_code, 200)
            res_json = json.loads(response.data.decode("utf-8"))
            self.assertTrue(res_json["success"])

        # The 6th submission should exceed the rate limit and return 429
        response = self.client.post(
            "/api/portfolio/contact",
            data=json.dumps(contact_data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 429)
        res_json = json.loads(response.data.decode("utf-8"))
        self.assertFalse(res_json["success"])
        self.assertIn("error", res_json)

    def test_admin_crud_skills(self):
        # 1. Get all skills
        response = self.client.get("/api/admin/skills", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        
        # 2. Add skill
        new_skill = {
            "name": "Rust Programming",
            "category": "Backend",
            "proficiency": 75,
            "display_order": 10,
            "is_active": True
        }
        response = self.client.post(
            "/api/admin/skills",
            data=json.dumps(new_skill),
            content_type="application/json",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 201)
        res_json = json.loads(response.data.decode("utf-8"))
        skill_id = res_json["data"]["id"]
        self.assertEqual(res_json["data"]["name"], "Rust Programming")

        # 3. Update skill
        updated_skill = {
            "name": "Rust Programming (Advanced)",
            "category": "Backend",
            "proficiency": 85,
            "display_order": 10,
            "is_active": True
        }
        response = self.client.put(
            f"/api/admin/skills/{skill_id}",
            data=json.dumps(updated_skill),
            content_type="application/json",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.data.decode("utf-8"))
        self.assertEqual(res_json["data"]["name"], "Rust Programming (Advanced)")
        self.assertEqual(res_json["data"]["proficiency"], 85)

        # 4. Delete skill
        response = self.client.delete(f"/api/admin/skills/{skill_id}", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        
        # Verify it is deleted
        deleted_skill = Skill.query.get(skill_id)
        self.assertIsNone(deleted_skill)

    def test_chatbot_endpoint(self):
        chatbot_data = {
            "message": "What skills do you have?",
            "session_id": "test_session",
            "history": []
        }
        response = self.client.post(
            "/api/chatbot/message",
            data=json.dumps(chatbot_data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.data.decode("utf-8"))
        self.assertTrue(res_json["success"])
        self.assertIn("response", res_json["data"])
        # Should return a response string (either from API or dummy demo response)
        self.assertIsInstance(res_json["data"]["response"], str)

if __name__ == "__main__":
    unittest.main()
