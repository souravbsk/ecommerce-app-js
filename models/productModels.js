import { Schema, model } from "mongoose";

// Define the Product Schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "ParentCategory",
      required: [true, "Parent category is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Subcategory is required"],
    },
    brand: {
      type: String,
      trim: true,
    },
    prices: [
      {
        basePrice: {
          type: Number,
          required: [true, "Base price is required"],
          min: [0, "Base price must be positive"],
        },
        salePrice: {
          type: Number,
          validate: {
            validator: function (v) {
              return v <= this.basePrice;
            },
            message:
              "Sale price should be lower than or equal to the base price.",
          },
        },
        currency: {
          type: String,
          default: "USD",
        },
      },
    ],
    discount: {
      amount: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
      validTill: Date,
    },
    stock: {
      quantity: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
      },
      status: {
        type: String,
        enum: ["In-Stock", "Out-of-Stock", "Low-Stock"],
        default: "In-Stock",
      },
    },
    images: [
      {
        url: {
          type: String,
          required: [true, "Image URL is required"],
        },
        altText: { type: String, trim: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    variations: [
      {
        color: {
          type: String,
          trim: true,
        },
        size: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
          min: [0, "Price must be positive"],
        },
        stock: {
          type: Number,
          min: [0, "Stock cannot be negative"],
        },
        imageUrl: {
          type: String,
        },
      },
    ],
    dimensions: {
      weight: {
        type: Number,
        min: [0, "Weight must be positive"],
      },
      length: {
        type: Number,
        min: [0, "Length must be positive"],
      },
      width: {
        type: Number,
        min: [0, "Width must be positive"],
      },
      height: {
        type: Number,
        min: [0, "Height must be positive"],
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: [0, "Rating must be positive"],
        max: [5, "Rating cannot exceed 5"],
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
          },
          comment: {
            type: String,
            trim: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    shippingDetails: {
      weight: {
        type: Number,
        required: true,
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      freeShipping: {
        type: Boolean,
        default: false,
      },
      shippingClass: {
        type: String,
        enum: ["Standard", "Express", "Next-Day"],
        default: "Standard",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Create the Product model
const Product = model("Product", productSchema);

export default Product;

// {
//     "_id": "64b92e9a3dbb4c002b945b1f",
//     "name": "Wireless Noise-Cancelling Headphones",
//     "description": "High-quality over-ear headphones with active noise-cancellation and up to 30 hours of battery life.",
//     "sku": "WH-1000XM5",
//     "category": "64b92e9a3dbb4c002b945b2d",
//     "brand": "Sony",
//     "price": 299.99,
//     "discount": {
//       "amount": 20,
//       "percentage": 10,
//       "validTill": "2024-12-31T23:59:59.999Z"
//     },
//     "stock": 150,
//     "images": [
//       {
//         "url": "https://example.com/images/headphone-front.jpg",
//         "altText": "Front view of Wireless Noise-Cancelling Headphones"
//       },
//       {
//         "url": "https://example.com/images/headphone-side.jpg",
//         "altText": "Side view of Wireless Noise-Cancelling Headphones"
//       }
//     ],
//     "variations": [
//       {
//         "color": "Black",
//         "size": "Standard",
//         "price": 299.99,
//         "stock": 100
//       },
//       {
//         "color": "Silver",
//         "size": "Standard",
//         "price": 309.99,
//         "stock": 50
//       }
//     ],
//     "dimensions": {
//       "weight": 0.8,
//       "length": 18.5,
//       "width": 15.5,
//       "height": 7.8
//     },
//     "tags": ["headphones", "wireless", "noise-cancelling", "audio", "Sony"],
//     "ratings": {
//       "averageRating": 4.7,
//       "totalReviews": 124,
//       "reviews": [
//         {
//           "user": "64b92e9a3dbb4c002b945b3c",
//           "rating": 5,
//           "comment": "Incredible sound quality and comfort. Highly recommend!",
//           "createdAt": "2024-10-15T12:34:56.789Z"
//         },
//         {
//           "user": "64b92e9a3dbb4c002b945b4d",
//           "rating": 4,
//           "comment": "Great noise cancellation, but the price is a bit high.",
//           "createdAt": "2024-10-16T15:20:10.123Z"
//         }
//       ]
//     },
//     "inventoryStatus": "In Stock",
//     "status": "Active",
//     "shippingDetails": {
//       "weight": 0.8,
//       "dimensions": {
//         "length": 18.5,
//         "width": 15.5,
//         "height": 7.8
//       },
//       "freeShipping": true,
//       "shippingClass": "Standard"
//     },
//     "createdBy": "64b92e9a3dbb4c002b945b5e",
//     "createdAt": "2024-10-01T10:30:00.000Z",
//     "updatedAt": "2024-10-15T11:00:00.000Z",
//     "metadata": {
//       "warranty": "2 years",
//       "originCountry": "Japan",
//       "batteryLife": "30 hours"
//     }
//   }
