const mongoose = require("mongoose"); // Use require

// ParentCategory Schema
const parentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Parent category name is required"],
      trim: true,
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
parentCategorySchema.pre(["save", "findOneAndUpdate"], function (next) {
  this.updatedAt = Date.now();
  next();
});

const ParentCategory = mongoose.model("ParentCategory", parentCategorySchema);
module.exports = ParentCategory; // Use module.exports

// {
//     "_id": "64b92e9a3dbb4c002b945b1f",
//     "name": "Electronics",
//     "slug": "electronics",
//     "description": "Top-level category for all electronic devices.",
//     "status": "Active",
//     "image": {
//       "url": "https://example.com/images/electronics.jpg",
//       "altText": "Various electronic devices"
//     },
//     "createdAt": "2024-10-01T10:30:00.000Z",
//     "updatedAt": "2024-10-15T11:00:00.000Z"
//   }
