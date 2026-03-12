const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
} = require("../controllers/bookController");

router.get("/search", searchBooks);
router.post("/", createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
