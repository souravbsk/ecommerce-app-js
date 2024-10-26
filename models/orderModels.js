const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      productVariant: { type: Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
      quantity: { type: Number, required: true, min: 1 },
      priceAtPurchase: { type: Number, required: true },
      appliedCoupon: { type: String, trim: true } // coupon used for this item
    }],
    totalPrice: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          return v >= 0; // Ensure total price is non-negative
        },
        message: 'Total price must be a positive number.'
      }
    },
    discount: {
      couponCode: { type: String, trim: true },
      discountAmount: { type: Number, default: 0 },
      discountPercentage: { type: Number, default: 0 }
    },
    shipping: {
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
      },
      trackingNumber: { type: String, trim: true },
      shippingMethod: { type: String, enum: ['standard', 'express', 'overnight'], required: true },
      shippingCost: { type: Number, required: true },
      shippedAt: { type: Date },
      estimatedDelivery: { type: Date },
      shippingCarrier: {
        name: { type: String },
        trackingUrl: { type: String }
      }
    },
    payment: {
      method: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer'], required: true },
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
      transactionId: { type: String, unique: true, sparse: true },
      paymentDate: { type: Date },
      paymentRetries: [{
        attemptDate: { type: Date },
        status: { type: String, enum: ['failed', 'success'] },
        reason: { type: String }
      }]
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled', 'returned'],
      default: 'pending'
    },
    orderHistory: [{
      status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled', 'returned'] },
      timestamp: { type: Date, default: Date.now },
      notes: { type: String }
    }],
    tax: {
      rate: { type: Number },
      amount: { type: Number },
      taxableItems: [{ productVariant: { type: Schema.Types.ObjectId, ref: 'ProductVariant' }, amount: Number }]
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, trim: true },
      feedbackDate: { type: Date, default: Date.now }
    },
    notes: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  