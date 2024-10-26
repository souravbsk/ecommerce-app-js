import { Schema, model } from "mongoose";

// Define the Wishlist Schema
const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to the user who owns the wishlist
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true, // Reference to the product added to the wishlist
        },
        variant: {
          type: Schema.Types.ObjectId,
          ref: "ProductVariant",
          required: false, // Optional reference to a specific variant of the product
        },
        addedAt: {
          type: Date,
          default: Date.now, // Tracks when the product was added to the wishlist
        },
        notes: {
          type: String,
          trim: true, // Optional notes for the user to remember why they added the product
          maxlength: 500,
        },
        metadata: {
          type: Map,
          of: String, // For additional data like tags or custom attributes
        },
      },
    ],
    shared: {
      type: Boolean,
      default: false, // Indicates if the user has shared their wishlist with others
    },
    visibility: {
      type: String,
      enum: ["Private", "Public"],
      default: "Private", // Controls the visibility of the wishlist
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

const Wishlist = model("Wishlist", wishlistSchema);
export default Wishlist;

// {
//     "_id": "64d92e9a3dbb4c002b945b6b",
//     "user": "64b92e9a3dbb4c002b945b1d",
//     "items": [
//       {
//         "product": "64b92e9a3dbb4c002b945b2e",
//         "variant": "64b92e9a3dbb4c002b945b4e",
//         "addedAt": "2024-10-20T10:30:00.000Z",
//         "notes": "Perfect color for the living room",
//         "metadata": {
//           "tag": "Living Room",
//           "priority": "High"
//         }
//       },
//       {
//         "product": "64b92e9a3dbb4c002b945b3e",
//         "addedAt": "2024-10-21T12:00:00.000Z",
//         "notes": "Gift for mom's birthday",
//         "metadata": {
//           "priority": "Medium"
//         }
//       }
//     ],
//     "shared": true,
//     "visibility": "Public",
//     "createdAt": "2024-10-15T10:30:00.000Z",
//     "updatedAt": "2024-10-21T12:30:00.000Z"
//   }
