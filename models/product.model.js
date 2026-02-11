import mongoose from "mongoose";

const dimensionSchema = new mongoose.Schema({
  length: Number,
  breadth: Number,
  width: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },

  size: String,

  stock: {
    type: Number,
    required: true,
    min: 0
  },

  lowStockThreshold: {
    type: Number,
    default: 10
  },

  dimensions: dimensionSchema,

  material: String,

  price: {
    type: Number,
    required: true
  },

  discountedPrice: Number,

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);