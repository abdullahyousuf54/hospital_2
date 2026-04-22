// ============================================================
// routes/patientRoutes.js — API Route Definitions
// ============================================================
// Routes act like a "traffic controller" — they listen for
// incoming HTTP requests and direct them to the right
// controller function to handle them.
//
// Think of it like this:
//   Client sends request → Route catches it → Controller handles it
// ============================================================

const express = require("express");
const router = express.Router();

// Import all controller functions
const {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
} = require("../controllers/patientController");

// ── ROUTE DEFINITIONS ─────────────────────────────────────
// IMPORTANT: /search must be defined BEFORE /:id
// because Express reads routes top-to-bottom, and if /:id
// comes first, it would treat "search" as a patient ID!

// Search patients by name or disease
// GET /api/patients/search?name=John
// GET /api/patients/search?disease=Diabetes
router.get("/search", searchPatients);

// Register a new patient
// POST /api/patients
router.post("/", registerPatient);

// Get all patients (with optional filters like ?status=Admitted)
// GET /api/patients
router.get("/", getAllPatients);

// Get, Update, Delete a specific patient by MongoDB ID
// GET    /api/patients/64abc123...
// PUT    /api/patients/64abc123...
// DELETE /api/patients/64abc123...
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;
