const shippingZoneSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  regions: [
    {
      type: String,
      required: true,
    },
  ], // Array of regions covered by this zone
  deliveryCharges: [
    {
      type: Schema.Types.ObjectId,
      ref: "DeliveryCharge", // Reference to Delivery Charges
    },
  ],
  handlingFee: {
    type: Number,
    default: 0,
    min: 0, // Optional handling fee for this shipping zone
  },
  weightLimit: {
    type: Number,
    min: 0, // Maximum weight limit for this zone (if applicable)
  },
  isActive: {
    type: Boolean,
    default: true, // Whether the shipping zone is active
  },
  restrictions: [
    {
      type: String, // List of restrictions (e.g., "no shipping to remote areas")
    },
  ],
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
//     "_id": "6492c8e5d1b6e21c4b7a56f2",
//     "name": "North America",
//     "regions": ["USA", "Canada", "Mexico"],
//     "deliveryCharges": [
//       "6492c8f5d1b6e21c4b7a56f3", // Reference to Delivery Charges
//       "6492c8f5d1b6e21c4b7a56f4"
//     ],
//     "handlingFee": 2.50,
//     "weightLimit": 50, // Maximum weight in kg
//     "isActive": true,
//     "restrictions": ["No shipping to remote areas"],
//     "createdAt": "2024-10-22T10:00:00.000Z",
//     "updatedAt": "2024-10-22T10:00:00.000Z"
//   }
