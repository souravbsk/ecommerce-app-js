const SubCategory = require("../../models/subCategoryModels");
const generateSlug = require("../../utils/slugGenerator");

//create Sub category
const createSubCategory = async (req, res, next) => {
  try {
    const { name, description, status, image, categoryId } = req.body;

    // Generate slug before creating the category
    const slug = await generateSlug(SubCategory, name);

    console.log("first slug");
    const newSubCategory = new SubCategory({
      name,
      slug, // Set the generated slug here
      description,
      status,
      image,
      categoryId, // Set the  category here
    });

    await newSubCategory.save();

    return res.status(201).json({
      success: true,
      message: "Sub Category created successfully",
      data: newSubCategory,
    });
  } catch (error) {
    console.error("Error creating Category:", error); // Debug log
    next(error); // Pass the error to the next middleware
  }
};

// get a specific sub category id

const getSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.error("id not found");
    }

    const SubCategoryResult = await SubCategory.findById(id)
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .populate("Category", "name description", null, {
        strictPopulate: false,
      });

    return res.status(201).json({
      success: true,
      message: " Sub Category Get successfully",
      data: SubCategoryResult,
    });
  } catch (error) {
    console.error("Error creating Parent Category:", error); // Debug log
    next(error);
  }
};

//update  category by id
const updateSubCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, image, categoryId } = req.body;

    // Find and update the sub category document in one go
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    // Update only if `name` has changed, then generate a new slug
    if (name && name !== subCategory.name) {
      subCategory.slug = await generateSlug(SubCategory, name);
      subCategory.name = name;
    }

    // Update only if fields have changed
    if (description && description !== subCategory.description)
      subCategory.description = description;
    if (status && status !== subCategory.status) subCategory.status = status;
    if (image && image !== subCategory.image) subCategory.image = image;
    if (categoryId && categoryId !== subCategory.categoryId)
      subCategory.categoryId = categoryId;

    // Save changes if any were made
    if (subCategory.isModified()) await subCategory.save();

    return res.status(200).json({
      success: true,
      message: "Sub Category updated successfully",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error updating Category:", error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// get all Sub categories by pagination

const getAllSubCategoriesByPagination = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    // Convert to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate total count
    const totalSubCategories = await SubCategory.countDocuments();

    // Fetch paginated results
    const subCategories = await SubCategory.find()
      .select("-createdAt -updatedAt")
      .skip((pageNumber - 1) * limitNumber) // Calculate the skip value
      .limit(limitNumber); // Limit the number of results

    return res.status(200).json({
      success: true,
      message: " Sub Categories retrieved successfully.",
      data: subCategories,
      total: totalSubCategories,
      page: pageNumber,
      totalPages: Math.ceil(totalSubCategories / limitNumber), // Calculate total pages
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error);
  }
};

//get all sub categories without pagination
const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.find();

    if (subCategories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Sub categories found.",
      });
    }

    console.log(subCategories);
    return res.status(200).json({
      success: true,
      message: "subCategories retrieved successfully.",
      data: subCategories,
    });
  } catch (error) {
    console.error("Error fetching Sub categories:", error); // Debug log
    next(error); // Pass the error to the next middleware
  }
};

// Get categories by parentCategory ID
const getSubCategoriesByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: " category ID is required.",
      });
    }

    // Find all categories with the specified parentCategory ID
    const categories = await SubCategory.find({ categoryId: categoryId })
      .select("-createdAt -updatedAt") // Exclude createdAt and updatedAt fields
      .exec();

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found for the specified category.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sub Categories retrieved successfully by Category ID.",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories by Category ID:", error); // Debug log
    next(error); // Pass the error to the error-handling middleware
  }
};

module.exports = {
  createSubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  getAllSubCategoriesByPagination,
  getAllSubCategories,
  getSubCategoriesByCategoryId,
};
