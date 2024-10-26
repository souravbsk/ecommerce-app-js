const discountSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0, // Ensure value is non-negative
  },
  appliesTo: {
    type: String,
    enum: ["product", "category", "order"],
    required: true,
  },
  applicableProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product collection if applicable
    },
  ],
  applicableCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category collection if applicable
    },
  ],
  minOrderAmount: {
    type: Number,
    min: 0,
  },
  maxUses: {
    type: Number,
    min: 1, // Ensure at least one use
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  validFrom: {
    type: Date,
  },
  validTill: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//   {
//     "_id": "6492b7f8d1b6e21c4b7a56f1",
//     "code": "FREESHIP20",
//     "description": "Free shipping on orders over $50.",
//     "discountType": "free_shipping",
//     "value": 0,
//     "appliesTo": "order",
//     "minOrderAmount": 50.00,
//     "maxUses": 100,
//     "usedCount": 35,
//     "validFrom": "2024-10-01T00:00:00.000Z",
//     "validTill": "2024-12-31T23:59:59.000Z",
//     "isActive": true,
//     "createdAt": "2024-10-01T10:00:00.000Z",
//     "updatedAt": "2024-10-01T10:00:00.000Z"
//   }
