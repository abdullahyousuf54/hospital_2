const Category = require("../models/Category");

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return sendResponse(res, 400, false, "Category name is required");

    const category = await Category.create({ name, description });
    return sendResponse(res, 201, true, "Category created successfully", category);
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return sendResponse(res, 200, true, `${categories.length} category(s) found`, {
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) return sendResponse(res, 404, false, "Category not found");
    return sendResponse(res, 200, true, "Category updated successfully", category);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid category ID format");
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return sendResponse(res, 404, false, "Category not found");

    return sendResponse(res, 200, true, `Category '${category.name}' deleted successfully`);
  } catch (error) {
    if (error.name === "CastError") return sendResponse(res, 400, false, "Invalid category ID format");
    next(error);
  }
};

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };
