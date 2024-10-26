const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productVariant: {
    type: Schema.Types.ObjectId,
    ref: "ProductVariant",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
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
  isApproved: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  notHelpfulCount: {
    type: Number,
    default: 0,
  },
  images: [
    {
      url: { type: String, trim: true },
      description: { type: String, trim: true },
    },
  ],
  responses: [
    {
      admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
      response: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

//   {
//     "_id": "6492b4f5d1b6e21c4b7a56c1",
//     "user": "6492b4f5d1b6e21c4b7a56b0",  // User ID referencing the User collection
//     "productVariant": "6492b4f5d1b6e21c4b7a56c0",  // Product Variant ID referencing the ProductVariant collection
//     "rating": 5,
//     "comment": "This product exceeded my expectations! The quality is top-notch, and it fits perfectly.",
//     "createdAt": "2024-10-20T15:30:00.000Z",
//     "updatedAt": "2024-10-20T15:30:00.000Z",
//     "isApproved": true,
//     "helpfulCount": 10,
//     "notHelpfulCount": 2,
//     "images": [
//       {
//         "url": "https://example.com/images/review1.jpg",
//         "description": "Image of the product in use."
//       },
//       {
//         "url": "https://example.com/images/review1-closeup.jpg",
//         "description": "Close-up of the product details."
//       }
//     ],
//     "responses": [
//       {
//         "admin": "6492b4f5d1b6e21c4b7a56a0",  // Admin ID referencing the Admin collection
//         "response": "Thank you for your wonderful feedback! We're glad to hear you loved the product.",
//         "createdAt": "2024-10-21T10:00:00.000Z"
//       }
//     ]
//   }
