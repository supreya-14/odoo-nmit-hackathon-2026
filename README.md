# odoo-nmit-hackathon-2026
# 🚀 Dayflow – Smart Employee Performance & Task Management System

> **A smart HR platform for managing employees, tracking tasks, monitoring attendance, and analyzing workforce performance.**

## 📌 Overview

**Dayflow** is a web-based Human Resource Management System designed to simplify employee management and help HR teams monitor workforce activities through a centralized dashboard.

The system combines **employee management, attendance tracking, task management, leave management, and performance analytics** into a single platform.

The project extends the core Dayflow HRMS requirements with a **Smart Employee Performance & Task Management module** that helps HR identify task progress, overdue work, employee performance, and team-level productivity patterns.

---

## 🎯 Problem Statement

Organizations often manage employee information, attendance, tasks, and leave through separate systems or manual processes. This makes it difficult for HR managers to track employee workload, monitor task progress, identify delayed work, and understand overall workforce performance.

**Dayflow solves this problem by providing a centralized platform where employees can manage their tasks and attendance while HR can monitor employee activities and performance through an interactive dashboard.**

---

## 💡 Proposed Solution

Dayflow provides two role-based experiences:

### 👨‍💻 Employee

Employees can:

* Login securely
* View their dashboard
* View assigned tasks
* Update task status
* Track deadlines
* Check-in / check-out
* View attendance
* Apply for leave
* View their performance score

### 👩‍💼 HR / Admin

HR can:

* Manage employees
* Assign tasks
* Monitor task progress
* Track overdue tasks
* View attendance
* Manage leave requests
* Monitor employee performance
* View team analytics
* Identify employees requiring attention

---

# ⭐ Key Features

## 🔐 1. Authentication & Role-Based Access

The system provides separate access for:

* Employee
* HR
* Admin

Each role receives appropriate permissions and dashboard access.

---

## 👨‍💼 2. Employee Management

HR can manage employee information including:

* Personal information
* Job information
* Department
* Employee ID
* Contact information
* Profile details

Employees have controlled access to their own information.

---

## ⏰ 3. Attendance Management

Employees can:

* Check-in
* Check-out
* View attendance history
* View attendance status

Attendance statuses include:

* Present
* Absent
* Half-day
* Leave

HR can monitor attendance records across employees.

---

## 📋 4. Smart Task Management

HR/Admin can create and assign tasks.

Each task contains:

* Task title
* Description
* Assigned employee
* Priority
* Deadline
* Status

### Task Status

```text
To Do
  ↓
In Progress
  ↓
Completed
```

The system also identifies overdue tasks.

---

## 📊 5. Employee Performance Score

Dayflow calculates a simple performance indicator based on workforce activity.

Example:

```text
Performance Score

Task Completion      40%
On-Time Completion   30%
Attendance           30%
                     ─────
Overall Score        100%
```

The score helps HR quickly understand employee performance trends.

> **Note:** The performance scoring module is a project extension built on top of the core HRMS requirements.

---

## 🏖️ 6. Leave Management

Employees can:

* Select leave type
* Select date range
* Add a reason
* Submit leave request
* Track request status

HR can:

* View leave requests
* Approve requests
* Reject requests
* Add comments

### Leave Status

```text
Pending
Approved
Rejected
```

---

## 📈 7. HR Analytics Dashboard

The HR dashboard provides visual insights such as:

* Total employees
* Present employees
* Employees on leave
* Pending leave requests
* Task completion rate
* Overdue tasks
* Department performance
* Employee performance

Example:

```text
Employee Performance

Employee        Score
---------------------
Employee A       92%
Employee B       86%
Employee C       74%
Employee D       61%
```

---

## 🚨 8. Smart Alerts

The system can highlight:

* Overdue tasks
* Low attendance
* Pending leave requests
* Tasks approaching deadlines
* Employees requiring attention

Example:

```text
⚠️ 3 tasks are overdue

⚠️ 5 employees have attendance below the target

🔔 4 leave requests are waiting for approval
```

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     DAYFLOW         │
                    │   Web Application   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ Employee Dashboard │
                    │ HR Dashboard        │
                    │ Task Management     │
                    │ Attendance          │
                    │ Leave Management    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │    MongoDB      │          │ Analytics Logic │
       │                 │          │                 │
       │ Users           │          │ Performance     │
       │ Tasks           │          │ Attendance      │
       │ Attendance      │          │ Task Progress   │
       │ Leave           │          │ Team Analytics  │
       └─────────────────┘          └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* HTML5
* CSS3
* JavaScript
* Bootstrap / Tailwind CSS
* React Icons
* Chart.js / Recharts

## Backend

* Node.js
* Express.js
* REST API

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* Role-Based Access Control

## Development Tools

* Git
* GitHub
* VS Code
* Postman

---

# 📂 Project Structure

```text
dayflow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# 🗄️ Database Design

## User

```text
User
├── employeeId
├── name
├── email
├── password
├── role
├── department
└── profile
```

## Task

```text
Task
├── title
├── description
├── assignedTo
├── priority
├── deadline
├── status
└── createdAt
```

## Attendance

```text
Attendance
├── employeeId
├── date
├── checkIn
├── checkOut
├── workingHours
└── status
```

## Leave

```text
Leave
├── employeeId
├── leaveType
├── startDate
├── endDate
├── reason
├── status
└── hrComment
```

## Performance

```text
Performance
├── employeeId
├── taskScore
├── attendanceScore
├── onTimeScore
└── overallScore
```

---

# 🔄 Application Workflow

```text
                    LOGIN
                      │
          ┌───────────┴───────────┐
          │                       │
      EMPLOYEE                   HR
          │                       │
          ▼                       ▼
     Dashboard              HR Dashboard
          │                       │
    ┌─────┼─────┐          ┌──────┼──────┐
    ▼     ▼     ▼          ▼      ▼      ▼
Attendance Task Leave    Employees Tasks Analytics
    │       │     │          │      │      │
    │       │     └──────────┘      │      │
    │       │                       │      │
    └───────┴───────────────────────┴──────┘
                    │
                    ▼
             Performance Analysis
                    │
                    ▼
              HR Insights
```

---

# 🎯 Objectives

The main objectives of Dayflow are:

1. Digitize employee management.
2. Simplify attendance tracking.
3. Streamline leave management.
4. Centralize task assignment and tracking.
5. Monitor employee performance.
6. Provide HR with useful workforce analytics.
7. Reduce manual HR operations.
8. Improve visibility into employee activities.
9. Provide role-based access to sensitive HR information.
10. Help HR identify tasks and workforce areas requiring attention.

---

# 🌟 What Makes Dayflow Different?

Traditional HR systems mainly **store employee information**.

Dayflow focuses on turning employee activity into useful information:

```text
Employee Data
     ↓
Attendance
     ↓
Tasks
     ↓
Leave
     ↓
Performance Calculation
     ↓
Analytics
     ↓
HR Insights
```

### From Data → to Decisions

Dayflow helps HR move from simply managing employee records to understanding workforce activity and performance.

---

# 🔮 Future Enhancements

Possible future improvements include:

* AI-powered HR assistant
* AI-based workforce insights
* Predictive attendance analytics
* Intelligent task recommendations
* Automated email notifications
* Advanced payroll processing
* Mobile application
* Real-time notifications
* Employee feedback analysis
* Advanced performance prediction

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dayflow.git
cd dayflow
```

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 3. Start Frontend

```bash
npm run dev
```

## 4. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

## 5. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Never upload real API keys, passwords, database credentials, or secrets to GitHub.**

## 6. Start Backend

```bash
npm run dev
```

---

# 🧪 Testing

The application can be tested using:

* Browser
* Postman
* REST API testing
* Role-based login testing
* Attendance workflow testing
* Leave approval testing
* Task management testing
* Performance calculation testing

---

# 📊 Expected Outcome

After implementation, Dayflow provides a centralized HR platform where:

```text
Employees
    ↓
Manage Attendance
Manage Tasks
Apply Leave
View Performance
    ↓
HR
    ↓
Manage Employees
Assign Tasks
Approve Leave
Monitor Attendance
Analyze Performance
    ↓
Better Workforce Visibility
```

---

# 🏆 Hackathon Focus

### Core Innovation

**Smart Employee Performance & Task Management**

### Core Value

> **“Dayflow transforms employee activity into actionable workforce performance insights.”**

---

# 👥 User Roles

| Role     | Main Capabilities                                        |
| -------- | -------------------------------------------------------- |
| Employee | Profile, Attendance, Tasks, Leave, Performance           |
| HR       | Employee Management, Tasks, Attendance, Leave, Analytics |
| Admin    | Full System Management                                   |

---

# 📜 License

This project is developed for educational and hackathon purposes.

---

# 👨‍💻 Team

**Dayflow Team**

> Built with ❤️ for a smarter and more efficient workplace.
