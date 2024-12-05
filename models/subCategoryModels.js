const mongoose = require("mongoose");

// SubCategory Schema

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
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
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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

// Update timestamp before saving or updating
subCategorySchema.pre(["save", "findOneAndUpdate"], function (next) {
  this.updatedAt = Date.now();
  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategory;

// {
//     "_id": "64b92e9a3dbb4c002b945b3e",
//     "name": "Gaming Laptops",
//     "slug": "gaming-laptops",
//     "description": "High-performance laptops designed for gaming.",
//     "parentCategory": "64b92e9a3dbb4c002b945b2d",
//     "status": "Active",
//     "image": {
//       "url": "https://example.com/images/gaming-laptops.jpg",
//       "altText": "Gaming laptops with RGB keyboards"
//     },
//     "createdAt": "2024-10-05T13:20:00.000Z",
//     "updatedAt": "2024-10-15T11:00:00.000Z"
//   }
