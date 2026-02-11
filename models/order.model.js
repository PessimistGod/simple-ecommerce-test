import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  name: String,

  quantity: Number,

  price: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
    index: true
  },

  items: [orderItemSchema],

  shippingAddress: {
    type: Object,
    required: true
  },

  subtotal: Number,
  tax: Number,
  shippingFee: Number,

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["CREATED", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "CREATED"
  },

  paymentMethod: String,

  paidAt: Date

}, { timestamps: true });

orderSchema.index({ customer: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
