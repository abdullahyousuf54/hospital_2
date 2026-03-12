const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Member full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
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
    membershipId: {
      type: String,
      required: [true, "Membership ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    membershipType: {
      type: String,
      enum: {
        values: ["Student", "Faculty", "General"],
        message: "Membership type must be Student, Faculty, or General",
      },
      default: "General",
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "Status must be Active or Inactive",
      },
      default: "Active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

memberSchema.index({ fullName: "text", email: 1, membershipId: 1 });

module.exports = mongoose.model("Member", memberSchema);
