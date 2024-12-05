const express = require("express");
const {
  createParentCategory,
  updateParentCategory,
  getParentCategory,
  getAllParentCategories,
  getAllParentCategoriesByPagination,
  deleteParentCategoryById,
} = require("../../controllers/v1/parentCategory.controllers.js");

const parentCategoryRouter = express.Router();

// create parent category
parentCategoryRouter.post("/create", createParentCategory);

// update parent category by id
parentCategoryRouter.put("/:id", updateParentCategory);

parentCategoryRouter.get("/all", getAllParentCategories);

//get specific  parent category by id
parentCategoryRouter.get("/:id", getParentCategory);

// get parent category by pagination
parentCategoryRouter.get("/", getAllParentCategoriesByPagination);

// delete parent category by id
parentCategoryRouter.delete("/:id", deleteParentCategoryById);

module.exports = { parentCategoryRouter };
