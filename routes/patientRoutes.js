const express = require("express");
const router = express.Router();

router.all("*", (req, res) => {
  return res.status(410).json({
    success: false,
    message: "This endpoint is retired. Use /api/members, /api/books, /api/categories, and /api/borrows.",
  });
});

module.exports = router;
