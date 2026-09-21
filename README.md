# MCA 2026 Programming Quiz Application (MERN + Dark Terminal UI)

A full-stack MERN quiz application featuring a **26-question MCQ programming exam** covering **C, C++, Python, Java, OOP, and SQL** in a retro-modern dark terminal UI.

---

## ⚡ Key Highlights
- **Authentic Dark Terminal Aesthetic**: CRT scanline overlays, neon phosphor green/cyan accents, monospace typography (`JetBrains Mono`, `Fira Code`), retro terminal window frames (`● ● ●`), and command prompt interactions.
- **Anti-Cheat Scoring**: Question answer keys and explanations are omitted from the student client and scored exclusively on the server upon submission.
- **Dynamic 26-Slot Question Matrix**: Visual indicators for Answered (Green), Flagged (Amber), Unanswered (Muted), and Active (Cyan).
- **Domain Performance Breakdown**: Terminal progress bars and accuracy metrics across C, C++, Python, Java, OOP, and SQL.
- **8-Hour JWT Admin Portal**: Protected dashboard for managing question bank CRUD (Create, Read, Update, Delete) and auditing student attempt logs.
- **Pre-Seeded Question Bank**: Complete 26-question curated dataset ready out-of-the-box.

---

## 📁 Project Structure

```
d:\Keerthana folder\MCA 2026\manus\
├── backend\
│   ├── config\
│   │   └── db.js                 # MongoDB connection
│   ├── controllers\
│   │   ├── admin.controller.js   # JWT login, question CRUD, attempt logs
│   │   └── quiz.controller.js    # Sanitized questions, scoring engine
│   ├── middleware\
│   │   └── adminAuth.js          # 8-hour JWT token validation
│   ├── models\
│   │   ├── Admin.model.js        # Admin credentials & bcrypt hashing
│   │   ├── Attempt.model.js      # Student submission records & scores
│   │   └── Question.model.js     # 26-question schema
│   ├── routes\
│   │   ├── admin.routes.js       # Admin protected endpoints
│   │   └── quiz.routes.js        # Public student endpoints
│   ├── seed\
│   │   └── seedQuiz.js           # 26 questions + default admin seeder
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server bootstrap (:5000)
├── frontend\
│   ├── src\
│   │   ├── api\
│   │   │   └── client.js         # Axios instance with auth interceptor
│   │   ├── components\
│   │   │   ├── AttemptModal.jsx  # Admin attempt inspection modal
│   │   │   ├── QuestionCard.jsx  # Terminal prompt MCQ card with code styling
│   │   │   ├── QuestionMatrix.jsx# 1-26 status grid
│   │   │   ├── QuestionModal.jsx # Admin question editor modal
│   │   │   ├── TerminalHeader.jsx# Navigation and status bar
│   │   │   └── Timer.jsx         # 30-minute countdown HUD
│   │   ├── pages\
│   │   │   ├── AdminDashboardPage.jsx # Admin DB & logs management
│   │   │   ├── AdminLoginPage.jsx     # Terminal authentication
│   │   │   ├── QuizPage.jsx           # Live exam engine
│   │   │   ├── ResultPage.jsx         # Terminal report & solutions
│   │   │   └── TermsPage.jsx          # Instructions & candidate entry
│   │   ├── App.jsx               # Terminal view router
│   │   ├── index.css             # Terminal design system
│   │   ├── main.jsx              # React root mount
│   │   └── QuizContext.jsx       # State management
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite proxy configuration (:5173 -> :5000)
├── package.json                  # Root runner scripts
└── README.md                     # Documentation
```

---

## 🚀 How to Run on Windows (PowerShell)

### Step 1: Seed the Database (Once)
Open PowerShell in the project directory:
```powershell
npm run seed
```
*(Seeds 26 questions across all 6 domains and initializes the default admin account: `admin` / `admin123`)*

### Step 2: Start the Backend Server
In PowerShell Terminal #1:
```powershell
npm run backend
```
> Server runs on `http://localhost:5000` with MongoDB connected.

### Step 3: Start the Frontend Application
In PowerShell Terminal #2:
```powershell
npm run frontend
```
> Vite dev server runs on `http://localhost:5173`.

---

## 🔑 Default Administrator Credentials
- **Username:** `admin`
- **Password:** `admin123`
- **Session Duration:** 8 Hours (JWT token)

---

## 📡 API Endpoint Reference

### Student Routes (Public)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quiz/questions` | Get all 26 questions (omits `correctIndex` & `explanation`) |
| `POST` | `/api/quiz/submit` | Submit answers, calculate score, and record attempt |
| `GET` | `/api/health` | System health check |

### Admin Routes (Protected by `adminAuth.js`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/admin/login` | No | Login and obtain 8h JWT token |
| `GET` | `/api/admin/questions` | Yes | Get all questions including answers |
| `POST` | `/api/admin/questions` | Yes | Create new question |
| `PUT` | `/api/admin/questions/:id` | Yes | Update existing question |
| `DELETE` | `/api/admin/questions/:id` | Yes | Delete question |
| `GET` | `/api/admin/attempts` | Yes | List all student submissions |
| `GET` | `/api/admin/attempts/:id` | Yes | View full answers breakdown for an attempt |
| `DELETE` | `/api/admin/attempts/:id` | Yes | Delete attempt log |
