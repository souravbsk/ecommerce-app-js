const shippingMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0, // Ensure cost is non-negative
  },
  estimatedDeliveryTime: {
    type: String,
    required: true,
    enum: ["1-2 days", "3-5 days", "5-7 days", "1 week", "2 weeks", "custom"], // Options for estimated delivery times
  },
  regionsServed: [
    {
      type: String,
      required: true,
      enum: ["North America", "Europe", "Asia", "Australia", "Africa"],
    },
  ], // Regions where the shipping method is available
  carrier: {
    type: String,
    required: true,
  }, // Name of the shipping carrier (e.g., FedEx, UPS, DHL)
  trackingEnabled: {
    type: Boolean,
    default: false,
  }, // Whether tracking is available for this shipping method
  dimensions: {
    // Optional: shipping dimensions if applicable
    weight: {
      type: Number,
      min: 0,
    },
    length: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
      enum: ["cm", "inches"],
      default: "cm",
    },
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
//     "_id": "6492b6f7d1b6e21c4b7a56e1",
//     "name": "Express Shipping",
//     "description": "Get your order delivered within 1-2 business days.",
//     "cost": 25.00,
//     "estimatedDeliveryTime": "1-2 days",
//     "regionsServed": ["North America", "Europe"],
//     "carrier": "FedEx",
//     "trackingEnabled": true,
//     "dimensions": {
//       "weight": 2.5,
//       "length": 30,
//       "width": 20,
//       "height": 10,
//       "unit": "cm"
//     },
//     "createdAt": "2024-10-22T14:45:00.000Z",
//     "updatedAt": "2024-10-22T14:45:00.000Z"
//   }
