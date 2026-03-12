const express = require("express");
const router = express.Router();
const {
  issueBook,
  returnBook,
  getBorrowRecords,
} = require("../controllers/borrowController");

router.post("/issue", issueBook);
router.put("/return/:recordId", returnBook);
router.get("/", getBorrowRecords);

module.exports = router;
