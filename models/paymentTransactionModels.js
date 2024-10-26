const paymentTransactionSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 // Ensure amount is non-negative 
    },
    method: { 
      type: String, 
      enum: ['credit_card', 'paypal', 'bank_transfer', 'stripe', 'apple_pay'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'], 
      default: 'pending' 
    },
    transactionId: { 
      type: String, 
      unique: true, 
      required: true, 
      trim: true 
    },
    paymentDate: { 
      type: Date, 
      default: Date.now 
    },
    currency: { 
      type: String, 
      default: 'USD' // Default currency, can be modified per transaction 
    },
    gatewayResponse: { 
      type: Object, // To store the response from the payment gateway (can be an object)
      required: false 
    },
    isRefunded: { 
      type: Boolean, 
      default: false 
    },
    refundTransactionId: { 
      type: String, 
      unique: true, 
      sparse: true // Only needed if a refund is issued 
    },
    refundAmount: { 
      type: Number, 
      min: 0, 
      default: 0 
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
//     "_id": "6492b5f6d1b6e21c4b7a56d1",
//     "order": "6492b4f5d1b6e21c4b7a56c2",  // Reference to the related Order document
//     "user": "6492b4f5d1b6e21c4b7a56b0",   // Reference to the User document
//     "amount": 59.99,
//     "method": "credit_card",
//     "status": "completed",
//     "transactionId": "txn_1HGF6j2eZvKYlo2CIUVh5mD1",
//     "paymentDate": "2024-10-22T14:30:00.000Z",
//     "currency": "USD",
//     "gatewayResponse": {
//       "status": "success",
//       "paymentMethod": "Visa",
//       "authorizationCode": "auth_123456",
//       "receiptUrl": "https://example.com/receipt/txn_1HGF6j2eZvKYlo2CIUVh5mD1"
//     },
//     "isRefunded": false,
//     "refundTransactionId": null,
//     "refundAmount": 0,
//     "createdAt": "2024-10-22T14:30:00.000Z",
//     "updatedAt": "2024-10-22T14:30:00.000Z"
//   }
  