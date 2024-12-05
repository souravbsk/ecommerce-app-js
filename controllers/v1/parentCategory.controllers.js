const Category = require("../../models/categoryModels");
const ParentCategory = require("../../models/parentCategoryModels");
const generateSlug = require("../../utils/slugGenerator");

//create parent category
const createParentCategory = async (req, res, next) => {
  try {
    const { name, description, status, image } = req.body;

    // Generate slug before creating the category
    const slug = await generateSlug(ParentCategory, name);

    const newCategory = new ParentCategory({
      name,
      slug, // Set the generated slug here
      description,
      status,
      image,
    });

    await newCategory.save();
    // Emit an event after category creation

    return res.status(201).json({
      success: true,
      message: "Parent Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating Parent Category:", error); // Debug log
    next(error); // Pass the error to the next middleware
  }
};

// get a specific parent category id

const getParentCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.error("id not found");
    }

    const parentCategoryResult = await ParentCategory.findById(id)
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .populate("Category", "name description", null, {
        strictPopulate: false,
      });

    return res.status(201).json({
      success: true,
      message: " Parent Category Get successfully",
      data: parentCategoryResult,
    });
  } catch (error) {
    console.error("Error creating Parent Category:", error); // Debug log
    next(error);
  }
};

//update parent category by id
const updateParentCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, image } = req.body;

    // Find and update the category document in one go
    const category = await ParentCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Parent Category not found",
      });
    }

    // Update only if `name` has changed, then generate a new slug
    if (name && name !== category.name) {
      category.slug = await generateSlug(ParentCategory, name);
      category.name = name;
    }

    // Update only if fields have changed
    if (description && description !== category.description)
      category.description = description;
    if (status && status !== category.status) category.status = status;
    if (image && image !== category.image) category.image = image;

    // Save changes if any were made
    if (category.isModified()) await category.save();

    return res.status(200).json({
      success: true,
      message: "Parent Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating Parent Category:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// get all parent categories

const getAllParentCategoriesByPagination = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate total count
    const totalCategories = await ParentCategory.countDocuments();

    // Fetch paginated results
    const parentCategories = await ParentCategory.find()
      .select("-createdAt -updatedAt")
      .skip((pageNumber - 1) * limitNumber) // Calculate the skip value
      .limit(limitNumber); // Limit the number of results

    return res.status(200).json({
      success: true,
      message: "Parent categories retrieved successfully.",
      data: parentCategories,
      total: totalCategories,
      page: pageNumber,
      totalPages: Math.ceil(totalCategories / limitNumber), // Calculate total pages
    });
  } catch (error) {
    console.error("Error fetching parent categories:", error);
    next(error);
  }
};

const getAllParentCategories = async (req, res, next) => {
  try {
    const parentCategories = await ParentCategory.find();

    if (parentCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No parent categories found.",
      });
    }

    console.log(parentCategories);
    return res.status(200).json({
      success: true,
      message: "Parent categories retrieved successfully.",
      data: parentCategories,
    });
  } catch (error) {
    console.error("Error fetching parent categories:", error); // Debug log
    next(error); // Pass the error to the next middleware
  }
};

// delete parent category by id

const deleteParentCategoryById = async (req, res, next) => {
  try {
    const parentId = req.params.id;
    console.log(parentId);

    const parentCategory = await ParentCategory.findByIdAndDelete(parentId);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parent category deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting parent category:", error);
    next(error);
  }
};

module.exports = {
  createParentCategory,
  updateParentCategory,
  getParentCategory,
  getAllParentCategories,
  getAllParentCategoriesByPagination,
  deleteParentCategoryById,
};
