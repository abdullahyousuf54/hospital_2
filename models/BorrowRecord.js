const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member is required"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["Issued", "Returned", "Overdue"],
        message: "Status must be Issued, Returned, or Overdue",
      },
      default: "Issued",
    },
    issuedBy: {
      type: String,
      required: [true, "Librarian name is required"],
      trim: true,
    },
    returnNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

borrowRecordSchema.index({ member: 1, book: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model("BorrowRecord", borrowRecordSchema);
