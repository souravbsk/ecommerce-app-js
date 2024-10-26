import { Schema, model } from "mongoose";

// Define the Coupon Schema
const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discount: {
      type: {
        amount: {
          type: Number,
          min: 0,
        },
        percentage: {
          type: Number,
          min: 0,
          max: 100,
        },
        maximumDiscount: {
          type: Number,
          min: 0,
          default: null, // Cap for the maximum discount amount when using percentage
        },
      },
      required: true,
    },
    validFrom: {
      type: Date,
      required: [true, "Valid from date is required"],
    },
    validTill: {
      type: Date,
      required: [true, "Valid till date is required"],
    },
    usageLimit: {
      type: Number,
      default: null, // Maximum number of times this coupon can be used overall
    },
    usagePerUser: {
      type: Number,
      default: null, // Maximum number of times a user can use this coupon
    },
    minPurchaseAmount: {
      type: Number,
      default: 0, // Minimum order value to apply the coupon
    },
    applicableCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    applicableProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    eligibleUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    excludedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Expired"],
      default: "Active",
    },
    isStackable: {
      type: Boolean,
      default: false, // Whether this coupon can be combined with other coupons
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true, // Tracks which admin created this coupon
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
      of: String, // For any additional data that may be needed in the future
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;

// coupon data example

// {
//     "_id": "64c92e9a3dbb4c002b945b6a",
//     "code": "SAVE20",
//     "description": "Get 20% off on all electronics over $100",
//     "discount": {
//       "amount": 0,
//       "percentage": 20,
//       "maximumDiscount": 50
//     },
//     "validFrom": "2024-10-01T00:00:00.000Z",
//     "validTill": "2024-12-31T23:59:59.999Z",
//     "usageLimit": 1000,
//     "usagePerUser": 2,
//     "minPurchaseAmount": 100,
//     "applicableCategories": ["64b92e9a3dbb4c002b945b1d"],
//     "applicableProducts": [],
//     "eligibleUsers": ["64b92e9a3dbb4c002b945b7c"],
//     "excludedUsers": ["64b92e9a3dbb4c002b945b8d"],
//     "status": "Active",
//     "isStackable": false,
//     "createdBy": "64b92e9a3dbb4c002b945b5e",
//     "createdAt": "2024-10-01T10:30:00.000Z",
//     "updatedAt": "2024-10-10T12:00:00.000Z",
//     "metadata": {
//       "promotionID": "Q4HOLIDAY2024",
//       "campaign": "Black Friday"
//     }
//   }
