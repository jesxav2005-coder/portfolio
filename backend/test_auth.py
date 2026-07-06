import unittest
import json
from app import create_app
from app.extensions import db
from app.models.admin import AdminUser

class AuthTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("development")
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    def test_auth_flow_complete(self):
        # 1. Attempt login with correct credentials
        login_data = {
            "username": "admin",
            "password": "password123"
        }
        
        response = self.client.post(
            "/api/auth/login",
            data=json.dumps(login_data),
            content_type="application/json"
        )
        
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.data.decode("utf-8"))
        self.assertTrue(res_json["success"])
        self.assertIn("access_token", res_json["data"])
        
        access_token = res_json["data"]["access_token"]
        user_info = res_json["data"]["user"]
        self.assertEqual(user_info["username"], "admin")

        # 2. Check if refresh token cookie is set
        # Get cookies
        cookie_header = response.headers.get("Set-Cookie")
        self.assertIsNotNone(cookie_header)
        self.assertIn("refresh_token", cookie_header)
        self.assertIn("HttpOnly", cookie_header)

        # Extract refresh cookie value
        cookies = response.headers.getlist("Set-Cookie")
        refresh_cookie_str = [c for c in cookies if "refresh_token" in c][0]
        refresh_token = refresh_cookie_str.split("=")[1].split(";")[0]

        # 3. Test access to protected endpoint without token (should fail 401)
        response = self.client.get("/api/admin/profile")
        self.assertEqual(response.status_code, 401)

        # 4. Test access to protected endpoint with access token (should pass 200)
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        response = self.client.get("/api/admin/profile", headers=headers)
        self.assertEqual(response.status_code, 200)

        # 5. Test refresh token rotation
        import time
        time.sleep(1.1)
        self.client.set_cookie("refresh_token", refresh_token)
        response = self.client.post("/api/auth/refresh")
        self.assertEqual(response.status_code, 200)
        res_json = json.loads(response.data.decode("utf-8"))
        self.assertTrue(res_json["success"])
        self.assertIn("access_token", res_json["data"])
        new_access_token = res_json["data"]["access_token"]
        self.assertNotEqual(access_token, new_access_token)

        # 6. Test logout (clears refresh token)
        response = self.client.post("/api/auth/logout")
        self.assertEqual(response.status_code, 200)
        # Check that the cookie is deleted
        cookie_header = response.headers.get("Set-Cookie")
        self.assertIn("refresh_token=;", cookie_header)

if __name__ == "__main__":
    unittest.main()
