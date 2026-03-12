const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [60, "Category name cannot exceed 60 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description cannot exceed 250 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

categorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", categorySchema);
