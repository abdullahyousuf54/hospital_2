const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [1, "Book title cannot be empty"],
      maxlength: [150, "Book title cannot exceed 150 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    totalCopies: {
      type: Number,
      required: [true, "Total copies count is required"],
      min: [1, "At least one copy is required"],
    },
    availableCopies: {
      type: Number,
      required: [true, "Available copies count is required"],
      min: [0, "Available copies cannot be negative"],
    },
    publishedYear: {
      type: Number,
      min: [1000, "Published year must be valid"],
      max: [3000, "Published year must be valid"],
    },
    location: {
      type: String,
      trim: true,
      default: "General Shelf",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.index({ title: "text", author: "text", isbn: 1 });

module.exports = mongoose.model("Book", bookSchema);
