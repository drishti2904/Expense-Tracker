#  SpendWise – Personal Expense Tracker

## Project Title & Brief Description

SpendWise is a full-stack Personal Expense Tracker built using React and Node.js. The application allows users to record daily expenses, categorize spending, track monthly budgets, edit or delete transactions, and visualize spending patterns through a dashboard. I chose the **Expense Tracker** exercise because it demonstrates full-stack CRUD operations, state management, API integration, data persistence, filtering, budget tracking, and responsive UI design in a single project.

---

## Live Demo Links

### Frontend

https://expense-tracker-seven-kohl-40.vercel.app

### Backend API

https://spendwise-backend-jbxx.onrender.com



---

## Tech Stack

### Frontend

* React.js – Component-based UI development
* Vite – Fast development server and build tool
* Tailwind CSS – Utility-first styling framework
* JavaScript (ES6+) – Frontend logic and state management

### Backend

* Node.js – JavaScript runtime
* Express.js – REST API development
* CORS – Enables frontend-backend communication

### Storage

* JSON File Storage – Lightweight persistence without a database

### Why These Technologies?

* React provides reusable UI components and efficient rendering.
* Vite offers fast startup and hot module replacement.
* Tailwind enables rapid UI development with consistent styling.
* Express simplifies REST API creation.
* JSON storage keeps the project lightweight while demonstrating CRUD functionality.

---

## How to Run Locally

### Prerequisites

Install:

* Node.js (v18 or later)

---

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/spendwise.git
cd spendwise
```

---

### 2. Start Backend

```bash
cd backend
npm install
node server.js
```

Backend will start at:

```text
http://localhost:5000
```

---

### 3. Start Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at:

```text
http://localhost:5173
```

---

## API Documentation

### 1. Get All Expenses

**Method**

```http
GET /api/expenses
```

**Response**

```json
[
  {
    "id": "1749123456789",
    "amount": 1500,
    "category": "Food",
    "date": "2026-06-03",
    "note": "Ordered food"
  }
]
```

---

### 2. Create Expense

**Method**

```http
POST /api/expenses
```

**Request Body**

```json
{
  "amount": 1500,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Ordered food"
}
```

**Success Response**

```json
{
  "id": "1749123456789",
  "amount": 1500,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Ordered food"
}
```

---

### 3. Update Expense

**Method**

```http
PUT /api/expenses/:id
```

**Request Body**

```json
{
  "amount": 1800,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Updated expense"
}
```

**Success Response**

```json
{
  "id": "1749123456789",
  "amount": 1800,
  "category": "Food",
  "date": "2026-06-03",
  "note": "Updated expense"
}
```

---

### 4. Delete Expense

**Method**

```http
DELETE /api/expenses/:id
```

**Success Response**

```json
{
  "message": "Expense deleted successfully."
}
```

---

## Project Structure

```text
spendwise/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── ExpenseList.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── data/
│   │   └── expenses.json
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

### Folder Overview

| Folder                  | Purpose                       |
| ----------------------- | ----------------------------- |
| frontend/src/components | Reusable React UI components  |
| frontend/src            | Application entry and styling |
| backend                 | Express API server            |
| backend/data            | Persistent expense data       |
| README.md               | Project documentation         |

---

## Features Implemented

* Add Expense
* Edit Expense
* Delete Expense
* Category-based Budget Tracking
* Monthly Spending Summary
* Highest Expense Tracking
* Expense Breakdown by Category
* Transaction Filtering
* CSV Export
* Responsive Dark-Themed Dashboard

---

## Next Steps

The current version focuses on core expense management and budgeting functionality.

Future improvements include:

1. User Authentication (JWT)
2. MongoDB Database Integration
3. Cloud Data Storage
4. Recurring Expenses
5. Expense Search and Advanced Filters
6. Monthly and Yearly Reports
7. Interactive Charts using Chart.js
8. Budget Customization by User
9. Multi-user Support
10. Mobile App Version

---

## Author

**Drishti Porwal**

* GitHub: https://github.com/drishti2904
* LinkedIn: https://www.linkedin.com/in/drishti-porwal-272001255
