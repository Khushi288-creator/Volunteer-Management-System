# Volunteer Management System

A full-stack Volunteer Management Platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The platform allows volunteers to register, manage their profiles, and track their participation while providing administrators with tools to manage volunteers, view statistics, and monitor platform activity.

---

## Features

### Volunteer Features

* Volunteer Signup
* Volunteer Login
* Secure JWT Authentication
* Persistent Login Session
* Volunteer Dashboard
* Volunteer Profile Management
* Update Personal Information
* Logout Functionality
* Protected Volunteer Routes

### Registration System

* Join Us Registration Form
* Form Validation
* MongoDB Data Storage
* Real-Time Registration Tracking

### Admin Features

* Admin Login
* Protected Admin Dashboard
* Volunteer Search
* Volunteer Details View
* Delete Volunteer
* Dashboard Statistics
* JWT-Based Authorization

### Homepage Features

* Responsive Landing Page
* Real MongoDB Statistics
* Dynamic Volunteer Counts
* Features Section
* Testimonials Section
* Contact Section
* Mobile Responsive Design

---

## Tech Stack

### Frontend

* React 19
* Vite
* React Router DOM
* Axios
* React Icons
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

---

## Project Structure

```text
Volunteer-Management-System
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Volunteer-Management-System.git
cd Volunteer-Management-System
```

---

## Backend Setup

Navigate to server folder:

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm start
```

or

```bash
node server.js
```

---

## Frontend Setup

Navigate to client folder:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

---

## Authentication Flow

### Volunteer

1. Create Account
2. Login
3. Access Dashboard
4. Update Profile
5. Logout

### Admin

1. Login
2. Access Dashboard
3. Search Volunteers
4. View Statistics
5. Delete Volunteers

---

## Database

MongoDB Atlas is used for data storage.

Current collections:

* volunteers
* admins

Data is stored in real-time and reflected on the homepage statistics and dashboard panels.

---

## Current Completed Modules

### Authentication Module

* Volunteer Signup
* Volunteer Login
* Volunteer Logout
* Session Persistence
* Protected Routes

### Volunteer Module

* Dashboard
* Profile Management
* Registration Flow

### Admin Module

* Admin Login
* Dashboard
* Volunteer Search
* Volunteer Management

### Public Module

* Homepage
* Real Statistics API
* Responsive UI

---

## Future Enhancements

* Opportunity Management System
* Volunteer Applications
* CV Upload
* Opportunity Dashboard
* Story Sharing System
* Task Assignment
* Certificate Generation
* Email Notifications

---

## Screenshots

Add screenshots of:

* Homepage
* Volunteer Signup
* Volunteer Login
* Volunteer Dashboard
* Volunteer Profile
* Admin Login
* Admin Dashboard
* Volunteer Search

---

## Author

Khushi Trivedi

GitHub:
https://github.com/Khushi288-creator/Volunteer-Management-System

---

## License

This project is built for learning, academic, and portfolio purposes.

