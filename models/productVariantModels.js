import { Schema, model } from "mongoose";

// Define the ProductVariant Schema
const productVariantSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true, // Reference to the base product for this variant
    },
    sku: {
      type: String,
      required: true,
      unique: true, // Stock Keeping Unit for tracking inventory
      trim: true,
    },
    attributes: {
      color: {
        type: String,
        trim: true,
        required: false, // e.g., "Red", "Blue", etc.
      },
      size: {
        type: String,
        trim: true,  
        required: false, // e.g., "S", "M", "L", "XL"
      },
      material: {
        type: String,
        trim: true,
        required: false, // e.g., "Cotton", "Leather"
      },
      dimensions: {
        length: {
          type: Number,
          required: false, // Length in cm or inches
        },
        width: {
          type: Number,
          required: false, // Width in cm or inches
        },
        height: {
          type: Number,
          required: false, // Height in cm or inches
        },
        weight: {
          type: Number,
          required: false, // Weight in kg or lbs
        },
      },
      customAttributes: {
        type: Map,
        of: String, // For any other custom attribute that might be specific to the product variant
      },
    },
    stock: {
      type: {
        quantity: {
          type: Number,
          required: true,
          min: 0, // Quantity available for this variant
        },
        availability: {
          type: String,
          enum: ["In Stock", "Out of Stock", "Pre-order", "Discontinued"],
          default: "In Stock", // Stock status
        },
      },
      required: true,
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true, // Base price for this variant
      },
      salePrice: {
        type: Number, // Discounted price if there's an ongoing sale
        validate: {
          validator: function (v) {
            return v < this.basePrice;
          },
          message: "Sale price should be lower than the base price.",
        },
      },
      currency: {
        type: String,
        default: "USD", // Currency code, useful for international e-commerce
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true, // URL of the image
        },
        altText: {
          type: String,
          trim: true, // Alternative text for accessibility and SEO
        },
        isPrimary: {
          type: Boolean,
          default: false, // Indicates if this image is the main image for this variant
        },
      },
    ],
    barcode: {
      type: String,
      required: false, // Barcode for this specific variant (e.g., UPC, EAN)
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active", // Indicates if this variant is available for purchase
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ProductVariant = model("ProductVariant", productVariantSchema);
export default ProductVariant;

// {
//     "_id": "64f92e9a3dbb4c002b945b7c",
//     "product": "64b92e9a3dbb4c002b945b2e",
//     "sku": "PROD-1234-RED-S",
//     "attributes": {
//       "color": "Red",
//       "size": "S",
//       "material": "Cotton",
//       "dimensions": {
//         "length": 30,
//         "width": 20,
//         "height": 5,
//         "weight": 0.5
//       },
//       "customAttributes": {
//         "fit": "Regular",
//         "season": "Winter"
//       }
//     },
//     "stock": {
//       "quantity": 100,
//       "availability": "In Stock"
//     },
//     "pricing": {
//       "basePrice": 49.99,
//       "salePrice": 39.99,
//       "currency": "USD"
//     },
//     "images": [
//       {
//         "url": "https://example.com/images/product-red-s.jpg",
//         "altText": "Red cotton t-shirt in size S",
//         "isPrimary": true
//       },
//       {
//         "url": "https://example.com/images/product-red-s-side.jpg",
//         "altText": "Side view of red cotton t-shirt in size S",
//         "isPrimary": false
//       }
//     ],
//     "barcode": "123456789012",
//     "status": "Active",
//     "createdAt": "2024-10-15T10:30:00.000Z",
//     "updatedAt": "2024-10-22T15:00:00.000Z"
//   }
