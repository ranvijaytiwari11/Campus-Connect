# CampusConnect — Pure Full-Stack MERN College Management System

CampusConnect is a production-ready, interview-friendly College Management System built with the **MERN** stack (MongoDB, Express.js, React, Node.js). It implements secure Role-Based Access Control (RBAC) across three distinct user roles: **Admin**, **Teacher**, and **Student**.

> **Note on Architecture & Security:**
> This project is built as a pure, robust full-stack web application. It **does not** use Generative AI, LLM APIs, or third-party AI APIs. All authentication, authorization, data relationships, and business logic are natively implemented using Node.js, Express, MongoDB/Mongoose, React, and JWT.

---

## 🌟 Key Features

### 🛡️ Core Authentication & Security
- **Stateless JWT Authentication**: Signed tokens with 30-day expiration.
- **Salted Password Hashing**: `bcryptjs` with 10 salt rounds.
- **Role-Based Authorization (RBAC)**: Backend enforcement via `roleMiddleware` (`admin`, `teacher`, `student`).
- **Axios Bearer Interceptor**: Automated JWT injection in frontend request headers.

### 🏛️ Administrator Workspace
- Institutional metrics dashboard (Total Students, Faculty, Courses, Admins).
- Full user provisioning and management (Students, Teachers, Admins).
- Course and department creation, semester configuration, and faculty assignment.

### 👨‍🏫 Faculty / Teacher Workspace
- Course schedule overview and class records.
- Daily attendance tracking with bulk synchronization.
- Assignment publishing and submission management.
- Student submission evaluation and instant grading.
- Examination marks entry with automated grade calculations (`A+`, `A`, `B`, etc.).

### 🎓 Student Portal
- Academic summary dashboard (Attendance rate, GPA, pending deadlines).
- Subject-wise and daily attendance tracking.
- Course assignment viewer and deliverable submissions.
- Official examination result sheets and GPA card.

---

## 🛠️ Tech Stack

- **Frontend**: React.js 18, Vite, React Router DOM v6, Axios, Lucide React, Custom CSS Design System
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Architecture**: Stateless RESTful API with Role-Based Access Control (RBAC)

---

## 🏗️ Project Architecture

```text
                           CLIENT LAYER (Browser)
      ┌────────────────────────────────────────────────────────────┐
      │                        React 18 (Vite)                     │
      │  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
      │  │  Components  │   │ AuthContext  │   │  Axios Service │  │
      │  │   & Pages    │──▶│  (JWT State) │──▶│   (Base API)   │  │
      │  └──────────────┘   └──────────────┘   └───────┬────────┘  │
      └────────────────────────────────────────────────┼───────────┘
                                                       │
                                              HTTP / REST API
                                        (Bearer JWT in Header)
                                                       │
                                                       ▼
                          SERVER LAYER (Node.js & Express)
      ┌────────────────────────────────────────────────────────────┐
      │  index.js (CORS, Express JSON, Central Routing)            │
      │                                                            │
      │  Middleware Pipeline:                                      │
      │  ┌───────────────────────┐      ┌───────────────────────┐  │
      │  │ authMiddleware (JWT)  │ ───▶ │ roleMiddleware (RBAC) │  │
      │  └───────────────────────┘      └──────────┬────────────┘  │
      │                                            │               │
      │  Route Dispatcher & Controllers:           ▼               │
      │  ┌──────────────────┬──────────────────┬────────────────┐  │
      │  │  authController  │  userController  │ courseController│  │
      │  ├──────────────────┼──────────────────┼────────────────┤  │
      │  │attendanceControll│assignmentControll│resultController│  │
      │  └──────────────────┴────────┬─────────┴────────────────┘  │
      │                              │                             │
      │                      Mongoose Models                       │
      └──────────────────────────────┼─────────────────────────────┘
                                     │
                             MongoDB Driver TCP
                                     │
                                     ▼
                          DATABASE LAYER (MongoDB)
      ┌────────────────────────────────────────────────────────────┐
      │  Collections:                                              │
      │  - users        - courses      - attendances               │
      │  - assignments  - submissions  - results                   │
      └────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```text
CampusConnect/
│
├── client/                               # Frontend: React + Vite Single Page Application
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── components/                   # Navbar, Sidebar, StatCard, Modal, Alert, ProtectedRoute
│   │   ├── context/                      # AuthContext global state
│   │   ├── pages/                        # Admin, Teacher, Student views & Auth screens
│   │   ├── services/                     # Centralized Axios API services
│   │   ├── App.jsx                       # Client-side router & route protection
│   │   ├── main.jsx                      # React DOM mount point
│   │   └── index.css                     # Design system & responsive styles
│   ├── index.html                        # HTML template
│   ├── vite.config.js                    # Vite dev proxy configuration
│   └── package.json                      # Frontend dependencies
│
├── server/                               # Backend: Node.js + Express REST API
│   ├── config/                           # Database connection (db.js)
│   ├── controllers/                      # Auth, User, Course, Attendance, Assignment, Result logic
│   ├── middleware/                       # authMiddleware, roleMiddleware, errorMiddleware
│   ├── models/                           # User, Course, Attendance, Assignment, Submission, Result
│   ├── routes/                           # Modular Express REST endpoints
│   ├── utils/                            # Token generator & seed script
│   ├── .env.example                      # Environment template
│   ├── index.js                          # Express server entry point
│   └── package.json                      # Backend dependencies
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB instance or MongoDB Atlas cluster)

### 2. Backend Installation & Setup
```bash
cd server
npm install
```

Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=8001
MONGO_URI=mongodb://127.0.0.1:27017/campus_connect
JWT_SECRET=campus_connect_jwt_secret_key_2026_super_secure
NODE_ENV=development
```

Seed initial demo data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server running at http://localhost:8001
```

### 3. Frontend Installation & Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
# Frontend running at http://localhost:5173
```

---

## 🔑 Demo Login Credentials

All demo accounts share the password: `password123`

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Admin** | `admin@campusconnect.com` | `password123` | Full user management, courses creation, platform stats |
| **Teacher** | `sarah.smith@campusconnect.com` | `password123` | Class roll call, create assignments, grade submissions, publish results |
| **Student** | `alex.johnson@campusconnect.com` | `password123` | View attendance %, submit assignments, check grades & GPA |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user account
- `POST /api/auth/login` — Authenticate and receive signed JWT
- `GET /api/auth/me` — Fetch active session profile

### Users (`/api/users`)
- `GET /api/users` — List users with optional role filtering (Admin)
- `GET /api/users/stats/overview` — Institutional metrics & counts (Admin)
- `GET /api/users/:id` — Get single user details (Admin)
- `PUT /api/users/:id` — Update user profile (Admin)
- `DELETE /api/users/:id` — Delete user account (Admin)

### Courses (`/api/courses`)
- `GET /api/courses` — List all courses
- `GET /api/courses/:id` — Get course details
- `POST /api/courses` — Create course and assign teacher (Admin)
- `PUT /api/courses/:id` — Update course details (Admin)
- `DELETE /api/courses/:id` — Delete course (Admin)

### Attendance (`/api/attendance`)
- `POST /api/attendance` — Bulk mark class attendance (Teacher)
- `GET /api/attendance/course/:courseId` — Course attendance records (Teacher/Admin)
- `GET /api/attendance/my-attendance` — Personal attendance metrics (Student)

### Assignments (`/api/assignments`)
- `GET /api/assignments` — List assignments (filtered by course/student status)
- `POST /api/assignments` — Publish assignment with deadline (Teacher)
- `POST /api/assignments/:id/submit` — Submit work deliverable (Student)
- `GET /api/assignments/:id/submissions` — List submissions (Teacher/Admin)
- `PUT /api/assignments/submissions/:submissionId/grade` — Grade submission & feedback (Teacher)

### Results (`/api/results`)
- `POST /api/results` — Enter marks and publish letter grade (Teacher/Admin)
- `GET /api/results/my-results` — View grade report and GPA (Student)
- `GET /api/results/course/:courseId` — View class grade sheet (Teacher/Admin)

---

## 🔒 Security Best Practices
- **No GenAI or external LLM dependencies.**
- **No API keys committed or required.**
- **Strict Role-Based Access Control enforced on every private route.**
- **Centralized error handling with structured HTTP status codes.**
