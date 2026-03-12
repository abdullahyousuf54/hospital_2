const Book = require("../models/Book");
const Member = require("../models/Member");
const BorrowRecord = require("../models/BorrowRecord");

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const issueBook = async (req, res, next) => {
  try {
    const { memberId, bookId, dueDate, issuedBy } = req.body;

    if (!memberId || !bookId || !dueDate || !issuedBy) {
      return sendResponse(res, 400, false, "Required fields: memberId, bookId, dueDate, issuedBy");
    }

    const member = await Member.findById(memberId);
    if (!member) return sendResponse(res, 404, false, "Member not found");
    if (member.status !== "Active") return sendResponse(res, 400, false, "Inactive members cannot issue books");

    const book = await Book.findById(bookId);
    if (!book) return sendResponse(res, 404, false, "Book not found");
    if (book.availableCopies <= 0) return sendResponse(res, 400, false, "No available copies for this book");

    const activeBorrow = await BorrowRecord.findOne({ member: memberId, book: bookId, status: "Issued" });
    if (activeBorrow) {
      return sendResponse(res, 400, false, "This member already has an active issue for this book");
    }

    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) return sendResponse(res, 400, false, "Invalid dueDate format");
    if (parsedDueDate <= new Date()) return sendResponse(res, 400, false, "Due date must be in the future");

    const borrowRecord = await BorrowRecord.create({
      member: memberId,
      book: bookId,
      dueDate: parsedDueDate,
      issuedBy,
    });

    book.availableCopies -= 1;
    await book.save();

    const populatedRecord = await BorrowRecord.findById(borrowRecord._id)
      .populate("member", "fullName membershipId")
      .populate("book", "title author isbn");

    return sendResponse(res, 201, true, "Book issued successfully", populatedRecord);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid memberId or bookId format");
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const { returnNotes } = req.body;

    const record = await BorrowRecord.findById(recordId);
    if (!record) return sendResponse(res, 404, false, "Borrow record not found");
    if (record.status === "Returned") return sendResponse(res, 400, false, "Book already returned for this record");

    record.status = "Returned";
    record.returnedAt = new Date();
    record.returnNotes = returnNotes || "";
    await record.save();

    await Book.findByIdAndUpdate(record.book, { $inc: { availableCopies: 1 } });

    const populatedRecord = await BorrowRecord.findById(record._id)
      .populate("member", "fullName membershipId")
      .populate("book", "title author isbn");

    return sendResponse(res, 200, true, "Book returned successfully", populatedRecord);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid borrow record ID format");
    next(error);
  }
};

const getBorrowRecords = async (req, res, next) => {
  try {
    const { status, memberId, overdue } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (memberId) filter.member = memberId;

    if (overdue === "true") {
      filter.status = "Issued";
      filter.dueDate = { $lt: new Date() };
    }

    const records = await BorrowRecord.find(filter)
      .populate("member", "fullName membershipId status")
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 });

    const normalized = records.map((record) => {
      if (record.status === "Issued" && record.dueDate < new Date()) {
        return { ...record.toObject(), status: "Overdue" };
      }
      return record;
    });

    return sendResponse(res, 200, true, `${normalized.length} borrow record(s) found`, {
      count: normalized.length,
      records: normalized,
    });
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid member ID format");
    next(error);
  }
};

module.exports = { issueBook, returnBook, getBorrowRecords };
