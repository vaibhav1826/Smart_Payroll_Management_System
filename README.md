# Shiv Enterprises — Smart Payroll Management System

An enterprise-grade payroll & workforce management system built with a **microservices backend** (Node.js/Express/MongoDB) and a **React frontend** with React Router v6.

---

## Project Structure

```
Shiv_Enterprises/
├── Backend/
│   ├── gateway/          → API Gateway      (port 4000) — proxies all /api/* requests
│   ├── services/
│   │   ├── auth/         → Auth Service     (port 4001) — login, register, JWT
│   │   ├── core/         → Core Service     (port 4002) — Industry, Contractor, Employee, Supervisor
│   │   ├── operations/   → Ops Service      (port 4003) — Attendance, Leave, Shift
│   │   ├── finance/      → Finance Service  (port 4004) — Payroll, Salary Structures
│   │   └── platform/     → Platform Service (port 4005) — Notifications, Audit Logs
│   └── shared/           → Middleware, DB, Validators
└── Frontend/             → React App (Vite, port 3000)
```

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Backend .env setup
Copy `Backend/.env.example` → `Backend/.env` and fill in:
```env
MONGO_URI=mongodb://localhost:27017/shiv_payroll
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
SESSION_COOKIE_MAX_AGE=604800000
NODE_ENV=development
```

### 3. Install backend dependencies
```powershell
cd Backend
npm install
```

### 4. Start all backend services
Open **6 separate terminals** and run:
```powershell
# Terminal 1 — Gateway
cd Backend/gateway && node index.js

# Terminal 2 — Auth
cd Backend/services/auth && node index.js

# Terminal 3 — Core
cd Backend/services/core && node index.js

# Terminal 4 — Operations
cd Backend/services/operations && node index.js

# Terminal 5 — Finance
cd Backend/services/finance && node index.js

# Terminal 6 — Platform
cd Backend/services/platform && node index.js
```

### 5. Start frontend
```powershell
cd Frontend
npm install
npm run dev   # → http://localhost:3000
```

---

## Roles & Access

| Role | Access |
|---|---|
| **admin** | Full access — all CRUD, payroll generate/lock, audit logs |
| **supervisor** | Attendance, leave approval, team dashboard |
| **employee** | Mark attendance, apply leave, view own salary slips |
| **contractor** | View contractor dashboard |

---

## Key Features

- 🔐 JWT authentication with HttpOnly cookies
- 👥 Employee, Contractor, Supervisor, Industry management
- 📋 Daily & Bulk attendance marking
- 🌿 Leave application → approval workflow
- 💰 Salary structure configuration (Basic/HRA/DA/PF percentages)
- ⚡ One-click payroll generation with locking
- 🧾 Salary slip viewer + PDF download
- 📊 Reports with CSV/Excel export
- 🔍 Audit log for all system Actions
- 🔔 Real-time notifications (polling)
- 📱 Responsive design (mobile, tablet, desktop)
- 🌙 Dark theme throughout

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** React 18, React Router v6, Recharts, react-hot-toast, jspdf, xlsx  
**Architecture:** Microservices via API Gateway with http-proxy-middleware
