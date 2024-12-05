const express = require("express");
const {
  createCategory,
  getCategoryById,
  updateCategoryById,
  getAllCategoriesByPagination,
  getAllCategories,
  getCategoriesByParentId,
} = require("../../controllers/v1/category.controllers.js");

const categoryRouter = express.Router();

// create  category
categoryRouter.post("/create", createCategory);

// update category by id
categoryRouter.put("/:id", updateCategoryById);

// get all categories
categoryRouter.get("/all", getAllCategories);

// get category by id
categoryRouter.get("/:id", getCategoryById);

// get all categories with pagination
categoryRouter.get("/", getAllCategoriesByPagination);

// get categories by parent id
categoryRouter.get("/by-parent/:parentId", getCategoriesByParentId);

module.exports = { categoryRouter };
