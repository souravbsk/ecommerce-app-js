const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParentCategory",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    image: {
      url: {
        type: String,
        trim: true,
      },
      altText: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

// {
//     "_id": "64b92e9a3dbb4c002b945b2d",
//     "name": "Laptops",
//     "slug": "laptops",
//     "description": "Category for different types of laptops.",
//     "parentCategory": "64b92e9a3dbb4c002b945b1f",
//     "status": "Active",
//     "image": {
//       "url": "https://example.com/images/laptops.jpg",
//       "altText": "Collection of laptops"
//     },
//     "createdAt": "2024-10-02T11:30:00.000Z",
//     "updatedAt": "2024-10-15T11:00:00.000Z"
//   }
