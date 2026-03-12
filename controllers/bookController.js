const Book = require("../models/Book");
const Category = require("../models/Category");

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, totalCopies, availableCopies, publishedYear, location } = req.body;

    if (!title || !author || !isbn || !category || totalCopies === undefined) {
      return sendResponse(res, 400, false, "Required fields: title, author, isbn, category, totalCopies");
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return sendResponse(res, 404, false, "Selected category does not exist");

    const safeAvailable = availableCopies === undefined ? totalCopies : availableCopies;
    if (safeAvailable > totalCopies) {
      return sendResponse(res, 400, false, "Available copies cannot exceed total copies");
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: safeAvailable,
      publishedYear,
      location,
    });

    return sendResponse(res, 201, true, "Book added successfully", book);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid category ID format");
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const { category, availableOnly } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (availableOnly === "true") filter.availableCopies = { $gt: 0 };

    const books = await Book.find(filter).populate("category", "name").sort({ createdAt: -1 });
    return sendResponse(res, 200, true, `${books.length} book(s) found`, { count: books.length, books });
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid category ID format");
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate("category", "name");
    if (!book) return sendResponse(res, 404, false, "Book not found");

    return sendResponse(res, 200, true, "Book retrieved successfully", book);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid book ID format");
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) return sendResponse(res, 404, false, "Selected category does not exist");
    }

    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) return sendResponse(res, 404, false, "Book not found");

    const nextTotal = req.body.totalCopies ?? existingBook.totalCopies;
    const nextAvailable = req.body.availableCopies ?? existingBook.availableCopies;

    if (nextAvailable > nextTotal) {
      return sendResponse(res, 400, false, "Available copies cannot exceed total copies");
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("category", "name");

    return sendResponse(res, 200, true, "Book updated successfully", book);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid ID format");
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return sendResponse(res, 404, false, "Book not found");

    return sendResponse(res, 200, true, `Book '${book.title}' deleted successfully`);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid book ID format");
    next(error);
  }
};

const searchBooks = async (req, res, next) => {
  try {
    const { q, title, author, isbn } = req.query;
    const orFilter = [];

    if (q) {
      orFilter.push({ title: { $regex: q, $options: "i" } });
      orFilter.push({ author: { $regex: q, $options: "i" } });
      orFilter.push({ isbn: { $regex: q, $options: "i" } });
    }
    if (title) orFilter.push({ title: { $regex: title, $options: "i" } });
    if (author) orFilter.push({ author: { $regex: author, $options: "i" } });
    if (isbn) orFilter.push({ isbn: { $regex: isbn, $options: "i" } });

    if (orFilter.length === 0) {
      return sendResponse(res, 400, false, "Please provide a search query (?q, ?title, ?author, or ?isbn)");
    }

    const books = await Book.find({ $or: orFilter }).populate("category", "name").sort({ createdAt: -1 });

    if (!books.length) return sendResponse(res, 404, false, "No books found matching your search criteria");

    return sendResponse(res, 200, true, `${books.length} book(s) found`, { count: books.length, books });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook, searchBooks };
