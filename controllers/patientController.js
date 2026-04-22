// ============================================================
// controllers/patientController.js — Business Logic
// ============================================================
// Controllers contain the actual LOGIC of what happens when
// a route is hit. They:
//   1. Receive the request (req) from the route
//   2. Talk to the database via the Model
//   3. Send back a response (res) to the client
//
// We use async/await because database operations take time.
// ============================================================

const Patient = require("../models/Patient");

// ── HELPER: Standard API Response Format ─────────────────
// Keeps all responses consistent across the entire API
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

// ============================================================
// @desc    Register a new patient
// @route   POST /api/patients
// @access  Public
// ============================================================
const registerPatient = async (req, res, next) => {
  try {
    // req.body contains the JSON data sent by the client
    const {
      fullName, email, phoneNumber, age, gender,
      disease, doctorAssigned, admissionDate,
      roomNumber, patientType, status,
    } = req.body;

    // Check if required fields are present (extra layer of safety)
    if (!fullName || !email || !phoneNumber || !disease || !doctorAssigned || !patientType) {
      return sendResponse(res, 400, false, "Please provide all required fields: fullName, email, phoneNumber, disease, doctorAssigned, patientType");
    }

    // Check if a patient with the same email already exists
    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      return sendResponse(res, 400, false, `A patient with email '${email}' is already registered`);
    }

    // Create a new patient document and save it to MongoDB
    const patient = await Patient.create({
      fullName, email, phoneNumber, age, gender,
      disease, doctorAssigned, admissionDate,
      roomNumber, patientType, status,
    });

    return sendResponse(res, 201, true, "Patient registered successfully", patient);
  } catch (error) {
    // Pass error to global error handler middleware
    next(error);
  }
};

// ============================================================
// @desc    Get all patient records
// @route   GET /api/patients
// @access  Public
// ============================================================
const getAllPatients = async (req, res, next) => {
  try {
    // Support optional query params for filtering
    const { status, patientType, gender } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (patientType) filter.patientType = patientType;
    if (gender) filter.gender = gender;

    // .find() with empty {} returns ALL documents
    // .sort({ createdAt: -1 }) shows newest patients first
    const patients = await Patient.find(filter).sort({ createdAt: -1 });

    return sendResponse(
      res, 200, true,
      `${patients.length} patient(s) found`,
      { count: patients.length, patients }
    );
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Public
// ============================================================
const getPatientById = async (req, res, next) => {
  try {
    // req.params.id is the :id part from the URL
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return sendResponse(res, 404, false, `No patient found with ID: ${req.params.id}`);
    }

    return sendResponse(res, 200, true, "Patient retrieved successfully", patient);
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === "CastError") {
      return sendResponse(res, 400, false, `Invalid patient ID format: '${req.params.id}'`);
    }
    next(error);
  }
};

// ============================================================
// @desc    Update patient details
// @route   PUT /api/patients/:id
// @access  Public
// ============================================================
const updatePatient = async (req, res, next) => {
  try {
    // findByIdAndUpdate finds the document and updates it atomically
    // { new: true } returns the UPDATED document (not the old one)
    // { runValidators: true } runs schema validations on update too
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return sendResponse(res, 404, false, `No patient found with ID: ${req.params.id}`);
    }

    return sendResponse(res, 200, true, "Patient updated successfully", patient);
  } catch (error) {
    if (error.name === "CastError") {
      return sendResponse(res, 400, false, `Invalid patient ID format: '${req.params.id}'`);
    }
    next(error);
  }
};

// ============================================================
// @desc    Delete a patient record
// @route   DELETE /api/patients/:id
// @access  Public
// ============================================================
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return sendResponse(res, 404, false, `No patient found with ID: ${req.params.id}`);
    }

    return sendResponse(res, 200, true, `Patient '${patient.fullName}' deleted successfully`);
  } catch (error) {
    if (error.name === "CastError") {
      return sendResponse(res, 400, false, `Invalid patient ID format: '${req.params.id}'`);
    }
    next(error);
  }
};

// ============================================================
// @desc    Search patients by name OR disease
// @route   GET /api/patients/search?name=xyz
// @route   GET /api/patients/search?disease=xyz
// @access  Public
// ============================================================
const searchPatients = async (req, res, next) => {
  try {
    const { name, disease } = req.query;

    // Must provide at least one search parameter
    if (!name && !disease) {
      return sendResponse(res, 400, false, "Please provide a search query: ?name=xyz or ?disease=xyz");
    }

    let filter = {};

    if (name) {
      // RegExp with 'i' flag = case-insensitive search
      // e.g., searching "john" will also match "John", "JOHN"
      filter.fullName = { $regex: name, $options: "i" };
    }

    if (disease) {
      filter.disease = { $regex: disease, $options: "i" };
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });

    if (patients.length === 0) {
      return sendResponse(res, 404, false, "No patients found matching your search criteria");
    }

    return sendResponse(
      res, 200, true,
      `${patients.length} patient(s) found`,
      { count: patients.length, patients }
    );
  } catch (error) {
    next(error);
  }
};

// Export all controller functions so routes can use them
module.exports = {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
};
