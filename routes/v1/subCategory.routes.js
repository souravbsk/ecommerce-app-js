const express = require("express");
const {
  createSubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  getAllSubCategoriesByPagination,
  getAllSubCategories,
  getSubCategoriesByCategoryId,
} = require("../../controllers/v1/subcategory.controllers");

const subCategoryRouter = express.Router();

// create parent category
subCategoryRouter.post("/create", createSubCategory);

// update sub category by id
subCategoryRouter.put("/:id", updateSubCategoryById);

// get all sub categories
subCategoryRouter.get("/all", getAllSubCategories);

// //get specific  sub category by id
subCategoryRouter.get("/:id", getSubCategoryById);

// get all sub categories with pagination

subCategoryRouter.get("/", getAllSubCategoriesByPagination);

subCategoryRouter.get("/by-category/:categoryId", getSubCategoriesByCategoryId);

module.exports = { subCategoryRouter };
