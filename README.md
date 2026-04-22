# 🏥 Hospital Patient Management System — Backend API

A production-ready REST API built with **Node.js**, **Express.js**, and **MongoDB** for managing hospital patient records.

---

## 📁 Project Structure

```
hospital-backend/
│
├── config/
│   └── db.js                  # MongoDB connection setup
│
├── controllers/
│   └── patientController.js   # Business logic for all patient operations
│
├── middleware/
│   └── errorMiddleware.js     # Global error handling middleware
│
├── models/
│   └── Patient.js             # Mongoose schema & model definition
│
├── routes/
│   └── patientRoutes.js       # API route definitions
│
├── .env                       # Environment variables (NEVER commit this!)
├── .gitignore                 # Files excluded from Git
├── package.json               # Project dependencies & scripts
├── server.js                  # App entry point
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start (Run Locally)

### Step 1: Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/hospital-backend.git
cd hospital-backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hospitalDB?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Step 4: Start the server
```bash
# Development mode (auto-restart on file changes)
npm run dev

# Production mode
npm start
```

Server will run at: `http://localhost:5000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/patients` | Register a new patient |
| `GET` | `/api/patients` | Get all patient records |
| `GET` | `/api/patients/:id` | Get a single patient by ID |
| `PUT` | `/api/patients/:id` | Update patient details |
| `DELETE` | `/api/patients/:id` | Delete a patient record |
| `GET` | `/api/patients/search?name=xyz` | Search by patient name |
| `GET` | `/api/patients/search?disease=xyz` | Search by disease |

---

## 📦 Request Body — Register Patient (POST)

```json
{
  "fullName": "John Doe",
  "email": "john.doe@email.com",
  "phoneNumber": "+1-555-0123",
  "age": 35,
  "gender": "Male",
  "disease": "Type 2 Diabetes",
  "doctorAssigned": "Dr. Sarah Johnson",
  "admissionDate": "2024-01-15",
  "roomNumber": "A-204",
  "patientType": "Inpatient",
  "status": "Admitted"
}
```

---

## ✅ HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| `200` | Success — request completed |
| `201` | Created — new resource created |
| `400` | Bad Request — invalid input |
| `404` | Not Found — resource doesn't exist |
| `500` | Server Error — something went wrong |

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Config**: dotenv

---

## 🌐 Deployment

This API is deployed on **Render**: [Your Render URL here]

---

## 👨‍💻 Author

Your Name — [GitHub](https://github.com/YOUR_USERNAME)
