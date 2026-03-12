const express = require("express");
const router = express.Router();
const {
  registerMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  searchMembers,
  getMemberBorrowHistory,
} = require("../controllers/memberController");

router.get("/search", searchMembers);
router.get("/:id/history", getMemberBorrowHistory);
router.post("/", registerMember);
router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

module.exports = router;
