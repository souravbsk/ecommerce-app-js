const deliveryChargeSchema = new Schema({
    zone: { 
      type: Schema.Types.ObjectId, 
      ref: 'ShippingZone', 
      required: true 
    },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', // Reference to a product category
      required: true 
    },
    baseCharge: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    weightCharges: [{ 
      weightRange: { 
        min: { type: Number, required: true }, 
        max: { type: Number, required: true } 
      },
      charge: { 
        type: Number, 
        required: true, 
        min: 0 
      }
    }],
    dimensionCharges: [{ 
      dimensionRange: { 
        min: { type: Number, required: true }, // e.g., in cm
        max: { type: Number, required: true } 
      },
      charge: { 
        type: Number, 
        required: true, 
        min: 0 
      }
    }],
    handlingFee: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    additionalCharges: { 
      type: Number, 
      default: 0 // Charges for additional services (e.g., fragile handling)
    },
    validFrom: { 
      type: Date, 
      required: true 
    },
    validTill: { 
      type: Date, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  


//   {
//     "_id": "6492c8f5d1b6e21c4b7a56f3",
//     "zone": "6492c8e5d1b6e21c4b7a56f2", // Reference to Shipping Zone
//     "category": "6492b7f8d1b6e21c4b7a56f1", // Reference to a product category
//     "baseCharge": 5.00,
//     "weightCharges": [
//       {
//         "weightRange": { "min": 0, "max": 5 },
//         "charge": 2.00
//       },
//       {
//         "weightRange": { "min": 6, "max": 10 },
//         "charge": 4.00
//       }
//     ],
//     "dimensionCharges": [
//       {
//         "dimensionRange": { "min": 0, "max": 30 },
//         "charge": 1.00
//       },
//       {
//         "dimensionRange": { "min": 31, "max": 60 },
//         "charge": 3.00
//       }
//     ],
//     "handlingFee": 2.50,
//     "additionalCharges": 1.00,
//     "validFrom": "2024-10-01T00:00:00.000Z",
//     "validTill": "2024-12-31T23:59:59.000Z",
//     "createdAt": "2024-10-22T10:00:00.000Z",
//     "updatedAt": "2024-10-22T10:00:00.000Z"
//   }
  