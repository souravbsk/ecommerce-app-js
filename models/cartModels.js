import { Schema, model } from 'mongoose';

// Define the Cart Schema
const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Reference to the user owning this cart
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true, // Reference to the product
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Quantity must be at least 1
          default: 1,
        },
        price: {
          type: Number,
          required: true, // Price of the product at the time it was added to the cart
        },
        variant: {
          type: Schema.Types.ObjectId,
          ref: 'ProductVariant',
        },
        total: {
          type: Number,
          required: true, // Calculated as quantity * price
        },
        appliedDiscount: {
          type: {
            amount: {
              type: Number,
              default: 0, // Discount amount applied on the product
            },
            code: {
              type: String,
              trim: true, // Coupon code applied
            },
          },
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
      default: 0, // Sum of all item totals before discounts and taxes
    },
    discount: {
      type: {
        amount: {
          type: Number,
          default: 0, // Discount amount applied on the entire cart
        },
        code: {
          type: String,
          trim: true, // Coupon code applied to the entire cart
        },
      },
    },
    tax: {
      type: {
        percentage: {
          type: Number,
          default: 0, // Tax rate applied to the cart (e.g., 10%)
        },
        amount: {
          type: Number,
          default: 0, // Calculated tax amount based on subTotal and discount
        },
      },
    },
    shipping: {
      type: {
        method: {
          type: String, // Shipping method (e.g., "Standard", "Express")
        },
        cost: {
          type: Number,
          default: 0, // Cost of shipping
        },
        estimatedDelivery: {
          type: Date, // Estimated delivery date for the selected shipping method
        },
      },
    },
    total: {
      type: Number,
      required: true,
      default: 0, // Final total including discounts, taxes, and shipping
    },
    currency: {
      type: String,
      default: 'USD', // Currency for the cart, useful for international applications
    },
    status: {
      type: String,
      enum: ['Pending', 'Ordered', 'Abandoned', 'Completed'],
      default: 'Pending', // Status of the cart
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

const Cart = model('Cart', cartSchema);
export default Cart;










// {
//     "_id": "64c92e9a3dbb4c002b945b6a",
//     "user": "64b92e9a3dbb4c002b945b1d",
//     "items": [
//       {
//         "product": "64b92e9a3dbb4c002b945b2e",
//         "quantity": 2,
//         "price": 300,
//         "variant": "64b92e9a3dbb4c002b945b4e",
//         "total": 600,
//         "appliedDiscount": {
//           "amount": 50,
//           "code": "SAVE50"
//         }
//       },
//       {
//         "product": "64b92e9a3dbb4c002b945b3e",
//         "quantity": 1,
//         "price": 500,
//         "total": 500
//       }
//     ],
//     "subTotal": 1100,
//     "discount": {
//       "amount": 100,
//       "code": "FALLSALE"
//     },
//     "tax": {
//       "percentage": 10,
//       "amount": 100
//     },
//     "shipping": {
//       "method": "Standard",
//       "cost": 20,
//       "estimatedDelivery": "2024-10-30T00:00:00.000Z"
//     },
//     "total": 1120,
//     "currency": "USD",
//     "status": "Pending",
//     "createdAt": "2024-10-15T10:30:00.000Z",
//     "updatedAt": "2024-10-20T12:00:00.000Z"
//   }
  


// total = subTotal - discount.amount + tax.amount + shipping.cost
