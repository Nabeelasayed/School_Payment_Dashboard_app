# 💲 School Payment and Dashboard Application

## 📖 Overview
The **School Payment and Dashboard Application** is a complete full-stack solution designed to help schools **manage digital payments, track transactions, and analyze financial data** in a structured and secure way.  

It provides:
- A **Backend REST API** for handling payment creation, transaction management, authentication, and webhook updates.  
- A **Frontend Dashboard** built with React.js for schools and trustees to view, search, and filter transactions in real-time.  

By integrating a **Payment Gateway** and **MongoDB Atlas**, the system ensures **scalable, secure, and real-time payment tracking**. Schools can easily generate payment requests, monitor statuses, and view detailed transaction reports — all from one place.

---

## ✨ Key Highlights
- 🔐 **Secure Authentication** with JWT-based login and route protection.  
- 💳 **Seamless Payment Gateway Integration** for creating and tracking transactions.  
- 🔄 **Webhook Support** to automatically update transaction status in the database.  
- 📊 **Interactive Dashboard** with search, sorting, pagination, and status filters.  
- 🏫 **School-wise Transaction Management** to track payments per institution.  
- 🌗 **Modern UI** with Tailwind CSS and optional dark mode.  
- ⚡ **Scalable Architecture** using Node.js, Express, React, and MongoDB Atlas. 
---
## ⚙️ Backend Setup
### 1. Clone the Repository
```bash
git clone https://github.com/Nabeelasayed/School_Payment_Dashboard_app.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a .env file inside the backend/ folder with the following:
```bash
MONGO_URI = mongodb+srv://nabeelasayed2627_db_user:Ggp4jD7XaMGIwvT6@cluster0.okyq0e0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT = 5000
JWT_SECRET = "nabz26"
PAYMENT_API_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0
PG_SECRET = edvtest01 
CALLBACK_URL = "https://school-finance-payment-and-dashboard.onrender.com/api/payment/callback"
SCHOOL_ID = 65b0e6293e9f76a9694d84b4


```

### 4. Run the Backend
```bash
npm run dev
```
---
## Backend API Usage & Endpoints
### 1. Create Payment
```bash
POST /api/payment/create-payment
```
-> Accepts payment details from user. <br>
-> Forwards to Payment API

### 2. Authentication
```bash
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```
-> Login: Allows existing users to log in using email/username and password.<br>
-> Register: Creates a new user account with the given details.<br>
-> Logout: Safely ends the user session and invalidates the JWT token.

### 3. Transactions
``` bash
GET /api/transactions?page=1&limit=5&sort=payment_time&order=desc
GET /transactions/school/:schoolId
GET /transaction-status/:custom_order_id
```
-> **Fetch All Transactions**: Retrieves a paginated list of all transactions with optional sorting and filters.<br>
-> **Fetch Transactions by School**:  Returns all transactions related to a specific school using its `schoolId`.<br>
-> **Check Transaction Status**:   Gets the current payment status of a transaction using the custom order ID.<br>

---

## 🖥️ Frontend Setup
### 1. Navigate to Frontend
```bash
cd ../frontend
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Environment Variables
Create a .env file inside the frontend/ folder with:
```bash
VITE_API_BASE=http://localhost:5000
```
### 4. Run the Frontend
```bash
npm run dev
```
---
## 📊 Frontend Features
Dashboard with paginated & searchable transactions

- Filters by status, school, and date <br>
- Sorting by amount, status, or time <br>
- Transaction Details Page for school-wise data <br>
- Transaction Status Check with custom_order_id <br>
- Form for creating payment <br>
- Dark Mode toggle (extra feature) <br>

---

## 🔒 Security

- JWT authentication for all protected routes.
- Input validation and sanitization.
- HTTPS recommended in production.
- CORS policies enabled.

---

## 📈 Scalability
- Pagination for transaction lists.
- Sorting and filtering with query parameters.
- Indexed fields in MongoDB (school_id, collect_id, custom_order_id).

---

## ☁️ Hosting
- Backend: Host on Render.
- Frontend: Deploy on Netlify.

---

## Screenshots:

### Authentication Page
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/ff041514-2b7e-4c05-a47b-85a3e40fba92" />

### Transaction Dashboard
<img width="1600" height="709" alt="image" src="https://github.com/user-attachments/assets/ea8fcf8e-e127-4e3e-ad33-0ca709e5a06c" />

### Create Payment
<img width="824" height="755" alt="image" src="https://github.com/user-attachments/assets/18967f57-2306-4a1e-bc8f-9712dcf8e2b9" />

### Dark and Light MOde
<img width="1600" height="709" alt="image" src="https://github.com/user-attachments/assets/2ce8895f-3296-4daa-b997-ed847c6bf2fa" />
<img width="1600" height="729" alt="image" src="https://github.com/user-attachments/assets/29f92800-0938-4a6c-bf5b-7bc4a2982205" />
---

## 📌 Submission
✅ GitHub Repository (this repo): https://github.com/Nabeelasayed/School_Payment_Dashboard_app.git <br>
✅ Hosted Backend Link: https://school-finance-payment-and-dashboard.onrender.com/ <br>
✅ Hosted Frontend Link: https://paymentdashboardapp.netlify.app/

---

##👨‍💻 Author
NABEELA SAYED 
Student, M.H. Saboo Siddik College of Engineering
