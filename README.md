# AI Resume Analyzer

A full-stack web app where users sign up, upload their resume (PDF or DOCX), and get AI-powered feedback: an overall score, strengths, missing sections, specific improvements, missing keywords, and before/after rewrite examples. Every analysis is saved to the user's history.

**Live demo:** https://ai-resume-analyzer-rj00.onrender.com
**API docs:** https://ai-resume-analyzer-backend-9tro.onrender.com

> The free Render tier sleeps when idle, so the first request may take 30-60 seconds.

## Features

- User registration and login with JWT authentication
- Passwords hashed with bcrypt
- Upload a PDF or DOCX resume (max 5 MB)
- Choose a target role to get role-specific feedback
- AI analysis powered by Claude: score, strengths, sections found and missing, improvements, keywords to add, rewrite examples
- History page with every past analysis, scoped to the logged-in user
- Protected routes and automatic logout when the session expires
- Responsive UI with a mobile navigation menu

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite (local), PostgreSQL (production) |
| Auth | JWT (PyJWT), bcrypt |
| File parsing | pypdf, python-docx |
| AI | Anthropic API (Claude) |
| Deployment | Render |

## How it works

```
React (browser)  ──HTTP──▶  FastAPI  ──▶  SQLite / PostgreSQL
                               │
                               ├──▶ pypdf / python-docx (extract text)
                               └──▶ Anthropic API (analysis as JSON)
```

1. The user registers and logs in. The backend returns a signed JWT, which the frontend stores and sends with every request.
2. The user uploads a resume. The backend verifies the token, checks file type and size, and extracts the text.
3. The text and target role are sent to Claude with a prompt that requires a fixed JSON structure.
4. The result is saved in the database, linked to the user, and returned to the frontend to display.

The API key stays on the server and is never exposed to the browser.

## Project structure

```
ai-resume-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, CORS, router registration
│   │   ├── database.py        # DB engine and session
│   │   ├── models.py          # User and Analysis tables
│   │   ├── schemas.py
│   │   ├── auth.py            # password hashing, JWT, current-user dependency
│   │   ├── parser.py          # PDF / DOCX text extraction
│   │   ├── ai.py              # Claude API call
│   │   └── routes/
│   │       ├── auth_routes.py
│   │       └── resume_routes.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js             # axios instance + interceptors
        ├── AuthContext.jsx    # login state
        ├── components/        # Navbar, ProtectedRoute, ResultView
        └── pages/             # Login, Register, Dashboard, History
```

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Log in, returns a JWT |
| POST | `/resume/analyze` | Yes | Upload a resume and get the AI analysis |
| GET | `/resume/history` | Yes | List the user's past analyses |

Interactive docs are available at `/docs` when the backend is running.




### 1. Clone

```bash
git clone https://github.com/YOUR-USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
```

Create `backend/.env` (copy from `.env.example`):

```
SECRET_KEY=your-long-random-string
ANTHROPIC_API_KEY=your-anthropic-api-key
```

Generate a secret key:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Start the server:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000` and the docs at `http://localhost:8000/docs`.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

### Backend

| Variable | Description |
|---|---|
| `SECRET_KEY` | Secret used to sign JWTs |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `DATABASE_URL` | Database URL. Defaults to local SQLite when not set |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs allowed by CORS |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL. Defaults to `http://localhost:8000` |

## Deployment (Render)

- **Database:** a Render PostgreSQL instance. Its internal URL goes into the backend's `DATABASE_URL`.
- **Backend:** a Web Service with Root Directory `backend`, Build Command `pip install -r requirements.txt`, and Start Command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Frontend:** a Static Site with Root Directory `frontend`, Build Command `npm install && npm run build`, and Publish Directory `dist`, plus a rewrite rule from `/*` to `/index.html` so React Router works on refresh.

## Security notes

- Passwords are hashed with bcrypt and never stored in plain text.
- JWTs are signed and expire after 12 hours.
- Secrets live in environment variables and are excluded from git.
- Uploads are validated for type and size and are not written to disk.
- Every history query is filtered by the logged-in user's id.
- CORS only allows the configured frontend origin.

## Limitations and future improvements

- Scanned (image-only) PDFs are not supported because there is no OCR
- Rate limiting to control API cost
- Delete-analysis option
- Job description matching with a match percentage and missing keywords
- Refresh tokens and httpOnly cookies instead of `localStorage`
- Automated tests for the auth and resume routes

## Author

**Amit Kumar**
GitHub: [@YOUR-USERNAME](https://github.com/aryan95080/)
LinkedIn: https://www.linkedin.com/in/amit-kumar-127112292/?isSelfProfile=true
