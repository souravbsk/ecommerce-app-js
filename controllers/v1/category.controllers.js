const Category = require("../../models/categoryModels.js");

const generateSlug = require("../../utils/slugGenerator");

//create  category
const createCategory = async (req, res, next) => {
  try {
    const { name, description, status, image, parentCategoryId } = req.body;

    // Generate slug before creating the category
    const slug = await generateSlug(Category, name);

    console.log("first slug");
    const newCategory = new Category({
      name,
      slug, // Set the generated slug here
      description,
      status,
      image,
      parentCategoryId, // Set the parent category here
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating Category:", error); // Debug log
    next(error); // Pass the error to the next middleware
  }
};

// get a specific category id

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.error("id not found");
    }

    const categoryResult = await Category.findById(id)
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .populate("Category", "name description", null, {
        strictPopulate: false,
      });

    return res.status(201).json({
      success: true,
      message: " Category Get successfully",
      data: categoryResult,
    });
  } catch (error) {
    console.error("Error creating Parent Category:", error); // Debug log
    next(error);
  }
};

//update  category by id
const updateCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, image, parentCategoryId } = req.body;

    // Find and update the category document in one go
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update only if `name` has changed, then generate a new slug
    if (name && name !== category.name) {
      category.slug = await generateSlug(Category, name);
      category.name = name;
    }

    // Update only if fields have changed
    if (description && description !== category.description)
      category.description = description;
    if (status && status !== category.status) category.status = status;
    if (image && image !== category.image) category.image = image;
    if (parentCategoryId && parentCategoryId !== category.parentCategoryId)
      category.parentCategoryId = parentCategoryId;

    // Save changes if any were made
    if (category.isModified()) await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating Category:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// get all categories by pagination

const getAllCategoriesByPagination = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate total count
    const totalCategories = await Category.countDocuments();

    // Fetch paginated results
    const categories = await Category.find()
      .select("-createdAt -updatedAt")
      .skip((pageNumber - 1) * limitNumber) // Calculate the skip value
      .limit(limitNumber); // Limit the number of results

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      data: categories,
      total: totalCategories,
      page: pageNumber,
      totalPages: Math.ceil(totalCategories / limitNumber), // Calculate total pages
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};

//get all categories without pagination
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No parent categories found.",
      });
    }

    console.log(categories);
    return res.status(200).json({
      success: true,
      message: "categories retrieved successfully.",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching parent categories:", error); // Debug log
    next(error); // Pass the error to the next middleware
  }
};

// Get categories by parentCategory ID
const getCategoriesByParentId = async (req, res, next) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({
        success: false,
        message: "Parent category ID is required.",
      });
    }

    // Find all categories with the specified parentCategory ID
    const categories = await Category.find({ parentCategoryId: parentId })
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .exec();

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found for the specified parent category.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully by parent ID.",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories by parent ID:", error); // Debug log
    next(error); // Pass the error to the error-handling middleware
  }
};

module.exports = {
  createCategory,
  getCategoryById,
  updateCategoryById,
  getAllCategoriesByPagination,
  getCategoriesByParentId,
  getAllCategories,
};
