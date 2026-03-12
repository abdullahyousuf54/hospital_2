const Member = require("../models/Member");
const BorrowRecord = require("../models/BorrowRecord");

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const registerMember = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, membershipId, membershipType, status } = req.body;
    if (!fullName || !email || !phoneNumber || !membershipId) {
      return sendResponse(res, 400, false, "Required fields: fullName, email, phoneNumber, membershipId");
    }

    const existingMember = await Member.findOne({
      $or: [{ email: email.toLowerCase() }, { membershipId: membershipId.toUpperCase() }],
    });

    if (existingMember) {
      return sendResponse(res, 400, false, "A member with this email or membership ID already exists");
    }

    const member = await Member.create({
      fullName,
      email,
      phoneNumber,
      membershipId,
      membershipType,
      status,
    });

    return sendResponse(res, 201, true, "Member registered successfully", member);
  } catch (error) {
    next(error);
  }
};

const getAllMembers = async (req, res, next) => {
  try {
    const { status, membershipType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (membershipType) filter.membershipType = membershipType;

    const members = await Member.find(filter).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, `${members.length} member(s) found`, { count: members.length, members });
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return sendResponse(res, 404, false, `No member found with ID: ${req.params.id}`);

    return sendResponse(res, 200, true, "Member retrieved successfully", member);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, `Invalid member ID format: '${req.params.id}'`);
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return sendResponse(res, 404, false, `No member found with ID: ${req.params.id}`);

    return sendResponse(res, 200, true, "Member updated successfully", member);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, `Invalid member ID format: '${req.params.id}'`);
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return sendResponse(res, 404, false, `No member found with ID: ${req.params.id}`);

    return sendResponse(res, 200, true, `Member '${member.fullName}' deleted successfully`);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, `Invalid member ID format: '${req.params.id}'`);
    next(error);
  }
};

const searchMembers = async (req, res, next) => {
  try {
    const { name, email, membershipId } = req.query;
    const filter = {};

    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (membershipId) filter.membershipId = { $regex: membershipId, $options: "i" };

    if (!name && !email && !membershipId) {
      return sendResponse(res, 400, false, "Provide ?name, ?email, or ?membershipId to search members");
    }

    const members = await Member.find(filter).sort({ createdAt: -1 });
    if (!members.length) return sendResponse(res, 404, false, "No members found matching your search criteria");

    return sendResponse(res, 200, true, `${members.length} member(s) found`, { count: members.length, members });
  } catch (error) {
    next(error);
  }
};

const getMemberBorrowHistory = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return sendResponse(res, 404, false, `No member found with ID: ${req.params.id}`);

    const history = await BorrowRecord.find({ member: req.params.id })
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, `${history.length} borrow record(s) found`, {
      member,
      count: history.length,
      records: history,
    });
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, `Invalid member ID format: '${req.params.id}'`);
    next(error);
  }
};

module.exports = {
  registerMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  searchMembers,
  getMemberBorrowHistory,
};
