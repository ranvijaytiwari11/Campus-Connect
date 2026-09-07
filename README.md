# 🎓 CampusConnect

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21.2-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

> **A full-stack MERN college management system for managing students, teachers, courses, attendance, assignments, and academic results.**

---

## 📌 Overview

**CampusConnect** is an enterprise-ready College Management System built using the pure MERN stack (MongoDB, Express.js, React, Node.js). It digitizes and centralizes core administrative, academic, and grading workflows within higher education institutions.

Academic institutions often face fragmented communication across departments, manual paper-based roll calls, unorganized assignment collection, and delayed exam result distribution. CampusConnect resolves these challenges by providing tailored, role-specific portals for three primary stakeholders:
- **Administrators**: Centralized control over user provisioning, curriculum management, and institutional health metrics.
- **Faculty / Teachers**: Real-time daily attendance recording, course homework distribution, submission grading, and exam mark entry.
- **Students**: Unified view of class attendance compliance, pending assignment deadlines, digital deliverables, and cumulative GPA grade cards.

> **Architecture & Security Note**: This application is built strictly as a pure full-stack software system. It does **not** rely on Generative AI, third-party LLMs, or unnecessary external APIs. All authentication, authorization, data relationships, and business logic are natively implemented using Node.js, Express, MongoDB/Mongoose, React, and JWT.

---

## 🌟 Key Features

### 👨‍💼 Admin Features
- **Administrative Hub**: Live institutional analytics showing total student enrollment, active faculty, course offerings, and administrator counts.
- **User Provisioning (CRUD)**: Complete management to create, inspect, filter by role/department, update profiles, and delete student, faculty, or administrator accounts.
- **Curriculum & Course Allocation**: Create academic courses with unique course codes, assign credit hours, map semesters, and allocate faculty instructors.

### 👨‍🏫 Teacher Features
- **Faculty Dashboard**: Class schedule overview, enrolled courses, and active assignment tracking.
- **Daily Attendance Register**: Bulk roll call sheet per course and lecture date with status toggles (`Present`, `Late`, `Absent`).
- **Assignment Management**: Publish problem sets with descriptions, deadlines, and maximum score caps.
- **Deliverable Evaluation & Grading**: Review student-submitted links/deliverables, assign numerical marks, and provide qualitative feedback.
- **Examination Portal**: Enter official exam marks (Midterm, Final, Quiz, Practical) with automated letter grade calculation (`A+` to `F`).

### 🎓 Student Features
- **Academic Dashboard**: High-level KPI cards displaying overall attendance rate, pending deadlines, cumulative letter grade, and academic standing.
- **Attendance Analytics**: Subject-wise and date-wise attendance records with visual status indicators.
- **Assignment Submission**: Access problem sets, review deadlines, and submit deliverables (repository links, document URLs, or text solutions) with automatic late-submission detection.
- **Grade Sheet & GPA Card**: Official transcripts displaying marks scored, course credit units, letter grades, and instructor remarks.

### 🔐 Authentication & Security
- **Stateless JWT Authentication**: Signed JSON Web Tokens with 30-day expiration for secure sessions.
- **Salted Password Hashing**: Passwords hashed using `bcryptjs` with 10 salt rounds before database persistence.
- **Role-Based Access Control (RBAC)**: Backend enforcement verifying user privileges at the API gateway layer.
- **Client Route Guards**: Protected client-side navigation restricting views based on verified roles.
- **Centralized Error Handling**: Express error middleware returning standardized error schemas and HTTP status codes.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend UI** | React 18, Vite | Component-driven Single Page Application |
| **Client Routing** | React Router DOM v6 | Client-side routing and role-based route protection |
| **HTTP Client** | Axios | REST API communication with Bearer token interceptor |
| **Icons & Styling** | Lucide React, Custom CSS | Modern, responsive interface design system |
| **Backend Framework**| Node.js, Express.js | Modular, asynchronous RESTful API server |
| **Database** | MongoDB | Document database for structured institutional data |
| **ODM** | Mongoose v8 | Schema validation, compound indexing, and population |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`)| Stateless token-based user authentication |
| **Password Security** | `bcryptjs` | Salted cryptographic password hashing |
| **Version Control** | Git, GitHub | Distributed version control and milestone history |

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + Vite Client │
                    │   (SPA Frontend)    │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                     (Bearer JWT in Header)
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Express.js Server  │
                    │   (Node.js REST)    │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
          authMiddleware              Controllers
          & roleMiddleware                  │
          (JWT & RBAC Guards)               ▼
                                     Mongoose Models
                                            │
                                            ▼
                                     MongoDB Database
```

---

## 🔄 Application Workflow

### 1. Main Request & Data Flow
```text
User Interaction (Browser)
      ↓
React Component (State & UI)
      ↓
Centralized Axios Service Layer
      ↓
HTTP REST Request with Bearer Token
      ↓
Express.js Route Matcher
      ↓
Authentication & RBAC Middleware Pipeline
      ↓
Controller Business Logic
      ↓
Mongoose ODM Queries & Indexes
      ↓
MongoDB Database
      ↓
JSON Response
      ↓
React State Reconciliation & UI Re-render
```

### 2. Authentication & Authorization Flow
- **Registration**: Client sends user details ➔ Controller checks email uniqueness ➔ Password hashed via `bcryptjs` ➔ User created in MongoDB ➔ JWT issued with payload claims (`id`, `role`).
- **Login**: Client submits credentials ➔ Controller finds user by email ➔ `bcrypt.compare()` validates password ➔ Signed JWT returned ➔ Frontend stores token in `localStorage` and `AuthContext`.
- **Protected API Calls**: Axios automatically injects `Authorization: Bearer <token>` ➔ `authMiddleware` verifies signature and loads `req.user` ➔ `roleMiddleware` confirms user role permission ➔ Controller processes request.

---

## 👥 Role-Based Access Control (RBAC)

| Feature / Action | Admin | Teacher | Student |
|---|:---:|:---:|:---:|
| User Management (Create / Update / Delete) | ✅ | ❌ | ❌ |
| Course Management & Faculty Assignment | ✅ | ❌ | ❌ |
| View Institutional Metrics & User Counts | ✅ | ❌ | ❌ |
| Take Daily Class Roll Call (Attendance) | ❌ | ✅ | ❌ |
| View Class Attendance Sheet | ✅ | ✅ | ❌ |
| View Own Attendance Records & Compliance | ❌ | ❌ | ✅ |
| Create & Publish Course Assignments | ❌ | ✅ | ❌ |
| Submit Assignment Deliverables | ❌ | ❌ | ✅ |
| Evaluate & Grade Student Submissions | ❌ | ✅ | ❌ |
| Enter & Publish Examination Grades | ❌ | ✅ | ❌ |
| View Grade Transcripts & GPA Card | ❌ | ❌ | ✅ |

> **Authentication vs. Authorization:**
> - **Authentication** verifies **identity** (*"Who are you?"*).
> - **Authorization** verifies **permissions** (*"What actions are you permitted to execute?"*).

---

## 📁 Project Structure

```text
CampusConnect/
│
├── client/                               # Frontend: React + Vite Single Page Application
│   ├── public/
│   │   └── favicon.svg                   # Brand icon
│   ├── src/
│   │   ├── components/                   # Navbar, Sidebar, StatCard, Modal, Alert, ProtectedRoute
│   │   ├── context/                      # AuthContext global authentication state
│   │   ├── pages/
│   │   │   ├── admin/                    # AdminDashboard, ManageUsers, ManageCourses
│   │   │   ├── student/                  # StudentDashboard, ViewAttendance, StudentAssignments, ViewResults
│   │   │   ├── teacher/                  # TeacherDashboard, MarkAttendance, TeacherAssignments, EnterResults
│   │   │   ├── LoginPage.jsx             # Login screen with demo account shortcuts
│   │   │   ├── RegisterPage.jsx          # Registration form
│   │   │   └── UnauthorizedPage.jsx      # 403 Forbidden feedback page
│   │   ├── services/                     # api.js, authService, userService, courseService, etc.
│   │   ├── App.jsx                       # Client-side routing configuration
│   │   ├── index.css                     # Global CSS tokens and component layouts
│   │   └── main.jsx                      # React DOM mount entry
│   ├── index.html                        # HTML5 shell
│   ├── package.json                      # Frontend dependencies
│   └── vite.config.js                    # Vite dev proxy configuration
│
├── server/                               # Backend: Node.js + Express REST API
│   ├── config/
│   │   └── db.js                         # Mongoose connection initialization
│   ├── controllers/                      # authController, userController, courseController, etc.
│   ├── middleware/                       # authMiddleware, roleMiddleware, errorMiddleware
│   ├── models/                           # User, Course, Attendance, Assignment, Submission, Result
│   ├── routes/                           # authRoutes, userRoutes, courseRoutes, etc.
│   ├── utils/                            # generateToken.js, seedData.js
│   ├── .env.example                      # Environment template with placeholder values
│   ├── index.js                          # Express server entry point
│   └── package.json                      # Backend dependencies
│
├── .gitignore                            # Root Git ignore rules
└── README.md                             # Project documentation
```

---

## 🗄️ Database Design & Mongoose Models

The database consists of **6 normalized Mongoose models**:

1. **`User`** (`server/models/User.js`):
   - Stores account credentials (`name`, `email`, `password`, `role`, `department`, `rollNumber`, `phone`).
   - Passwords hashed with `bcryptjs` pre-save hook; excluded by default (`select: false`).
2. **`Course`** (`server/models/Course.js`):
   - Academic courses (`code`, `title`, `department`, `semester`, `credits`, `description`, `teacher`).
   - Unique uppercase index on `code`. References assigned faculty in `User`.
3. **`Attendance`** (`server/models/Attendance.js`):
   - Class attendance records (`course`, `student`, `teacher`, `date`, `status`, `remarks`).
   - **Compound Unique Index**: `{ course: 1, student: 1, date: 1 }` preventing duplicate daily roll calls.
4. **`Assignment`** (`server/models/Assignment.js`):
   - Problem sets (`title`, `description`, `course`, `teacher`, `dueDate`, `maxMarks`).
5. **`Submission`** (`server/models/Submission.js`):
   - Student deliverables (`assignment`, `student`, `content`, `submittedAt`, `marksObtained`, `feedback`, `status`).
   - **Compound Unique Index**: `{ assignment: 1, student: 1 }` enforcing one submission per student per assignment.
6. **`Result`** (`server/models/Result.js`):
   - Official examination records (`student`, `course`, `teacher`, `examType`, `marks`, `totalMarks`, `grade`, `remarks`).
   - **Compound Unique Index**: `{ student: 1, course: 1, examType: 1 }` ensuring accurate grade ledger records.

---

## 📡 REST API Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|:---:|:---:|---|
| `POST` | `/api/auth/register` | No | Public / Admin | Register a new user account |
| `POST` | `/api/auth/login` | No | Public | Authenticate user and issue JWT |
| `GET` | `/api/auth/me` | Yes | Any | Retrieve authenticated profile session |

### 👥 Users (`/api/users`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|:---:|:---:|---|
| `GET` | `/api/users` | Yes | `admin` | List all users (with role/department filtering) |
| `GET` | `/api/users/stats/overview` | Yes | `admin` | Aggregate institutional user counts |
| `GET` | `/api/users/:id` | Yes | `admin` | Retrieve individual user record |
| `PUT` | `/api/users/:id` | Yes | `admin` | Update user profile and role |
| `DELETE` | `/api/users/:id` | Yes | `admin` | Remove user account from system |

### 📚 Courses (`/api/courses`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|:---:|:---:|---|
| `GET` | `/api/courses` | Yes | Any | List all offered academic courses |
| `GET` | `/api/courses/:id` | Yes | Any | Retrieve single course curriculum details |
| `POST` | `/api/courses` | Yes | `admin` | Create new course and assign instructor |
| `PUT` | `/api/courses/:id` | Yes | `admin` | Update course metadata and credits |
| `DELETE` | `/api/courses/:id` | Yes | `admin` | Delete course offering |

### 📅 Attendance (`/api/attendance`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|:---:|:---:|---|
| `POST` | `/api/attendance` | Yes | `teacher` | Bulk mark or synchronize class attendance |
| `GET` | `/api/attendance/course/:courseId`| Yes | `teacher`, `admin` | Retrieve course attendance sheet |
| `GET` | `/api/attendance/my-attendance` | Yes | `student` | Retrieve student's attendance records & % |

### 📝 Assignments & Submissions (`/api/assignments`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|:---:|:---:|---|
| `GET` | `/api/assignments` | Yes | Any | List active assignments |
| `POST` | `/api/assignments` | Yes | `teacher` | Publish new course assignment |
| `POST` | `/api/assignments/:id/submit` | Yes | `student` | Submit assignment work/link |
| `GET` | `/api/assignments/:id/submissions`| Yes | `teacher`, `admin` | View all submissions for an assignment |
| `PUT` | `/api/assignments/submissions/:id/grade`| Yes | `teacher` | Evaluate and grade student submission |

### 🏆 Results & Grades (`/api/results`)
| Method | Endpoint | Auth | Role | Purpose |
|---|---|:---:|:---:|---|
| `POST` | `/api/results` | Yes | `teacher`, `admin` | Publish official exam grade & marks |
| `GET` | `/api/results/my-results` | Yes | `student` | View personal grade card and GPA summary |
| `GET` | `/api/results/course/:courseId` | Yes | `teacher`, `admin` | View course-wide examination grade sheet |

---

## ⚙️ Environment Variables

Sensitive secrets and configuration variables are managed via environment variables.

### `server/.env.example`
```env
# Server Configuration
PORT=8001
NODE_ENV=development

# Database Connection
MONGO_URI=your_mongodb_connection_string

# Authentication Secret
JWT_SECRET=your_jwt_secret
```

> **Security Note**: Real `.env` files are excluded by `.gitignore` and must never be committed to source control.

---

## 🚀 Installation & Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/ranvijaytiwari11/Campus-Connect.git
cd Campus-Connect
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env` based on `server/.env.example`:
```bash
cp .env.example .env
```

Seed initial demo data (users, courses, attendance, assignments, and results):
```bash
npm run seed
```

Start backend development server:
```bash
npm run dev
# Backend running at http://localhost:8001
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
# Frontend running at http://localhost:5173
```

---

## 🔑 Demo Login Credentials

All seeded demo accounts share the password: `password123`

| Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Admin** | `admin@campusconnect.com` | `password123` | Institutional dashboard, user management, course allocation |
| **Teacher** | `sarah.smith@campusconnect.com` | `password123` | Roll call register, assignment publishing, grading, exam marks |
| **Student** | `alex.johnson@campusconnect.com` | `password123` | Attendance %, assignment submission, GPA transcript |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
