import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  quantity: {
    type: Number,
    min: 1,
    required: true
  },

  priceSnapshot: {
    type: Number,
    required: true
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    unique: true,
    required: true,
    index: true
  },

  items: [cartItemSchema]

}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
