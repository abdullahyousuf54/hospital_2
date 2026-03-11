// ============================================================
// models/Patient.js — Mongoose Schema & Model
// ============================================================
// A "Schema" is like a blueprint or template that defines:
//   - What fields a patient document will have
//   - What TYPE each field is (String, Number, etc.)
//   - What RULES/VALIDATIONS apply (required, unique, etc.)
//
// A "Model" is the actual class we use to create, read,
// update, and delete documents in MongoDB.
// ============================================================

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    // ── PERSONAL INFORMATION ──────────────────────────────
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true, // removes extra whitespace from both ends
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two patients can have the same email
      lowercase: true, // always store email in lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, "Please provide a valid phone number"],
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
    },

    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
      required: [true, "Gender is required"],
    },

    // ── MEDICAL INFORMATION ───────────────────────────────
    disease: {
      type: String,
      required: [true, "Disease/Diagnosis is required"],
      trim: true,
    },

    doctorAssigned: {
      type: String,
      required: [true, "Assigned doctor is required"],
      trim: true,
    },

    admissionDate: {
      type: Date,
      default: Date.now, // automatically sets to today if not provided
    },

    // ── ROOM & WARD ───────────────────────────────────────
    roomNumber: {
      type: String,
      trim: true,
      default: "TBD", // To Be Determined
    },

    // ── PATIENT CLASSIFICATION ────────────────────────────
    patientType: {
      type: String,
      enum: {
        values: ["Inpatient", "Outpatient"],
        message: "Patient type must be Inpatient or Outpatient",
      },
      required: [true, "Patient type is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["Admitted", "Discharged"],
        message: "Status must be Admitted or Discharged",
      },
      default: "Admitted", // new patients are "Admitted" by default
    },
  },
  {
    // ── SCHEMA OPTIONS ────────────────────────────────────
    timestamps: true, // automatically adds createdAt and updatedAt fields
    versionKey: false, // removes the __v field from documents
  }
);

// ── INDEX FOR FASTER SEARCH ───────────────────────────────
// Adding indexes makes searching by name and disease much faster
// especially when the database has thousands of records
patientSchema.index({ fullName: "text", disease: "text" });

// ── CREATE THE MODEL ──────────────────────────────────────
// "Patient" becomes the collection name as "patients" in MongoDB
const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
