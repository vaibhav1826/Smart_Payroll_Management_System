# 🏭 Shiv Enterprises — Smart Payroll & Workforce Management System

A full-stack, role-based payroll and workforce management platform built for **Shiv Enterprises**, a premier manpower supplier and contractor specialising in skilled workforce supply, compliance management, and on-site supervision across industrial and construction sectors.

---

## 🌐 Live Features

| Module | Description |
|---|---|
| **Public Website** | Home, About, Contact pages with company information and contact form |
| **Role-Based Dashboards** | Separate dashboards for Admin, Manager, Supervisor, and Employee roles |
| **Employee Management** | Full CRUD with profile photos, Aadhaar, PAN, bank details, and document uploads |
| **Department Management** | Create and manage company departments |
| **Attendance System** | Daily attendance marking, bulk entry, and shift management |
| **Leave Management** | Employee leave applications with approval workflow |
| **Payroll & Salary** | Salary generation, salary structure setup, and payslip downloads |
| **Audit Logs** | Track all admin actions across the platform |
| **Email Notifications** | Automatic email alerts on contact form submissions (via Nodemailer) |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with lazy-loaded pages |
| **React Router DOM v7** | Client-side routing |
| **Recharts** | Dashboard charts (bar, pie) |
| **jsPDF + AutoTable** | PDF salary slip generation |
| **XLSX** | Excel export for payroll data |
| **Three.js** | 3D animated hero section |
| **React Hot Toast** | Toast notifications |
| **Vite** | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database and ODM |
| **JWT (jsonwebtoken)** | Stateless authentication via HTTP-only cookies |
| **bcrypt** | Password hashing |
| **Multer** | File upload handling (employee photos, documents) |
| **Nodemailer** | Email notifications for contact form |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
Shiv_Enterprises/
├── Backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Default admin user seeder
│   ├── services/
│   │   ├── auth/              # JWT auth (login, register, me)
│   │   ├── core/              # Employees, Departments, Supervisors
│   │   └── operations/        # Attendance, Leaves, Payroll, Shifts
│   ├── shared/
│   │   ├── middleware/        # authMiddleware, auditLogger, uploadMiddleware
│   │   ├── utils/             # Response helpers
│   │   └── rbac.js            # Role-Based Access Control definitions
│   ├── uploads/employees/     # Uploaded profile photos & documents
│   ├── index.js               # Main Express server entry point
│   ├── resetDatabase.js       # 🗑️ Utility: clears all DB collections
│   └── .env                   # Environment variables (not committed)
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx            # Router with all protected/public routes
│   │   ├── layouts/           # PublicLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/        # Home, About, Contact, Login, Register
│   │   │   ├── dashboard/     # Admin, Manager, Supervisor, Employee dashboards
│   │   │   ├── employee/      # EmployeeList, DepartmentList
│   │   │   ├── attendance/    # AttendanceMark, AttendanceBulk, ShiftManagement
│   │   │   ├── payroll/       # PayrollGenerate, PayrollHistory, SalarySlip, SalaryStructure
│   │   │   └── audit/         # AuditLogs
│   │   ├── components/        # Shared UI: Sidebar, DataTable, StatCard, Modal, etc.
│   │   ├── context/           # AuthContext (user session)
│   │   ├── hooks/             # useFetch (data fetching)
│   │   ├── utils/             # api.js, formatters.js, exportUtils.js
│   │   └── styles/            # Modular CSS files
│   └── vite.config.js         # Vite config with API + uploads proxy
```

---

## 👥 Role-Based Access

| Role | Access Level |
|---|---|
| **Admin** | Full access — all modules, all employee data, audit logs, payroll |
| **Manager** | Employees, departments, attendance, payroll history |
| **Supervisor** | Attendance marking for their team, leave approval |
| **Employee** | Own dashboard — personal attendance, leave applications, salary slips |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (running locally on port `27017`) or a MongoDB Atlas URI

---

### 1. Clone the Repository

```powershell
git clone https://github.com/vaibhav1826/Smart_Payroll_Management_System.git
cd Smart_Payroll_Management_System
```

### 2. Backend Setup

```powershell
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/shiv_enterprises
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Email (for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_TO=your_email@gmail.com
```

Start the backend:

```powershell
npm run dev        # Development (with nodemon)
npm start          # Production
```

> The backend starts on **http://localhost:4000**
> On first start, it **automatically creates the default admin account** from `config/seed.js`.

---

### 3. Frontend Setup

```powershell
cd ../Frontend
npm install
npm run dev
```

> The frontend starts on **http://localhost:3000**

---

## 🔑 Default Admin Login

| Field | Value |
|---|---|
| **Email** | `vaibhavbhatt145@gmail.com` |
| **Password** | `Vai@1234` |
| **Role** | Admin |

> ⚠️ Change the default password after the first login. Update `Backend/config/seed.js` to change the seeded credentials.

---

## 🌐 API Routes Overview

All API routes are prefixed with `/api`.

### Auth
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login and set JWT cookie |
| `POST` | `/api/auth/logout` | Clear session |
| `GET` | `/api/auth/me` | Get current logged-in user |

### Employees
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/employees` | List all employees |
| `POST` | `/api/employees` | Create employee (with photo upload) |
| `PUT` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Delete employee |

### Attendance
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/attendance` | List records (filterable by month/year) |
| `POST` | `/api/attendance` | Mark single attendance |
| `POST` | `/api/attendance/bulk` | Bulk mark attendance |
| `DELETE` | `/api/attendance/:id` | Delete record |

### Payroll
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/payroll` | List payroll records |
| `POST` | `/api/payroll/generate` | Generate payroll for a month |
| `GET` | `/api/payroll/history` | Payroll history |

### Leaves
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/leaves` | List leave applications |
| `POST` | `/api/leaves` | Apply for leave |
| `PUT` | `/api/leaves/:id/approve` | Approve/Reject leave |

### Other
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/contact` | Contact form — sends email notification |
| `GET` | `/api/departments` | List departments |
| `GET` | `/api/shifts` | List shifts |
| `GET` | `/api/audit-logs` | Admin-only audit trail |

---

## � File Uploads

Employee photos and Aadhaar card images are stored locally in:

```
Backend/uploads/employees/
```

Files are accessed via `/uploads/employees/<filename>` which is proxied through Vite in development.

---

## 🗑️ Reset Database

To wipe all data and start fresh:

```powershell
cd Backend
node resetDatabase.js
```

Then restart the backend server — the default admin will be re-seeded automatically.

---

## 📧 Contact Form Email Setup

1. Go to your Google Account → **Security** → **2-Step Verification** → **App Passwords**
2. Generate an App Password for "Mail"
3. Add it to your `.env`:
   ```env
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```

---

## 📄 License

This project is proprietary software developed for **Shiv Enterprises**.
All rights reserved © 2025 Shiv Enterprises.
