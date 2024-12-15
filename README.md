# Expense Tracker Application

## Overview
The Expense Tracker Application helps users manage their personal finances by tracking income, expenses, and budgets. It provides detailed insights into spending patterns and helps users make informed financial decisions.

---

## Features

- **Expense Management**:
  - Add, edit, and delete income and expense entries.
  - Categorize transactions (e.g., food, rent, entertainment).
- **Budget Tracking**:
  - Set monthly or category-specific budgets.
  - Monitor budget usage with visual graphs.
- **Analytics and Insights**:
  - View spending trends with charts and reports.
- **User Roles**:
  - User: Manage personal financial data.
- **Responsive Design**:
  - Optimized for desktop, tablet, and mobile devices.

---

## Technology Stack

- **Frontend**:
  - Framework: React.js
  - Styling: Material UI

- **Backend**:
  - Framework: Node.js with Express.js
  - Database: MongoDB

- **Other Tools**:
  - Authentication: JSON Web Tokens (JWT)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pawarchandrakant29/Expense-Management.git
   cd Expense-Management
   ```

2. Install dependencies for the backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Include the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Run the application:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend development server:
     ```bash
     cd frontend
     npm start
     ```

5. Open the app in your browser at `http://localhost:3000`.

---

