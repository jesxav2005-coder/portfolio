# Production-Ready Full-Stack Developer Portfolio Application

A complete full-stack portfolio website and admin dashboard constructed using React, Flask, and Docker.

---

## Technical Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Query
- **Backend:** Flask 3, SQLAlchemy, Flask-Migrate, Flask-Limiter, Flask-Mail
- **Database:** SQLite (local development), ready to swap to MySQL (production config)
- **AI Brain:** Anthropic Claude API (Sonnet 3.5)
- **Deployment:** Docker, Docker Compose, Nginx Reverse Proxy

---

## Getting Started

### Local Development Setup

#### 1. Start Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd portfolio-project/backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   py -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations and database upgrade:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```
5. Seed sample database records:
   ```bash
   python seed.py
   ```
6. Start the Flask server:
   ```bash
   python run.py
   ```

#### 2. Start Frontend
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd portfolio-project/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Navigate to `http://localhost:5173`.

---

## Docker Containerized Deployment

Run the entire application bundle containerized behind the Nginx reverse proxy:
```bash
cd portfolio-project
docker compose up --build
```
Navigate to `http://localhost` to view the website.

---

## Default Credentials

For accessing the protected Admin Panel (`http://localhost/admin/login` or `http://localhost:5173/admin/login`):
- **Username:** `admin`
- **Password:** `password123`
